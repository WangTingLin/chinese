import React from 'react';
import { Icon, PageHeader } from '../App';
import SEOHead from '../components/SEOHead';

export const members = [
  { name: "王亭林", school: "臺灣師範大學", dept: "國文學系博士生", field: "春秋學" },
  { name: "李宗祐", school: "臺灣師範大學", dept: "國文學系博士生", field: "先秦思想" },
  { name: "林昱璋", school: "臺灣師範大學", dept: "國文學系碩士生", field: "易學" },
  { name: "朴玹模", school: "臺灣大學", dept: "哲學研究所博士生", field: "先秦思想" },
  { name: "汪博潤", school: "臺灣大學", dept: "中國文學研究所博士生", field: "尚書學" },
  { name: "吳賢愷", school: "臺灣大學", dept: "中國文學研究所博士生", field: "現代文學" },
  { name: "嚴浩然", school: "成功大學", dept: "中國文學研究所博士生", field: "先秦思想" },
  { name: "陳皓渝", school: "高雄師範大學", dept: "國文學系博士生", field: "文字學" },
  { name: "王鈺堤", school: "國立中山大學", dept: "中國文學研究所博士生", field: "春秋學" },
  { name: "夏卓浩", school: "復旦大學", dept: "哲學系博士生", field: "中國哲學" },
];

/* 動態取得分類與領域配色 (支援暗色模式) */
const getFieldColors = (isDark) => ({
  "春秋學":   { bg: isDark ? "rgba(212,162,78,0.2)" : "rgba(212,162,78,0.15)",  color: isDark ? "#fde68a" : "#7a5c1a", border: isDark ? "rgba(212,162,78,0.4)" : "rgba(212,162,78,0.35)" },
  "先秦思想": { bg: isDark ? "rgba(74,106,80,0.2)" : "rgba(74,106,80,0.15)",   color: isDark ? "#86efac" : "#2e4432", border: isDark ? "rgba(74,106,80,0.4)" : "rgba(74,106,80,0.35)" },
  "易學":     { bg: isDark ? "rgba(61,104,120,0.2)" : "rgba(61,104,120,0.15)",  color: isDark ? "#bae6fd" : "#1a3a4a", border: isDark ? "rgba(61,104,120,0.4)" : "rgba(61,104,120,0.35)" },
  "尚書學":   { bg: isDark ? "rgba(140,98,64,0.2)" : "rgba(140,98,64,0.15)",   color: isDark ? "#fdba74" : "#5e3d24", border: isDark ? "rgba(140,98,64,0.4)" : "rgba(140,98,64,0.35)" },
  "現代文學": { bg: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)",  color: isDark ? "#d8b4fe" : "#4c1d95", border: isDark ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.3)" },
  "文字學":   { bg: isDark ? "rgba(220,38,38,0.2)" : "rgba(220,38,38,0.1)",    color: isDark ? "#fca5a5" : "#7f1d1d", border: isDark ? "rgba(220,38,38,0.4)" : "rgba(220,38,38,0.25)" },
  "中國哲學": { bg: isDark ? "rgba(234,179,8,0.2)" : "rgba(234,179,8,0.12)",   color: isDark ? "#fde047" : "#713f12", border: isDark ? "rgba(234,179,8,0.4)" : "rgba(234,179,8,0.3)" },
});

