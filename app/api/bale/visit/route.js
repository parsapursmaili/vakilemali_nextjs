import { NextResponse } from "next/server";
import { db } from "@/lib/db/mysql";

export async function POST(req) {
  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "No postId" },
        { status: 400 }
      );
    }

    // گرفتن اطلاعات پست از دیتابیس
    const [rows] = await db.execute(
      "SELECT title, view_count FROM posts WHERE id = ? LIMIT 1",
      [postId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const { title, view_count } = rows[0];

    // ساخت پیام
    const message = `📈 بازدید جدید
📝 ${title}
👁️ ${view_count}`;

    // ارسال پیام به بله به صورت fire-and-forget
    fetch(`https://tapi.bale.ai/bot${process.env.BALE_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.BALE_CHAT_ID,
        text: message,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.text().catch(() => "");
          console.error("[Bale API] SendMessage failed:", res.status, data);
        }
      })
      .catch((err) => {
        console.error("[Bale API] SendMessage fetch error:", err);
      });

    // پاسخ سریع به کاربر
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Bale API] Catch error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
