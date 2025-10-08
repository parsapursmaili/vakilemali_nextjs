"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import { User, Reply } from "lucide-react";

export default function CommentItem({ comment, postId, postSlug }) {
  const [isReplying, setIsReplying] = useState(false);

  const toggleReply = () => setIsReplying((prev) => !prev);
  const handleCancelReply = () => setIsReplying(false);

  return (
    <div
      className={`p-5 rounded-lg border-l-4 border-l-primary/50 dark:border-l-primary/50 transition-shadow ${
        comment.parent_id
          ? "mr-6 md:mr-10 bg-muted/20 dark:bg-muted/30 shadow-sm"
          : "bg-muted/50 dark:bg-muted/70 shadow-md"
      }`}
    >
      {/* هدر */}
      <div className="flex justify-between items-start mb-3 border-b border-primary/10 pb-2">
        <div className="flex items-center">
          <User className="w-5 h-5 ml-2 text-primary dark:text-primary-light" />
          <strong
            className={`font-extrabold ${
              comment.parent_id ? "text-primary" : "text-primary-light"
            }`}
          >
            {comment.author_name}
          </strong>
        </div>
        <span className="text-xs text-foreground/50">
          {new Date(comment.created_at).toLocaleDateString("fa-IR")}
        </span>
      </div>

      {/* محتوا */}
      <p className="text-foreground/90 mb-4 leading-relaxed text-justify">
        {comment.content}
      </p>

      {/* دکمه پاسخ */}
      <div className="flex justify-end">
        <button
          onClick={toggleReply}
          className="flex items-center text-sm text-accent hover:text-primary transition-colors font-semibold"
        >
          <Reply className="w-4 h-4 ml-1" />
          {isReplying ? "بستن لایحه پاسخ" : "پاسخ به این نظر"}
        </button>
      </div>

      {/* فرم پاسخ */}
      {isReplying && (
        <div className="mt-4 pt-4">
          <CommentForm
            postId={postId}
            parentCommentId={comment.id}
            postSlug={postSlug}
            onCancelReply={handleCancelReply}
          />
        </div>
      )}

      {/* پاسخ‌های تو در تو */}
      {comment.replies?.length > 0 && (
        <div className="mt-6 space-y-4 border-t-2 border-primary/20 pt-6">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postSlug={postSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
