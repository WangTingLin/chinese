// 檔案路徑：src/pages/HomePage.jsx
import React from 'react';

// 💡 匯入首頁需要的共用元件
import { Icon } from '../App';
// 💡 匯入首頁需要的資料（最新文章與最新研討）
import { columnArticles, getCategoryColors } from '../data/articlesData';
import { nextEvent } from '../data/eventsData';

export default function HomePage({ setPage, isDarkMode }) {
  const latestArticle = columnArticles.length > 0 ? columnArticles[columnArticles.length - 1] : null;
  const catColors = getCategoryColors(isDarkMode);
  const latestArtColor = latestArticle ? (catColors[latestArticle.category] || { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.3)" }) : null;

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-black/20' : 'from-white/30'} to-transparent pointer-events-none`}></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest font-sans theme-heading relative z-10">
          中文研究室
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif content-justify theme-text-secondary relative z-10" style={{ textAlignLast: "center" }}>
          「獨學而無友，則孤陋而寡聞。」
          <br />
          ──《禮記‧學記》
        </p>

        <button
          onClick={() => setPage("about")}
          className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto spring-transition hover:scale-105 active:scale-95 border relative z-10"
          style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}
        >
          探索研究室 <Icon name="ChevronRight" size={20} />
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "文章專欄", icon: "BookOpen", target: "articles" },
          { title: "研討進度", icon: "Calendar", target: "events" },
          { title: "資訊分享", icon: "Library", target: "books" }
        ].map((item, i) => (
          <div key={i} onClick={() => setPage(item.target)} className="p-8 rounded-3xl glass-panel glass-card-hover cursor-pointer group flex flex-col items-center text-center border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm" style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)" }}>
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans theme-heading transition-colors duration-300 group-hover:text-[var(--c-accent)]">{item.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col">
          <div className="flex justify-between items-start mb-5">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border"
              style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)", borderColor: "var(--c-badge-border)" }}
            >
              <Icon name="Calendar" size={16} /> 近期研討
            </div>
            <button onClick={(e) => { e.stopPropagation(); setPage("events"); }} className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 hover:opacity-100 transition-opacity mt-1">
              查看全部 <Icon name="ChevronRight" size={16} />
            </button>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors hover:bg-white/70 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-5 font-sans theme-heading">三月讀書會</h3>
            <div className="space-y-4 flex-1">
              {[["時間", nextEvent.date], ["地點", nextEvent.location], ["主題", nextEvent.topic]].map(([l, v]) => (
                <p key={l} className="flex items-start gap-3 theme-text">
                  <strong className="min-w-16 font-sans shrink-0">{l}：</strong>
                  <span>{v}</span>
                </p>
              ))}
              <div className="flex items-start gap-3 theme-text">
                <strong className="min-w-16 font-sans shrink-0">論文：</strong>
                <ul className="space-y-2">
                  {nextEvent.papers.map((p, i) => (
                    <li key={i} className="leading-relaxed relative pl-4">
                      <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--c-accent)" }}></span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {latestArticle && (
          <section 
            className="rounded-3xl p-6 md:p-8 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl cursor-pointer group flex flex-col"
            onClick={() => setPage("articles")}
          >
            <div className="flex justify-between items-start mb-5">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border"
                style={{ background: isDarkMode ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.1)", color: isDarkMode ? "#fda4af" : "#e11d48", borderColor: isDarkMode ? "rgba(244,63,94,0.4)" : "rgba(244,63,94,0.2)" }}
              >
                <Icon name="PenLine" size={16} /> 最新上架
              </div>
              <span className="text-sm font-sans flex items-center gap-1 theme-text-secondary opacity-50 group-hover:opacity-100 transition-opacity mt-1">
                前往專欄 <Icon name="ChevronRight" size={16} />
              </span>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors group-hover:bg-white/70 flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
                  style={{ background: latestArtColor.bg, color: latestArtColor.color, borderColor: latestArtColor.border }}>
                  <Icon name="Folder" size={14} className="opacity-70" /> {latestArticle.category}
                </span>
                <span className="text-xs font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                  <Icon name="Calendar" size={14} /> {latestArticle.date}
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold font-sans theme-heading mb-4 leading-snug group-hover:text-[var(--c-accent)] transition-colors line-clamp-2">
                {latestArticle.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm theme-text-secondary font-sans mb-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: latestArtColor.color, opacity: 0.9 }}>
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
