import Image from "next/image";
import Link from "next/link";

export default function PostsSlider({ posts, title }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-3">
      <div className="w-full max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
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
            <Link
              key={post.id}
              href={`/${post.slug}`}
              // Responsive card sizing: Ensures 2 items per row on mobile while limiting max width
              className="group flex flex-col items-start gap-3 w-[calc(50%-10px)] max-w-[150px] sm:w-[180px]"
            >
              {/* Image Container */}
              <div className="relative w-full overflow-hidden rounded-xl shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                <div className="aspect-square">
                  {post.thumbnail ? (
                    <Image
                      src={`/uploads/${post.thumbnail}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 30vw, (max-width: 1200px) 15vw, 180px"
                    />
                  ) : (
                    // Fallback placeholder when no thumbnail is available
                    <div
                      className="
                        w-full h-full 
                        bg-gray-100 dark:bg-gray-800 
                        flex items-center justify-center
                        text-gray-400 dark:text-gray-600
                        transition-colors duration-300
                        group-hover:bg-gray-200 dark:group-hover:bg-gray-700
                      "
                      title="No Image Available"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-1/3 w-1/3 opacity-70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-12 5h8a2 2 0 002-2v-8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
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
