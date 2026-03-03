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
    Sparkles: (
      <>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </>
    ),
    Loader2: (
      <>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </>
    ),
    Wand2: (
      <>
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
        <path d="m14 7 3 3" />
        <path d="M5 6v4" />
        <path d="M19 14v4" />
        <path d="M10 2v2" />
        <path d="M7 8H3" />
        <path d="M21 16h-4" />
        <path d="M11 3H9" />
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
  const [hasError, setHasError] = useState(false);

  if (hasError) {
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
  }

  return (
    <img
      src="logo.png"
      alt="中文研究室 LOGO"
      className={`object-cover ${className}`}
      onError={() => setHasError(true)}
    />
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
      "本文以文獻分析法，藉《周禮》、《儀禮》、《禮記》及歷代史書〈禮志〉、〈輿服志〉等材料，考察歷代冠禮所用禮服之演變，並分析其所反映之禮制精神。若察歷代冠禮所用禮服，可分四類：冕弁類、梁冠類、襆頭類、巾帽類，四類禮服使用的身分等級、場合輕重各有制度，而施行於冠禮皆遵循《禮記．冠義》所謂「三加彌尊」之義；同時反映時代社會的變遷下，各朝代的禮服制度仍遵循「時為大」的制禮原則，以及「彰顯尊卑」以穩定秩序的目的。然《儀禮．士冠禮》的「三加冠」禮儀與「三加彌尊」的禮義，係奠基於周朝以封建而建立「龐大宗族」的社會結構；但秦漢以後的朝代已非周代的封建社會，使「龐大宗族」的社會結構消失，導致加冠次數所象徵之多重社會角色失去現實基礎，促使冠禮於秦漢以降逐漸衰微乃至消亡。",
  },
  {
    id: 3,
    title: "王弼《易》學史地位的釐定──從牟宗三「兩層存有論」看「以老解易」的合理性",
    author: "林昱璋",
    date: "2026-02-03",
    tags: ["易學", "王弼", "牟宗三"],
    status: "已發表",
    abstract:
      "王弼《易》注「以傳解經」與「以老解易」兩個面向，自湯用彤以降遂成為諸多學者的共識。然而，經筆者耙梳，自古代以來對於王弼以老解易之批判，或多或少出自一定的意識形態，不論是政治立場或學術之爭，同時亦沒有根據文獻給出確切證據。而自牟宗三始，不但以「兩層存有論」分判儒釋道各家，更建構起王弼以老解易的面貌。然而，筆者以為若將牟宗三對於王弼《易》學的論述，置於其所提出的「兩層存有論」的架構下來看，反而有更加鮮明的儒家的影子，且從王弼《易》注諸多被討論有《老》學影子的原文來看，卻可以找到淵源於傳文之處。因此，筆者以為與其將王弼《易》學分為兩大面向，不如以「以傳解經」來作為王弼《易》學的代表。在不執著於王弼注《老》的淵源，而正面肯定王弼並非背離儒家《易》的傳統。",
  },
  {
    id: 4,
    title: "重探胡渭《禹貢錐指》之學術史定位",
    author: "汪博潤",
    date: "2026-02-03",
    tags: ["禹貢錐指", "胡渭", "清初學術"],
    status: "已發表",
    abstract:
      "胡渭《禹貢錐指》是清初學術的要籍之一。民初以來之學術史研究，常以「漢宋兼採」作為其學術定位的一個特點。這緣於敘述者限於自身體例與旨趣的需要，有選擇性地接受清儒對《錐指》的評價。為此，本文綜合分析《錐指》涉及之傳注與胡渭之個人表述，論證為何「知古」與「知今」才是完整理解《錐指》不容偏廢的兩端。又根據對30條〈略例〉、全書174組傳文之系統性解讀與檢覈，嘗試指出胡渭具備的「水利與水患」思維，是解讀《錐指》、通貫其古今之說的核心線索。由此，建議將清初之河渠水道要籍，一併納入現行研究的比較視閾中。此舉將為後續審視清初〈禹貢〉學之發展、尋求《錐指》在學術史上之合適定位，提供基於經學與「地理之學」兩個層面之佐證。",
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
      "作為影響日本乃至東亞深遠的朱子學，之所以能在日本快速發展，可追溯至江戶初期受到幕府支持的弘文院（後世昌平黌的前身），而有開創之功的林羅山、林鵞峰父子，二人的學說便成為理解江戶初期儒學的重要關鍵。由於二人直繼五經的治學傾向，而《易》為五經之首，林家《易》學實可作為重要的探索對象。因林鵞峰有專門性《易》著傳世，本文特以其為主要討論對象。其一系列《易》著，可勾勒出尊崇宋學、但持開放態度吸收新舊學說，且仔細區分程朱《易》學的特色。實際上以其尊崇的程頤《易傳》來看，可以梳理出其闡明與發揮程《傳》義理、引歷史證程《傳》、與引典明辭義三個核心作法。可以發現雖其有廣博的治學態度，但仍不免有體系紊亂之失。而在義理的層面上，可以發現鵞峰在嚴別程朱的同時，仍把握二者以理與太極的共通性，其後才藉著二人對卜筮不同的態度，回應自己身為日本儒者的時代關懷。可以發現林鵞峰作為江戶初期的學者，保有開闊的態度以吸收中國東傳之學，並進一步將其作為回應自身時代課題的材料，對於管窺江戶初期《易》學，實為一值得關注的對象。",
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
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255,255,255,0.5)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "";
        e.currentTarget.style.borderColor = "transparent";
      }
    }}
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
      <p
        className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif content-justify theme-text-secondary"
        style={{ textAlignLast: "center" }}
      >
        「獨學而無友，則孤陋而寡聞。」
        <br />
        ──《禮記‧學記》
      </p>
      <button
        onClick={() => setPage("about")}
        className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto spring-transition hover:scale-105 active:scale-95 border"
        style={{
          background: "var(--c-nav-active-bg)",
          borderColor: "var(--c-nav-active-border)",
        }}
      >
        探索研究室 <Icon name="ChevronRight" size={20} />
      </button>
    </section>

    <section className="rounded-3xl p-8 md:p-12 glass-panel glass-card-hover">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 backdrop-blur-sm font-sans border"
        style={{
          background: "var(--c-badge-bg)",
          color: "var(--c-badge-text)",
          borderColor: "var(--c-badge-border)",
        }}
      >
        <Icon name="Calendar" size={16} /> 近期研討
      </div>

      <h2 className="text-3xl font-bold mb-4 font-sans theme-heading">
        三月讀書會
      </h2>

      <div className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
        {[
          ["時間", nextEvent.date],
          ["地點", nextEvent.location],
          ["主題", nextEvent.topic],
        ].map(([l, v]) => (
          <p key={l} className="flex items-start gap-3 theme-text">
            <strong className="min-w-16 font-sans shrink-0">{l}：</strong>
            <span>{v}</span>
          </p>
        ))}

        <div className="flex items-start gap-3 theme-text">
          <strong className="min-w-16 font-sans shrink-0">論文：</strong>
          <ul className="space-y-2">
            {nextEvent.papers.map((p, i) => (
              <li key={i} className="leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </div>
);

/* ==================== 頁面：關於讀書會 ==================== */
const AboutPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
    <PageHeader title="關於讀書會" />

    <div className="p-8 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-6 theme-text">
      <p className="text-lg font-serif content-justify">
        在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松，研究者們往往花費大量的時間與古籍對話，與前人理論交流。然而，新的知識並不是古人或個人所能生產，它勢必須要與時代建立溝通的橋樑，而學術寫作就是將已經内化的思考透過文字與公共社會進行對話，尋求建立新的知識觀點。布魯菲（Kenneth A. Bruffee, 1934-2019）提到個人的學思與公共社會對話的重要性：「如果思考是與公眾、社會對話的内化，學會更好地思考，就是學會更好地對話。（If thought is internalized public and social talk, then to learn to think better is to learn to converse better.）」（Bruffee, 1984），因此，現代的研究者本不應該「閉門造車」，需要闊開心胸，與他人建立共學的連結，而在產出新知識的階段，就應該建立「實踐社群（Communities of Practice, CoP）」，讓知識不再只是靜態地產出，而是在成員們的互動、共享與回饋時動態生成。
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
            <span style={{ color: "var(--c-accent)" }}>
              <Icon name="BookOpen" size={24} />
            </span>{" "}
            當局者迷與同儕審查
          </h3>
          <p className="theme-text-secondary content-justify">
            傳統俗諺：「當局者迷，旁觀者清」，在研究生撰寫論文的過程中，難免遭遇論述困難、邏輯死角、學術視野缺失、論文題目文不對題、論證掛一漏萬與文獻引證錯誤等諸多情形，特別是在中文學科，因其學術領域過於廣袤，又被分成經史組、小學組、文學組等各種「次級學科」，雖然各個領域間都有千絲萬縷的聯繫，但不同領域的研究生往往從不交流對話，又受限於學力尚淺，往往投身困境而難以自察，直到與指導教授討論或是投稿後才被審查委員指正。若在此之前，藉由協作學習的成員建立小型的「同儕審查機制（Peer Review）」，不僅可以提供他者的眼光，協助成員提早發現論文問題以及發展方向，便可即時避免、降低正式發表的挫折感。
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
            <span style={{ color: "var(--c-accent)" }}>
              <Icon name="Users" size={24} />
            </span>{" "}
            寫作焦慮與進度控管
          </h3>
          <p className="theme-text-secondary content-justify">
            研究生的學術寫作之所以常有「拖延症」，不應歸咎於自身的研究能力不足，而是源於長時間孤軍奮戰產生的心理耗損。在缺乏即時回饋的漫長寫作中，研究生容易陷入自己究竟寫得好不好的「自我懷疑」與或許我還能寫得更好的「完美主義」困境中，這些困境都是個人化的心理焦慮實現在軀體的表現。因此，藉由社群強制訂立發表時程的強制規定，將相對抽象的寫作計畫轉化為具體的「Deadline」。透過定期的進度回饋，成員必須在約定的時間點產出文章，以適度的社交壓力能有效打破學術寫作的延宕。更重要的是，實踐社群提供了一個安全的情緒容器，讓成員在面對拒稿或研究瓶頸時，能透過同儕的共感與支持，將寫作焦慮轉化為前行的動力。
          </p>
        </div>
      </div>

      <div
        className="mt-10 pt-8 theme-divider"
        style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}
      >
        <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">
          研究室具體實踐
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "ClipboardList",
              n: 1,
              t: "建立學術討論的期程表",
              d: "計畫伊始，即排定每位成員的發表次序與時段，要求發表人須於會議前一週提交論文初稿。其餘成員則須在會議前完成預讀，並撰寫評論意見。旨在模擬學術期刊或研討會的審稿流程，給予研究生學術寫作的「儀式感」與「責任心」。",
            },
            {
              icon: "Users",
              n: 2,
              t: "組建同儕審查會議",
              d: "每位成員須輪流在會議中承擔不同角色。主持人須控管現場對話的次序與時間安排；發表人須練習在有限的時間內精煉地陳述核心問題；特約討論人則需針對論文提供具建設性的修改建議。透過角色模擬，加速熟悉發表流程，培養口頭論述與組織能力。",
            },
            {
              icon: "Edit3",
              n: 3,
              t: "論文修正與再評議",
              d: "學術寫作最困難的部分不在於「寫」，而在於「如何改」。本計畫強調在初稿發表與評論意見回饋後，發表人必須針對修改建議進行整理，提出修改說明作為追蹤，並期望成員能於修改完成後進行投稿。",
            },
            {
              icon: "Globe",
              n: 4,
              t: "跨校數位資源共享群組",
              d: "現代論文寫作已無法脫離數位工具與資料庫的運用。然而，單一學校的資料庫往往受限於預算或學科側重而有所缺漏。透過「校際」合作，總合多校資源，便能查漏補缺，為成員的研究添磚加瓦。",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 transition-colors duration-300"
            >
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
                <span style={{ color: "var(--c-accent)" }}>
                  <Icon name={item.icon} size={20} />
                </span>{" "}
                {item.n}. {item.t}
              </h4>
              <p className="theme-text-secondary text-sm leading-relaxed font-serif content-justify">
                {item.d}
              </p>
            </div>
          ))}
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
          <h3
            className="text-2xl font-bold font-sans flex items-center gap-3 pb-4 theme-heading theme-divider"
            style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}
          >
            <div
              className="p-2.5 rounded-xl border"
              style={{
                background: "var(--c-accent-light)",
                borderColor: "var(--c-badge-border)",
              }}
            >
              <Icon name={cat.icon} size={24} />
            </div>
            {idx + 1}. {cat.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.links.map((link, li) => {
              const domain = getDomain(link.url);
              return (
                <a
                  key={li}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center p-5 rounded-2xl glass-panel glass-card-hover hover:-translate-y-1 shadow-sm"
                >
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-white/60 shrink-0 overflow-hidden relative">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                      alt=""
                      className="w-7 h-7 object-contain relative z-10"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.opacity = 0;
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.opacity = 1;
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300">
                      <Icon name="Globe" className="opacity-30" size={24} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold font-sans transition-colors truncate theme-heading">
                      {link.name}
                    </h4>
                    <p
                      className="text-xs font-mono mt-1 truncate theme-text-secondary"
                      style={{ opacity: 0.5 }}
                    >
                      {domain}
                    </p>
                  </div>

                  <Icon
                    name="ExternalLink"
                    size={18}
                    className="shrink-0 ml-3 opacity-20 group-hover:opacity-70 transition-opacity"
                  />
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
              <li
                key={ev.id}
                onClick={() => setActiveId(open ? null : ev.id)}
                className={`p-6 md:p-8 cursor-pointer spring-transition ${
                  open
                    ? "bg-white/60 shadow-lg scale-[1.02] my-2 rounded-2xl border border-white/80 z-10"
                    : "hover:bg-white/40 border-transparent z-0"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 p-3 rounded-xl flex-shrink-0 backdrop-blur-sm border spring-transition ${
                        open ? "scale-110 shadow-sm" : ""
                      }`}
                      style={
                        ev.status === "upcoming"
                          ? {
                              background: "var(--c-badge-bg)",
                              color: "var(--c-accent)",
                              borderColor: "var(--c-badge-border)",
                            }
                          : {}
                      }
                    >
                      <Icon name="Calendar" size={24} />
                    </div>

                    <div>
                      <h3
                        className={`text-lg font-bold mb-1 font-sans ${
                          ev.status === "upcoming"
                            ? "theme-heading"
                            : "opacity-60"
                        }`}
                      >
                        {ev.title}
                      </h3>
                      <p className="text-sm theme-text-secondary">
                        <span className="font-mono bg-white/50 border border-white/40 px-2 py-0.5 rounded shadow-sm">
                          {ev.date}
                        </span>
                      </p>
                    </div>
                  </div>

                  {ev.status === "upcoming" ? (
                    <span
                      className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border font-sans"
                      style={{
                        background: "var(--c-nav-active-bg)",
                        borderColor: "var(--c-nav-active-border)",
                      }}
                    >
                      會議內容
                    </span>
                  ) : (
                    <span className="inline-block bg-white/40 border border-white/50 text-xs font-bold px-3 py-1 rounded-full font-sans theme-text-secondary">
                      已歸檔
                    </span>
                  )}
                </div>

                <div
                  className={`grid spring-transition w-full ${
                    open
                      ? "grid-rows-[1fr] opacity-100 mt-6"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="pt-4 text-sm whitespace-pre-line leading-relaxed font-serif bg-white/30 p-4 rounded-xl shadow-inner content-justify theme-text-secondary theme-divider"
                      style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}
                    >
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
    if (s === "待發表")
      return {
        bg: "var(--c-badge-bg)",
        color: "var(--c-badge-text)",
        border: "var(--c-badge-border)",
      };
    if (s === "修改中")
      return {
        bg: "rgba(234,179,8,0.15)",
        color: "#854d0e",
        border: "rgba(234,179,8,0.3)",
      };
    if (s === "撰寫中")
      return {
        bg: "rgba(139,92,246,0.12)",
        color: "#5b21b6",
        border: "rgba(139,92,246,0.25)",
      };
    if (s === "已發表")
      return {
        bg: "rgba(34,197,94,0.12)",
        color: "#15803d",
        border: "rgba(34,197,94,0.25)",
      };
    return {
      bg: "rgba(100,116,139,0.12)",
      color: "#475569",
      border: "rgba(100,116,139,0.25)",
    };
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
            <article
              key={art.id}
              onClick={() => setExpandedId(open ? null : art.id)}
              className={`rounded-2xl glass-panel cursor-pointer spring-transition ${
                open ? "bg-white/60 shadow-lg scale-[1.01]" : "glass-card-hover"
              }`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="mt-1 p-2.5 rounded-xl shrink-0"
                      style={{ background: "var(--c-accent-light)" }}
                    >
                      <Icon name="FileText" size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-sans leading-snug theme-heading">
                        {art.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm theme-text-secondary">
                        <span className="flex items-center gap-1 font-sans">
                          <Icon name="PenLine" size={14} /> {art.author}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs opacity-60">
                          <Icon name="Clock" size={14} /> {art.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans shrink-0 border"
                    style={{
                      background: sc.bg,
                      color: sc.color,
                      borderColor: sc.border,
                    }}
                  >
                    {art.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {art.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full bg-white/50 border border-white/60 theme-text-secondary"
                    >
                      <Icon name="Tag" size={12} /> {tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`grid spring-transition w-full ${
                    open
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="pt-4 theme-divider"
                      style={{
                        borderTopWidth: "1px",
                        borderTopStyle: "solid",
                      }}
                    >
                      {hasAbstract ? (
                        <>
                          <h4 className="text-sm font-bold font-sans mb-3 flex items-center gap-2 theme-heading">
                            <Icon
                              name="BookOpen"
                              size={16}
                              className=""
                            />{" "}
                            摘要
                          </h4>
                          <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary mb-4">
                            {art.abstract}
                          </p>
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
                  <span
                    className="text-xs font-sans flex items-center gap-1 theme-text-secondary"
                    style={{ opacity: 0.5 }}
                  >
                    {open ? "收合" : hasAbstract ? "展開摘要" : "查看狀態"}
                    <Icon
                      name="ChevronRight"
                      size={14}
                      className={`spring-transition ${open ? "rotate-90" : ""}`}
                    />
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

  useEffect(() => {
    document.body.setAttribute("data-theme", currentPage);
  }, [currentPage]);

  const navItems = [
    { id: "home", label: "研究室首頁", icon: <Icon name="Home" size={18} /> },
    { id: "about", label: "關於讀書會", icon: <Icon name="Info" size={18} /> },
    { id: "books", label: "資訊分享", icon: <Icon name="Library" size={18} /> },
    { id: "events", label: "近期活動", icon: <Icon name="Calendar" size={18} /> },
    { id: "columns", label: "討論進度", icon: <Icon name="PenLine" size={18} /> },
  ];

  const go = (id) => {
    setCurrentPage(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const page = (() => {
    switch (currentPage) {
      case "home":
        return <HomePage setPage={setCurrentPage} />;
      case "about":
        return <AboutPage />;
      case "books":
        return <BooksPage />;
      case "events":
        return <EventsPage />;
      case "columns":
        return <ColumnsPage />;
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  })();

  return (
    <div className="min-h-screen relative font-serif flex flex-col theme-text overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;500;700;900&display=swap');
            
            /* ===== CSS 變數主題系統 ===== */
            :root, body[data-theme="home"] {
              --c-primary: #2d6a6a; --c-primary-dark: #1a4f4f; --c-primary-light: #e0f0f0;
              --c-accent: #d4a24e; --c-accent-light: #fef3d8; --c-text: #0f3d3d; --c-text-secondary: #3a6b6b;
              --c-blob-1: rgba(77,160,160,0.25); --c-blob-2: rgba(212,162,78,0.18); --c-blob-3: rgba(140,190,210,0.18);
              --c-footer: rgba(15,61,61,0.85); --c-selection: rgba(212,162,78,0.3);
              --c-nav-active-bg: rgba(45,106,106,0.9); --c-nav-active-border: rgba(77,160,160,0.5);
              --c-badge-bg: rgba(212,162,78,0.2); --c-badge-text: #7a5c1a; --c-badge-border: rgba(212,162,78,0.3);
            }
            body[data-theme="about"] {
              --c-primary: #8c6240; --c-primary-dark: #5e3d24; --c-primary-light: #f5ebe3;
              --c-accent: #c4935a; --c-accent-light: #fdf0e0; --c-text: #3d2414; --c-text-secondary: #7a5a3e;
              --c-blob-1: rgba(196,147,90,0.22); --c-blob-2: rgba(140,98,64,0.18); --c-blob-3: rgba(220,180,140,0.2);
              --c-footer: rgba(61,36,20,0.85); --c-selection: rgba(196,147,90,0.3);
              --c-nav-active-bg: rgba(140,98,64,0.9); --c-nav-active-border: rgba(196,147,90,0.5);
              --c-badge-bg: rgba(196,147,90,0.2); --c-badge-text: #5e3d24; --c-badge-border: rgba(196,147,90,0.3);
            }
            body[data-theme="books"] {
              --c-primary: #8a7a2e; --c-primary-dark: #5c5218; --c-primary-light: #f7f3e0;
              --c-accent: #b89a38; --c-accent-light: #fdf8e8; --c-text: #3a3410; --c-text-secondary: #6b6330;
              --c-blob-1: rgba(184,154,56,0.22); --c-blob-2: rgba(138,122,46,0.18); --c-blob-3: rgba(210,195,120,0.2);
              --c-footer: rgba(58,52,16,0.85); --c-selection: rgba(184,154,56,0.3);
              --c-nav-active-bg: rgba(138,122,46,0.9); --c-nav-active-border: rgba(184,154,56,0.5);
              --c-badge-bg: rgba(184,154,56,0.2); --c-badge-text: #5c5218; --c-badge-border: rgba(184,154,56,0.3);
            }
            body[data-theme="events"] {
              --c-primary: #3d6878; --c-primary-dark: #264350; --c-primary-light: #e4eef3;
              --c-accent: #6ba0b4; --c-accent-light: #eaf4f8; --c-text: #1a3540; --c-text-secondary: #4a7080;
              --c-blob-1: rgba(61,104,120,0.22); --c-blob-2: rgba(107,160,180,0.18); --c-blob-3: rgba(80,130,160,0.2);
              --c-footer: rgba(26,53,64,0.85); --c-selection: rgba(107,160,180,0.3);
              --c-nav-active-bg: rgba(61,104,120,0.9); --c-nav-active-border: rgba(107,160,180,0.5);
              --c-badge-bg: rgba(107,160,180,0.2); --c-badge-text: #264350; --c-badge-border: rgba(107,160,180,0.3);
            }
            body[data-theme="columns"] {
              --c-primary: #4a6a50; --c-primary-dark: #2e4432; --c-primary-light: #e8f0ea;
              --c-accent: #8aaa60; --c-accent-light: #f2f7ec; --c-text: #1e3322; --c-text-secondary: #506a54;
              --c-blob-1: rgba(74,106,80,0.22); --c-blob-2: rgba(138,170,96,0.18); --c-blob-3: rgba(100,150,110,0.2);
              --c-footer: rgba(30,51,34,0.85); --c-selection: rgba(138,170,96,0.3);
              --c-nav-active-bg: rgba(74,106,80,0.9); --c-nav-active-border: rgba(138,170,96,0.5);
              --c-badge-bg: rgba(138,170,96,0.2); --c-badge-text: #2e4432; --c-badge-border: rgba(138,170,96,0.3);
            }

            /* ===== 字型覆寫 ===== */
            .font-sans { font-family: 'Noto Sans TC', sans-serif !important; }
            .font-serif { font-family: 'Noto Serif TC', serif !important; }

            /* ===== 共用樣式與動畫 ===== */
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(12px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
            
            .content-justify { text-align: justify; text-justify: inter-ideograph; overflow-wrap: break-word; word-break: normal; }
            .spring-transition { transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1); }
            .glass-panel {
              background: rgba(255,255,255,0.4);
              backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255,255,255,0.6);
              box-shadow: 0 8px 32px rgba(0,0,0,0.05);
            }
            .glass-card-hover { transition: all 300ms ease; }
            .glass-card-hover:hover { background: rgba(255,255,255,0.6); box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
            .blob-1 { animation: blobPulse 8s ease-in-out infinite; }
            .blob-2 { animation: blobPulse 10s ease-in-out infinite reverse; }
            .blob-3 { animation: blobPulse 12s ease-in-out infinite; }
            @keyframes blobPulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }
            ::selection { background: var(--c-selection); color: var(--c-text); }
            .theme-text { color: var(--c-text); }
            .theme-text-secondary { color: var(--c-text-secondary); }
            .theme-heading { color: var(--c-primary-dark); }
            .theme-divider { border-color: color-mix(in srgb, var(--c-primary) 15%, transparent); }
            .bg-blob-1 { background-color: var(--c-blob-1); transition: background-color 800ms ease; }
            .bg-blob-2 { background-color: var(--c-blob-2); transition: background-color 800ms ease; }
            .bg-blob-3 { background-color: var(--c-blob-3); transition: background-color 800ms ease; }
          `,
        }}
      />

      {/* 背景光暈 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="blob-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] bg-blob-1"></div>
        <div className="blob-2 absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] bg-blob-2"></div>
        <div className="blob-3 absolute bottom-[-10%] left-[10%] w-[45vw] h-[45vw] rounded-full blur-[120px] bg-blob-3"></div>
      </div>

      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-sm transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => go("home")}>
              <LogoImage className="w-10 h-10 mr-3 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-white/50 group-hover:scale-105 transition-transform" />
              <span className="font-bold text-2xl tracking-wide font-sans theme-heading transition-colors duration-500">
                中文研究室
              </span>
            </div>

            <div className="hidden lg:flex space-x-1.5 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <ThemedButton
                  key={item.id}
                  active={currentPage === item.id}
                  onClick={() => go(item.id)}
                  className="whitespace-nowrap"
                >
                  {item.icon} {item.label}
                </ThemedButton>
              ))}
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 bg-white/30 rounded-lg backdrop-blur-sm border border-white/40 theme-text"
              >
                {mobileOpen ? <Icon name="X" size={24} /> : <Icon name="Menu" size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-lg absolute w-full left-0 animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-base font-medium border font-sans transition-colors ${
                    currentPage === item.id ? "bg-white/60 border-white/80" : "border-transparent hover:bg-white/40"
                  }`}
                  style={
                    currentPage === item.id
                      ? { color: "var(--c-primary-dark)" }
                      : { color: "var(--c-text-secondary)" }
                  }
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex flex-col justify-center">
        {page}
      </main>

      {/* 頁尾 */}
      <footer
        className="relative z-10 backdrop-blur-xl border-t border-white/20 text-white/70 py-12 mt-auto transition-colors duration-500"
        style={{ background: "var(--c-footer)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center text-white mb-4">
              <LogoImage className="w-8 h-8 mr-2 rounded-lg bg-white/90 p-0.5" />
              <span className="font-bold text-xl tracking-wide font-sans">
                中文研究室
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white/90 font-bold mb-4 font-sans">快速連結</h4>
            <ul className="space-y-2 text-sm font-sans">
              {navItems.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    className="hover:text-white transition-colors"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/90 font-bold mb-4 font-sans">聯絡資訊</h4>
            <p className="text-sm font-sans">Email：zxc998775@gmail.com</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-sm text-center text-white/40 font-sans">
          &copy; {new Date().getFullYear()} 中文研究室. All rights reserved.
        </div>
      </footer>
    </div>
  );
}