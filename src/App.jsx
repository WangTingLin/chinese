import React, { useState, useEffect, useRef } from "react";

/* ==================== 模擬資料庫 (Data) ==================== */

const columnArticles = [
  {
    id: 1,
    title: "《詩經‧有瞽》中「瞽」與周初樂制的考察",
    author: "王亭林",
    affiliation: "臺灣師範大學國文學系",
    date: "2026-03-12",
    category: "學術筆記",
    tags: ["詩經", "樂制", "古文字"],
    summary: "本文透過考察「瞽」字在周代樂制中的地位，重新審視《詩經》相關篇章的歷史語境...",
    blocks: [
      { type: "heading", text: "一、前言" },
      { type: "para", text: "《詩經》作為中國最早的詩歌總集，其與周代制禮作樂的傳統息息相關..." }
    ]
  }
];

const FIXED_CATEGORIES = ["全部", "學術筆記", "讀書會紀錄", "文學創作"];

const getCategoryColors = (isDark) => ({
  "學術筆記": { bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)", color: isDark ? "#93c5fd" : "#1e40af", border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)" },
  "學術隨筆": { bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)", color: isDark ? "#93c5fd" : "#1e40af", border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)" },
  "讀書會紀錄": { bg: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)", color: isDark ? "#86efac" : "#166534", border: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)" },
  "文學創作": { bg: isDark ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.12)", color: isDark ? "#fda4af" : "#9f1239", border: isDark ? "rgba(244,63,94,0.4)" : "rgba(244,63,94,0.3)" },
});

const timelineEvents = [
  {
    id: 1,
    title: "一月讀書會",
    date: "2026-01-06",
    status: "past",
    type: "讀書會",
    summary: "新年度首次讀書會，聚焦於日本儒學與經學的孤經問題。",
    details: "【討論論文】\n林昱璋：〈林鵞峰《易》學特色析論──以《周易程傳私考》為例〉\n王亭林：〈何致「孤經」〉",
    archive: []
  },
  {
    id: 2,
    title: "二月讀書會",
    date: "2026-02-15",
    status: "past",
    type: "讀書會",
    summary: "針對易學、尚書學與莊子專題，進行深度的交叉評議與探討。",
    details: "【討論論文】\n林昱璋：〈王弼《易》學史地位的釐定──從牟宗三「兩層存有論」看「以老解易」的合理性〉\n汪博潤：〈重探胡渭《禹貢錐指》之學術史定位〉\n李宗祐：〈解構聖王與安頓性命──《莊子》外、雜篇「至德之世」的士人實踐之道〉",
    archive: []
  },
  {
    id: 3,
    title: "三月讀書會",
    date: "2026-03-12",
    status: "upcoming",
    type: "讀書會",
    summary: "本次讀書會將針對神話學與服飾史進行專題研討，並請兩位發表人針對其研究主題進行初步報告。",
    details: "【討論論文】\n汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉\n陳皓渝：〈歷代冠禮所用服飾演變分析〉",
    archive: []
  }
];

const researchArticles = [
  {
    id: 1,
    title: "何致「孤經」",
    author: "王亭林",
    affiliation: "臺灣師範大學國文學系",
    date: "2026-01-06",
    tags: ["孤經", "經學"],
    status: "已發表",
    abstract: "",
  },
  {
    id: 2,
    title: "林鵞峰《易》學特色析論──以《周易程傳私考》為例",
    author: "林昱璋",
    date: "2026-01-06",
    tags: ["易學", "林鵞峰", "日本儒學"],
    status: "已發表",
    abstract: "作為影響日本乃至東亞深遠的朱子學，在日日本所以以快速發展的原因，在可追溯至江戶初期受到幕府支持的弘文院...",
  },
  {
    id: 6,
    title: "歷代冠禮所用服飾演變分析",
    author: "陳皓渝",
    date: "2026-03-12",
    tags: ["禮制", "服飾史", "冠禮"],
    status: "待發表",
    abstract: "本文以文獻分析法，藉《周禮》、《儀禮》、《禮記》及歷代史書〈禮志〉、〈輿服志〉等材料，考察歷代冠禮所用禮服之演變...",
  },
  {
    id: 7,
    title: "經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究",
    author: "汪博潤",
    date: "2026-03-12",
    tags: ["經學", "神話學", "顧頡剛"],
    status: "待發表",
    abstract: "顧頡剛作為中國神話學奠基人的地位，對於現代神話學的創建，有開創性貢獻...",
  }
];

const nextEvent = {
  date: "2026年3月12日 20:00",
  location: "線上 Google Meet 會議室",
  topic: "神話學與服飾史專題研討",
  papers: [
    "汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉",
    "陳皓渝：〈歷代冠禮所用服飾演變分析〉",
  ],
};

const members = [
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

const promoEvents = [
  {
    id: 1,
    title: "「東亞視域下的經典詮釋」國際學術研討會",
    category: "學術講座",
    date: "2026-05-15",
    speaker: "國內外特邀學者",
    location: "臺灣大學文學院演講廳",
    organizer: "臺大中文系",
    description: "本次研討會邀請國內外多位重要學者，針對東亞儒學、經學及文學中的經典詮釋問題進行深度對話與探討。",
    link: "#"
  },
  {
    id: 2,
    title: "先秦思想文獻解讀工作坊",
    category: "工作坊",
    date: "2026-04-20",
    speaker: "李宗祐 博士生",
    location: "線上 Google Meet 會議室",
    organizer: "中文研究室",
    description: "針對最新出土的簡帛文獻進行共同研讀與釋讀，歡迎對先秦思想與古文字有興趣的同學報名參加。",
    link: "#"
  },
  {
    id: 3,
    title: "《漢學研究》第三十期徵稿",
    category: "徵稿資訊",
    date: "2026-06-30 截止",
    speaker: "", 
    location: "線上投稿系統",
    organizer: "漢學研究中心",
    description: "本期專題為「明清時期的學術轉型與文化交融」，歡迎相關領域之研究者踴躍賜稿。詳細徵稿格式請參閱官網說明。",
    link: "#"
  }
];

/* ==================== 圖示與 Logo ==================== */

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
    ChevronDown: <path d="m6 9 6 6 6-6" />,
    ChevronUp: <path d="m18 15-6-6-6 6" />,
    Folder: (
      <>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </>
    ),
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
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
    Mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    Send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    List: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    Sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </>
    ),
    Moon: (
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    ),
    ArrowUp: (
      <>
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </>
    ),
    Megaphone: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
    MapPin: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
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

