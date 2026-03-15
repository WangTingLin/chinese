// 幾何古典紋樣 SVG 裝飾元件
// 所有元件使用 currentColor，父層設定 style={{ color: '...' }} 即可控制顏色
import React from 'react';

// ─── 文章卡片縮圖 ───────────────────────────────────────────────
// viewBox 400×240，全透明背景，以 currentColor 繪製菱格紋樣
export function ArticleThumbnail({ category = '文' }) {
  const id = React.useId().replace(/:/g, '-');
  const pid = `at-${id}`;
  const char = (category || '文')[0];

  return (
    <svg
      viewBox="0 0 400 240"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* 菱格紋單元 32×32 */}
        <pattern id={pid} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16,2 L30,16 L16,30 L2,16 Z"
            fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.28" />
          <path d="M16,9 L23,16 L16,23 L9,16 Z"
            fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.16" />
          <circle cx="16" cy="16" r="1.2" fill="currentColor" fillOpacity="0.22" />
          <circle cx="0"  cy="0"  r="0.8" fill="currentColor" fillOpacity="0.18" />
          <circle cx="32" cy="0"  r="0.8" fill="currentColor" fillOpacity="0.18" />
          <circle cx="0"  cy="32" r="0.8" fill="currentColor" fillOpacity="0.18" />
          <circle cx="32" cy="32" r="0.8" fill="currentColor" fillOpacity="0.18" />
        </pattern>
      </defs>

      {/* 底色調 */}
      <rect width="400" height="240" fill="currentColor" fillOpacity="0.04" />
      {/* 菱格紋鋪底 */}
      <rect width="400" height="240" fill={`url(#${pid})`} />

      {/* 雙線邊框 */}
      <rect x="10" y="10" width="380" height="220"
        fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.5" />
      <rect x="14" y="14" width="372" height="212"
        fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />

      {/* 四角角花：同心圓 + 延伸線 */}
      {[
        [10, 10,   1,  1],
        [390, 10, -1,  1],
        [10, 230,  1, -1],
        [390, 230,-1, -1],
      ].map(([cx, cy, sx, sy], i) => (
        <g key={i} strokeOpacity="0.7" fillOpacity="0.7">
          <circle cx={cx} cy={cy} r="5.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <circle cx={cx} cy={cy} r="2.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r="1"   fill="currentColor" />
          <line x1={cx + sx * 5.5} y1={cy} x2={cx + sx * 22} y2={cy}
            stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1={cx} y1={cy + sy * 5.5} x2={cx} y2={cy + sy * 22}
            stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
        </g>
      ))}

      {/* 四邊中點菱形紐扣 */}
      {[
        ['M190,10 L200,3 L210,10 L200,17 Z',   200, 10],
        ['M190,230 L200,223 L210,230 L200,237 Z', 200, 230],
        ['M10,110 L3,120 L10,130 L17,120 Z',    10, 120],
        ['M390,110 L383,120 L390,130 L397,120 Z', 390, 120],
      ].map(([d, cx, cy], i) => (
        <g key={i} fillOpacity="0.55" strokeOpacity="0.55">
          <path d={d} fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r="1.8" fill="currentColor" />
        </g>
      ))}

      {/* 中央三層嵌套菱形 */}
      <path d="M200,55 L318,120 L200,185 L82,120 Z"
        fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.16" />
      <path d="M200,75 L285,120 L200,165 L115,120 Z"
        fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.11" />
      <path d="M200,95 L255,120 L200,145 L145,120 Z"
        fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" />

      {/* 分類字首浮水印 */}
      <text
        x="200" y="120"
        textAnchor="middle" dominantBaseline="central"
        fill="currentColor" fontSize="88" fontWeight="bold"
        fillOpacity="0.1" fontFamily="serif"
      >
        {char}
      </text>
    </svg>
  );
}

// ─── 頁首裝飾橫幅 ───────────────────────────────────────────────
// viewBox 800×56，透明背景，雙線邊框 + 角花 + 中央菱形組
export function PageHeaderBanner() {
  const id = React.useId().replace(/:/g, '-');
  const pid = `phb-${id}`;

  return (
    <svg
      viewBox="0 0 800 56"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id={pid} width="24" height="24" patternUnits="userSpaceOnUse"
          patternTransform="translate(400 28)">
          <path d="M12,2 L22,12 L12,22 L2,12 Z"
            fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.18" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" fillOpacity="0.14" />
          <circle cx="0"  cy="0"  r="0.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="24" cy="0"  r="0.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="0"  cy="24" r="0.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="24" cy="24" r="0.5" fill="currentColor" fillOpacity="0.1" />
        </pattern>
      </defs>

      {/* 菱格紋鋪底 */}
      <rect width="800" height="56" fill={`url(#${pid})`} />

      {/* 上雙線 */}
      <line x1="0" y1="4"  x2="800" y2="4"  stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="0" y1="8"  x2="800" y2="8"  stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.28" />
      {/* 下雙線 */}
      <line x1="0" y1="48" x2="800" y2="48" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.28" />
      <line x1="0" y1="52" x2="800" y2="52" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* 左端角花 */}
      <g strokeOpacity="0.65" fillOpacity="0.65">
        <circle cx="8" cy="28" r="7"   fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="28" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="8" cy="28" r="1.5" fill="currentColor" />
        <line x1="15" y1="28" x2="36" y2="28" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.45" />
      </g>
      {/* 右端角花 */}
      <g strokeOpacity="0.65" fillOpacity="0.65">
        <circle cx="792" cy="28" r="7"   fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="792" cy="28" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="792" cy="28" r="1.5" fill="currentColor" />
        <line x1="785" y1="28" x2="764" y2="28" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.45" />
      </g>

      {/* 中央菱形組 */}
      <g strokeOpacity="0.45" fillOpacity="0.45">
        <path d="M380,28 L400,14 L420,28 L400,42 Z"
          fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M388,28 L400,20 L412,28 L400,36 Z"
          fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="400" cy="28" r="2.5" fill="currentColor" />
        <circle cx="358" cy="28" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="442" cy="28" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="362" y1="28" x2="380" y2="28" stroke="currentColor" strokeWidth="0.5" />
        <line x1="420" y1="28" x2="438" y2="28" stroke="currentColor" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

// ─── 導覽卡片背景紋樣 ─────────────────────────────────────────
// 全尺寸透明 SVG，疊加在卡片上當裝飾底紋
export function NavCardPattern() {
  const id = React.useId().replace(/:/g, '-');
  const pid = `ncp-${id}`;

  return (
    <svg
      width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 rounded-3xl"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10,1 L19,10 L10,19 L1,10 Z"
            fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.2" />
          <circle cx="10" cy="10" r="0.7" fill="currentColor" fillOpacity="0.16" />
          <circle cx="0"  cy="0"  r="0.4" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="0"  r="0.4" fill="currentColor" fillOpacity="0.1" />
          <circle cx="0"  cy="20" r="0.4" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="0.4" fill="currentColor" fillOpacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}
