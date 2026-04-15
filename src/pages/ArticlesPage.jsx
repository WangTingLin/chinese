// 檔案路徑：src/pages/ArticlesPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { createImageUrlBuilder } from '@sanity/image-url';

import { client } from '../sanityClient';

const builder = createImageUrlBuilder(client);
const urlFor = (source) => builder.image(source);
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader, ReadingProgress } from '../App';

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

/* 估算閱讀時間（中文約 300 字/分鐘） */
const estimateReadingTime = (blocks) => {
  if (!blocks || blocks.length === 0) return null;
  const text = blocks
    .filter(b => b._type === 'block')
    .flatMap(b => b.children || [])
    .map(c => c.text || '')
    .join('');
  return Math.max(1, Math.ceil(text.length / 300));
};

/* Skeleton 單張卡片 */
const ArticleSkeleton = () => (
  <div className="rounded-3xl glass-panel overflow-hidden border border-white/60 p-5 md:p-8 space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-6 w-24 rounded-full shimmer" />
      <div className="h-5 w-28 rounded-full shimmer" />
    </div>
    <div className="h-7 w-3/4 rounded-xl shimmer" />
    <div className="h-5 w-1/2 rounded-xl shimmer" />
    <div className="h-20 w-full rounded-xl shimmer" />
  </div>
);

const RECENTLY_KEY = "csl_recently_read";
const MAX_RECENT = 5;

