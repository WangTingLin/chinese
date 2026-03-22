import React, { useEffect, useState, useRef } from "react";
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { createClient } from '@sanity/client';
import { PageHeaderBanner } from './components/ClassicalDecoration';
import ArticlesPage from './pages/ArticlesPage';
import { getCategoryColors } from './data/articlesData';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import BooksPage from './pages/BooksPage';
import SubmissionPage from './pages/SubmissionPage';
import { PREF_OPTIONS } from './constants';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';

const isNative = Capacitor.isNativePlatform();

// PWA 加到主畫面後也啟用 app 模式（splash、偏好設定、深色背景等）
const isStandalone =
  window.navigator.standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;

const isAppMode = isNative || isStandalone;

const client = createClient({
  projectId: '6c1fauax',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

/* ==================== 圖示與 Logo ==================== */


export const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    BookOpen: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
    Megaphone: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
    MapPin: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    Calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
    Users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    Home: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    Menu: (
      <>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </>
    ),
    X: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    ChevronRight: <path d="m9 18 6-6-6-6" />,
    ChevronDown: <path d="m6 9 6 6 6-6" />,
    ChevronUp: <path d="m18 15-6-6-6 6" />,
    ChevronLeft: <path d="m15 18-6-6 6-6" />,
    Share: (
      <>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
      </>
    ),
    Folder: (
      <>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </>
    ),
    Library: (
      <>
        <path d="m16 6 4 14" />
        <path d="M12 6v14" />
        <path d="M8 8v12" />
        <path d="M4 4v16" />
      </>
    ),
    Info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    ClipboardList: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </>
    ),
    Edit3: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </>
    ),
    Globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    ExternalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </>
    ),
    PenLine: (
      <>
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
      </>
    ),
    FileText: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </>
    ),
    Tag: (
      <>
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </>
    ),
    Clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    AlertCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </>
    ),
    Mail: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
    Send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    List: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    Sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </>
    ),
    Moon: (
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    ),
    Sliders: (
      <>
        <line x1="4" x2="4" y1="21" y2="14" />
        <line x1="4" x2="4" y1="10" y2="3" />
        <line x1="12" x2="12" y1="21" y2="12" />
        <line x1="12" x2="12" y1="8" y2="3" />
        <line x1="20" x2="20" y1="21" y2="16" />
        <line x1="20" x2="20" y1="12" y2="3" />
        <line x1="1" x2="7" y1="14" y2="14" />
        <line x1="9" x2="15" y1="8" y2="8" />
        <line x1="17" x2="23" y1="16" y2="16" />
      </>
    ),
    Search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
};

