// 檔案路徑：src/pages/ActivitiesPage.jsx
import React, { useMemo, useState, useEffect } from 'react';

import imageUrlBuilder from '@sanity/image-url';
import { client } from '../sanityClient';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

// ── 主辦單位縮寫對照表 ───────────────────────────────────────
const UNIV_MAP = [
  ["成功大學", "成大"], ["臺灣大學", "台大"], ["台灣大學", "台大"],
  ["政治大學", "政大"], ["清華大學", "清大"], ["交通大學", "交大"],
  ["陽明交通大學", "陽交大"], ["中央大學", "中央大"], ["中山大學", "中山大"],
  ["中正大學", "中正大"], ["中興大學", "中興大"], ["師範大學", "師大"],
  ["臺北大學", "北大"], ["台北大學", "北大"], ["輔仁大學", "輔大"],
  ["東吳大學", "東吳"], ["淡江大學", "淡江"], ["文化大學", "文化大"],
  ["逢甲大學", "逢甲"], ["靜宜大學", "靜宜"], ["東華大學", "東華"],
  ["暨南大學", "暨大"], ["屏東大學", "屏大"], ["海洋大學", "海大"],
  ["彰化師範大學", "彰師大"], ["高雄師範大學", "高師大"],
  ["元智大學", "元智"], ["長庚大學", "長庚"], ["中原大學", "中原"],
  ["高雄大學", "高大"], ["臺南大學", "南大"], ["台南大學", "南大"],
];

const abbreviateOrganizer = (organizer) => {
  if (!organizer) return null;
  for (const [full, abbrev] of UNIV_MAP) {
    if (organizer.includes(full)) return abbrev;
  }
  // 去掉國立/私立前綴與系所後綴再判斷
  const core = organizer
    .replace(/^國立|^私立|^財團法人/g, '')
    .replace(/(中文|中國文學|文學|人文|社會)(學?系|研究所)?$/, '')
    .replace(/學系$|研究所$|學院$|中心$/, '');
  if (core.length <= 4) return core;
  // 包含「大學」的長名稱 → 取前段縮寫
  const daIdx = core.indexOf('大學');
  if (daIdx >= 1) return core.slice(0, daIdx) + '大';
  return core.slice(0, 3);
};

const getEventTags = (ev) => {
  const tags = [];
  const org = abbreviateOrganizer(ev.organizer);
  if (org) tags.push({ label: org, type: 'org' });

  if (ev.location) {
    const cityMatch = ev.location.match(/台北|臺北|台南|臺南|台中|臺中|高雄|新竹|桃園|嘉義|台東|臺東|花蓮|宜蘭|基隆|屏東|彰化|南投|雲林|澎湖|金門/);
    const locLabel = cityMatch
      ? cityMatch[0]
      : ev.location.length <= 6 ? ev.location : ev.location.slice(0, 5) + '…';
    tags.push({ label: locLabel, type: 'loc' });
  }

  return tags;
};

// ────────────────────────────────────────────────────────────

