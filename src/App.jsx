import React, { useEffect, useState } from "react";

/* ==================== 圖示組件 ==================== */
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    BookOpen: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
    Calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
    Users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    Home: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    Menu: (
      <>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </>
    ),
    X: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    ChevronRight: <path d="m9 18 6-6-6-6" />,
    Library: (
      <>
        <path d="m16 6 4 14" />
        <path d="M12 6v14" />
        <path d="M8 8v12" />
        <path d="M4 4v16" />
      </>
    ),
    Info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    ClipboardList: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </>
    ),
    Edit3: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </>
    ),
    Globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    ExternalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </>
    ),
    PenLine: (
      <>
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
      </>
    ),
    FileText: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </>
    ),
    Tag: (
      <>
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </>
    ),
    Clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    AlertCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
};

/* ==================== LOGO 組件 ==================== */
const LogoImage = ({ className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center text-white transform rotate-3 ${className}`}
      style={{ background: "var(--c-primary)" }}
    >
      <Icon
        name="BookOpen"
        size={className.includes("w-10") ? 24 : 18}
        className="-rotate-3"
      />
    </div>
  );
};

/* ==================== 模擬資料 ==================== */
const nextEvent = {
  date: "2026年3月12日 20:00",
  location: "線上 Google Meet 會議室",
  topic: "神話學與服飾史專題研討",
  papers: [
    "汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉",
    "陳皓渝：〈歷代冠禮所用服飾演變分析〉",
  ],
};

const resourceCategories = [
  {
    title: "文獻查找",
    icon: "Library",
    links: [
      { name: "中文古籍聯合目錄及循證平台", url: "http://gj.library.sh.cn/index" },
      { name: "古籍普查登記基本數據庫", url: "http://gjpc.nlc.cn/xlsworkbench/publish" },
      { name: "典津─全球漢籍影像開放集成", url: "https://guji.cckb.cn/" },
    ],
  },
  {
    title: "古籍 OCR",
    icon: "Edit3",
    links: [
      { name: "識典古籍", url: "https://shidianguji.com/zh" },
      { name: "古籍慧眼", url: "https://gujiocr.com" },
      { name: "中研院文字辨識與校對平台", url: "https://ocr.ascdc.tw" },
    ],
  },
  {
    title: "實用網站",
    icon: "Globe",
    links: [
      { name: "鑒字", url: "https://api.shufashibie.com/page/index.html" },
      { name: "漢典", url: "https://zdic.net" },
      { name: "古音小鏡", url: "https://kaom.net" },
      { name: "古詩文斷句 v3.1", url: "https://seg.shenshen.wiki/" },
      { name: "搜韻", url: "https://sou-yun.cn/index.aspx" },
    ],
  },
];

const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const events = [
  {
    id: 1,
    title: "三月讀書會",
    date: "2026-03-12",
    status: "upcoming",
    details:
      "【討論論文】\n汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉\n陳皓渝：〈歷代冠禮所用服飾演變分析〉",
  },
];

const researchArticles = [
  {
    id: 1,
    title: "經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究",
    author: "汪博潤",
    date: "2026-03-12",
    tags: ["經學", "神話學", "顧頡剛"],
    status: "待發表",
    abstract:
      "顧頡剛作為中國神話學奠基人的地位，對於現代神話學的創建，有開創性貢獻。惟其具體的神話學貢獻和典籍考證成果，如其對《山海經》的研究動機、經過和作品，尚無較專門的分析。同時，作為史學家，顧氏針對儒家經書〈禹貢〉之分析，亦常取用〈山海經．五臧山經〉部分進行對照分析。其研究成果的學術影響與參考價值，亦有討論之必要。本文針對這些問題，採用顧氏留下之一手資料，蒐集前人相關論述，附以己意，加以申述，希望對於民國初年學者援引神話材料證經、疑經之研究，有所發掘。",
  },
  {
    id: 2,
    title: "歷代冠禮所用服飾演變分析",
    author: "陳皓渝",
    date: "2026-03-12",
    tags: ["禮制", "服飾史", "冠禮"],
    status: "待發表",
    abstract:
      "本文以文獻分析法，藉《周禮》、《儀禮》、《禮記》及歷代史書〈禮志〉、〈輿服志〉等材料，考察歷代冠禮所用禮服之演變，並分析其所反映之禮制精神。若察歷代冠禮所用禮服，可分四類：冕弁類、梁冠類、襆頭類、巾帽類，四類禮服使用的身分等級、場合輕重各有制度，而施行於冠禮皆遵循《禮記．冠義》所謂「三加彌尊」之義；同時反映時代社會的變遷下，各朝代的禮服制度仍遵循「時為大」的制禮原則，以及「彰顯尊卑」以穩定秩序的目的。",
  },
  {
    id: 3,
    title: "王弼《易》學史地位的釐定──從牟宗三「兩層存有論」看「以老解易」的合理性",
    author: "林昱璋",
    date: "2026-02-03",
    tags: ["易學", "王弼", "牟宗三"],
    status: "已發表",
    abstract:
      "王弼《易》注「以傳解經」與「以老解易」兩個面向，自湯用彤以降遂成為諸多學者的共識。然而，經筆者耙梳，自古代以來對於王弼以老解易之批判，或多或少出自一定的意識形態，不論是政治立場或學術之爭，同時亦沒有根據文獻給出確切證據。",
  },
  {
    id: 4,
    title: "重探胡渭《禹貢錐指》之學術史定位",
    author: "汪博潤",
    date: "2026-02-03",
    tags: ["禹貢錐指", "胡渭", "清初學術"],
    status: "已發表",
    abstract:
      "胡渭《禹貢錐指》是清初學術的要籍之一。民初以來之學術史研究，常以「漢宋兼採」作為其學術定位的一個特點。",
  },
  {
    id: 5,
    title: "解構聖王與安頓性命──《莊子》外、雜篇「至德之世」的士人實踐之道",
    author: "李宗祐",
    date: "2026-02-03",
    tags: ["莊子", "外雜篇", "至德之世"],
    status: "已發表",
    abstract: "",
  },
  {
    id: 6,
    title: "林鵞峰《易》學特色析論──以《周易程傳私考》為例",
    author: "林昱璋",
    date: "2026-01-06",
    tags: ["易學", "林鵞峰", "日本儒學"],
    status: "已發表",
    abstract:
      "作為影響日本乃至東亞深遠的朱子學，之所以能在日本快速發展，可追溯至江戶初期受到幕府支持的弘文院。",
  },
  {
    id: 7,
    title: "何致「孤經」",
    author: "王亭林",
    date: "2026-01-06",
    tags: ["孤經", "經學"],
    status: "已發表",
    abstract: "",
  },
];

/* ==================== 共用元件 ==================== */
const ThemedButton = ({ active, children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border font-sans spring-transition hover:scale-105 active:scale-95 ${className}`}
    style={
      active
        ? {
            background: "var(--c-nav-active-bg)",
            color: "#fff",
            borderColor: "var(--c-nav-active-border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }
        : { borderColor: "transparent", color: "var(--c-text-secondary)" }
    }
  >
    {children}
  </button>
);

const PageHeader = ({ title }) => (
  <div className="text-center space-y-4">
    <h2 className="text-3xl font-bold font-sans theme-heading">{title}</h2>
    <div
      className="w-16 h-1 mx-auto rounded-full"
      style={{ background: "var(--c-accent)" }}
    />
  </div>
);

/* ==================== 頁面：首頁 ==================== */
const HomePage = ({ setPage }) => (
  <div className="space-y-12 animate-fade-in relative z-10">
    <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest font-sans theme-heading">
        中文研究室
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif content-justify theme-text-secondary" style={{ textAlignLast: "center" }}>
        「獨學而無友，則孤陋而寡聞。」
        <br />
        ──《禮記‧學記》
      </p>
      <button
        onClick={() => setPage("about")}
        className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto spring-transition hover:scale-105 active:scale-95 border"
        style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}
      >
        探索研究室 <Icon name="ChevronRight" size={20} />
      </button>
    </section>

    <section className="rounded-3xl p-8 md:p-12 glass-panel glass-card-hover">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 backdrop-blur-sm font-sans border"
        style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)", borderColor: "var(--c-badge-border)" }}
      >
        <Icon name="Calendar" size={16} /> 近期研討
      </div>
      <h2 className="text-3xl font-bold mb-4 font-sans theme-heading">三月讀書會</h2>
      <div className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        {[["時間", nextEvent.date], ["地點", nextEvent.location], ["主題", nextEvent.topic]].map(([l, v]) => (
          <p key={l} className="flex items-start gap-3 theme-text">
            <strong className="min-w-16 font-sans shrink-0">{l}：</strong>
            <span>{v}</span>
          </p>
        ))}
        <div className="flex items-start gap-3 theme-text">
          <strong className="min-w-16 font-sans shrink-0">論文：</strong>
          <ul className="space-y-2">
            {nextEvent.papers.map((p, i) => (
              <li key={i} className="leading-relaxed">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </div>
);

/* ==================== 成員資料 ==================== */
const members = [
  { name: "王亭林", school: "國立臺灣師範大學", dept: "國文學系博士研究生", field: "春秋學" },
  { name: "李宗祐", school: "國立臺灣師範大學", dept: "國文學系博士研究生", field: "先秦思想" },
  { name: "林昱璋", school: "國立臺灣師範大學", dept: "國文學系碩士研究生", field: "易學" },
  { name: "汪博潤", school: "國立臺灣大學", dept: "中國文學研究所博士研究生", field: "尚書學" },
  { name: "吳賢愷", school: "國立臺灣大學", dept: "中國文學研究所博士研究生", field: "現代文學" },
  { name: "嚴浩然", school: "國立成功大學", dept: "中國文學研究所博士研究生", field: "先秦思想" },
  { name: "陳皓渝", school: "國立高雄師範大學", dept: "國文學系博士研究生", field: "文字學" },
  { name: "王鈺堤", school: "國立中山大學", dept: "中國文學研究所博士研究生", field: "春秋學" },
  { name: "夏卓浩", school: "復旦大學", dept: "哲學系博士研究生", field: "中國哲學" },
];

const fieldColors = {
  "春秋學":   { bg: "rgba(212,162,78,0.15)",  color: "#7a5c1a", border: "rgba(212,162,78,0.35)" },
  "先秦思想": { bg: "rgba(74,106,80,0.15)",   color: "#2e4432", border: "rgba(74,106,80,0.35)" },
  "易學":     { bg: "rgba(61,104,120,0.15)",  color: "#1a3a4a", border: "rgba(61,104,120,0.35)" },
  "尚書學":   { bg: "rgba(140,98,64,0.15)",   color: "#5e3d24", border: "rgba(140,98,64,0.35)" },
  "現代文學": { bg: "rgba(139,92,246,0.12)",  color: "#4c1d95", border: "rgba(139,92,246,0.3)" },
  "文字學":   { bg: "rgba(220,38,38,0.1)",    color: "#7f1d1d", border: "rgba(220,38,38,0.25)" },
  "中國哲學": { bg: "rgba(234,179,8,0.12)",   color: "#713f12", border: "rgba(234,179,8,0.3)" },
};

/* ==================== 頁面：關於讀書會 ==================== */
const AboutPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
    <PageHeader title="關於讀書會" />
    <div className="p-8 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-6 theme-text">
      <p className="text-lg font-serif content-justify">
        在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松，研究者們往往花費大量的時間與古籍對話，與前人理論交流。然而，新的知識並不是古人或個人所能生產，它勢必須要與時代建立溝通的橋樑，而學術寫作就是將已經内化的思考透過文字與公共社會進行對話，尋求建立新的知識觀點。
      </p>
      <div className="grid md:grid-cols-2 gap-8 mt-8">
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
        <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">研究室具體實踐</h3>
        <div className="grid md:grid-cols-2 gap-6">
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

      {/* 成員介紹 */}
      <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
        <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">讀書會成員</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => {
            const fc = fieldColors[m.field] || { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
            return (
              <div key={i} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg font-sans shadow-sm"
                  style={{ background: "var(--c-primary)", opacity: 0.85 }}>
                  {m.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-base font-sans theme-heading">{m.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border font-sans"
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

/* ==================== 頁面：資訊分享 ==================== */
const BooksPage = () => (
  <div className="space-y-16 animate-fade-in relative z-10">
    <PageHeader title="資訊分享" />
    <div className="space-y-12 max-w-5xl mx-auto">
      {resourceCategories.map((cat, idx) => (
        <div key={idx} className="space-y-6">
          <h3 className="text-2xl font-bold font-sans flex items-center gap-3 pb-4 theme-heading theme-divider" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
            <div className="p-2.5 rounded-xl border" style={{ background: "var(--c-accent-light)", borderColor: "var(--c-badge-border)" }}>
              <Icon name={cat.icon} size={24} />
            </div>
            {idx + 1}. {cat.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.links.map((link, li) => {
              const domain = getDomain(link.url);
              return (
                <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center p-5 rounded-2xl glass-panel glass-card-hover hover:-translate-y-1 shadow-sm">
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-white/60 shrink-0 overflow-hidden">
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold font-sans transition-colors truncate theme-heading">{link.name}</h4>
                    <p className="text-xs font-mono mt-1 truncate theme-text-secondary" style={{ opacity: 0.5 }}>{domain}</p>
                  </div>
                  <Icon name="ExternalLink" size={18} className="shrink-0 ml-3 opacity-20 group-hover:opacity-70 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ==================== 頁面：近期活動 ==================== */
const EventsPage = () => {
  const [activeId, setActiveId] = useState(null);
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
      <PageHeader title="近期活動" />
      <div className="rounded-3xl overflow-hidden glass-panel">
        <ul className="divide-y divide-white/40 flex flex-col">
          {events.map((ev) => {
            const open = activeId === ev.id;
            return (
              <li key={ev.id} onClick={() => setActiveId(open ? null : ev.id)}
                className={`p-6 md:p-8 cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.02] my-2 rounded-2xl border border-white/80 z-10" : "hover:bg-white/40 border-transparent z-0"}`}>
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-3 rounded-xl flex-shrink-0 backdrop-blur-sm border spring-transition ${open ? "scale-110 shadow-sm" : ""}`}
                      style={ev.status === "upcoming" ? { background: "var(--c-badge-bg)", color: "var(--c-accent)", borderColor: "var(--c-badge-border)" } : {}}>
                      <Icon name="Calendar" size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold mb-1 font-sans ${ev.status === "upcoming" ? "theme-heading" : "opacity-60"}`}>{ev.title}</h3>
                      <p className="text-sm theme-text-secondary">
                        <span className="font-mono bg-white/50 border border-white/40 px-2 py-0.5 rounded shadow-sm">{ev.date}</span>
                      </p>
                    </div>
                  </div>
                  {ev.status === "upcoming" ? (
                    <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border font-sans"
                      style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}>會議內容</span>
                  ) : (
                    <span className="inline-block bg-white/40 border border-white/50 text-xs font-bold px-3 py-1 rounded-full font-sans theme-text-secondary">已歸檔</span>
                  )}
                </div>
                <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 text-sm whitespace-pre-line leading-relaxed font-serif bg-white/30 p-4 rounded-xl shadow-inner content-justify theme-text-secondary theme-divider"
                      style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                      {ev.details}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ==================== 頁面：討論進度 ==================== */
const ColumnsPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const statusColor = (s) => {
    if (s === "待發表") return { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
    if (s === "修改中") return { bg: "rgba(234,179,8,0.15)", color: "#854d0e", border: "rgba(234,179,8,0.3)" };
    if (s === "撰寫中") return { bg: "rgba(139,92,246,0.12)", color: "#5b21b6", border: "rgba(139,92,246,0.25)" };
    if (s === "已發表") return { bg: "rgba(34,197,94,0.12)", color: "#15803d", border: "rgba(34,197,94,0.25)" };
    return { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
  };
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
      <PageHeader title="討論進度" />
      <div className="space-y-6">
        {researchArticles.map((art) => {
          const open = expandedId === art.id;
          const sc = statusColor(art.status);
          const hasAbstract = art.abstract && art.abstract.trim().length > 0;
          return (
            <article key={art.id} onClick={() => setExpandedId(open ? null : art.id)}
              className={`rounded-2xl glass-panel cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.01]" : "glass-card-hover"}`}>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 p-2.5 rounded-xl shrink-0" style={{ background: "var(--c-accent-light)" }}>
                      <Icon name="FileText" size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-sans leading-snug theme-heading">{art.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm theme-text-secondary">
                        <span className="flex items-center gap-1 font-sans"><Icon name="PenLine" size={14} /> {art.author}</span>
                        <span className="flex items-center gap-1 font-mono text-xs opacity-60"><Icon name="Clock" size={14} /> {art.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans shrink-0 border"
                    style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{art.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {art.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full bg-white/50 border border-white/60 theme-text-secondary">
                      <Icon name="Tag" size={12} /> {tag}
                    </span>
                  ))}
                </div>
                <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                      {hasAbstract ? (
                        <>
                          <h4 className="text-sm font-bold font-sans mb-3 flex items-center gap-2 theme-heading">
                            <Icon name="BookOpen" size={16} /> 摘要
                          </h4>
                          <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary mb-4">{art.abstract}</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 py-4 px-5 bg-white/30 rounded-xl text-sm theme-text-secondary font-sans">
                          <Icon name="AlertCircle" size={18} />
                          <span>摘要尚在整理中，敬請期待。</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <span className="text-xs font-sans flex items-center gap-1 theme-text-secondary" style={{ opacity: 0.5 }}>
                    {open ? "收合" : hasAbstract ? "展開摘要" : "查看狀態"}
                    <Icon name="ChevronRight" size={14} className={`spring-transition ${open ? "rotate-90" : ""}`} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

/* ==================== 主應用程式 ==================== */
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "研究室首頁", icon: <Icon name="Home" size={18} /> },
    { id: "about", label: "關於讀書會", icon: <Icon name="Info" size={18} /> },
    { id: "books", label: "資訊分享", icon: <Icon name="Library" size={18} /> },
    { id: "events", label: "近期活動", icon: <Icon name="Calendar" size={18} /> },
    { id: "columns", label: "討論進度", icon: <Icon name="PenLine" size={18} /> },
  ];

  const go = (id) => { setCurrentPage(id); setMobileOpen(false); };

  const page = (() => {
    switch (currentPage) {
      case "home": return <HomePage setPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "books": return <BooksPage />;
      case "events": return <EventsPage />;
      case "columns": return <ColumnsPage />;
      default: return <HomePage setPage={setCurrentPage} />;
    }
  })();

  const themes = {
    home: { primary: "#2d6a6a", primaryDark: "#1a4f4f", accent: "#d4a24e", accentLight: "#fef3d8", text: "#0f3d3d", textSec: "#3a6b6b", blob1: "rgba(77,160,160,0.25)", blob2: "rgba(212,162,78,0.18)", blob3: "rgba(140,190,210,0.18)", footer: "rgba(15,61,61,0.85)", navBg: "rgba(45,106,106,0.9)", navBorder: "rgba(77,160,160,0.5)", badgeBg: "rgba(212,162,78,0.2)", badgeText: "#7a5c1a", badgeBorder: "rgba(212,162,78,0.3)" },
    about: { primary: "#8c6240", primaryDark: "#5e3d24", accent: "#c4935a", accentLight: "#fdf0e0", text: "#3d2414", textSec: "#7a5a3e", blob1: "rgba(196,147,90,0.22)", blob2: "rgba(140,98,64,0.18)", blob3: "rgba(220,180,140,0.2)", footer: "rgba(61,36,20,0.85)", navBg: "rgba(140,98,64,0.9)", navBorder: "rgba(196,147,90,0.5)", badgeBg: "rgba(196,147,90,0.2)", badgeText: "#5e3d24", badgeBorder: "rgba(196,147,90,0.3)" },
    books: { primary: "#8a7a2e", primaryDark: "#5c5218", accent: "#b89a38", accentLight: "#fdf8e8", text: "#3a3410", textSec: "#6b6330", blob1: "rgba(184,154,56,0.22)", blob2: "rgba(138,122,46,0.18)", blob3: "rgba(210,195,120,0.2)", footer: "rgba(58,52,16,0.85)", navBg: "rgba(138,122,46,0.9)", navBorder: "rgba(184,154,56,0.5)", badgeBg: "rgba(184,154,56,0.2)", badgeText: "#5c5218", badgeBorder: "rgba(184,154,56,0.3)" },
    events: { primary: "#3d6878", primaryDark: "#264350", accent: "#6ba0b4", accentLight: "#eaf4f8", text: "#1a3540", textSec: "#4a7080", blob1: "rgba(61,104,120,0.22)", blob2: "rgba(107,160,180,0.18)", blob3: "rgba(80,130,160,0.2)", footer: "rgba(26,53,64,0.85)", navBg: "rgba(61,104,120,0.9)", navBorder: "rgba(107,160,180,0.5)", badgeBg: "rgba(107,160,180,0.2)", badgeText: "#264350", badgeBorder: "rgba(107,160,180,0.3)" },
    columns: { primary: "#4a6a50", primaryDark: "#2e4432", accent: "#8aaa60", accentLight: "#f2f7ec", text: "#1e3322", textSec: "#506a54", blob1: "rgba(74,106,80,0.22)", blob2: "rgba(138,170,96,0.18)", blob3: "rgba(100,150,110,0.2)", footer: "rgba(30,51,34,0.85)", navBg: "rgba(74,106,80,0.9)", navBorder: "rgba(138,170,96,0.5)", badgeBg: "rgba(138,170,96,0.2)", badgeText: "#2e4432", badgeBorder: "rgba(138,170,96,0.3)" },
  };

  const t = themes[currentPage] || themes.home;

  return (
    <div style={{
      "--c-primary": t.primary, "--c-primary-dark": t.primaryDark, "--c-accent": t.accent,
      "--c-accent-light": t.accentLight, "--c-text": t.text, "--c-text-secondary": t.textSec,
      "--c-blob-1": t.blob1, "--c-blob-2": t.blob2, "--c-blob-3": t.blob3,
      "--c-footer": t.footer, "--c-nav-active-bg": t.navBg, "--c-nav-active-border": t.navBorder,
      "--c-badge-bg": t.badgeBg, "--c-badge-text": t.badgeText, "--c-badge-border": t.badgeBorder,
      "--c-selection": `${t.accent}4D`,
      color: t.text, fontFamily: "'Noto Serif TC', serif", minHeight: "100vh", display: "flex", flexDirection: "column",
      transition: "color 500ms ease",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;500;700;900&display=swap');
        @keyframes fadeIn { 0% { opacity:0; transform:translateY(12px);} 100% { opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        @keyframes blobPulse { 0%,100% { opacity:0.6; transform:scale(1);} 50%{ opacity:1; transform:scale(1.05);} }
        .blob-1 { animation: blobPulse 8s ease-in-out infinite; }
        .blob-2 { animation: blobPulse 10s ease-in-out infinite reverse; }
        .blob-3 { animation: blobPulse 12s ease-in-out infinite; }
        .font-sans { font-family: 'Noto Sans TC', sans-serif !important; }
        .font-serif { font-family: 'Noto Serif TC', serif !important; }
        .content-justify { text-align: justify; text-justify: inter-ideograph; overflow-wrap: break-word; word-break: normal; }
        .spring-transition { transition: all 500ms cubic-bezier(0.34,1.56,0.64,1); }
        .glass-panel { background:rgba(255,255,255,0.4); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.6); box-shadow:0 8px 32px rgba(0,0,0,0.05); }
        .glass-card-hover { transition: all 300ms ease; }
        .glass-card-hover:hover { background:rgba(255,255,255,0.6); box-shadow:0 8px 32px rgba(0,0,0,0.1); }
        .theme-text { color: var(--c-text); }
        .theme-text-secondary { color: var(--c-text-secondary); }
        .theme-heading { color: var(--c-primary-dark); }
        .theme-divider { border-color: color-mix(in srgb, var(--c-primary) 15%, transparent); }
      `}} />

      {/* 背景光暈 */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="blob-1" style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "9999px", filter: "blur(100px)", background: "var(--c-blob-1)", transition: "background 800ms ease" }} />
        <div className="blob-2" style={{ position: "absolute", top: "20%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "9999px", filter: "blur(100px)", background: "var(--c-blob-2)", transition: "background 800ms ease" }} />
        <div className="blob-3" style={{ position: "absolute", bottom: "-10%", left: "10%", width: "45vw", height: "45vw", borderRadius: "9999px", filter: "blur(120px)", background: "var(--c-blob-3)", transition: "background 800ms ease" }} />
      </div>

      {/* 導覽列 */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => go("home")}>
              <div style={{ width: "2.5rem", height: "2.5rem", marginRight: "0.75rem", borderRadius: "0.75rem", background: t.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.5)" }}>
                <Icon name="BookOpen" size={20} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif", color: t.primaryDark, transition: "color 500ms ease" }}>中文研究室</span>
            </div>
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "nowrap" }}>
              {navItems.map((item) => (
                <ThemedButton key={item.id} active={currentPage === item.id} onClick={() => go(item.id)}>
                  {item.icon} {item.label}
                </ThemedButton>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flexGrow: 1, maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>
        {page}
      </main>

      {/* 頁尾 */}
      <footer style={{ position: "relative", zIndex: 10, backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", padding: "3rem 0", background: t.footer, transition: "background 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", color: "white", marginBottom: "1rem" }}>
              <div style={{ width: "2rem", height: "2rem", marginRight: "0.5rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.9)", padding: "0.1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="BookOpen" size={16} style={{ color: t.primary }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif" }}>中文研究室</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>快速連結</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>
              {navItems.map((n) => (
                <li key={n.id}><button onClick={() => go(n.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0, fontSize: "0.875rem" }}>{n.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>聯絡資訊</h4>
            <p style={{ fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>Email：zxc998775@gmail.com</p>
          </div>
        </div>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans TC', sans-serif" }}>
          &copy; {new Date().getFullYear()} 中文研究室. All rights reserved.
        </div>
      </footer>
    </div>
  );
}