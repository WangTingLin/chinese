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
      ? [...columnArticles].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )[0]
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
        bg: isDarkMode
          ? "rgba(59,130,246,0.2)"
          : "rgba(59,130,246,0.12)",
        color: isDarkMode ? "#93c5fd" : "#1e40af",
        border: isDarkMode
          ? "rgba(59,130,246,0.4)"
          : "rgba(59,130,246,0.3)",
      },
      "研討會／工作坊": {
        bg: isDarkMode
          ? "rgba(34,197,94,0.2)"
          : "rgba(34,197,94,0.12)",
        color: isDarkMode ? "#86efac" : "#166534",
        border: isDarkMode
          ? "rgba(34,197,94,0.4)"
          : "rgba(34,197,94,0.3)",
      },
      徵稿資訊: {
        bg: isDarkMode
          ? "rgba(245,158,11,0.2)"
          : "rgba(245,158,11,0.12)",
        color: isDarkMode ? "#fde047" : "#b45309",
        border: isDarkMode
          ? "rgba(245,158,11,0.4)"
          : "rgba(245,158,11,0.3)",
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
            className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 border"
            style={{
              background: "var(--c-nav-active-bg)",
              borderColor: "var(--c-nav-active-border)",
            }}
          >
            探索研究室 <Icon name="ChevronRight" size={20} />
          </button>

          <button
            onClick={() => setPage("activities")}
            className="px-8 py-3 rounded-full font-medium flex items-center gap-2 border"
            style={{
              background: "rgba(var(--c-panel-rgb),0.45)",
              borderColor: "rgba(var(--c-border-rgb),0.6)",
            }}
          >
            查看近期活動 <Icon name="Megaphone" size={20} />
          </button>
        </div>
      </section>

      {/* ================= 即將舉辦活動 ================= */}

      <section
        className="rounded-3xl p-6 md:p-8 glass-panel cursor-pointer"
        onClick={() => setPage("activities")}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border">
            <Icon name="Megaphone" size={16} />
            即將舉辦活動
          </div>

          <span className="text-sm flex items-center gap-1 opacity-50">
            查看全部 <Icon name="ChevronRight" size={16} />
          </span>
        </div>

        {upcomingActivities.length === 0 ? (
          <p className="text-center opacity-70">目前暫無活動</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">

            {/* 主活動 */}

            <div className="md:col-span-2 bg-white/50 p-6 rounded-2xl border flex flex-col">

              <h3 className="text-2xl font-bold mb-4">
                {upcomingActivities[0].title}
              </h3>

              <div className="space-y-2 text-sm mb-5">

                <div className="flex gap-2">
                  <Icon name="Calendar" size={15} />
                  {upcomingActivities[0].date}
                </div>

                {upcomingActivities[0].location && (
                  <div className="flex gap-2">
                    <Icon name="MapPin" size={15} />
                    {upcomingActivities[0].location}
                  </div>
                )}
              </div>

              {upcomingActivities[0].link && (
                <a
                  href={upcomingActivities[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold border"
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

            {/* 次活動 */}

            <div className="flex flex-col gap-4">
              {upcomingActivities.slice(1, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white/50 p-5 rounded-2xl border flex flex-col"
                >
                  <h3 className="text-lg font-bold mb-3 line-clamp-2">
                    {ev.title}
                  </h3>

                  <div className="text-sm mb-4 flex gap-2">
                    <Icon name="Calendar" size={14} />
                    {ev.date}
                  </div>

                  {ev.link && (
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold border text-sm"
                      style={{
                        background: "var(--c-accent)",
                        color: "#fff",
                        borderColor: "var(--c-accent)",
                      }}
                    >
                      活動詳情
                      <Icon name="ExternalLink" size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </section>

      {/* ================= 最新文章 ================= */}

      {latestArticle && (
        <section
          className="rounded-3xl p-6 md:p-8 glass-panel cursor-pointer"
          onClick={() => setPage("articles")}
        >

          <div className="flex justify-between items-start mb-5">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border">
              <Icon name="PenLine" size={16} />
              最新上架
            </div>

            <span className="text-sm flex items-center gap-1 opacity-50">
              前往專欄 <Icon name="ChevronRight" size={16} />
            </span>

          </div>

          <h3 className="text-xl md:text-2xl font-bold mb-4">
            {latestArticle.title}
          </h3>

          <p className="text-sm opacity-70 mb-4">
            {latestArticle.author} ｜ {latestArticle.affiliation}
          </p>

          <p className="text-sm leading-relaxed line-clamp-3">
            {latestArticle.summary}
          </p>

        </section>
      )}

    </div>
  );
}