export default function AboutPage({ isDarkMode }) {
  const colors = getFieldColors(isDarkMode);

  return (
    <>
      <SEOHead title="關於讀書會" description="中文研究室簡介、宗旨與成員介紹。" url="/about" />
    <div style={{ padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Editorial header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="ed-label">05 / 關於</span>
          <h2 className="ed-heading" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginTop: "0.5rem" }}>關於讀書會</h2>
        </div>

        {/* Quote */}
        <div style={{ borderLeft: "3px solid #b01f45", paddingLeft: "1.75rem", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 300, color: "#1d1b19", lineHeight: 1.8, letterSpacing: "0.03em" }}>
            「獨學而無友，則孤陋而寡聞」
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#a8a29e", marginTop: "0.75rem", textTransform: "uppercase" }}>
            《禮記‧學記》
          </p>
        </div>

        {/* Body text */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "1rem", color: "#78716c", lineHeight: 2, marginBottom: "1.5rem", textIndent: "2em" }}>
            在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松，研究者們往往花費大量的時間與古籍對話，與前人理論交流。然而，新的知識並不是古人或個人所能生產，它勢必須要與時代建立溝通的橋樑，學術寫作就是將已經内化的思考透過文字與公共社會進行對話，尋求建立新的知識觀點。
          </p>

          <blockquote style={{ margin: "2rem 0", padding: "1.5rem 2rem", borderLeft: "3px solid #b01f45", background: "rgba(176,31,69,0.04)", borderRadius: "0 0.5rem 0.5rem 0" }}>
            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.95rem", color: "#78716c", lineHeight: 1.9, fontStyle: "italic" }}>
              「如果思考是與公眾、社會對話的内化，學會更好地思考，就是學會更好地對話。」
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#a8a29e", marginTop: "0.75rem" }}>
              — Kenneth A. Bruffee, 1984
            </p>
          </blockquote>

          <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "1rem", color: "#78716c", lineHeight: 2, textIndent: "2em" }}>
            現代的研究者本不應該「閉門造車」，而是需要闊開心胸，與他人建立共學的連結，在產出新知識的階段，建立「實踐社群（Communities of Practice, CoP）」，讓知識不再只是靜態地產出，而是在成員們的互動、共享與回饋時動態生成。
          </p>
        </div>

        {/* Info cards — border-left accent, no full box */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
            <span className="ed-label" style={{ fontSize: "0.6rem" }}>實踐方向</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {[
              { title: "當局者迷與同儕審查", desc: "傳統俗諺：「當局者迷，旁觀者清」，在研究生撰寫論文的過程中，難免遭遇論述困難、邏輯死角、學術視野缺失等諸多情形。若在此之前，藉由協作學習的成員建立小型的「同儕審查機制（Peer Review）」，不僅可以提供他者的眼光，協助成員提早發現論文問題以及發展方向，便可即時避免、降低正式發表的挫折感。" },
              { title: "寫作焦慮與進度控管", desc: "研究生的學術寫作之所以常有「拖延症」，不應歸咎於自身的研究能力不足，而是源於長時間孤軍奮戰產生的心理耗損。藉由社群強制訂立發表時程的強制規定，將相對抽象的寫作計畫轉化為具體的「Deadline」，以適度的社交壓力能有效打破學術寫作的延宕。" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "1.5rem", borderLeft: "3px solid rgba(176,31,69,0.3)", background: "rgba(255,255,255,0.5)", borderRadius: "0 0.5rem 0.5rem 0" }}>
                <h3 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "1rem", fontWeight: 700, color: "#1d1b19", marginBottom: "0.75rem", lineHeight: 1.4 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.88rem", color: "#78716c", lineHeight: 1.85 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concrete practices — border-bottom list */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
            <span className="ed-label" style={{ fontSize: "0.6rem" }}>具體實踐</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
          </div>

          {[
            { n: "01", t: "建立學術討論的期程表", d: "計畫伊始，即排定每位成員的發表次序與時段，要求發表人須於會議前一週提交論文初稿。旨在模擬學術期刊或研討會的審稿流程，給予研究生學術寫作的「儀式感」與「責任心」。" },
            { n: "02", t: "組建同儕審查會議", d: "每位成員須輪流在會議中承擔不同角色。主持人須控管現場對話的次序；發表人須練習在有限時間內精煉陳述核心問題；特約討論人則需針對論文提供具建設性的修改建議。" },
            { n: "03", t: "論文修正與再評議", d: "學術寫作最困難的部分不在於「寫」，而在於「如何改」。本計畫強調在初稿發表與評論意見回饋後，發表人必須針對修改建議進行整理，提出修改說明作為追蹤。" },
            { n: "04", t: "跨校數位資源共享群組", d: "現代論文寫作已無法脫離數位工具與資料庫的運用。透過「校際」合作，總合多校資源，便能查漏補缺，為成員的研究添磚加瓦。" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "2rem 0", borderBottom: "1px solid rgba(29,27,25,0.07)", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#b01f45", fontWeight: 600, flexShrink: 0, paddingTop: "0.2rem" }}>{item.n}</span>
              <div>
                <h4 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "1rem", fontWeight: 700, color: "#1d1b19", marginBottom: "0.5rem" }}>{item.t}</h4>
                <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.88rem", color: "#78716c", lineHeight: 1.85 }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Members */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
            <span className="ed-label" style={{ fontSize: "0.6rem" }}>讀書會成員</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(29,27,25,0.07)" }} />
          </div>

          <div>
            {members.map((m, i) => {
              const fc = colors[m.field] || { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 0", borderBottom: "1px solid rgba(29,27,25,0.07)", flexWrap: "wrap" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#b01f45", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Noto Serif TC', serif", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                    {m.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 700, color: "#1d1b19", fontSize: "1rem" }}>{m.name}</span>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: 600, padding: "0.2rem 0.7rem", borderRadius: "9999px", background: fc.bg, color: fc.color, border: `1px solid ${fc.border}`, flexShrink: 0 }}>
                    {m.field}
                  </span>
                  <div style={{ textAlign: "right", minWidth: "160px" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#78716c" }}>{m.school}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#a8a29e" }}>{m.dept}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