const LOGO_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwMCIgem9vbUFuZFBhbj0ibWFnbmlmeSIgdmlld0JveD0iMCAwIDc1MCA3NDkuOTk5OTk1IiBoZWlnaHQ9IjEwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZlcnNpb249IjEuMCI+PGRlZnM+PGNsaXBQYXRoIGlkPSIxZDc5NTdkYTI3Ij48cGF0aCBkPSJNIDc3LjE4MzU5NCA3NiBMIDQzMiA3NiBMIDQzMiAyODYgTCA3Ny4xODM1OTQgMjg2IFogTSA3Ny4xODM1OTQgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYmYyYmY2ZDU4YyI+PHBhdGggZD0iTSA0ODYgNzYgTCA2NzIuNjgzNTk0IDc2IEwgNjcyLjY4MzU5NCA2NjEgTCA0ODYgNjYxIFogTSA0ODYgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYjAxMzNjMTE3MyI+PHBhdGggZD0iTSA3Ny4xODM1OTQgMjA0IEwgNjE4IDIwNCBMIDYxOCA2NzQgTCA3Ny4xODM1OTQgNjc0IFogTSA3Ny4xODM1OTQgMjA0ICIgY2xpcC1ydWxlPSJub256ZXJvIi8+PC9jbGlwUGF0aD48L2RlZnM+PHJlY3QgeD0iLTc1IiB3aWR0aD0iOTAwIiBmaWxsPSIjZmZmZmZmIiB5PSItNzQuOTk5OTk5IiBoZWlnaHQ9Ijg5OS45OTk5OTQiIGZpbGwtb3BhY2l0eT0iMSIvPjxyZWN0IHg9Ii03NSIgd2lkdGg9IjkwMCIgZmlsbD0iI2ZmZmZmZiIgeT0iLTc0Ljk5OTk5OSIgaGVpZ2h0PSI4OTkuOTk5OTk0IiBmaWxsLW9wYWNpdHk9IjEiLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1OS40OTYwOTQgNjE5LjIxODc1IEMgNjUzLjg3MTA5NCA2MzQuNjcxODc1IDYzMi43MjI2NTYgNjUyLjg2NzE4OCA2MTguMzI4MTI1IDY2MC4zOTQ1MzEgTCA2MzQuNTQ2ODc1IDY0Ny4yNzczNDQgQyA2NDIuNTgyMDMxIDYzOS40MjE4NzUgNjUwLjY1NjI1IDYzMS4zODI4MTIgNjU2LjQyNTc4MSA2MjEuOTIxODc1IEMgNjU3LjIzMDQ2OSA2MjAuNTcwMzEyIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1OS40NjA5MzggNjE5LjIxODc1IFogTSA2NTkuNDk2MDk0IDYxOS4yMTg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA1MDAuMDg5ODQ0IDY3My41MDc4MTIgQyA0ODQuOTMzNTk0IDY3My41ODIwMzEgNDY5LjY5OTIxOSA2NzMuNTA3ODEyIDQ1NC41NDI5NjkgNjczLjUwNzgxMiBaIE0gNTAwLjA4OTg0NCA2NzMuNTA3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY2Ny4zODY3MTkgNjAwLjgwNDY4OCBDIDY2NS42MzI4MTIgNjA2LjI4NTE1NiA2NjQuMDIzNDM4IDYxMS45NDUzMTIgNjYwLjM3MTA5NCA2MTYuNTg1OTM4IEMgNjYxLjUwMzkwNiA2MTIuNzg5MDYyIDY2My4zNjcxODggNjA4LjI1NzgxMiA2NjUuMjMwNDY5IDYwMy40MzM1OTQgQyA2NjUuNzQyMTg4IDYwMi4wODIwMzEgNjY0Ljk3MjY1NiA2MDAuMjkyOTY5IDY2Ny4zODY3MTkgNjAwLjgzOTg0NCBaIE0gNjY3LjM4NjcxOSA2MDAuODA0Njg4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBMIDY0Ni43MTA5MzggMTE1LjYyMTA5NCBDIDY0MC4zMjAzMTIgMTA2LjA4NTkzOCA2MjkuNjkxNDA2IDk4LjYzMjgxMiA2MjAuMDgyMDMxIDkxLjkxMDE1NiBDIDYyMi41NjY0MDYgOTEuOTQ1MzEyIDYyNS4wMTU2MjUgOTMuNzM0Mzc1IDYyNy4wMjM0MzggOTUuMDUwNzgxIEMgNjM3LjM5ODQzOCAxMDEuODQ3NjU2IDY0NS41NzgxMjUgMTEwLjc2MTcxOSA2NTIuNTE5NTMxIDEyMC44MDg1OTQgWiBNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2MTkuMjA3MDMxIDkwLjk5NjA5NCBMIDYxNC4xNjQwNjIgODkuNDk2MDk0IEwgNjA5LjU2MjUgODUuNzM0Mzc1IEMgNjEzLjk0NTMxMiA4Ni45NDE0MDYgNjE1LjgwODU5NCA4OC41NDY4NzUgNjE5LjIwNzAzMSA5MC45OTYwOTQgWiBNIDYxOS4yMDcwMzEgOTAuOTk2MDk0ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDYwOC42ODc1IDg1LjczNDM3NSBDIDYwNi45Njg3NSA4NS4zNzEwOTQgNjA0LjYzMjgxMiA4Ni4xMzY3MTkgNjAzLjQyNTc4MSA4My45ODA0NjkgQyA2MDUuMTA1NDY5IDg0LjM4MjgxMiA2MDcuNDgwNDY5IDgzLjU0Mjk2OSA2MDguNjg3NSA4NS43MzQzNzUgWiBNIDYwOC42ODc1IDg1LjczNDM3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgQyA2NjcuNjQwNjI1IDU5OS4wODU5MzggNjY3Ljk2ODc1IDU5Ny41NTA3ODEgNjY4LjI2MTcxOSA1OTYuNDE3OTY5IEwgNjY5LjA2NjQwNiA1OTYuODIwMzEyIFogTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gMTA2IDExMC4yODUxNTYgQyAxMDguMTkxNDA2IDEwNy45MTAxNTYgMTA5LjY5MTQwNiAxMDYuMzM5ODQ0IDExMi4xMzY3MTkgMTA0LjE0ODQzOCBaIE0gMTA2IDExMC4yODUxNTYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgQyA0ODcuNzA3MDMxIDc3LjUxNTYyNSA0ODYuOTQxNDA2IDc4LjM5MDYyNSA0ODYuOTc2NTYyIDc4Ljc1NzgxMiBMIDQzMS44MjQyMTkgNzguNzU3ODEyIEwgNDMwLjk0NTMxMiA3Ny4wMDM5MDYgQyA0NDkuOTAyMzQ0IDc3LjAwMzkwNiA0NjguODk4NDM4IDc2LjkyOTY4OCA0ODcuODU1NDY5IDc3LjAwMzkwNiBaIE0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNkOWIzNmEiIGQ9Ik0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4IEwgMTQ1LjQxNDA2MiAzMDcuMzkwNjI1IEwgMjI5LjUgMzA3LjM5MDYyNSBDIDIyOC4wNzQyMTkgMzIwLjY1MjM0NCAyMjkuMDIzNDM4IDMzMy45NTMxMjUgMjI4LjY2MDE1NiAzNDcuMjg5MDYyIEMgMjI1LjkxNzk2OSA0NTAuNTM1MTU2IDIxOS44MjAzMTIgNTU0LjM2NzE4OCAyMTkuODU1NDY5IDY1Ny43OTY4NzUgTCAxOTUuMzQ3NjU2IDY3My41ODIwMzEgQyAxNzIuNzM4MjgxIDY3My4yMTQ4NDQgMTU3LjUwMzkwNiA2NzMuMjUzOTA2IDEzNi42ODM1OTQgNjYzLjA1ODU5NCBaIE0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjNjI3MjdmIiBkPSJNIDM1NC43MTQ4NDQgNjczLjUwNzgxMiBDIDMyNy41NzQyMTkgNjczLjUwNzgxMiAzMDAuMzk4NDM4IDY3My41ODIwMzEgMjczLjI1NzgxMiA2NzMuNTA3ODEyIEMgMjczLjQ0MTQwNiA2NjguNDI5Njg4IDI3My4wMDM5MDYgNjYzLjI0MjE4OCAyNzMuMjU3ODEyIDY1OC4xNjQwNjIgQyAyNzMuMjk2ODc1IDY1Ny4wMzEyNSAyNzQuMTcxODc1IDY1NS44OTg0MzggMjc0LjE3MTg3NSA2NTUuNTcwMzEyIEwgMjc0LjE3MTg3NSA2MzUuNDM3NSBDIDI3NC4xNzE4NzUgNjMxLjYwMTU2MiAyNzQuODY3MTg4IDYyNS40Mjk2ODggMjc1LjA0Njg3NSA2MjAuOTcyNjU2IEMgMjc5Ljc5Njg3NSA2MjEuNTU0Njg4IDI4My40ODgyODEgNjE4LjE1NjI1IDI4Ny41NzgxMjUgNjE2LjQwNjI1IEMgMzEwLjIyMjY1NiA2MDYuODMyMDMxIDMzMy40OTIxODggNTk4Ljc5Mjk2OSAzNTcuMzc4OTA2IDU5Mi45MTQwNjIgQyAzNTYuNTAzOTA2IDYxNC4wNjY0MDYgMzU1LjUxOTUzMSA2MzUuMjU3ODEyIDM1NC43MTQ4NDQgNjU2LjM3NSBDIDM1NC40OTYwOTQgNjYyLjA3NDIxOSAzNTQuOTkzNTk0IDY2Ny44MDg1OTQgMzU0LjcxNDg0NCA2NzMuNTA3ODEyIFogTSAzNTQuNzE0ODQ0IDY3My41MDc4MTIgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM2MjcyN2YiIGQ9Ik0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5IEMgMjE5Ljg1NTQ2OSA2NjMuMDIzNDM4IDIxOS44NTU0NjkgNjY4LjI4NTE1NiAyMTkuODU1NDY5IDY3My41NDY4NzUgQyAyMTEuNzEwOTM4IDY3My41MDc4MTIgMjAzLjQ5MjE4OCA2NzMuNjkxNDA2IDE5NS4zNDc2NTYgNjczLjU0Njg3NSBaIE0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDliMzZhIiBkPSJNIDM0Mi40NzY1NjIgMzE3IEMgMzUxLjUgMzE3LjAzOTA2MiAzNjAuNTkzNzUgMzE3IDM2OS42MTcxODggMzE3IEMgMzcwLjM0NzY1NiAzMjMuMDI3MzQ0IDM2OC45OTYwOTQgMzI5LjIzODI4MSAzNjguNzQyMTg4IDMzNC45NzY1NjIgQyAzNjYgNDAwLjAwNzgxMiAzNjIuNjc1NzgxIDQ2NC45Mjk2ODggMzU5Ljk3MjY1NiA1MjkuODUxNTYyIEMgMzQyLjAzOTA2MiA1NTEuNzczNDM4IDMyMi40NjA5MzggNTcyLjY3MTg3NSAzMDEuNzUgNTkyLjA3MDMxMiBDIDI5NC41MTU2MjUgNTk4LjgzMjAzMSAyODYuNzM4MjgxIDYwNS4wNzgxMjUgMjc5LjM5NDUzMSA2MTEuNzY1NjI1IEMgMjc4LjMwMDc4MSA2MTIuNzUgMjc3LjYwNTQ2OSA2MTMuOTU3MDMxIDI3NS44OTA2MjUgNjEzLjkyMTg3NSBDIDI3OS43OTY4NzUgNTIwLjQ2NDg0NCAyODIuMDYyNSA0MjYuOTMzNTk0IDI4Ny4yODUxNTYgMzMzLjYyNSBDIDI5My43NSAzMzIuODIwMzEyIDMwMC40NzI2NTYgMzMzLjYyNSAzMDYuOTcyNjU2IDMzMi43NDYwOTQgQyAzMTguNzM0Mzc1IDMzMS4xNDA2MjUgMzI5LjQwMjM0NCAzMjYuMjQyMTg4IDMzOC40MjE4NzUgMzE5LjU1ODU5NCBDIDM0MC4yMTA5MzggMzE4LjI0MjE4OCAzNDIuOTg4MjgxIDMxOS44MTI1IDM0Mi40NDE0MDYgMzE3IFogTSAzNDIuNDc2NTYyIDMxNyAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzY4OGQ5NyIgZD0iTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSBDIDMzMy40NTcwMzEgNTk4Ljc5Mjk2OSAzMTAuMTg3NSA2MDYuODMyMDMxIDI4Ny41MzkwNjIgNjE2LjQ0MTQwNiBDIDI4My40NDkyMTkgNjE4LjE1NjI1IDI3OS43NjE3MTkgNjIxLjU5Mzc1IDI3NS4wMTE3MTkgNjIxLjAwNzgxMiBDIDI3NS4xMjEwOTQgNjE4LjQxNDA2MiAyNzUuODE2NDA2IDYxNi4wMzkwNjIgMjc1Ljg5MDYyNSA2MTMuOTkyMTg4IEMgMjc3LjYwNTQ2OSA2MTMuOTkyMTg4IDI3OC4zMzU5MzggNjEyLjgyNDIxOSAyNzkuMzk0NTMxIDYxMS44MzU5MzggQyAyODYuNjk5MjE5IDYwNS4xNTIzNDQgMjk0LjUxNTYyNSA1OTguOTA2MjUgMzAxLjc1IDU5Mi4xNDQ1MzEgQyAzMjIuNDYwOTM4IDU3Mi43ODEyNSAzNDIuMDAzOTA2IDU1MS44NDc2NTYgMzU5Ljk3MjY1NiA1MjkuOTI1NzgxIEMgMzU5LjA5NzY1NiA1NTAuODk4NDM4IDM1OC4yMTg3NSA1NzIuMTI1IDM1Ny4zNDM3NSA1OTIuOTg0Mzc1IFogTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NlYTI3MiIgZD0iTSAzNDIuNDc2NTYyIDMxNyBDIDM0My4wMjczNDQgMzE5Ljg1MTU2MiAzNDAuMjUgMzE4LjI0MjE4OCAzMzguNDYwOTM4IDMxOS41NTg1OTQgQyAzMjkuNDM3NSAzMjYuMjQ2MDk0IDMxOC43NzM0MzggMzMxLjEwMTU2MiAzMDcuMDExNzE5IDMzMi43NDYwOTQgQyAzMDAuNDcyNjU2IDMzMy42NjAxNTYgMjkzLjc4NTE1NiAzMzIuODIwMzEyIDI4Ny4zMjAzMTIgMzMzLjYyNSBDIDI4Ny42MTMyODEgMzI4LjA3MDMxMiAyODcuNzk2ODc1IDMyMi41MTU2MjUgMjg4LjE5OTIxOSAzMTYuOTY0ODQ0IEMgMzA2LjI3NzM0NCAzMTcuMDM5MDYyIDMyNC40MzM1OTQgMzE2Ljg5MDYyNSAzNDIuNTE1NjI1IDMxNi45NjQ4NDQgWiBNIDM0Mi40NzY1NjIgMzE3ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48ZyBjbGlwLXBhdGg9InVybCgjMWQ3OTU3ZGEyNykiPjxwYXRoIGZpbGw9IiMyZjVkNjQiIGQ9Ik0gNDMwLjkxMDE1NiA3Ny4wMDM5MDYgTCA0MzEuNzg1MTU2IDc4Ljc1NzgxMiBDIDM5NC40OTIxODggMTYyLjM0NzY1NiAzMjYuMTQ4NDM4IDIyOS43MTg3NSAyNDUuMjQyMTg4IDI3MS40NzY1NjIgQyAyNDAuMzQ3NjU2IDI3MS41MTU2MjUgMjM1LjM3ODkwNiAyNzEuMzMyMDMxIDIzMC40ODQzNzUgMjcxLjU4NTkzOCBDIDIyOS4yMDcwMzEgMjczLjc4MTI1IDIyOS42ODM1OTQgMjc2LjE5MTQwNiAyMjkuNSAyNzguNDU3MDMxIEMgMjI0Ljk2ODc1IDI3OS4wMzkwNjIgMjIwLjIyMjY1NiAyODEuMzQzNzUgMjE2LjM1MTU2MiAyODMuNzE4NzUgQyAyMDIuNzk2ODc1IDI4NC4zNzUgMTg5LjIxMDkzOCAyODQuNDEwMTU2IDE3NS43MzA0NjkgMjg0LjY2Nzk2OSBDIDE2Ni41MjczNDQgMjg0Ljg1MTU2MiAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTQ4Ljk1NzAzMSAyODQuMTIxMDk0IEMgMTQ2LjkxMDE1NiAyODMuMzE2NDA2IDE0MS45NDUzMTIgMjc5LjMzMjAzMSAxNDEuNTA3ODEyIDI3OS4zMzIwMzEgTCAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgQyAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgMTE0LjgwNDY4OCAyNzguMTI4OTA2IDExNC44MDQ2ODggMjc4LjAxOTUzMSBMIDExNC44MDQ2ODggMjQwLjc4OTA2MiBMIDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEMgNzcuOTg0Mzc1IDE5MS44NjcxODggNjkuNjk1MzEyIDE0OS4zNzg5MDYgMTA2IDExMC4yODUxNTYgTCAxMTIuMTM2NzE5IDEwNC4xNDg0MzggQyAxMjkuMzc4OTA2IDg4LjYyMTA5NCAxNTIuNTM1MTU2IDc5LjEyMTA5NCAxNzUuNjYwMTU2IDc3LjAwMzkwNiBDIDI2MC43NjU2MjUgNzcuMDc0MjE5IDM0NS44NzUgNzYuODU1NDY5IDQzMC45NDUzMTIgNzcuMDAzOTA2IFogTSA0MzAuOTEwMTU2IDc3LjAwMzkwNiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gNDg2Ljk3NjU2MiA3OC43NTc4MTIgQyA0ODcuMjM0Mzc1IDgzLjI4NTE1NiA0OTEuNjkxNDA2IDkzLjk5MjE4OCA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTguMTIxMDk0IDEzMS4yMjI2NTYgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNTAwLjcxMDkzOCAxNjUuNDE3OTY5IDUwMC4zNDc2NTYgMTg1LjI1NzgxMiA0OTkuMjE0ODQ0IDIwNC44NzUgQyA0NjguODk4NDM4IDIwNS4zODY3MTkgMzkzLjY1MjM0NCAyMTUuMzU5Mzc1IDM5MS40NjA5MzggMjU2LjA5NzY1NiBDIDM5MS4yMDMxMjUgMjYxLjE3NTc4MSAzOTMuOTgwNDY5IDI3OS44MDg1OTQgMzkxLjk3MjY1NiAyODIuODc4OTA2IEMgMzkxLjQyMTg3NSAyODMuNzE4NzUgMzg4LjYwOTM3NSAyODQuMzc1IDM4Ny40ODA0NjkgMjg0LjUxOTUzMSBDIDM4NC42Njc5NjkgMjg0Ljg4NjcxOSAzNzMuMDUwNzgxIDI4NC42Njc5NjkgMzcxLjQ4MDQ2OSAyODUuNjE3MTg4IEMgMzY5LjkxMDE1NiAyODYuNTY2NDA2IDM3MS41ODk4NDQgMjkzLjMyNDIxOSAzNjkuMDMxMjUgMjk0LjEyODkwNiBMIDI3MC4zMDA3ODEgMjk0LjMxMjUgTCAyNjUuNDQxNDA2IDI3MS44Nzg5MDYgQyAyNjQuMjczNDM4IDI3MS4wMzkwNjIgMjQ4LjMxMjUgMjcxLjQ3NjU2MiAyNDUuMjQyMTg4IDI3MS41MTU2MjUgQyAzMjYuMTQ4NDM4IDIyOS43OTI5NjkgMzk0LjQ5MjE4OCAxNjIuMzg2NzE5IDQzMS43ODUxNTYgNzguNzkyOTY5IEwgNDg2Ljk0MTQwNiA3OC43OTI5NjkgWiBNIDQ4Ni45NzY1NjIgNzguNzU3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDViNDcxIiBkPSJNIDQ5My45OTIxODggMjQ1LjE3MTg3NSBDIDQ4OC4xMDkzNzUgMjg2Ljg5NDUzMSA0NzYuMzg2NzE5IDMyOC45NDkyMTkgNDYwLjI3NzM0NCAzNjcuNzg1MTU2IEMgNDU4LjMwNDY4OCAzNzIuNTcwMzEyIDQ0NC45NzI2NTYgMzk5LjI0MjE4OCA0NDQuOTcyNjU2IDQwMS4wNjY0MDYgTCA0NDQuMDk3NjU2IDQwMS4wNjY0MDYgQyA0NDQuMTY3OTY5IDM1Ny4xMTcxODggNDQ0LjA5NzY1NiAzMTMuMTY0MDYyIDQ0NC4wOTc2NTYgMjY5LjIxNDg0NCBDIDQ0NS4xMTcxODggMjQ2LjgxNjQwNiA0NzcuMzcxMDk0IDI0Ni4xOTUzMTIgNDk0LjAyNzM0NCAyNDUuMTcxODc1IFogTSA0OTMuOTkyMTg4IDI0NS4xNzE4NzUgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxnIGNsaXAtcGF0aD0idXJsKCNiZjJiZjZkNThjKSI+PHBhdGggZmlsbD0iIzY3OGY5YSIgZD0iTSA0ODcuODU1NDY5IDc3LjAwMzkwNiBDIDUxNS45NDUzMTIgNzcuMDc0MjE5IDU0Ny4zNTkzNzUgNzUuMTc1NzgxIDU3NC45NzI2NTYgNzcuMDAzOTA2IEMgNTg2LjkxNzk2OSA3Ny44MDg1OTQgNTkzLjQxNzk2OSA4MS42MDU0NjkgNjAzLjQyNTc4MSA4NC4wMTk1MzEgQyA2MDQuNjMyODEyIDg2LjE3MTg3NSA2MDYuOTY4NzUgODUuNDA2MjUgNjA4LjY4NzUgODUuNzY5NTMxIEMgNjA4Ljk4MDQ2OSA4NS44NDM3NSA2MDkuMzA4NTk0IDg1LjY5OTIxOSA2MDkuNTYyNSA4NS43Njk1MzEgTCA2MTQuMTY0MDYyIDg5LjUzNTE1NiBMIDYxOS4yMDcwMzEgOTEuMDMxMjUgQyA2MTkuNTM1MTU2IDkxLjI1IDYxOS43NTM5MDYgOTEuNjkxNDA2IDYyMC4wODIwMzEgOTEuOTEwMTU2IEMgNjI5LjcyNjU2MiA5OC42MzI4MTIgNjQwLjMyMDMxMiAxMDYuMDg1OTM4IDY0Ni43MTA5MzggMTE1LjYyMTA5NCBMIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBDIDY2Mi45NjQ4NDQgMTM1Ljk2ODc1IDY3MS40NzY1NjIgMTU1Ljg4MjgxMiA2NzIuNjQ0NTMxIDE3NC42NjAxNTYgTCA2NzIuNjQ0NTMxIDU3NS4wNDY4NzUgQyA2NzIuNDI1NzgxIDU4Mi42NDQ1MzEgNjcwLjEyNSA1ODkuNDA2MjUgNjY4LjIyNjU2MiA1OTYuNDU3MDMxIEMgNjY3LjkzMzU5NCA1OTcuNTg5ODQ0IDY2Ny42MDU0NjkgNTk5LjEyNSA2NjcuMzQ3NjU2IDU5OS45NjQ4NDQgQyA2NjcuMjc3MzQ0IDYwMC4yMTg3NSA2NjcuNDIxODc1IDYwMC41ODU5MzggNjY3LjM0NzY1NiA2MDAuODM5ODQ0IEMgNjY0LjkzNzUgNjAwLjMyODEyNSA2NjUuNzA3MDMxIDYwMi4wODIwMzEgNjY1LjE5NTMxMiA2MDMuNDMzNTk0IEMgNjYzLjM2NzE4OCA2MDguMjU3ODEyIDY2MS41MDM5MDYgNjEyLjc4OTA2MiA2NjAuMzM1OTM4IDYxNi41ODU5MzggQyA2NjAuMDQyOTY5IDYxNy41IDY1OS43ODkwNjIgNjE4LjMwNDY4OCA2NTkuNDU3MDMxIDYxOS4yMTg3NSBDIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1Ny4yMzA0NjkgNjIwLjU3MDMxMiA2NTYuNDI1NzgxIDYyMS45MjE4NzUgQyA2NTAuNjU2MjUgNjMxLjM4MjgxMiA2NDIuNTQ2ODc1IDYzOS40MjE4NzUgNjM0LjU0Njg3NSA2NDcuMjc3MzQ0IEwgNjE4LjMyODEyNSA2NjAuMzk0NTMxIEwgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY1OC42NDA2MjUgQyA2MTguOTE0MDYyIDY1Ny43MjY1NjIgNjE4LjMyODEyNSA2NTUuMzEyNSA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTkuOTM3NSA1MjQuMTUyMzQ0IDYxNy44MTY0MDYgMzkzLjgzMjAzMSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MDguODMyMDMxIDIxMC4yODEyNSA1NDMuNTkzNzUgMjA0LjEwOTM3NSA0OTkuMjE0ODQ0IDIwNC44NzUgQyA1MDAuMzQ3NjU2IDE4NS4yMTg3NSA1MDAuNzEwOTM4IDE2NS40MTc5NjkgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNDk4LjExNzE4OCAxMzEuMjIyNjU2IDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5MS42NTIzNDQgOTMuOTkyMTg4IDQ4Ny4yMzQzNzUgODMuMjg1MTU2IDQ4Ni45NzY1NjIgNzguNzU3ODEyIEMgNDg2Ljk3NjU2MiA3OC4zOTA2MjUgNDg3LjcwNzAzMSA3Ny41MTU2MjUgNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgWiBNIDQ4Ny44NTU0NjkgNzcuMDAzOTA2ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PHBhdGggZmlsbD0iIzY2OGU5YSIgZD0iTSA1NjQuOTI1NzgxIDY3My41MDc4MTIgQyA1NDQuNTgyMDMxIDY3NC4xMjg5MDYgNTIzLjk4MDQ2OSA2NzMuNDMzNTk0IDUwMy42MzI4MTIgNjczLjUwNzgxMiBDIDQ5OC4zMzk4NDQgNjU5Ljc3MzQzOCA0OTAuNjMyODEyIDY0NC41MzUxNTYgNDgxLjcxODc1IDYzMi44MDg1OTQgQyA0NzUuMjUzOTA2IDYyNC4yNTc4MTIgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ0NS44MTI1IDYwMC44MDQ2ODggQyA0NDYuNTQyOTY5IDUzNS4yNjE3MTkgNDQ0Ljc4OTA2MiA0NjkuNjA1NDY5IDQ0NS44ODY3MTkgNDA0LjA2MjUgQyA0NDUuODg2NzE5IDQwMi40NTcwMzEgNDQ0LjkzNzUgNDAxLjI1IDQ0NC45Mzc1IDQwMS4xMDU0NjkgQyA0NDQuOTM3NSAzOTkuMjc3MzQ0IDQ1OC4yNjk1MzEgMzcyLjYwNTQ2OSA0NjAuMjQyMTg4IDM2Ny44MjAzMTIgQyA0NzYuMzQ3NjU2IDMyOC45ODQzNzUgNDg4LjA3NDIxOSAyODYuODk0NTMxIDQ5My45NTMxMjUgMjQ1LjIxMDkzOCBDIDUwOS4xNDg0MzggMjQ0LjI2MTcxOSA1MjMuNjg3NSAyNDQuNTg5ODQ0IDUzOC43NzM0MzggMjQ4LjEzMjgxMiBDIDU1MC43OTI5NjkgMjUwLjk0NTMxMiA1NjMuMTcxODc1IDI1NS40MDIzNDQgNTY0Ljc4MTI1IDI2OS4zOTQ1MzEgTCA1NjQuODkwNjI1IDY3My41NDY4NzUgWiBNIDU2NC45MjU3ODEgNjczLjUwNzgxMiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzYxNzI3ZSIgZD0iTSA0NDUuODEyNSA2MDAuODA0Njg4IEMgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ3NS4yMTQ4NDQgNjI0LjI1NzgxMiA0ODEuNzE4NzUgNjMyLjgwODU5NCBDIDQ5MC42MzI4MTIgNjQ0LjU3NDIxOSA0OTguMzM5ODQ0IDY1OS43Njk1MzEgNTAzLjYzMjgxMiA2NzMuNTA3ODEyIEMgNTAyLjQ2NDg0NCA2NzMuNTA3ODEyIDUwMS4yOTY4NzUgNjczLjUwNzgxMiA1MDAuMTI4OTA2IDY3My41MDc4MTIgTCA0NTQuNTc4MTI1IDY3My41MDc4MTIgQyA0NTEuMzYzMjgxIDY3My41MDc4MTIgNDQ4LjE0ODQzOCA2NzMuNTA3ODEyIDQ0NC45Mzc1IDY3My41MDc4MTIgQyA0NDMuNDAyMzQ0IDY0OS4zOTQ1MzEgNDQ0LjA5Mzc1IDYyNS4wMjczNDQgNDQ0LjA1ODU5NCA2MDAuODA0Njg4IEMgNDQ0LjYwNTQ2OSA2MDAuOTE0MDYyIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NS44MTI1IDYwMC44MDQ2ODggWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM1YTg1OTIiIGQ9Ik0gNjE3LjQ1MzEyNSA2NTguNjQwNjI1IEMgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNi41NzgxMjUgNjQ3LjIzODI4MSA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgTCA2MTYuNTc4MTI1IDI3My42MzI4MTIgQyA2MTYuNTc4MTI1IDI3MS42OTkyMTkgNjE4LjM2NzE4OCAyNjcuMzEyNSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MTcuODU1NDY5IDM5My44MzIwMzEgNjE5LjkzNzUgNTI0LjE1MjM0NCA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTguMzI4MTI1IDY1NS4zMTI1IDYxOC44Nzg5MDYgNjU3LjcyNjU2MiA2MTcuNDUzMTI1IDY1OC42NDA2MjUgWiBNIDYxNy40NTMxMjUgNjU4LjY0MDYyNSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI2IwMTMzYzExNzMpIj48cGF0aCBmaWxsPSIjZmVmZWZlIiBkPSJNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSBDIDU0My41NTg1OTQgMjA0LjEwOTM3NSA2MDguODMyMDMxIDIxMC4zMjAzMTIgNjE3LjQ1MzEyNSAyNjQuNDI1NzgxIEMgNjE4LjM2NzE4OCAyNjcuMjc3MzQ0IDYxNi41NzgxMjUgMjcxLjY5OTIxOSA2MTYuNTc4MTI1IDI3My42MzI4MTIgTCA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgQyA2MTYuNTc4MTI1IDY0Ny4yMzgyODEgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNy40NTMxMjUgNjU4LjY0MDYyNSBDIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY2MC4zMjAzMTIgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE2LjEwMTU2MiA2NjMuNDI1NzgxIDU5OC4zODY3MTkgNjY5LjEyNSA1OTQuMzY3MTg4IDY3MC4xNDg0MzggQyA1ODQuMzI0MjE5IDY3Mi42MzI4MTIgNTc1LjIyNjU2MiA2NzMuMjE0ODQ0IDU2NC45MjU3ODEgNjczLjU0Njg3NSBMIDU2NC44MTY0MDYgMjY5LjM5NDUzMSBDIDU2My4yMTA5MzggMjU1LjQwMjM0NCA1NTAuNzkyOTY5IDI1MC45MTAxNTYgNTM4LjgwODU5NCAyNDguMTMyODEyIEMgNTIzLjcyMjY1NiAyNDQuNjI1IDUwOS4xODc1IDI0NC4yNTc4MTIgNDkzLjk5MjE4OCAyNDUuMjEwOTM4IEMgNDc3LjMzNTkzOCAyNDYuMjY5NTMxIDQ0NS4wNDY4NzUgMjQ2Ljg1NTQ2OSA0NDQuMDU4NTk0IDI2OS4yNSBDIDQ0NC4wNTg1OTQgMzEzLjE5OTIxOSA0NDQuMTMyODEyIDM1Ny4xODc1IDQ0NC4wNTg1OTQgNDAxLjEwNTQ2OSBDIDQ0My45ODQzNzUgNDY3LjY3MTg3NSA0NDMuOTQ5MjE5IDUzNC4yNzM0MzggNDQ0LjA1ODU5NCA2MDAuODM5ODQ0IEMgNDQ0LjA1ODU5NCA2MjUuMDYyNSA0NDMuNDAyMzQ0IDY0OS40MzM1OTQgNDQ0LjkzNzUgNjczLjU0Njg3NSBDIDQxNC44NzUgNjczLjU4MjAzMSAzODQuNzc3MzQ0IDY3My41NDY4NzUgMzU0LjcxNDg0NCA2NzMuNTQ2ODc1IEMgMzU0Ljg5ODQzOCA2NjcuODgyODEyIDM1NC40NTcwMzEgNjYyLjEwOTM3NSAzNTQuNzE0ODQ0IDY1Ni40MTAxNTYgQyAzNTUuNTE5NTMxIDYzNS4yOTI5NjkgMzU2LjUwMzkwNiA2MTQuMDY2NDA2IDM1Ny4zNzg5MDYgNTkyLjk0OTIxOSBDIDM1OC4yNTc4MTIgNTcxLjgzMjAzMSAzNTkuMTMyODEyIDU1MC44NTkzNzUgMzYwLjAxMTcxOSA1MjkuODkwNjI1IEMgMzYyLjcxNDg0NCA0NjQuOTI5Njg4IDM2Ni4wMzkwNjIgNDAwLjAwNzgxMiAzNjguNzc3MzQ0IDMzNS4wMTE3MTkgQyAzNjkuMDMxMjUgMzI5LjI3NzM0NCAzNzAuMzgyODEyIDMyMy4wNjY0MDYgMzY5LjY1MjM0NCAzMTcuMDM5MDYyIEMgMzYwLjYzMjgxMiAzMTcuMDM5MDYyIDM1MS41MzUxNTYgMzE3LjA3NDIxOSAzNDIuNTE1NjI1IDMxNy4wMzkwNjIgQyAzMjQuNDMzNTk0IDMxNi45MjU3ODEgMzA2LjMxNjQwNiAzMTcuMTA5Mzc1IDI4OC4xOTkyMTkgMzE3LjAzOTA2MiBDIDI4Ny43OTY4NzUgMzIyLjU1NDY4OCAyODcuNjUyMzQ0IDMyOC4xNDQ1MzEgMjg3LjMyMDMxMiAzMzMuNjk1MzEyIEMgMjgyLjA5NzY1NiA0MjcuMDA3ODEyIDI3OS44MzIwMzEgNTIwLjUzNTE1NiAyNzUuOTI1NzgxIDYxMy45OTIxODggQyAyNzUuODUxNTYyIDYxNi4wMDM5MDYgMjc1LjE2MDE1NiA2MTguNDE0MDYyIDI3NS4wNDY4NzUgNjIxLjAwNzgxMiBDIDI3NC44NjcxODggNjI1LjQ2NDg0NCAyNzQuMTcxODc1IDYzMS42NDA2MjUgMjc0LjE3MTg3NSA2MzUuNDc2NTYyIEwgMjc0LjE3MTg3NSA2NTUuNjA1NDY5IEMgMjc0LjE3MTg3NSA2NTUuOTMzNTk0IDI3My4yOTY4NzUgNjU3LjA2NjQwNiAyNzMuMjU3ODEyIDY1OC4xOTkyMTkgQyAyNzMuMDM5MDYyIDY2My4zMTY0MDYgMjczLjQ3NjU2MiA2NjguNDY0ODQ0IDI3My4yNTc4MTIgNjczLjU0Njg3NSBDIDI1NS40Njg3NSA2NzMuNTA3ODEyIDIzNy42NDQ1MzEgNjczLjY1NjI1IDIxOS44MjAzMTIgNjczLjU0Njg3NSBDIDIxOS44MjAzMTIgNjY4LjI4NTE1NiAyMTkuODIwMzEyIDY2My4wMjM0MzggMjE5LjgyMDMxMiA2NTcuNzYxNzE5IEMgMjE5Ljc4NTE1NiA1NTQuMzY3MTg4IDIyNS44ODI4MTIgNDUwLjUzNTE1NiAyMjguNjIxMDk0IDM0Ny4yNSBDIDIyOC45ODgyODEgMzMzLjk1MzEyNSAyMjguMDM5MDYyIDMyMC42MTcxODggMjI5LjQ2NDg0NCAzMDcuMzU1NDY5IEwgMTQ1LjM3ODkwNiAzMDcuMzU1NDY5IEwgMTM2LjYwOTM3NSA2NjIuOTg4MjgxIEMgMTA1LjU2MjUgNjQ3Ljc4OTA2MiA4My45NzY1NjIgNjE3LjkwMjM0NCA3OC44OTg0MzggNTgzLjU5NzY1NiBDIDc3LjE4MzU5NCA0NjkuNDk2MDk0IDc3Ljk0OTIxOSAzNTUuMDM1MTU2IDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIEMgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIDExNS45NzI2NTYgMjc5LjMzMjAzMSAxMTYuMDgyMDMxIDI3OS4zMzIwMzEgTCAxNDEuNDY4NzUgMjc5LjMzMjAzMSBDIDE0MS45MDYyNSAyNzkuMzMyMDMxIDE0Ni44NzUgMjgzLjM1MTU2MiAxNDguOTIxODc1IDI4NC4xMjEwOTQgQyAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTY2LjQ5MjE4OCAyODQuODUxNTYyIDE3NS42OTUzMTIgMjg0LjY2Nzk2OSBDIDE4OS4xNzE4NzUgMjg0LjQxMDE1NiAyMDIuNzk2ODc1IDI4NC4zNzUgMjE2LjMxMjUgMjgzLjcxODc1IEMgMjE2LjQyMTg3NSAyODMuNzE4NzUgMjE2LjUzMTI1IDI4NC44MTI1IDIxOC40Njg3NSAyODQuNjY3OTY5IEMgMjIwLjI1NzgxMiAyODQuNTU4NTk0IDIyNi45MDYyNSAyODMuOTM3NSAyMjggMjgzLjYwOTM3NSBDIDIzMC4xMjEwOTQgMjgyLjkxNDA2MiAyMjkuMjgxMjUgMjgwLjE3MTg3NSAyMjkuNDI1NzgxIDI3OC40NTcwMzEgQyAyMjkuNjQ0NTMxIDI3Ni4xNTYyNSAyMjkuMTMyODEyIDI3My43ODEyNSAyMzAuNDE0MDYyIDI3MS41ODU5MzggQyAyMzUuMzA4NTk0IDI3MS4yOTY4NzUgMjQwLjI3MzQzOCAyNzEuNTE1NjI1IDI0NS4xNjc5NjkgMjcxLjQ3NjU2MiBDIDI0OC4yMzgyODEgMjcxLjQ3NjU2MiAyNjQuMTk5MjE5IDI3MS4wMDM5MDYgMjY1LjM2NzE4OCAyNzEuODQzNzUgTCAyNzAuMjI2NTYyIDI5NC4yNzczNDQgTCAzNjguOTYwOTM4IDI5NC4wOTM3NSBDIDM3MS40ODA0NjkgMjkzLjI4OTA2MiAzNjkuODAwNzgxIDI4Ni41MzEyNSAzNzEuNDA2MjUgMjg1LjU4MjAzMSBDIDM3My4wMTU2MjUgMjg0LjYyODkwNiAzODQuNTkzNzUgMjg0Ljg1MTU2MiAzODcuNDA2MjUgMjg0LjQ4NDM3NSBDIDM4OC41MzkwNjIgMjg0LjMzOTg0NCAzOTEuMzUxNTYyIDI4My43MTg3NSAzOTEuODk4NDM4IDI4Mi44Mzk4NDQgQyAzOTMuOTA2MjUgMjc5Ljc3MzQzOCAzOTEuMTMyODEyIDI2MS4xNDA2MjUgMzkxLjM4NjcxOSAyNTYuMDU4NTk0IEMgMzkzLjU3ODEyNSAyMTUuMzU5Mzc1IDQ2OC44MjQyMTkgMjA1LjM1MTU2MiA0OTkuMTQwNjI1IDIwNC44Mzk4NDQgWiBNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiM1NDgyOGYiIGQ9Ik0gNDQ1LjgxMjUgNjAwLjgwNDY4OCBDIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NC42MDU0NjkgNjAwLjkxNDA2MiA0NDQuMDU4NTk0IDYwMC44MDQ2ODggQyA0NDMuOTQ5MjE5IDUzNC4yMzgyODEgNDQzLjk4NDM3NSA0NjcuNjMyODEyIDQ0NC4wNTg1OTQgNDAxLjA2NjQwNiBMIDQ0NC45Mzc1IDQwMS4wNjY0MDYgQyA0NDQuOTM3NSA0MDEuMDY2NDA2IDQ0NS44ODY3MTkgNDAyLjQxNzk2OSA0NDUuODg2NzE5IDQwNC4wMjczNDQgQyA0NDQuNzg5MDYyIDQ2OS41NzAzMTIgNDQ2LjU3ODEyNSA1MzUuMjIyNjU2IDQ0NS44MTI1IDYwMC43NjU2MjUgWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gMjI5LjUgMjc4LjQ1NzAzMSBDIDIyOS4zNTE1NjIgMjgwLjE3MTg3NSAyMzAuMTk1MzEyIDI4Mi45MTQwNjIgMjI4LjA3NDIxOSAyODMuNjA5Mzc1IEMgMjI2Ljk4MDQ2OSAyODMuOTcyNjU2IDIyMC4zMzIwMzEgMjg0LjU1ODU5NCAyMTguNTQyOTY5IDI4NC42Njc5NjkgQyAyMTYuNjA1NDY5IDI4NC44MTI1IDIxNi40OTYwOTQgMjgzLjcxODc1IDIxNi4zODY3MTkgMjgzLjcxODc1IEMgMjIwLjI1NzgxMiAyODEuMzQzNzUgMjI1LjAwNzgxMiAyNzkuMDQyOTY5IDIyOS41MzUxNTYgMjc4LjQ1NzAzMSBaIE0gMjI5LjUgMjc4LjQ1NzAzMSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+";

