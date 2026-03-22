import { Icon, PageHeader } from '../App';

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
    <div className="w-full space-y-12 page-enter-blur stagger relative z-10">
      <PageHeader title="關於讀書會" />
      <div className="p-5 sm:p-8 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-6 theme-text">
        <p className="text-base md:text-lg font-serif content-justify">
          「獨學而無友，則孤陋而寡聞」，出自《禮記‧學記》，指獨自一人的學習，而沒有志同道合的朋友相互切磋討論，就會陷入學識淺薄、見聞狹隘的困境。然而，在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松，研究者們往往花費大量的時間與古籍對話，與前人理論交流。
然而，新的知識並不是古人或個人所能生產，它勢必須要與時代建立溝通的橋樑，學術寫作就是將已經内化的思考透過文字與公共社會進行對話，尋求建立新的知識觀點。布魯菲（Kenneth A. Bruffee, 1934-2019）提到個人的學思與公共社會對話的重要性：「如果思考是與公眾、社會對話的内化，學會更好地思考，就是學會更好地對話。（If thought is internalized public and social talk, then to learn to think better is to learn to converse better.）」（Bruffee, 1984），因此，現代的研究者本不應該「閉門造車」，而是需要闊開心胸，與他人建立共學的連結，而在產出新知識的階段，就應該建立「實踐社群（Communities of Practice, CoP）」，讓知識不再只是靜態地產出，而是在成員們的互動、共享與回饋時動態生成。

        </p>
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mt-6 md:mt-8 xl:max-w-5xl xl:mx-auto">
          {[
            { icon: "BookOpen", title: "當局者迷與同儕審查", desc: "傳統俗諺：「當局者迷，旁觀者清」，在研究生撰寫論文的過程中，難免遭遇論述困難、邏輯死角、學術視野缺失等諸多情形。若在此之前，藉由協作學習的成員建立小型的「同儕審查機制（Peer Review）」，不僅可以提供他者的眼光，協助成員提早發現論文問題以及發展方向，便可即時避免、降低正式發表的挫折感。" },
            { icon: "Users", title: "寫作焦慮與進度控管", desc: "研究生的學術寫作之所以常有「拖延症」，不應歸咎於自身的研究能力不足，而是源於長時間孤軍奮戰產生的心理耗損。藉由社群強制訂立發表時程的強制規定，將相對抽象的寫作計畫轉化為具體的「Deadline」，以適度的社交壓力能有效打破學術寫作的延宕。" },
          ].map((item, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
                <span style={{ color: "var(--c-accent)" }}><Icon name={item.icon} size={24} /></span> {item.title}
              </h3>
              <p className="theme-text-secondary content-justify">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
          <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">具體實踐</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "ClipboardList", n: 1, t: "建立學術討論的期程表", d: "計畫伊始，即排定每位成員的發表次序與時段，要求發表人須於會議前一週提交論文初稿。旨在模擬學術期刊或研討會的審稿流程，給予研究生學術寫作的「儀式感」與「責任心」。" },
              { icon: "Users", n: 2, t: "組建同儕審查會議", d: "每位成員須輪流在會議中承擔不同角色。主持人須控管現場對話的次序；發表人須練習在有限時間內精煉陳述核心問題；特約討論人則需針對論文提供具建設性的修改建議。" },
              { icon: "Edit3", n: 3, t: "論文修正與再評議", d: "學術寫作最困難的部分不在於「寫」，而在於「如何改」。本計畫強調在初稿發表與評論意見回饋後，發表人必須針對修改建議進行整理，提出修改說明作為追蹤。" },
              { icon: "Globe", n: 4, t: "跨校數位資源共享群組", d: "現代論文寫作已無法脫離數位工具與資料庫的運用。透過「校際」合作，總合多校資源，便能查漏補缺，為成員的研究添磚加瓦。" },
            ].map((item, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 transition-colors duration-300">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
                  <span style={{ color: "var(--c-accent)" }}><Icon name={item.icon} size={20} /></span> {item.n}. {item.t}
                </h4>
                <p className="theme-text-secondary text-sm leading-relaxed font-serif content-justify">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
          <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">讀書會成員</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {members.map((m, i) => {
              const fc = colors[m.field] || { bg: isDarkMode ? "rgba(148,163,184,0.2)" : "rgba(100,116,139,0.12)", color: isDarkMode ? "#cbd5e1" : "#475569", border: isDarkMode ? "rgba(148,163,184,0.4)" : "rgba(100,116,139,0.25)" };
              return (
                <div key={i} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg font-sans shadow-sm"
                    style={{ background: "var(--c-primary)", opacity: 0.85 }}>
                    {m.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-base font-sans theme-heading">{m.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border font-sans transition-colors"
                        style={{ background: fc.bg, color: fc.color, borderColor: fc.border }}>
                        {m.field}
                      </span>
                    </div>
                    <p className="text-xs theme-text-secondary font-sans leading-relaxed">{m.school}</p>
                    <p className="text-xs theme-text-secondary font-sans opacity-70">{m.dept}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};