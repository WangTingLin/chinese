// Vercel Serverless Function：生成並回傳 .ics 檔案
// iOS Safari 偵測到 Content-Type: text/calendar 會直接彈「加入行事曆」
export default function handler(req, res) {
  const { title = "", date = "", end = "", location = "", speaker = "", uid = "" } = req.query;

  if (!date) {
    res.status(400).send("missing date");
    return;
  }

  const escape = (s) => (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//中文研究室//App//ZH",
    "BEGIN:VEVENT",
    `UID:${uid || Date.now() + "@chinese-coral.vercel.app"}`,
    `DTSTART:${date}`,
    `DTEND:${end || date}`,
    `SUMMARY:${escape(title)}`,
    location ? `LOCATION:${escape(location)}` : "",
    speaker  ? `DESCRIPTION:${escape("講者：" + speaker)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="event.ics"`);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(lines);
}
