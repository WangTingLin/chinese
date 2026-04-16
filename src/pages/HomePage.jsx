// 檔案路徑：src/pages/HomePage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

/* Sanity Image CDN 轉換 — 自動縮尺寸、轉 WebP */
const sanityImg = (url, { w, h, q = 75, fm = "webp", fit } = {}) => {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (w)   u.searchParams.set("w",   String(w));
    if (h)   u.searchParams.set("h",   String(h));
    if (fit) u.searchParams.set("fit", fit);
    u.searchParams.set("q",  String(q));
    u.searchParams.set("fm", fm);
    return u.toString();
  } catch { return url; }
};
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Icon } from "../App";
import { getCategoryColors } from "../data/articlesData";
import { NavCardPattern, HeroMedallion } from "../components/ClassicalDecoration";
import { PREF_OPTIONS } from "../constants";

/* ── component 外的常數，避免每次 render 重建 ── */
const PREF_KEY = "csl_native_prefs_v1";

export default function HomePage({
  setPage,
  isDarkMode,
  isNative = false,
  nativeCategory = "lecture",
  setNativeCategory = null,
  articles = [],
  events = [],
  activities = [],
  loading = false,
  onRefresh = null,
}) {
  /* ================= 最新文章 ================= */
  const latestArticle =
    articles.length > 0
      ? [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

  /* ================= 近期研討 ================= */
  const nextSeminar =
    events.length > 0
      ? [...events]
          .filter((e) => e.status === "upcoming" || new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0] ??
        [...events].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

  const catColors = getCategoryColors(isDarkMode);
  const latestArtColor = latestArticle
    ? catColors[latestArticle.category] || {
        bg: "rgba(100,116,139,0.12)",
        color: "#475569",
        border: "rgba(100,116,139,0.3)",
      }
    : null;

  /* ================= 活動時間解析 ================= */
  const parseEventDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const trimmed = dateStr.trim();
    const firstPart = trimmed.split(/[~,～，,]/)[0].trim();
    const [datePart, timePart] = firstPart.split(" ");
    if (!datePart) return new Date(0);
    const startTime = timePart ? timePart.split("-")[0] : "00:00";
    return new Date(`${datePart}T${startTime}:00`);
  };

  const getEventEndDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const trimmed = dateStr.trim();
    if (trimmed.includes("～") || trimmed.includes("~")) {
      const parts = trimmed.split(/[～~]/).map((s) => s.trim());
      return new Date(`${parts[parts.length - 1]}T23:59:59`);
    }
    const [datePart, timePart] = trimmed.split(" ");
    if (!datePart) return new Date(0);
    if (timePart && timePart.includes("-")) {
      return new Date(`${datePart}T${timePart.split("-")[1]}:00`);
    }
    return new Date(`${datePart}T23:59:59`);
  };

  const upcomingActivities = useMemo(
    () =>
      [...activities]
        .filter((ev) => getEventEndDate(ev.date) >= new Date())
        .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date)),
    [activities]
  );

  /* Native 分類篩選（Bug 2 fix：workshop 同時接受全形／半形斜線）*/
  const lectureActivities    = useMemo(() => upcomingActivities.filter(a => a.category === "學術講座"), [upcomingActivities]);
  const workshopActivities   = useMemo(() => upcomingActivities.filter(a => a.category === "研討會／工作坊" || a.category === "研討會/工作坊"), [upcomingActivities]);
  const submissionActivities = useMemo(() => upcomingActivities.filter(a => a.category === "徵稿資訊"), [upcomingActivities]);

  /* ================= 個人偏好（Native 專用）================= */

  const [userPrefs, setUserPrefs] = useState(() => {
    if (!isNative) return [];
    try {
      const saved = localStorage.getItem(PREF_KEY);
      return saved !== null ? JSON.parse(saved) : null; // null = 未設定，觸發引導頁
    } catch { return null; }
  });
  const [onboardingSelected, setOnboardingSelected] = useState([]);

  /* 監聽 App.jsx launch onboarding 儲存後的通知 */
  useEffect(() => {
    const handleLaunchPrefs = () => {
      try {
        const saved = localStorage.getItem(PREF_KEY);
        setUserPrefs(saved !== null ? JSON.parse(saved) : null);
      } catch { /* ignore */ }
    };
    window.addEventListener("launchPrefsReady", handleLaunchPrefs);
    return () => window.removeEventListener("launchPrefsReady", handleLaunchPrefs);
  }, []);

  const savePrefs = (prefs) => {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setUserPrefs(prefs);
  };

  const scoreActivity = (ev, prefs) => {
    if (!prefs || prefs.length === 0) return 0;
    const text = `${ev.title || ""} ${ev.speaker || ""} ${ev.category || ""}`;
    let score = 0;
    prefs.forEach(prefId => {
      const opt = PREF_OPTIONS.find(o => o.id === prefId);
      if (opt) opt.keywords.forEach(kw => { if (text.includes(kw)) score += 1; });
    });
    return score;
  };

  /* 依偏好評分重排；無偏好時維持原時間排序 */
  const rankedLectureActivities = useMemo(() => {
    if (!userPrefs || userPrefs.length === 0) return lectureActivities;
    return [...lectureActivities].sort((a, b) => {
      const diff = scoreActivity(b, userPrefs) - scoreActivity(a, userPrefs);
      return diff !== 0 ? diff : parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [lectureActivities, userPrefs]);

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [sortByDate,      setSortByDate]      = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [filterDateFrom,  setFilterDateFrom]  = useState("");
  const [filterDateTo,    setFilterDateTo]    = useState("");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);

  /* 依偏好評分重排 workshop/submission（與 lecture 相同邏輯）*/
  const rankedWorkshopActivities = useMemo(() => {
    if (!userPrefs || userPrefs.length === 0) return workshopActivities;
    return [...workshopActivities].sort((a, b) => {
      const diff = scoreActivity(b, userPrefs) - scoreActivity(a, userPrefs);
      return diff !== 0 ? diff : parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [workshopActivities, userPrefs]);

  const rankedSubmissionActivities = useMemo(() => {
    if (!userPrefs || userPrefs.length === 0) return submissionActivities;
    return [...submissionActivities].sort((a, b) => {
      const diff = scoreActivity(b, userPrefs) - scoreActivity(a, userPrefs);
      return diff !== 0 ? diff : parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [submissionActivities, userPrefs]);

  const rankedAllActivities = useMemo(() => {
    if (!userPrefs || userPrefs.length === 0) return upcomingActivities;
    return [...upcomingActivities].sort((a, b) => {
      const diff = scoreActivity(b, userPrefs) - scoreActivity(a, userPrefs);
      return diff !== 0 ? diff : parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [upcomingActivities, userPrefs]);

  /* 從月曆跳轉：存放目標 index（繞過 nativeCategory effect 的 reset）*/
  const pendingJumpRef = React.useRef(null);

  /* 切換 Tab 或篩選條件改變時，重置輪播到第一筆 */
  useEffect(() => {
    if (pendingJumpRef.current !== null) {
      setCurrentActivityIndex(pendingJumpRef.current);
      pendingJumpRef.current = null;
    } else {
      setCurrentActivityIndex(0);
    }
  }, [nativeCategory]);
  useEffect(() => {
    setCurrentActivityIndex(0);
  }, [searchQuery, filterDateFrom, filterDateTo]);
  const safeIdx =
    upcomingActivities.length === 0
      ? 0
      : Math.min(currentActivityIndex, upcomingActivities.length - 1);
  const currentActivity = upcomingActivities[safeIdx] || null;

  const prevActivity = () => {
    if (upcomingActivities.length <= 1) return;
    setCurrentActivityIndex((p) =>
      p === 0 ? upcomingActivities.length - 1 : p - 1
    );
  };
  const nextActivity = () => {
    if (upcomingActivities.length <= 1) return;
    setCurrentActivityIndex((p) =>
      p === upcomingActivities.length - 1 ? 0 : p + 1
    );
  };

  const getVisibleDots = (total, current, maxVisible = 7) => {
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i);
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, current - half);
    let end = start + maxVisible - 1;
    if (end > total - 1) { end = total - 1; start = end - maxVisible + 1; }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  /* ================= 活動分類顏色 ================= */
  const getActivityBadgeColor = (category) => {
    const map = {
      學術講座: {
        bg: isDarkMode ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)",
        color: isDarkMode ? "#93c5fd" : "#1e40af",
        border: isDarkMode ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)",
      },
      "研討會／工作坊": {
        bg: isDarkMode ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)",
        color: isDarkMode ? "#86efac" : "#166534",
        border: isDarkMode ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)",
      },
      徵稿資訊: {
        bg: isDarkMode ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.12)",
        color: isDarkMode ? "#fde047" : "#b45309",
        border: isDarkMode ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.3)",
      },
    };
    return map[category] || {
      bg: "var(--c-badge-bg)",
      color: "var(--c-badge-text)",
      border: "var(--c-badge-border)",
    };
  };

  const activityBadge = currentActivity
    ? getActivityBadgeColor(currentActivity.category)
    : null;

  /* ================= 跑馬燈內容 ================= */
  const tickerItems = [
    { text: "詩" }, { text: "書" }, { text: "禮" },
    { text: "樂" }, { text: "易" }, { text: "春秋" },
    { text: "讀書會" }, { text: "學術講座" }, { text: "文章專欄" },
    { text: "資源分享" }, { text: "研討進度" }, { text: "徵稿資訊" },
  ];
  const tickerDouble = [...tickerItems, ...tickerItems];

  /* ================= 快速導覽卡片設定 ================= */
  const navCards = [
    {
      id: "articles",
      icon: "PenLine",
      label: "研究文章",
      desc: "學術論文・讀書筆記",
      count: articles.length,
      countLabel: "篇文章",
      gradient: isDarkMode
        ? "linear-gradient(135deg, rgba(244,63,94,0.22) 0%, rgba(244,63,94,0.05) 100%)"
        : "linear-gradient(135deg, rgba(244,63,94,0.11) 0%, rgba(244,63,94,0.02) 100%)",
      accentColor: isDarkMode ? "#fda4af" : "#e11d48",
      borderColor: isDarkMode ? "rgba(244,63,94,0.28)" : "rgba(244,63,94,0.16)",
      blobColor: isDarkMode ? "rgba(244,63,94,0.35)" : "rgba(244,63,94,0.2)",
    },
    {
      id: "events",
      icon: "Calendar",
      label: "研討活動",
      desc: "讀書會・學術研討",
      count: events.length,
      countLabel: "場研討",
      gradient: isDarkMode
        ? "linear-gradient(135deg, rgba(2,132,199,0.22) 0%, rgba(2,132,199,0.05) 100%)"
        : "linear-gradient(135deg, rgba(2,132,199,0.11) 0%, rgba(2,132,199,0.02) 100%)",
      accentColor: isDarkMode ? "#7dd3fc" : "#0369a1",
      borderColor: isDarkMode ? "rgba(2,132,199,0.28)" : "rgba(2,132,199,0.16)",
      blobColor: isDarkMode ? "rgba(2,132,199,0.35)" : "rgba(2,132,199,0.2)",
    },
    {
      id: "activities",
      icon: "Megaphone",
      label: "近期活動",
      desc: "講座・工作坊・徵稿",
      count: upcomingActivities.length,
      countLabel: "場即將舉辦",
      gradient: isDarkMode
        ? "linear-gradient(135deg, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.05) 100%)"
        : "linear-gradient(135deg, rgba(34,197,94,0.11) 0%, rgba(34,197,94,0.02) 100%)",
      accentColor: isDarkMode ? "#86efac" : "#166534",
      borderColor: isDarkMode ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.16)",
      blobColor: isDarkMode ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.2)",
    },
    {
      id: "about",
      icon: "BookOpen",
      label: "關於研究室",
      desc: "簡介・成員・宗旨",
      count: null,
      countLabel: null,
      gradient: isDarkMode
        ? "linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(245,158,11,0.05) 100%)"
        : "linear-gradient(135deg, rgba(245,158,11,0.11) 0%, rgba(245,158,11,0.02) 100%)",
      accentColor: isDarkMode ? "#fcd34d" : "#b45309",
      borderColor: isDarkMode ? "rgba(245,158,11,0.28)" : "rgba(245,158,11,0.16)",
      blobColor: isDarkMode ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.2)",
    },
  ];

  /* ── App 模式專屬 hooks（必須在頂層無條件呼叫，React Rules of Hooks）── */
  const touchStart         = React.useRef(null);
  const scrollContainerRef = React.useRef(null);
  const coverAreaRef       = React.useRef(null);
  const cardRef            = React.useRef(null);
  const dragStartYRef      = React.useRef(null);
  const dragXRef           = React.useRef(0);
  const dragYRef           = React.useRef(0);
  const isDraggingHorizRef = React.useRef(false);
  const isDraggingVertRef  = React.useRef(false);
  const [showListSheet, setShowListSheet]           = React.useState(false);
  const sheetDragYRef                               = React.useRef(0);
  const sheetDragStartY                             = React.useRef(null);
  const sheetDragFromHandle                         = React.useRef(false);
  const sheetStartedAtTop                           = React.useRef(false);
  const sheetVelocityRef                            = React.useRef({ y: 0, t: 0 });
  const listSheetRef                                = React.useRef(null);
  const [showPrefsSheet, setShowPrefsSheet]         = React.useState(false);
  const [prefsSheetSelected, setPrefsSheetSelected] = React.useState([]);
  const [listPage, setListPage]                     = React.useState(1);
  const [calMenuEv, setCalMenuEv]                   = React.useState(null); // 行事曆選單目標活動
  const [showCalSheet, setShowCalSheet]             = React.useState(false); // 月曆視圖
  const [calSheetMonth, setCalSheetMonth]           = React.useState(() => { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth() }; });
  const [scheduledIds, setScheduledIds]             = React.useState(() => { try { return JSON.parse(localStorage.getItem("csl_notif_ids_v1") || "{}"); } catch { return {}; } });
  const [calSelectedDay, setCalSelectedDay]         = React.useState(null);
  const [refreshing, setRefreshing]               = React.useState(false);
  const [reminderOffset, setReminderOffset]       = React.useState(() => localStorage.getItem("csl_reminder_offset_v1") || "day1");
  const [showReminderSheet, setShowReminderSheet] = React.useState(false);
  const [reminderSheetEv, setReminderSheetEv]     = React.useState(null);
  const totalInCategoryRef = React.useRef(0);
  const nextCatActivityRef = React.useRef(() => {});
  const prevCatActivityRef = React.useRef(() => {});
  const showListSheetRef   = React.useRef(false);
  const displayListRef     = React.useRef([]);

  /* listPage 重設 */
  React.useEffect(() => {
    if (!isNative) return;
    setListPage(1);
  }, [isNative, searchQuery, filterDateFrom, filterDateTo, nativeCategory]);

  /* 預載相鄰卡片圖片 */
  React.useEffect(() => {
    if (!isNative) return;
    const list = displayListRef.current;
    if (!list || list.length <= 1) return;
    const n   = list.length;
    const idx = Math.min(currentActivityIndex, n - 1);
    [(idx + 1) % n, (idx - 1 + n) % n].forEach(i => {
      const url = list[i]?.coverImage?.asset?.url;
      if (url) { const img = new window.Image(); img.src = sanityImg(url, { w: 800, q: 72 }); }
    });
  }, [isNative, currentActivityIndex, nativeCategory]);

    /* 列表 sheet 拖拽關閉（non-passive，直接操作 DOM 避免重渲染）*/
  const closeSheetAnimated = React.useCallback(() => {
    if (!isNative) { setShowListSheet(false); return; }
    const el = listSheetRef.current;
    if (el) {
    const bd = el.parentElement?.querySelector("[data-backdrop]");
    /* animation-fill-mode:both 會蓋掉 inline transform，必須先清除 */
    el.style.animation  = "none";
    el.style.transition = "transform 500ms cubic-bezier(0.4,0,0.6,1)";
    el.style.transform  = "translateY(110%)";
    if (bd) { bd.style.transition = "opacity 460ms ease"; bd.style.opacity = "0"; }
    setTimeout(() => setShowListSheet(false), 490);
    } else {
    setShowListSheet(false);
    }
  }, []);

  React.useEffect(() => {
    const panel    = listSheetRef.current;
    if (!panel || !showListSheet) return;
    const backdrop = panel.parentElement?.querySelector("[data-backdrop]");
    const cont     = panel.querySelector(".sheet-scroll-cont");
    const content  = panel.querySelector(".sheet-scroll-content");
    if (!cont || !content) return;

    /* ── 工具函式 ── */
    const rubbery  = (d) => d <= 60 ? d : 60 + (d - 60) * 0.4;
    const getScroll = () => {
    const m = content.style.transform?.match(/-?[\d.]+/);
    return m ? -parseFloat(m[0]) : 0;
    };
    const maxScroll = () => Math.max(0, content.scrollHeight - cont.clientHeight);
    const setScroll = (y) => {
    content.style.transform = `translateY(${-y}px)`;
    };

    /* ── 手勢狀態（closure 變數，不用 React state）── */
    let lastY = 0, lastT = 0;
    let vel   = 0;            // px/ms，用於動量
    let mode  = "idle";       // "idle" | "scroll" | "drag"
    let panelDy   = 0;
    let dragStartY = 0;       // drag 模式的起點（可中途重設）
    let topHitY    = null;    // 碰到頂部那一刻的手指 Y（用來算往下多少才切 drag）
    let rafId = null;
    const cancelRAF = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };

    /* ── touchstart：passive: true，保留 click 事件（按鈕才能點擊）── */
    const onStart = (e) => {
    cancelRAF();
    lastY = e.touches[0].clientY;
    lastT = Date.now();
    vel = 0; mode = "idle"; panelDy = 0; topHitY = null;
    };

    /* ── touchmove ── */
    const onMove = (e) => {
    e.preventDefault();
    const cy  = e.touches[0].clientY;
    const now = Date.now(), dt = Math.max(1, now - lastT);
    const delta = cy - lastY;     // 這一幀的原始位移（px）
    vel   = delta / dt;           // px/ms，供動量使用
    lastY = cy; lastT = now;

    /* 決定模式 */
    if (mode === "idle") {
      if (Math.abs(delta) < 1 && getScroll() > 0) return;
      mode = (delta > 0 && getScroll() <= 1) ? "drag" : "scroll";
      if (mode === "drag") { dragStartY = cy; panelDy = 0; }
    }

    if (mode === "scroll") {
      const cur  = getScroll();
      const next = cur - delta;   // 1:1 跟手指（負值 = 滾動方向）
      const max  = maxScroll();

      if (next <= 0) {
      /* 剛到頂部：記錄位置 */
      if (topHitY === null) topHitY = cy;
      const downFromTop = cy - topHitY;   // 碰頂後往下移了多少
      if (downFromTop > 6) {
        /* 超過 6px：切換 drag 模式 */
        mode = "drag"; dragStartY = cy; panelDy = 0; topHitY = null;
        setScroll(0); content.style.transition = "";
      } else {
        /* 橡皮筋（頂部）*/
        content.style.transform = `translateY(${Math.min(downFromTop * 0.4, 20)}px)`;
      }
      } else {
      topHitY = null;   // 離開頂部，重設
      if (next > max) {
        /* 橡皮筋（底部）*/
        const overflow = next - max;
        content.style.transform = `translateY(${-(max + overflow * 0.25)}px)`;
      } else {
        setScroll(next);
      }
      }
    }

    if (mode === "drag") {
      panelDy = Math.max(0, cy - dragStartY);
      const vis = rubbery(panelDy);
      panel.style.transform  = `translateY(${vis}px)`;
      panel.style.transition = "none";
      if (backdrop) backdrop.style.opacity = String(Math.max(0, 1 - vis / 180));
    }
    };

    /* ── touchend ── */
    const onEnd = () => {
    if (mode === "drag") {
      /* animation-fill-mode:both 會蓋掉 inline transform，先清除 */
      panel.style.animation = "none";
      if (panelDy > 80 || vel > 0.35) {
      /* 關閉：慢收，重力感 ease-in */
      panel.style.transition = "transform 500ms cubic-bezier(0.4,0,0.6,1)";
      panel.style.transform  = "translateY(110%)";
      if (backdrop) { backdrop.style.transition = "opacity 460ms ease"; backdrop.style.opacity = "0"; }
      setTimeout(() => setShowListSheet(false), 490);
      } else {
      /* 彈回：明顯 overshoot spring，Y2=1.72 讓它彈過頭再回來 */
      panel.style.transition = "transform 500ms cubic-bezier(0.34,1.72,0.64,1)";
      panel.style.transform  = "";
      if (backdrop) { backdrop.style.transition = "opacity 400ms ease"; backdrop.style.opacity = ""; }
      }
    } else if (mode === "scroll") {
      const max = maxScroll();
      const cur = getScroll();
      /* 邊界彈回 */
      if (cur < 0 || cur > max) {
      const target = Math.max(0, Math.min(cur, max));
      content.style.transition = "transform 380ms cubic-bezier(0.34,1.4,0.64,1)";
      setScroll(target);
      setTimeout(() => { content.style.transition = ""; }, 390);
      return;
      }
      /* 動量慣性：vel 是 px/ms，乘 16 轉成每幀位移，衰減係數 0.92 */
      let v = vel * 16;
      const tick = () => {
      v *= 0.92;
      if (Math.abs(v) < 0.5) {
        const c = getScroll(), m = maxScroll();
        if (c < 0 || c > m) {
        const t = Math.max(0, Math.min(c, m));
        content.style.transition = "transform 350ms cubic-bezier(0.22,1,0.36,1)";
        setScroll(t);
        setTimeout(() => { content.style.transition = ""; }, 360);
        }
        return;
      }
      const next = getScroll() - v, m = maxScroll();
      if (next < 0)      { setScroll(0); v = 0; }
      else if (next > m) { setScroll(m); v = 0; }
      else               { setScroll(next); }
      rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }
    mode = "idle";
    };

    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove",  onMove,  { passive: false });
    panel.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
    cancelRAF();
    panel.removeEventListener("touchstart", onStart);
    panel.removeEventListener("touchmove",  onMove);
    panel.removeEventListener("touchend",   onEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNative, showListSheet, closeSheetAnimated]);

    /* 精選卡觸控 */
  React.useEffect(() => {
    if (!isNative) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const onStart = (e) => {
    /* sheet 開著時，觸控讓 sheet 自己處理，卡片不攔截 */
    if (showListSheetRef.current) return;
    touchStart.current         = e.touches[0].clientX;
    dragStartYRef.current      = e.touches[0].clientY;
    dragXRef.current           = 0;
    dragYRef.current           = 0;
    isDraggingHorizRef.current = false;
    isDraggingVertRef.current  = false;
    };

    const onMove = (e) => {
    if (touchStart.current === null) return;
    const dx = e.touches[0].clientX - touchStart.current;
    const dy = e.touches[0].clientY - dragStartYRef.current;
    dragXRef.current = dx;
    dragYRef.current = dy;

    if (!isDraggingHorizRef.current && !isDraggingVertRef.current) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
      isDraggingVertRef.current = true;
      } else {
      isDraggingHorizRef.current = true;
      }
    }
    e.preventDefault(); // 防止 iOS 橡皮筋 / 捲動
    if (isDraggingHorizRef.current) {
      const resistance = Math.abs(dx) > 100 ? 0.35 : 1;
      applyCardTransform(dx * resistance);
    }
    };

    const onEnd = () => {
    const dx   = dragXRef.current;
    const dy   = dragYRef.current;
    const card = cardRef.current;

    if (isDraggingHorizRef.current) {
      const THRESHOLD = 55;
      if (Math.abs(dx) > THRESHOLD && totalInCategoryRef.current > 1) {
      const flyX   = dx < 0 ? -window.innerWidth : window.innerWidth;
      const enterX = dx < 0 ?  window.innerWidth : -window.innerWidth;
      applyCardTransform(flyX, "transform 220ms ease-in");
      setTimeout(() => {
        dx < 0 ? nextCatActivityRef.current() : prevCatActivityRef.current();
        if (card) {
        card.style.transition = "none";
        card.style.transform  = `translateX(${enterX}px)`;
        card.getBoundingClientRect();
        card.style.transition = "transform 300ms cubic-bezier(0.22,1,0.36,1)";
        card.style.transform  = "";
        }
      }, 210);
      } else {
      applyCardTransform(0, "transform 350ms cubic-bezier(0.22,1,0.36,1)");
      }
    } else if (isDraggingVertRef.current) {
      /* 上滑 → 展開列表 */
      if (dy < -40 && !showListSheetRef.current) {
      setShowListSheet(true);
      }
    }

    touchStart.current         = null;
    dragXRef.current           = 0;
    dragYRef.current           = 0;
    isDraggingHorizRef.current = false;
    isDraggingVertRef.current  = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
    el.removeEventListener("touchstart", onStart);
    el.removeEventListener("touchmove",  onMove);
    el.removeEventListener("touchend",   onEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNative, loading]);

  /* applyCardTransform：card touch effect 用，必須在頂層 */
  const applyCardTransform = (x, transition = "none") => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = transition;
    card.style.transform  = x === 0 ? "" : `translateX(${x}px)`;
  };

  /* ================= App 版（native）專屬首頁 ================= */
  if (isNative) {
    const accentGradients = [
      ["#0ea5e9","#6366f1"],
      ["#f59e0b","#ef4444"],
      ["#10b981","#0ea5e9"],
      ["#8b5cf6","#ec4899"],
    ];
    const panelBg = "#1c1c1e";

    /* ── Haptic helpers ── */
    const hapticLight  = () => Haptics.impact({ style: ImpactStyle.Light  }).catch(() => {});
    const hapticMedium = () => Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});

    /* ── 開地圖（線上活動改開活動連結）── */
    const ONLINE_KEYWORDS = ["線上","online","zoom","meet","teams","webex","youtube","youtu.be","http","https","視訊","遠距"];
    const isOnlineLocation = (loc) => {
      if (!loc) return false;
      const lower = loc.toLowerCase();
      return ONLINE_KEYWORDS.some(kw => lower.includes(kw));
    };
    const openLocation = (location, link) => {
      if (!location) return;
      hapticLight();
      if (isOnlineLocation(location)) {
        // 線上活動：開活動連結
        const url = link || (location.startsWith("http") ? location : null);
        if (url) window.open(url, "_blank");
        return;
      }
      const q = encodeURIComponent(location);
      const isIOS = Capacitor.getPlatform() === "ios";
      window.open(
        isIOS
          ? `https://maps.apple.com/?q=${q}`
          : `https://www.google.com/maps/search/?api=1&query=${q}`,
        "_blank"
      );
    };

    /* ── 本地通知 ── */
    const NOTIF_KEY = "csl_notif_ids_v1";
    const saveScheduledIds = (ids) => {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(ids));
      setScheduledIds(ids);
    };
    const isReminderSet = (evId) => !!scheduledIds[evId];

    const toggleReminder = async (ev) => {
      hapticMedium();
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== "granted") return;

        if (isReminderSet(ev._id)) {
          // 取消提醒
          const id = scheduledIds[ev._id];
          await LocalNotifications.cancel({ notifications: [{ id }] }).catch(() => {});
          const next = { ...scheduledIds };
          delete next[ev._id];
          saveScheduledIds(next);
          return;
        }

        // 解析活動時間
        const dateStr = ev.date?.trim() || "";
        const firstPart = dateStr.split(/[~,～，]/)[0].trim();
        const [datePart, timePart] = firstPart.split(" ");
        if (!datePart) return;
        const startTime = timePart ? timePart.split("-")[0] : "09:00";
        const eventDate = new Date(`${datePart}T${startTime}:00`);
        if (isNaN(eventDate)) return;

        // 提前 1 天 09:00 提醒
        const notifAt = new Date(eventDate);
        notifAt.setDate(notifAt.getDate() - 1);
        notifAt.setHours(9, 0, 0, 0);
        if (notifAt <= new Date()) {
          // 若提前時間已過，改為活動當天 09:00
          notifAt.setDate(notifAt.getDate() + 1);
          if (notifAt <= new Date()) return; // 也過了就不排
        }

        const id = Math.floor(Math.random() * 2_000_000_000);
        await LocalNotifications.schedule({
          notifications: [{
            id,
            title: "📅 明日活動提醒",
            body: ev.title + (ev.location ? `\n📍 ${ev.location}` : ""),
            schedule: { at: notifAt },
            sound: "default",
            smallIcon: "ic_notification",
          }],
        });
        saveScheduledIds({ ...scheduledIds, [ev._id]: id });
      } catch (e) {
        console.error("通知排程失敗:", e);
      }
    };


    /* ── 提醒時間選項 ── */
    const REMINDER_OPTS = [
      { id: "day3",  label: "前 3 天", desc: "活動前 3 天 09:00" },
      { id: "day1",  label: "前一天",  desc: "活動前一天 09:00" },
      { id: "hour2", label: "前 2 小時", desc: "活動開始前 2 小時" },
      { id: "hour1", label: "前 1 小時", desc: "活動開始前 1 小時" },
    ];
    const saveReminderOffset = (id) => {
      localStorage.setItem("csl_reminder_offset_v1", id);
      setReminderOffset(id);
    };

    /* ── 計算提醒時間（依 reminderOffset）── */
    const calcNotifAt = (ev, offset) => {
      const dateStr = ev.date?.trim() || "";
      const firstPart = dateStr.split(/[~,～，]/)[0].trim();
      const [datePart, timePart] = firstPart.split(" ");
      if (!datePart) return null;
      const startTime = timePart ? timePart.split("-")[0] : "09:00";
      const eventDate = new Date(`${datePart}T${startTime}:00`);
      if (isNaN(eventDate)) return null;
      const notifAt = new Date(eventDate);
      if (offset === "day3") { notifAt.setDate(notifAt.getDate() - 3); notifAt.setHours(9, 0, 0, 0); }
      else if (offset === "day1") { notifAt.setDate(notifAt.getDate() - 1); notifAt.setHours(9, 0, 0, 0); }
      else if (offset === "hour2") { notifAt.setTime(notifAt.getTime() - 2 * 60 * 60 * 1000); }
      else if (offset === "hour1") { notifAt.setTime(notifAt.getTime() - 60 * 60 * 1000); }
      if (notifAt <= new Date()) return null;
      return notifAt;
    };

    /* ── 修改 toggleReminder 改為先選時間 ── */
    const openReminderSheet = (ev) => {
      hapticLight();
      if (isReminderSet(ev._id)) {
        // 已設定 → 直接取消
        toggleReminder(ev);
      } else {
        setReminderSheetEv(ev);
        setShowReminderSheet(true);
      }
    };
    const scheduleReminderWithOffset = async (ev, offset) => {
      hapticMedium();
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== "granted") return;
        const notifAt = calcNotifAt(ev, offset);
        if (!notifAt) { setShowReminderSheet(false); return; }
        const id = Math.floor(Math.random() * 2_000_000_000);
        await LocalNotifications.schedule({
          notifications: [{
            id,
            title: "📅 活動提醒",
            body: ev.title + (ev.location ? `\n📍 ${ev.location}` : ""),
            schedule: { at: notifAt },
            sound: "default",
            smallIcon: "ic_notification",
          }],
        });
        saveScheduledIds({ ...scheduledIds, [ev._id]: id });
        saveReminderOffset(offset);
      } catch (e) { console.error("通知排程失敗:", e); }
      setShowReminderSheet(false);
    };

    /* ── 活動倒數 ── */
    const getCountdown = (dateStr) => {
      if (!dateStr) return null;
      const trimmed = dateStr.trim();
      const firstPart = trimmed.split(/[~,～，]/)[0].trim();
      const [datePart] = firstPart.split(" ");
      if (!datePart) return null;
      const parts = datePart.split("-").map(Number);
      if (parts.length < 3 || parts.some(isNaN)) return null;
      const [y, mo, d] = parts;
      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const eventMidnight = new Date(y, mo - 1, d);
      if (isNaN(eventMidnight)) return null;
      const diffDays = Math.round((eventMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return null; // 已過
      if (diffDays === 0) return { label: "今天", color: "#ef4444", urgent: true };
      if (diffDays === 1) return { label: "明天", color: "#f97316", urgent: true };
      if (diffDays <= 3) return { label: `還有 ${diffDays} 天`, color: "#fbbf24", urgent: true };
      if (diffDays <= 7) return { label: `還有 ${diffDays} 天`, color: "rgba(255,255,255,0.45)", urgent: false };
      return null;
    };

    /* ── 徵稿截止倒數（3天內紅色警示）── */
    const getDeadlineWarning = (ev) => {
      if (ev.category !== "徵稿資訊") return null;
      const cnt = getCountdown(ev.date);
      if (!cnt || !cnt.urgent) return null;
      return cnt;
    };

    /* ── 從月曆跳轉到精選卡片 ── */
    const jumpToCalendarActivity = (ev) => {
      hapticLight();
      setShowCalSheet(false);
      setCalSelectedDay(null);
      setShowListSheet(false);
      if (!ev?._id) return;
      const catKey =
        ev.category === "學術講座" ? "lecture"
        : (ev.category === "研討會／工作坊" || ev.category === "研討會/工作坊") ? "workshop"
        : ev.category === "徵稿資訊" ? "submission"
        : "all";
      const getTargetList = (key) => {
        if (sortByDate) {
          if (key === "lecture") return lectureActivities;
          if (key === "workshop") return workshopActivities;
          if (key === "submission") return submissionActivities;
          return upcomingActivities;
        }
        if (key === "lecture") return rankedLectureActivities;
        if (key === "workshop") return rankedWorkshopActivities;
        if (key === "submission") return rankedSubmissionActivities;
        return rankedAllActivities;
      };
      const idx = Math.max(0, getTargetList(catKey).findIndex(a => a._id === ev._id));
      if (catKey === nativeCategory) {
        setCurrentActivityIndex(idx);
      } else {
        pendingJumpRef.current = idx;
        setNativeCategory?.(catKey);
      }
    };

    /* ── 批量提醒 ── */
    const setBatchReminders = async (list) => {
      hapticMedium();
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== "granted") return;
        const newIds = { ...scheduledIds };
        const toSchedule = [];
        list.forEach(ev => {
          if (isReminderSet(ev._id)) return;
          const notifAt = calcNotifAt(ev, reminderOffset);
          if (!notifAt) return;
          const id = Math.floor(Math.random() * 2_000_000_000);
          newIds[ev._id] = id;
          toSchedule.push({
            id, title: "📅 活動提醒",
            body: ev.title,
            schedule: { at: notifAt },
            sound: "default",
            smallIcon: "ic_notification",
          });
        });
        if (toSchedule.length > 0) {
          await LocalNotifications.schedule({ notifications: toSchedule });
          saveScheduledIds(newIds);
        }
      } catch (e) { console.error("批量提醒失敗:", e); }
    };

    /* ── 資料載入中：骨架畫面（splash 消失後萬一資料還未到）── */
    if (loading) {
      return (
        <div style={{
          margin: "calc(-3.5rem - 1.25rem) -1rem -4rem",
          height: "100dvh", background: panelBg,
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div className="shimmer" style={{ flex: 1 }} />
          <div style={{ padding: "1.25rem 1.5rem", background: panelBg }}>
            <div className="shimmer" style={{ height: 10, width: "28%", borderRadius: 6, marginBottom: "0.65rem" }} />
            <div className="shimmer" style={{ height: 20, width: "88%", borderRadius: 6, marginBottom: "0.45rem" }} />
            <div className="shimmer" style={{ height: 20, width: "65%", borderRadius: 6, marginBottom: "1rem" }} />
            <div className="shimmer" style={{ height: 12, width: "50%", borderRadius: 6, marginBottom: "0.3rem" }} />
            <div className="shimmer" style={{ height: 12, width: "38%", borderRadius: 6, marginBottom: "1.2rem" }} />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div className="shimmer" style={{ flex: 1, height: 50, borderRadius: 14 }} />
              <div className="shimmer" style={{ flex: 1, height: 50, borderRadius: 14 }} />
            </div>
          </div>
        </div>
      );
    }

    /* ── 引導頁：首次開啟時顯示 ── */
    if (userPrefs === null && !isNative) {
      const togglePref = (id) =>
        setOnboardingSelected(prev =>
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
      return (
        <div
          className="animate-fade-in"
          style={{
            position: isNative ? "fixed" : "relative",
            inset: isNative ? 0 : undefined,
            zIndex: isNative ? 10001 : 10,
            margin: isNative ? 0 : "calc(-3.5rem - 1.25rem) -1rem -4rem",
            minHeight: isNative ? undefined : "100dvh",
            height: isNative ? "100dvh" : undefined,
            background: panelBg,
            display: "flex", flexDirection: "column",
            padding: "0 1.5rem",
            paddingTop: isNative ? "calc(env(safe-area-inset-top, 2rem) + 1.5rem)" : "calc(3.5rem + 2.5rem)",
            paddingBottom: isNative ? "calc(env(safe-area-inset-bottom, 0px) + 2rem)" : "3rem",
            overflowY: "auto",
            overscrollBehavior: "none",
          }}
        >
          {/* 標題區 */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              個人化設定
            </p>
            <h1 style={{ color: "#fff", fontSize: "1.55rem", fontWeight: 800, fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.3, marginBottom: "0.75rem" }}>
              你對哪些領域<br />感興趣？
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.6 }}>
              選擇一個或多個領域，我們會優先在精選卡推薦符合偏好的學術講座。
            </p>
          </div>

          {/* 選項格 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", flex: 1 }}>
            {PREF_OPTIONS.map(opt => {
              const selected = onboardingSelected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => togglePref(opt.id)}
                  style={{
                    padding: "1.1rem 1rem",
                    borderRadius: "1.1rem",
                    border: `1.5px solid ${selected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)"}`,
                    background: selected ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.4rem",
                    transition: "all 220ms ease",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, lineHeight: 1, fontFamily: "'Noto Sans TC',sans-serif", color: "rgba(255,255,255,0.55)" }}>{opt.label[0]}</span>
                  <span style={{ color: selected ? "#fff" : "rgba(255,255,255,0.65)", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif" }}>
                    {opt.label}
                  </span>
                  {selected && (
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.65rem", fontFamily: "'Noto Sans TC',sans-serif" }}>
                      ✓ 已選取
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 底部按鈕 */}
          <div style={{ paddingTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={() => savePrefs(onboardingSelected)}
              style={{
                width: "100%", padding: "0.95rem 0", borderRadius: "1rem",
                fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "1rem",
                background: onboardingSelected.length > 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.25)",
                color: onboardingSelected.length > 0 ? "#1c1c1e" : "rgba(255,255,255,0.4)",
                border: "none", cursor: "pointer", transition: "all 220ms ease",
              }}
            >
              {onboardingSelected.length > 0 ? `開始探索（已選 ${onboardingSelected.length} 項）` : "請選擇至少一個領域"}
            </button>
            <button
              onClick={() => savePrefs([])}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.3)", fontSize: "0.82rem",
                fontFamily: "'Noto Sans TC',sans-serif", padding: "0.25rem 0",
              }}
            >
              略過，顯示所有活動
            </button>
          </div>
        </div>
      );
    }

    /* ── 目前分類對應的活動列表（依偏好或時間排序）── */
    const categoryList =
      nativeCategory === "all"        ? (sortByDate ? upcomingActivities   : rankedAllActivities)        :
      nativeCategory === "lecture"    ? (sortByDate ? lectureActivities    : rankedLectureActivities)    :
      nativeCategory === "workshop"   ? (sortByDate ? workshopActivities   : rankedWorkshopActivities)   :
      (sortByDate ? submissionActivities : rankedSubmissionActivities);

    /* ── 搜尋 ＋ 日期篩選：有條件時精選卡也只顯示篩選後的結果 ── */
    const hasActiveFilter = !!(searchQuery.trim() || filterDateFrom || filterDateTo);
    const filteredList = (() => {
      const q = searchQuery.trim().toLowerCase();
      return categoryList.filter(ev => {
        if (q && !`${ev.title||""} ${ev.speaker||""} ${ev.location||""}`.toLowerCase().includes(q)) return false;
        if (filterDateFrom) { const from = new Date(filterDateFrom + "T00:00:00"); if (getEventEndDate(ev.date) < from) return false; }
        if (filterDateTo)   { const to   = new Date(filterDateTo   + "T23:59:59"); if (parseEventDate(ev.date)  > to)   return false; }
        return true;
      });
    })();

    /* displayList：有篩選條件時使用 filteredList，否則用完整分類列表 */
    const displayList     = hasActiveFilter ? filteredList : categoryList;
    displayListRef.current = displayList; // 同步給 early-return 前的 preload effect 讀取
    const shownList       = filteredList.slice(0, listPage * 15);
    const totalInCategory = displayList.length;
    const safeCatIdx      = totalInCategory === 0 ? 0 : Math.min(currentActivityIndex, totalInCategory - 1);
    const currentActivity = displayList[safeCatIdx] || null;
    const accentPair      = accentGradients[safeCatIdx % accentGradients.length];

    /* ── 分類內導航（使用 totalInCategory 邊界，避免跨分類錯位）── */
    const prevCatActivity = () => {
      if (totalInCategory <= 1) return;
      setCurrentActivityIndex(p => p === 0 ? totalInCategory - 1 : p - 1);
    };
    const nextCatActivity = () => {
      if (totalInCategory <= 1) return;
      setCurrentActivityIndex(p => p === totalInCategory - 1 ? 0 : p + 1);
    };
    /* ref inline 更新（非 hook，在 render 期間同步更新，closure 永遠讀到最新值）*/
    totalInCategoryRef.current = totalInCategory;
    nextCatActivityRef.current = nextCatActivity;
    prevCatActivityRef.current = prevCatActivity;
    showListSheetRef.current   = showListSheet;

    /* ── ICS 行事曆產生器（使用本地時間，避免時區偏移）── */
    const makeICS = (ev) => {
      if (!ev?.date) return null;
      const first = ev.date.trim().split(/[~～,，]/)[0].trim();
      const [datePart, timePart] = first.split(" ");
      if (!datePart) return null;
      const startT = timePart ? timePart.split("-")[0] : "00:00";
      const endT   = timePart && timePart.includes("-") ? timePart.split("-")[1] : null;
      /* 使用本地時間格式化（YYYYMMDDTHHMMSS），不附加 Z，讓行事曆以本地時區解析 */
      const fmtLocal = (d) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      };
      const start = new Date(`${datePart}T${startT}:00`);
      const end   = endT ? new Date(`${datePart}T${endT}:00`) : new Date(start.getTime() + 7200000);
      return [
        "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//中文研究室//App//ZH",
        "BEGIN:VEVENT",
        `DTSTART:${fmtLocal(start)}`,`DTEND:${fmtLocal(end)}`,
        `SUMMARY:${(ev.title||"").replace(/\n/g," ")}`,
        ev.location ? `LOCATION:${ev.location}` : "",
        ev.speaker  ? `DESCRIPTION:講者：${ev.speaker}` : "",
        "END:VEVENT","END:VCALENDAR",
      ].filter(Boolean).join("\r\n");
    };

    /* ── ICS 參數序列化（供 API endpoint 使用）── */
    const fmtDTLocal = (d) => {
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
    };

    /* ── Google 日曆 URL 直接加入事件 ── */
    const addToGoogleCalendar = (ev) => {
      if (!ev?.date) return;
      const first = ev.date.trim().split(/[~～,，]/)[0].trim();
      const [datePart, timePart] = first.split(" ");
      if (!datePart) return;
      const startT = timePart ? timePart.split("-")[0] : "00:00";
      const endT   = timePart && timePart.includes("-") ? timePart.split("-")[1] : null;
      const startD = new Date(`${datePart}T${startT}:00`);
      const endD   = endT ? new Date(`${datePart}T${endT}:00`) : new Date(startD.getTime() + 7200000);
      const fmt = (d) => { const p = n => String(n).padStart(2,"0"); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`; };
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text:     ev.title    || "",
        dates:   `${fmt(startD)}/${fmt(endD)}`,
        location: ev.location || "",
        details:  ev.speaker ? `講者：${ev.speaker}` : "",
      });
      window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
      setCalMenuEv(null);
    };

    /* ── Apple 日曆：Web Share API 傳 .ics，iOS 分享面板有「日曆」選項 ── */
    const addToAppleCalendar = async (ev) => {
      if (!ev?.date) return;
      const safeName = `${(ev.title || "event").replace(/[^\w\u4e00-\u9fff]/g, "_").slice(0, 30)}.ics`;
      if (Capacitor.isNativePlatform()) {
        try {
          const ics = makeICS(ev);
          if (!ics) return;
          const b64 = btoa(unescape(encodeURIComponent(ics)));
          await Filesystem.writeFile({ path: safeName, data: b64, directory: Directory.Cache });
          const { uri } = await Filesystem.getUri({ path: safeName, directory: Directory.Cache });
          await Share.share({ title: ev.title || "行事曆事件", files: [uri] });
        } catch (e) { console.error("加入行事曆失敗:", e); }
        setCalMenuEv(null); return;
      }
      const ics = makeICS(ev);
      if (!ics) return;
      const file = new File([ics], safeName, { type: "text/calendar" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ title: ev.title || "行事曆事件", files: [file] }); }
        catch (e) { if (e.name !== "AbortError") console.error(e); }
        setCalMenuEv(null); return;
      }
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = safeName;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setCalMenuEv(null);
    };

    const addToCalendar = (ev) => setCalMenuEv(ev);

    /* ── 滾動視差：封面圖片向上位移 + 漸暗，列表項目滑入 ── */
    const handleContainerScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const scrollY = container.scrollTop;
      const vh      = container.clientHeight || window.innerHeight;
      const ratio   = Math.min(scrollY / vh, 1);

      /* 封面：視差位移 ＋ 亮度漸暗 */
      const cover = coverAreaRef.current;
      if (cover) {
        const inner = cover.querySelector("img") || cover.querySelector("div");
        if (inner) inner.style.transform = `translateY(${scrollY * 0.30}px)`;
        cover.style.filter = `brightness(${1 - ratio * 0.30})`;
      }

      /* 向下提示：淡出 */
      const hint = container.querySelector(".scroll-hint");
      if (hint) hint.style.opacity = String(Math.max(0, 0.3 - ratio * 2));
    };

    /* ── 共用列表元件（三個分類皆使用）── */
    const ActivityListItems = ({ list, onSelect }) => (
      list.length === 0 ? null : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {list.map((ev, i) => (
            <div
              key={ev._id}
              className="list-item-in"
              onClick={onSelect ? () => onSelect(ev) : undefined}
              style={{
                padding: "1.1rem 1.25rem 1.1rem 1.5rem",
                borderBottom: i < list.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderLeft: `3px solid ${ev.category === "學術講座" ? "#60a5fa" : ev.category?.includes("研討") || ev.category?.includes("工作坊") ? "#4ade80" : ev.category === "徵稿資訊" ? "#fbbf24" : "#a78bfa"}`,
                animationDelay: `${Math.min(i * 0.065, 0.45)}s`,
                cursor: onSelect ? "pointer" : undefined,
              }}
            >
              {/* 上半：縮圖 ＋ 文字 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 64, height: 64, borderRadius: "0.75rem", flexShrink: 0, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                  {ev.coverImage?.asset?.url ? (
                    <img
                      src={sanityImg(ev.coverImage.asset.url, { w: 128, h: 128, fit: "crop", q: 70 })}
                      alt={ev.title}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0, transition: "opacity 250ms ease" }}
                      onLoad={e => { e.currentTarget.style.opacity = "1"; }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accentGradients[i % 4][0]}, ${accentGradients[i % 4][1]})` }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ color: "#fff", fontSize: "0.93rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.2rem", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ev.title}
                  </h3>
                  {/* 倒數標籤 */}
                  {(() => {
                    const cnt = getCountdown(ev.date);
                    const dw = getDeadlineWarning(ev);
                    const badge = dw || cnt;
                    if (!badge) return null;
                    return <span style={{ display: "inline-flex", fontSize: "0.68rem", fontWeight: 700, color: badge.color, background: `${badge.color}22`, border: `1px solid ${badge.color}44`, borderRadius: "0.4rem", padding: "0.1rem 0.45rem", marginBottom: "0.2rem" }}>{dw ? "⚠ " : ""}{badge.label}</span>;
                  })()}
                  {ev.date     && <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.73rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.1rem" }}>📅 {ev.date}</p>}
                  {ev.location && <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.73rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.1rem" }}>📍 {ev.location}</p>}
                  {ev.speaker  && <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.73rem", fontFamily: "'Noto Sans TC',sans-serif" }}>🎤 {ev.speaker}</p>}
                </div>
              </div>
              {/* 下半：按鈕列 */}
              <div style={{ display: "flex", gap: "0.6rem" }}>
                {ev.link && (
                  <a href={ev.link} target="_blank" rel="noopener noreferrer"
                    className="native-btn"
                    style={{ flex: 1, padding: "0.6rem 0", borderRadius: "0.75rem", fontWeight: 600, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", background: "rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none" }}
                  >
                    <Icon name="ExternalLink" size={15} /> 詳情
                  </a>
                )}
                <button onClick={() => addToCalendar(ev)}
                  className="native-btn"
                  style={{ flex: 1, padding: "0.6rem 0", borderRadius: "0.75rem", fontWeight: 600, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", background: "rgba(255,255,255,0.88)", color: "#1c1c1e", border: "none", cursor: "pointer" }}
                >
                  <Icon name="Calendar" size={15} /> 加入行事曆
                </button>
                <button
                  className="native-btn"
                  onClick={() => {
                    const text = [ev.title, ev.date && `📅 ${ev.date}`, ev.location && `📍 ${ev.location}`].filter(Boolean).join("\n");
                    if (navigator.share) {
                      navigator.share({ title: ev.title, text, url: ev.link || location.href }).catch(() => {});
                    } else if (ev.link) {
                      navigator.clipboard?.writeText(ev.link);
                    }
                  }}
                  style={{ flexShrink: 0, padding: "0.6rem 0.85rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="Share" size={15} />
                </button>
                {isReminderSet(ev._id) && (
                  <div style={{ flexShrink: 0, padding: "0.6rem 0.6rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24" }}>
                    <Icon name="Bell" size={13} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    );

    /* ── 分類名稱與列表標題 ── */
    const catLabel = nativeCategory === "all"      ? "全部活動" :
                     nativeCategory === "lecture"  ? "學術講座" :
                     nativeCategory === "workshop" ? "研討會／工作坊" : "徵稿資訊";
    const listHeader =
      sortByDate ? `全部${catLabel}（依時間）` :
      (userPrefs && userPrefs.length > 0) ? `依偏好推薦・${catLabel}` : `全部${catLabel}`;

    /* ── 三個分類統一使用全螢幕精選卡 ＋ 向下滑展開列表 ── */
    return (
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className="animate-fade-in"
        style={isNative ? {
          position: "fixed", inset: 0, zIndex: 10,
          overflow: "hidden",
          touchAction: "none",
          background: panelBg,
        } : {
          margin: "calc(-3.5rem - 1.25rem) -1rem -4rem",
          position: "relative", zIndex: 10,
          height: "100dvh", overflowY: "auto",
          background: panelBg,
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 第一屏：全螢幕精選卡 */}
        <section
          ref={cardRef}
          style={{
            height: isNative ? "100%" : "100dvh", flexShrink: 0,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            scrollSnapAlign: isNative ? "none" : "start",
            willChange: "transform",
          }}
        >
          {/* 圖片區：以漸層色為 loading placeholder，圖片載完後淡入 */}
          <div ref={coverAreaRef} style={{
            flex: 1, minHeight: 0, position: "relative", overflow: "hidden",
            background: currentActivity
              ? `linear-gradient(155deg, ${accentPair[0]}, ${accentPair[1]})`
              : "linear-gradient(155deg,#1e293b,#0f172a)",
            transition: "background 400ms ease",
          }}>
            {currentActivity?.coverImage?.asset?.url ? (
              <img
                key={currentActivity._id}
                src={sanityImg(currentActivity.coverImage.asset.url, { w: 800, q: 72 })}
                alt={currentActivity.coverImage.alt || currentActivity?.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0, transition: "opacity 350ms ease" }}
                onLoad={e => { e.currentTarget.style.opacity = "1"; }}
              />
            ) : null}

            {/* 分頁點 */}
            {totalInCategory > 1 && (
              <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.375rem" }}>
                {displayList.slice(0, 8).map((_, i) => (
                  <div
                    key={i}
                    className={i === safeCatIdx ? "dot-active" : undefined}
                    style={{
                      width: i === safeCatIdx ? 20 : 6, height: 6,
                      borderRadius: 9999, background: i === safeCatIdx ? "#fff" : "rgba(255,255,255,0.45)",
                      transition: "width 300ms cubic-bezier(0.34,1.56,0.64,1), background 300ms ease",
                    }}
                  />
                ))}
              </div>
            )}

            {/* 有機漸層橋接 */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: 240, pointerEvents: "none",
              background: `linear-gradient(to bottom,
                transparent 0%,
                rgba(28,28,30,0.04) 18%,
                rgba(28,28,30,0.18) 38%,
                rgba(28,28,30,0.52) 60%,
                rgba(28,28,30,0.82) 78%,
                ${panelBg} 100%)`,
            }} />
          </div>

          {/* 文字資訊區 */}
          <div style={{ background: panelBg, flexShrink: 0, padding: "0.5rem 1.5rem 0" }}>
            {currentActivity ? (
              <div key={currentActivity._id} className="card-info-in">
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.7rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  {currentActivity.category}
                </p>
                <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.35, marginBottom: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {currentActivity.title}
                </h2>
                {(() => {
                  const cnt = getCountdown(currentActivity.date);
                  const dw = getDeadlineWarning(currentActivity);
                  if (!cnt && !dw) return null;
                  const badge = dw || cnt;
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", color: badge.color, background: `${badge.color}22`, border: `1px solid ${badge.color}55`, borderRadius: "0.5rem", padding: "0.2rem 0.6rem", marginBottom: "0.4rem" }}>
                      {dw ? "⚠ 截止" : "⏰"} {badge.label}
                    </span>
                  );
                })()}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", color: "rgba(255,255,255,0.48)", fontSize: "0.82rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "1rem" }}>
                  {currentActivity.date     && <span>📅 {currentActivity.date}</span>}
                  {currentActivity.location && (
                    <button
                      onClick={() => openLocation(currentActivity.location, currentActivity.link)}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", textAlign: "left", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: "2px" }}
                    >
                      {isOnlineLocation(currentActivity.location) ? "💻" : "📍"} {currentActivity.location}
                    </button>
                  )}
                  {currentActivity.speaker  && <span>🎤 {currentActivity.speaker}</span>}
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.65rem" }}>
                  {currentActivity?.link && (
                    <a href={currentActivity.link} target="_blank" rel="noopener noreferrer"
                      className="native-btn"
                      onClick={() => hapticLight()}
                      style={{ flex: 1, padding: "0.85rem 0", borderRadius: "1rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "0.93rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "rgba(255,255,255,0.13)", color: "#fff", textDecoration: "none" }}
                    >
                      <Icon name="ExternalLink" size={17} /> 活動詳情
                    </a>
                  )}
                  <button onClick={() => { hapticLight(); addToCalendar(currentActivity); }}
                    className="native-btn"
                    style={{ flex: 1, padding: "0.85rem 0", borderRadius: "1rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "0.93rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "rgba(255,255,255,0.92)", color: "#1c1c1e", border: "none", cursor: "pointer" }}
                  >
                    <Icon name="Calendar" size={17} /> 加入行事曆
                  </button>
                  <button onClick={() => openReminderSheet(currentActivity)}
                    className="native-btn"
                    title={isReminderSet(currentActivity._id) ? "取消提醒" : "設定提醒"}
                    style={{ flexShrink: 0, padding: "0.85rem 1rem", borderRadius: "1rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "0.93rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", background: isReminderSet(currentActivity._id) ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.1)", color: isReminderSet(currentActivity._id) ? "#fbbf24" : "rgba(255,255,255,0.55)", border: `1px solid ${isReminderSet(currentActivity._id) ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.12)"}`, cursor: "pointer" }}
                  >
                    <Icon name={isReminderSet(currentActivity._id) ? "BellOff" : "Bell"} size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", fontFamily: "'Noto Sans TC',sans-serif", textAlign: "center", padding: "1.5rem 0 0.75rem" }}>
                目前暫無即將舉辦的{catLabel}
              </p>
            )}

            {/* 底部操作列（三個按鈕）*/}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.55rem" }}>
              {/* 偏好設定 */}
              <button
                className="native-btn"
                onClick={() => { hapticLight(); setPrefsSheetSelected(userPrefs || []); setShowPrefsSheet(true); }}
                style={{
                  flex: 1, padding: "0.55rem 0.7rem", borderRadius: "0.85rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                  color: "rgba(255,255,255,0.45)", fontSize: "0.78rem",
                  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 500,
                  minWidth: 0,
                }}
              >
                <Icon name="Sliders" size={13} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userPrefs && userPrefs.length > 0
                    ? `偏好：${userPrefs.map(id => PREF_OPTIONS.find(o => o.id === id)?.label).filter(Boolean).join("・")}`
                    : "設定偏好"}
                </span>
              </button>
              {/* 月曆 */}
              <button
                className="native-btn"
                onClick={() => { hapticLight(); setCalSheetMonth({ y: new Date().getFullYear(), m: new Date().getMonth() }); setShowCalSheet(true); }}
                style={{
                  flexShrink: 0, padding: "0.55rem 0.85rem", borderRadius: "0.85rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.78rem", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  cursor: "pointer",
                }}
              >
                <Icon name="CalendarDays" size={13} />
                月曆
              </button>
              {/* 篩選（有條件時高亮；長按切換時間排序）*/}
              <button
                className="native-btn"
                onClick={() => { hapticLight(); setShowFilterSheet(true); }}
                style={{
                  flexShrink: 0, padding: "0.55rem 0.85rem", borderRadius: "0.85rem",
                  border: `1px solid ${hasActiveFilter || sortByDate ? "rgba(251,191,36,0.7)" : "rgba(255,255,255,0.12)"}`,
                  background: hasActiveFilter || sortByDate ? "rgba(251,191,36,0.14)" : "transparent",
                  color: hasActiveFilter || sortByDate ? "#fbbf24" : "rgba(255,255,255,0.4)",
                  fontSize: "0.78rem", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  cursor: "pointer", position: "relative",
                }}
              >
                <Icon name="Search" size={13} />
                篩選
                {(hasActiveFilter || sortByDate) && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#fbbf24",
                  }} />
                )}
              </button>
            </div>

            {/* 警示語 */}
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.67rem", fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.6, textAlign: "center", marginBottom: "0.5rem" }}>
              ⚠ 活動資訊僅供參考，可能存在誤植，請至活動詳情頁再次確認。
            </p>

            {/* 向下提示（網頁版）/ 列表按鈕（app 版）*/}
            {displayList.length > 0 && (
              isNative ? (
                <button
                  onClick={() => setShowListSheet(true)}
                  className="native-btn"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "0.2rem",
                    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
                    paddingTop: "0.5rem",
                    width: "100%",
                    background: "none", border: "none", cursor: "pointer",
                    opacity: 0.45,
                  }}
                >
                  <div className="hint-float" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                    <Icon name="ChevronUp" size={16} />
                    <div style={{ width: 28, height: 3, borderRadius: 2, background: "#fff" }} />
                  </div>
                </button>
              ) : (
                <div className="scroll-hint" style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem", opacity: 0.3, transition: "opacity 200ms ease" }}>
                  <div className="bounce-y" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
                    <div style={{ width: 24, height: 2, borderRadius: 1, background: "#fff" }} />
                    <Icon name="ChevronDown" size={16} />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* 第二屏以後：完整活動列表 */}
        {(categoryList.length > 0 || hasActiveFilter) && (
          <div style={{ background: panelBg, paddingBottom: "4rem", scrollSnapAlign: "start", minHeight: "100dvh" }}>
            {/* 篩選結果標題列 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem 0.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                {hasActiveFilter
                  ? `搜尋結果・${filteredList.length} 筆`
                  : listHeader}
              </p>
              {hasActiveFilter && (
                <button
                  className="native-btn"
                  onClick={() => { setSearchQuery(""); setFilterDateFrom(""); setFilterDateTo(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fbbf24", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", padding: "0.1rem 0.2rem" }}
                >
                  清除篩選 ✕
                </button>
              )}
            </div>
            {filteredList.length > 0
              ? <ActivityListItems list={filteredList} />
              : (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Noto Sans TC',sans-serif" }}>
                  <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
                  <p style={{ fontSize: "0.92rem", marginBottom: "0.4rem" }}>找不到符合條件的活動</p>
                  <p style={{ fontSize: "0.78rem" }}>試試調整關鍵字或日期範圍</p>
                </div>
              )
            }
          </div>
        )}

        {/* ── 搜尋篩選底部面板 ── */}
        {showFilterSheet && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 300,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            animation: "backdropIn 0.22s ease both",
          }}>
            {/* 半透明遮罩 */}
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
              onClick={() => setShowFilterSheet(false)}
            />
            {/* 面板主體 */}
            <div style={{
              position: "relative", zIndex: 1,
              background: "#2c2c2e", borderRadius: "1.4rem 1.4rem 0 0",
              padding: "0 1.5rem calc(env(safe-area-inset-bottom, 0px) + 2rem)",
              animation: "sheetSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
              maxHeight: "85dvh", overflowY: "auto",
            }}>
              {/* 拖曳把手 */}
              <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 1.25rem" }}>
                <div className="handle-in" style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
              </div>

              <h3 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "1.4rem" }}>
                搜尋與篩選
              </h3>

              {/* 關鍵字搜尋 */}
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                關鍵字
              </p>
              <input
                className="native-input"
                type="text"
                placeholder="搜尋標題、講者、地點…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: "1.25rem" }}
              />

              {/* 日期範圍 */}
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                日期範圍
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <input
                  className="native-input"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>—</span>
                <input
                  className="native-input"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>

              {/* 排序方式 */}
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                排序方式
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <button
                  className="native-btn"
                  onClick={() => { hapticLight(); setSortByDate(false); }}
                  style={{
                    flex: 1, padding: "0.6rem 0", borderRadius: "0.75rem",
                    border: `1px solid ${!sortByDate ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)"}`,
                    background: !sortByDate ? "rgba(255,255,255,0.14)" : "transparent",
                    color: !sortByDate ? "#fff" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                  }}
                >
                  推薦排序
                </button>
                <button
                  className="native-btn"
                  onClick={() => { hapticLight(); setSortByDate(true); }}
                  style={{
                    flex: 1, padding: "0.6rem 0", borderRadius: "0.75rem",
                    border: `1px solid ${sortByDate ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.12)"}`,
                    background: sortByDate ? "rgba(255,255,255,0.14)" : "transparent",
                    color: sortByDate ? "#fff" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
                  }}
                >
                  <Icon name="Clock" size={13} />
                  時間排序
                </button>
              </div>

              {/* 結果預覽 */}
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", fontFamily: "'Noto Sans TC',sans-serif", textAlign: "center", marginBottom: "1.25rem" }}>
                {filteredList.length > 0
                  ? `找到 ${filteredList.length} 筆活動`
                  : "目前沒有符合條件的活動"}
              </p>

              {/* 操作按鈕 */}
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <button
                  className="native-btn"
                  onClick={() => { setSearchQuery(""); setFilterDateFrom(""); setFilterDateTo(""); setSortByDate(false); }}
                  style={{
                    flex: 1, padding: "0.85rem 0", borderRadius: "1rem",
                    border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                    color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans TC',sans-serif",
                    fontWeight: 600, fontSize: "0.92rem", cursor: "pointer",
                  }}
                >
                  清除
                </button>
                <button
                  className="native-btn"
                  onClick={() => setShowFilterSheet(false)}
                  style={{
                    flex: 2, padding: "0.85rem 0", borderRadius: "1rem",
                    background: "rgba(255,255,255,0.92)", color: "#1c1c1e",
                    border: "none", fontFamily: "'Noto Sans TC',sans-serif",
                    fontWeight: 700, fontSize: "0.92rem", cursor: "pointer",
                  }}
                >
                  {filteredList.length > 0 ? `顯示 ${filteredList.length} 筆結果` : "確認"}
                </button>
              </div>
              {/* 重新整理 */}
              <button
                className="native-btn"
                onClick={() => { hapticLight(); setShowFilterSheet(false); if (onRefresh) { setRefreshing(true); onRefresh(); setTimeout(() => setRefreshing(false), 1500); } }}
                style={{
                  width: "100%", padding: "0.75rem 0", borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                  color: "rgba(255,255,255,0.35)", fontFamily: "'Noto Sans TC',sans-serif",
                  fontWeight: 500, fontSize: "0.85rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                }}
              >
                <Icon name="History" size={14} />
                重新整理資料
              </button>
            </div>
          </div>
        )}

        {/* ── 列表 Bottom Sheet ── */}
        {showListSheet && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 300,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            animation: "backdropIn 0.22s ease both",
          }}>
            {/* 半透明遮罩 */}
            <div
              data-backdrop
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", transition: "opacity 60ms linear" }}
              onClick={closeSheetAnimated}
            />
            {/* 面板主體（can向下拖拽關閉）*/}
            <div
              ref={listSheetRef}
              style={{
                position: "relative", zIndex: 1,
                background: "#1c1c1e", borderRadius: "1.4rem 1.4rem 0 0",
                paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
                animation: "sheetSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
                maxHeight: "88dvh", display: "flex", flexDirection: "column",
                willChange: "transform",
              }}>
              {/* 拖曳把手 + 標題列 */}
              <div style={{ padding: "0.75rem 1.25rem 0.5rem", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <div className="handle-in" style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.28)" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.1em" }}>
                    {hasActiveFilter ? `搜尋結果・${filteredList.length} 筆` : listHeader}
                  </p>
                  <button onClick={closeSheetAnimated} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", cursor: "pointer", padding: "0.2rem 0.4rem", fontFamily: "'Noto Sans TC',sans-serif" }}>
                    關閉 ✕
                  </button>
                </div>
              </div>
              {/* 列表（手動 scroll 物理，overflow hidden + translateY）*/}
              <div className="sheet-scroll-cont" style={{ overflow: "hidden", flex: 1, position: "relative" }}>
                <div className="sheet-scroll-content">
                  {filteredList.length > 0
                    ? <>
                        <ActivityListItems
                          list={shownList}
                          onSelect={ev => {
                            const idx = displayList.findIndex(d => d._id === ev._id);
                            if (idx !== -1) setCurrentActivityIndex(idx);
                            closeSheetAnimated();
                          }}
                        />
                        {shownList.length < filteredList.length && (
                          <div style={{ padding: "1rem", textAlign: "center" }}>
                            <button onClick={() => setListPage(p => p + 1)}
                              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "2rem", padding: "0.6rem 1.8rem", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer" }}>
                              載入更多（剩 {filteredList.length - shownList.length} 筆）
                            </button>
                          </div>
                        )}
                      </>
                    : (
                      <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "rgba(255,255,255,0.28)", fontFamily: "'Noto Sans TC',sans-serif" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
                        <p style={{ fontSize: "0.92rem", marginBottom: "0.5rem", color: "rgba(255,255,255,0.45)" }}>沒有符合條件的活動</p>
                        <p style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                          試試調整搜尋關鍵字<br />或清除日期篩選條件
                        </p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 偏好設定 Bottom Sheet ── */}
        {showPrefsSheet && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 350,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            animation: "backdropIn 0.22s ease both",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setShowPrefsSheet(false)} />
            <div style={{
              position: "relative", zIndex: 1,
              background: "#1c1c1e", borderRadius: "1.4rem 1.4rem 0 0",
              padding: "0 1.5rem calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
              animation: "sheetSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
              maxHeight: "80dvh", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 1.25rem", flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.5rem", flexShrink: 0 }}>
                選擇感興趣的領域
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "1.2rem", flexShrink: 0 }}>
                可選多個，將優先推薦相關活動
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", overflowY: "auto", flex: 1, paddingBottom: "1rem" }}>
                {PREF_OPTIONS.map(opt => {
                  const sel = prefsSheetSelected.includes(opt.id);
                  return (
                    <button key={opt.id}
                      onClick={() => setPrefsSheetSelected(prev => prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id])}
                      style={{
                        padding: "0.9rem 1rem", borderRadius: "1rem",
                        border: `1.5px solid ${sel ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)"}`,
                        background: sel ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.3rem",
                        transition: "all 180ms ease", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem", fontWeight: 900, fontFamily: "'Noto Sans TC',sans-serif", color: "rgba(255,255,255,0.55)" }}>{opt.label[0]}</span>
                      <span style={{ color: sel ? "#fff" : "rgba(255,255,255,0.65)", fontSize: "0.88rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif" }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* 批量提醒 */}
              <div style={{ paddingTop: "0.5rem", paddingBottom: "0.75rem", flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "0.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.5rem" }}>
                  一鍵提醒・{REMINDER_OPTS.find(o => o.id === reminderOffset)?.desc || "前一天 09:00"}
                </p>
                <button onClick={() => { setBatchReminders(displayList); setShowPrefsSheet(false); }}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.85rem", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                  <Icon name="Bell" size={14} /> 對目前 {displayList.filter(ev => !isReminderSet(ev._id)).length} 個活動設提醒
                </button>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", paddingTop: "1rem", flexShrink: 0 }}>
                <button onClick={() => { savePrefs([]); setShowPrefsSheet(false); }}
                  style={{ flex: 1, padding: "0.85rem 0", borderRadius: "1rem", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                  顯示全部
                </button>
                <button onClick={() => { savePrefs(prefsSheetSelected); setShowPrefsSheet(false); }}
                  style={{ flex: 2, padding: "0.85rem 0", borderRadius: "1rem", background: prefsSheetSelected.length > 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.2)", border: "none", color: prefsSheetSelected.length > 0 ? "#1c1c1e" : "rgba(255,255,255,0.35)", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer" }}>
                  {prefsSheetSelected.length > 0 ? `套用（${prefsSheetSelected.length} 項）` : "請選擇"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 提醒時間選擇 sheet ── */}
        {showReminderSheet && reminderSheetEv && (
          <div onClick={() => setShowReminderSheet(false)} style={{ position: "fixed", inset: 0, zIndex: 20001, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "#2c2c2e", borderRadius: "1.4rem 1.4rem 0 0", padding: "0 1.25rem calc(env(safe-area-inset-bottom,0px) + 1.25rem)", animation: "sheetSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both" }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 1rem" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", textAlign: "center", marginBottom: "0.5rem" }}>
                提醒時間
              </p>
              <p style={{ color: "#fff", fontSize: "0.9rem", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, textAlign: "center", marginBottom: "1.25rem", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {reminderSheetEv.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "0.75rem" }}>
                {REMINDER_OPTS.map(opt => (
                  <button key={opt.id} onClick={() => scheduleReminderWithOffset(reminderSheetEv, opt.id)}
                    style={{ padding: "0.9rem 1.1rem", borderRadius: "1rem", background: opt.id === reminderOffset ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.07)", border: "none", color: opt.id === reminderOffset ? "#1c1c1e" : "#fff", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{opt.label}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.55 }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowReminderSheet(false)} style={{ width: "100%", padding: "0.75rem", borderRadius: "1rem", border: "none", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer" }}>
                取消
              </button>
            </div>
          </div>
        )}

        {/* ── 行事曆選單 ── */}
        {calMenuEv && (
          <div
            onClick={() => setCalMenuEv(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 20001,
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "flex-end",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%",
                background: "#2c2c2e",
                borderRadius: "1.4rem 1.4rem 0 0",
                padding: "1.5rem 1.25rem",
                paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 1.5rem)",
                display: "flex", flexDirection: "column", gap: "0.75rem",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", fontFamily: "'Noto Sans TC',sans-serif", textAlign: "center", marginBottom: "0.25rem" }}>
                加入行事曆
              </div>
              <button
                onClick={() => addToAppleCalendar(calMenuEv)}
                style={{
                  width: "100%", padding: "0.95rem",
                  borderRadius: "1rem", border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "1rem", fontWeight: 600,
                  fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                }}
              >
                🍎 Apple 日曆
              </button>
              <button
                onClick={() => addToGoogleCalendar(calMenuEv)}
                style={{
                  width: "100%", padding: "0.95rem",
                  borderRadius: "1rem", border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: "1rem", fontWeight: 600,
                  fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                }}
              >
                🗓 Google 日曆
              </button>
              <button
                onClick={() => setCalMenuEv(null)}
                style={{
                  width: "100%", padding: "0.85rem",
                  borderRadius: "1rem", border: "none",
                  background: "none",
                  color: "rgba(255,255,255,0.4)", fontSize: "0.9rem",
                  fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer",
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* ── 月曆 sheet ── */}
        {showCalSheet && (() => {
          const { y, m } = calSheetMonth;
          const monthLabel = `${y} 年 ${m + 1} 月`;
          const firstDay = new Date(y, m, 1).getDay();
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const today = new Date();

          const dayEventsMap = {};
          upcomingActivities.forEach(ev => {
            const ds = ev.date?.trim() || "";
            const fp = ds.split(/[~,～，]/)[0].trim();
            const dp = fp.split(" ")[0];
            if (!dp) return;
            try {
              const d = new Date(dp + "T00:00:00");
              if (d.getFullYear() === y && d.getMonth() === m) {
                const day = d.getDate();
                if (!dayEventsMap[day]) dayEventsMap[day] = [];
                dayEventsMap[day].push(ev);
              }
            } catch {}
          });

          const weeks = [];
          let cells = Array(firstDay).fill(null);
          for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d);
            if (cells.length === 7) { weeks.push(cells); cells = []; }
          }
          if (cells.length) { while (cells.length < 7) cells.push(null); weeks.push(cells); }

          const prevMonth = () => { setCalSelectedDay(null); setCalSheetMonth(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }); };
          const nextMonth = () => { setCalSelectedDay(null); setCalSheetMonth(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }); };

          const catDot = (category) => {
            if (category === "學術講座") return "#60a5fa";
            if (category?.includes("工作坊") || category?.includes("研討")) return "#4ade80";
            if (category === "徵稿資訊") return "#fbbf24";
            return "#a78bfa";
          };

          return (
            <div onClick={() => { setShowCalSheet(false); setCalSelectedDay(null); }} style={{ position: "fixed", inset: 0, zIndex: 20001, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end" }}>
              <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "#1c1c1e", borderRadius: "1.4rem 1.4rem 0 0", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 1rem)", maxHeight: "88dvh", display: "flex", flexDirection: "column", animation: "slideUp 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0 0.25rem" }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1.25rem 0.75rem" }}>
                  <button onClick={prevMonth} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "1.4rem", cursor: "pointer", padding: "0.25rem 0.5rem" }}>‹</button>
                  <span style={{ color: "#fff", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: "1rem" }}>{monthLabel}</span>
                  <button onClick={nextMonth} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "1.4rem", cursor: "pointer", padding: "0.25rem 0.5rem" }}>›</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 1rem", marginBottom: "0.35rem" }}>
                  {["日","一","二","三","四","五","六"].map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Noto Sans TC',sans-serif", padding: "0.2rem 0" }}>{d}</div>
                  ))}
                </div>
                <div style={{ padding: "0 0.75rem", flex: 1, overflowY: "auto" }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem", marginBottom: "0.25rem" }}>
                      {week.map((day, di) => {
                        if (!day) return <div key={di} />;
                        const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day;
                        const evs = dayEventsMap[day] || [];
                        const hasEvs = evs.length > 0;
                        const isSelected = calSelectedDay === day;
                        return (
                          <button key={di} onClick={() => { hapticLight(); setCalSelectedDay(isSelected ? null : day); }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.45rem 0.2rem", borderRadius: "0.65rem", border: "none", cursor: "pointer", minHeight: "2.6rem",
                              background: isSelected ? "rgba(255,255,255,0.18)" : isToday ? "rgba(255,255,255,0.08)" : "transparent",
                              outline: isToday && !isSelected ? "1.5px solid rgba(255,255,255,0.3)" : "none",
                            }}>
                            <span style={{ fontSize: "0.9rem", fontFamily: "'Noto Serif TC',serif", color: isSelected ? "#fff" : isToday ? "#fff" : "rgba(255,255,255,0.75)", fontWeight: isToday ? 700 : 400 }}>{day}</span>
                            {hasEvs && (
                              <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                                {evs.slice(0, 3).map((ev, i) => (
                                  <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: catDot(ev.category) }} />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {calSelectedDay && dayEventsMap[calSelectedDay] && (
                  <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", marginBottom: "0.5rem" }}>{m + 1} 月 {calSelectedDay} 日</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "180px", overflowY: "auto" }}>
                      {dayEventsMap[calSelectedDay].map(ev => (
                        <button
                          key={ev._id}
                          onClick={() => jumpToCalendarActivity(ev)}
                          style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", background: "rgba(255,255,255,0.05)", borderRadius: "0.75rem", padding: "0.6rem 0.75rem", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: catDot(ev.category), marginTop: "0.3rem", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, lineHeight: 1.3, marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                            {ev.date && <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif" }}>📅 {ev.date}</p>}
                            {ev.location && <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif" }}>{isOnlineLocation(ev.location) ? "💻" : "📍"} {ev.location}</p>}
                          </div>
                          <div style={{ flexShrink: 0, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                            <Icon name="ChevronRight" size={14} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => { setShowCalSheet(false); setCalSelectedDay(null); }} style={{ margin: "0.5rem 1.25rem", padding: "0.75rem", borderRadius: "1rem", border: "none", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", fontFamily: "'Noto Sans TC',sans-serif", cursor: "pointer" }}>
                  關閉
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  /* ── 主打活動資料 ── */
  const featuredSessions = [
    {
      label: "SESSION 1", title: "又被退了！論文投稿的甘苦談",
      speakers: [
        "王誠御／國立臺灣大學中國文學系博士候選人",
        "嚴浩然／國立成功大學中國文學系博士候選人",
        "楊卓剛／國立成功大學中國文學系博士生",
      ],
    },
    {
      label: "SESSION 2", title: "我看了什麼？審查委員的辛酸",
      speakers: [
        "鄭吉雄／香港教育大學文學與文化學系客席研究講座教授",
        "蔡瑩瑩／臺北市立大學中語系助理教授",
        "葉叡宸／國立臺灣大學中文系助理教授",
        "吳佩熏／勤益科技大學通識中心助理教授",
        "趙旻祐／韓國延世大學中文系助理教授",
      ],
    },
  ];
  const featuredAgenda = [
    { time: "09:30 – 10:00", title: "報到時間", sub: null },
    { time: "10:00 – 10:10", title: "開幕式", sub: "主辦：北市大儒學中心、臺師大國文系　協辦：中華孔孟學會" },
  ];
  const featuredGoals = [
    { tag: "目標一", title: "雙向視角的學術發表機制揭示", body: "學術論文的投稿與審查長期被視為「黑箱」歷程，研究生往往只能透過個人摸索逐步累積經驗。本論壇透過「投稿者經驗分享」與「審查者視角揭示」兩場圓桌論壇的對照設計，讓參與者得以同時聽見發表端的實戰歷程與審查端的判斷邏輯，將原本隱性的學術發表知識公開化、結構化，縮短研究生從「完成論文」到「成功發表」之間的學習曲線。" },
    { tag: "目標二", title: "讀書會協作經驗的對外延伸", body: "讀書會運作期間，成員論文已歷經多輪同儕審查與修訂，部分成員亦累積實際投稿與修稿經驗。本論壇邀請其中三位博士生擔任分享人，將讀書會內部的協作學習成果轉化為可向外傳遞的實務知識，使本次活動不僅是讀書會的階段性總結，亦為更廣泛的研究生社群提供可參照的學習資源。" },
    { tag: "目標三", title: "跨校學術對話與社群深化", body: "本論壇邀集來自臺、港、韓三地的學者專家擔任座談人，並開放其他有興趣的研究生參與，期能以讀書會的協作學習實踐為討論基礎，探討跨校、跨地域研究生如何在中文學科的不同次領域間建立有效的學術合作模式，並為後續學期的讀書會運作與擴展提供反思與規劃的契機。" },
  ];
  const featuredOutcomes = [
    { tag: "成效一", title: "公開化學術發表的隱性知識", body: "透過投稿者與審查者雙向視角的圓桌對話，使學術論文從撰寫、投稿、回應審查到最終刊登的完整歷程具體呈現於參與者面前。預期參與者得以掌握期刊審稿的常見評估標準、退稿與修改要求的應對策略，以及不同期刊定位與投稿選擇的判斷依據，將原本仰賴個人摸索的隱性知識轉化為可學習、可複製的實務能力。" },
    { tag: "成效二", title: "強化讀書會成員的學術發表動能", body: "讀書會三位分享人於整理投稿經驗的過程中，必須對自身研究歷程進行反思性梳理；其餘成員亦可透過聆聽座談學者揭示的審查視角，重新檢視自身論文的修訂方向。預期讀書會全體成員於本論壇結束後，能對手中論文的投稿策略形成更明確的規劃，提升學期內外的論文發表成效。" },
    { tag: "成效三", title: "形成可延續的跨校學術合作模式", body: "藉由跨校、跨地域學者與研究生的同場交流，歸納讀書會一年來的協作學習經驗，探索中文學科研究生學術社群的可持續運作方式，為後續學期的讀書會擴展與深化奠定基礎。" },
  ];
  const d = isDarkMode;

  return (
    <div className="space-y-10 md:space-y-14 page-enter-zoom stagger relative z-10">

      {/* ===================== 主打活動卡片 ===================== */}
      <section
        onClick={() => setShowEventDetail(true)}
        style={{
          display: "flex", flexDirection: "column",
          background: d ? "rgba(18,35,26,0.72)" : "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: d ? "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)" : "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
          border: d ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.6)",
          cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
          fontFamily: "'Noto Serif TC', serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = d ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.16)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = d ? "0 8px 32px rgba(0,0,0,0.45)" : "0 8px 32px rgba(0,0,0,0.10)"; }}
      >
        <div style={{ position: "relative", width: "100%", height: 360, overflow: "hidden", background: "#1a1a1a" }}>
          <img src="/poster-roundtable.png" alt="圓桌論壇海報" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: d ? "linear-gradient(to bottom,rgba(0,0,0,0) 40%,#12231a 100%)" : "linear-gradient(to bottom,rgba(255,255,255,0) 50%,#fff 100%)" }} />
        </div>
        <div style={{ padding: "12px 24px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: d ? "rgba(255,255,255,0.10)" : "#f0f0f0", color: d ? "#c8e6c9" : "#555", fontSize: 11, padding: "3px 10px", borderRadius: 20, letterSpacing: 1 }}>✦ 主打活動</span>
            <span style={{ background: "rgba(192,57,43,0.12)", color: "#c0392b", fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(192,57,43,0.25)" }}>線上 ＋ 實體</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#c0392b", borderRadius: 8, padding: "5px 14px", width: "fit-content" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>May. 14</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>10:00 ~ 12:00</span>
          </div>
          <div>
            <div style={{ color: d ? "rgba(200,230,200,0.6)" : "#888", fontSize: 11, letterSpacing: 2, marginBottom: 3 }}>中文學科論文寫作增能</div>
            <div style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 24, fontWeight: 800, lineHeight: 1.15, letterSpacing: 2 }}>圓桌論壇</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2, flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: d ? "#c8d8c8" : "#333", fontSize: 13, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span>📍 臺北市立大學 公誠樓 G412</span>
              <span>🎥 Google Meet</span>
            </div>
            <span style={{ color: "#c0392b", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>查看詳情 →</span>
          </div>
        </div>
      </section>

      {/* ─── 詳情 Modal ─── */}
      {showEventDetail && createPortal(
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowEventDetail(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            fontFamily: "'Noto Serif TC', serif",
            animation: "feModalFadeIn 0.25s ease forwards",
          }}
        >
          <style>{`
            @keyframes feModalFadeIn { from { opacity:0; } to { opacity:1; } }
            @keyframes feSheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
            #fe-modal-sheet::-webkit-scrollbar { display: none; }
          `}</style>
          <div id="fe-modal-sheet" style={{
            width: "100%", maxWidth: 680, maxHeight: "90vh",
            background: d ? "#1c1c1e" : "#fff",
            borderRadius: "24px 24px 0 0",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            boxShadow: "0 -12px 60px rgba(0,0,0,0.3)",
            animation: "feSheetUp 0.38s cubic-bezier(0.32,0.72,0,1) forwards",
          }}>
            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 2, background: d ? "#1c1c1e" : "#fff", borderBottom: `1px solid ${d ? "rgba(255,255,255,0.08)" : "#f0f0f0"}`, padding: "12px 20px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <div style={{ width: 36, height: 4, background: d ? "rgba(255,255,255,0.2)" : "#e0e0e0", borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: d ? "rgba(200,200,200,0.6)" : "#888", fontSize: 11, letterSpacing: 2 }}>中文學科論文寫作增能</div>
                  <div style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 17, fontWeight: 800, letterSpacing: 1 }}>圓桌論壇　活動計畫</div>
                </div>
                <button onClick={() => setShowEventDetail(false)} style={{ background: d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 15, cursor: "pointer", color: d ? "#fff" : "#333", flexShrink: 0 }}>✕</button>
              </div>
            </div>

            {/* Poster */}
            <div style={{ width: "100%", padding: "0 16px 8px", flexShrink: 0 }}>
              <img src="/poster-roundtable.png" alt="圓桌論壇海報" style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }} />
            </div>

            {/* Body */}
            <div style={{ padding: "4px 24px 48px", display: "flex", flexDirection: "column", gap: 28 }}>

              {/* 議程 */}
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 24, background: "#c0392b", borderRadius: 2 }} />
                  <span style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>議程</span>
                  <span style={{ color: d ? "rgba(200,200,200,0.5)" : "#888", fontSize: 12 }}>May 14　臺北市立大學 公誠樓 G412</span>
                </div>
                <div>
                  {featuredAgenda.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${d ? "rgba(255,255,255,0.07)" : "#f0f0f0"}` }}>
                      <div style={{ minWidth: 108, color: "#c0392b", fontSize: 12, fontWeight: 600, paddingTop: 2 }}>{item.time}</div>
                      <div>
                        <div style={{ color: d ? "#e8e8d8" : "#1a1a1a", fontSize: 14, fontWeight: 600 }}>{item.title}</div>
                        {item.sub && <div style={{ color: d ? "rgba(200,200,200,0.55)" : "#888", fontSize: 12, marginTop: 3 }}>{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 14, padding: "12px 0" }}>
                    <div style={{ minWidth: 108, color: "#c0392b", fontSize: 12, fontWeight: 600, paddingTop: 2 }}>10:10 – 11:40</div>
                    <div style={{ flex: 1 }}>
                      {featuredSessions.map((s, si) => (
                        <div key={si} style={{ marginBottom: si < featuredSessions.length - 1 ? 18 : 0 }}>
                          <div style={{ background: d ? "rgba(192,57,43,0.12)" : "#fff5f5", borderLeft: "3px solid #c0392b", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 8 }}>
                            <div style={{ color: "#c0392b", fontSize: 10, letterSpacing: 2, marginBottom: 3, opacity: 0.8 }}>圓桌論壇（{si + 1}）</div>
                            <div style={{ color: d ? "#e8e8d8" : "#1a1a1a", fontSize: 14, fontWeight: 700 }}>{s.title}</div>
                          </div>
                          <div style={{ paddingLeft: 4 }}>
                            <div style={{ color: d ? "rgba(200,200,200,0.5)" : "#888", fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>{si === 0 ? "分享人" : "座談學者"}</div>
                            {s.speakers.map((sp, pi) => (
                              <div key={pi} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                                <span style={{ color: "#c0392b", fontSize: 10, marginTop: 3, flexShrink: 0 }}>▸</span>
                                <span style={{ color: d ? "rgba(220,210,190,0.85)" : "#333", fontSize: 13, lineHeight: 1.6 }}>{sp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 計畫目的 */}
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 24, background: "#c0392b", borderRadius: 2 }} />
                  <span style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>一、計畫目的</span>
                </div>
                <p style={{ margin: 0, color: d ? "rgba(220,210,190,0.85)" : "#333", fontSize: 13, lineHeight: 2, textAlign: "justify" }}>
                  「中文學科論文寫作增能圓桌論壇」為「中文學科論文寫作增能讀書會」之學期成果交流活動，並結合國立臺灣師範大學國文學系80週年系慶及臺北市立大學儒學中心支持之跨校研究生學術活動。本讀書會於114學年第2學期運作，由來自臺師大、臺大、成大、高師大、中山及復旦大學等校的約10位博碩士研究生組成，以同儕審查為核心機制，歷經4次專題會議，針對成員的學術論文進行深度討論與修訂。
                </p>
                <p style={{ margin: "12px 0 0", color: d ? "rgba(220,210,190,0.85)" : "#333", fontSize: 13, lineHeight: 2, textAlign: "justify" }}>
                  有別於一般以論文宣讀為主的學術研討會，本論壇將讀書會學期間累積的投稿與修稿經驗，轉化為「投稿者」與「審查者」雙向對話的公開交流平臺。第一場圓桌論壇邀請讀書會中已具實質投稿經驗的博士生，分享論文從撰寫、投稿到回應審查意見的完整歷程；第二場圓桌論壇則邀請長期擔任期刊審稿人或編輯委員的學者專家，從審查端揭示審稿過程中常見的判斷標準與評估邏輯。透過此種雙向視角的對照，期能使參與者具體理解學術發表機制的運作實況，將個別摸索的經驗轉化為可複製、可傳承的學術寫作知能。
                </p>
                <p style={{ margin: "12px 0 0", color: d ? "rgba(220,210,190,0.85)" : "#333", fontSize: 13, lineHeight: 2, textAlign: "justify" }}>
                  同時，本論壇亦期望以讀書會的協作學習實踐為基礎，向更廣泛的研究生社群傳遞論文架構規劃、投稿修稿策略、期刊選擇等實務知識，促成跨校、跨領域的學術對話，為中文學科研究生建立可持續的學術支持網絡。
                </p>
              </section>

              {/* 計畫目標 */}
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 24, background: "#c0392b", borderRadius: 2 }} />
                  <span style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>二、計畫目標</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {featuredGoals.map((g, gi) => (
                    <div key={gi} style={{ background: d ? "rgba(255,255,255,0.05)" : "#fafafa", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{g.tag}</span>
                        <span style={{ color: d ? "#e8e8d8" : "#1a1a1a", fontSize: 13, fontWeight: 700 }}>{g.title}</span>
                      </div>
                      <p style={{ margin: 0, color: d ? "rgba(200,190,175,0.8)" : "#444", fontSize: 12, lineHeight: 1.9, textAlign: "justify" }}>{g.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 預期成效 */}
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 24, background: "#c0392b", borderRadius: 2 }} />
                  <span style={{ color: d ? "#f0f0e8" : "#1a1a1a", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>三、預期成效</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {featuredOutcomes.map((o, oi) => (
                    <div key={oi} style={{ background: d ? "rgba(255,255,255,0.05)" : "#fafafa", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ background: d ? "rgba(192,57,43,0.6)" : "#e8d5d5", color: d ? "#ffd0c8" : "#7a2020", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{o.tag}</span>
                        <span style={{ color: d ? "#e8e8d8" : "#1a1a1a", fontSize: 13, fontWeight: 700 }}>{o.title}</span>
                      </div>
                      <p style={{ margin: 0, color: d ? "rgba(200,190,175,0.8)" : "#444", fontSize: 12, lineHeight: 1.9, textAlign: "justify" }}>{o.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <a href="https://meet.google.com/fdh-crrz-mfb" target="_blank" rel="noreferrer"
                style={{ display: "block", textAlign: "center", background: "#c0392b", color: "#fff", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, letterSpacing: 1, textDecoration: "none" }}>
                加入 Google Meet →
              </a>
            </div>
          </div>
        </div>
      , document.body)}

      {/* ===================== Hero ===================== */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 30%, rgba(212,162,78,0.14), transparent 30%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)"
              : "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.65), transparent 35%), radial-gradient(circle at 80% 30%, rgba(212,162,78,0.22), transparent 30%), linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
          }}
        />
        <div
          className="absolute top-6 left-6 md:top-10 md:left-10 h-16 w-16 md:h-24 md:w-24 rounded-full blur-2xl opacity-50"
          style={{ background: "var(--c-accent)" }}
        />
        <div
          className="absolute bottom-8 right-8 md:bottom-10 md:right-12 h-20 w-20 md:h-28 md:w-28 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--c-primary)" }}
        />
        {/* 右側裝飾勳章 */}
        <div
          className="absolute right-[-80px] sm:right-[-50px] md:right-[-30px] top-1/2 -translate-y-1/2 w-64 sm:w-72 md:w-80 aspect-square opacity-[0.18] pointer-events-none float-anim"
          style={{ color: "var(--c-accent)" }}
        >
          <HeroMedallion />
        </div>
        {/* 左側較小勳章 */}
        <div
          className="absolute left-[-70px] sm:left-[-45px] md:left-[-25px] top-1/2 -translate-y-1/2 w-44 sm:w-52 md:w-60 aspect-square opacity-[0.12] pointer-events-none float-anim-2"
          style={{ color: "var(--c-accent)" }}
        >
          <HeroMedallion />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-sans border mb-6"
            style={{
              background: "rgba(var(--c-panel-rgb),0.45)",
              borderColor: "rgba(var(--c-border-rgb),0.55)",
              color: "var(--c-primary-dark)",
            }}
          >
            <Icon name="BookOpen" size={16} />
            志於道・據於德・依於仁・游於藝
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5 tracking-[0.18em] font-sans theme-heading">
            中文研究室
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isNative && (
              <button
                onClick={() => setPage("about")}
                className="text-white px-8 py-3 rounded-full font-medium font-sans shadow-lg flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
                style={{
                  background: "var(--c-nav-active-bg)",
                  borderColor: "var(--c-nav-active-border)",
                }}
              >
                探索研究室 <Icon name="ChevronRight" size={20} />
              </button>
            )}
            <button
              onClick={() => setPage("activities")}
              className="px-8 py-3 rounded-full font-medium font-sans flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
              style={{
                background: isNative ? "var(--c-nav-active-bg)" : "rgba(var(--c-panel-rgb),0.45)",
                borderColor: isNative ? "var(--c-nav-active-border)" : "rgba(var(--c-border-rgb),0.6)",
                color: isNative ? "#fff" : "var(--c-primary-dark)",
              }}
            >
              查看近期活動 <Icon name="Megaphone" size={20} />
            </button>
            {isNative && (
              <button
                onClick={() => setPage("books")}
                className="px-8 py-3 rounded-full font-medium font-sans flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(var(--c-panel-rgb),0.45)",
                  borderColor: "rgba(var(--c-border-rgb),0.6)",
                  color: "var(--c-primary-dark)",
                }}
              >
                資源分享 <Icon name="Library" size={20} />
              </button>
            )}
          </div>
        </div>
      </section>


      {/* ===================== 快速導覽卡片 ===================== */}
      <section className="grid grid-cols-2 gap-4 md:gap-5">
        {(isNative ? navCards.filter(n => n.id === "activities" || n.id === "books") : navCards).map((nav) => (
          <button
            key={nav.id}
            onClick={() => setPage(nav.id)}
            className="relative text-left rounded-3xl p-5 md:p-6 border overflow-hidden spring-transition hover:-translate-y-2 hover:shadow-xl active:scale-[0.97] group"
            style={{
              background: nav.gradient,
              borderColor: nav.borderColor,
            }}
          >
            {/* 幾何紋樣底紋 */}
            <NavCardPattern />
            {/* 裝飾性光球 */}
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{ background: nav.blobColor }}
            />
            {/* Icon 框 */}
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300"
              style={{
                background: isDarkMode ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.78)",
                borderColor: nav.borderColor,
                color: nav.accentColor,
              }}
            >
              <Icon name={nav.icon} size={22} />
            </div>
            {/* 標題 */}
            <p
              className="text-sm md:text-base font-bold font-sans mb-1 relative z-10 tracking-wide"
              style={{ color: nav.accentColor }}
            >
              {nav.label}
            </p>
            {/* 說明 */}
            <p className="text-xs font-sans theme-text-secondary opacity-65 mb-4 relative z-10">
              {nav.desc}
            </p>
            {/* 底部：數量標籤 ＋ 箭頭 */}
            <div className="flex items-center justify-between relative z-10">
              {nav.count != null ? (
                <span
                  className="text-xs font-bold font-sans px-2.5 py-1 rounded-full border"
                  style={{
                    background: isDarkMode ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.68)",
                    color: nav.accentColor,
                    borderColor: nav.borderColor,
                  }}
                >
                  {nav.count} {nav.countLabel}
                </span>
              ) : (
                <span />
              )}
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center opacity-30 group-hover:opacity-90 group-hover:translate-x-1 transition-all duration-300"
                style={{ color: nav.accentColor }}
              >
                <Icon name="ChevronRight" size={18} />
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* ===================== 翻頁式近期活動 ===================== */}
      <section className="rounded-3xl overflow-hidden glass-panel shadow-sm">
        {/* Top accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background: isDarkMode
              ? "linear-gradient(90deg, rgba(2,132,199,0.9) 0%, rgba(2,132,199,0.15) 100%)"
              : "linear-gradient(90deg, rgba(2,132,199,0.65) 0%, rgba(2,132,199,0.08) 100%)",
          }}
        />
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6 gap-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-sans border"
              style={{
                background: isDarkMode ? "rgba(2,132,199,0.2)" : "rgba(2,132,199,0.12)",
                color: isDarkMode ? "#7dd3fc" : "#0369a1",
                borderColor: isDarkMode ? "rgba(2,132,199,0.4)" : "rgba(2,132,199,0.25)",
              }}
            >
              <Icon name="Megaphone" size={16} />
              即將舉辦活動
            </div>

            <button
              onClick={() => setPage("activities")}
              className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1 shrink-0"
            >
              查看全部 <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          {upcomingActivities.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
              <p className="theme-text-secondary font-sans text-center">
                目前暫無即將舉辦的活動。
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/40 shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 w-2"
                  style={{ background: activityBadge?.color || "var(--c-accent)" }}
                />

                <div className="p-6 md:p-8 md:pl-10">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
                    {/* 左側資訊 */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                          style={{
                            background: activityBadge?.bg,
                            color: activityBadge?.color,
                            borderColor: activityBadge?.border,
                          }}
                        >
                          <Icon name="Megaphone" size={12} />
                          {currentActivity.category}
                        </span>
                        <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                          <Icon name="Calendar" size={14} />
                          {safeIdx + 1} / {upcomingActivities.length}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans theme-heading leading-snug mb-4">
                        {currentActivity.title}
                      </h3>

                      <div className="space-y-3 text-sm md:text-base theme-text-secondary mb-5">
                        <div className="flex items-start gap-3">
                          <span
                            className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                            style={{
                              background: "rgba(var(--c-panel-rgb),0.5)",
                              borderColor: "rgba(var(--c-border-rgb),0.5)",
                            }}
                          >
                            <Icon name="Calendar" size={15} />
                          </span>
                          <span className="leading-relaxed">{currentActivity.date}</span>
                        </div>

                        {currentActivity.location && (
                          <div className="flex items-start gap-3">
                            <span
                              className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                              style={{
                                background: "rgba(var(--c-panel-rgb),0.5)",
                                borderColor: "rgba(var(--c-border-rgb),0.5)",
                              }}
                            >
                              <Icon name="MapPin" size={15} />
                            </span>
                            <span className="leading-relaxed">{currentActivity.location}</span>
                          </div>
                        )}
                      </div>

                      {currentActivity.description && (
                        <p className="text-sm md:text-base leading-relaxed font-serif content-justify theme-text-secondary bg-white/30 border border-white/40 rounded-2xl p-4 mb-5">
                          {currentActivity.description}
                        </p>
                      )}

                      <div className="mt-auto flex flex-wrap gap-3">
                        {currentActivity.link && (
                          <a
                            href={currentActivity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold font-sans shadow-sm border transition-transform hover:-translate-y-0.5"
                            style={{
                              background: "var(--c-accent)",
                              color: "#fff",
                              borderColor: "var(--c-accent)",
                            }}
                          >
                            活動詳情 <Icon name="ExternalLink" size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => setPage("activities")}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold font-sans shadow-sm border"
                          style={{
                            background: "rgba(var(--c-panel-rgb),0.45)",
                            color: "var(--c-primary-dark)",
                            borderColor: "rgba(var(--c-border-rgb),0.6)",
                          }}
                        >
                          全部活動 <Icon name="ChevronRight" size={16} />
                        </button>
                      </div>
                    </div>

                    {/* 右側翻頁控制 */}
                    <div className="lg:w-[280px] shrink-0 flex flex-col justify-between gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={prevActivity}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-sans font-bold spring-transition hover:scale-[1.03] active:scale-95"
                          style={{
                            background: "rgba(var(--c-panel-rgb),0.45)",
                            color: "var(--c-primary-dark)",
                            borderColor: "rgba(var(--c-border-rgb),0.6)",
                          }}
                          aria-label="上一則活動"
                        >
                          <Icon name="ChevronLeft" size={18} /> 上一則
                        </button>
                        <button
                          onClick={nextActivity}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-sans font-bold spring-transition hover:scale-[1.03] active:scale-95"
                          style={{
                            background: "rgba(var(--c-panel-rgb),0.45)",
                            color: "var(--c-primary-dark)",
                            borderColor: "rgba(var(--c-border-rgb),0.6)",
                          }}
                          aria-label="下一則活動"
                        >
                          下一則 <Icon name="ChevronRight" size={18} />
                        </button>
                      </div>

                      <div
                        className="rounded-2xl border p-4"
                        style={{
                          background: "rgba(var(--c-panel-rgb),0.32)",
                          borderColor: "rgba(var(--c-border-rgb),0.5)",
                        }}
                      >
                        <p className="text-xs font-sans uppercase tracking-[0.2em] theme-text-secondary opacity-60 mb-3">
                          Page
                        </p>
                        <div className="flex items-end gap-2 mb-4">
                          <span className="text-3xl font-bold font-sans theme-heading leading-none">
                            {String(safeIdx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-mono theme-text-secondary opacity-60 pb-1">
                            / {String(upcomingActivities.length).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getVisibleDots(upcomingActivities.length, safeIdx, 7).map((i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentActivityIndex(i)}
                              aria-label={`切換到第 ${i + 1} 個活動`}
                              className="rounded-full transition-all duration-300 shrink-0"
                              style={{
                                width: i === safeIdx ? "26px" : "8px",
                                height: "8px",
                                background:
                                  i === safeIdx
                                    ? "var(--c-accent)"
                                    : isDarkMode
                                    ? "rgba(148,163,184,0.35)"
                                    : "rgba(100,116,139,0.25)",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div
                        className="rounded-2xl border p-4"
                        style={{
                          background: "rgba(var(--c-panel-rgb),0.32)",
                          borderColor: "rgba(var(--c-border-rgb),0.5)",
                        }}
                      >
                        <p className="text-xs font-sans theme-text-secondary opacity-60 mb-2">
                          下一則預告
                        </p>
                        <p className="text-sm font-serif leading-relaxed theme-text-secondary line-clamp-3">
                          {
                            upcomingActivities[
                              safeIdx === upcomingActivities.length - 1 ? 0 : safeIdx + 1
                            ]?.title
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================== 近期研討 ＋ 最新上架（網頁版限定）===================== */}
      {!isNative && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* 近期研討 */}
        <section
          className="rounded-3xl overflow-hidden glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col"
          onClick={() => setPage("events")}
        >
          {/* Top accent band */}
          <div
            className="h-1.5 w-full shrink-0"
            style={{
              background: isDarkMode
                ? "linear-gradient(90deg, rgba(2,132,199,0.9) 0%, rgba(2,132,199,0.15) 100%)"
                : "linear-gradient(90deg, rgba(2,132,199,0.65) 0%, rgba(2,132,199,0.08) 100%)",
            }}
          />
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-5">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-sans border"
                style={{
                  background: "var(--c-badge-bg)",
                  color: "var(--c-badge-text)",
                  borderColor: "var(--c-badge-border)",
                }}
              >
                <Icon name="Calendar" size={16} /> 近期研討
              </div>
              <span className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1">
                查看全部 <Icon name="ChevronRight" size={16} />
              </span>
            </div>

            <div className="relative bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div
                className="absolute top-0 left-8 bottom-0 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-primary) 30%, transparent), transparent)",
                }}
              />
              <h3 className="text-2xl font-bold mb-6 font-sans theme-heading relative z-10">
                {nextSeminar?.title || "近期讀書會"}
              </h3>

              {!nextSeminar ? (
                <p className="theme-text-secondary font-sans text-center py-4">
                  目前暫無排定的研討活動。
                </p>
              ) : (
                <div className="space-y-5 flex-1 relative z-10">
                  {[
                    {
                      label: "時間",
                      value: nextSeminar.date
                        ? new Date(nextSeminar.date).toLocaleString("zh-TW", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "尚未公告",
                      icon: "Calendar",
                    },
                    { label: "地點", value: nextSeminar.location || "尚未公告", icon: "MapPin" },
                    { label: "類型", value: nextSeminar.type || "讀書會", icon: "BookOpen" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
                        style={{
                          background: "rgba(var(--c-panel-rgb),0.85)",
                          borderColor: "rgba(var(--c-border-rgb),0.7)",
                          color: "var(--c-primary)",
                        }}
                      >
                        <Icon name={item.icon} size={15} />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-xs font-sans tracking-[0.16em] uppercase opacity-50 theme-text-secondary mb-1">
                          {item.label}
                        </p>
                        <p className="theme-text leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  {(nextSeminar.summary || nextSeminar.details) && (
                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
                        style={{
                          background: "rgba(var(--c-panel-rgb),0.85)",
                          borderColor: "rgba(var(--c-border-rgb),0.7)",
                          color: "var(--c-primary)",
                        }}
                      >
                        <Icon name="FileText" size={15} />
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-xs font-sans tracking-[0.16em] uppercase opacity-50 theme-text-secondary mb-2">
                          內容
                        </p>
                        <p className="leading-relaxed theme-text-secondary text-sm line-clamp-4">
                          {nextSeminar.summary || nextSeminar.details}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 最新上架 */}
        {latestArticle && (
          <section
            className="rounded-3xl overflow-hidden glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer group flex flex-col"
            onClick={() => setPage("articles")}
          >
            {/* Top accent band */}
            <div
              className="h-1.5 w-full shrink-0"
              style={{
                background: `linear-gradient(90deg, ${latestArtColor.color}cc 0%, ${latestArtColor.color}15 100%)`,
              }}
            />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-5">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-sans border"
                  style={{
                    background: isDarkMode ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.1)",
                    color: isDarkMode ? "#fda4af" : "#e11d48",
                    borderColor: isDarkMode ? "rgba(244,63,94,0.4)" : "rgba(244,63,94,0.2)",
                  }}
                >
                  <Icon name="PenLine" size={16} /> 最新上架
                </div>
                <span className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 group-hover:opacity-100 transition-opacity mt-1">
                  前往專欄 <Icon name="ChevronRight" size={16} />
                </span>
              </div>

              <div className="relative bg-white/50 backdrop-blur-sm rounded-[1.75rem] border border-white/60 shadow-sm flex-1 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 w-3"
                  style={{ background: latestArtColor.color }}
                />
                <div className="grid grid-cols-[88px_1fr] md:grid-cols-[104px_1fr] min-h-full">
                  {/* 書脊 */}
                  <div
                    className="relative flex flex-col items-center justify-between py-6 px-3 border-r border-white/40"
                    style={{
                      background: isDarkMode
                        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                        : "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))",
                    }}
                  >
                    <div
                      className="text-[11px] font-sans tracking-[0.28em] theme-text-secondary opacity-70"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      JOURNAL NOTE
                    </div>
                    <div
                      className="text-[10px] font-mono theme-text-secondary opacity-50"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {latestArticle.date}
                    </div>
                  </div>

                  {/* 封面主體 */}
                  <div className="p-6 md:p-7 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                          style={{
                            background: latestArtColor.bg,
                            color: latestArtColor.color,
                            borderColor: latestArtColor.border,
                          }}
                        >
                          <Icon name="Folder" size={14} className="opacity-70" />
                          {latestArticle.category}
                        </span>
                        <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                          <Icon name="Calendar" size={14} /> {latestArticle.date}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-4 leading-snug group-hover:text-[var(--c-accent)] transition-colors line-clamp-3">
                        {latestArticle.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm theme-text-secondary font-sans mb-5">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                          style={{ background: latestArtColor.color, opacity: 0.9 }}
                        >
                          {latestArticle.author[0]}
                        </span>
                        <span className="font-medium">{latestArticle.author}</span>
                        <span className="opacity-50">｜</span>
                        <span className="opacity-80 text-xs line-clamp-1">
                          {latestArticle.affiliation}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary opacity-80 border-t border-white/40 pt-4">
                        {latestArticle.summary}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="text-[11px] font-sans tracking-[0.18em] uppercase theme-text-secondary opacity-45">
                        Latest Upload
                      </div>
                      <span
                        className="inline-flex items-center gap-2 text-sm font-bold font-sans"
                        style={{ color: latestArtColor.color }}
                      >
                        閱讀文章 <Icon name="ChevronRight" size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>}

      {/* ===================== 跑馬燈 ===================== */}
      <div
        className="marquee-track rounded-2xl py-3 border"
        style={{
          background: isDarkMode
            ? "rgba(var(--c-panel-rgb),0.25)"
            : "rgba(var(--c-panel-rgb),0.55)",
          borderColor: "rgba(var(--c-border-rgb),0.38)",
        }}
      >
        <div className="marquee-inner">
          {tickerDouble.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="text-sm font-sans tracking-[0.22em] theme-text-secondary px-4"
                style={{ opacity: 0.55 }}
              >
                {item.text}
              </span>
              {(i + 1) % 6 === 0 ? (
                <span
                  className="text-xs mx-1 opacity-30"
                  style={{ color: "var(--c-accent)" }}
                >
                  ❖
                </span>
              ) : (
                <span
                  className="text-sm opacity-20"
                  style={{ color: "var(--c-accent)" }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