export default function ArticlesPage({ isDarkMode, initialArticleId, bookmarks = new Set(), toggleBookmark = () => {} }) {
  const [expandedId, setExpandedId] = useState(initialArticleId || null);
  const [filterCat, setFilterCat] = useState("全部");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeArticleRef = useRef(null);

  /* 最近閱讀 */
  const [recentIds, setRecentIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENTLY_KEY) || '[]'); }
    catch { return []; }
  });
  const addRecent = (id) => {
    setRecentIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
      return next;
    });
  };

  /* 展開文章時記錄最近閱讀 */
  useEffect(() => {
    if (expandedId) addRecent(expandedId);
  }, [expandedId]);

  useEffect(() => {
    client.fetch(`*[_type == "article" && category != "讀書會紀錄"] | order(date desc) {
      _id, title, author, affiliation, contact, date, category, tags, summary, blocks,
      "coverImageUrl": coverImage.asset->url
    }`).then(data => {
      setArticles(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  /* URL 同步：文章展開時更新 ?article=id，關閉時清除 */
  useEffect(() => {
    if (expandedId) {
      history.replaceState(null, '', `?article=${expandedId}`);
    } else {
      history.replaceState(null, '', window.location.pathname);
    }
  }, [expandedId]);

  /* JSON-LD + 動態 OG：文章展開時注入，關閉時移除 */
  useEffect(() => {
    const openArticle = articles.find(a => a._id === expandedId);
    const scriptId = 'article-jsonld';
    let el = document.getElementById(scriptId);
    if (openArticle) {
      if (!el) { el = document.createElement('script'); el.id = scriptId; el.type = 'application/ld+json'; document.head.appendChild(el); }
      el.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": openArticle.title,
        "author": { "@type": "Person", "name": openArticle.author },
        "datePublished": openArticle.date,
        "description": openArticle.summary || '',
        "publisher": { "@type": "Organization", "name": "中文研究室" },
      });
      /* 動態 OG */
      const setMeta = (prop, val) => {
        let m = document.querySelector(`meta[property="${prop}"]`);
        if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
        m.setAttribute('content', val);
      };
      setMeta('og:title', openArticle.title);
      setMeta('og:description', openArticle.summary || '中文研究室文章');
      if (openArticle.coverImageUrl) setMeta('og:image', openArticle.coverImageUrl);
    } else {
      el?.remove();
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', '中文研究室');
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', '中文研究室：學術活動、文章專欄、研討進度，以文會友，以友輔仁。');
    }
    return () => { document.getElementById(scriptId)?.remove(); };
  }, [expandedId, articles]);

  const categories = FIXED_CATEGORIES;
  const catColors = getCategoryColors(isDarkMode);

  if (loading) return (
    <div className="w-full page-enter-right relative z-10 space-y-10">
      <PageHeader title="文章專欄" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => <ArticleSkeleton key={i} />)}
      </div>
    </div>
  );

  const filteredArticles = (() => {
    if (filterCat === "全部") return articles;
    if (filterCat === "已收藏") return articles.filter(a => bookmarks.has(a._id));
    if (filterCat === "最近閱讀") return recentIds.map(id => articles.find(a => a._id === id)).filter(Boolean);
    return articles.filter(a => a.category === filterCat);
  })();
  const displayArticles = [...filteredArticles];

  const openArticle = displayArticles.find(a => a._id === expandedId);
  const activeCatColor = openArticle ? (catColors[openArticle.category] || { color: "var(--c-primary)" }) : null;

  return (
    <>
      {expandedId && activeCatColor && (
        <ReadingProgress targetRef={activeArticleRef} color={activeCatColor.color} isDarkMode={isDarkMode} />
      )}
      
      <div className="w-full space-y-10 page-enter-right stagger relative z-10">
        <PageHeader title="文章專欄" />

        <div className="flex flex-wrap gap-2 justify-center">
          {[...categories,
            ...(bookmarks.size > 0 ? ["已收藏"] : []),
            ...(recentIds.length > 0 ? ["最近閱讀"] : []),
          ].map(cat => {
            const isActive = filterCat === cat;
            const cColor = catColors[cat];
            const isSpecial = cat === "已收藏" || cat === "最近閱讀";

            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
                style={isActive
                  ? {
                      background: isSpecial ? "var(--c-nav-active-bg)" : (cat === "全部" ? "var(--c-nav-active-bg)" : cColor?.color || "var(--c-primary)"),
                      color: "#fff",
                      borderColor: isSpecial ? "var(--c-nav-active-border)" : (cat === "全部" ? "var(--c-nav-active-border)" : cColor?.color || "var(--c-primary)"),
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }
                  : {
                      background: "rgba(var(--c-panel-rgb), 0.4)",
                      borderColor: "rgba(var(--c-border-rgb), 0.6)",
                      color: "var(--c-text-secondary)"
                    }}
              >
                {cat === "已收藏" && <Icon name="BookmarkFill" size={12} className="inline mr-1 opacity-80" />}
                {cat === "最近閱讀" && <Icon name="History" size={12} className="inline mr-1 opacity-80" />}
                {CATEGORY_DISPLAY[cat] ?? cat}
                {cat === "已收藏" && bookmarks.size > 0 && <span className="ml-1 opacity-70">({bookmarks.size})</span>}
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {displayArticles.map((a) => {
              const open = expandedId === a._id;
              const cColor = catColors[a.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };

              return (
                <article
                  key={a._id}
                  ref={open ? activeArticleRef : null}
                  className={`rounded-3xl glass-panel overflow-hidden spring-transition border border-white/60 ${open ? "shadow-2xl bg-white/70 xl:col-span-2" : "glass-card-hover"}`}
                >
                  <div
                    className="p-5 md:p-8 relative"
                    onClick={() => setExpandedId(open ? null : a._id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border transition-colors"
                        style={{ background: cColor.bg, color: cColor.color, borderColor: cColor.border }}>
                        <Icon name="Folder" size={14} className="opacity-70" /> {CATEGORY_DISPLAY[a.category] ?? a.category}
                      </span>
                      <div className="flex items-center gap-3">
                        {(() => { const mins = estimateReadingTime(a.blocks); return mins ? <span className="text-xs font-mono flex items-center gap-1 theme-text-secondary opacity-60"><Icon name="Clock" size={13} /> 約 {mins} 分鐘</span> : null; })()}
                        <span className="text-xs md:text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                          <Icon name="Calendar" size={14} /> {a.date}
                        </span>
                        {/* 書籤 */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(a._id); }}
                          title={bookmarks.has(a._id) ? "取消收藏" : "收藏文章"}
                          aria-label={bookmarks.has(a._id) ? "取消收藏" : "收藏文章"}
                          className="spring-transition hover:scale-110 active:scale-90"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem", color: bookmarks.has(a._id) ? "var(--c-accent)" : "var(--c-text-secondary)", opacity: bookmarks.has(a._id) ? 1 : 0.5, display: "flex" }}
                        >
                          <Icon name={bookmarks.has(a._id) ? "BookmarkFill" : "Bookmark"} size={16} />
                        </button>
                      </div>
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
                          <div className="flex-1 min-w-0 w-full space-y-6 font-serif leading-loose content-justify theme-text" style={{ fontSize: "var(--fs-article, 1.05rem)" }}>
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

                        {/* 相關文章 */}
                        {(() => {
                          const related = displayArticles.filter(r => r._id !== a._id && r.category === a.category).slice(0, 3);
                          if (related.length === 0) return null;
                          return (
                            <div className="mt-12 pt-8 border-t-2 border-dashed" style={{ borderColor: "rgba(var(--c-border-rgb),0.4)" }}>
                              <h4 className="text-base font-bold font-sans theme-heading mb-4 flex items-center gap-2">
                                <Icon name="BookOpen" size={18} /> 相關文章
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {related.map(r => (
                                  <button
                                    key={r._id}
                                    onClick={(e) => { e.stopPropagation(); setExpandedId(r._id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="text-left p-4 rounded-2xl glass-panel border border-white/50 hover:shadow-md spring-transition hover:-translate-y-1"
                                  >
                                    <p className="text-sm font-bold font-sans theme-heading leading-snug mb-2 line-clamp-2">{r.title}</p>
                                    <p className="text-xs font-sans theme-text-secondary opacity-60">{r.author} · {r.date}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

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
