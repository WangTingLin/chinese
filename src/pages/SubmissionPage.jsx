// 檔案路徑：src/pages/SubmissionPage.jsx
import React from 'react';

// 💡 從主程式匯入共用的介面元件
import { Icon, PageHeader } from '../App';

export default function SubmissionPage() {
  return (
    <div className="w-full space-y-12 animate-fade-in relative z-10">
      <PageHeader title="投稿須知" />
      <div className="p-6 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-10 theme-text max-w-4xl mx-auto">
        <section>
          <h3 className="text-xl md:text-2xl font-bold mb-4 font-sans theme-heading flex items-center gap-2">
            <Icon name="PenLine" size={24} style={{ color: "var(--c-accent)" }} /> 徵稿範圍
          </h3>
          <p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">
            本專欄歡迎屬於中文學科的相關領域的學術筆記、書評、文學創作或學術論文。期盼透過文字交流，促進中文人的對話與思想碰撞。
          </p>
        </section>

        <div className="theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "dashed" }}></div>

        <section>
          <h3 className="text-xl md:text-2xl font-bold mb-4 font-sans theme-heading flex items-center gap-2">
            <Icon name="ClipboardList" size={24} style={{ color: "var(--c-accent)" }} /> 撰文規範
          </h3>
          <ul className="space-y-4 text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--c-primary)" }}></span>
              <span>因本專欄僅為學術成果展示、交流所用，文章請全部以「正文」書寫，<strong>刪去註解、參考文獻</strong>。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--c-primary)" }}></span>
              <span>本專欄即投稿即刊登，<strong>沒有審查機制，亦請作者自負學術責任</strong>。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--c-primary)" }}></span>
              <span>建議字數以 1,000 至 20,000 字為佳，以適應網頁閱讀體驗。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--c-primary)" }}></span>
              <span>若內文有特殊排版需求（如：獨立引文、表格、小標題），請於稿件中明確標示。</span>
            </li>
          </ul>
        </section>

        <div className="theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "dashed" }}></div>

        <section>
          <h3 className="text-xl md:text-2xl font-bold mb-4 font-sans theme-heading flex items-center gap-2">
            <Icon name="Send" size={24} style={{ color: "var(--c-accent)" }} /> 投稿方式
          </h3>
          <p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">
            請將您的稿件（Word 或 txt 格式）寄至本室信箱：
          </p>
          
          <div className="my-5 flex md:block justify-center">
            <a href="mailto:zxc998775@gmail.com" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/60 rounded-xl hover:-translate-y-0.5 transition-all shadow-sm font-sans text-base font-bold border border-white/60" style={{ color: "var(--c-primary)" }}>
              <Icon name="Mail" size={18} /> zxc998775@gmail.com
            </a>
          </div>

          <p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">
            信件主旨請註明「投稿中文研究室」字樣，並於信件內附上您的<strong>真實姓名（或筆名）、所屬／就讀單位與稱謂</strong>（以便網頁建檔）。我們將在收到後盡快回覆並為您上架！
          </p>
        </section>
      </div>
    </div>
  );
}
