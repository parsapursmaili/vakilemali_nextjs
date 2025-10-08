// ❌ دیگه نیازی به "use client" نیست
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { getCommentsData } from "@/[slug]/comments"; // همون Server Action

export default async function PostCommentsSection({ postId, postSlug }) {
  // ✅ مستقیم در سرور دیتا رو بگیر
  const comments = await getCommentsData(postId);

  const totalComments =
    comments.length + comments.reduce((sum, c) => sum + c.replies.length, 0);

  return (
    <section
      id="comments"
      className="bg-muted/30 dark:bg-muted/50 p-6 md:p-8 rounded-xl shadow-inner-lg transition-colors"
    >
      <h2 className="text-3xl font-bold mb-8 border-b-4 border-secondary/50 pb-3 text-primary dark:text-primary-light">
        نظرات حقوقی ({new Intl.NumberFormat("fa-IR").format(totalComments)})
      </h2>

      {/* فرم ثبت نظر */}
      <CommentForm postId={postId} postSlug={postSlug} parentCommentId={null} />

      {/* لیست کامنت‌ها */}
      <div className="mt-10 space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-foreground/70 text-lg py-10">
            هیچ نظری ثبت نشده است. اولین نظر حقوقی را شما ثبت کنید! 💬
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postSlug={postSlug}
            />
          ))
        )}
      </div>
    </section>
  );
}
