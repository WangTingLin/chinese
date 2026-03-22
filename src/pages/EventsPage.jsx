// 檔案路徑：src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';

import { client } from '../sanityClient';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';
import { ArticleThumbnail } from '../components/ClassicalDecoration';
import SEOHead from '../components/SEOHead';

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
    if (type === "讀書會") return isDark ? { bg: "rgba(58,80,104,0.28)", color: "#90b0d0", border: "rgba(58,80,104,0.5)" } : { bg: "rgba(58,80,104,0.10)", color: "#3a5068", border: "rgba(58,80,104,0.25)" };
    if (type === "發表")   return isDark ? { bg: "rgba(122,82,40,0.28)", color: "#d4a86a", border: "rgba(122,82,40,0.5)" } : { bg: "rgba(122,82,40,0.10)", color: "#7a5228", border: "rgba(122,82,40,0.25)" };
    if (type === "會後紀要") return isDark ? { bg: "rgba(74,92,56,0.28)", color: "#a8c890", border: "rgba(74,92,56,0.5)" } : { bg: "rgba(74,92,56,0.10)", color: "#4a5c38", border: "rgba(74,92,56,0.25)" };
    return isDark ? { bg: "rgba(100,88,72,0.28)", color: "#b0a090", border: "rgba(100,88,72,0.5)" } : { bg: "rgba(100,88,72,0.10)", color: "#6a5840", border: "rgba(100,88,72,0.25)" };
  };

  const getStatusColor = (s, isDark) => {
    if (s === "待發表") return isDark ? { bg: "rgba(100,88,72,0.28)", color: "#b0a090", border: "rgba(100,88,72,0.5)" } : { bg: "rgba(100,88,72,0.10)", color: "#6a5840", border: "rgba(100,88,72,0.25)" };
    if (s === "修改中") return isDark ? { bg: "rgba(122,96,24,0.28)", color: "#d4b870", border: "rgba(122,96,24,0.5)" } : { bg: "rgba(122,96,24,0.10)", color: "#7a6018", border: "rgba(122,96,24,0.25)" };
    if (s === "撰寫中") return isDark ? { bg: "rgba(58,80,104,0.28)", color: "#90b0d0", border: "rgba(58,80,104,0.5)" } : { bg: "rgba(58,80,104,0.10)", color: "#3a5068", border: "rgba(58,80,104,0.25)" };
    if (s === "已發表") return isDark ? { bg: "rgba(74,92,56,0.28)", color: "#a8c890", border: "rgba(74,92,56,0.5)" } : { bg: "rgba(74,92,56,0.10)", color: "#4a5c38", border: "rgba(74,92,56,0.25)" };
    return isDark ? { bg: "rgba(100,88,72,0.28)", color: "#b0a090", border: "rgba(100,88,72,0.5)" } : { bg: "rgba(100,88,72,0.10)", color: "#6a5840", border: "rgba(100,88,72,0.25)" };
  };

  if (loading) return (
    <div style={{ padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ height: "4rem", background: "rgba(29,27,25,0.05)", borderRadius: "0.5rem", marginBottom: "2rem" }} className="shimmer" />
        {[1,2,3].map(i => <div key={i} style={{ height: "5rem", background: "rgba(29,27,25,0.04)", borderRadius: "0.5rem", marginBottom: "1rem" }} className="shimmer" />)}
      </div>
    </div>
  );

  return (
    <>
      <SEOHead title="研討進度" description="中文研究室讀書會研討歷程與進度紀錄。" url="/events" />
    <div style={{ padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Editorial header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="ed-label">03 / 研討</span>
          <h2 className="ed-heading" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginTop: "0.5rem" }}>研討進度</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#a8a29e", textTransform: "uppercase", marginTop: "0.5rem" }}>{timelineEvents.length} 場</p>
        </div>

        {/* View mode tabs */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid rgba(29,27,25,0.08)", paddingBottom: "1rem" }}>
          {[
            { id: "timeline", label: "研討歷程" },
            { id: "articles", label: "討論進度" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: viewMode === tab.id ? 600 : 400, color: viewMode === tab.id ? "#b01f45" : "#78716c", paddingBottom: "0.5rem", borderBottom: viewMode === tab.id ? "2px solid #b01f45" : "2px solid transparent", transition: "all 200ms ease" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {viewMode === "timeline" && (
          <div>
            {/* Filter sub-tabs */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "全部" },
                { id: "upcoming", label: "即將舉辦" },
                { id: "past", label: "已舉辦" },
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setEventFilter(btn.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", fontWeight: eventFilter === btn.id ? 600 : 400, color: eventFilter === btn.id ? "#b01f45" : "#a8a29e", transition: "color 200ms ease" }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: "2rem" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "1px", background: "rgba(176,31,69,0.15)" }} />

              {displayEvents.length === 0 ? (
                <div style={{ padding: "4rem 0", textAlign: "center", color: "#a8a29e", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }}>event</span>
                  尚無活動記錄。
                </div>
              ) : (
                <div>
                  {displayEvents.map((ev) => {
                    const open = activeEventId === ev._id;
                    const typeStyle = getTypeColor(ev.type, false);
                    const isUpcoming = ev.status === "upcoming";

                    return (
                      <div key={ev._id} style={{ position: "relative", marginBottom: "0" }}>
                        {/* Timeline dot */}
                        <div style={{ position: "absolute", left: "-1.75rem", top: "2.75rem", width: "10px", height: "10px", borderRadius: "50%", background: isUpcoming ? "#b01f45" : "rgba(176,31,69,0.3)", border: "2px solid #fef8f4", boxShadow: isUpcoming ? "0 0 0 3px rgba(176,31,69,0.15)" : "none" }} />

                        <article
                          onClick={() => setActiveEventId(open ? null : ev._id)}
                          style={{ padding: "2.5rem 0", borderBottom: "1px solid rgba(29,27,25,0.07)", cursor: "pointer", opacity: !isUpcoming && ev.status === "past" ? 0.65 : 1 }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#a8a29e", textTransform: "uppercase" }}>{ev.type} • {ev.date}</span>
                              {isUpcoming && (
                                <span className="brand-badge" style={{ animation: "pulse 2s infinite" }}>即將舉辦</span>
                              )}
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "#a8a29e", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
                          </div>

                          <h3 className="ed-heading" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", marginBottom: "0.75rem", lineHeight: 1.4 }}>{ev.title}</h3>

                          {ev.location && (
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a8a29e", marginBottom: "0.75rem" }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "0.9rem", verticalAlign: "middle", marginRight: "0.25rem" }}>location_on</span>
                              {ev.location}
                            </p>
                          )}

                          {!open && ev.summary && (
                            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.9rem", color: "#78716c", lineHeight: 1.7 }}>{ev.summary}</p>
                          )}

                          {open && (
                            <div style={{ borderTop: "1px dashed rgba(29,27,25,0.1)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
                              {ev.summary && (
                                <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.95rem", color: "#78716c", lineHeight: 1.8, marginBottom: "1.25rem" }}>{ev.summary}</p>
                              )}
                              {ev.details && (
                                <div style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(29,27,25,0.06)", borderRadius: "0.75rem", borderLeft: "3px solid rgba(176,31,69,0.3)" }}>
                                  <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.9rem", color: "#78716c", lineHeight: 1.85, whiteSpace: "pre-line" }}>{ev.details}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === "articles" && (
          <div>
            {displayResearchArticles.length === 0 ? (
              <div style={{ padding: "4rem 0", textAlign: "center", color: "#a8a29e", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }}>article</span>
                尚無討論進度記錄。
              </div>
            ) : (
              <div>
                {displayResearchArticles.map((art) => {
                  const open = expandedArticleId === art._id;
                  const sc = getStatusColor(art.publicationStatus, false);
                  const hasAbstract = art.summary && art.summary.trim().length > 0;

                  return (
                    <article
                      key={art._id}
                      onClick={() => setExpandedArticleId(open ? null : art._id)}
                      style={{ padding: "2.5rem 0", borderBottom: "1px solid rgba(29,27,25,0.07)", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#a8a29e", textTransform: "uppercase" }}>{art.date}</span>
                          {art.publicationStatus && (
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: 600, padding: "0.15rem 0.6rem", borderRadius: "9999px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                              {art.publicationStatus}
                            </span>
                          )}
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "#a8a29e", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
                      </div>

                      <h3 className="ed-heading" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", marginBottom: "0.75rem", lineHeight: 1.4 }}>{art.title}</h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#78716c", fontStyle: "italic" }}>{art.author}</span>
                        {art.affiliation && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a8a29e" }}>— {art.affiliation}</span>}
                      </div>

                      {(art.tags || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: open ? "1.5rem" : 0 }}>
                          {art.tags.map((tag, i) => (
                            <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#b01f45", background: "rgba(176,31,69,0.06)", borderRadius: "9999px", padding: "0.15rem 0.6rem" }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {open && (
                        <div style={{ borderTop: "1px dashed rgba(29,27,25,0.1)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
                          {hasAbstract ? (
                            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.9rem", color: "#78716c", lineHeight: 1.8 }}>{art.summary}</p>
                          ) : (
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#a8a29e" }}>摘要尚在整理中，敬請期待。</p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