const LogoImage = ({ className = "" }) => (
  <img
    src={LOGO_SRC}
    alt="中文研究室 LOGO"
    className={`object-cover bg-white ${className}`}
  />
);

/* ==================== 共用元件 ==================== */

const ThemedButton = ({ active, children, onClick, className = "", darkBg = false }) => (
  <button
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium font-sans spring-transition ${className}`}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.42)",
      transition: "color 200ms ease",
      fontFamily: "'Noto Sans TC', sans-serif",
      fontSize: "0.85rem",
      letterSpacing: "0.05em",
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.42)"; }}
  >
    {children}
    {active && <span style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"1.2rem", height:"2px", background:"#c8a84b", borderRadius:"9999px", display:"block" }} />}
  </button>
);

export const PageHeader = ({ title, count, unit = "筆", sectionNumber, sectionLabel }) => (
  <div style={{ paddingBottom: "3rem" }}>
    {(sectionNumber || sectionLabel) && (
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
        {sectionNumber && <span className="ed-label">{sectionNumber}</span>}
        {sectionLabel && <span className="ed-label">{sectionLabel}</span>}
      </div>
    )}
    <h2 className="ed-heading" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginBottom: count != null ? "0.5rem" : 0 }}>{title}</h2>
    {count != null && (
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#a8a29e", fontWeight: 400, textTransform: "uppercase" }}>
        {count} {unit}
      </p>
    )}
  </div>
);

export const BlockRenderer = ({ block, index, articleId }) => {
  if (!block) return null;

  switch (block.type) {
    case "heading":
      return (
        <h4 id={`article-${articleId}-heading-${index}`} className="text-xl md:text-2xl font-bold theme-heading mt-10 mb-5 flex items-center gap-3" style={{ scrollMarginTop: "120px" }}>
          <span style={{ width: "5px", height: "1.2em", background: "var(--c-accent)", borderRadius: "4px" }}></span>
          {block.text}
        </h4>
      );

    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-xl border glass-panel shadow-sm font-sans">
          <table className="w-full text-left border-collapse min-w-[500px]">
            {block.caption && (
              <caption className="py-3 px-4 text-sm font-bold theme-heading bg-white/50 border-b border-white/60">
                {block.caption}
              </caption>
            )}
            <thead className="bg-white/40 theme-heading text-sm border-b border-white/40">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="py-3 px-5 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y theme-text-secondary text-sm border-white/30">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover-bg-surface transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3 px-5">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "quote":
      return (
        <blockquote className="my-8 pl-5 py-4 border-l-4 font-kai leading-relaxed theme-text-secondary bg-white/40 rounded-r-xl shadow-sm" style={{ borderColor: "var(--c-accent)" }}>
          {block.text}
        </blockquote>
      );

    case "para":
      return (
        <p className="leading-relaxed theme-text-secondary mb-4" style={{ textIndent: "2em" }}>
          {block.text}
        </p>
      );

    case "list":
      return (
        <ul className="space-y-3 my-6 px-4 md:px-8 theme-text-secondary">
          {(block.items || []).map((item, idx) => (
            <li key={idx} className="leading-relaxed relative pl-6">
              <span className="absolute left-0 top-2.5 w-2 h-2 rounded-full" style={{ background: "var(--c-accent)", opacity: 0.8 }}></span>
              {item}
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
};

const BackToTopButton = ({ isDarkMode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="回到頂部"
      title="回到頂部"
      className="spring-transition"
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "5rem",
        zIndex: 120,
        width: "3rem",
        height: "3rem",
        borderRadius: "9999px",
        border: "1px solid rgba(29,27,25,0.12)",
        background: "rgba(254,248,244,0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        color: "#1d1b19",
        boxShadow: "0 4px 16px rgba(29,27,25,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 250ms ease, transform 250ms ease, background 300ms ease",
      }}
    >
      <Icon name="ChevronUp" size={20} />
    </button>
  );
};

export const ReadingProgress = ({ targetRef, color, isDarkMode }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      
      const offsetTop = 80;
      const scrollableHeight = rect.height - window.innerHeight + offsetTop;
      
      if (scrollableHeight <= 0) {
        setProgress(0);
        return;
      }
      
      const scrolled = offsetTop - rect.top;
      let currentProgress = (scrolled / scrollableHeight) * 100;
      
      currentProgress = Math.max(0, Math.min(100, currentProgress));
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    const timer = setTimeout(handleScroll, 500);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[9999] backdrop-blur-sm" style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', pointerEvents: 'none' }}>
      <div 
        className="h-full shadow-sm"
        style={{ 
          width: `${progress}%`, 
          backgroundColor: color,
          transition: 'width 100ms ease-out'
        }}
      />
    </div>
  );
};


/* ==================== 主應用程式 ==================== */

export default function App() {

  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const isDarkMode = false;
  const [nativeCategory, setNativeCategory] = useState("lecture");
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splashVisible, setSplashVisible] = useState(isAppMode);
  const [splashExiting, setSplashExiting] = useState(false);
  const PREF_KEY = "csl_native_prefs_v1";
  const [launchOnboarding, setLaunchOnboarding] = useState(false);
  const [launchOnboardingExiting, setLaunchOnboardingExiting] = useState(false);
  const [launchOnboardingSelected, setLaunchOnboardingSelected] = useState([]);

  /* ── Navbar scroll shrink ── */
  useEffect(() => {
    if (isAppMode) return;
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Scroll reveal (IntersectionObserver) ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); } }),
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
      const main = document.querySelector("main");
      if (!main) return;
      main.querySelectorAll("h2:not(.no-reveal), h3:not(.no-reveal), h4:not(.no-reveal), article, .rev").forEach((el, i) => {
        el.classList.add("reveal");
        if (i % 3 === 1) el.classList.add("reveal-d1");
        if (i % 3 === 2) el.classList.add("reveal-d2");
        observer.observe(el);
      });
      return () => observer.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [currentPage]);

  /* Native 啟動動畫：1.9s 顯示，再 500ms 淡出，共 2.4s */
  /* Native：body 加深色背景，防止 iOS overscroll 白邊 */
  useEffect(() => {
    if (isAppMode) {
      document.body.classList.add("is-native");
      document.documentElement.classList.add("is-native");
    }
  }, []);

  useEffect(() => {
    if (!isAppMode) return;
    // 動畫時間軸：logo 1s、名稱 1.4s、標語 1.8s
    // 2600ms：動畫全部完成後再停留 800ms
    // 3200ms：500ms 淡出後隱藏並進入下一步
    const t1 = setTimeout(() => setSplashExiting(true), 2600);
    const t2 = setTimeout(() => {
      setSplashVisible(false);
      /* 第一次開啟才顯示偏好設定 */
      if (!localStorage.getItem(PREF_KEY)) setLaunchOnboarding(true);
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const saveLaunchPrefs = (selected) => {
    localStorage.setItem(PREF_KEY, JSON.stringify(selected));
    window.dispatchEvent(new Event("launchPrefsReady"));
    setLaunchOnboardingExiting(true);
    setTimeout(() => setLaunchOnboarding(false), 450);
  };

  useEffect(() => {
    const CDN = `https://6c1fauax.apicdn.sanity.io/v2024-01-01/data/query/production`;

    /* Native：用 CapacitorHttp（原生 NSURLSession，不受 CORS 限制）
       Web：用 fetch（CORS 由 Sanity CDN 處理）*/
    const sf = async (q) => {
      const url = `${CDN}?query=${encodeURIComponent(q)}`;
      if (isNative) {
        const res = await CapacitorHttp.get({ url });
        return res.data?.result || [];
      }
      return fetch(url).then(r => r.json()).then(j => j.result || []);
    };

    const fetchAllData = async () => {
      try {
        const [articlesData, eventsData, activitiesData] = await Promise.all([
          sf(`*[_type == "article" && category != "讀書會紀錄"] | order(date desc) {_id, title, author, affiliation, contact, date, category, tags, summary, blocks}`),
          sf(`*[_type == "event"] | order(date desc) {_id, title, date, type, status, summary, details, location, topic, papers}`),
          sf(`*[_type == "promoEvent"] | order(_createdAt desc) {_id, title, category, date, speaker, location, organizer, link, coverImage{asset->{_id,url},alt}}`),
        ]);
        setArticles(articlesData || []);
        setEvents(eventsData || []);
        setActivities(activitiesData || []);
      } catch (err) {
        console.error("Sanity fetch 失敗:", err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const allNavItems = [
    { id: "home", label: "首頁", icon: <Icon name="Home" size={18} /> },
    { id: "about", label: "關於讀書會", icon: <Icon name="Info" size={18} /> },
    { id: "books", label: "資源分享", icon: <Icon name="Library" size={18} /> },
    { id: "events", label: "研討進度", icon: <Icon name="Calendar" size={18} /> },
    { id: "activities", label: "近期活動", icon: <Icon name="Megaphone" size={18} /> },
    { id: "articles", label: "文章專欄", icon: <Icon name="BookOpen" size={18} /> },
    { id: "submission", label: "投稿須知", icon: <Icon name="Send" size={18} /> },
  ];
  const appOnlyIds = new Set(["home"]);
  const navItems = isAppMode ? allNavItems.filter(n => appOnlyIds.has(n.id)) : allNavItems;

  const go = (id) => { setCurrentPage(id); setMobileOpen(false); };

  /* Tab 計數（native 導覽列 badge 用）*/
  const _getEndDate = (d) => {
    if (!d) return new Date(0);
    const t = d.trim();
    if (t.includes("～") || t.includes("~")) {
      const pts = t.split(/[～~]/);
      return new Date(`${pts[pts.length-1].trim()}T23:59:59`);
    }
    const [dp, tp] = t.split(" ");
    if (!dp) return new Date(0);
    if (tp?.includes("-")) return new Date(`${dp}T${tp.split("-")[1]}:00`);
    return new Date(`${dp}T23:59:59`);
  };
  const _now = new Date();
  const _upcoming = activities.filter(a => _getEndDate(a.date) >= _now);
  const catCounts = {
    lecture:    _upcoming.filter(a => a.category === "學術講座").length,
    workshop:   _upcoming.filter(a => a.category === "研討會／工作坊" || a.category === "研討會/工作坊").length,
    submission: _upcoming.filter(a => a.category === "徵稿資訊").length,
  };

const pageProps = {
  setPage: setCurrentPage,
  isDarkMode,
  isNative: isAppMode,
  nativeCategory,
  setNativeCategory,
  articles,
  events,
  activities,
  loading,
};


  const page = (() => {
    switch (currentPage) {
      case "home": return <HomePage {...pageProps} />;
      case "about": return <AboutPage {...pageProps} />;
      case "books": return <BooksPage {...pageProps} />;
      case "events": return <EventsPage {...pageProps} />;
      case "activities": return <ActivitiesPage {...pageProps} />;
      case "articles": return <ArticlesPage {...pageProps} />;
      case "submission": return <SubmissionPage {...pageProps} />;
      default: return <HomePage {...pageProps} />;
    }
  })();


  return (
    <div style={{
      "--bg": "#fef8f4",
      "--ink": "#1d1b19",
      "--brand": "#b01f45",
      "--brand-soft": "#ed4f6f",
      "--brand-dim": "rgba(176,31,69,0.08)",
      "--muted": "#78716c",
      "--border": "rgba(29,27,25,0.08)",
      "--surface": "#ffffff",
      "--accent": "#b01f45",
      "--accent-dim": "rgba(176,31,69,0.08)",
      "--r": "0.75rem",
      "--r-lg": "1rem",
      "--c-accent": "#b01f45",
      "--c-text": "#1d1b19",
      "--c-text-secondary": "#78716c",
      "--c-primary": "#b01f45",
      "--c-border-rgb": "29,27,25",
      "--c-panel-rgb": "255,255,255",
      "--c-badge-bg": "rgba(176,31,69,0.08)",
      "--c-badge-text": "#b01f45",
      "--c-badge-border": "rgba(176,31,69,0.2)",
      background: "#fef8f4",
      color: "#1d1b19",
      fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { 0% { opacity:0; transform:translateY(10px);} 100% { opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.45s ease-out both; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .native-btn { -webkit-tap-highlight-color:transparent; transition:transform 130ms ease,opacity 130ms ease !important; }
        .native-btn:active { transform:scale(0.94) !important; opacity:0.78 !important; }
        @keyframes splashLogoIn { 0%{opacity:0;transform:scale(0.55)} 60%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        @keyframes splashTextIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes splashTagIn { 0%{opacity:0;letter-spacing:0.3em} 100%{opacity:1;letter-spacing:0.14em} }
        @keyframes bounceY { 0%,100%{transform:translateY(0)} 45%{transform:translateY(6px)} 65%{transform:translateY(2px)} }
        .bounce-y { animation:bounceY 1.9s ease-in-out infinite; }
        @keyframes listItemIn { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        .list-item-in { animation:listItemIn 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes sheetSlideUp { 0%{transform:translateY(100%)} 100%{transform:translateY(0)} }
        @keyframes backdropIn { 0%{opacity:0} 100%{opacity:1} }
        .spring-transition { transition: all 220ms cubic-bezier(0.34,1.56,0.64,1) !important; }

        body { background: #fef8f4; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Noto Serif TC', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }

        /* ── 頁面切換淡入 ── */
        @keyframes pageIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-enter { animation: pageIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── 滾動顯現 ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.08s; }
        .reveal-d2 { transition-delay: 0.16s; }
        .reveal-d3 { transition-delay: 0.24s; }

        /* ── 清單項目 hover ── */
        .item-row { transition: background 200ms ease; cursor: pointer; }
        .item-row:hover { background: rgba(176,31,69,0.03); }
        .item-row:hover h3, .item-row:hover h4 { color: #b01f45; transition: color 200ms ease; }
        .item-row h3, .item-row h4 { transition: color 200ms ease; }
        .item-row .ed-link { transition: gap 300ms ease, color 200ms ease; }
        .item-row:hover .ed-link { color: #b01f45; gap: 0.7rem; }

        /* ── Navbar 縮小 ── */
        .nav-scrolled { background: rgba(254,248,244,0.95) !important; box-shadow: 0 1px 12px rgba(29,27,25,0.06) !important; }
        .nav-scrolled .nav-inner { height: 3.5rem !important; }

        /* Section label */
        .ed-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; color: #ed4f6f; letter-spacing: 0.25em; text-transform: uppercase; }
        /* Editorial heading */
        .ed-heading { font-family: 'Noto Serif TC', serif; font-weight: 300; color: #1d1b19; line-height: 1.15; }
        /* Divider */
        .ed-divider { border-bottom: 1px solid rgba(29,27,25,0.08); }
        /* Action link */
        .ed-link { font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #1d1b19; display: inline-flex; align-items: center; gap: 0.4rem; transition: gap 300ms ease, color 200ms ease; background: none; border: none; cursor: pointer; }
        .ed-link:hover { gap: 0.7rem; color: #b01f45; }
        /* Brand badge */
        .brand-badge { background: rgba(176,31,69,0.08); color: #b01f45; border: none; border-radius: 9999px; padding: 0.2rem 0.75rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Inter', sans-serif; }
        /* Filter pill */
        .filter-pill { padding: 0.3rem 1rem; border-radius: 9999px; font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(29,27,25,0.12); background: transparent; color: #78716c; transition: all 200ms ease; letter-spacing: 0.05em; }
        .filter-pill:hover { border-color: #b01f45; color: #b01f45; }
        .filter-pill.active { background: #b01f45; border-color: #b01f45; color: white; }
        /* Main content area */
        .main-content { flex-grow: 1; width: 100%; padding-bottom: 6rem; }
        /* Bottom nav fixed */
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: rgba(254,248,244,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(29,27,25,0.06); box-shadow: 0 -8px 32px rgba(29,27,25,0.04); padding-bottom: env(safe-area-inset-bottom, 0px); }
        /* Card - light minimal */
        .c-card { background: #ffffff; border: 1px solid rgba(29,27,25,0.07); border-radius: 1rem; transition: border-color 200ms ease, box-shadow 200ms ease; }
        .c-card:hover, .c-card-hover:hover { border-color: rgba(29,27,25,0.18); box-shadow: 0 4px 24px rgba(29,27,25,0.06); }
        .c-card-hover { transition: border-color 200ms ease, box-shadow 200ms ease; }
        /* Legacy glass-panel → white card */
        .glass-panel { background: #ffffff !important; border: 1px solid rgba(29,27,25,0.07) !important; backdrop-filter: none !important; box-shadow: none; }
        .glass-panel:hover { border-color: rgba(29,27,25,0.18) !important; }
        .glass-card-hover { transition: border-color 200ms ease, box-shadow 200ms ease; }
        .glass-card-hover:hover { box-shadow: 0 4px 24px rgba(29,27,25,0.06) !important; border-color: rgba(29,27,25,0.18) !important; }
        /* Theme utils */
        .theme-heading { color: #1d1b19 !important; }
        .theme-text { color: #1d1b19 !important; }
        .theme-text-secondary { color: #78716c !important; }
        .theme-divider { border-color: rgba(29,27,25,0.08) !important; }
        .theme-input { background: #ffffff !important; border: 1px solid rgba(29,27,25,0.12) !important; color: #1d1b19 !important; }
        .font-sans { font-family: 'Inter', 'Noto Sans TC', sans-serif !important; }
        .font-serif { font-family: 'Noto Serif TC', serif !important; }
        .font-kai { font-family: 'Noto Serif TC', serif !important; }
        .content-justify { text-align: justify; }
        /* Tailwind overrides for light mode */
        .bg-white { background-color: #ffffff !important; }
        .bg-white\\/30, .bg-white\\/40, .bg-white\\/50, .bg-white\\/60, .bg-white\\/70 { background-color: rgba(255,255,255,0.5) !important; }
        .border-white\\/30, .border-white\\/40, .border-white\\/50, .border-white\\/60 { border-color: rgba(29,27,25,0.08) !important; }
        .hover-bg-surface:hover { background-color: #faf8f5 !important; }
        /* shimmer for loading */
        .shimmer { background: linear-gradient(90deg, rgba(29,27,25,0.04) 25%, rgba(29,27,25,0.08) 50%, rgba(29,27,25,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s ease infinite; border-radius: 0.5rem; }
        /* Desktop nav hidden, bottom nav used instead */
        .desktop-nav { display: none !important; }
        .mobile-menu-btn { display: none !important; }
        /* Hero */
        .hero-section { min-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 1.5rem 4rem; background: #fef8f4; position: relative; }

        input[type="date"]::-webkit-calendar-picker-indicator { filter: none; opacity: 0.4; }
        .native-input { background: rgba(29,27,25,0.05); border: 1px solid rgba(29,27,25,0.12); border-radius: 0.85rem; color: #1d1b19; font-family: 'Inter', 'Noto Sans TC', sans-serif; font-size: 0.9rem; padding: 0.75rem 1rem; width: 100%; box-sizing: border-box; outline: none; -webkit-appearance: none; }
        .native-input::placeholder { color: rgba(29,27,25,0.35); }
        .native-input:focus { border-color: rgba(29,27,25,0.3); }
      `}} />

      {/* ── Native 啟動動畫（Splash Screen）── */}
      {isAppMode && splashVisible && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#1c1c1e",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 0,
          opacity: splashExiting ? 0 : 1,
          transition: "opacity 500ms ease",
          pointerEvents: splashExiting ? "none" : "auto",
        }}>
          {/* Logo */}
          <div style={{ animation: "splashLogoIn 0.75s cubic-bezier(0.34,1.56,0.64,1) 0.25s both" }}>
            <LogoImage className="w-24 h-24 rounded-[22px] shadow-2xl" />
          </div>
          {/* 名稱 */}
          <p style={{
            color: "rgba(255,255,255,0.9)", fontFamily: "'Noto Serif TC',serif",
            fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.18em",
            marginTop: "1.4rem", marginBottom: "0.5rem",
            animation: "splashTextIn 0.55s ease 0.85s both",
          }}>中文研究室</p>
          {/* 標語 */}
          <p style={{
            color: "rgba(255,255,255,0.38)", fontFamily: "'Noto Serif TC',serif",
            fontSize: "0.82rem", letterSpacing: "0.14em",
            animation: "splashTagIn 0.7s ease 1.1s both",
          }}>志於道・據於德・依於仁・游於藝</p>
          {/* 底部小點點 loading */}
          <div style={{
            position: "absolute", bottom: "3.5rem",
            display: "flex", gap: "0.4rem", alignItems: "center",
            animation: "splashTextIn 0.4s ease 1.3s both",
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "rgba(255,255,255,0.28)",
                animation: `shimmer 1.4s ease ${0.2 * i}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Launch Onboarding（第一次開啟，splash 結束後顯示）── */}
      {isAppMode && launchOnboarding && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10001,
          background: "#1c1c1e",
          display: "flex", flexDirection: "column",
          padding: "0 1.5rem",
          paddingTop: "env(safe-area-inset-top, 3rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
          opacity: launchOnboardingExiting ? 0 : 1,
          transition: "opacity 450ms ease",
          pointerEvents: launchOnboardingExiting ? "none" : "auto",
          animation: "splashTextIn 0.4s ease both",
        }}>
          {/* 頂部 Logo 小標 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginTop: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📚</div>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.08em" }}>中文研究室</span>
          </div>

          {/* 標題 */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "'Noto Sans TC',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              個人化設定
            </p>
            <h1 style={{ color: "#fff", fontSize: "1.55rem", fontWeight: 800, fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.3, marginBottom: "0.75rem" }}>
              你對哪些領域<br />感興趣？
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.6 }}>
              選擇一個或多個領域，我們會優先推薦符合偏好的活動。
            </p>
          </div>

          {/* 選項格 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", flex: 1 }}>
            {PREF_OPTIONS.map(opt => {
              const selected = launchOnboardingSelected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => setLaunchOnboardingSelected(prev =>
                    prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id]
                  )}
                  style={{
                    padding: "1.1rem 1rem",
                    borderRadius: "1.1rem",
                    border: `1.5px solid ${selected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)"}`,
                    background: selected ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.4rem",
                    transition: "all 220ms ease",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, lineHeight: 1, fontFamily: "'Noto Sans TC',sans-serif", color: "rgba(255,255,255,0.55)" }}>{opt.label[0]}</span>
                  <span style={{ color: selected ? "#fff" : "rgba(255,255,255,0.65)", fontSize: "0.9rem", fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif" }}>
                    {opt.label}
                  </span>
                  {selected && (
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.65rem", fontFamily: "'Noto Sans TC',sans-serif" }}>✓ 已選取</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 底部按鈕 */}
          <div style={{ paddingTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={() => saveLaunchPrefs(launchOnboardingSelected)}
              style={{
                width: "100%", padding: "0.95rem 0", borderRadius: "1rem",
                fontWeight: 700, fontFamily: "'Noto Sans TC',sans-serif", fontSize: "1rem",
                background: launchOnboardingSelected.length > 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)",
                color: launchOnboardingSelected.length > 0 ? "#1c1c1e" : "rgba(255,255,255,0.35)",
                border: "none", cursor: "pointer", transition: "all 220ms ease",
              }}
            >
              {launchOnboardingSelected.length > 0
                ? `開始探索（已選 ${launchOnboardingSelected.length} 項）`
                : "請選擇至少一個領域"}
            </button>
            <button
              onClick={() => saveLaunchPrefs([])}
              style={{
                width: "100%", padding: "0.7rem 0", borderRadius: "1rem",
                background: "transparent", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.3)", fontSize: "0.85rem",
                fontFamily: "'Noto Sans TC',sans-serif",
              }}
            >
              略過，顯示全部活動
            </button>
          </div>
        </div>
      )}


      {/* ── App版 Tab Nav ── */}
      {isAppMode && (
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: launchOnboarding ? "none" : undefined,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(254,248,244,0.85)",
          borderBottom: "1px solid rgba(29,27,25,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}>
          <div style={{ padding: "0 1rem" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", height: "3.5rem", margin: "0 auto", justifyContent: "center" }}>
              {[
                { key: "lecture",    label: "學術講座" },
                { key: "workshop",   label: "研討會/工作坊" },
                { key: "submission", label: "徵稿資訊" },
              ].map(tab => {
                const active = nativeCategory === tab.key;
                const cnt = catCounts[tab.key];
                return (
                  <button
                    key={tab.key}
                    onClick={() => setNativeCategory(tab.key)}
                    className="native-btn"
                    style={{
                      padding: "0.3rem 0.65rem",
                      borderRadius: "9999px",
                      fontSize: "0.72rem",
                      fontWeight: active ? 700 : 500,
                      fontFamily: "'Inter', 'Noto Sans TC', sans-serif",
                      cursor: "pointer",
                      border: active ? "none" : "1px solid rgba(29,27,25,0.12)",
                      transition: "all 220ms ease",
                      background: active ? "#b01f45" : "transparent",
                      color: active ? "white" : "#78716c",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}
                  >
                    {tab.label}
                    {cnt > 0 && (
                      <span style={{
                        background: active ? "rgba(255,255,255,0.25)" : "rgba(176,31,69,0.1)",
                        color: active ? "white" : "#b01f45",
                        fontSize: "0.6rem", fontWeight: 700,
                        padding: "1px 5px", borderRadius: 9999,
                        lineHeight: 1.4,
                      }}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* ── 網頁版 Top Nav ── */}
      {!isAppMode && (
        <nav className={navScrolled ? "nav-scrolled" : ""} style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(254,248,244,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(29,27,25,0.06)",
          transition: "background 300ms ease, box-shadow 300ms ease",
        }}>
          <div className="nav-inner" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "4.5rem", transition: "height 300ms ease" }}>
            {/* Left: hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1d1b19", display: "flex", alignItems: "center", padding: "0.5rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>menu</span>
            </button>

            {/* Center: title */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center", cursor: "pointer" }} onClick={() => go("home")}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <LogoImage className="w-7 h-7 rounded-lg border border-stone-200" />
                <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 400, letterSpacing: "0.15em", color: "#1d1b19", fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}>中文研究室</span>
              </div>
            </div>

            {/* Right: search icon */}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1d1b19", display: "flex", alignItems: "center", padding: "0.5rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>search</span>
            </button>
          </div>

        </nav>
      )}

      {/* ── 抽屜選單（在 nav 外避免 backdrop-filter 截斷）── */}
      {!isAppMode && mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(29,27,25,0.3)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "300px", background: "#fef8f4", padding: "2rem 1.5rem", overflowY: "auto", boxShadow: "4px 0 32px rgba(29,27,25,0.12)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <LogoImage className="w-7 h-7 rounded-lg border border-stone-200" />
                <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 400, fontSize: "0.95rem", letterSpacing: "0.1em", color: "#1d1b19" }}>中文研究室</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1d1b19", padding: "0.25rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.4rem" }}>close</span>
              </button>
            </div>
            {allNavItems.map(item => {
              const active = currentPage === item.id;
              return (
                <button key={item.id} onClick={() => go(item.id)} style={{ display: "flex", alignItems: "center", gap: "0.85rem", width: "100%", textAlign: "left", padding: "0.9rem 0", background: "none", border: "none", borderBottom: "1px solid rgba(29,27,25,0.06)", cursor: "pointer" }}>
                  <span style={{ color: active ? "#b01f45" : "#a8a29e", flexShrink: 0, display: "flex" }}>{item.icon}</span>
                  <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: active ? 700 : 400, fontSize: "1.05rem", color: active ? "#b01f45" : "#1d1b19", letterSpacing: "0.05em" }}>{item.label}</span>
                  {active && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#b01f45", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="main-content">
        <div key={currentPage} className="page-enter">
          {page}
        </div>
      </main>

      {!isAppMode && (
        <footer style={{ borderTop: "1px solid rgba(29,27,25,0.08)", padding: "3rem 2rem", background: "#fef8f4", marginBottom: "5rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <LogoImage className="w-7 h-7 rounded-lg border border-stone-200" />
                <span style={{ fontFamily: "'Noto Serif TC', serif", fontWeight: 400, fontSize: "0.9rem", letterSpacing: "0.12em", color: "#1d1b19" }}>中文研究室</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#a8a29e", letterSpacing: "0.1em" }}>Email: zxc998775@gmail.com</p>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#a8a29e", letterSpacing: "0.1em" }}>&copy; {new Date().getFullYear()} 中文研究室. All rights reserved.</p>
          </div>
        </footer>
      )}

      {!isAppMode && (
        <div className="bottom-nav">
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0.75rem 1rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
            {[
              { id: "home", label: "首頁", icon: "home" },
              { id: "activities", label: "近期活動", icon: "auto_awesome_motion" },
              { id: "events", label: "研討進度", icon: "calendar_month" },
              { id: "articles", label: "文章專欄", icon: "article" },
              { id: "about", label: "關於", icon: "info" },
            ].map(item => {
              const active = currentPage === item.id;
              return (
                <button key={item.id} onClick={() => go(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0.5rem", color: active ? "#b01f45" : "#78716c", borderTop: active ? "2px solid #b01f45" : "2px solid transparent", paddingTop: "0.5rem", transition: "color 200ms ease" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.35rem", fontVariationSettings: active ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24" }}>{item.icon}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isAppMode && <BackToTopButton isDarkMode={isDarkMode} />}
    </div>
  );

} 