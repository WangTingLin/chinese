// 檔案路徑：src/pages/HomePage.jsx
import React, { useState, useMemo } from "react";
import { Icon } from "../App";
import { getCategoryColors } from "../data/articlesData";

export default function HomePage({
  setPage,
  isDarkMode,
  articles = [],
  events = [],
  activities = [],
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

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
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

  return (
    <div className="space-y-10 md:space-y-14 animate-fade-in relative z-10">

      {/* ===================== Hero ===================== */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
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

          <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-[0.18em] font-sans theme-heading">
            中文研究室
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <button
              onClick={() => setPage("activities")}
              className="px-8 py-3 rounded-full font-medium font-sans flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
              style={{
                background: "rgba(var(--c-panel-rgb),0.45)",
                borderColor: "rgba(var(--c-border-rgb),0.6)",
                color: "var(--c-primary-dark)",
              }}
            >
              查看近期活動 <Icon name="Megaphone" size={20} />
            </button>
          </div>
        </div>
      </section>

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
              {/* 每 6 個用特殊分隔符，其餘用小點 */}
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

      {/* ===================== 翻頁式近期活動 ===================== */}
      <section className="rounded-3xl p-6 md:p-8 glass-panel shadow-sm">
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

                    <h3 className="text-2xl md:text-3xl font-bold font-sans theme-heading leading-snug mb-4">
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
      </section>

      {/* ===================== 近期研討 ＋ 最新上架 ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* 近期研討 */}
        <section
          className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col"
          onClick={() => setPage("events")}
        >
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
        </section>

        {/* 最新上架 */}
        {latestArticle && (
          <section
            className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer group flex flex-col"
            onClick={() => setPage("articles")}
          >
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
          </section>
        )}
      </div>
    </div>
  );
}
