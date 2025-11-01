"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react"; // <-- ایمپورت کردن هوک‌های لازم
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
} from "lucide-react";

//================================================================================
// کامپوننت نوار ابزار (MenuBar) - بدون تغییر
//================================================================================
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const menuItems = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      icon: Bold,
      name: "bold",
      active: editor.isActive("bold"),
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      icon: Italic,
      name: "italic",
      active: editor.isActive("italic"),
    },
    {
      action: () => editor.chain().focus().toggleStrike().run(),
      icon: Strikethrough,
      name: "strike",
      active: editor.isActive("strike"),
    },
    { type: "divider" },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: Heading2,
      name: "h2",
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: Heading3,
      name: "h3",
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      icon: Heading4,
      name: "h4",
      active: editor.isActive("heading", { level: 4 }),
    },
    {
      action: () => editor.chain().focus().setParagraph().run(),
      icon: Pilcrow,
      name: "paragraph",
      active: editor.isActive("paragraph"),
    },
    { type: "divider" },
    {
      action: () => editor.chain().focus().toggleBulletList().run(),
      icon: List,
      name: "bulletList",
      active: editor.isActive("bulletList"),
    },
    {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      icon: ListOrdered,
      name: "orderedList",
      active: editor.isActive("orderedList"),
    },
    {
      action: () => editor.chain().focus().toggleBlockquote().run(),
      icon: Quote,
      name: "blockquote",
      active: editor.isActive("blockquote"),
    },
    { type: "divider" },
    {
      action: () => editor.chain().focus().setHorizontalRule().run(),
      icon: Minus,
      name: "horizontalRule",
    },
  ];

  return (
    <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1">
      {menuItems.map((item, index) =>
        item.type === "divider" ? (
          <div
            key={index}
            className="w-[1px] bg-gray-200 dark:bg-gray-600 mx-1"
          ></div>
        ) : (
          <button
            key={index}
            type="button"
            onClick={item.action}
            title={item.name}
            className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
              item.active
                ? "bg-gray-200 dark:bg-gray-600 text-primary"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <item.icon className="w-4 h-4" />
          </button>
        )
      )}
    </div>
  );
};

//================================================================================
// کامپوننت اصلی ویرایشگر - **با اصلاحات کلیدی**
//================================================================================
export default function TiptapEditor({ initialContent, onContentChange }) {
  // **تغییر ۱:** یک state برای اطمینان از اجرای کد در کلاینت اضافه می‌کنیم
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-base dark:prose-invert max-w-none p-4 focus:outline-none min-h-[500px] w-full",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    // **تغییر ۲:** این گزینه حیاتی را برای جلوگیری از رندر در سرور اضافه می‌کنیم
    immediatelyRender: false,
  });

  // **تغییر ۳:** تا زمانی که کامپوننت در کلاینت mount نشده، یک placeholder نمایش می‌دهیم
  if (!isClient) {
    return (
      <div className="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[540px] p-4 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  // پس از mount شدن در کلاینت، ویرایشگر واقعی را نمایش می‌دهیم
  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
