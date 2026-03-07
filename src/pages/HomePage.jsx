import Icon from "../components/Icon";

export default function HomePage({
  setPage,
  latestArticles = [],
  loading = false,
}) {
  const latestArticle = latestArticles.length > 0 ? latestArticles[0] : null;

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center bg-white border border-stone-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest font-sans text-stone-900 relative z-10">
          中文研究室
        </h1>
        <p
          className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif text-stone-600 relative z-10"
          style={{ textAlignLast: "center" }}
        >
          「獨學而無友，則孤陋而寡聞。」
          <br />
          ──《禮記‧學記》
        </p>

        <button
          onClick={() => setPage("about")}
          className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto transition hover:scale-105 active:scale-95 border relative z-10 bg-rose-800 border-rose-800"
        >
          探索研究室 <Icon name="ChevronRight" size={20} />
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "文章專欄", icon: "BookOpen", target: "articles" },
          { title: "研討進度", icon: "Calendar", target: "events" },
          { title: "資訊分享", icon: "Library", target: "books" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => setPage(item.target)}
            className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm cursor-pointer group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm bg-stone-100 text-stone-700">
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans text-stone-900 transition-colors duration-300 group-hover:text-rose-800">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="rounded-3xl p-6 md:p-8 bg-white border border-stone-200 shadow-sm transition-all duration-500 hover:shadow-xl flex flex-col">
          <div className="flex justify-between items-start mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border bg-stone-100 text-stone-700 border-stone-200">
              <Icon name="Calendar" size={16} /> 近期研討
            </div>
            <button
              onClick={() => setPage("events")}
              className="text-sm font-sans flex items-center gap-1 text-stone-500 opacity-70 hover:opacity-100 transition-opacity mt-1"
            >
              查看全部 <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-sm flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-5 font-sans text-stone-900">
              研究室近況
            </h3>
            <div className="space-y-4 flex-1 text-stone-700">
              <p className="leading-relaxed">
                讀書會、文章發表與資源整理，皆持續更新中。
              </p>
              <p className="leading-relaxed">
                可由上方導覽進入「研討進度」與「文章專欄」查閱最新內容。
              </p>
            </div>
          </div>
        </section>

        <section
          className="rounded-3xl p-6 md:p-8 bg-white border border-stone-200 shadow-sm transition-all duration-500 hover:shadow-xl cursor-pointer group flex flex-col"
          onClick={() => setPage("articles")}
        >
          <div className="flex justify-between items-start mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm font-sans border bg-rose-50 text-rose-700 border-rose-200">
              <Icon name="PenLine" size={16} /> 最新上架
            </div>
            <span className="text-sm font-sans flex items-center gap-1 text-stone-500 opacity-70 group-hover:opacity-100 transition-opacity mt-1">
              前往專欄 <Icon name="ChevronRight" size={16} />
            </span>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-sm transition-colors group-hover:bg-white flex-1 flex flex-col justify-center">
            {loading ? (
              <p className="text-stone-500">載入中……</p>
            ) : latestArticle ? (
              <>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border bg-blue-50 text-blue-700 border-blue-200">
                    <Icon name="Folder" size={14} className="opacity-70" />
                    {latestArticle.category || "學術筆記"}
                  </span>
                  <span className="text-xs font-mono flex items-center gap-1.5 text-stone-500">
                    <Icon name="Calendar" size={14} /> {latestArticle.date}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-sans text-stone-900 mb-4 leading-snug group-hover:text-rose-800 transition-colors line-clamp-2">
                  {latestArticle.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-stone-600 font-sans mb-4">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm bg-stone-700">
                    {latestArticle.author?.[0] || "文"}
                  </span>
                  <span className="font-medium">
                    {latestArticle.author || "未署名"}
                  </span>
                  {latestArticle.affiliation && (
                    <>
                      <span className="opacity-50">｜</span>
                      <span className="opacity-80 text-xs">
                        {latestArticle.affiliation}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm leading-relaxed font-serif text-stone-600 line-clamp-3 opacity-90 border-t border-stone-200 pt-4 mt-auto">
                  {latestArticle.summary || "尚無摘要"}
                </p>
              </>
            ) : (
              <p className="text-stone-500">目前尚無文章。</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}