// 檔案路徑：src/pages/ArticlesPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';

import { client } from '../sanityClient';

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader, ReadingProgress } from '../App';
import { ArticleThumbnail } from '../components/ClassicalDecoration';

const FIXED_CATEGORIES = ["全部", "學術筆記", "讀書心得", "文學創作"];

// 後端儲存值 → 前端顯示名稱的對照表
const CATEGORY_DISPLAY = {
  "讀書心得": "讀書會紀錄",
};

const getCategoryColors = (isDark) => ({
  "學術筆記": { bg: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.12)", color: isDark ? "#93c5fd" : "#1e40af", border: isDark ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.3)" },
  "讀書心得": { bg: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.12)", color: isDark ? "#86efac" : "#166534", border: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.3)" },
  "文學創作": { bg: isDark ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.12)", color: isDark ? "#fda4af" : "#9f1239", border: isDark ? "rgba(244,63,94,0.4)" : "rgba(244,63,94,0.3)" },
});

const extractTocHeadings = (blocks) => {
  if (!blocks) return [];
  return blocks
    .filter(b => b._type === "block" && /^h[1-6]$/.test(b.style || ""))
    .map(b => ({ key: b._key, text: b.children?.map(c => c.text).join('') || '' }));
};

const makePortableComponents = (articleId) => ({
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(900).auto('format').url()}
            alt={value.alt || ''}
            className="w-full rounded-2xl shadow-md border border-white/40"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm theme-text-secondary opacity-70 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    normal: ({children}) => <p className="leading-relaxed theme-text-secondary mb-4" style={{ textIndent: "2em" }}>{children}</p>,
    h2: ({value, children}) => <h4 id={`article-${articleId}-${value._key}`} className="text-xl md:text-2xl font-bold theme-heading mt-10 mb-5 flex items-center gap-3" style={{ scrollMarginTop: "120px" }}><span style={{ width: "5px", height: "1.2em", background: "var(--c-accent)", borderRadius: "4px" }}></span>{children}</h4>,
    h3: ({value, children}) => <h5 id={`article-${articleId}-${value._key}`} className="text-lg font-bold theme-heading mt-8 mb-4" style={{ scrollMarginTop: "120px" }}>{children}</h5>,
    blockquote: ({children}) => <blockquote className="my-8 pl-5 py-4 border-l-4 font-kai leading-relaxed theme-text-secondary bg-white/40 rounded-r-xl shadow-sm" style={{ borderColor: "var(--c-accent)" }}>{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="space-y-3 my-6 px-4 md:px-8 theme-text-secondary">{children}</ul>,
    number: ({children}) => <ol className="space-y-3 my-6 px-4 md:px-8 theme-text-secondary list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="leading-relaxed relative pl-6"><span className="absolute left-0 top-2.5 w-2 h-2 rounded-full" style={{ background: "var(--c-accent)", opacity: 0.8 }}></span>{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold theme-heading">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({value, children}) => <a href={value?.href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: "var(--c-primary)" }}>{children}</a>,
  },
});

