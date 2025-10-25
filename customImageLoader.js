// customImageLoader.js
// 💡 مهم: باید Default Export باشد
export default function customImageLoader({ src }) {
  // 💡 فقط مسیر خام را بدون هیچ پارامتری برمی‌گردانیم
  return `/media${src}`;
}
