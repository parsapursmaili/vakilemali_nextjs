import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Tag, User, Eye } from "lucide-react";
import parse from "html-react-parser";
import ConsultationCTA from "@/components/ConsultationCTA";

// بخش ایمپورت‌ها: توابع و کامپوننت‌های مورد نیاز
import { getPostData, getRelatedPosts } from "./post";
import PostsSlider from "@/components/PostsSlider";

// بارگذاری داینامیک کامپوننت‌ها برای بهینه‌سازی
const PostViews = dynamic(() => import("@/components/PostViews"), {
  loading: () => (
    <div className="text-sm text-foreground/70 flex items-center">
      <Eye className="w-4 h-4 ml-1 text-primary/70" /> بارگذاری بازدیدها...
    </div>
  ),
});

const PostCommentsSection = dynamic(
  () => import("@/components/PostCommentsSection"),
  {
    loading: () => (
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        در حال بارگذاری بخش نظرات...
      </div>
    ),
  }
);

// تابع کمکی برای پاکسازی URL تصویر
function cleanImageUrlPath(src) {
  if (!src) return undefined;
  try {
    const url = src.startsWith("http") ? new URL(src).pathname : src;
    const idx = url.search(/uploads?\//i);
    const path = idx !== -1 ? url.slice(idx) : url;
    return `/${path.replace(/-\d+x\d+\./, ".").replace(/^\/+/, "")}`;
  } catch {
    return src;
  }
}

// تولید متادیتای صفحه برای سئو
export async function generateMetadata({ params }) {
  const { slug } = params;
  const { post } = await getPostData(params.slug);
  if (!post) notFound();

  const excerpt =
    post.excerpt ||
    (post.content ? post.content.substring(0, 150) + "..." : "");
  const image = post.thumbnail
    ? cleanImageUrlPath(post.thumbnail)
    : "/images/default-social.jpg";

  return {
    title: post.title,
    description: excerpt,
    openGraph: { images: [image] },
    alternates: { canonical: `/${slug}` },
    keywords: post.tags?.map((t) => t.name).join(", "),
  };
}

// کامپوننت اصلی صفحه پست تکی
export default async function SinglePostPage({ params }) {
  const slug = params.slug;

  // بخش دریافت داده‌ها از سرور
  const { post, terms } = await getPostData(slug);
  if (!post) notFound();

  const categories = terms.filter((t) => t.type === "category");
  const tags = terms.filter((t) => t.type === "tag");
  const primaryCategory = categories.length > 0 ? categories[0] : null;

  const { posts: relatedPosts } = await getRelatedPosts({
    limit: 4,
    excludeId: post.id,
    categoryId: primaryCategory ? primaryCategory.id : null,
  });

  // پردازش محتوای HTML برای نمایش صحیح تصاویر
  const content = parse(String(post.content || ""), {
    replace: (node) => {
      if (node.name === "img") {
        const { src, alt } = node.attribs;
        const cleaned = cleanImageUrlPath(src);
        return (
          <div className="my-6 overflow-hidden rounded-xl !mx-auto">
            <Image
              src={cleaned}
              alt={alt || ""}
              width={1200}
              height={600}
              className="w-full h-auto object-cover rounded-xl shadow-md !mx-auto"
              sizes="(max-width:768px) 100vw, 800px"
            />
          </div>
        );
      }
    },
  });

  return (
    <main className="w-full !p-0">
      {/* بخش اصلی محتوای مقاله */}
      <article
        className="
          w-full sm:max-w-4xl sm:mx-auto
          sm:bg-white sm:dark:bg-[#1a1a1a]
          sm:shadow-xl sm:rounded-xl sm:border sm:border-muted/30
          transition-all duration-300
          sm:p-8 p-0
        "
      >
        {console.log("src:", post.thumbnail)}
        {post.thumbnail && (
          <div className="w-full p-2 sm:p-3">
            <div className="overflow-hidden rounded-2xl border border-muted/30 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image
                src={cleanImageUrlPath(post.thumbnail)}
                alt={post.title}
                width={1200}
                height={900}
                className="w-full object-cover aspect-[4/3]"
                priority
              />
            </div>
          </div>
        )}

        <header className="!px-4 sm:!px-0 pt-6 pb-4 border-b border-muted/30 dark:border-muted/40">
          <h1 className="font-bold text-primary leading-tight mb-4 text-3xl md:text-4xl sm:text-3xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70 border-t pt-3">
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
                    {i < categories.length - 1 && "،"}
                  </Link>
                ))}
              </span>
            )}
            <PostViews postId={post.id} initialViews={post.view_count} />
          </div>
        </header>
        <ConsultationCTA />
        <section className="text-foreground/90 leading-relaxed text-justify !px-4 sm:!px-0 py-6">
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
          <footer className="border-t border-muted/30 dark:border-muted/40 !px-4 sm:!px-0 pt-4 pb-6">
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

      <div className=" w-full sm:max-w-4xl sm:mx-auto">
        <PostsSlider title="مطالب مرتبط" posts={relatedPosts} />
      </div>

      {/* بخش نظرات */}
      <div className=" mb-10 w-full px-0 sm:max-w-4xl sm:mx-auto mt-10">
        <PostCommentsSection postId={post.id} postSlug={slug} />
      </div>
    </main>
  );
}