export default function ArticlesPage({ isDarkMode }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filterCat, setFilterCat] = useState("全部");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeArticleRef = useRef(null);

  useEffect(() => {
    client.fetch(`*[_type == "article" && category != "讀書會紀錄"] | order(date desc) {
      _id, title, author, affiliation, contact, date, category, tags, summary, blocks
    }`).then(data => {
      setArticles(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = FIXED_CATEGORIES;
  const catColors = getCategoryColors(isDarkMode);

  if (loading) return (
    <div className="max-w-4xl mx-auto animate-fade-in relative z-10">
      <PageHeader title="文章專欄" />
      <div className="flex justify-center py-24 theme-text-secondary font-sans opacity-50">載入中⋯⋯</div>
    </div>
  );

  const filteredArticles = filterCat === "全部" ? articles : articles.filter(a => a.category === filterCat);
  const displayArticles = [...filteredArticles];

  const openArticle = displayArticles.find(a => a._id === expandedId);
  const activeCatColor = openArticle ? (catColors[openArticle.category] || { color: "var(--c-primary)" }) : null;

  return (
    <>
      {expandedId && activeCatColor && (
        <ReadingProgress targetRef={activeArticleRef} color={activeCatColor.color} isDarkMode={isDarkMode} />
      )}
      
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
        <PageHeader title="文章專欄" />

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => {
            const isActive = filterCat === cat;
            const cColor = catColors[cat];

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
                {CATEGORY_DISPLAY[cat] ?? cat}
              </button>
            )
          })}
        </div>

        {displayArticles.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl theme-text-secondary font-sans">
            <Icon name="FileText" size={40} className="mx-auto mb-4 opacity-30" />
            <p>尚無文章，敬請期待。</p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {displayArticles.map((a) => {
              const open = expandedId === a._id;
              const cColor = catColors[a.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };

              return (
                <article
                  key={a._id}
                  ref={open ? activeArticleRef : null}
                  className={`rounded-3xl glass-panel overflow-hidden spring-transition border border-white/60 ${open ? "shadow-2xl bg-white/70" : "glass-card-hover"}`}
                >
                  {/* 頂部幾何古典圖像帶 */}
                  {!open && (
                    <div
                      className="relative h-28 md:h-36 overflow-hidden cursor-pointer"
                      onClick={() => setExpandedId(a._id)}
                      style={{ color: cColor.color }}
                    >
                      <ArticleThumbnail category={a.category} />
                      {/* 左側色條 */}
                      <div className="absolute left-0 inset-y-0 w-2 z-10" style={{ background: cColor.color }} />
                      {/* 底部漸層淡出到卡片背景 */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-16 z-10"
                        style={{ background: "linear-gradient(to bottom, transparent, rgba(var(--c-panel-rgb), 0.97))" }}
                      />
                    </div>
                  )}
                  <div
                    className="p-5 md:p-8 relative"
                    onClick={() => setExpandedId(open ? null : a._id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
                        style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}>
                        <Icon name="Folder" size={14} className="opacity-70" /> {CATEGORY_DISPLAY[a.category] ?? a.category}
                      </span>
                      <span className="text-xs md:text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                        <Icon name="Calendar" size={14} /> {a.date}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-3xl font-bold font-sans theme-heading mb-4 leading-tight transition-colors">
                      {a.title}
                    </h3>
                    
                    <div className="mb-5 flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm theme-text-secondary font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: cColor.color, opacity: 0.9 }}>
                            {a.author?.[0] ?? '?'}
                          </span>
                          <span className="font-medium text-base whitespace-nowrap">{a.author ?? '（未填）'}</span>
                          <span className="opacity-50 hidden md:inline">｜</span>
                        </div>
                        <span className="opacity-80 w-full md:w-auto ml-8 md:ml-0 text-xs md:text-sm leading-relaxed">{a.affiliation}</span>
                      </div>
                      {a.contact && (
                        <div className="flex items-center gap-1.5 text-xs font-mono theme-text-secondary opacity-60 ml-8">
                          <Icon name="Mail" size={12} className="shrink-0" /> <span className="break-all">{a.contact}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                      {(a.tags || []).map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full border transition-colors hover:brightness-95"
                          style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}>
                          <Icon name="Tag" size={12} className="opacity-60 shrink-0" /> {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`grid spring-transition ${open ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                      <div className="overflow-hidden">
                        {a.summary && (
                          <p className="text-sm md:text-base leading-relaxed font-serif content-justify theme-text-secondary mb-4 p-4 rounded-2xl bg-white/30 border border-white/40 shadow-inner">
                            {a.summary}
                          </p>
                        )}
                        <div className="flex justify-center mt-2">
                          <span className="inline-flex items-center justify-center gap-1 text-sm font-medium font-sans px-4 py-2 rounded-full shadow-sm border" style={{ color: "white", background: cColor.color, borderColor: cColor.color }}>
                            <span className="leading-none pt-[1px]">閱讀全文</span>
                            <div className="flex items-center justify-center h-4 w-4 ml-0.5"><Icon name="ChevronDown" size={16} className="animate-bounce" /></div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`grid spring-transition ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-8 pb-16 md:pb-20 pt-2 md:pt-4"> 
                        <div className="theme-divider pt-6 md:pt-8 mb-6 md:mb-8" style={{ borderTopWidth: "2px", borderTopStyle: "dashed" }}></div>
                        
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                          {/* 行動版目錄 (只在小螢幕顯示) */}
                          {(() => {
                            const tocItems = extractTocHeadings(a.blocks);
                            if (tocItems.length === 0) return null;
                            return (
                              <div className="w-full lg:hidden mb-2">
                                <div className="p-5 rounded-2xl bg-white/30 border border-white/40 shadow-sm">
                                  <h4 className="text-base font-bold font-sans theme-heading mb-4 flex items-center gap-2">
                                    <Icon name="List" size={18} /> 文章目錄
                                  </h4>
                                  <ul className="space-y-3 text-sm font-sans theme-text-secondary border-l-2 border-[var(--c-primary)]/20 pl-3">
                                    {tocItems.map((h) => (
                                      <li key={h.key} className="relative group">
                                        <span className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--c-primary)] opacity-40 group-hover:opacity-100 transition-opacity"></span>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); const el = document.getElementById(`article-${a._id}-${h.key}`); if(el) el.scrollIntoView({behavior: 'smooth'}); }}
                                          className="hover:text-[var(--c-primary)] transition-colors text-left leading-relaxed block w-full"
                                        >
                                          {h.text}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          })()}

                          {/* 左側：文章內容 */}
                          <div className="flex-1 min-w-0 w-full space-y-6 font-serif text-[1.05rem] md:text-lg leading-loose content-justify theme-text">
                            {(a.blocks || []).length === 0 ? (
                              <div className="text-center opacity-60 text-base py-10 bg-white/30 rounded-2xl border border-white/40">
                                （此文尚未填入全文內容）
                              </div>
                            ) : (
                              <PortableText value={a.blocks} components={makePortableComponents(a._id)} />
                            )}
                          </div>

                          {/* 右側：桌面版黏性目錄 (只在大螢幕顯示) */}
                          {(() => {
                            const tocItems = extractTocHeadings(a.blocks);
                            if (tocItems.length === 0) return null;
                            return (
                              <div className="hidden lg:block w-[240px] shrink-0 sticky top-28">
                                <div className="p-5 rounded-2xl glass-panel shadow-sm">
                                  <h4 className="text-base font-bold font-sans theme-heading mb-4 flex items-center gap-2">
                                    <Icon name="List" size={18} /> 文章目錄
                                  </h4>
                                  <ul className="space-y-3 text-sm font-sans theme-text-secondary border-l-2 border-[var(--c-primary)]/20 pl-3">
                                    {tocItems.map((h) => (
                                      <li key={h.key} className="relative group">
                                        <span className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--c-primary)] opacity-40 group-hover:opacity-100 transition-opacity"></span>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); const el = document.getElementById(`article-${a._id}-${h.key}`); if(el) el.scrollIntoView({behavior: 'smooth'}); }}
                                          className="hover:text-[var(--c-primary)] transition-colors text-left leading-relaxed block w-full"
                                        >
                                          {h.text}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="mt-12 md:mt-16 flex justify-center pb-4 md:pb-8"> 
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(null);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold font-sans transition-all hover:-translate-y-1 shadow-md border"
                            style={{ background: cColor.color, color: "white", borderColor: cColor.color }}
                          >
                            <Icon name="ChevronUp" size={18} />
                            <span className="leading-none pt-[1px]">收合文章</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
