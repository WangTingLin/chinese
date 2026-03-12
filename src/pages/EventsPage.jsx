// 檔案路徑：src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';

import { client } from '../sanityClient';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';

export default function EventsPage({ isDarkMode }) {
  const [viewMode, setViewMode] = useState("timeline");
  const [activeEventId, setActiveEventId] = useState(null);
  const [eventFilter, setEventFilter] = useState("all");
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [researchArticles, setResearchArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.fetch(`*[_type == "event"] | order(date desc) {
        _id, title, date, type, status, summary, details, location
      }`),
      client.fetch(`*[_type == "article" && category == "讀書會紀錄"] | order(date desc) {
        _id, title, author, affiliation, date, tags, publicationStatus, summary
      }`)
    ]).then(([evs, arts]) => {
      setTimelineEvents(evs);
      setResearchArticles(arts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredEvents = timelineEvents.filter((ev) => {
    if (eventFilter === "all") return true;
    return ev.status === eventFilter;
  });

  const displayEvents = [...filteredEvents];
  const displayResearchArticles = [...researchArticles];

  const getTypeColor = (type, isDark) => {
    if (type === "讀書會") return isDark ? { bg: "rgba(59,130,246,0.2)", color: "#93c5fd", border: "rgba(59,130,246,0.4)" } : { bg: "rgba(59,130,246,0.12)", color: "#1d4ed8", border: "rgba(59,130,246,0.3)" };
    if (type === "發表") return isDark ? { bg: "rgba(245,158,11,0.2)", color: "#fde047", border: "rgba(245,158,11,0.4)" } : { bg: "rgba(245,158,11,0.12)", color: "#b45309", border: "rgba(245,158,11,0.3)" };
    if (type === "會後紀要") return isDark ? { bg: "rgba(16,185,129,0.2)", color: "#6ee7b7", border: "rgba(16,185,129,0.4)" } : { bg: "rgba(16,185,129,0.12)", color: "#047857", border: "rgba(16,185,129,0.3)" };
    return isDark ? { bg: "rgba(148,163,184,0.2)", color: "#cbd5e1", border: "rgba(148,163,184,0.4)" } : { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.3)" };
  };

  const getStatusColor = (s, isDark) => {
    if (s === "待發表") return { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
    if (s === "修改中") return isDark ? { bg: "rgba(234,179,8,0.2)", color: "#fde047", border: "rgba(234,179,8,0.4)" } : { bg: "rgba(234,179,8,0.15)", color: "#854d0e", border: "rgba(234,179,8,0.3)" };
    if (s === "撰寫中") return isDark ? { bg: "rgba(139,92,246,0.2)", color: "#d8b4fe", border: "rgba(139,92,246,0.4)" } : { bg: "rgba(139,92,246,0.12)", color: "#5b21b6", border: "rgba(139,92,246,0.25)" };
    if (s === "已發表") return isDark ? { bg: "rgba(34,197,94,0.2)", color: "#86efac", border: "rgba(34,197,94,0.4)" } : { bg: "rgba(34,197,94,0.12)", color: "#15803d", border: "rgba(34,197,94,0.25)" };
    return isDark ? { bg: "rgba(148,163,184,0.2)", color: "#cbd5e1", border: "rgba(148,163,184,0.4)" } : { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
  };

  const activeTabClass = "bg-white shadow-md text-[var(--c-primary-dark)]";
  const inactiveTabClass = "text-[var(--c-text-secondary)] hover-bg-surface";

  if (loading) return (
    <div className="max-w-4xl mx-auto animate-fade-in relative z-10">
      <PageHeader title="研討進度" />
      <div className="flex justify-center py-24 theme-text-secondary font-sans opacity-50">載入中⋯⋯</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      <PageHeader title="研討進度" />

      <div className="flex justify-center mb-6 md:mb-10">
        <div className="inline-flex bg-white/40 p-1.5 rounded-full border border-white/60 shadow-inner backdrop-blur-sm">
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold font-sans spring-transition ${viewMode === "timeline" ? activeTabClass : inactiveTabClass}`}
          >
            <Icon name="Calendar" size={16} className="shrink-0" /> 研討歷程
          </button>
          <button
            onClick={() => setViewMode("articles")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold font-sans spring-transition ${viewMode === "articles" ? activeTabClass : inactiveTabClass}`}
          >
            <Icon name="ClipboardList" size={16} className="shrink-0" /> 討論進度
          </button>
        </div>
      </div>

      {viewMode === "timeline" && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-center gap-3">
            {[
              { id: "all", label: "全部" },
              { id: "upcoming", label: "即將舉辦" },
              { id: "past", label: "已舉辦" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setEventFilter(btn.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
                style={eventFilter === btn.id
                  ? { background: "var(--c-nav-active-bg)", color: "#fff", borderColor: "var(--c-nav-active-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
                  : { background: "rgba(var(--c-panel-rgb), 0.4)", borderColor: "rgba(var(--c-border-rgb), 0.6)", color: "var(--c-text-secondary)" }
                }
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative pl-8 md:pl-12 pb-8">
            <div className="absolute top-8 bottom-0 left-[15px] md:left-[23px] w-px border-l-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--c-primary) 30%, transparent)" }}></div>

            <div className="space-y-10">
              {displayEvents.map((ev) => {
                const open = activeEventId === ev._id;
                const typeStyle = getTypeColor(ev.type, isDarkMode);

                return (
                  <div key={ev._id} className="relative">
                    <div className="absolute -left-6 md:-left-8 top-7 w-4 h-4 rounded-full border-[3px] shadow-sm z-10" style={{ backgroundColor: "rgba(var(--c-panel-rgb), 1)", borderColor: "var(--c-primary)" }}></div>
                    
                    <article 
                      onClick={() => setActiveEventId(open ? null : ev._id)}
                      className={`rounded-2xl glass-panel cursor-pointer spring-transition border border-white/60 ${open ? "bg-white/70 shadow-xl scale-[1.02]" : "glass-card-hover hover:-translate-y-1"}`}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans border shrink-0 transition-colors" style={{ background: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}>
                              {ev.type}
                            </span>
                            <span className="text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                              <Icon name="Calendar" size={14} /> {ev.date}
                            </span>
                          </div>
                          {ev.status === "upcoming" ? (
                            <span className="inline-flex items-center justify-center gap-1 text-xs font-bold px-3 py-1 rounded-full border font-sans shrink-0 animate-pulse" style={{ background: isDarkMode ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)", color: isDarkMode ? "#fca5a5" : "#b91c1c", borderColor: isDarkMode ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.2)" }}>
                              即將舉辦
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center gap-1 text-xs font-bold px-3 py-1 rounded-full border font-sans shrink-0" style={{ background: isDarkMode ? "rgba(148,163,184,0.2)" : "rgba(107,114,128,0.1)", color: isDarkMode ? "#cbd5e1" : "#4b5563", borderColor: isDarkMode ? "rgba(148,163,184,0.4)" : "rgba(107,114,128,0.2)" }}>
                              已舉辦
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-3">{ev.title}</h3>
                        <p className="text-base md:text-lg leading-relaxed font-serif content-justify theme-text-secondary mb-2">{ev.summary}</p>

                        <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                          <div className="overflow-hidden">
                            <div className="pt-5 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                              <div className="text-sm md:text-base whitespace-pre-line leading-relaxed font-serif bg-white/30 p-5 rounded-xl shadow-inner content-justify theme-text-secondary mb-4 border border-white/40">
                                {ev.details}
                              </div>

                              {(ev.archive && ev.archive.length > 0) && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-bold font-sans mb-3 flex items-center gap-2 theme-heading">
                                    <Icon name="Folder" size={16} /> 相關歸檔資料
                                  </h4>
                                  <div className="flex flex-wrap gap-3">
                                    {ev.archive.map((file, i) => (
                                      <a key={i} href={file.url} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/50 border border-white/60 rounded-lg text-sm font-sans theme-text-secondary hover-bg-surface transition-colors shadow-sm">
                                        <Icon name="FileText" size={14} className="opacity-60" /> {file.name}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <span className="text-xs font-sans flex items-center gap-1 theme-text-secondary" style={{ opacity: 0.5 }}>
                            {open ? "收合內容" : "查看詳情"}
                            <Icon name="ChevronRight" size={14} className={`spring-transition ${open ? "rotate-90" : ""}`} />
                          </span>
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
            const open = expandedArticleId === art._id;
            const sc = getStatusColor(art.publicationStatus, isDarkMode);
            const hasAbstract = art.summary && art.summary.trim().length > 0;
            return (
              <article key={art._id} onClick={() => setExpandedArticleId(open ? null : art._id)}
                className={`rounded-2xl glass-panel cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.01]" : "glass-card-hover"}`}>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 p-2.5 rounded-xl shrink-0 border border-white/30 bg-white/40 text-[var(--c-primary-dark)]">
                        <Icon name="FileText" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold font-sans leading-snug theme-heading">{art.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm theme-text-secondary">
                          <span className="flex items-center gap-1 font-sans"><Icon name="PenLine" size={14} /> {art.author}</span>
                          <span className="flex items-center gap-1 font-mono text-xs opacity-60"><Icon name="Clock" size={14} /> {art.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans shrink-0 border transition-colors"
                      style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{art.publicationStatus}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {art.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full bg-white/50 border border-white/60 theme-text-secondary">
                        <Icon name="Tag" size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                        {hasAbstract ? (
                          <>
                            <h4 className="text-sm font-bold font-sans mb-3 flex items-center gap-2 theme-heading">
                              <Icon name="BookOpen" size={16} /> 摘要
                            </h4>
                            <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary mb-4">{art.summary}</p>
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
                    <span className="text-xs font-sans flex items-center gap-1 theme-text-secondary" style={{ opacity: 0.5 }}>
                      {open ? "收合" : hasAbstract ? "展開摘要" : "查看狀態"}
                      <Icon name="ChevronRight" size={14} className={`spring-transition ${open ? "rotate-90" : ""}`} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
