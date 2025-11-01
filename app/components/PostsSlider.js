import Image from "next/image";
import Link from "next/link";

function cleanImageUrlPath(src) {
  if (!src) return "/images/placeholder.png";
  try {
    const url = src.startsWith("http") ? new URL(src).pathname : src;
    const idx = url.search(/uploads?\//i);
    const path = idx !== -1 ? url.slice(idx) : url;
    return `/${path.replace(/-\d+x\d+\./, ".").replace(/^\/+/, "")}`;
  } catch {
    return src;
  }
}

export default function PostsSlider({ posts, title }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-3 ">
      <div className="w-full max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-primary mb-8 text-center ">
            {title}
          </h2>
        )}
        <div
          className="
            flex flex-wrap justify-center 
            gap-x-4 gap-y-8 sm:gap-x-6
          "
        >
          {posts.map((post) => (
            // تغییر: به هر آیتم یک عرض پایه می‌دهیم تا Flexbox بتواند چیدمان را مدیریت کند
            <Link
              key={post.id}
              href={`/${post.slug}`}
              // این عرض‌ها معادل minmax(150px, ...) و minmax(180px, ...) در گرید قبلی هستند
              className="group flex flex-col items-start gap-3 w-[150px] sm:w-[180px]"
            >
              {/* کانتینر تصویر (بدون تغییر) */}
              <div className="relative w-full overflow-hidden rounded-xl shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                <div className="aspect-square">
                  <Image
                    src={cleanImageUrlPath(post.thumbnail)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 15vw, 180px"
                  />
                </div>
              </div>

              {/* کانتینر محتوا (بدون تغییر) */}
              <div className="flex flex-col items-start w-full">
                {post.categoryName && (
                  <span className="mb-1 text-xs font-semibold text-primary bg-muted px-2 py-0.5 rounded-full">
                    {post.categoryName}
                  </span>
                )}
                <h3
                  className="
                    !m-0 !p-0 font-bold text-foreground/90 !text-base leading-tight 
                    transition-colors duration-300 group-hover:text-primary 
                    line-clamp-2
                  "
                >
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
