"use client";

import { useState, useEffect, useCallback } from "react";
import { getCommentsData } from "@/[slug]/comments"; // Server Action کامنت‌ها
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function PostCommentsSection({ postId, postSlug }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 تابع برای واکشی مجدد داده‌ها (پس از ثبت کامنت یا لود اولیه)
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const fetchedComments = await getCommentsData(postId);
    setComments(fetchedComments);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // نمایش تعداد کامنت‌هایی که status آن‌ها 'approved' است
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

      {/* فرم ثبت کامنت اصلی */}
      <CommentForm
        postId={postId}
        postSlug={postSlug}
        parentCommentId={null}
        onCommentSubmitted={fetchComments}
      />

      {/* لیست کامنت‌ها */}
      <div className="mt-10 space-y-6">
        {isLoading ? (
          <p className="text-center text-foreground/70 text-lg py-10">
            در حال بررسی سوابق و بارگذاری نظرات... ⏳
          </p>
        ) : comments.length === 0 ? (
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
              onCommentSubmitted={fetchComments}
            />
          ))
        )}
      </div>
    </section>
  );
}
