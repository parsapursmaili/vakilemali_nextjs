"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitComment } from "@/[slug]/comments";
import { useEffect, useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`button-primary flex items-center justify-center ${
        pending
          ? "opacity-60 cursor-not-allowed"
          : "shadow-md shadow-primary/30"
      }`}
    >
      {pending ? (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
          در حال ارسال دادخواست...
        </>
      ) : (
        "ثبت نظر حقوقی"
      )}
    </button>
  );
}

export default function CommentForm({
  postId,
  parentCommentId,
  postSlug,
  onCancelReply,
}) {
  const initialState = { success: null, message: null };
  const [state, formAction] = useActionState(submitComment, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      if (onCancelReply) onCancelReply();
    }
  }, [state.success, onCancelReply]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={`space-y-4 p-5 rounded-lg border-2 ${
        parentCommentId
          ? "bg-white/80 dark:bg-[#2a2a2a] border-accent/30"
          : "bg-white dark:bg-[#1f1f1f] border-primary/20"
      } shadow-inner`}
    >
      <h4 className="text-xl font-extrabold text-primary dark:text-primary-light border-b pb-2">
        {parentCommentId ? "ارسال لایحه پاسخ (پاسخ به نظر)" : "طرح نظر و پرسش"}
      </h4>

      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentId" value={parentCommentId || ""} />
      <input type="hidden" name="postSlug" value={postSlug} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name">نام و نام خانوادگی *</label>
          <input type="text" id="author_name" name="author_name" required />
        </div>
        <div>
          <label htmlFor="author_email">ایمیل (اختیاری)</label>
          <input type="email" id="author_email" name="author_email" />
        </div>
      </div>

      <div>
        <label htmlFor="content">متن نظر/پرسش *</label>
        <textarea id="content" name="content" rows="4" required />
      </div>

      {state.message && (
        <p
          className={`text-sm font-extrabold p-3 rounded-md ${
            state.success
              ? "bg-secondary/10 text-secondary border border-secondary/50"
              : "bg-destructive/10 text-destructive border border-destructive/50"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-start items-center space-x-4 space-x-reverse pt-2">
        <SubmitButton />
        {parentCommentId && (
          <button
            type="button"
            onClick={onCancelReply}
            className="text-sm font-medium"
          >
            لغو پاسخ
          </button>
        )}
      </div>
    </form>
  );
}
