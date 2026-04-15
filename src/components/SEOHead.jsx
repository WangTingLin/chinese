import { Helmet } from 'react-helmet-async';

const SITE_NAME = '中文研究室';
const SITE_URL = 'https://chineselit.club'; // update if different
const DEFAULT_DESC = '中文研究室：學術活動、文章專欄、研討進度，以文會友，以友輔仁。';
const DEFAULT_IMG = `${SITE_URL}/og-default.png`;

export default function SEOHead({ title, description, type = 'website', image, url }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="zh_TW" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