const LOGO_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwMCIgem9vbUFuZFBhbj0ibWFnbmlmeSIgdmlld0JveD0iMCAwIDc1MCA3NDkuOTk5OTk1IiBoZWlnaHQ9IjEwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZlcnNpb249IjEuMCI+PGRlZnM+PGNsaXBQYXRoIGlkPSIxZDc5NTdkYTI3Ij48cGF0aCBkPSJNIDc3LjE4MzU5NCA3NiBMIDQzMiA3NiBMIDQzMiAyODYgTCA3Ny4xODM1OTQgMjg2IFogTSA3Ny4xODM1OTQgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYmYyYmY2ZDU4YyI+PHBhdGggZD0iTSA0ODYgNzYgTCA2NzIuNjgzNTk0IDc2IEwgNjcyLjY4MzU5NCA2NjEgTCA0ODYgNjYxIFogTSA0ODYgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYjAxMzNjMTE3MyI+PHBhdGggZD0iTSA3Ny4xODM1OTQgMjA0IEwgNjE4IDIwNCBMIDYxOCA2NzQgTCA3Ny4xODM1OTQgNjc0IFogTSA3Ny4xODM1OTQgMjA0ICIgY2xpcC1ydWxlPSJub256ZXJvIi8+PC9jbGlwUGF0aD48L2RlZnM+PHJlY3QgeD0iLTc1IiB3aWR0aD0iOTAwIiBmaWxsPSIjZmZmZmZmIiB5PSItNzQuOTk5OTk5IiBoZWlnaHQ9Ijg5OS45OTk5OTQiIGZpbGwtb3BhY2l0eT0iMSIvPjxyZWN0IHg9Ii03NSIgd2lkdGg9IjkwMCIgZmlsbD0iI2ZmZmZmZiIgeT0iLTc0Ljk5OTk5OSIgaGVpZ2h0PSI4OTkuOTk5OTk0IiBmaWxsLW9wYWNpdHk9IjEiLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1OS40OTYwOTQgNjE5LjIxODc1IEMgNjUzLjg3MTA5NCA2MzQuNjcxODc1IDYzMi43MjI2NTYgNjUyLjg2NzE4OCA2MTguMzI4MTI1IDY2MC4zOTQ1MzEgTCA2MzQuNTQ2ODc1IDY0Ny4yNzczNDQgQyA2NDIuNTgyMDMxIDYzOS40MjE4NzUgNjUwLjY1NjI1IDYzMS4zODI4MTIgNjU2LjQyNTc4MSA2MjEuOTIxODc1IEMgNjU3LjIzMDQ2OSA2MjAuNTcwMzEyIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1OS40NjA5MzggNjE5LjIxODc1IFogTSA2NTkuNDk2MDk0IDYxOS4yMTg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA1MDAuMDg5ODQ0IDY3My41MDc4MTIgQyA0ODQuOTMzNTk0IDY3My41ODIwMzEgNDY5LjY5OTIxOSA2NzMuNTA3ODEyIDQ1NC41NDI5NjkgNjczLjUwNzgxMiBaIE0gNTAwLjA4OTg0NCA2NzMuNTA3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY2Ny4zODY3MTkgNjAwLjgwNDY4OCBDIDY2NS42MzI4MTIgNjA2LjI4NTE1NiA2NjQuMDIzNDM4IDYxMS45NDUzMTIgNjYwLjM3MTA5NCA2MTYuNTg1OTM4IEMgNjYxLjUwMzkwNiA2MTIuNzg5MDYyIDY2My4zNjcxODggNjA4LjI1NzgxMiA2NjUuMjMwNDY5IDYwMy40MzM1OTQgQyA2NjUuNzQyMTg4IDYwMi4wODIwMzEgNjY0Ljk3MjY1NiA2MDAuMjkyOTY5IDY2Ny4zODY3MTkgNjAwLjgzOTg0NCBaIE0gNjY3LjM4NjcxOSA2MDAuODA0Njg4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBMIDY0Ni43MTA5MzggMTE1LjYyMTA5NCBDIDY0MC4zMjAzMTIgMTA2LjA4NTkzOCA2MjkuNjkxNDA2IDk4LjYzMjgxMiA2MjAuMDgyMDMxIDkxLjkxMDE1NiBDIDYyMi41NjY0MDYgOTEuOTQ1MzEyIDYyNS4wMTU2MjUgOTMuNzM0Mzc1IDYyNy4wMjM0MzggOTUuMDUwNzgxIEMgNjM3LjM5ODQzOCAxMDEuODQ3NjU2IDY0NS41NzgxMjUgMTEwLjc2MTcxOSA2NTIuNTE5NTMxIDEyMC44MDg1OTQgWiBNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2MTkuMjA3MDMxIDkwLjk5NjA5NCBMIDYxNC4xNjQwNjIgODkuNDk2MDk0IEwgNjA5LjU2MjUgODUuNzM0Mzc1IEMgNjEzLjk0NTMxMiA4Ni45NDE0MDYgNjE1LjgwODU5NCA4OC41NDY4NzUgNjE5LjIwNzAzMSA5MC45OTYwOTQgWiBNIDYxOS4yMDcwMzEgOTAuOTk2MDk0ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDYwOC42ODc1IDg1LjczNDM3NSBDIDYwNi45Njg3NSA4NS4zNzEwOTQgNjA0LjYzMjgxMiA4Ni4xMzY3MTkgNjAzLjQyNTc4MSA4My45ODA0NjkgQyA2MDUuMTA1NDY5IDg0LjM4MjgxMiA2MDcuNDgwNDY5IDgzLjU0Mjk2OSA2MDguNjg3NSA4NS43MzQzNzUgWiBNIDYwOC42ODc1IDg1LjczNDM3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgQyA2NjcuNjQwNjI1IDU5OS4wODU5MzggNjY3Ljk2ODc1IDU5Ny41NTA3ODEgNjY4LjI2MTcxOSA1OTYuNDE3OTY5IEwgNjY5LjA2NjQwNiA1OTYuODIwMzEyIFogTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gMTA2IDExMC4yODUxNTYgQyAxMDguMTkxNDA2IDEwNy45MTAxNTYgMTA5LjY5MTQwNiAxMDYuMzM5ODQ0IDExMi4xMzY3MTkgMTA0LjE0ODQzOCBaIE0gMTA2IDExMC4yODUxNTYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgQyA0ODcuNzA3MDMxIDc3LjUxNTYyNSA0ODYuOTQxNDA2IDc4LjM5MDYyNSA0ODYuOTc2NTYyIDc4Ljc1NzgxMiBMIDQzMS44MjQyMTkgNzguNzU3ODEyIEwgNDMwLjk0NTMxMiA3Ny4wMDM5MDYgQyA0NDkuOTAyMzQ0IDc3LjAwMzkwNiA0NjguODk4NDM4IDc2LjkyOTY4OCA0ODcuODU1NDY5IDc3LjAwMzkwNiBaIE0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNkOWIzNmEiIGQ9Ik0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4IEwgMTQ1LjQxNDA2MiAzMDcuMzkwNjI1IEwgMjI5LjUgMzA3LjM5MDYyNSBDIDIyOC4wNzQyMTkgMzIwLjY1MjM0NCAyMjkuMDIzNDM4IDMzMy45NTMxMjUgMjI4LjY2MDE1NiAzNDcuMjg5MDYyIEMgMjI1LjkxNzk2OSA0NTAuNTM1MTU2IDIxOS44MjAzMTIgNTU0LjM2NzE4OCAyMTkuODU1NDY5IDY1Ny43OTY4NzUgTCAxOTUuMzQ3NjU2IDY3My41ODIwMzEgQyAxNzIuNzM4MjgxIDY3My4yMTQ4NDQgMTU3LjUwMzkwNiA2NzMuMjUzOTA2IDEzNi42ODM1OTQgNjYzLjA1ODU5NCBaIE0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjNjI3MjdmIiBkPSJNIDM1NC43MTQ4NDQgNjczLjUwNzgxMiBDIDMyNy41NzQyMTkgNjczLjUwNzgxMiAzMDAuMzk4NDM4IDY3My41ODIwMzEgMjczLjI1NzgxMiA2NzMuNTA3ODEyIEMgMjczLjQ0MTQwNiA2NjguNDI5Njg4IDI3My4wMDM5MDYgNjYzLjI0MjE4OCAyNzMuMjU3ODEyIDY1OC4xNjQwNjIgQyAyNzMuMjk2ODc1IDY1Ny4wMzEyNSAyNzQuMTcxODc1IDY1NS44OTg0MzggMjc0LjE3MTg3NSA2NTUuNTcwMzEyIEwgMjc0LjE3MTg3NSA2MzUuNDM3NSBDIDI3NC4xNzE4NzUgNjMxLjYwMTU2MiAyNzQuODY3MTg4IDYyNS40Mjk2ODggMjc1LjA0Njg3NSA2MjAuOTcyNjU2IEMgMjc5Ljc5Njg3NSA2MjEuNTU0Njg4IDI4My40ODgyODEgNjE4LjE1NjI1IDI4Ny41NzgxMjUgNjE2LjQwNjI1IEMgMzEwLjIyMjY1NiA2MDYuODMyMDMxIDMzMy40OTIxODggNTk4Ljc5Mjk2OSAzNTcuMzc4OTA2IDU5Mi45MTQwNjIgQyAzNTYuNTAzOTA2IDYxNC4wNjY0MDYgMzU1LjUxOTUzMSA2MzUuMjU3ODEyIDM1NC43MTQ4NDQgNjU2LjM3NSBDIDM1NC40OTYwOTQgNjYyLjA3NDIxOSAzNTQuOTkzNTk0IDY2Ny44MDg1OTQgMzU0LjcxNDg0NCA2NzMuNTA3ODEyIFogTSAzNTQuNzE0ODQ0IDY3My41MDc4MTIgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM2MjcyN2YiIGQ9Ik0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5IEMgMjE5Ljg1NTQ2OSA2NjMuMDIzNDM4IDIxOS44NTU0NjkgNjY4LjI4NTE1NiAyMTkuODU1NDY5IDY3My41NDY4NzUgQyAyMTEuNzEwOTM4IDY3My41MDc4MTIgMjAzLjQ5MjE4OCA2NzMuNjkxNDA2IDE5NS4zNDc2NTYgNjczLjU0Njg3NSBaIE0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDliMzZhIiBkPSJNIDM0Mi40NzY1NjIgMzE3IEMgMzUxLjUgMzE3LjAzOTA2MiAzNjAuNTkzNzUgMzE3IDM2OS42MTcxODggMzE3IEMgMzcwLjM0NzY1NiAzMjMuMDI3MzQ0IDM2OC45OTYwOTQgMzI5LjIzODI4MSAzNjguNzQyMTg4IDMzNC45NzY1NjIgQyAzNjYgNDAwLjAwNzgxMiAzNjIuNjc1NzgxIDQ2NC45Mjk2ODggMzU5Ljk3MjY1NiA1MjkuODUxNTYyIEMgMzQyLjAzOTA2MiA1NTEuNzczNDM4IDMyMi40NjA5MzggNTcyLjY3MTg3NSAzMDEuNzUgNTkyLjA3MDMxMiBDIDI5NC41MTU2MjUgNTk4LjgzMjAzMSAyODYuNzM4MjgxIDYwNS4wNzgxMjUgMjc5LjM5NDUzMSA2MTEuNzY1NjI1IEMgMjc4LjMwMDc4MSA2MTIuNzUgMjc3LjYwNTQ2OSA2MTMuOTU3MDMxIDI3NS44OTA2MjUgNjEzLjkyMTg3NSBDIDI3OS43OTY4NzUgNTIwLjQ2NDg0NCAyODIuMDYyNSA0MjYuOTMzNTk0IDI4Ny4yODUxNTYgMzMzLjYyNSBDIDI5My43NSAzMzIuODIwMzEyIDMwMC40NzI2NTYgMzMzLjYyNSAzMDYuOTcyNjU2IDMzMi43NDYwOTQgQyAzMTguNzM0Mzc1IDMzMS4xNDA2MjUgMzI5LjQwMjM0NCAzMjYuMjQyMTg4IDMzOC40MjE4NzUgMzE5LjU1ODU5NCBDIDM0MC4yMTA5MzggMzE4LjI0MjE4OCAzNDIuOTg4MjgxIDMxOS44MTI1IDM0Mi40NDE0MDYgMzE3IFogTSAzNDIuNDc2NTYyIDMxNyAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzY4OGQ5NyIgZD0iTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSBDIDMzMy40NTcwMzEgNTk4Ljc5Mjk2OSAzMTAuMTg3NSA2MDYuODMyMDMxIDI4Ny41MzkwNjIgNjE2LjQ0MTQwNiBDIDI4My40NDkyMTkgNjE4LjE1NjI1IDI3OS43NjE3MTkgNjIxLjU5Mzc1IDI3NS4wMTE3MTkgNjIxLjAwNzgxMiBDIDI3NS4xMjEwOTQgNjE4LjQxNDA2MiAyNzUuODE2NDA2IDYxNi4wMzkwNjIgMjc1Ljg5MDYyNSA2MTMuOTkyMTg4IEMgMjc3LjYwNTQ2OSA2MTMuOTkyMTg4IDI3OC4zMzU5MzggNjEyLjgyNDIxOSAyNzkuMzk0NTMxIDYxMS44MzU5MzggQyAyODYuNjk5MjE5IDYwNS4xNTIzNDQgMjk0LjUxNTYyNSA1OTguOTA2MjUgMzAxLjc1IDU5Mi4xNDQ1MzEgQyAzMjIuNDYwOTM4IDU3Mi43ODEyNSAzNDIuMDAzOTA2IDU1MS44NDc2NTYgMzU5Ljk3MjY1NiA1MjkuOTI1NzgxIEMgMzU5LjA5NzY1NiA1NTAuODk4NDM4IDM1OC4yMTg3NSA1NzIuMTI1IDM1Ny4zNDM3NSA1OTIuOTg0Mzc1IFogTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NlYTI3MiIgZD0iTSAzNDIuNDc2NTYyIDMxNyBDIDM0My4wMjczNDQgMzE5Ljg1MTU2MiAzNDAuMjUgMzE4LjI0MjE4OCAzMzguNDYwOTM4IDMxOS41NTg1OTQgQyAzMjkuNDM3NSAzMjYuMjQ2MDk0IDMxOC43NzM0MzggMzMxLjEwMTU2MiAzMDcuMDExNzE5IDMzMi43NDYwOTQgQyAzMDAuNDcyNjU2IDMzMy42NjAxNTYgMjkzLjc4NTE1NiAzMzIuODIwMzEyIDI4Ny4zMjAzMTIgMzMzLjYyNSBDIDI4Ny42MTMyODEgMzI4LjA3MDMxMiAyODcuNzk2ODc1IDMyMi41MTU2MjUgMjg4LjE5OTIxOSAzMTYuOTY0ODQ0IEMgMzA2LjI3NzM0NCAzMTcuMDM5MDYyIDMyNC40MzM1OTQgMzE2Ljg5MDYyNSAzNDIuNTE1NjI1IDMxNi45NjQ4NDQgWiBNIDM0Mi40NzY1NjIgMzE3ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48ZyBjbGlwLXBhdGg9InVybCgjMWQ3OTU3ZGEyNykiPjxwYXRoIGZpbGw9IiMyZjVkNjQiIGQ9Ik0gNDMwLjkxMDE1NiA3Ny4wMDM5MDYgTCA0MzEuNzg1MTU2IDc4Ljc1NzgxMiBDIDM5NC40OTIxODggMTYyLjM0NzY1NiAzMjYuMTQ4NDM4IDIyOS43MTg3NSAyNDUuMjQyMTg4IDI3MS40NzY1NjIgQyAyNDAuMzQ3NjU2IDI3MS41MTU2MjUgMjM1LjM3ODkwNiAyNzEuMzMyMDMxIDIzMC40ODQzNzUgMjcxLjU4NTkzOCBDIDIyOS4yMDcwMzEgMjczLjc4MTI1IDIyOS42ODM1OTQgMjc2LjE5MTQwNiAyMjkuNSAyNzguNDU3MDMxIEMgMjI0Ljk2ODc1IDI3OS4wMzkwNjIgMjIwLjIyMjY1NiAyODEuMzQzNzUgMjE2LjM1MTU2MiAyODMuNzE4NzUgQyAyMDIuNzk2ODc1IDI4NC4zNzUgMTg5LjIxMDkzOCAyODQuNDEwMTU2IDE3NS43MzA0NjkgMjg0LjY2Nzk2OSBDIDE2Ni41MjczNDQgMjg0Ljg1MTU2MiAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTQ4Ljk1NzAzMSAyODQuMTIxMDk0IEMgMTQ2LjkxMDE1NiAyODMuMzE2NDA2IDE0MS45NDUzMTIgMjc5LjMzMjAzMSAxNDEuNTA3ODEyIDI3OS4zMzIwMzEgTCAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgQyAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgMTE0LjgwNDY4OCAyNzguMTI4OTA2IDExNC44MDQ2ODggMjc4LjAxOTUzMSBMIDExNC44MDQ2ODggMjQwLjc4OTA2MiBMIDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEMgNzcuOTg0Mzc1IDE5MS44NjcxODggNjkuNjk1MzEyIDE0OS4zNzg5MDYgMTA2IDExMC4yODUxNTYgTCAxMTIuMTM2NzE5IDEwNC4xNDg0MzggQyAxMjkuMzc4OTA2IDg4LjYyMTA5NCAxNTIuNTM1MTU2IDc5LjEyMTA5NCAxNzUuNjYwMTU2IDc3LjAwMzkwNiBDIDI2MC43NjU2MjUgNzcuMDc0MjE5IDM0NS44NzUgNzYuODU1NDY5IDQzMC45NDUzMTIgNzcuMDAzOTA2IFogTSA0MzAuOTEwMTU2IDc3LjAwMzkwNiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gNDg2Ljk3NjU2MiA3OC43NTc4MTIgQyA0ODcuMjM0Mzc1IDgzLjI4NTE1NiA0OTEuNjkxNDA2IDkzLjk5MjE4OCA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTguMTIxMDk0IDEzMS4yMjI2NTYgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNTAwLjcxMDkzOCAxNjUuNDE3OTY5IDUwMC4zNDc2NTYgMTg1LjI1NzgxMiA0OTkuMjE0ODQ0IDIwNC44NzUgQyA0NjguODk4NDM4IDIwNS4zODY3MTkgMzkzLjY1MjM0NCAyMTUuMzU5Mzc1IDM5MS40NjA5MzggMjU2LjA5NzY1NiBDIDM5MS4yMDMxMjUgMjYxLjE3NTc4MSAzOTMuOTgwNDY5IDI3OS44MDg1OTQgMzkxLjk3MjY1NiAyODIuODc4OTA2IEMgMzkxLjQyMTg3NSAyODMuNzE4NzUgMzg4LjYwOTM3NSAyODQuMzc1IDM4Ny40ODA0NjkgMjg0LjUxOTUzMSBDIDM4NC42Njc5NjkgMjg0Ljg4NjcxOSAzNzMuMDUwNzgxIDI4NC42Njc5NjkgMzcxLjQ4MDQ2OSAyODUuNjE3MTg4IEMgMzY5LjkxMDE1NiAyODYuNTY2NDA2IDM3MS41ODk4NDQgMjkzLjMyNDIxOSAzNjkuMDMxMjUgMjk0LjEyODkwNiBMIDI3MC4zMDA3ODEgMjk0LjMxMjUgTCAyNjUuNDQxNDA2IDI3MS44Nzg5MDYgQyAyNjQuMjczNDM4IDI3MS4wMzkwNjIgMjQ4LjMxMjUgMjcxLjQ3NjU2MiAyNDUuMjQyMTg4IDI3MS41MTU2MjUgQyAzMjYuMTQ4NDM4IDIyOS43OTI5NjkgMzk0LjQ5MjE4OCAxNjIuMzg2NzE5IDQzMS43ODUxNTYgNzguNzkyOTY5IEwgNDg2Ljk0MTQwNiA3OC43OTI5NjkgWiBNIDQ4Ni45NzY1NjIgNzguNzU3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDViNDcxIiBkPSJNIDQ5My45OTIxODggMjQ1LjE3MTg3NSBDIDQ4OC4xMDkzNzUgMjg2Ljg5NDUzMSA0NzYuMzg2NzE5IDMyOC45NDkyMTkgNDYwLjI3NzM0NCAzNjcuNzg1MTU2IEMgNDU4LjMwNDY4OCAzNzIuNTcwMzEyIDQ0NC45NzI2NTYgMzk5LjI0MjE4OCA0NDQuOTcyNjU2IDQwMS4wNjY0MDYgTCA0NDQuMDk3NjU2IDQwMS4wNjY0MDYgQyA0NDQuMTY3OTY5IDM1Ny4xMTcxODggNDQ0LjA5NzY1NiAzMTMuMTY0MDYyIDQ0NC4wOTc2NTYgMjY5LjIxNDg0NCBDIDQ0NS4xMTcxODggMjQ2LjgxNjQwNiA0NzcuMzcxMDk0IDI0Ni4xOTUzMTIgNDk0LjAyNzM0NCAyNDUuMTcxODc1IFogTSA0OTMuOTkyMTg4IDI0NS4xNzE4NzUgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxnIGNsaXAtcGF0aD0idXJsKCNiZjJiZjZkNThjKSI+PHBhdGggZmlsbD0iIzY3OGY5YSIgZD0iTSA0ODcuODU1NDY5IDc3LjAwMzkwNiBDIDUxNS45NDUzMTIgNzcuMDc0MjE5IDU0Ny4zNTkzNzUgNzUuMTc1NzgxIDU3NC45NzI2NTYgNzcuMDAzOTA2IEMgNTg2LjkxNzk2OSA3Ny44MDg1OTQgNTkzLjQxNzk2OSA4MS42MDU0NjkgNjAzLjQyNTc4MSA4NC4wMTk1MzEgQyA2MDQuNjMyODEyIDg2LjE3MTg3NSA2MDYuOTY4NzUgODUuNDA2MjUgNjA4LjY4NzUgODUuNzY5NTMxIEMgNjA4Ljk4MDQ2OSA4NS44NDM3NSA2MDkuMzA4NTk0IDg1LjY5OTIxOSA2MDkuNTYyNSA4NS43Njk1MzEgTCA2MTQuMTY0MDYyIDg5LjUzNTE1NiBMIDYxOS4yMDcwMzEgOTEuMDMxMjUgQyA2MTkuNTM1MTU2IDkxLjI1IDYxOS43NTM5MDYgOTEuNjkxNDA2IDYyMC4wODIwMzEgOTEuOTEwMTU2IEMgNjI5LjcyNjU2MiA5OC42MzI4MTIgNjQwLjMyMDMxMiAxMDYuMDg1OTM4IDY0Ni43MTA5MzggMTE1LjYyMTA5NCBMIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBDIDY2Mi45NjQ4NDQgMTM1Ljk2ODc1IDY3MS40NzY1NjIgMTU1Ljg4MjgxMiA2NzIuNjQ0NTMxIDE3NC42NjAxNTYgTCA2NzIuNjQ0NTMxIDU3NS4wNDY4NzUgQyA2NzIuNDI1NzgxIDU4Mi42NDQ1MzEgNjcwLjEyNSA1ODkuNDA2MjUgNjY4LjIyNjU2MiA1OTYuNDU3MDMxIEMgNjY3LjkzMzU5NCA1OTcuNTg5ODQ0IDY2Ny42MDU0NjkgNTk5LjEyNSA2NjcuMzQ3NjU2IDU5OS45NjQ4NDQgQyA2NjcuMjc3MzQ0IDYwMC4yMTg3NSA2NjcuNDIxODc1IDYwMC41ODU5MzggNjY3LjM0NzY1NiA2MDAuODM5ODQ0IEMgNjY0LjkzNzUgNjAwLjMyODEyNSA2NjUuNzA3MDMxIDYwMi4wODIwMzEgNjY1LjE5NTMxMiA2MDMuNDMzNTk0IEMgNjYzLjM2NzE4OCA2MDguMjU3ODEyIDY2MS41MDM5MDYgNjEyLjc4OTA2MiA2NjAuMzM1OTM4IDYxNi41ODU5MzggQyA2NjAuMDQyOTY5IDYxNy41IDY1OS43ODkwNjIgNjE4LjMwNDY4OCA2NTkuNDU3MDMxIDYxOS4yMTg3NSBDIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1Ny4yMzA0NjkgNjIwLjU3MDMxMiA2NTYuNDI1NzgxIDYyMS45MjE4NzUgQyA2NTAuNjU2MjUgNjMxLjM4MjgxMiA2NDIuNTQ2ODc1IDYzOS40MjE4NzUgNjM0LjU0Njg3NSA2NDcuMjc3MzQ0IEwgNjE4LjMyODEyNSA2NjAuMzk0NTMxIEwgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY1OC42NDA2MjUgQyA2MTguOTE0MDYyIDY1Ny43MjY1NjIgNjE4LjMyODEyNSA2NTUuMzEyNSA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTkuOTM3NSA1MjQuMTUyMzQ0IDYxNy44MTY0MDYgMzkzLjgzMjAzMSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MDguODMyMDMxIDIxMC4yODEyNSA1NDMuNTkzNzUgMjA0LjEwOTM3NSA0OTkuMjE0ODQ0IDIwNC44NzUgQyA1MDAuMzQ3NjU2IDE4NS4yMTg3NSA1MDAuNzEwOTM4IDE2NS40MTc5NjkgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNDk4LjExNzE4OCAxMzEuMjIyNjU2IDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5MS42NTIzNDQgOTMuOTkyMTg4IDQ4Ny4yMzQzNzUgODMuMjg1MTU2IDQ4Ni45NzY1NjIgNzguNzU3ODEyIEMgNDg2Ljk3NjU2MiA3OC4zOTA2MjUgNDg3LjcwNzAzMSA3Ny41MTU2MjUgNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgWiBNIDQ4Ny44NTU0NjkgNzcuMDAzOTA2ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PHBhdGggZmlsbD0iIzY2OGU5YSIgZD0iTSA1NjQuOTI1NzgxIDY3My41MDc4MTIgQyA1NDQuNTgyMDMxIDY3NC4xMjg5MDYgNTIzLjk4MDQ2OSA2NzMuNDMzNTk0IDUwMy42MzI4MTIgNjczLjUwNzgxMiBDIDQ5OC4zMzk4NDQgNjU5Ljc3MzQzOCA0OTAuNjMyODEyIDY0NC41MzUxNTYgNDgxLjcxODc1IDYzMi44MDg1OTQgQyA0NzUuMjUzOTA2IDYyNC4yNTc4MTIgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ0NS44MTI1IDYwMC44MDQ2ODggQyA0NDYuNTQyOTY5IDUzNS4yNjE3MTkgNDQ0Ljc4OTA2MiA0NjkuNjA1NDY5IDQ0NS44ODY3MTkgNDA0LjA2MjUgQyA0NDUuODg2NzE5IDQwMi40NTcwMzEgNDQ0LjkzNzUgNDAxLjI1IDQ0NC45Mzc1IDQwMS4xMDU0NjkgQyA0NDQuOTM3NSAzOTkuMjc3MzQ0IDQ1OC4yNjk1MzEgMzcyLjYwNTQ2OSA0NjAuMjQyMTg4IDM2Ny44MjAzMTIgQyA0NzYuMzQ3NjU2IDMyOC45ODQzNzUgNDg4LjA3NDIxOSAyODYuODk0NTMxIDQ5My45NTMxMjUgMjQ1LjIxMDkzOCBDIDUwOS4xNDg0MzggMjQ0LjI2MTcxOSA1MjMuNjg3NSAyNDQuNTg5ODQ0IDUzOC43NzM0MzggMjQ4LjEzMjgxMiBDIDU1MC43OTI5NjkgMjUwLjk0NTMxMiA1NjMuMTcxODc1IDI1NS40MDIzNDQgNTY0Ljc4MTI1IDI2OS4zOTQ1MzEgTCA1NjQuODkwNjI1IDY3My41NDY4NzUgWiBNIDU2NC45MjU3ODEgNjczLjUwNzgxMiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzYxNzI3ZSIgZD0iTSA0NDUuODEyNSA2MDAuODA0Njg4IEMgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ3NS4yMTQ4NDQgNjI0LjI1NzgxMiA0ODEuNzE4NzUgNjMyLjgwODU5NCBDIDQ5MC42MzI4MTIgNjQ0LjU3NDIxOSA0OTguMzM5ODQ0IDY1OS43Njk1MzEgNTAzLjYzMjgxMiA2NzMuNTA3ODEyIEMgNTAyLjQ2NDg0NCA2NzMuNTA3ODEyIDUwMS4yOTY4NzUgNjczLjUwNzgxMiA1MDAuMTI4OTA2IDY3My41MDc4MTIgTCA0NTQuNTc4MTI1IDY3My41MDc4MTIgQyA0NTEuMzYzMjgxIDY3My41MDc4MTIgNDQ4LjE0ODQzOCA2NzMuNTA3ODEyIDQ0NC45Mzc1IDY3My41MDc4MTIgQyA0NDMuNDAyMzQ0IDY0OS4zOTQ1MzEgNDQ0LjA5Mzc1IDYyNS4wMjczNDQgNDQ0LjA1ODU5NCA2MDAuODA0Njg4IEMgNDQ0LjYwNTQ2OSA2MDAuOTE0MDYyIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NS44MTI1IDYwMC44MDQ2ODggWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM1YTg1OTIiIGQ9Ik0gNjE3LjQ1MzEyNSA2NTguNjQwNjI1IEMgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNi41NzgxMjUgNjQ3LjIzODI4MSA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgTCA2MTYuNTc4MTI1IDI3My42MzI4MTIgQyA2MTYuNTc4MTI1IDI3MS42OTkyMTkgNjE4LjM2NzE4OCAyNjcuMzEyNSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MTcuODU1NDY5IDM5My44MzIwMzEgNjE5LjkzNzUgNTI0LjE1MjM0NCA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTguMzI4MTI1IDY1NS4zMTI1IDYxOC44Nzg5MDYgNjU3LjcyNjU2MiA2MTcuNDUzMTI1IDY1OC42NDA2MjUgWiBNIDYxNy40NTMxMjUgNjU4LjY0MDYyNSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI2IwMTMzYzExNzMpIj48cGF0aCBmaWxsPSIjZmVmZWZlIiBkPSJNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSBDIDU0My41NTg1OTQgMjA0LjEwOTM3NSA2MDguODMyMDMxIDIxMC4zMjAzMTIgNjE3LjQ1MzEyNSAyNjQuNDI1NzgxIEMgNjE4LjM2NzE4OCAyNjcuMjc3MzQ0IDYxNi41NzgxMjUgMjcxLjY5OTIxOSA2MTYuNTc4MTI1IDI3My42MzI4MTIgTCA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgQyA2MTYuNTc4MTI1IDY0Ny4yMzgyODEgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNy40NTMxMjUgNjU4LjY0MDYyNSBDIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY2MC4zMjAzMTIgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE2LjEwMTU2MiA2NjMuNDI1NzgxIDU5OC4zODY3MTkgNjY5LjEyNSA1OTQuMzY3MTg4IDY3MC4xNDg0MzggQyA1ODQuMzI0MjE5IDY3Mi42MzI4MTIgNTcxLjIyNjU2MiA2NzMuMjE0ODQ0IDU2NC45MjU3ODEgNjczLjU0Njg3NSBMIDU2NC44MTY0MDYgMjY5LjM5NDUzMSBDIDU2My4yMTA5MzggMjU1LjQwMjM0NCA1NTAuNzkyOTY5IDI1MC45MTAxNTYgNTM4LjgwODU5NCAyNDguMTMyODEyIEMgNTIzLjcyMjY1NiAyNDQuNjI1IDUwOS4xODc1IDI0NC4yNTc4MTIgNDkzLjk5MjE4OCAyNDUuMjEwOTM4IEMgNDc3LjMzNTkzOCAyNDYuMjY5NTMxIDQ0NS4wNDY4NzUgMjQ2Ljg1NTQ2OSA0NDQuMDU4NTk0IDI2OS4yNSBDIDQ0NC4wNTg1OTQgMzEzLjE5OTIxOSA0NDQuMTMyODEyIDM1Ny4xODc1IDQ0NC4wNTg1OTQgNDAxLjEwNTQ2OSBDIDQ0My45ODQzNzUgNDY3LjY3MTg3NSA0NDMuOTQ5MjE5IDUzNC4yNzM0MzggNDQ0LjA1ODU5NCA2MDAuODM5ODQ0IEMgNDQ0LjA1ODU5NCA2MjUuMDYyNSA0NDMuNDAyMzQ0IDY0OS40MzM1OTQgNDQ0LjkzNzUgNjczLjU0Njg3NSBDIDQxNC44NzUgNjczLjU4MjAzMSAzODQuNzc3MzQ0IDY3My41NDY4NzUgMzU0LjcxNDg0NCA2NzMuNTQ2ODc1IEMgMzU0Ljg5ODQzOCA2NjcuODgyODEyIDM1NC40NTcwMzEgNjYyLjEwOTM3NSAzNTQuNzE0ODQ0IDY1Ni40MTAxNTYgQyAzNTUuNTE5NTMxIDYzNS4yOTI5NjkgMzU2LjUwMzkwNiA2MTQuMDY2NDA2IDM1Ny4zNzg5MDYgNTkyLjk0OTIxOSBDIDM1OC4yNTc4MTIgNTcxLjgzMjAzMSAzNTkuMTMyODEyIDU1MC44NTkzNzUgMzYwLjAxMTcxOSA1MjkuODkwNjI1IEMgMzYyLjcxNDg0NCA0NjQuOTI5Njg4IDM2Ni4wMzkwNjIgNDAwLjAwNzgxMiAzNjguNzc3MzQ0IDMzNS4wMTE3MTkgQyAzNjkuMDMxMjUgMzI5LjI3NzM0NCAzNzAuMzgyODEyIDMyMy4wNjY0MDYgMzY5LjY1MjM0NCAzMTcuMDM5MDYyIEMgMzYwLjYzMjgxMiAzMTcuMDM5MDYyIDM1MS41MzUxNTYgMzE3LjA3NDIxOSAzNDIuNTE1NjI1IDMxNy4wMzkwNjIgQyAzMjQuNDMzNTk0IDMxNi45MjU3ODEgMzA2LjMxNjQwNiAzMTcuMTA5Mzc1IDI4OC4xOTkyMTkgMzE3LjAzOTA2MiBDIDI4Ny43OTY4NzUgMzIyLjU1NDY4OCAyODcuNjUyMzQ0IDMyOC4xNDQ1MzEgMjg3LjMyMDMxMiAzMzMuNjk1MzEyIEMgMjgyLjA5NzY1NiA0MjcuMDA3ODEyIDI3OS44MzIwMzEgNTIwLjUzNTE1NiAyNzUuOTI1NzgxIDYxMy45OTIxODggQyAyNzUuODUxNTYyIDYxNi4wMDM5MDYgMjc1LjE2MDE1NiA2MTguNDE0MDYyIDI3NS4wNDY4NzUgNjIxLjAwNzgxMiBDIDI3NC44NjcxODggNjI1LjQ2NDg0NCAyNzQuMTcxODc1IDYzMS42NDA2MjUgMjc0LjE3MTg3NSA2MzUuNDc2NTYyIEwgMjc0LjE3MTg3NSA2NTUuNjA1NDY5IEMgMjc0LjE3MTg3NSA2NTUuOTMzNTk0IDI3My4yOTY4NzUgNjU3LjA2NjQwNiAyNzMuMjU3ODEyIDY1OC4xOTkyMTkgQyAyNzMuMDM5MDYyIDY2My4zMTY0MDYgMjczLjQ3NjU2MiA2NjguNDY0ODQ0IDI3My4yNTc4MTIgNjczLjU0Njg3NSBDIDI1NS40Njg3NSA2NzMuNTA3ODEyIDIzNy42NDQ1MzEgNjczLjY1NjI1IDIxOS44MjAzMTIgNjczLjU0Njg3NSBDIDIxOS44MjAzMTIgNjY4LjI4NTE1NiAyMTkuODIwMzEyIDY2My4wMjM0MzggMjE5LjgyMDMxMiA2NTcuNzYxNzE5IEMgMjE5Ljc4NTE1NiA1NTQuMzY3MTg4IDIyNS44ODI4MTIgNDUwLjUzNTE1NiAyMjguNjIxMDk0IDM0Ny4yNSBDIDIyOC45ODgyODEgMzMzLjk1MzEyNSAyMjguMDM5MDYyIDMyMC42MTcxODggMjI5LjQ2NDg0NCAzMDcuMzU1NDY5IEwgMTQ1LjM3ODkwNiAzMDcuMzU1NDY5IEwgMTM2LjYwOTM3NSA2NjIuOTg4MjgxIEMgMTA1LjU2MjUgNjQ3Ljc4OTA2MiA4My45NzY1NjIgNjE3LjkwMjM0NCA3OC44OTg0MzggNTgzLjU5NzY1NiBDIDc3LjE4MzU5NCA0NjkuNDk2MDk0IDc3Ljk0OTIxOSAzNTUuMDM1MTU2IDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIEMgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIDExNS45NzI2NTYgMjc5LjMzMjAzMSAxMTYuMDgyMDMxIDI3OS4zMzIwMzEgTCAxNDEuNDY4NzUgMjc5LjMzMjAzMSBDIDE0MS45MDYyNSAyNzkuMzMyMDMxIDE0Ni44NzUgMjgzLjM1MTU2MiAxNDguOTIxODc1IDI4NC4xMjEwOTQgQyAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTY2LjQ5MjE4OCAyODQuODUxNTYyIDE3NS42OTUzMTIgMjg0LjY2Nzk2OSBDIDE4OS4xNzE4NzUgMjg0LjQxMDE1NiAyMDIuNzk2ODc1IDI4NC4zNzUgMjE2LjMxMjUgMjgzLjcxODc1IEMgMjE2LjQyMTg3NSAyODMuNzc4NzUgMjE2LjUzMTI1IDI4NC44MTI1IDIxOC40Njg3NSAyODQuNjY3OTY5IEMgMjIwLjI1NzgxMiAyODQuNTU4NTk0IDIyNi45MDYyNSAyODMuOTM3NSAyMjggMjgzLjYwOTM3NSBDIDIzMC4xMjEwOTQgMjgyLjkxNDA2MiAyMjkuMjgxMjUgMjgwLjE3MTg3NSAyMjkuNDI1NzgxIDI3OC40NTcwMzEgQyAyMjkuNjQ0NTMxIDI3Ni4xNTYyNSAyMjkuMTMyODEyIDI3My43ODEyNSAyMzAuNDE0MDYyIDI3MS41ODU5MzggQyAyMzUuMzA4NTk0IDI3MS4yOTY4NzUgMjQwLjI3MzQzOCAyNzEuNTE1NjI1IDI0NS4xNjc5NjkgMjcxLjQ3NjU2MiBDIDI0OC4yMzgyODEgMjcxLjQ3NjU2MiAyNjQuMTk5MjE5IDI3MS4wMDM5MDYgMjY1LjM2NzE4OCAyNzEuODQzNzUgTCAyNzAuMjI2NTYyIDI5NC4yNzczNDQgTCAzNjguOTYwOTM4IDI5NC4wOTM3NSBDIDM3MS40ODA0NjkgMjkzLjI4OTA2MiAzNjkuODAwNzgxIDI4Ni41MzEyNSAzNzEuNDA2MjUgMjg1LjU4MjAzMSBDIDM3My4wMTU2MjUgMjg0LjYyODkwNiAzODQuNTkzNzUgMjg0Ljg1MTU2MiAzODcuNDA2MjUgMjg0LjQ4NDM3NSBDIDM4OC41MzkwNjIgMjg0LjMzOTg0NCAzOTEuMzUxNTYyIDI4My43MTg3NSAzOTEuODk4NDM4IDI4Mi44Mzk4NDQgQyAzOTMuOTA2MjUgMjc5Ljc3MzQzOCAzOTEuMTMyODEyIDI2MS4xNDA2MjUgMzkxLjM4NjcxOSAyNTYuMDU4NTk0IEMgMzkzLjU3ODEyNSAyMTUuMzU5Mzc1IDQ2OC44MjQyMTkgMjA1LjM1MTU2MiA0OTkuMTQwNjI1IDIwNC44Mzk4NDQgWiBNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiM1NDgyOGYiIGQ9Ik0gNDQ1LjgxMjUgNjAwLjgwNDY4OCBDIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NC42MDU0NjkgNjAwLjkxNDA2MiA0NDQuMDU4NTk0IDYwMC44MDQ2ODggQyA0NDMuOTQ5MjE5IDUzNC4yMzgyODEgNDQzLjk4NDM3NSA0NjcuNjMyODEyIDQ0NC4wNTg1OTQgNDAxLjA2NjQwNiBMIDQ0NC45Mzc1IDQwMS4wNjY0MDYgQyA0NDQuOTM3NSA0MDEuMDY2NDA2IDQ0NS44ODY3MTkgNDAyLjQxNzk2OSA0NDUuODg2NzE5IDQwNC4wMjczNDQgQyA0NDQuNzg5MDYyIDQ2OS41NzAzMTIgNDQ2LjU3ODEyNSA1MzUuMjIyNjU2IDQ0NS44MTI1IDYwMC43NjU2MjUgWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gMjI5LjUgMjc4LjQ1NzAzMSBDIDIyOS4zNTE1NjIgMjgwLjE3MTg3NSAyMzAuMTk1MzEyIDI4Mi45MTQwNjIgMjI4LjA3NDIxOSAyODMuNjA5Mzc1IEMgMjI2Ljk4MDQ2OSAyODMuOTcyNjU2IDIyMC4zMzIwMzEgMjg0LjU1ODU5NCAyMTguNTQyOTY5IDI4NC42Njc5NjkgQyAyMTYuNjA1NDY5IDI4NC44MTI1IDIxNi40OTYwOTQgMjgzLjcxODc1IDIxNi4zODY3MTkgMjgzLjcxODc1IEMgMjIwLjI1NzgxMiAyODEuMzQzNzUgMjI1LjAwNzgxMiAyNzkuMDQyOTY5IDIyOS41MzUxNTYgMjc4LjQ1NzAzMSBaIE0gMjI5LjUgMjc4LjQ1NzAzMSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+";

