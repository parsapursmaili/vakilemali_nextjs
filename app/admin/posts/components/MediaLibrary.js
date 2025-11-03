"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { X, UploadCloud, Loader2, Library, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const imageApiLoader = ({ src }) => {
  // این لودر بدون تغییر باقی می‌ماند و کار خود را به درستی انجام می‌دهد
  const relativePath = src.startsWith("/uploads/")
    ? src.substring("/uploads/".length)
    : src;
  return `/api/image/${relativePath}`;
};

export default function MediaLibrary({ onClose, onSelectImage }) {
  const [activeTab, setActiveTab] = useState("library");
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, startUploading] = useTransition();

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setMedia(data.files);
      } else {
        toast.error("خطا در بارگذاری لیست رسانه‌ها.");
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
      toast.error("خطا در ارتباط با سرور برای دریافت رسانه‌ها.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    startUploading(async () => {
      const promise = fetch("/api/upload", { method: "POST", body: formData });

      toast.promise(promise, {
        loading: "در حال آپلود تصویر...",
        success: async (res) => {
          const result = await res.json();
          if (result.success) {
            // [اصلاح کلیدی شماره ۱]
            // قبل از ارسال آدرس به بیرون، پیشوند '/uploads/' را از آن حذف می‌کنیم.
            // result.url از API به صورت '/uploads/2025/11/image.webp' می‌آید.
            const relativeUrl = result.url.startsWith("/uploads/")
              ? result.url.substring("/uploads/".length)
              : result.url;
            onSelectImage(relativeUrl); // آدرس نسبی ارسال می‌شود.
            onClose();
            return "آپلود با موفقیت انجام شد!";
          } else {
            throw new Error(result.error || "خطای ناشناخته در آپلود.");
          }
        },
        error: (err) => `خطا در آپلود: ${err.message}`,
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header Modal */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">کتابخانه رسانه</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-48 border-l border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "library"
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Library className="w-5 h-5" />
                <span>کتابخانه</span>
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`w-full flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "upload"
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <UploadCloud className="w-5 h-5" />
                <span>آپلود فایل</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {activeTab === "library" && (
              <div>
                <h3 className="font-bold mb-4">تصاویر موجود</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="mr-2">در حال بارگذاری...</span>
                  </div>
                ) : media.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {media.map((file) => (
                      <div
                        key={file.url}
                        className="aspect-square border rounded-md overflow-hidden cursor-pointer group relative"
                        // [اصلاح کلیدی شماره ۲]
                        // در اینجا هم قبل از ارسال آدرس، پیشوند '/uploads/' را حذف می‌کنیم.
                        // file.url از API به صورت '/uploads/2025/11/image.webp' است.
                        onClick={() => {
                          const relativeUrl = file.url.startsWith("/uploads/")
                            ? file.url.substring("/uploads/".length)
                            : file.url;
                          onSelectImage(relativeUrl); // آدرس نسبی ارسال می‌شود.
                        }}
                      >
                        <Image
                          loader={imageApiLoader}
                          src={file.url} // برای نمایش تصویر، همچنان از آدرس کامل استفاده می‌کنیم.
                          alt={file.name}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>هیچ رسانه‌ای یافت نشد.</p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="text-primary font-semibold mt-2"
                    >
                      اولین تصویر را آپلود کنید.
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "upload" && (
              <div>
                <h3 className="font-bold mb-4">آپلود تصویر جدید</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {!preview ? (
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="font-semibold text-primary">
                        برای انتخاب فایل کلیک کنید
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF, WEBP
                      </p>
                    </label>
                  ) : (
                    <div className="flex flex-col items-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 rounded-md mb-4 border dark:border-gray-600"
                      />
                      <p className="text-sm font-medium truncate max-w-xs mb-4">
                        {selectedFile?.name}
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="button-primary inline-flex items-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>در حال آپلود...</span>
                            </>
                          ) : (
                            "آپلود و انتخاب"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                          }}
                          className="button-secondary bg-red-600 hover:bg-red-700"
                        >
                          لغو
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
