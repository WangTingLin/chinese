import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import { resourceCategories } from "../data/resources";

export default function BooksPage() {

  const getDomain = (url) => {
    try { return new URL(url).hostname; } catch { return ""; }
  };

  return (
    <div className="space-y-16 animate-fade-in relative z-10">

      <PageHeader title="資訊分享" />

      {/* 原 BooksPage 內容 */}

    </div>
  );
}