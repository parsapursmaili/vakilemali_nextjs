"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";

import { useState, useEffect } from "react";
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
  Code2,
  Eye,
  Table as TableIcon,
  Trash2,
  FlipVertical,
  Plus,
} from "lucide-react";

// کامپوننت MenuBar بدون تغییر باقی می‌ماند. کد آن را برای خلاصه‌سازی حذف کرده‌ام.
// شما کد MenuBar قبلی خود را اینجا قرار دهید.
const MenuBar = ({ editor, currentView, onViewSwitch }) => {
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
    { type: "divider" },
    {
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      icon: TableIcon,
      name: "insertTable",
      title: "درج جدول",
    },
    {
      action: () => editor.chain().focus().addColumnAfter().run(),
      icon: Plus,
      name: "addColumn",
      title: "افزودن ستون",
    },
    {
      action: () => editor.chain().focus().addRowAfter().run(),
      icon: Plus,
      name: "addRow",
      title: "افزودن سطر",
    },
    {
      action: () => editor.chain().focus().deleteColumn().run(),
      icon: Trash2,
      name: "deleteColumn",
      title: "حذف ستون",
    },
    {
      action: () => editor.chain().focus().deleteRow().run(),
      icon: Trash2,
      name: "deleteRow",
      title: "حذف سطر",
    },
    {
      action: () => editor.chain().focus().deleteTable().run(),
      icon: Trash2,
      name: "deleteTable",
      title: "حذف کل جدول",
    },
    {
      action: () => editor.chain().focus().toggleHeaderRow().run(),
      icon: FlipVertical,
      name: "toggleHeaderRow",
      title: "فعال/غیرفعال کردن سربرگ",
    },
  ];

  return (
    <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {currentView === "wysiwyg" &&
          menuItems.map((item, index) =>
            item.type === "divider" ? (
              <div
                key={index}
                className="w-[1px] bg-gray-200 dark:bg-gray-600 mx-1 self-stretch"
              ></div>
            ) : (
              <button
                key={index}
                type="button"
                onClick={item.action}
                title={item.title || item.name}
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
      <div className="flex items-center gap-1">
        <div className="w-[1px] bg-gray-200 dark:bg-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => onViewSwitch("wysiwyg")}
          title="ویرایشگر بصری"
          className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
            currentView === "wysiwyg"
              ? "bg-gray-200 dark:bg-gray-600 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewSwitch("html")}
          title="ویرایشگر کد HTML"
          className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
            currentView === "html"
              ? "bg-gray-200 dark:bg-gray-600 text-primary"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ✨ تابع کمکی برای تبدیل محتوای قدیمی به HTML استاندارد
function sanitizeContentForEditor(html) {
  if (!html) return "<p></p>"; // همیشه با یک پاراگراف خالی شروع کن

  // از همان منطق صفحه پست استفاده می‌کنیم
  const protectedBlocksRegex =
    /(<table[\s\S]*?<\/table>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>)/gi;
  const parts = html.split(protectedBlocksRegex);

  const processedParts = parts.map((part) => {
    if (part.match(protectedBlocksRegex)) {
      return part;
    } else {
      // این بار \n یا \n\n را به تگ‌های <p> واقعی تبدیل می‌کنیم
      return part
        .trim()
        .replace(/\n+/g, "</p><p>")
        .replace(/^/, "<p>") // اطمینان از وجود تگ <p> در ابتدا
        .replace(/$/, "</p>"); // اطمینان از وجود تگ <p> در انتها
    }
  });

  let finalHtml = processedParts.join("").replace(/<p>\s*<\/p>/g, "");
  return finalHtml;
}

export default function TiptapEditor({ initialContent, onContentChange }) {
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState("wysiwyg");
  const [htmlContent, setHtmlContent] = useState(initialContent || "");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit, // ✨ استفاده از StarterKit استاندارد
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    // ✨ محتوای اولیه فقط یک بار، پس از پاکسازی، به ویرایشگر داده می‌شود
    content: sanitizeContentForEditor(initialContent),
    editorProps: {
      attributes: {
        class:
          "prose prose-base dark:prose-invert max-w-none p-4 focus:outline-none min-h-[500px] w-full",
      },
    },
    onUpdate: ({ editor }) => {
      // ✨ ویرایشگر حالا همیشه HTML تمیز و استاندارد تولید می‌کند
      const newHtml = editor.getHTML();
      onContentChange(newHtml);
      setHtmlContent(newHtml);
    },
    immediatelyRender: false,
  });

  const handleHtmlChange = (e) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    onContentChange(newHtml);
  };

  const handleViewSwitch = (newView) => {
    if (viewMode === newView) return;
    if (newView === "wysiwyg") {
      // چون هر دو حالت با HTML استاندارد کار می‌کنند، تبدیل لازم نیست
      editor?.commands.setContent(htmlContent, { emitUpdate: false });
    } else {
      setHtmlContent(editor?.getHTML() || "");
    }
    setViewMode(newView);
  };

  if (!isClient || !editor) {
    // ... کد حالت لودینگ بدون تغییر
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

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <MenuBar
        editor={editor}
        currentView={viewMode}
        onViewSwitch={handleViewSwitch}
      />
      {viewMode === "wysiwyg" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className="w-full min-h-[500px] p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm focus:outline-none resize-y"
          placeholder="کد HTML خود را اینجا وارد کنید..."
          dir="ltr"
        />
      )}
    </div>
  );
}
