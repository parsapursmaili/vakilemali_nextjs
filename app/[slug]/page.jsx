import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, FolderOpen, User, List } from "lucide-react";
import ConsultationCTA from "@/components/ConsultationCTA";
import FloatingCTA from "@/components/FloatingCTA";
import LazyVideoEmbed from "./LazyVideoEmbed";
import { getPostData, getRelatedPosts } from "./post";
import PostsSlider from "@/components/PostsSlider";
import PostViews from "@/components/PostViews";
import PostCommentsSection from "@/components/PostCommentsSection";
import PostSchemaScript from "./PostSchemaScript";
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

function processContentAndExtractTOC(html) {
  if (!html) return { finalHtml: "", toc: [] };

  const protectedRegex =
    /(<table[\s\S]*?<\/table>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>)/gi;
  const parts = html.split(protectedRegex);

  const processedParts = parts.map((p) => {
    if (p.match(protectedRegex)) return p;
    const t = p.trim();
    if (!t) return "";
    return `<p>${t.replace(/\n+/g, "</p><p>")}</p>`;
  });

  let content = processedParts.join("").replace(/<p>\s*<\/p>/g, "");

  content = content.replace(/<h1/g, "<h2").replace(/<\/h1>/g, "</h2>");

  const toc = [];
  const finalHtml = content.replace(
    /<h([2-3])(.*?)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, "");
      const id = `toc-${toc.length}`;
      toc.push({ id, text: cleanText, level: parseInt(level) });
      return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
    }
  );

  return { finalHtml, toc };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { post, terms } = await getPostData(params.slug);
  if (!post) notFound();

  const postUrl = `/${params.slug}`;
  const organizationUrl = "https://vakilemali.com";
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
    keywords: terms?.map((t) => t.name).join(", "),
    alternates: { canonical: `${organizationUrl}${postUrl}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: "وکیل مالی",
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
      title: post.title,
      description,
      images: [absoluteImageUrl],
    },
    viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
  };
}

export default async function SinglePostPage({ params }) {
  const slug = params.slug;
  const { post, terms } = await getPostData(slug);
  if (!post) notFound();

  const categories = terms;
  const primaryCategory = categories[0] || null;

  const { posts: relatedPosts } = await getRelatedPosts({
    limit: 4,
    excludeId: post.id,
    categoryId: primaryCategory?.id,
  });

  const { finalHtml, toc } = processContentAndExtractTOC(post.content);

  const CTA_PHONE_NUMBER = "۰۹۰۰ ۲۴۵ ۰۰۹۰";
  const CTA_TELEGRAM_ID = "vakile_mali";
  const displayDate = post.updated_at || post.created_at;

  return (
    <>
      <PostSchemaScript
        post={post}
        terms={terms}
        slug={slug}
        cleanImageUrlPath={cleanImageUrlPath}
      />
      {console.log("salam")}
      <main className="w-full !p-0">
        <article className="w-full sm:max-w-4xl sm:mx-auto bg-white dark:bg-[#1a1a1a] sm:shadow-md sm:rounded-2xl sm:border sm:border-muted/20 px-4 py-8 sm:px-10 sm:py-12">
          {post.thumbnail && (
            <div className="w-full mb-10 flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl">
                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0f0f0f] shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="aspect-square w-full relative">
                    <Image
                      src={cleanImageUrlPath(post.thumbnail)}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 500px, 640px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 ring-4 ring-transparent group-hover:ring-primary/20 transition-all duration-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <header className="mb-8">
            {categories.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm text-secondary font-medium">
                <FolderOpen className="w-4 h-4" />
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/articles?category=${cat.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                    {i < categories.length - 1 && "، "}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-extrabold text-foreground leading-tight text-3xl md:text-4xl mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6 border-muted/20">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <time dateTime={displayDate}>
                  {new Date(displayDate).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex items-center gap-1">
                <PostViews postId={post.id} initialViews={post.view_count} />
              </div>

              <span className="hidden sm:inline-block w-1 h-1 bg-muted-foreground/30 rounded-full" />

              <span className="flex items-center gap-1">
                <User className="w-4 h-4 opacity-70" />
                <span>مرضیه توانگر</span>
              </span>
            </div>
          </header>

          {post.video_link && (
            <div className="w-full mb-10 rounded-xl overflow-hidden">
              <LazyVideoEmbed embedHtml={post.video_link} />
            </div>
          )}

          {toc.length > 0 && (
            <nav className="mb-10 p-6 bg-muted/20 dark:bg-muted/5 border border-muted/30 rounded-xl">
              <div className="flex items-center gap-2 mb-4 text-foreground font-bold text-lg">
                <List className="w-5 h-5 text-primary" />
                <span>فهرست مطالب</span>
              </div>
              <ul className="space-y-3 pr-2">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={`${
                      item.level === 3
                        ? "mr-4 text-sm"
                        : "text-base font-medium"
                    }`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="text-foreground leading-loose text-justify">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose dark:prose-invert prose-blue rtl max-w-none
                  prose-headings:font-bold prose-headings:text-primary 
                  prose-headings:scroll-mt-24
                  prose-h2:text-2xl prose-h3:text-xl 
                  prose-p:leading-[2.1] prose-p:text-[17.5px] 
                  md:prose-p:text-[18px] md:prose-p:leading-[2.2]
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline 
                  [&_img]:hidden [&_figure]:hidden
                  max-w-prose
                  lg:max-w-3xl
                "
                dangerouslySetInnerHTML={{ __html: finalHtml }}
              />
            </div>
          </div>
        </article>

        <div className="w-full sm:max-w-4xl sm:mx-auto mt-10 px-4 sm:px-0 space-y-12 mb-20">
          <ConsultationCTA
            phoneNumber={CTA_PHONE_NUMBER}
            telegramId={CTA_TELEGRAM_ID}
          />
          <PostsSlider title="مطالب پیشنهادی" posts={relatedPosts} />
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
