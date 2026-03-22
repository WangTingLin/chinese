// 檔案路徑：src/pages/ArticlesPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { createImageUrlBuilder } from '@sanity/image-url';

import { client } from '../sanityClient';
import SEOHead from '../components/SEOHead';

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
  "學術筆記": { bg: isDark ? "rgba(122,82,40,0.28)" : "rgba(122,82,40,0.10)", color: isDark ? "#d4a86a" : "#7a5228", border: isDark ? "rgba(122,82,40,0.5)" : "rgba(122,82,40,0.25)" },
  "讀書心得": { bg: isDark ? "rgba(74,92,56,0.28)" : "rgba(74,92,56,0.10)", color: isDark ? "#a8c890" : "#4a5c38", border: isDark ? "rgba(74,92,56,0.5)" : "rgba(74,92,56,0.25)" },
  "文學創作": { bg: isDark ? "rgba(139,72,40,0.28)" : "rgba(139,72,40,0.10)", color: isDark ? "#e0a882" : "#8b4828", border: isDark ? "rgba(139,72,40,0.5)" : "rgba(139,72,40,0.25)" },
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

export default function ArticlesPage({ isDarkMode, initialArticleId }) {
  const [expandedId, setExpandedId] = useState(initialArticleId || null);
  const [filterCat, setFilterCat] = useState("全部");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeArticleRef = useRef(null);

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
    <div style={{ padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <ArticleSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  const filteredArticles = filterCat === "全部" ? articles : articles.filter(a => a.category === filterCat);
  const displayArticles = [...filteredArticles];

  const openArticle = displayArticles.find(a => a._id === expandedId);
  const activeCatColor = openArticle ? (catColors[openArticle.category] || { color: "#b01f45" }) : null;

  return (
    <>
      <SEOHead title="文章專欄" description="中文研究室學術文章、讀書紀要與研究評論。" url="/articles" />
      {expandedId && activeCatColor && (
        <ReadingProgress targetRef={activeArticleRef} color={activeCatColor.color} isDarkMode={false} />
      )}

      <div style={{ padding: "4rem 2rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Editorial header */}
          <div style={{ marginBottom: "3rem" }}>
            <span className="ed-label">02 / 文章</span>
            <h2 className="ed-heading" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginTop: "0.5rem" }}>文章專欄</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#a8a29e", textTransform: "uppercase", marginTop: "0.5rem" }}>{articles.length} 篇</p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid rgba(29,27,25,0.08)", paddingBottom: "1rem", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: filterCat === cat ? 600 : 400, color: filterCat === cat ? "#b01f45" : "#78716c", paddingBottom: "0.5rem", borderBottom: filterCat === cat ? "2px solid #b01f45" : "2px solid transparent", transition: "all 200ms ease" }}>
                {CATEGORY_DISPLAY[cat] ?? cat}
              </button>
            ))}
          </div>

          {displayArticles.length === 0 ? (
            <div style={{ padding: "4rem 0", textAlign: "center", color: "#a8a29e", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem", opacity: 0.4 }}>article</span>
              尚無文章，敬請期待。
            </div>
          ) : (
            <div>
              {displayArticles.map((a) => {
                const open = expandedId === a._id;

                return (
                  <article
                    key={a._id}
                    ref={open ? activeArticleRef : null}
                    className="item-row"
                    style={{ borderBottom: "1px solid rgba(29,27,25,0.07)", paddingBottom: open ? 0 : "2.5rem", marginBottom: open ? "2.5rem" : 0, borderRadius: "0.5rem", margin: "0 -0.75rem", marginBottom: open ? "2.5rem" : 0 }}
                  >
                    <div
                      style={{ paddingTop: "2.5rem", paddingLeft: "0.75rem", paddingRight: "0.75rem", cursor: "pointer" }}
                      onClick={() => setExpandedId(open ? null : a._id)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#a8a29e", textTransform: "uppercase" }}>{CATEGORY_DISPLAY[a.category] ?? a.category} • {a.date}</span>
                          {(() => { const mins = estimateReadingTime(a.blocks); return mins ? <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#a8a29e", display: "flex", alignItems: "center", gap: "0.25rem" }}><Icon name="Clock" size={12} /> 約 {mins} 分鐘</span> : null; })()}
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "#a8a29e", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
                      </div>

                      <h3 className="ed-heading" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", marginBottom: "0.75rem", lineHeight: 1.4 }}>{a.title}</h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#78716c", fontStyle: "italic" }}>{a.author ?? '（未填）'}</span>
                        {a.affiliation && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a8a29e" }}>— {a.affiliation}</span>}
                      </div>

                      {(a.tags || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                          {a.tags.map((tag, i) => (
                            <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#b01f45", background: "rgba(176,31,69,0.06)", borderRadius: "9999px", padding: "0.15rem 0.6rem" }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {!open && a.summary && (
                        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "0.9rem", color: "#78716c", lineHeight: 1.7, marginBottom: "1.5rem" }}>{a.summary}</p>
                      )}

                      {!open && (
                        <button className="ed-link" style={{ color: "#b01f45" }}>
                          閱讀全文 <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
                        </button>
                      )}
                    </div>

                    <div style={{ overflow: "hidden", transition: "all 300ms ease", maxHeight: open ? "9999px" : "0", opacity: open ? 1 : 0 }}>
                      <div style={{ padding: "2rem 0 3rem", borderTop: "1px dashed rgba(29,27,25,0.1)", marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                          {/* TOC */}
                          {(() => {
                            const tocItems = extractTocHeadings(a.blocks);
                            if (tocItems.length === 0) return null;
                            return (
                              <div style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(29,27,25,0.07)", borderRadius: "0.75rem" }}>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#a8a29e", textTransform: "uppercase", marginBottom: "1rem" }}>目錄</h4>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, borderLeft: "2px solid rgba(176,31,69,0.2)", paddingLeft: "1rem" }}>
                                  {tocItems.map((h) => (
                                    <li key={h.key} style={{ marginBottom: "0.5rem" }}>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); const el = document.getElementById(`article-${a._id}-${h.key}`); if(el) el.scrollIntoView({behavior: 'smooth'}); }}
                                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#78716c", textAlign: "left" }}
                                      >
                                        {h.text}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })()}

                          {/* Article content */}
                          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: "1.05rem", lineHeight: 1.9, color: "#1d1b19" }}>
                            {(a.blocks || []).length === 0 ? (
                              <p style={{ color: "#a8a29e", textAlign: "center", padding: "2rem 0" }}>（此文尚未填入全文內容）</p>
                            ) : (
                              <PortableText value={a.blocks} components={makePortableComponents(a._id)} />
                            )}
                          </div>
                        </div>

                        {/* Related Articles */}
                        {(() => {
                          const related = articles
                            .filter(r => r._id !== a._id && r.category === a.category)
                            .slice(0, 3);
                          if (related.length === 0) return null;
                          return (
                            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(29,27,25,0.08)" }}>
                              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#a8a29e", textTransform: "uppercase", marginBottom: "1.5rem" }}>相關文章</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                {related.map(r => (
                                  <div key={r._id} onClick={() => setExpandedId(r._id)} style={{ cursor: "pointer", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(29,27,25,0.06)" }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#a8a29e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{r.category} • {r.date}</p>
                                    <h4 className="ed-heading" style={{ fontSize: "1.1rem", lineHeight: 1.45, fontWeight: 400 }}>{r.title}</h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#78716c", marginTop: "0.3rem" }}>{r.author}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                            className="ed-link"
                            style={{ color: "#b01f45" }}
                          >
                            收合文章 <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>expand_less</span>
                          </button>
                        </div>
                      </div>
                    </div>
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
