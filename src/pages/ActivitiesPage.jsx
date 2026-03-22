// 檔案路徑：src/pages/ActivitiesPage.jsx
import React, { useMemo, useState, useEffect } from 'react';

import imageUrlBuilder from '@sanity/image-url';
import { client } from '../sanityClient';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';
import SEOHead from '../components/SEOHead';

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
      bg: isDark ? "rgba(58,80,104,0.28)" : "rgba(58,80,104,0.10)",
      color: isDark ? "#90b0d0" : "#3a5068",
      border: isDark ? "rgba(58,80,104,0.5)" : "rgba(58,80,104,0.25)"
    },
    "研討會／工作坊": {
      bg: isDark ? "rgba(58,82,40,0.28)" : "rgba(58,82,40,0.10)",
      color: isDark ? "#a8c890" : "#3a5228",
      border: isDark ? "rgba(58,82,40,0.5)" : "rgba(58,82,40,0.25)"
    },
    "徵稿資訊": {
      bg: isDark ? "rgba(122,96,24,0.28)" : "rgba(122,96,24,0.10)",
      color: isDark ? "#d4b870" : "#7a6018",
      border: isDark ? "rgba(122,96,24,0.5)" : "rgba(122,96,24,0.25)"
    },
    "已結束": {
      bg: isDark ? "rgba(100,88,72,0.28)" : "rgba(100,88,72,0.10)",
      color: isDark ? "#b0a090" : "#6a5840",
      border: isDark ? "rgba(100,88,72,0.5)" : "rgba(100,88,72,0.25)"
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
          bg: "rgba(139,72,40,0.12)",
          color: "#8b4828",
          border: "rgba(139,72,40,0.3)"
        };
      case "upcoming":
        return {
          label: "即將舉行",
          bg: "rgba(74,92,56,0.12)",
          color: "#4a5c38",
          border: "rgba(74,92,56,0.3)"
        };
      case "past":
        return {
          label: "已結束",
          bg: "rgba(100,88,72,0.10)",
          color: "#6a5840",
          border: "rgba(100,88,72,0.25)"
        };
      default:
        return null;
    }
  };

  // 台／臺 通用：統一替換後再比對
  const normalizeZh = (str) => str.replace(/臺/g, '台');

  const filteredEvents = useMemo(() => {
    const keyword = normalizeZh(searchText.trim().toLowerCase());

    return [...events]
      .filter(ev => {
        if (filterCat === "全部") return true;
        if (filterCat === "已結束") return getEventStatus(ev) === "past";
        return ev.category === filterCat;
      })
      .filter(ev => {
        if (!keyword) return true;

        const searchTarget = normalizeZh([
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
          .toLowerCase());

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
    <div style={{ padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ height: "4rem", background: "rgba(29,27,25,0.05)", borderRadius: "0.5rem", marginBottom: "2rem" }} className="shimmer" />
        {[1,2,3].map(i => <div key={i} style={{ height: "6rem", background: "rgba(29,27,25,0.04)", borderRadius: "0.5rem", marginBottom: "1rem" }} className="shimmer" />)}
      </div>
    </div>
  );

  return (
    <>
      <SEOHead title="近期活動" description="中文研究室近期學術活動、講座、研討會與徵稿資訊。" url="/activities" />
    <div style={{ padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Editorial header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="ed-label">01 / 活動</span>
          <h2 className="ed-heading" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginTop: "0.5rem" }}>近期活動</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#a8a29e", textTransform: "uppercase", marginTop: "0.5rem" }}>{filteredEvents.length} 場</p>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid rgba(29,27,25,0.1)", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "#a8a29e" }}>search</span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜尋活動名稱、講者、主辦單位、地點⋯⋯"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "'Inter', 'Noto Sans TC', sans-serif", fontSize: "0.88rem", color: "#1d1b19" }}
          />
          {searchText && (
            <button onClick={() => setSearchText("")} style={{ flexShrink: 0, padding: "0.2rem 0.65rem", borderRadius: "9999px", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", background: "rgba(29,27,25,0.06)", border: "1px solid rgba(29,27,25,0.1)", color: "#78716c", cursor: "pointer" }}>
              清除
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid rgba(29,27,25,0.08)", paddingBottom: "1rem", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: filterCat === cat ? 600 : 400, color: filterCat === cat ? "#b01f45" : "#78716c", paddingBottom: "0.5rem", borderBottom: filterCat === cat ? "2px solid #b01f45" : "2px solid transparent", transition: "all 200ms ease" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Activity list */}
        {filteredEvents.length === 0 ? (
          <div style={{ padding: "4rem 0", textAlign: "center", color: "#a8a29e", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }}>event_busy</span>
            查無符合條件的活動資訊。
          </div>
        ) : (
          <div>
            {filteredEvents.map((ev) => {
              const status = getEventStatus(ev);
              const isPast = status === "past";

              return (
                <article key={ev._id} className="item-row" style={{ padding: "2.5rem 1rem", borderBottom: "1px solid rgba(29,27,25,0.07)", opacity: isPast ? 0.55 : 1, borderRadius: "0.5rem", margin: "0 -1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#a8a29e", textTransform: "uppercase" }}>{ev.category} • {ev.date}</span>
                    {!isPast && <span className="brand-badge">近期舉辦</span>}
                  </div>
                  <h3 className="ed-heading" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", marginBottom: "0.75rem", lineHeight: 1.4 }}>{ev.title}</h3>
                  {ev.speaker && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#78716c", marginBottom: "0.5rem" }}>講者：{ev.speaker}</p>}
                  {ev.location && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#78716c", marginBottom: "1rem" }}>{ev.location}</p>}
                  {ev.organizer && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a8a29e", marginBottom: "1rem" }}>主辦：{ev.organizer}</p>}
                  {ev.link && (
                    <a href={ev.link} target="_blank" rel="noopener noreferrer" className="ed-link" style={{ color: "#b01f45", textDecoration: "none" }}>
                      查看詳情 <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}