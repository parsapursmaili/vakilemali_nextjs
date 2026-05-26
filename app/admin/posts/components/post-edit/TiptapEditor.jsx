"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Table as TableIcon,
} from "lucide-react";

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // ارسال تغییرات به استیت اصلی فرم
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[400px] p-4 bg-white dark:bg-gray-900 border border-t-0 border-gray-300 dark:border-gray-700 rounded-b-lg text-right rtl",
      },
    },
  });

  // همگام‌سازی محتوای ویرایشگر با تغییرات خارجی (مثلا زمانی که کاربر در تب HTML متن را تغییر می‌دهد)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      {/* جعبه ابزار (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("bold")
              ? "bg-gray-200 dark:bg-gray-700 text-primary font-bold"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="ضخیم (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("italic")
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="مورب (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("strike")
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="خط‌خورده (Strike)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700 text-primary font-bold"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="تیتر ۲ (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-gray-700 text-primary font-bold"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="تیتر ۳ (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 4 })
              ? "bg-gray-200 dark:bg-gray-700 text-primary font-bold"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="تیتر ۴ (H4)"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="لیست نشانه‌دار"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="لیست شماره‌دار"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("blockquote")
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
          title="نقل قول (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* دکمه‌های مربوط به جدول */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="درج جدول ۳x۳"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        {editor.isActive("table") && (
          <div className="flex gap-1 bg-white/40 dark:bg-black/20 p-1 rounded">
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-1 py-0.5 text-[10px] font-bold rounded bg-gray-200 dark:bg-gray-700"
            >
              +ستون راست
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-1 py-0.5 text-[10px] font-bold rounded bg-gray-200 dark:bg-gray-700"
            >
              +ردیف پایین
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-1 py-0.5 text-[10px] font-bold rounded bg-red-100 dark:bg-red-900/30 text-red-600"
            >
              حذف ستون
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-1 py-0.5 text-[10px] font-bold rounded bg-red-100 dark:bg-red-900/30 text-red-600"
            >
              حذف ردیف
            </button>
          </div>
        )}

        <div className="flex-grow"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          title="به عقب (Undo)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          title="به جلو (Redo)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
