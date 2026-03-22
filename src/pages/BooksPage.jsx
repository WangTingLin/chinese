// 檔案路徑：src/pages/BooksPage.jsx
import React from 'react';

// 💡 匯入資源資料
import { resourceCategories } from '../data/resources';
// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';

// 解析網址取得網域的輔助函式
const getDomain = (url) => {
  try { return new URL(url).hostname; } catch { return ""; }
};

export default function BooksPage() {
  return (
    <div className="space-y-16 animate-fade-in relative z-10">
      <PageHeader title="資源分享" />
      <div className="space-y-12 w-full">
        {resourceCategories.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-2xl font-bold font-sans flex items-center gap-3 pb-4 theme-heading theme-divider" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
              <div className="p-2.5 rounded-xl border border-white/40 bg-white/40 text-[var(--c-primary-dark)]">
                <Icon name={cat.icon} size={24} />
              </div>
              {idx + 1}. {cat.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cat.links.map((link, li) => {
                const domain = getDomain(link.url);
                return (
                  <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center p-5 rounded-2xl glass-panel glass-card-hover hover:-translate-y-1 shadow-sm">
                    <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-white/60 shrink-0 overflow-hidden text-[var(--c-primary)]">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                        alt="" 
                        className="w-7 h-7 object-contain" 
                        onError={(e) => {
                          e.target.onerror = null;
                          // 載入失敗時替換為預設的地球圖示 (SVG 格式)
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E";
                          e.target.className = "w-6 h-6 object-contain opacity-50";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold font-sans transition-colors truncate theme-heading">{link.name}</h4>
                      <p className="text-xs font-mono mt-1 truncate theme-text-secondary" style={{ opacity: 0.5 }}>{domain}</p>
                    </div>
                    <Icon name="ExternalLink" size={18} className="shrink-0 ml-3 opacity-20 group-hover:opacity-70 transition-opacity theme-text-secondary" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
