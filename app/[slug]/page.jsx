import { getPostData } from "./post";
import PostViews from "@/components/PostViews";
import PostCommentsSection from "@/components/PostCommentsSection";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import parse from "html-react-parser";

export const revalidate = 3600;

// 🧠 تابع کمکی برای پردازش مسیر تصویر — نسخه سازگار با مسیر /media
function processImageUrlForMedia(
  originalSrc,
  defaultWidth = 1200,
  defaultQuality = 75
) {
  if (!originalSrc) return undefined;

  try {
    let finalPathSegment = originalSrc;

    // اگر تصویر از وردپرس با http یا https بیاد
    if (
      originalSrc.startsWith("http://") ||
      originalSrc.startsWith("https://")
    ) {
      const url = new URL(originalSrc);

      if (url.pathname.includes("/uploads/")) {
        // فقط مسیر بعد از uploads/ را جدا می‌کنیم
        const pathAfterUploads = url.pathname.split("/uploads/")[1];

        // حذف suffix ابعاد مثل -300x169
        const parts = pathAfterUploads.split("/");
        const filename = parts.pop();
        const cleanedFilename = filename.replace(/-\d+x\d+\./, ".");
        finalPathSegment = [...parts, cleanedFilename].join("/");
      } else {
        finalPathSegment = url.pathname.slice(1);
      }
    } else if (originalSrc.includes("/uploads/")) {
      // اگر مسیر نسبی باشد
      const idx = originalSrc.search(/uploads?\//i);
      if (idx !== -1) {
        finalPathSegment = originalSrc.slice(
          idx + (originalSrc[idx + 7] === "s" ? 8 : 7)
        );
      }
    }

    // رمزگذاری مسیر
    const encodedPath = finalPathSegment
      .split("/")
      .map(encodeURIComponent)
      .join("/");

    // مسیر جدید از route handler /media
    return `/media/${encodedPath}?w=${defaultWidth}&q=${defaultQuality}`;
  } catch (error) {
    console.error("Error processing image URL:", error);
    return originalSrc;
  }
}

// 🧠 متادیتا برای SEO و OpenGraph
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const { post } = await getPostData(slug);

  if (!post) notFound();

  const excerpt =
    post.excerpt ||
    (typeof post.content === "string" && post.content
      ? post.content.substring(0, 150) + "..."
      : "توضیحات پیش‌فرض");

  const ogImageUrl = post.thumbnail
    ? processImageUrlForMedia(post.thumbnail, 1200, 75)
    : "/images/default-social.jpg";

  return {
    title: post.title || "عنوان پیش‌فرض",
    description: excerpt,
    openGraph: {
      images: [ogImageUrl],
    },
  };
}

// 🧱 صفحه اصلی پست
export default async function SinglePostPage({ params }) {
  const slug = await params.slug;
  const { post, terms } = await getPostData(slug);

  if (!post) notFound();

  const rawContent = String(post.content || "");
  const categories = terms.filter((t) => t.type === "category");
  const tags = terms.filter((t) => t.type === "tag");

  // 🧩 تبدیل محتوای HTML به JSX
  const parsedContent = parse(rawContent, {
    replace: (domNode) => {
      if (domNode.name === "img") {
        const { src, alt, width, height } = domNode.attribs;
        const processedSrc = processImageUrlForMedia(
          src,
          parseInt(width) || 800,
          75
        );

        return (
          <div className="my-6 rounded-lg overflow-hidden relative w-full h-auto">
            <Image
              src={processedSrc}
              alt={alt || "تصویر"}
              width={parseInt(width) || 800}
              height={parseInt(height) || 500}
              className="rounded-lg mx-auto object-cover"
            />
          </div>
        );
      }
    },
  });

  const thumbnailSrc = processImageUrlForMedia(post.thumbnail, 1200, 75);

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <article className="bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-xl overflow-hidden border-2 border-primary/10 transition-colors">
        {thumbnailSrc && (
          <Image
            src={thumbnailSrc}
            alt={post.title || "تصویر شاخص"}
            width={1200}
            height={600}
            className="w-full h-96 object-cover object-center shadow-inner-lg"
            priority
          />
        )}

        <header className="p-6 md:p-10 border-b border-muted dark:border-muted/30">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-primary dark:text-primary-light">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-foreground/70 justify-between mt-4 border-t pt-4 dark:border-muted/50">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="flex items-center">
                <Clock className="w-4 h-4 ml-1 text-accent" />
                تاریخ انتشار:{" "}
                {new Date(post.created_at).toLocaleDateString("fa-IR")}
              </span>

              {categories.length > 0 && (
                <span className="flex items-center">
                  <Tag className="w-4 h-4 ml-1 text-secondary" />
                  دسته:
                  {categories.map((cat, index) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="mr-1 hover:underline text-primary"
                    >
                      {cat.name}
                      {index < categories.length - 1 ? "،" : ""}
                    </Link>
                  ))}
                </span>
              )}
            </div>

            <PostViews postId={post.id} initialViews={post.view_count} />
          </div>
        </header>

        <section className="post-content p-6 md:p-10 text-foreground/90 text-justify">
          <div className="prose prose-lg dark:prose-invert prose-blue max-w-none rtl">
            {parsedContent}
          </div>
        </section>

        {tags.length > 0 && (
          <footer className="p-6 md:p-10 border-t border-muted dark:border-muted/30">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold text-foreground">برچسب‌ها:</span>
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="text-xs bg-muted/70 hover:bg-muted dark:bg-muted/50 dark:hover:bg-muted transition-colors px-3 py-1 rounded-full text-primary font-medium"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </article>

      <div className="mt-12">
        <PostCommentsSection postId={post.id} postSlug={slug} />
      </div>
    </main>
  );
}
