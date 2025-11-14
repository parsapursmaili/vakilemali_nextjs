import mysql from "mysql2/promise"; // تغییر require به import
import { URL } from "node:url"; // تغییر require به import و استفاده از پیشوند node: برای ماژول‌های داخلی

async function migrateData() {
  let oldDb, newDb;

  try {
    // اتصال به هر دو دیتابیس
    oldDb = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vakilemali_old",
    });
    console.log("Connected to old WordPress database. 🟢");

    newDb = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vakilemali",
    });
    console.log("Connected to new Next.js database. 🟢");

    // 1. انتقال پست‌ها و تصاویر شاخص (Thumbnails)
    console.log("Migrating posts and their thumbnails... 📝");
    const [oldPosts] = await oldDb.execute(`
      SELECT
        p.ID,
        p.post_title,
        p.post_name,
        p.post_content,
        p.post_excerpt,
        p.post_date,
        p.post_status,
        p.post_type,
        (SELECT meta_value FROM wp_postmeta WHERE post_id = p.ID AND meta_key = 'rank_math_total_views' LIMIT 1) as view_count,
        (SELECT guid FROM wp_posts WHERE post_type = 'attachment' AND ID = (SELECT meta_value FROM wp_postmeta WHERE post_id = p.ID AND meta_key = '_thumbnail_id')) as thumbnail_url
      FROM wp_posts p
      WHERE p.post_status = 'publish' AND p.post_type IN ('post', 'page')
    `);

    for (const post of oldPosts) {
      // تبدیل آدرس کامل تصویر به آدرس نسبی و دیکد کردن نام فایل
      let relativeThumbnailPath = null;
      if (post.thumbnail_url) {
        try {
          // توجه: اگر post.thumbnail_url یک رشته کامل URL نباشد، این قسمت خطا می‌دهد.
          const urlObj = new URL(post.thumbnail_url);
          const uploadDirPattern = "/wp-content/uploads/";
          const startIndex = urlObj.pathname.indexOf(uploadDirPattern);
          if (startIndex !== -1) {
            // استخراج مسیر نسبی
            let filePath = urlObj.pathname.substring(
              startIndex + uploadDirPattern.length
            );
            // دیکد کردن کاراکترهای فارسی در نام فایل
            relativeThumbnailPath = decodeURIComponent(filePath);
          }
        } catch (e) {
          // اگر URL معتبر نباشد (مثلاً فقط یک مسیر نسبی باشد)، اینجا خطا مدیریت می‌شود.
          // اگر مطمئن هستید که همیشه یک URL کامل است، این خطا را نادیده بگیرید.
          // در غیر این صورت، می‌توانید فرض کنید مسیر ورودی، مسیر آپلود است:
          if (!post.thumbnail_url.startsWith("http")) {
            relativeThumbnailPath = decodeURIComponent(
              post.thumbnail_url.replace(/.*\/uploads\//, "")
            );
          } else {
            console.error(
              `Error parsing URL for post ID ${post.ID}:`,
              e.message
            );
          }
        }
      }

      // دیکد کردن اسلاگ
      const decodedSlug = decodeURIComponent(post.post_name);

      await newDb.execute(
        `
        INSERT INTO posts (id, title, slug, content, excerpt, thumbnail, created_at, status, type, view_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title=VALUES(title), content=VALUES(content), excerpt=VALUES(excerpt), thumbnail=VALUES(thumbnail), updated_at=NOW(), status=VALUES(status), view_count=VALUES(view_count)
        `,
        [
          post.ID,
          post.post_title,
          decodedSlug,
          post.post_content,
          post.post_excerpt,
          relativeThumbnailPath,
          post.post_date,
          post.post_status === "publish" ? "published" : "draft",
          post.post_type,
          post.view_count || 0,
        ]
      );
    }
    console.log(`Migrated ${oldPosts.length} posts. ✅`);

    // 2. انتقال دسته‌بندی‌ها و برچسب‌ها (Terms)
    console.log("Migrating terms... 🏷️");
    const [oldTerms] = await oldDb.execute(`
      SELECT
        t.term_id,
        t.name,
        t.slug,
        tt.taxonomy
      FROM wp_terms t
      JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
      WHERE tt.taxonomy IN ('category', 'post_tag')
    `);

    for (const term of oldTerms) {
      // دیکد کردن اسلاگ
      const decodedSlug = decodeURIComponent(term.slug);

      await newDb.execute(
        `
        INSERT INTO terms (id, name, slug, type)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name=VALUES(name), type=VALUES(type)
        `,
        [
          term.term_id,
          term.name,
          decodedSlug,
          term.taxonomy === "post_tag" ? "tag" : "category",
        ]
      );
    }
    console.log(`Migrated ${oldTerms.length} terms. ✅`);

    // 3. انتقال روابط پست و دسته‌بندی/برچسب
    console.log("Migrating post-term relationships... 🔗");
    const [oldRelationships] = await oldDb.execute(`
      SELECT tr.object_id, tr.term_taxonomy_id FROM wp_term_relationships tr
      JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
      WHERE tt.taxonomy IN ('category', 'post_tag')
    `);

    for (const rel of oldRelationships) {
      await newDb.execute(
        `
        INSERT IGNORE INTO post_terms (post_id, term_id)
        VALUES (?, ?)
        `,
        [rel.object_id, rel.term_taxonomy_id]
      );
    }
    console.log(`Migrated ${oldRelationships.length} relationships. ✅`);

    // 4. انتقال نظرات (Comments)
    console.log("Migrating comments... 💬");
    const [oldComments] = await oldDb.execute(`
      SELECT
        comment_ID,
        comment_post_ID,
        comment_parent,
        comment_author,
        comment_author_email,
        comment_content,
        comment_date,
        comment_approved
      FROM wp_comments
      WHERE comment_type = 'comment'
    `);

    for (const comment of oldComments) {
      await newDb.execute(
        `
        INSERT INTO comments (id, post_id, parent_id, author_name, author_email, content, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        content=VALUES(content), status=VALUES(status)
        `,
        [
          comment.comment_ID,
          comment.comment_post_ID,
          comment.comment_parent || null,
          comment.comment_author,
          comment.comment_author_email,
          comment.comment_content,
          comment.comment_date,
          comment.comment_approved === "1" ? "approved" : "pending",
        ]
      );
    }
    console.log(`Migrated ${oldComments.length} comments. ✅`);

    // تنظیم AUTO_INCREMENT برای جداول جدید
    console.log("Updating auto-increment values... 🔢");
    const [postsMaxId] = await newDb.execute(
      "SELECT MAX(id) as maxId FROM posts"
    );
    if (postsMaxId[0].maxId) {
      await newDb.execute(
        `ALTER TABLE posts AUTO_INCREMENT = ${postsMaxId[0].maxId + 1}`
      );
    }

    const [termsMaxId] = await newDb.execute(
      "SELECT MAX(id) as maxId FROM terms"
    );
    if (termsMaxId[0].maxId) {
      await newDb.execute(
        `ALTER TABLE terms AUTO_INCREMENT = ${termsMaxId[0].maxId + 1}`
      );
    }

    const [commentsMaxId] = await newDb.execute(
      "SELECT MAX(id) as maxId FROM comments"
    );
    if (commentsMaxId[0].maxId) {
      await newDb.execute(
        `ALTER TABLE comments AUTO_INCREMENT = ${commentsMaxId[0].maxId + 1}`
      );
    }

    console.log("Auto-increment values updated successfully. ✅");
    console.log("Migration completed successfully! 🎉");
  } catch (err) {
    console.error("Migration failed: ❌", err.message);
  } finally {
    if (oldDb) oldDb.end();
    if (newDb) newDb.end();
    console.log("Database connections closed.");
  }
}

migrateData();
