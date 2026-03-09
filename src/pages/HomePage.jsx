// 檔案路徑：src/pages/HomePage.jsx
import React, { useMemo, useState } from "react";
import { Icon } from "../App";
import { columnArticles, getCategoryColors } from "../data/articlesData";
import { nextEvent } from "../data/eventsData";
import { promoEvents } from "../data/activitiesData";

export default function HomePage({ setPage, isDarkMode }) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  /* ================= 最新文章 ================= */

  const latestArticle =
    columnArticles.length > 0
      ? [...columnArticles].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
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

    const trimmed = String(dateStr).trim();
    const firstPart = trimmed.split(/[~,～，,]/)[0].trim();
    const [datePart, timePart] = firstPart.split(" ");

    if (!datePart) return new Date(0);

    const startTime = timePart ? timePart.split("-")[0] : "00:00";
    const parsed = new Date(`${datePart}T${startTime}:00`);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const getEventEndDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    const trimmed = String(dateStr).trim();

    if (trimmed.includes("～") || trimmed.includes("~")) {
      const parts = trimmed.split(/[～~]/).map((s) => s.trim());
      const endPart = parts[parts.length - 1];
      const parsed = new Date(`${endPart}T23:59:59`);
      return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
    }

    const [datePart, timePart] = trimmed.split(" ");
    if (!datePart) return new Date(0);

    if (timePart && timePart.includes("-")) {
      const endTime = timePart.split("-")[1];
      const parsed = new Date(`${datePart}T${endTime}:00`);
      return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
    }

    const parsed = new Date(`${datePart}T23:59:59`);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const upcomingActivities = useMemo(() => {
    return [...promoEvents]
      .filter((ev) => getEventEndDate(ev.date) >= new Date())
      .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
  }, [promoEvents]);

  const safeActivityIndex =
    upcomingActivities.length === 0
      ? 0
      : Math.min(currentActivityIndex, upcomingActivities.length - 1);

  const currentActivity =
    upcomingActivities.length > 0 ? upcomingActivities[safeActivityIndex] : null;

  const prevActivity =
    upcomingActivities.length > 1
      ? upcomingActivities[
          safeActivityIndex === 0
            ? upcomingActivities.length - 1
            : safeActivityIndex - 1
        ]
      : null;

  const nextActivity =
    upcomingActivities.length > 1
      ? upcomingActivities[
          safeActivityIndex === upcomingActivities.length - 1
            ? 0
            : safeActivityIndex + 1
        ]
      : null;

  const handlePrevActivity = (e) => {
    e.stopPropagation();
    if (upcomingActivities.length <= 1) return;

    setCurrentActivityIndex((prev) =>
      prev === 0 ? upcomingActivities.length - 1 : prev - 1
    );
  };

  const handleNextActivity = (e) => {
    e.stopPropagation();
    if (upcomingActivities.length <= 1) return;

    setCurrentActivityIndex((prev) =>
      prev === upcomingActivities.length - 1 ? 0 : prev + 1
    );
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

    return (
      map[category] || {
        bg: "var(--c-badge-bg)",
        color: "var(--c-badge-text)",
        border: "var(--c-badge-border)",
      }
    );
  };

  return (
    <div className="space-y-16 md:space-y-20 animate-fade-in relative z-10">
      {/* ================= Hero ================= */}

      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-widest font-sans theme-heading">
          中文研究室
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif theme-text-secondary">
          「獨學而無友，則孤陋而寡聞。」
          <br />
          ──《禮記‧學記》
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setPage("about")}
            className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 border spring-transition hover:scale-105 active:scale-95"
            style={{
              background: "var(--c-nav-active-bg)",
              borderColor: "var(--c-nav-active-border)",
            }}
          >
            探索研究室 <Icon name="ChevronRight" size={20} />
          </button>

          <button
            onClick={() => setPage("activities")}
            className="px-8 py-3 rounded-full font-medium flex items-center gap-2 border spring-transition hover:scale-105 active:scale-95"
            style={{
              background: "rgba(var(--c-panel-rgb),0.45)",
              borderColor: "rgba(var(--c-border-rgb),0.6)",
              color: "var(--c-primary-dark)",
            }}
          >
            查看近期活動 <Icon name="Megaphone" size={20} />
          </button>
        </div>
      </section>

      {/* ================= 快速入口 ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "文章專欄", icon: "BookOpen", target: "articles" },
          { title: "研討進度", icon: "Calendar", target: "events" },
          { title: "資源分享", icon: "Library", target: "books" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => setPage(item.target)}
            className="p-8 rounded-3xl glass-panel glass-card-hover cursor-pointer group flex flex-col items-center text-center border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm"
              style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)" }}
            >
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans theme-heading transition-colors duration-300 group-hover:text-[var(--c-accent)]">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* ================= 翻頁式活動區 ================= */}

      <section
        className="rounded-3xl p-6 md:p-8 glass-panel transition-all duration-500 hover:shadow-xl"
        onClick={() => setPage("activities")}
      >
        <div className="flex justify-between items-center gap-4 mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border"
            style={{
              background: isDarkMode ? "rgba(2,132,199,0.2)" : "rgba(2,132,199,0.12)",
              color: isDarkMode ? "#7dd3fc" : "#0369a1",
              borderColor: isDarkMode ? "rgba(2,132,199,0.4)" : "rgba(2,132,199,0.25)",
            }}
          >
            <Icon name="Megaphone" size={16} />
            即將舉辦活動
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevActivity}
              className="w-10 h-10 rounded-full border flex items-center justify-center spring-transition hover:scale-105 active:scale-95"
              style={{
                background: "rgba(var(--c-panel-rgb),0.5)",
                borderColor: "rgba(var(--c-border-rgb),0.6)",
                color: "var(--c-primary-dark)",
              }}
              aria-label="上一個活動"
            >
              <Icon name="ChevronLeft" size={18} />
            </button>

            <button
              onClick={handleNextActivity}
              className="w-10 h-10 rounded-full border flex items-center justify-center spring-transition hover:scale-105 active:scale-95"
              style={{
                background: "rgba(var(--c-panel-rgb),0.5)",
                borderColor: "rgba(var(--c-border-rgb),0.6)",
                color: "var(--c-primary-dark)",
              }}
              aria-label="下一個活動"
            >
              <Icon name="ChevronRight" size={18} />
            </button>
          </div>
        </div>

        {upcomingActivities.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-sm">
            <p className="text-center theme-text-secondary font-sans">
              目前暫無即將舉辦的活動。
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              {/* 左右淡出預覽 */}
              <div className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[rgba(var(--c-panel-rgb),0.85)] to-transparent rounded-l-3xl" />
              <div className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[rgba(var(--c-panel-rgb),0.85)] to-transparent rounded-r-3xl" />

              <div className="grid lg:grid-cols-[120px_minmax(0,1fr)_120px] gap-4 items-stretch">
                {/* 前一頁預覽 */}
                <div className="hidden lg:flex items-center">
                  {prevActivity && (
                    <div
                      className="w-full h-[250px] rounded-2xl border border-white/40 bg-white/25 backdrop-blur-sm shadow-sm opacity-60 scale-95 flex flex-col justify-between p-4 overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevActivity(e);
                      }}
                    >
                      <div>
                        <p className="text-xs font-sans theme-text-secondary mb-2 line-clamp-1">
                          {prevActivity.category}
                        </p>
                        <h4 className="text-sm font-bold theme-heading line-clamp-3 leading-relaxed">
                          {prevActivity.title}
                        </h4>
                      </div>
                      <p className="text-xs theme-text-secondary line-clamp-2">
                        {prevActivity.date}
                      </p>
                    </div>
                  )}
                </div>

                {/* 主卡 */}
                <div className="min-w-0">
                  <div className="bg-white/55 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/60 shadow-lg transition-all duration-500 hover:bg-white/70 min-h-[260px] flex flex-col">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {currentActivity?.category && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                          style={{
                            background: getActivityBadgeColor(currentActivity.category).bg,
                            color: getActivityBadgeColor(currentActivity.category).color,
                            borderColor: getActivityBadgeColor(currentActivity.category).border,
                          }}
                        >
                          <Icon name="Folder" size={12} />
                          {currentActivity.category}
                        </span>
                      )}

                      <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                        <Icon name="Calendar" size={13} />
                        第 {safeActivityIndex + 1} 則活動
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold font-sans theme-heading mb-5 leading-snug">
                      {currentActivity?.title}
                    </h3>

                    <div className="space-y-3 theme-text-secondary mb-6">
                      <div className="flex items-start gap-3">
                        <Icon name="Calendar" size={16} className="mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{currentActivity?.date}</span>
                      </div>

                      {currentActivity?.location && (
                        <div className="flex items-start gap-3">
                          <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{currentActivity.location}</span>
                        </div>
                      )}
                    </div>

                    {currentActivity?.description && (
                      <p className="text-sm md:text-base leading-relaxed font-serif content-justify theme-text-secondary opacity-85 border-t border-white/40 pt-5 mb-6 line-clamp-4">
                        {currentActivity.description}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {upcomingActivities.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentActivityIndex(i);
                            }}
                            aria-label={`切換到第 ${i + 1} 個活動`}
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: i === safeActivityIndex ? "28px" : "10px",
                              height: "10px",
                              background:
                                i === safeActivityIndex
                                  ? "var(--c-accent)"
                                  : isDarkMode
                                  ? "rgba(148,163,184,0.35)"
                                  : "rgba(100,116,139,0.25)",
                            }}
                          />
                        ))}
                      </div>

                      {currentActivity?.link && (
                        <a
                          href={currentActivity.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold font-sans shadow-sm border spring-transition hover:scale-105 active:scale-95"
                          style={{
                            background: "var(--c-accent)",
                            color: "#fff",
                            borderColor: "var(--c-accent)",
                          }}
                        >
                          活動詳情
                          <Icon name="ExternalLink" size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 下一頁預覽 */}
                <div className="hidden lg:flex items-center">
                  {nextActivity && (
                    <div
                      className="w-full h-[250px] rounded-2xl border border-white/40 bg-white/25 backdrop-blur-sm shadow-sm opacity-60 scale-95 flex flex-col justify-between p-4 overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextActivity(e);
                      }}
                    >
                      <div>
                        <p className="text-xs font-sans theme-text-secondary mb-2 line-clamp-1">
                          {nextActivity.category}
                        </p>
                        <h4 className="text-sm font-bold theme-heading line-clamp-3 leading-relaxed">
                          {nextActivity.title}
                        </h4>
                      </div>
                      <p className="text-xs theme-text-secondary line-clamp-2">
                        {nextActivity.date}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ================= 近期研討 ＋ 最新上架 ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* 近期研討 */}
        <section className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col">
          <div className="flex justify-between items-start mb-5">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border"
              style={{
                background: "var(--c-badge-bg)",
                color: "var(--c-badge-text)",
                borderColor: "var(--c-badge-border)",
              }}
            >
              <Icon name="Calendar" size={16} /> 近期研討
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage("events");
              }}
              className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1"
            >
              查看全部 <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors hover:bg-white/70 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-5 font-sans theme-heading">
              三月讀書會
            </h3>

            <div className="space-y-4 flex-1">
              {[
                ["時間", nextEvent.date],
                ["地點", nextEvent.location],
                ["主題", nextEvent.topic],
              ].map(([label, value]) => (
                <p key={label} className="flex items-start gap-3 theme-text">
                  <strong className="min-w-16 font-sans shrink-0">{label}：</strong>
                  <span>{value}</span>
                </p>
              ))}

              <div className="flex items-start gap-3 theme-text">
                <strong className="min-w-16 font-sans shrink-0">論文：</strong>
                <ul className="space-y-2">
                  {nextEvent.papers.map((p, i) => (
                    <li key={i} className="leading-relaxed relative pl-4">
                      <span
                        className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--c-accent)" }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border"
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

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors group-hover:bg-white/70 flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
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
                  <Icon name="Calendar" size={14} />
                  {latestArticle.date}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-4 leading-snug group-hover:text-[var(--c-accent)] transition-colors line-clamp-2">
                {latestArticle.title}
              </h3>

              <div className="flex items-center gap-2 text-sm theme-text-secondary font-sans mb-4">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                  style={{ background: latestArtColor.color, opacity: 0.9 }}
                >
                  {latestArticle.author[0]}
                </span>
                <span className="font-medium">{latestArticle.author}</span>
                <span className="opacity-50">｜</span>
                <span className="opacity-80 text-xs">{latestArticle.affiliation}</span>
              </div>

              <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary line-clamp-3 opacity-80 border-t border-white/40 pt-4 mt-auto">
                {latestArticle.summary}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}