export default function ActivitiesPage({ isDarkMode }) {
  const [filterCat, setFilterCat] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(`*[_type == "promoEvent"] | order(_createdAt desc) {
      _id, title, category, date, speaker, location, organizer, link,
      coverImage { asset->{ _id, url }, alt, hotspot, crop }
    }`).then(data => {
      setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const categories = ["全部", "學術講座", "研討會／工作坊", "徵稿資訊", "已結束"];

  const getPromoColors = (isDark) => ({
    "學術講座": {
      bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)",
      color: isDark ? "#93c5fd" : "#1e40af",
      border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)"
    },
    "研討會／工作坊": {
      bg: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)",
      color: isDark ? "#86efac" : "#166534",
      border: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)"
    },
    "徵稿資訊": {
      bg: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.12)",
      color: isDark ? "#fde047" : "#b45309",
      border: isDark ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.3)"
    },
    "已結束": {
      bg: isDark ? "rgba(107,114,128,0.2)" : "rgba(107,114,128,0.12)",
      color: isDark ? "#9ca3af" : "#6b7280",
      border: isDark ? "rgba(107,114,128,0.4)" : "rgba(107,114,128,0.3)"
    },
  });

  const promoColors = getPromoColors(isDarkMode);

  const parseEventDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    const trimmed = dateStr.trim();

    // 支援 ~、～、,、， 等多日格式，只取開始日
    const firstPart = trimmed.split(/[~,～，,]/)[0].trim();
    const [datePart, timePart] = firstPart.split(" ");

    if (!datePart) return new Date(0);

    const startTime = timePart ? timePart.split("-")[0] : "00:00";
    return new Date(`${datePart}T${startTime}:00`);
  };

  const getEventEndDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    const trimmed = dateStr.trim();

    // 區間格式：2026-03-13～2026-03-15 / 2026-03-13~2026-03-15
    if (trimmed.includes("～") || trimmed.includes("~")) {
      const parts = trimmed.split(/[～~]/).map(s => s.trim());
      const endPart = parts[parts.length - 1];
      return new Date(`${endPart}T23:59:59`);
    }

    // 多日簡寫：2026-03-23,24 / 2026-03-23，24
    if (/^\d{4}-\d{2}-\d{2}[，,]\d{1,2}$/.test(trimmed)) {
      const [fullDate, dayText] = trimmed.split(/[，,]/);
      const yearMonth = fullDate.slice(0, 8); // 例如 2026-03-
      const endDate = `${yearMonth}${dayText.padStart(2, "0")}`;
      return new Date(`${endDate}T23:59:59`);
    }

    const [datePart, timePart] = trimmed.split(" ");
    if (!datePart) return new Date(0);

    // 時間區間：2026-03-10 09:10-12:00
    if (timePart && timePart.includes("-")) {
      const endTime = timePart.split("-")[1];
      return new Date(`${datePart}T${endTime}:00`);
    }

    // 單一時間：2026-03-18 15:30
    if (timePart) {
      return new Date(`${datePart}T23:59:59`);
    }

    // 只有日期：2026-05-31
    return new Date(`${datePart}T23:59:59`);
  };

  const isSameDay = (a, b) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const getDayDiff = (targetDate, baseDate = new Date()) => {
    const startOfBase = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const diffMs = startOfTarget - startOfBase;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const getEventStatus = (ev) => {
    const now = new Date();
    const startDate = parseEventDate(ev.date);
    const endDate = getEventEndDate(ev.date);

    if (endDate < now) {
      return "past";
    }

    if (isSameDay(startDate, now)) {
      return "today";
    }

    const diffDays = getDayDiff(startDate, now);

    if (diffDays > 0 && diffDays <= 3) {
      return "upcoming";
    }

    return "normal";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "today":
        return {
          label: "今日",
          bg: "rgba(59,130,246,0.16)",
          color: "#2563eb",
          border: "rgba(59,130,246,0.35)"
        };
      case "upcoming":
        return {
          label: "即將舉行",
          bg: "rgba(34,197,94,0.16)",
          color: "#15803d",
          border: "rgba(34,197,94,0.35)"
        };
      case "past":
        return {
          label: "已結束",
          bg: "rgba(107,114,128,0.16)",
          color: "#6b7280",
          border: "rgba(107,114,128,0.3)"
        };
      default:
        return null;
    }
  };

  const filteredEvents = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return [...events]
      .filter(ev => {
        if (filterCat === "全部") return true;
        if (filterCat === "已結束") return getEventStatus(ev) === "past";
        return ev.category === filterCat;
      })
      .filter(ev => {
        if (!keyword) return true;

        const searchTarget = [
          ev.title,
          ev.speaker,
          ev.organizer,
          ev.location,
          ev.description,
          ev.category,
          ev.date
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchTarget.includes(keyword);
      })
      .sort((a, b) => {
        const statusOrder = {
          today: 0,
          upcoming: 1,
          normal: 2,
          past: 3
        };

        const statusA = getEventStatus(a);
        const statusB = getEventStatus(b);

        if (statusOrder[statusA] !== statusOrder[statusB]) {
          return statusOrder[statusA] - statusOrder[statusB];
        }

        // 已結束：最近結束的排最前；其餘：最早舉辦的排最前
        if (statusA === "past") {
          return parseEventDate(b.date) - parseEventDate(a.date);
        }
        return parseEventDate(a.date) - parseEventDate(b.date);
      });
  }, [filterCat, searchText, events]);

  if (loading) return (
    <div className="max-w-4xl mx-auto animate-fade-in relative z-10">
      <PageHeader title="近期活動" />
      <div className="flex justify-center py-24 theme-text-secondary font-sans opacity-50">載入中⋯⋯</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
      <PageHeader title="近期活動" />

      <div className="space-y-5">
        <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/60">
          <Icon name="List" size={18} className="opacity-60 theme-text-secondary" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜尋活動名稱、講者、主辦單位、地點、徵稿資訊⋯⋯"
            className="w-full bg-transparent outline-none font-sans text-sm md:text-base theme-text placeholder:opacity-50"
            style={{ color: "var(--c-text)" }}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-sans border spring-transition hover:scale-105 active:scale-95"
              style={{
                background: "rgba(var(--c-panel-rgb), 0.5)",
                borderColor: "rgba(var(--c-border-rgb), 0.6)",
                color: "var(--c-text-secondary)"
              }}
            >
              清除
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => {
            const isActive = filterCat === cat;
            const cColor = promoColors[cat];

            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
                style={
                  isActive
                    ? {
                        background: cat === "全部"
                          ? "var(--c-nav-active-bg)"
                          : cColor?.color || "var(--c-primary)",
                        color: "#fff",
                        borderColor: cat === "全部"
                          ? "var(--c-nav-active-border)"
                          : cColor?.color || "var(--c-primary)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                      }
                    : {
                        background: "rgba(var(--c-panel-rgb), 0.4)",
                        borderColor: "rgba(var(--c-border-rgb), 0.6)",
                        color: "var(--c-text-secondary)"
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl theme-text-secondary font-sans">
            <Icon name="Megaphone" size={40} className="mx-auto mb-4 opacity-30" />
            <p className="mb-2">查無符合條件的活動資訊。</p>
            <p className="text-sm opacity-70">
              目前分類：{filterCat}{searchText ? `｜搜尋：${searchText}` : ""}
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const cColor = promoColors[ev.category] || {
              bg: "var(--c-badge-bg)",
              color: "var(--c-badge-text)",
              border: "var(--c-badge-border)"
            };

            const status = getEventStatus(ev);
            const statusBadge = getStatusBadge(status);
            const isPast = status === "past";

            return (
              <article
                key={ev._id}
                className="rounded-3xl glass-panel overflow-hidden glass-card-hover border border-white/60 relative"
                style={{
                  opacity: isPast ? 0.52 : 1,
                  filter: isPast ? "grayscale(45%)" : "none",
                  transition: "opacity 300ms ease, filter 300ms ease"
                }}
              >
                {/* 左側色條 */}
                <div className="absolute left-0 inset-y-0 w-2 z-10" style={{ background: cColor.color }} />
                <div className="pl-5 pr-6 py-6 md:pl-6 md:pr-8 md:py-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
                      style={{
                        background: cColor.bg,
                        color: cColor.color,
                        borderColor: cColor.border
                      }}
                    >
                      {ev.category}
                    </span>

                    {statusBadge && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                        style={{
                          background: statusBadge.bg,
                          color: statusBadge.color,
                          borderColor: statusBadge.border
                        }}
                      >
                        {statusBadge.label}
                      </span>
                    )}

                    <span className="text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                      <Icon name="Calendar" size={14} /> {ev.date}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-2">
                    {ev.title}
                  </h3>

                  {/* 標籤列 */}
                  {(() => {
                    const tags = getEventTags(ev);
                    if (!tags.length) return null;
                    return (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-sans border"
                            style={{
                              background: "rgba(var(--c-panel-rgb), 0.6)",
                              color: "var(--c-accent)",
                              borderColor: "rgba(var(--c-border-rgb), 0.5)",
                            }}
                          >
                            {tag.type === 'org' && (
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
                                <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm2 2h2v2H5V5zm4 0h2v2H9V5zm-4 4h2v2H5V9zm4 0h2v2H9V9z"/>
                              </svg>
                            )}
                            {tag.type === 'loc' && (
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
                                <path d="M8 1a5 5 0 0 1 5 5c0 3-5 9-5 9S3 9 3 6a5 5 0 0 1 5-5zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                              </svg>
                            )}
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    );
                  })()}

                  <div className="flex flex-col gap-2 mb-5 text-sm theme-text-secondary font-sans">
                    {ev.speaker && (
                      <span className="flex items-center gap-2">
                        <Icon name="Users" size={16} className="opacity-60" />
                        講者：{ev.speaker}
                      </span>
                    )}
                    {ev.organizer && (
                      <span className="flex items-center gap-2">
                        <Icon name="Info" size={16} className="opacity-60" />
                        主辦：{ev.organizer}
                      </span>
                    )}
                    {ev.location && (
                      <span className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="opacity-60" />
                        地點：{ev.location}
                      </span>
                    )}
                  </div>

                  {ev.description && (
                    <p className="text-base leading-relaxed font-serif content-justify theme-text-secondary border-t border-white/40 pt-4 mt-2">
                      {ev.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-stretch gap-3 shrink-0 w-full md:w-auto">
                  {ev.coverImage?.asset && (
                    <img
                      src={urlFor(ev.coverImage).width(240).auto('format').fit('clip').url()}
                      alt={ev.coverImage.alt || ev.title}
                      className="w-full md:w-44 rounded-2xl object-cover shadow-md border border-white/40 self-center"
                      style={{ maxHeight: "280px" }}
                      loading="lazy"
                    />
                  )}
                  {ev.link && (
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-44 mt-2 md:mt-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold font-sans shadow-sm hover:-translate-y-0.5 transition-all border"
                      style={{
                        background: isPast ? "rgba(107,114,128,0.85)" : cColor.color,
                        color: "#fff",
                        borderColor: isPast ? "rgba(107,114,128,0.85)" : cColor.color
                      }}
                    >
                      查看詳情 <Icon name="ExternalLink" size={16} />
                    </a>
                  )}
                </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}