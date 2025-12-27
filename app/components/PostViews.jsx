"use client";

import { useEffect } from "react";
import { incrementPostViews } from "@/[slug]/post";

export default function PostViews({ postId, initialViews }) {
  useEffect(() => {
    if (postId) {
      incrementPostViews(postId);
    }
  }, [postId]);
  return null;
}
