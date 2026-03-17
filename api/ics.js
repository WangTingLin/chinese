export default function handler(req, res) {
  const { title = "", date = "", end = "", location = "", speaker = "", uid = "" } = req.query;
  if (!date) { res.status(400).send("missing date"); return; }

  const esc = (s) => (s||"").replace(/\\/g,"\\\\").replace(/;/g,"\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");

  const lines = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//中文研究室//App//ZH",
    "BEGIN:VEVENT",
    `UID:${uid||Date.now()+"@chinese-coral.vercel.app"}`,
    `DTSTART:${date}`,`DTEND:${end||date}`,
    `SUMMARY:${esc(title)}`,
    location ? `LOCATION:${esc(location)}` : "",
    speaker  ? `DESCRIPTION:${esc("講者："+speaker)}` : "",
    "END:VEVENT","END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  /* 不加 Content-Disposition: attachment
     iOS Safari 收到 text/calendar inline 會直接跳「加入行事曆」對話框 */
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(lines);
}
