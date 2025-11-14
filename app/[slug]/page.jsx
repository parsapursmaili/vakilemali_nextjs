import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Tag, User } from "lucide-react";
import parse from "html-react-parser";

// ایمپورت CTAها
import ConsultationCTA from "@/components/ConsultationCTA";
import FloatingCTA from "@/components/FloatingCTA";

import { getPostData, getRelatedPosts } from "./post";
import PostsSlider from "@/components/PostsSlider";
import PostViews from "@/components/PostViews";
import PostCommentsSection from "@/components/PostCommentsSection";
import PostSchemaScript from "./PostSchemaScript";

// ========================== Helper Functions ==========================

function cleanImageUrlPath(src) {
  if (!src) return undefined;
  try {
    const url = src.startsWith("http") ? new URL(src).pathname : src;
    const idx = url.search(/uploads?\//i);
    let path = idx !== -1 ? url.slice(idx) : url;
    path = path.replace(/-\d+x\d+\./, ".");
    return `/${path.replace(/^\/+/, "")}`;
  } catch {
    return src;
  }
}

/** پاکسازی و تبدیل h1 به h2 برای سئو */
function processContentSmartly(html) {
  if (!html) return "";
  const protectedBlocksRegex =
    /(<table[\s\S]*?<\/table>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>)/gi;
  const parts = html.split(protectedBlocksRegex);

  const processedParts = parts.map((part) => {
    if (part.match(protectedBlocksRegex)) {
      return part;
    } else {
      const trimmedPart = part.trim();
      if (trimmedPart === "") return "";
      return `<p>${trimmedPart.replace(/\n+/g, "</p><p>")}</p>`;
    }
  });

  let finalHtml = processedParts.join("");
  finalHtml = finalHtml.replace(/<p>\s*<\/p>/g, "");

  // ✅ تبدیل h1 به h2
  finalHtml = finalHtml.replace(/<h1/g, "<h2").replace(/<\/h1>/g, "</h2>");

  return finalHtml;
}

// ========================== Metadata ==========================

export async function generateMetadata({ params }) {
  const { post, terms } = await getPostData(params.slug);
  if (!post) notFound();

  const postUrl = `/${params.slug}`;
  const organizationName = "وکیل مالی";
  const organizationUrl = "https://vakilemali.com"; // ✅ اصلاح دامنه
  const authorName = "مرضیه توانگر";

  const description =
    post.excerpt ||
    (post.content
      ? post.content.substring(0, 150).replace(/<[^>]*>?/gm, "") + "..."
      : post.title);

  const image = post.thumbnail
    ? cleanImageUrlPath(post.thumbnail)
    : "/logo.png";
  const absoluteImageUrl = `${organizationUrl}${image}`;

  return {
    title: post.title,
    description,
    keywords: post.tags?.map((t) => t.name).join(", "),
    alternates: { canonical: `${organizationUrl}${postUrl}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: organizationName,
      locale: "fa_IR",
      type: "article",
      images: [
        { url: absoluteImageUrl, width: 1200, height: 630, alt: post.title },
      ],
      article: {
        publishedTime: new Date(post.created_at).toISOString(),
        modifiedTime: new Date(
          post.updated_at || post.created_at
        ).toISOString(),
        author: [authorName],
      },
    },
    twitter: {
      card: "summary_large_image",
      site: "@YourTwitterHandle",
      creator: "@AuthorTwitterHandle",
      title: post.title,
      description,
      images: [absoluteImageUrl],
    },
    viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
  };
}

// ========================== Page Component ==========================

export default async function SinglePostPage({ params }) {
  const slug = params.slug;
  const { post, terms } = await getPostData(slug);
  if (!post) notFound();

  const categories = terms.filter((t) => t.type === "category");
  const tags = terms.filter((t) => t.type === "tag");
  const primaryCategory = categories[0] || null;

  const { posts: relatedPosts } = await getRelatedPosts({
    limit: 4,
    excludeId: post.id,
    categoryId: primaryCategory?.id,
  });

  const processedHtml = processContentSmartly(post.content);
  const content = parse(String(processedHtml || ""), {
    replace: (node) => (node.name === "img" ? <></> : node),
  });

  const CTA_PHONE_NUMBER = "۰۹۰۰ ۲۴۵ ۰۰۹۰";
  const CTA_TELEGRAM_ID = "your_telegram_id";

  return (
    <>
      <PostSchemaScript
        post={post}
        terms={terms}
        slug={slug}
        cleanImageUrlPath={cleanImageUrlPath}
      />
      <main className="w-full !p-0">
        <article
          className="
            w-full sm:max-w-4xl sm:mx-auto
            sm:bg-white sm:dark:bg-[#1a1a1a]
            sm:shadow-xl sm:rounded-xl sm:border sm:border-muted/30
            transition-all duration-300
            sm:p-8 p-0
          "
        >
          {post.thumbnail && (
            <div className="w-full p-4 sm:p-6 flex justify-center">
              <div
                className="
                  w-72 h-72 sm:w-80 sm:h-80 flex-shrink-0 relative
                  rounded-3xl shadow-xl shadow-primary/30 dark:shadow-primary/50
                  transition-all duration-500 ease-in-out
                  hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/50 dark:hover:shadow-primary/70
                "
              >
                <div
                  className="
                    w-full h-full rounded-3xl overflow-hidden 
                    shadow-inner shadow-muted/50 dark:shadow-muted/30
                    border-4 border-background dark:border-background 
                    ring-4 ring-primary/40 dark:ring-primary/60
                  "
                >
                  <Image
                    src={cleanImageUrlPath(post.thumbnail)}
                    alt={post.title}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover aspect-square"
                    priority
                    sizes="(max-width: 640px) 18rem, 20rem"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ✅ تغییر !px-4 به !px-3 برای کاهش پدینگ موبایل در header */}
          <header className="!px-3 sm:!px-0 pt-6 pb-4 border-b border-muted/30 dark:border-muted/40">
            <h1 className="font-bold text-primary leading-tight mb-4 text-3xl md:text-4xl sm:text-3xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80 border-t pt-3">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-info" /> نوشته‌ی{" "}
                <strong className="text-foreground/90">مرضیه توانگر</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-accent" />
                {new Date(post.created_at).toLocaleDateString("fa-IR")}
              </span>
              {categories.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4 text-secondary" />
                  {categories.map((cat, i) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="text-primary hover:underline"
                    >
                      {cat.name}
                      {i < categories.length - 1 ? "،" : ""}
                    </Link>
                  ))}
                </span>
              )}
            </div>
            <PostViews postId={post.id} initialViews={post.view_count} />
          </header>

          {/* ✅ تغییر !px-4 به !px-3 برای کاهش پدینگ موبایل در content section */}
          <section className="text-foreground leading-relaxed text-justify !px-3 sm:!px-0 py-6">
            <div
              className="
                prose dark:prose-invert prose-blue rtl
                max-w-none prose-headings:font-bold
                prose-h1:!text-2xl sm:prose-h1:!text-3xl
                prose-h2:!text-xl sm:prose-h2:!text-2xl
                prose-h3:!text-lg sm:prose-h3:!text-xl
                prose-p:!my-3
                sm:prose-ul:!pr-6 sm:prose-ol:!pr-6
                prose-ul:!pr-0 prose-ol:!pr-0
                prose-li:!mr-0 prose-li:!pr-0
                prose-p:!leading-[1.9]
              "
            >
              {content}
            </div>
          </section>

          {tags.length > 0 && (
            /* ✅ تغییر !px-4 به !px-3 برای کاهش پدینگ موبایل در footer */
            <footer className="border-t border-muted/30 dark:border-muted/40 !px-3 sm:!px-0 pt-4 pb-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-semibold">برچسب‌ها:</span>
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="text-xs bg-muted/70 dark:bg-muted/40 hover:bg-muted transition-colors px-3 py-1 rounded-full text-primary font-medium"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </footer>
          )}
        </article>

        <div className="w-full sm:max-w-4xl sm:mx-auto">
          <ConsultationCTA
            phoneNumber={CTA_PHONE_NUMBER}
            telegramId={CTA_TELEGRAM_ID}
          />
        </div>
        <div className="w-full sm:max-w-4xl sm:mx-auto">
          <PostsSlider title="مطالب مرتبط" posts={relatedPosts} />
        </div>
        <div className="mb-20 w-full px-0 sm:max-w-4xl sm:mx-auto mt-10">
          <PostCommentsSection postId={post.id} postSlug={slug} />
        </div>
      </main>

      <FloatingCTA
        phoneNumber={CTA_PHONE_NUMBER}
        telegramId={CTA_TELEGRAM_ID}
      />
    </>
  );
}
