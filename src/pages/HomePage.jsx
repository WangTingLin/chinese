// 檔案路徑：src/pages/HomePage.jsx
import React from "react";
import { Icon } from "../App";
import { columnArticles, getCategoryColors } from "../data/articlesData";
import { nextEvent } from "../data/eventsData";
import { promoEvents } from "../data/activitiesData";

export default function HomePage({ setPage, isDarkMode }) {
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
      const endPart = parts[parts.length - 1];
      return new Date(`${endPart}T23:59:59`);
    }

    const [datePart, timePart] = trimmed.split(" ");
    if (!datePart) return new Date(0);

    if (timePart && timePart.includes("-")) {
      const endTime = timePart.split("-")[1];
      return new Date(`${datePart}T${endTime}:00`);
    }

    return new Date(`${datePart}T23:59:59`);
  };

  const upcomingActivities = [...promoEvents]
    .filter((ev) => getEventEndDate(ev.date) >= new Date())
    .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
    .slice(0, 3);

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

  /* ================= JSX ================= */

  return (
    <div className="space-y-16 md:space-y-20 animate-fade-in relative z-10">
      {/* ================= Hero ================= */}

      <section className="relative rounded-[2rem] overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 55%)"
              : "radial-gradient(circle at top, rgba(255,255,255,0.6), transparent 58%)",
          }}
        />
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: "var(--c-accent)" }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-sans border bg-white/40 backdrop-blur-sm">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--c-accent)" }}
            />
            古典．研究．交流
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-[0.18em] font-sans theme-heading">
            中文研究室
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-serif theme-text-secondary">
            「獨學而無友，則孤陋而寡聞。」
            <br />
            ──《禮記‧學記》
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setPage("about")}
              className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
              style={{
                background: "var(--c-nav-active-bg)",
                borderColor: "var(--c-nav-active-border)",
              }}
            >
              探索研究室 <Icon name="ChevronRight" size={20} />
            </button>

            <button
              onClick={() => setPage("activities")}
              className="px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 border spring-transition hover:scale-105 active:scale-95"
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

      {/* ================= 三個入口 ================= */}

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
              style={{
                background: "var(--c-badge-bg)",
                color: "var(--c-badge-text)",
              }}
            >
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans theme-heading transition-colors duration-300 group-hover:text-[var(--c-accent)]">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* ================= 即將舉辦活動：時間軸視覺 ================= */}

      <section
        className="rounded-3xl p-6 md:p-8 glass-panel transition-all duration-500 hover:shadow-xl"
      >
        <div className="flex justify-between items-start mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border font-sans"
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
            className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1"
          >
            查看全部 <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        {upcomingActivities.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-sm">
            <p className="text-center theme-text-secondary font-sans">
              目前暫無即將舉辦的活動。
            </p>
          </div>
        ) : (
          <div className="relative pl-0 md:pl-10">
            <div
              className="hidden md:block absolute top-2 bottom-2 left-4 w-px border-l-2 border-dashed"
              style={{
                borderColor: "color-mix(in srgb, var(--c-primary) 28%, transparent)",
              }}
            />

            <div className="space-y-5">
              {upcomingActivities.map((ev, index) => {
                const badgeStyle = getActivityBadgeColor(ev.category);
                const isMain = index === 0;

                return (
                  <div key={ev.id} className="relative">
                    <div
                      className="hidden md:block absolute left-[7px] top-8 w-4 h-4 rounded-full border-[3px] shadow-sm"
                      style={{
                        background: "rgba(var(--c-panel-rgb),1)",
                        borderColor: "var(--c-accent)",
                      }}
                    />

                    <div
                      className={`rounded-2xl border border-white/60 shadow-sm bg-white/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                        isMain ? "md:ml-6 p-6 md:p-7" : "md:ml-6 p-5"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                              style={{
                                background: badgeStyle.bg,
                                color: badgeStyle.color,
                                borderColor: badgeStyle.border,
                              }}
                            >
                              {ev.category}
                            </span>

                            <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                              <Icon name="Calendar" size={14} />
                              {ev.date}
                            </span>
                          </div>

                          <h3
                            className={`font-bold theme-heading leading-snug ${
                              isMain ? "text-2xl md:text-3xl mb-4" : "text-lg md:text-xl mb-3"
                            }`}
                          >
                            {ev.title}
                          </h3>

                          {ev.location && (
                            <div className="flex items-start gap-2 text-sm theme-text-secondary mb-3">
                              <Icon name="MapPin" size={15} className="shrink-0 mt-[2px]" />
                              <span>{ev.location}</span>
                            </div>
                          )}

                          {ev.description && (
                            <p
                              className={`font-serif leading-relaxed theme-text-secondary ${
                                isMain ? "text-sm md:text-base line-clamp-3" : "text-sm line-clamp-2"
                              }`}
                            >
                              {ev.description}
                            </p>
                          )}
                        </div>

                        {ev.link && (
                          <div className="md:pl-4 shrink-0">
                            <a
                              href={ev.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold font-sans border text-sm spring-transition hover:scale-105 active:scale-95"
                              style={{
                                background: "var(--c-accent)",
                                color: "#fff",
                                borderColor: "var(--c-accent)",
                                boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                              }}
                            >
                              活動詳情
                              <Icon name="ExternalLink" size={15} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

        {/* 最新上架：期刊封面風格 */}
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

            <div
              className="relative flex-1 rounded-[1.75rem] overflow-hidden border shadow-sm p-6 md:p-8 flex flex-col min-h-[420px]"
              style={{
                background: isDarkMode
                  ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.58))",
                borderColor: latestArtColor.border,
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDarkMode
                    ? "radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 42%)"
                    : "radial-gradient(circle at top right, rgba(255,255,255,0.75), transparent 42%)",
                }}
              />

              <div className="relative z-10 flex items-center justify-between mb-6">
                <div
                  className="text-[11px] tracking-[0.28em] uppercase font-bold font-sans"
                  style={{ color: latestArtColor.color, opacity: 0.85 }}
                >
                  Chinese Research Review
                </div>

                <div className="text-xs font-mono theme-text-secondary opacity-70">
                  {latestArticle.date}
                </div>
              </div>

              <div className="relative z-10 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                  style={{
                    background: latestArtColor.bg,
                    color: latestArtColor.color,
                    borderColor: latestArtColor.border,
                  }}
                >
                  <Icon name="Folder" size={13} className="opacity-70" />
                  {latestArticle.category}
                </span>
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div
                  className="w-12 h-1 rounded-full mb-5"
                  style={{ background: latestArtColor.color, opacity: 0.8 }}
                />

                <h3 className="text-2xl md:text-3xl font-bold font-serif theme-heading leading-snug mb-6 group-hover:text-[var(--c-accent)] transition-colors">
                  {latestArticle.title}
                </h3>

                <div className="mt-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                      style={{ background: latestArtColor.color, opacity: 0.95 }}
                    >
                      {latestArticle.author[0]}
                    </span>

                    <div className="min-w-0">
                      <p className="font-bold font-sans theme-heading text-sm">
                        {latestArticle.author}
                      </p>
                      <p className="text-xs theme-text-secondary opacity-80 line-clamp-1">
                        {latestArticle.affiliation}
                      </p>
                    </div>
                  </div>

                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: latestArtColor.border }}
                  >
                    <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary line-clamp-4 opacity-85">
                      {latestArticle.summary}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute right-5 bottom-5 text-[72px] leading-none font-serif select-none pointer-events-none"
                style={{
                  color: latestArtColor.color,
                  opacity: isDarkMode ? 0.08 : 0.1,
                }}
              >
                文
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}