// 檔案路徑：src/pages/ActivitiesPage.jsx
import React, { useState } from 'react';

// 💡 匯入活動資料
import { promoEvents } from '../data/activitiesData';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';

export default function ActivitiesPage({ isDarkMode }) {
  const [filterCat, setFilterCat] = useState("全部");
  const categories = ["全部", "學術講座", "研討會／工作坊", "徵稿資訊"];
  
  const getPromoColors = (isDark) => ({
    "學術講座": { bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)", color: isDark ? "#93c5fd" : "#1e40af", border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)" },
    "研討會／工作坊": { bg: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)", color: isDark ? "#86efac" : "#166534", border: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)" },
    "徵稿資訊": { bg: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.12)", color: isDark ? "#fde047" : "#b45309", border: isDark ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.3)" },
  });
  
  const promoColors = getPromoColors(isDarkMode);
const filteredEvents = promoEvents
  .filter(ev => filterCat === "全部" || ev.category === filterCat)
  .sort((a, b) => {
    const getStartTime = (ev) => {
      const dateStr = ev.date.split("-")[0].includes(":")
        ? ev.date.split("-")[0]
        : ev.date.split(" ")[0] + " " + (ev.date.split(" ")[1]?.split("-")[0] || "00:00");
      return new Date(dateStr.replace(",", ""));
    };
    return getStartTime(b) - getStartTime(a); // 晚的排前面
  });
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
      <PageHeader title="近期活動" />
      
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => {
          const isActive = filterCat === cat;
          const cColor = promoColors[cat];

          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
              style={isActive
                ? { 
                    background: cat === "全部" ? "var(--c-nav-active-bg)" : cColor?.color || "var(--c-primary)", 
                    color: "#fff", 
                    borderColor: cat === "全部" ? "var(--c-nav-active-border)" : cColor?.color || "var(--c-primary)", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
                  }
                : { 
                    background: "rgba(var(--c-panel-rgb), 0.4)", 
                    borderColor: "rgba(var(--c-border-rgb), 0.6)", 
                    color: "var(--c-text-secondary)" 
                  }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      <div className="space-y-6 md:space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl theme-text-secondary font-sans">
            <Icon name="Megaphone" size={40} className="mx-auto mb-4 opacity-30" />
            <p>近期暫無「{filterCat}」的相關活動資訊。</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const cColor = promoColors[ev.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
            return (
              <article key={ev.id} className="rounded-3xl glass-panel overflow-hidden glass-card-hover border border-white/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
                      style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}>
                      {ev.category}
                    </span>
                    <span className="text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                      <Icon name="Calendar" size={14} /> {ev.date}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-3">{ev.title}</h3>
                  <div className="flex flex-col gap-2 mb-5 text-sm theme-text-secondary font-sans">
                    {ev.speaker && (
                      <span className="flex items-center gap-2"><Icon name="Users" size={16} className="opacity-60"/> 講者：{ev.speaker}</span>
                    )}
                    <span className="flex items-center gap-2"><Icon name="Info" size={16} className="opacity-60"/> 主辦：{ev.organizer}</span>
                    <span className="flex items-center gap-2"><Icon name="MapPin" size={16} className="opacity-60"/> 地點：{ev.location}</span>
                  </div>
                  <p className="text-base leading-relaxed font-serif content-justify theme-text-secondary border-t border-white/40 pt-4 mt-2">
                    {ev.description}
                  </p>
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
}