const LogoImage = ({ className = "" }) => (
  <img
    src={LOGO_SRC}
    alt="中文研究室 LOGO"
    className={`object-cover bg-white ${className}`}
  />
);

/* ==================== 共用元件 ==================== */

const ThemedButton = ({ active, children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border font-sans spring-transition hover:scale-105 active:scale-95 ${className}`}
    style={
      active
        ? { background: "var(--c-nav-active-bg)", color: "#fff", borderColor: "var(--c-nav-active-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
        : { borderColor: "transparent", color: "var(--c-text-secondary)" }
    }
  >
    {children}
  </button>
);

const PageHeader = ({ title }) => (
  <div className="text-center space-y-4">
    <h2 className="text-3xl font-bold font-sans theme-heading">{title}</h2>
    <div className="w-16 h-1 mx-auto rounded-full" style={{ background: "var(--c-accent)" }} />
  </div>
);

const BlockRenderer = ({ block, index, articleId }) => {
  if (!block) return null;
  switch (block.type) {
    case "heading": return (
      <h4 id={`article-${articleId}-heading-${index}`} className="text-xl md:text-2xl font-bold theme-heading mt-10 mb-5 flex items-center gap-3" style={{ scrollMarginTop: "120px" }}>
        <span style={{ width: "5px", height: "1.2em", background: "var(--c-accent)", borderRadius: "4px" }}></span>{block.text}
      </h4>
    );
    case "table": return (
      <div className="my-8 overflow-x-auto rounded-xl border glass-panel shadow-sm font-sans">
        <table className="w-full text-left border-collapse min-w-[500px]">
          {block.caption && <caption className="py-3 px-4 text-sm font-bold theme-heading bg-white/50 border-b border-white/60">{block.caption}</caption>}
          <thead className="bg-white/40 theme-heading text-sm border-b border-white/40">
            <tr>{block.headers.map((h, i) => <th key={i} className="py-3 px-5 font-bold whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y theme-text-secondary text-sm border-white/30">
            {block.rows.map((row, rIdx) => <tr key={rIdx} className="hover-bg-surface transition-colors">{row.map((cell, cIdx) => <td key={cIdx} className="py-3 px-5">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    );
    case "quote": return (
      <blockquote className="my-8 pl-5 py-4 border-l-4 font-kai leading-relaxed theme-text-secondary bg-white/40 rounded-r-xl shadow-sm" style={{ borderColor: "var(--c-accent)" }}>
        {block.text}
      </blockquote>
    );
    case "para": return <p className="leading-relaxed theme-text-secondary mb-4" style={{ textIndent: "2em" }}>{block.text}</p>;
    case "list": return (
      <ul className="space-y-3 my-6 px-4 md:px-8 theme-text-secondary">
        {(block.items || []).map((item, idx) => (
          <li key={idx} className="leading-relaxed relative pl-6">
            <span className="absolute left-0 top-2.5 w-2 h-2 rounded-full" style={{ background: "var(--c-accent)", opacity: 0.8 }}></span>{item}
          </li>
        ))}
      </ul>
    );
    default: return null;
  }
};

const ReadingProgress = ({ targetRef, color, isDarkMode }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const offsetTop = 80;
      const scrollableHeight = rect.height - window.innerHeight + offsetTop;
      if (scrollableHeight <= 0) { setProgress(0); return; }
      const scrolled = offsetTop - rect.top;
      setProgress(Math.max(0, Math.min(100, (scrolled / scrollableHeight) * 100)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    const timer = setTimeout(handleScroll, 500);
    handleScroll();
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleScroll); clearTimeout(timer); };
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[9999] backdrop-blur-sm" style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', pointerEvents: 'none' }}>
      <div className="h-full shadow-sm" style={{ width: `${progress}%`, backgroundColor: color, transition: 'width 100ms ease-out' }} />
    </div>
  );
};

/* ==================== 分頁元件 (Pages) ==================== */

const HomePage = ({ setPage, isDarkMode }) => {
  const latestArticle = columnArticles.length > 0 ? columnArticles[columnArticles.length - 1] : null;
  const catColors = getCategoryColors(isDarkMode);
  const latestArtColor = latestArticle ? (catColors[latestArticle.category] || { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.3)" }) : null;

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-black/20' : 'from-white/30'} to-transparent pointer-events-none`}></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest font-sans theme-heading relative z-10">中文研究室</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif content-justify theme-text-secondary relative z-10" style={{ textAlignLast: "center" }}>
          「獨學而無友，則孤陋而寡聞。」<br />──《禮記‧學記》
        </p>
        <button onClick={() => setPage("about")} className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto spring-transition hover:scale-105 active:scale-95 border relative z-10" style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}>
          探索研究室 <Icon name="ChevronRight" size={20} />
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "文章專欄", icon: "BookOpen", target: "articles" },
          { title: "研討進度", icon: "Calendar", target: "events" },
          { title: "資訊分享", icon: "Library", target: "books" }
        ].map((item, i) => (
          <div key={i} onClick={() => setPage(item.target)} className="p-8 rounded-3xl glass-panel glass-card-hover cursor-pointer group flex flex-col items-center text-center border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm" style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)" }}>
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans theme-heading transition-colors duration-300 group-hover:text-[var(--c-accent)]">{item.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col" onClick={() => setPage("events")}>
          <div className="flex justify-between items-start mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border" style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)", borderColor: "var(--c-badge-border)" }}>
              <Icon name="Calendar" size={16} /> 近期研討
            </div>
            <span className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1">查看全部 <Icon name="ChevronRight" size={16} /></span>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors hover:bg-white/70 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-5 font-sans theme-heading">{nextEvent.topic}</h3>
            <div className="space-y-4 flex-1">
              {[["時間", nextEvent.date], ["地點", nextEvent.location]].map(([l, v]) => (
                <p key={l} className="flex items-start gap-3 theme-text"><strong className="min-w-16 font-sans shrink-0">{l}：</strong><span>{v}</span></p>
              ))}
              <div className="flex items-start gap-3 theme-text">
                <strong className="min-w-16 font-sans shrink-0">論文：</strong>
                <ul className="space-y-2">
                  {nextEvent.papers.map((p, i) => <li key={i} className="leading-relaxed relative pl-4"><span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--c-accent)" }}></span>{p}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {latestArticle && (
          <section className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer group flex flex-col" onClick={() => setPage("articles")}>
            <div className="flex justify-between items-start mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border" style={{ background: isDarkMode ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.1)", color: isDarkMode ? "#fda4af" : "#e11d48", borderColor: isDarkMode ? "rgba(244,63,94,0.4)" : "rgba(244,63,94,0.2)" }}>
                <Icon name="PenLine" size={16} /> 最新上架
              </div>
              <span className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 group-hover:opacity-100 transition-opacity mt-1">前往專欄 <Icon name="ChevronRight" size={16} /></span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors group-hover:bg-white/70 flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors" style={{ background: latestArtColor.bg, color: latestArtColor.color, borderColor: latestArtColor.border }}><Icon name="Folder" size={14} className="opacity-70" /> {latestArticle.category}</span>
                <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70"><Icon name="Calendar" size={14} /> {latestArticle.date}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-4 leading-snug group-hover:text-[var(--c-accent)] transition-colors line-clamp-2">{latestArticle.title}</h3>
              <div className="flex items-center gap-2 text-sm theme-text-secondary font-sans mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: latestArtColor.color, opacity: 0.9 }}>{latestArticle.author[0]}</span>
                <span className="font-medium">{latestArticle.author}</span><span className="opacity-50">｜</span><span className="opacity-80 text-xs">{latestArticle.affiliation}</span>
              </div>
              <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary line-clamp-3 opacity-80 border-t border-white/40 pt-4 mt-auto">{latestArticle.summary}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ActivitiesPage = ({ isDarkMode }) => {
  const [filterCat, setFilterCat] = useState("全部");
  const categories = ["全部", "學術講座", "工作坊", "徵稿資訊"];
  const getPromoColors = (isDark) => ({
    "學術講座": { bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)", color: isDark ? "#93c5fd" : "#1e40af", border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)" },
    "工作坊": { bg: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)", color: isDark ? "#86efac" : "#166534", border: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)" },
    "徵稿資訊": { bg: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.12)", color: isDark ? "#fde047" : "#b45309", border: isDark ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.3)" },
  });
  const promoColors = getPromoColors(isDarkMode);
  const filteredEvents = promoEvents.filter(ev => filterCat === "全部" || ev.category === filterCat);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
      <PageHeader title="近期活動" />
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => {
          const isActive = filterCat === cat;
          const cColor = promoColors[cat];
          return (
            <button key={cat} onClick={() => setFilterCat(cat)} className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
              style={isActive ? { background: cat === "全部" ? "var(--c-nav-active-bg)" : cColor?.color || "var(--c-primary)", color: "#fff", borderColor: cat === "全部" ? "var(--c-nav-active-border)" : cColor?.color || "var(--c-primary)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } : { background: "rgba(var(--c-panel-rgb), 0.4)", borderColor: "rgba(var(--c-border-rgb), 0.6)", color: "var(--c-text-secondary)" }}>
              {cat}
            </button>
          )
        })}
      </div>
      <div className="space-y-6 md:space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl theme-text-secondary font-sans"><Icon name="Megaphone" size={40} className="mx-auto mb-4 opacity-30" /><p>近期暫無「{filterCat}」的相關活動資訊。</p></div>
        ) : (
          filteredEvents.map((ev) => {
            const cColor = promoColors[ev.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
            return (
              <article key={ev.id} className="rounded-3xl glass-panel overflow-hidden glass-card-hover border border-white/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors" style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}>{ev.category}</span>
                    <span className="text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70"><Icon name="Calendar" size={14} /> {ev.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-3">{ev.title}</h3>
                  <div className="flex flex-col gap-2 mb-5 text-sm theme-text-secondary font-sans">
                    {ev.speaker && <span className="flex items-center gap-2"><Icon name="Users" size={16} className="opacity-60"/> 講者：{ev.speaker}</span>}
                    <span className="flex items-center gap-2"><Icon name="Info" size={16} className="opacity-60"/> 主辦：{ev.organizer}</span>
                    <span className="flex items-center gap-2"><Icon name="MapPin" size={16} className="opacity-60"/> 地點：{ev.location}</span>
                  </div>
                  <p className="text-base leading-relaxed font-serif content-justify theme-text-secondary border-t border-white/40 pt-4 mt-2">{ev.description}</p>
                </div>
                {ev.link && (
                  <a href={ev.link} target="_blank" rel="noopener noreferrer" className="shrink-0 w-full md:w-auto mt-2 md:mt-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold font-sans shadow-sm hover:-translate-y-0.5 transition-all border" style={{ background: cColor.color, color: "#fff", borderColor: cColor.color }}>
                    查看詳情 <Icon name="ExternalLink" size={16} />
                  </a>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

const BooksPage = () => {
  const getDomain = (url) => { try { return new URL(url).hostname; } catch { return ""; } };
  return (
    <div className="space-y-16 animate-fade-in relative z-10">
      <PageHeader title="資訊分享" />
      <div className="space-y-12 max-w-5xl mx-auto">
        {resourceCategories.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-2xl font-bold font-sans flex items-center gap-3 pb-4 theme-heading theme-divider" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
              <div className="p-2.5 rounded-xl border border-white/40 bg-white/40 text-[var(--c-primary-dark)]"><Icon name={cat.icon} size={24} /></div>{idx + 1}. {cat.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.links.map((link, li) => {
                const domain = getDomain(link.url);
                return (
                  <a key={li} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center p-5 rounded-2xl glass-panel glass-card-hover hover:-translate-y-1 shadow-sm">
                    <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-white/60 shrink-0 overflow-hidden text-[var(--c-primary)]">
                      <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-7 h-7 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E"; e.target.className = "w-6 h-6 object-contain opacity-50"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold font-sans transition-colors truncate theme-heading">{link.name}</h4>
                      <p className="text-xs font-mono mt-1 truncate theme-text-secondary" style={{ opacity: 0.5 }}>{domain}</p>
                    </div>
                    <Icon name="ExternalLink" size={18} className="shrink-0 ml-3 opacity-20 group-hover:opacity-70 transition-opacity theme-text-secondary" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPage = ({ isDarkMode }) => {
  const getFieldColors = (isDark) => ({
    "春秋學": { bg: isDark ? "rgba(212,162,78,0.2)" : "rgba(212,162,78,0.15)", color: isDark ? "#fde68a" : "#7a5c1a", border: isDark ? "rgba(212,162,78,0.4)" : "rgba(212,162,78,0.35)" },
    "先秦思想": { bg: isDark ? "rgba(74,106,80,0.2)" : "rgba(74,106,80,0.15)", color: isDark ? "#86efac" : "#2e4432", border: isDark ? "rgba(74,106,80,0.4)" : "rgba(74,106,80,0.35)" },
    "易學": { bg: isDark ? "rgba(61,104,120,0.2)" : "rgba(61,104,120,0.15)", color: isDark ? "#bae6fd" : "#1a3a4a", border: isDark ? "rgba(61,104,120,0.4)" : "rgba(61,104,120,0.35)" },
    "尚書學": { bg: isDark ? "rgba(140,98,64,0.2)" : "rgba(140,98,64,0.15)", color: isDark ? "#fdba74" : "#5e3d24", border: isDark ? "rgba(140,98,64,0.4)" : "rgba(140,98,64,0.35)" },
    "現代文學": { bg: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)", color: isDark ? "#d8b4fe" : "#4c1d95", border: isDark ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.3)" },
    "文字學": { bg: isDark ? "rgba(220,38,38,0.2)" : "rgba(220,38,38,0.1)", color: isDark ? "#fca5a5" : "#7f1d1d", border: isDark ? "rgba(220,38,38,0.4)" : "rgba(220,38,38,0.25)" },
    "中國哲學": { bg: isDark ? "rgba(234,179,8,0.2)" : "rgba(234,179,8,0.12)", color: isDark ? "#fde047" : "#713f12", border: isDark ? "rgba(234,179,8,0.4)" : "rgba(234,179,8,0.3)" },
  });
  const colors = getFieldColors(isDarkMode);
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
      <PageHeader title="關於讀書會" />
      <div className="p-8 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-6 theme-text">
        <p className="text-lg font-serif content-justify">
          在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松...
        </p>
        <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
          <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">讀書會成員</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m, i) => {
              const fc = colors[m.field] || { bg: isDarkMode ? "rgba(148,163,184,0.2)" : "rgba(100,116,139,0.12)", color: isDarkMode ? "#cbd5e1" : "#475569", border: isDarkMode ? "rgba(148,163,184,0.4)" : "rgba(100,116,139,0.25)" };
              return (
                <div key={i} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg font-sans shadow-sm" style={{ background: "var(--c-primary)", opacity: 0.85 }}>{m.name[0]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-base font-sans theme-heading">{m.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border font-sans transition-colors" style={{ background: fc.bg, color: fc.color, borderColor: fc.border }}>{m.field}</span>
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

const EventsPage = ({ isDarkMode }) => {
  const [viewMode, setViewMode] = useState("timeline"); 
  const [activeEventId, setActiveEventId] = useState(null);
  const [eventFilter, setEventFilter] = useState("all");
  const [expandedArticleId, setExpandedArticleId] = useState(null);

  const displayEvents = [...timelineEvents.filter(ev => eventFilter === "all" || ev.status === eventFilter)].reverse();
  const displayResearchArticles = [...researchArticles].reverse();

  const getTypeColor = (type, isDark) => {
    if (type === "讀書會") return isDark ? { bg: "rgba(59,130,246,0.2)", color: "#93c5fd", border: "rgba(59,130,246,0.4)" } : { bg: "rgba(59,130,246,0.12)", color: "#1d4ed8", border: "rgba(59,130,246,0.3)" };
    return isDark ? { bg: "rgba(148,163,184,0.2)", color: "#cbd5e1", border: "rgba(148,163,184,0.4)" } : { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.3)" };
  };

  const getStatusColor = (s, isDark) => {
    if (s === "待發表") return { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
    if (s === "已發表") return isDark ? { bg: "rgba(34,197,94,0.2)", color: "#86efac", border: "rgba(34,197,94,0.4)" } : { bg: "rgba(34,197,94,0.12)", color: "#15803d", border: "rgba(34,197,94,0.25)" };
    return isDark ? { bg: "rgba(148,163,184,0.2)", color: "#cbd5e1", border: "rgba(148,163,184,0.4)" } : { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      <PageHeader title="研討進度" />
      <div className="flex justify-center mb-6 md:mb-10">
        <div className="inline-flex bg-white/40 p-1.5 rounded-full border border-white/60 shadow-inner backdrop-blur-sm">
          <button onClick={() => setViewMode("timeline")} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold font-sans spring-transition ${viewMode === "timeline" ? "bg-white shadow-md text-[var(--c-primary-dark)]" : "text-[var(--c-text-secondary)] hover-bg-surface"}`}><Icon name="Calendar" size={18} /> 研討歷程</button>
          <button onClick={() => setViewMode("articles")} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold font-sans spring-transition ${viewMode === "articles" ? "bg-white shadow-md text-[var(--c-primary-dark)]" : "text-[var(--c-text-secondary)] hover-bg-surface"}`}><Icon name="ClipboardList" size={18} /> 討論進度</button>
        </div>
      </div>
      {viewMode === "timeline" && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-center gap-3">
            {[{ id: "all", label: "全部" }, { id: "upcoming", label: "即將舉辦" }, { id: "past", label: "已舉辦" }].map(btn => (
              <button key={btn.id} onClick={() => setEventFilter(btn.id)} className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95" style={eventFilter === btn.id ? { background: "var(--c-nav-active-bg)", color: "#fff", borderColor: "var(--c-nav-active-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } : { background: "rgba(var(--c-panel-rgb), 0.4)", borderColor: "rgba(var(--c-border-rgb), 0.6)", color: "var(--c-text-secondary)" }}>{btn.label}</button>
            ))}
          </div>
          <div className="relative pl-8 md:pl-12 pb-8">
            <div className="absolute top-8 bottom-0 left-[15px] md:left-[23px] w-px border-l-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--c-primary) 30%, transparent)" }}></div>
            <div className="space-y-10">
              {displayEvents.map((ev) => {
                const open = activeEventId === ev.id;
                const typeStyle = getTypeColor(ev.type, isDarkMode);
                return (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-6 md:-left-8 top-7 w-4 h-4 rounded-full border-[3px] shadow-sm z-10" style={{ backgroundColor: "rgba(var(--c-panel-rgb), 1)", borderColor: "var(--c-primary)" }}></div>
                    <article onClick={() => setActiveEventId(open ? null : ev.id)} className={`rounded-2xl glass-panel cursor-pointer spring-transition border border-white/60 ${open ? "bg-white/70 shadow-xl scale-[1.02]" : "glass-card-hover hover:-translate-y-1"}`}>
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans border shrink-0 transition-colors" style={{ background: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}>{ev.type}</span>
                            <span className="text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70"><Icon name="Calendar" size={14} /> {ev.date}</span>
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-3">{ev.title}</h3>
                        <p className="text-base md:text-lg leading-relaxed font-serif content-justify theme-text-secondary mb-2">{ev.summary}</p>
                        <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                          <div className="overflow-hidden"><div className="pt-5 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}><div className="text-sm md:text-base whitespace-pre-line leading-relaxed font-serif bg-white/30 p-5 rounded-xl shadow-inner content-justify theme-text-secondary mb-4 border border-white/40">{ev.details}</div></div></div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {viewMode === "articles" && (
        <div className="space-y-6 animate-fade-in">
          {displayResearchArticles.map((art) => {
            const open = expandedArticleId === art.id;
            const sc = getStatusColor(art.status, isDarkMode);
            return (
              <article key={art.id} onClick={() => setExpandedArticleId(open ? null : art.id)} className={`rounded-2xl glass-panel cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.01]" : "glass-card-hover"}`}>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold font-sans theme-heading">{art.title}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{art.status}</span>
                  </div>
                  <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="overflow-hidden"><div className="pt-4 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}><p className="text-sm leading-relaxed theme-text-secondary">{art.abstract || "摘要整理中..."}</p></div></div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ArticlesPage = ({ isDarkMode }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterCat, setFilterCat] = useState("全部");
  const activeArticleRef = useRef(null);
  const catColors = getCategoryColors(isDarkMode);
  const displayArticles = [...(filterCat === "全部" ? columnArticles : columnArticles.filter(a => a.category === filterCat))].reverse();
  const openArticle = displayArticles.find(a => a.id === expandedId);
  const activeCatColor = openArticle ? (catColors[openArticle.category] || { color: "var(--c-primary)" }) : null;

  return (
    <>
      {expandedId && activeCatColor && <ReadingProgress targetRef={activeArticleRef} color={activeCatColor.color} isDarkMode={isDarkMode} />}
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
        <PageHeader title="文章專欄" />
        <div className="flex flex-wrap gap-2 justify-center">
          {FIXED_CATEGORIES.map(cat => {
            const isActive = filterCat === cat;
            const cColor = catColors[cat];
            return (
              <button key={cat} onClick={() => setFilterCat(cat)} className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95" style={isActive ? { background: cat === "全部" ? "var(--c-nav-active-bg)" : cColor?.color || "var(--c-primary)", color: "#fff", borderColor: cat === "全部" ? "var(--c-nav-active-border)" : cColor?.color || "var(--c-primary)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } : { background: "rgba(var(--c-panel-rgb), 0.4)", borderColor: "rgba(var(--c-border-rgb), 0.6)", color: "var(--c-text-secondary)" }}>{cat}</button>
            )
          })}
        </div>
        <div className="space-y-6 md:space-y-8">
          {displayArticles.map((a) => {
            const open = expandedId === a.id;
            const cColor = catColors[a.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
            return (
              <article key={a.id} ref={open ? activeArticleRef : null} className={`rounded-3xl glass-panel overflow-hidden spring-transition border border-white/60 ${open ? "shadow-2xl bg-white/70" : "glass-card-hover cursor-pointer"}`}>
                <div className="p-5 md:p-8 relative" onClick={() => setExpandedId(open ? null : a.id)}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border" style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}><Icon name="Folder" size={14} className="opacity-70" /> {a.category}</span></div>
                  <h3 className="text-xl md:text-3xl font-bold font-sans theme-heading mb-4">{a.title}</h3>
                  <div className={`grid spring-transition ${open ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}><div className="overflow-hidden"><p className="text-sm md:text-base leading-relaxed font-serif content-justify theme-text-secondary mb-4 p-4 rounded-2xl bg-white/30 border border-white/40 shadow-inner">{a.summary}</p></div></div>
                </div>
                <div className={`grid spring-transition ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 md:px-8 pb-16 pt-2"><div className="theme-divider pt-6 mb-6" style={{ borderTopWidth: "2px", borderTopStyle: "dashed" }}></div>
                      <div className="font-serif text-[1.05rem] md:text-lg leading-loose content-justify theme-text">
                        {(a.blocks || []).map((b, idx) => <BlockRenderer key={idx} block={b} index={idx} articleId={a.id} />)}
                      </div>
                      <div className="mt-12 flex justify-center pb-4"><button onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold font-sans border" style={{ background: cColor.color, color: "white", borderColor: cColor.color }}><Icon name="ChevronUp" size={18} /> 收合文章</button></div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
};

const SubmissionPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
    <PageHeader title="投稿須知" />
    <div className="p-6 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-10 theme-text">
      <section><h3 className="text-xl md:text-2xl font-bold mb-4 font-sans theme-heading flex items-center gap-2"><Icon name="PenLine" size={24} style={{ color: "var(--c-accent)" }} /> 徵稿範圍</h3><p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">本專欄歡迎屬於中文學科的相關領域的學術筆記、書評、文學創作或學術論文。</p></section>
      <section><h3 className="text-xl md:text-2xl font-bold mb-4 font-sans theme-heading flex items-center gap-2"><Icon name="Send" size={24} style={{ color: "var(--c-accent)" }} /> 投稿方式</h3><p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">請將稿件寄至：zxc998775@gmail.com</p></section>
    </div>
  </div>
);

/* ==================== 主應用程式 ==================== */

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navItems = [
    { id: "home", label: "研究室首頁", icon: <Icon name="Home" size={18} /> },
    { id: "activities", label: "近期活動", icon: <Icon name="Megaphone" size={18} /> },
    { id: "books", label: "資訊分享", icon: <Icon name="Library" size={18} /> },
    { id: "about", label: "關於讀書會", icon: <Icon name="Info" size={18} /> },
    { id: "events", label: "研討進度", icon: <Icon name="Calendar" size={18} /> },
    { id: "articles", label: "文章專欄", icon: <Icon name="BookOpen" size={18} /> },
    { id: "submission", label: "投稿須知", icon: <Icon name="Send" size={18} /> },
  ];

  const go = (id) => { setCurrentPage(id); setMobileOpen(false); scrollToTop(); };

  const pageProps = { setPage: setCurrentPage, isDarkMode };
  const page = (() => {
    switch (currentPage) {
      case "home": return <HomePage {...pageProps} />;
      case "about": return <AboutPage {...pageProps} />;
      case "books": return <BooksPage {...pageProps} />;
      case "events": return <EventsPage {...pageProps} />;
      case "articles": return <ArticlesPage {...pageProps} />;
      case "activities": return <ActivitiesPage {...pageProps} />;
      case "submission": return <SubmissionPage {...pageProps} />;
      default: return <HomePage {...pageProps} />;
    }
  })();

  const baseThemes = {
    home: { primary: "#2d6a6a", primaryDark: "#1a4f4f", accent: "#d4a24e", accentLight: "#fef3d8", text: "#0f3d3d", textSec: "#3a6b6b", blob1: "rgba(77,160,160,0.25)", blob2: "rgba(212,162,78,0.18)", blob3: "rgba(140,190,210,0.18)", footer: "rgba(15,61,61,0.85)", navBg: "rgba(45,106,106,0.9)", navBorder: "rgba(77,160,160,0.5)", badgeBg: "rgba(212,162,78,0.2)", badgeText: "#7a5c1a", badgeBorder: "rgba(212,162,78,0.3)" },
    about: { primary: "#8c6240", primaryDark: "#5e3d24", accent: "#c4935a", accentLight: "#fdf0e0", text: "#3d2414", textSec: "#7a5a3e", blob1: "rgba(196,147,90,0.22)", blob2: "rgba(140,98,64,0.18)", blob3: "rgba(220,180,140,0.2)", footer: "rgba(61,36,20,0.85)", navBg: "rgba(140,98,64,0.9)", navBorder: "rgba(196,147,90,0.5)", badgeBg: "rgba(196,147,90,0.2)", badgeText: "#5e3d24", badgeBorder: "rgba(196,147,90,0.3)" },
    books: { primary: "#8a7a2e", primaryDark: "#5c5218", accent: "#b89a38", accentLight: "#fdf8e8", text: "#3a3410", textSec: "#6b6330", blob1: "rgba(184,154,56,0.22)", blob2: "rgba(138,122,46,0.18)", blob3: "rgba(210,195,120,0.2)", footer: "rgba(58,52,16,0.85)", navBg: "rgba(138,122,46,0.9)", navBorder: "rgba(184,154,56,0.5)", badgeBg: "rgba(184,154,56,0.2)", badgeText: "#5c5218", badgeBorder: "rgba(184,154,56,0.3)" },
    events: { primary: "#3d6878", primaryDark: "#264350", accent: "#6ba0b4", accentLight: "#eaf4f8", text: "#1a3540", textSec: "#4a7080", blob1: "rgba(61,104,120,0.22)", blob2: "rgba(107,160,180,0.18)", blob3: "rgba(80,130,160,0.2)", footer: "rgba(26,53,64,0.85)", navBg: "rgba(61,104,120,0.9)", navBorder: "rgba(107,160,180,0.5)", badgeBg: "rgba(107,160,180,0.2)", badgeText: "#264350", badgeBorder: "rgba(107,160,180,0.3)" },
    articles: { primary: "#475569", primaryDark: "#1e293b", accent: "#94a3b8", accentLight: "#f1f5f9", text: "#0f172a", textSec: "#334155", blob1: "rgba(71,85,105,0.22)", blob2: "rgba(100,116,139,0.18)", blob3: "rgba(30,41,59,0.2)", footer: "rgba(15,23,42,0.85)", navBg: "rgba(30,41,59,0.9)", navBorder: "rgba(100,116,139,0.5)", badgeBg: "rgba(100,116,139,0.2)", badgeText: "#1e293b", badgeBorder: "rgba(100,116,139,0.3)" },
    columns: { primary: "#4a6a50", primaryDark: "#2e4432", accent: "#8aaa60", accentLight: "#f2f7ec", text: "#1e3322", textSec: "#506a54", blob1: "rgba(74,106,80,0.22)", blob2: "rgba(138,170,96,0.18)", blob3: "rgba(100,150,110,0.2)", footer: "rgba(30,51,34,0.85)", navBg: "rgba(74,106,80,0.9)", navBorder: "rgba(138,170,96,0.5)", badgeBg: "rgba(138,170,96,0.2)", badgeText: "#2e4432", badgeBorder: "rgba(138,170,96,0.3)" },
    activities: { primary: "#0284c7", primaryDark: "#0369a1", accent: "#38bdf8", accentLight: "#e0f2fe", text: "#0c4a6e", textSec: "#0369a1", blob1: "rgba(2,132,199,0.22)", blob2: "rgba(56,189,248,0.18)", blob3: "rgba(3,105,161,0.2)", footer: "rgba(8,47,73,0.85)", navBg: "rgba(3,105,161,0.9)", navBorder: "rgba(2,132,199,0.5)", badgeBg: "rgba(2,132,199,0.2)", badgeText: "#0369a1", badgeBorder: "rgba(2,132,199,0.3)" },
    submission: { primary: "#b45309", primaryDark: "#7c2d12", accent: "#f59e0b", accentLight: "#ffedd5", text: "#431407", textSec: "#9a3412", blob1: "rgba(180,83,9,0.22)", blob2: "rgba(124,45,18,0.18)", blob3: "rgba(245,158,11,0.2)", footer: "rgba(67,20,7,0.85)", navBg: "rgba(124,45,18,0.9)", navBorder: "rgba(180,83,9,0.5)", badgeBg: "rgba(180,83,9,0.2)", badgeText: "#7c2d12", badgeBorder: "rgba(180,83,9,0.3)" },
  };

  const bTheme = baseThemes[currentPage] || baseThemes.home;
  const t = {
    ...bTheme,
    primaryDark: isDarkMode ? "#f8fafc" : bTheme.primaryDark,
    text: isDarkMode ? "#f1f5f9" : bTheme.text,
    textSec: isDarkMode ? "#cbd5e1" : bTheme.textSec,
    navBg: isDarkMode ? "rgba(15,23,42,0.9)" : bTheme.navBg,
    navBorder: isDarkMode ? "rgba(255,255,255,0.15)" : bTheme.navBorder,
    footer: isDarkMode ? "rgba(2,6,23,0.95)" : bTheme.footer,
    badgeBg: isDarkMode ? bTheme.badgeBorder : bTheme.badgeBg,
    badgeText: isDarkMode ? bTheme.accentLight : bTheme.badgeText,
    badgeBorder: isDarkMode ? bTheme.badgeBg : bTheme.badgeBorder,
  };

  return (
    <div style={{
      "--c-primary": t.primary, "--c-primary-dark": t.primaryDark, "--c-accent": t.accent, "--c-accent-light": t.accentLight, 
      "--c-text": t.text, "--c-text-secondary": t.textSec,
      "--c-blob-1": t.blob1, "--c-blob-2": t.blob2, "--c-blob-3": t.blob3,
      "--c-footer": t.footer, "--c-nav-active-bg": t.navBg, "--c-nav-active-border": t.navBorder,
      "--c-badge-bg": t.badgeBg, "--c-badge-text": t.badgeText, "--c-badge-border": t.badgeBorder,
      "--c-panel-rgb": isDarkMode ? "30, 41, 59" : "255, 255, 255",
      "--c-border-rgb": isDarkMode ? "148, 163, 184" : "255, 255, 255",
      backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
      color: t.text, fontFamily: "'Noto Serif TC', serif", minHeight: "100vh", display: "flex", flexDirection: "column",
      transition: "background-color 500ms ease, color 500ms ease",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;500;700;900&display=swap');
        @keyframes fadeIn { 0% { opacity:0; transform:translateY(12px);} 100% { opacity:1; transform:translateY(0);} }
        @keyframes fadeInUp { 0% { opacity:0; transform:translateY(20px) scale(0.98);} 100% { opacity:1; transform:translateY(0) scale(1);} }
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        @keyframes blobMove1 { 0% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.7; } 50% { transform: translate(45vw, 25vh) scale(1.8) rotate(45deg) skew(-10deg, 10deg); opacity: 1; } 100% { transform: translate(-20vw, 40vh) scale(0.9) rotate(90deg); opacity: 0.6; } }
        @keyframes blobMove2 { 0% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.8; } 50% { transform: translate(-45vw, 30vh) scale(2) rotate(-45deg) skew(10deg, -10deg); opacity: 1; } 100% { transform: translate(35vw, -30vh) scale(0.9) rotate(-90deg); opacity: 0.7; } }
        @keyframes blobMove3 { 0% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.7; } 50% { transform: translate(35vw, -45vh) scale(1.7) rotate(45deg) skew(-10deg, -10deg); opacity: 1; } 100% { transform: translate(-40vw, 25vh) scale(1.2) rotate(90deg); opacity: 0.6; } }
        .blob-1 { animation: blobMove1 10s infinite alternate ease-in-out; } .blob-2 { animation: blobMove2 12s infinite alternate ease-in-out; } .blob-3 { animation: blobMove3 14s infinite alternate ease-in-out; }

        .font-sans { font-family: 'Noto Sans TC', sans-serif !important; }
        .font-serif { font-family: 'Noto Serif TC', serif !important; }
        .font-kai { font-family: 'Kaiti TC', 'BiauKai', 'DFKai-SB', 'AR PL UKai TW', serif !important; }
        .content-justify { text-align: justify; text-justify: inter-ideograph; overflow-wrap: break-word; word-break: normal; }
        .spring-transition { transition: all 500ms cubic-bezier(0.34,1.56,0.64,1); }
        .theme-text { color: var(--c-text); transition: color 500ms ease; }
        .theme-text-secondary { color: var(--c-text-secondary); transition: color 500ms ease; }
        .theme-heading { color: var(--c-primary-dark); transition: color 500ms ease; }
        .theme-divider { border-color: color-mix(in srgb, var(--c-primary) 15%, transparent); }

        .glass-panel { background: rgba(var(--c-panel-rgb), 0.4) !important; backdrop-filter: blur(20px); border: 1px solid rgba(var(--c-border-rgb), ${isDarkMode ? '0.2' : '0.6'}) !important; box-shadow: 0 8px 32px rgba(0,0,0,${isDarkMode ? '0.3' : '0.05'}); transition: all 500ms ease; }
        .glass-panel:hover { background: rgba(var(--c-panel-rgb), ${isDarkMode ? '0.6' : '0.6'}) !important; }
        .glass-card-hover { transition: all 300ms ease; }
        .glass-card-hover:hover { background: rgba(var(--c-panel-rgb), ${isDarkMode ? '0.5' : '0.6'}) !important; box-shadow: 0 8px 32px rgba(0,0,0,${isDarkMode ? '0.4' : '0.1'}) !important; }
        
        .bg-white { background-color: rgba(var(--c-panel-rgb), 1) !important; transition: background-color 500ms ease; }
        .bg-white\\/30 { background-color: rgba(var(--c-panel-rgb), 0.3) !important; }
        .bg-white\\/40 { background-color: rgba(var(--c-panel-rgb), 0.4) !important; }
        .bg-white\\/50 { background-color: rgba(var(--c-panel-rgb), 0.5) !important; }
        .bg-white\\/60 { background-color: rgba(var(--c-panel-rgb), 0.6) !important; }
        .bg-white\\/70 { background-color: rgba(var(--c-panel-rgb), 0.7) !important; }
        .bg-white\\/80 { background-color: rgba(var(--c-panel-rgb), 0.8) !important; }
        
        .border-white\\/30 { border-color: rgba(var(--c-border-rgb), ${isDarkMode ? '0.15' : '0.3'}) !important; transition: border-color 500ms ease; }
        .border-white\\/40 { border-color: rgba(var(--c-border-rgb), ${isDarkMode ? '0.2' : '0.4'}) !important; transition: border-color 500ms ease; }
        .border-white\\/50 { border-color: rgba(var(--c-border-rgb), ${isDarkMode ? '0.25' : '0.5'}) !important; transition: border-color 500ms ease; }
        .border-white\\/60 { border-color: rgba(var(--c-border-rgb), ${isDarkMode ? '0.3' : '0.6'}) !important; transition: border-color 500ms ease; }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
      `}} />

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="blob-1" style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "9999px", filter: "blur(60px)", background: "var(--c-blob-1)", transition: "background 800ms ease" }} />
        <div className="blob-2" style={{ position: "absolute", top: "20%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "9999px", filter: "blur(60px)", background: "var(--c-blob-2)", transition: "background 800ms ease" }} />
        <div className="blob-3" style={{ position: "absolute", bottom: "-10%", left: "10%", width: "45vw", height: "45vw", borderRadius: "9999px", filter: "blur(80px)", background: "var(--c-blob-3)", transition: "background 800ms ease" }} />
      </div>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(var(--c-panel-rgb), 0.3)", backdropFilter: "blur(20px)", borderBottom: `1px solid rgba(var(--c-border-rgb), ${isDarkMode ? '0.15' : '0.4'})`, boxShadow: `0 1px 3px rgba(0,0,0,${isDarkMode ? '0.3' : '0.05'})`, transition: "all 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }} onClick={() => go("home")}>
              <LogoImage className="w-10 h-10 mr-3 rounded-xl shadow-sm border border-white/50" />
              <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif", color: t.primaryDark, transition: "color 500ms ease" }}>中文研究室</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="desktop-nav" style={{ display: "flex", gap: "0.375rem", flexWrap: "nowrap" }}>
                {navItems.map((item) => (
                  <ThemedButton key={item.id} active={currentPage === item.id} onClick={() => go(item.id)}>{item.icon} {item.label}</ThemedButton>
                ))}
              </div>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-xl backdrop-blur-sm border spring-transition hover:scale-105 active:scale-95 flex items-center justify-center" style={{ background: "rgba(var(--c-panel-rgb), 0.4)", borderColor: `rgba(var(--c-border-rgb), ${isDarkMode ? '0.3' : '0.5'})`, color: "var(--c-primary-dark)", boxShadow: `0 2px 8px rgba(0,0,0,${isDarkMode ? '0.2' : '0.05'})` }} title={isDarkMode ? "切換至亮色模式" : "切換至暗色模式"}>
                <Icon name={isDarkMode ? "Sun" : "Moon"} size={20} />
              </button>
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ padding: "0.5rem", background: "rgba(var(--c-panel-rgb), 0.4)", borderRadius: "0.5rem", backdropFilter: "blur(8px)", border: `1px solid rgba(var(--c-border-rgb), ${isDarkMode ? '0.3' : '0.5'})`, color: t.primaryDark, cursor: "pointer" }}>
                <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: `rgba(var(--c-panel-rgb), ${isDarkMode ? '0.95' : '0.85'})`, backdropFilter: "blur(20px)", borderBottom: `1px solid rgba(var(--c-border-rgb), ${isDarkMode ? '0.2' : '0.5'})`, boxShadow: `0 8px 24px rgba(0,0,0,${isDarkMode ? '0.5' : '0.08'})`, position: "absolute", width: "100%", left: 0 }} className="animate-fade-in">
            <div style={{ padding: "0.75rem 1rem 1.25rem" }}>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => go(item.id)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "1rem", fontWeight: 500, fontFamily: "'Noto Sans TC', sans-serif", border: "1px solid", cursor: "pointer", marginBottom: "0.25rem", transition: "all 200ms ease", background: currentPage === item.id ? `rgba(var(--c-panel-rgb), ${isDarkMode ? '0.6' : '0.8'})` : "transparent", borderColor: currentPage === item.id ? `rgba(var(--c-border-rgb), ${isDarkMode ? '0.3' : '0.9'})` : "transparent", color: currentPage === item.id ? t.primaryDark : t.textSec }}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main style={{ flexGrow: 1, maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem 6rem", width: "100%" }}>
        <div key={currentPage} className="animate-fade-in-up">{page}</div>
      </main>

      <button onClick={scrollToTop} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 p-3.5 rounded-full shadow-2xl spring-transition z-50 flex items-center justify-center border hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] active:scale-95" style={{ background: "var(--c-primary)", color: "white", borderColor: "var(--c-primary-dark)", opacity: showScrollTop ? 1 : 0, transform: showScrollTop ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)", pointerEvents: showScrollTop ? "auto" : "none" }} aria-label="回到頂部">
        <Icon name="ArrowUp" size={24} />
      </button>

      <footer style={{ position: "relative", zIndex: 10, backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "3rem 0", background: t.footer, transition: "background 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="footer-grid">
            <div style={{ marginBottom: "1rem" }}><div style={{ display: "flex", alignItems: "center", color: "white", marginBottom: "0.5rem" }}><LogoImage className="w-8 h-8 mr-2 rounded-lg border border-white/30" /><span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif" }}>中文研究室</span></div></div>
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>快速連結</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "0.5rem 1.5rem", fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>
                {navItems.map((n) => <li key={n.id}><button onClick={() => go(n.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0, fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif", transition: "color 300ms" }} className="hover:text-white">{n.label}</button></li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>聯絡資訊</h4>
              <p style={{ fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>Email：zxc998775@gmail.com</p>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "1.5rem 1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Noto Sans TC', sans-serif" }}>
          &copy; {new Date().getFullYear()} 中文研究室. All rights reserved.
        </div>
      </footer>
    </div>
  );
}