import React, { useEffect, useState } from "react";

/* ==================== 圖示組件 ==================== */
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    BookOpen: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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

/* ==================== LOGO 組件 ==================== */
const LOGO_SRC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwMCIgem9vbUFuZFBhbj0ibWFnbmlmeSIgdmlld0JveD0iMCAwIDc1MCA3NDkuOTk5OTk1IiBoZWlnaHQ9IjEwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZlcnNpb249IjEuMCI+PGRlZnM+PGNsaXBQYXRoIGlkPSIxZDc5NTdkYTI3Ij48cGF0aCBkPSJNIDc3LjE4MzU5NCA3NiBMIDQzMiA3NiBMIDQzMiAyODYgTCA3Ny4xODM1OTQgMjg2IFogTSA3Ny4xODM1OTQgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYmYyYmY2ZDU4YyI+PHBhdGggZD0iTSA0ODYgNzYgTCA2NzIuNjgzNTk0IDc2IEwgNjcyLjY4MzU5NCA2NjEgTCA0ODYgNjYxIFogTSA0ODYgNzYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iYjAxMzNjMTE3MyI+PHBhdGggZD0iTSA3Ny4xODM1OTQgMjA0IEwgNjE4IDIwNCBMIDYxOCA2NzQgTCA3Ny4xODM1OTQgNjc0IFogTSA3Ny4xODM1OTQgMjA0ICIgY2xpcC1ydWxlPSJub256ZXJvIi8+PC9jbGlwUGF0aD48L2RlZnM+PHJlY3QgeD0iLTc1IiB3aWR0aD0iOTAwIiBmaWxsPSIjZmZmZmZmIiB5PSItNzQuOTk5OTk5IiBoZWlnaHQ9Ijg5OS45OTk5OTQiIGZpbGwtb3BhY2l0eT0iMSIvPjxyZWN0IHg9Ii03NSIgd2lkdGg9IjkwMCIgZmlsbD0iI2ZmZmZmZiIgeT0iLTc0Ljk5OTk5OSIgaGVpZ2h0PSI4OTkuOTk5OTk0IiBmaWxsLW9wYWNpdHk9IjEiLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1OS40OTYwOTQgNjE5LjIxODc1IEMgNjUzLjg3MTA5NCA2MzQuNjcxODc1IDYzMi43MjI2NTYgNjUyLjg2NzE4OCA2MTguMzI4MTI1IDY2MC4zOTQ1MzEgTCA2MzQuNTQ2ODc1IDY0Ny4yNzczNDQgQyA2NDIuNTgyMDMxIDYzOS40MjE4NzUgNjUwLjY1NjI1IDYzMS4zODI4MTIgNjU2LjQyNTc4MSA2MjEuOTIxODc1IEMgNjU3LjIzMDQ2OSA2MjAuNTcwMzEyIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1OS40NjA5MzggNjE5LjIxODc1IFogTSA2NTkuNDk2MDk0IDYxOS4yMTg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA1MDAuMDg5ODQ0IDY3My41MDc4MTIgQyA0ODQuOTMzNTk0IDY3My41ODIwMzEgNDY5LjY5OTIxOSA2NzMuNTA3ODEyIDQ1NC41NDI5NjkgNjczLjUwNzgxMiBaIE0gNTAwLjA4OTg0NCA2NzMuNTA3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY2Ny4zODY3MTkgNjAwLjgwNDY4OCBDIDY2NS42MzI4MTIgNjA2LjI4NTE1NiA2NjQuMDIzNDM4IDYxMS45NDUzMTIgNjYwLjM3MTA5NCA2MTYuNTg1OTM4IEMgNjYxLjUwMzkwNiA2MTIuNzg5MDYyIDY2My4zNjcxODggNjA4LjI1NzgxMiA2NjUuMjMwNDY5IDYwMy40MzM1OTQgQyA2NjUuNzQyMTg4IDYwMi4wODIwMzEgNjY0Ljk3MjY1NiA2MDAuMjkyOTY5IDY2Ny4zODY3MTkgNjAwLjgzOTg0NCBaIE0gNjY3LjM4NjcxOSA2MDAuODA0Njg4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBMIDY0Ni43MTA5MzggMTE1LjYyMTA5NCBDIDY0MC4zMjAzMTIgMTA2LjA4NTkzOCA2MjkuNjkxNDA2IDk4LjYzMjgxMiA2MjAuMDgyMDMxIDkxLjkxMDE1NiBDIDYyMi41NjY0MDYgOTEuOTQ1MzEyIDYyNS4wMTU2MjUgOTMuNzM0Mzc1IDYyNy4wMjM0MzggOTUuMDUwNzgxIEMgNjM3LjM5ODQzOCAxMDEuODQ3NjU2IDY0NS41NzgxMjUgMTEwLjc2MTcxOSA2NTIuNTE5NTMxIDEyMC44MDg1OTQgWiBNIDY1Mi40ODA0NjkgMTIwLjgwODU5NCAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2MTkuMjA3MDMxIDkwLjk5NjA5NCBMIDYxNC4xNjQwNjIgODkuNDk2MDk0IEwgNjA5LjU2MjUgODUuNzM0Mzc1IEMgNjEzLjk0NTMxMiA4Ni45NDE0MDYgNjE1LjgwODU5NCA4OC41NDY4NzUgNjE5LjIwNzAzMSA5MC45OTYwOTQgWiBNIDYxOS4yMDcwMzEgOTAuOTk2MDk0ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjY2RkN2RhIiBkPSJNIDYwOC42ODc1IDg1LjczNDM3NSBDIDYwNi45Njg3NSA4NS4zNzEwOTQgNjA0LjYzMjgxMiA4Ni4xMzY3MTkgNjAzLjQyNTc4MSA4My45ODA0NjkgQyA2MDUuMTA1NDY5IDg0LjM4MjgxMiA2MDcuNDgwNDY5IDgzLjU0Mjk2OSA2MDguNjg3NSA4NS43MzQzNzUgWiBNIDYwOC42ODc1IDg1LjczNDM3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NkZDdkYSIgZD0iTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgQyA2NjcuNjQwNjI1IDU5OS4wODU5MzggNjY3Ljk2ODc1IDU5Ny41NTA3ODEgNjY4LjI2MTcxOSA1OTYuNDE3OTY5IEwgNjY5LjA2NjQwNiA1OTYuODIwMzEyIFogTSA2NjcuMzg2NzE5IDU5OS45MjU3ODEgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gMTA2IDExMC4yODUxNTYgQyAxMDguMTkxNDA2IDEwNy45MTAxNTYgMTA5LjY5MTQwNiAxMDYuMzM5ODQ0IDExMi4xMzY3MTkgMTA0LjE0ODQzOCBaIE0gMTA2IDExMC4yODUxNTYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZmJiYTQiIGQ9Ik0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgQyA0ODcuNzA3MDMxIDc3LjUxNTYyNSA0ODYuOTQxNDA2IDc4LjM5MDYyNSA0ODYuOTc2NTYyIDc4Ljc1NzgxMiBMIDQzMS44MjQyMTkgNzguNzU3ODEyIEwgNDMwLjk0NTMxMiA3Ny4wMDM5MDYgQyA0NDkuOTAyMzQ0IDc3LjAwMzkwNiA0NjguODk4NDM4IDc2LjkyOTY4OCA0ODcuODU1NDY5IDc3LjAwMzkwNiBaIE0gNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNkOWIzNmEiIGQ9Ik0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4IEwgMTQ1LjQxNDA2MiAzMDcuMzkwNjI1IEwgMjI5LjUgMzA3LjM5MDYyNSBDIDIyOC4wNzQyMTkgMzIwLjY1MjM0NCAyMjkuMDIzNDM4IDMzMy45NTMxMjUgMjI4LjY2MDE1NiAzNDcuMjg5MDYyIEMgMjI1LjkxNzk2OSA0NTAuNTM1MTU2IDIxOS44MjAzMTIgNTU0LjM2NzE4OCAyMTkuODU1NDY5IDY1Ny43OTY4NzUgTCAxOTUuMzQ3NjU2IDY3My41ODIwMzEgQyAxNzIuNzM4MjgxIDY3My4yMTQ4NDQgMTU3LjUwMzkwNiA2NzMuMjUzOTA2IDEzNi42ODM1OTQgNjYzLjA1ODU5NCBaIE0gMTM2LjY0ODQzOCA2NjMuMDIzNDM4ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjNjI3MjdmIiBkPSJNIDM1NC43MTQ4NDQgNjczLjUwNzgxMiBDIDMyNy41NzQyMTkgNjczLjUwNzgxMiAzMDAuMzk4NDM4IDY3My41ODIwMzEgMjczLjI1NzgxMiA2NzMuNTA3ODEyIEMgMjczLjQ0MTQwNiA2NjguNDI5Njg4IDI3My4wMDM5MDYgNjYzLjI0MjE4OCAyNzMuMjU3ODEyIDY1OC4xNjQwNjIgQyAyNzMuMjk2ODc1IDY1Ny4wMzEyNSAyNzQuMTcxODc1IDY1NS44OTg0MzggMjc0LjE3MTg3NSA2NTUuNTcwMzEyIEwgMjc0LjE3MTg3NSA2MzUuNDM3NSBDIDI3NC4xNzE4NzUgNjMxLjYwMTU2MiAyNzQuODY3MTg4IDYyNS40Mjk2ODggMjc1LjA0Njg3NSA2MjAuOTcyNjU2IEMgMjc5Ljc5Njg3NSA2MjEuNTU0Njg4IDI4My40ODgyODEgNjE4LjE1NjI1IDI4Ny41NzgxMjUgNjE2LjQwNjI1IEMgMzEwLjIyMjY1NiA2MDYuODMyMDMxIDMzMy40OTIxODggNTk4Ljc5Mjk2OSAzNTcuMzc4OTA2IDU5Mi45MTQwNjIgQyAzNTYuNTAzOTA2IDYxNC4wNjY0MDYgMzU1LjUxOTUzMSA2MzUuMjU3ODEyIDM1NC43MTQ4NDQgNjU2LjM3NSBDIDM1NC40OTYwOTQgNjYyLjA3NDIxOSAzNTQuOTMzNTk0IDY2Ny44MDg1OTQgMzU0LjcxNDg0NCA2NzMuNTA3ODEyIFogTSAzNTQuNzE0ODQ0IDY3My41MDc4MTIgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM2MjcyN2YiIGQ9Ik0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5IEMgMjE5Ljg1NTQ2OSA2NjMuMDIzNDM4IDIxOS44NTU0NjkgNjY4LjI4NTE1NiAyMTkuODU1NDY5IDY3My41NDY4NzUgQyAyMTEuNzEwOTM4IDY3My41MDc4MTIgMjAzLjQ5MjE4OCA2NzMuNjkxNDA2IDE5NS4zNDc2NTYgNjczLjU0Njg3NSBaIE0gMjE5Ljg1NTQ2OSA2NTcuNzYxNzE5ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDliMzZhIiBkPSJNIDM0Mi40NzY1NjIgMzE3IEMgMzUxLjUgMzE3LjAzOTA2MiAzNjAuNTkzNzUgMzE3IDM2OS42MTcxODggMzE3IEMgMzcwLjM0NzY1NiAzMjMuMDI3MzQ0IDM2OC45OTYwOTQgMzI5LjIzODI4MSAzNjguNzQyMTg4IDMzNC45NzY1NjIgQyAzNjYgNDAwLjAwNzgxMiAzNjIuNjc1NzgxIDQ2NC45Mjk2ODggMzU5Ljk3MjY1NiA1MjkuODUxNTYyIEMgMzQyLjAzOTA2MiA1NTEuNzczNDM4IDMyMi40NjA5MzggNTcyLjY3MTg3NSAzMDEuNzUgNTkyLjA3MDMxMiBDIDI5NC41MTU2MjUgNTk4LjgzMjAzMSAyODYuNzM4MjgxIDYwNS4wNzgxMjUgMjc5LjM5NDUzMSA2MTEuNzY1NjI1IEMgMjc4LjMwMDc4MSA2MTIuNzUgMjc3LjYwNTQ2OSA2MTMuOTU3MDMxIDI3NS44OTA2MjUgNjEzLjkyMTg3NSBDIDI3OS43OTY4NzUgNTIwLjQ2NDg0NCAyODIuMDYyNSA0MjYuOTMzNTk0IDI4Ny4yODUxNTYgMzMzLjYyNSBDIDI5My43NSAzMzIuODIwMzEyIDMwMC40NzI2NTYgMzMzLjYyNSAzMDYuOTcyNjU2IDMzMi43NDYwOTQgQyAzMTguNzM0Mzc1IDMzMS4xNDA2MjUgMzI5LjQwMjM0NCAzMjYuMjQyMTg4IDMzOC40MjE4NzUgMzE5LjU1ODU5NCBDIDM0MC4yMTA5MzggMzE4LjI0MjE4OCAzNDIuOTg4MjgxIDMxOS44MTI1IDM0Mi40NDE0MDYgMzE3IFogTSAzNDIuNDc2NTYyIDMxNyAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzY4OGQ5NyIgZD0iTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSBDIDMzMy40NTcwMzEgNTk4Ljc5Mjk2OSAzMTAuMTg3NSA2MDYuODMyMDMxIDI4Ny41MzkwNjIgNjE2LjQ0MTQwNiBDIDI4My40NDkyMTkgNjE4LjE1NjI1IDI3OS43NjE3MTkgNjIxLjU5Mzc1IDI3NS4wMTE3MTkgNjIxLjAwNzgxMiBDIDI3NS4xMjEwOTQgNjE4LjQxNDA2MiAyNzUuODE2NDA2IDYxNi4wMzkwNjIgMjc1Ljg5MDYyNSA2MTMuOTkyMTg4IEMgMjc3LjYwNTQ2OSA2MTMuOTkyMTg4IDI3OC4zMzU5MzggNjEyLjgyNDIxOSAyNzkuMzk0NTMxIDYxMS44MzU5MzggQyAyODYuNjk5MjE5IDYwNS4xNTIzNDQgMjk0LjUxNTYyNSA1OTguOTA2MjUgMzAxLjc1IDU5Mi4xNDQ1MzEgQyAzMjIuNDYwOTM4IDU3Mi43ODEyNSAzNDIuMDAzOTA2IDU1MS44NDc2NTYgMzU5Ljk3MjY1NiA1MjkuOTI1NzgxIEMgMzU5LjA5NzY1NiA1NTAuODk4NDM4IDM1OC4yMTg3NSA1NzIuMTI1IDM1Ny4zNDM3NSA1OTIuOTg0Mzc1IFogTSAzNTcuMzQzNzUgNTkyLjk0OTIxOSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iI2NlYTI3MiIgZD0iTSAzNDIuNDc2NTYyIDMxNyBDIDM0My4wMjczNDQgMzE5Ljg1MTU2MiAzNDAuMjUgMzE4LjI0MjE4OCAzMzguNDYwOTM4IDMxOS41NTg1OTQgQyAzMjkuNDM3NSAzMjYuMjQ2MDk0IDMxOC43NzM0MzggMzMxLjEwMTU2MiAzMDcuMDExNzE5IDMzMi43NDYwOTQgQyAzMDAuNDcyNjU2IDMzMy42NjAxNTYgMjkzLjc4NTE1NiAzMzIuODIwMzEyIDI4Ny4zMjAzMTIgMzMzLjYyNSBDIDI4Ny42MTMyODEgMzI4LjA3MDMxMiAyODcuNzk2ODc1IDMyMi41MTU2MjUgMjg4LjE5OTIxOSAzMTYuOTY0ODQ0IEMgMzA2LjI3NzM0NCAzMTcuMDM5MDYyIDMyNC40MzM1OTQgMzE2Ljg5MDYyNSAzNDIuNTE1NjI1IDMxNi45NjQ4NDQgWiBNIDM0Mi40NzY1NjIgMzE3ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48ZyBjbGlwLXBhdGg9InVybCgjMWQ3OTU3ZGEyNykiPjxwYXRoIGZpbGw9IiMyZjVkNjQiIGQ9Ik0gNDMwLjkxMDE1NiA3Ny4wMDM5MDYgTCA0MzEuNzg1MTU2IDc4Ljc1NzgxMiBDIDM5NC40OTIxODggMTYyLjM0NzY1NiAzMjYuMTQ4NDM4IDIyOS43MTg3NSAyNDUuMjQyMTg4IDI3MS40NzY1NjIgQyAyNDAuMzQ3NjU2IDI3MS41MTU2MjUgMjM1LjM3ODkwNiAyNzEuMzMyMDMxIDIzMC40ODQzNzUgMjcxLjU4NTkzOCBDIDIyOS4yMDcwMzEgMjczLjc4MTI1IDIyOS42ODM1OTQgMjc2LjE5MTQwNiAyMjkuNSAyNzguNDU3MDMxIEMgMjI0Ljk2ODc1IDI3OS4wMzkwNjIgMjIwLjIyMjY1NiAyODEuMzQzNzUgMjE2LjM1MTU2MiAyODMuNzE4NzUgQyAyMDIuNzk2ODc1IDI4NC4zNzUgMTg5LjIxMDkzOCAyODQuNDEwMTU2IDE3NS43MzA0NjkgMjg0LjY2Nzk2OSBDIDE2Ni41MjczNDQgMjg0Ljg1MTU2MiAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTQ4Ljk1NzAzMSAyODQuMTIxMDk0IEMgMTQ2LjkxMDE1NiAyODMuMzE2NDA2IDE0MS45NDUzMTIgMjc5LjMzMjAzMSAxNDEuNTA3ODEyIDI3OS4zMzIwMzEgTCAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgQyAxMTYuMTIxMDk0IDI3OS4zMzIwMzEgMTE0LjgwNDY4OCAyNzguMTI4OTA2IDExNC44MDQ2ODggMjc4LjAxOTUzMSBMIDExNC44MDQ2ODggMjQwLjc4OTA2MiBMIDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEMgNzcuOTg0Mzc1IDE5MS44NjcxODggNjkuNjk1MzEyIDE0OS4zNzg5MDYgMTA2IDExMC4yODUxNTYgTCAxMTIuMTM2NzE5IDEwNC4xNDg0MzggQyAxMjkuMzc4OTA2IDg4LjYyMTA5NCAxNTIuNTM1MTU2IDc5LjEyMTA5NCAxNzUuNjYwMTU2IDc3LjAwMzkwNiBDIDI2MC43NjU2MjUgNzcuMDc0MjE5IDM0NS44NzUgNzYuODU1NDY5IDQzMC45NDUzMTIgNzcuMDAzOTA2IFogTSA0MzAuOTEwMTU2IDc3LjAwMzkwNiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gNDg2Ljk3NjU2MiA3OC43NTc4MTIgQyA0ODcuMjM0Mzc1IDgzLjI4NTE1NiA0OTEuNjkxNDA2IDkzLjk5MjE4OCA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTguMTIxMDk0IDEzMS4yMjI2NTYgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNTAwLjcxMDkzOCAxNjUuNDE3OTY5IDUwMC4zNDc2NTYgMTg1LjI1NzgxMiA0OTkuMjE0ODQ0IDIwNC44NzUgQyA0NjguODk4NDM4IDIwNS4zODY3MTkgMzkzLjY1MjM0NCAyMTUuMzU5Mzc1IDM5MS40NjA5MzggMjU2LjA5NzY1NiBDIDM5MS4yMDMxMjUgMjYxLjE3NTc4MSAzOTMuOTgwNDY5IDI3OS44MDg1OTQgMzkxLjk3MjY1NiAyODIuODc4OTA2IEMgMzkxLjQyMTg3NSAyODMuNzE4NzUgMzg4LjYwOTM3NSAyODQuMzc1IDM4Ny40ODA0NjkgMjg0LjUxOTUzMSBDIDM4NC42Njc5NjkgMjg0Ljg4NjcxOSAzNzMuMDUwNzgxIDI4NC42Njc5NjkgMzcxLjQ4MDQ2OSAyODUuNjE3MTg4IEMgMzY5LjkxMDE1NiAyODYuNTY2NDA2IDM3MS41ODk4NDQgMjkzLjMyNDIxOSAzNjkuMDMxMjUgMjk0LjEyODkwNiBMIDI3MC4zMDA3ODEgMjk0LjMxMjUgTCAyNjUuNDQxNDA2IDI3MS44Nzg5MDYgQyAyNjQuMjczNDM4IDI3MS4wMzkwNjIgMjQ4LjMxMjUgMjcxLjQ3NjU2MiAyNDUuMjQyMTg4IDI3MS41MTU2MjUgQyAzMjYuMTQ4NDM4IDIyOS43OTI5NjkgMzk0LjQ5MjE4OCAxNjIuMzg2NzE5IDQzMS43ODUxNTYgNzguNzkyOTY5IEwgNDg2Ljk0MTQwNiA3OC43OTI5NjkgWiBNIDQ4Ni45NzY1NjIgNzguNzU3ODEyICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBmaWxsPSIjZDViNDcxIiBkPSJNIDQ5My45OTIxODggMjQ1LjE3MTg3NSBDIDQ4OC4xMDkzNzUgMjg2Ljg5NDUzMSA0NzYuMzg2NzE5IDMyOC45NDkyMTkgNDYwLjI3NzM0NCAzNjcuNzg1MTU2IEMgNDU4LjMwNDY4OCAzNzIuNTcwMzEyIDQ0NC45NzI2NTYgMzk5LjI0MjE4OCA0NDQuOTcyNjU2IDQwMS4wNjY0MDYgTCA0NDQuMDk3NjU2IDQwMS4wNjY0MDYgQyA0NDQuMTY3OTY5IDM1Ny4xMTcxODggNDQ0LjA5NzY1NiAzMTMuMTY0MDYyIDQ0NC4wOTc2NTYgMjY5LjIxNDg0NCBDIDQ0NS4xMTcxODggMjQ2LjgxNjQwNiA0NzcuMzcxMDk0IDI0Ni4xOTUzMTIgNDk0LjAyNzM0NCAyNDUuMTcxODc1IFogTSA0OTMuOTkyMTg4IDI0NS4xNzE4NzUgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxnIGNsaXAtcGF0aD0idXJsKCNiZjJiZjZkNThjKSI+PHBhdGggZmlsbD0iIzY3OGY5YSIgZD0iTSA0ODcuODU1NDY5IDc3LjAwMzkwNiBDIDUxNS45NDUzMTIgNzcuMDc0MjE5IDU0Ny4zNTkzNzUgNzUuMTc1NzgxIDU3NC45NzI2NTYgNzcuMDAzOTA2IEMgNTg2LjkxNzk2OSA3Ny44MDg1OTQgNTkzLjQxNzk2OSA4MS42MDU0NjkgNjAzLjQyNTc4MSA4NC4wMTk1MzEgQyA2MDQuNjMyODEyIDg2LjE3MTg3NSA2MDYuOTY4NzUgODUuNDA2MjUgNjA4LjY4NzUgODUuNzY5NTMxIEMgNjA4Ljk4MDQ2OSA4NS44NDM3NSA2MDkuMzA4NTk0IDg1LjY5OTIxOSA2MDkuNTYyNSA4NS43Njk1MzEgTCA2MTQuMTY0MDYyIDg5LjUzNTE1NiBMIDYxOS4yMDcwMzEgOTEuMDMxMjUgQyA2MTkuNTM1MTU2IDkxLjI1IDYxOS43NTM5MDYgOTEuNjkxNDA2IDYyMC4wODIwMzEgOTEuOTEwMTU2IEMgNjI5LjcyNjU2MiA5OC42MzI4MTIgNjQwLjMyMDMxMiAxMDYuMDg1OTM4IDY0Ni43MTA5MzggMTE1LjYyMTA5NCBMIDY1Mi40ODA0NjkgMTIwLjgwODU5NCBDIDY2Mi45NjQ4NDQgMTM1Ljk2ODc1IDY3MS40NzY1NjIgMTU1Ljg4MjgxMiA2NzIuNjQ0NTMxIDE3NC42NjAxNTYgTCA2NzIuNjQ0NTMxIDU3NS4wNDY4NzUgQyA2NzIuNDI1NzgxIDU4Mi42NDQ1MzEgNjcwLjEyNSA1ODkuNDA2MjUgNjY4LjIyNjU2MiA1OTYuNDU3MDMxIEMgNjY3LjkzMzU5NCA1OTcuNTg5ODQ0IDY2Ny42MDU0NjkgNTk5LjEyNSA2NjcuMzQ3NjU2IDU5OS45NjQ4NDQgQyA2NjcuMjc3MzQ0IDYwMC4yMTg3NSA2NjcuNDIxODc1IDYwMC41ODU5MzggNjY3LjM0NzY1NiA2MDAuODM5ODQ0IEMgNjY0LjkzNzUgNjAwLjMyODEyNSA2NjUuNzA3MDMxIDYwMi4wODIwMzEgNjY1LjE5NTMxMiA2MDMuNDMzNTk0IEMgNjYzLjM2NzE4OCA2MDguMjU3ODEyIDY2MS41MDM5MDYgNjEyLjc4OTA2MiA2NjAuMzM1OTM4IDYxNi41ODU5MzggQyA2NjAuMDQyOTY5IDYxNy41IDY1OS43ODkwNjIgNjE4LjMwNDY4OCA2NTkuNDU3MDMxIDYxOS4yMTg3NSBDIDY1Ny4xNTYyNSA2MTkuMTA5Mzc1IDY1Ny4yMzA0NjkgNjIwLjU3MDMxMiA2NTYuNDI1NzgxIDYyMS45MjE4NzUgQyA2NTAuNjU2MjUgNjMxLjM4MjgxMiA2NDIuNTQ2ODc1IDYzOS40MjE4NzUgNjM0LjU0Njg3NSA2NDcuMjc3MzQ0IEwgNjE4LjMyODEyNSA2NjAuMzk0NTMxIEwgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY1OC42NDA2MjUgQyA2MTguOTE0MDYyIDY1Ny43MjY1NjIgNjE4LjMyODEyNSA2NTUuMzEyNSA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTkuOTM3NSA1MjQuMTUyMzQ0IDYxNy44MTY0MDYgMzkzLjgzMjAzMSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MDguODMyMDMxIDIxMC4yODEyNSA1NDMuNTkzNzUgMjA0LjEwOTM3NSA0OTkuMjE0ODQ0IDIwNC44NzUgQyA1MDAuMzQ3NjU2IDE4NS4yMTg3NSA1MDAuNzEwOTM4IDE2NS40MTc5NjkgNDk5LjIxNDg0NCAxNDUuNzYxNzE5IEMgNDk4LjExNzE4OCAxMzEuMjIyNjU2IDQ5NS44OTA2MjUgMTEzLjgzMjAzMSA0OTIuODU5Mzc1IDk5LjU4MjAzMSBDIDQ5MS42NTIzNDQgOTMuOTkyMTg4IDQ4Ny4yMzQzNzUgODMuMjg1MTU2IDQ4Ni45NzY1NjIgNzguNzU3ODEyIEMgNDg2Ljk3NjU2MiA3OC4zOTA2MjUgNDg3LjcwNzAzMSA3Ny41MTU2MjUgNDg3Ljg1NTQ2OSA3Ny4wMDM5MDYgWiBNIDQ4Ny44NTU0NjkgNzcuMDAzOTA2ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PHBhdGggZmlsbD0iIzY2OGU5YSIgZD0iTSA1NjQuOTI1NzgxIDY3My41MDc4MTIgQyA1NDQuNTgyMDMxIDY3NC4xMjg5MDYgNTIzLjk4MDQ2OSA2NzMuNDMzNTk0IDUwMy42MzI4MTIgNjczLjUwNzgxMiBDIDQ5OC4zMzk4NDQgNjU5Ljc3MzQzOCA0OTAuNjMyODEyIDY0NC41MzUxNTYgNDgxLjcxODc1IDYzMi44MDg1OTQgQyA0NzUuMjUzOTA2IDYyNC4yNTc4MTIgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ0NS44MTI1IDYwMC44MDQ2ODggQyA0NDYuNTQyOTY5IDUzNS4yNjE3MTkgNDQ0Ljc4OTA2MiA0NjkuNjA1NDY5IDQ0NS44ODY3MTkgNDA0LjA2MjUgQyA0NDUuODg2NzE5IDQwMi40NTcwMzEgNDQ0LjkzNzUgNDAxLjI1IDQ0NC45Mzc1IDQwMS4xMDU0NjkgQyA0NDQuOTM3NSAzOTkuMjc3MzQ0IDQ1OC4yNjk1MzEgMzcyLjYwNTQ2OSA0NjAuMjQyMTg4IDM2Ny44MjAzMTIgQyA0NzYuMzQ3NjU2IDMyOC45ODQzNzUgNDg4LjA3NDIxOSAyODYuODk0NTMxIDQ5My45NTMxMjUgMjQ1LjIxMDkzOCBDIDUwOS4xNDg0MzggMjQ0LjI2MTcxOSA1MjMuNjg3NSAyNDQuNTg5ODQ0IDUzOC43NzM0MzggMjQ4LjEzMjgxMiBDIDU1MC43OTI5NjkgMjUwLjk0NTMxMiA1NjMuMTcxODc1IDI1NS40MDIzNDQgNTY0Ljc4MTI1IDI2OS4zOTQ1MzEgTCA1NjQuODkwNjI1IDY3My41NDY4NzUgWiBNIDU2NC45MjU3ODEgNjczLjUwNzgxMiAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZmlsbD0iIzYxNzI3ZSIgZD0iTSA0NDUuODEyNSA2MDAuODA0Njg4IEMgNDU1LjM4MjgxMiA2MDQuNDU3MDMxIDQ3NS4yMTQ4NDQgNjI0LjI1NzgxMiA0ODEuNzE4NzUgNjMyLjgwODU5NCBDIDQ5MC42MzI4MTIgNjQ0LjU3NDIxOSA0OTguMzM5ODQ0IDY1OS43Njk1MzEgNTAzLjYzMjgxMiA2NzMuNTA3ODEyIEMgNTAyLjQ2NDg0NCA2NzMuNTA3ODEyIDUwMS4yOTY4NzUgNjczLjUwNzgxMiA1MDAuMTI4OTA2IDY3My41MDc4MTIgTCA0NTQuNTc4MTI1IDY3My41MDc4MTIgQyA0NTEuMzYzMjgxIDY3My41MDc4MTIgNDQ4LjE0ODQzOCA2NzMuNTA3ODEyIDQ0NC45Mzc1IDY3My41MDc4MTIgQyA0NDMuNDAyMzQ0IDY0OS4zOTQ1MzEgNDQ0LjA5Mzc1IDYyNS4wMjczNDQgNDQ0LjA1ODU5NCA2MDAuODA0Njg4IEMgNDQ0LjYwNTQ2OSA2MDAuOTE0MDYyIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NS44MTI1IDYwMC44MDQ2ODggWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiM1YTg1OTIiIGQ9Ik0gNjE3LjQ1MzEyNSA2NTguNjQwNjI1IEMgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNi41NzgxMjUgNjQ3LjIzODI4MSA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgTCA2MTYuNTc4MTI1IDI3My42MzI4MTIgQyA2MTYuNTc4MTI1IDI3MS42OTkyMTkgNjE4LjM2NzE4OCAyNjcuMzEyNSA2MTcuNDUzMTI1IDI2NC40MjU3ODEgQyA2MTcuODU1NDY5IDM5My44MzIwMzEgNjE5LjkzNzUgNTI0LjE1MjM0NCA2MTguMzI4MTI1IDY1My44MTY0MDYgQyA2MTguMzI4MTI1IDY1NS4zMTI1IDYxOC44Nzg5MDYgNjU3LjcyNjU2MiA2MTcuNDUzMTI1IDY1OC42NDA2MjUgWiBNIDYxNy40NTMxMjUgNjU4LjY0MDYyNSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PGcgY2xpcC1wYXRoPSJ1cmwoI2IwMTMzYzExNzMpIj48cGF0aCBmaWxsPSIjZmVmZWZlIiBkPSJNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSBDIDU0My41NTg1OTQgMjA0LjEwOTM3NSA2MDguODMyMDMxIDIxMC4zMjAzMTIgNjE3LjQ1MzEyNSAyNjQuNDI1NzgxIEMgNjE4LjM2NzE4OCAyNjcuMjc3MzQ0IDYxNi41NzgxMjUgMjcxLjY5OTIxOSA2MTYuNTc4MTI1IDI3My42MzI4MTIgTCA2MTYuNTc4MTI1IDY0Mi40MTc5NjkgQyA2MTYuNTc4MTI1IDY0Ny4yMzgyODEgNjE3Ljg1NTQ2OSA2NTIuOTc2NTYyIDYxNy40NTMxMjUgNjU4LjY0MDYyNSBDIDYxNy4zNzg5MDYgNjU5LjU1MDc4MSA2MTcuNDUzMTI1IDY2MC4zMjAzMTIgNjE3LjQ1MzEyNSA2NjAuMzk0NTMxIEMgNjE2LjEwMTU2MiA2NjMuNDI1NzgxIDU5OC4zODY3MTkgNjY5LjEyNSA1OTQuMzY3MTg4IDY3MC4xNDg0MzggQyA1ODQuMzI0MjE5IDY3Mi42MzI4MTIgNTc1LjIyNjU2MiA2NzMuMjE0ODQ0IDU2NC45MjU3ODEgNjczLjU0Njg3NSBMIDU2NC44MTY0MDYgMjY5LjM5NDUzMSBDIDU2My4yMTA5MzggMjU1LjQwMjM0NCA1NTAuNzkyOTY5IDI1MC45MTAxNTYgNTM4LjgwODU5NCAyNDguMTMyODEyIEMgNTIzLjcyMjY1NiAyNDQuNjI1IDUwOS4xODc1IDI0NC4yNTc4MTIgNDkzLjk5MjE4OCAyNDUuMjEwOTM4IEMgNDc3LjMzNTkzOCAyNDYuMjY5NTMxIDQ0NS4wNDY4NzUgMjQ2Ljg1NTQ2OSA0NDQuMDU4NTk0IDI2OS4yNSBDIDQ0NC4wNTg1OTQgMzEzLjE5OTIxOSA0NDQuMTMyODEyIDM1Ny4xODc1IDQ0NC4wNTg1OTQgNDAxLjEwNTQ2OSBDIDQ0My45ODQzNzUgNDY3LjY3MTg3NSA0NDMuOTQ5MjE5IDUzNC4yNzM0MzggNDQ0LjA1ODU5NCA2MDAuODM5ODQ0IEMgNDQ0LjA1ODU5NCA2MjUuMDYyNSA0NDMuNDAyMzQ0IDY0OS40MzM1OTQgNDQ0LjkzNzUgNjczLjU0Njg3NSBDIDQxNC44NzUgNjczLjU4MjAzMSAzODQuNzc3MzQ0IDY3My41NDY4NzUgMzU0LjcxNDg0NCA2NzMuNTQ2ODc1IEMgMzU0Ljg5ODQzOCA2NjcuODgyODEyIDM1NC40NTcwMzEgNjYyLjEwOTM3NSAzNTQuNzE0ODQ0IDY1Ni40MTAxNTYgQyAzNTUuNTE5NTMxIDYzNS4yOTI5NjkgMzU2LjUwMzkwNiA2MTQuMDY2NDA2IDM1Ny4zNzg5MDYgNTkyLjk0OTIxOSBDIDM1OC4yNTc4MTIgNTcxLjgzMjAzMSAzNTkuMTMyODEyIDU1MC44NTkzNzUgMzYwLjAxMTcxOSA1MjkuODkwNjI1IEMgMzYyLjcxNDg0NCA0NjQuOTI5Njg4IDM2Ni4wMzkwNjIgNDAwLjAwNzgxMiAzNjguNzc3MzQ0IDMzNS4wMTE3MTkgQyAzNjkuMDMxMjUgMzI5LjI3NzM0NCAzNzAuMzgyODEyIDMyMy4wNjY0MDYgMzY5LjY1MjM0NCAzMTcuMDM5MDYyIEMgMzYwLjYzMjgxMiAzMTcuMDM5MDYyIDM1MS41MzUxNTYgMzE3LjA3NDIxOSAzNDIuNTE1NjI1IDMxNy4wMzkwNjIgQyAzMjQuNDMzNTk0IDMxNi45MjU3ODEgMzA2LjMxNjQwNiAzMTcuMTA5Mzc1IDI4OC4xOTkyMTkgMzE3LjAzOTA2MiBDIDI4Ny43OTY4NzUgMzIyLjU1NDY4OCAyODcuNjUyMzQ0IDMyOC4xNDQ1MzEgMjg3LjMyMDMxMiAzMzMuNjk1MzEyIEMgMjgyLjA5NzY1NiA0MjcuMDA3ODEyIDI3OS44MzIwMzEgNTIwLjUzNTE1NiAyNzUuOTI1NzgxIDYxMy45OTIxODggQyAyNzUuODUxNTYyIDYxNi4wMDM5MDYgMjc1LjE2MDE1NiA2MTguNDE0MDYyIDI3NS4wNDY4NzUgNjIxLjAwNzgxMiBDIDI3NC44NjcxODggNjI1LjQ2NDg0NCAyNzQuMTcxODc1IDYzMS42NDA2MjUgMjc0LjE3MTg3NSA2MzUuNDc2NTYyIEwgMjc0LjE3MTg3NSA2NTUuNjA1NDY5IEMgMjc0LjE3MTg3NSA2NTUuOTMzNTk0IDI3My4yOTY4NzUgNjU3LjA2NjQwNiAyNzMuMjU3ODEyIDY1OC4xOTkyMTkgQyAyNzMuMDM5MDYyIDY2My4zMTY0MDYgMjczLjQ3NjU2MiA2NjguNDY0ODQ0IDI3My4yNTc4MTIgNjczLjU0Njg3NSBDIDI1NS40Njg3NSA2NzMuNTA3ODEyIDIzNy42NDQ1MzEgNjczLjY1NjI1IDIxOS44MjAzMTIgNjczLjU0Njg3NSBDIDIxOS44MjAzMTIgNjY4LjI4NTE1NiAyMTkuODIwMzEyIDY2My4wMjM0MzggMjE5LjgyMDMxMiA2NTcuNzYxNzE5IEMgMjE5Ljc4NTE1NiA1NTQuMzY3MTg4IDIyNS44ODI4MTIgNDUwLjUzNTE1NiAyMjguNjIxMDk0IDM0Ny4yNSBDIDIyOC45ODgyODEgMzMzLjk1MzEyNSAyMjguMDM5MDYyIDMyMC42MTcxODggMjI5LjQ2NDg0NCAzMDcuMzU1NDY5IEwgMTQ1LjM3ODkwNiAzMDcuMzU1NDY5IEwgMTM2LjYwOTM3NSA2NjIuOTg4MjgxIEMgMTA1LjU2MjUgNjQ3Ljc4OTA2MiA4My45NzY1NjIgNjE3LjkwMjM0NCA3OC44OTg0MzggNTgzLjU5NzY1NiBDIDc3LjE4MzU5NCA0NjkuNDk2MDk0IDc3Ljk0OTIxOSAzNTUuMDM1MTU2IDc3Ljk4NDM3NSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNDAuNzg5MDYyIEwgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIEMgMTE0Ljc2OTUzMSAyNzguMDE5NTMxIDExNS45NzI2NTYgMjc5LjMzMjAzMSAxMTYuMDgyMDMxIDI3OS4zMzIwMzEgTCAxNDEuNDY4NzUgMjc5LjMzMjAzMSBDIDE0MS45MDYyNSAyNzkuMzMyMDMxIDE0Ni44NzUgMjgzLjM1MTU2MiAxNDguOTIxODc1IDI4NC4xMjEwOTQgQyAxNTguMDE1NjI1IDI4Ny42NjQwNjIgMTY2LjQ5MjE4OCAyODQuODUxNTYyIDE3NS42OTUzMTIgMjg0LjY2Nzk2OSBDIDE4OS4xNzE4NzUgMjg0LjQxMDE1NiAyMDIuNzk2ODc1IDI4NC4zNzUgMjE2LjMxMjUgMjgzLjcxODc1IEMgMjE2LjQyMTg3NSAyODMuNzE4NzUgMjE2LjUzMTI1IDI4NC44MTI1IDIxOC40Njg3NSAyODQuNjY3OTY5IEMgMjIwLjI1NzgxMiAyODQuNTU4NTk0IDIyNi45MDYyNSAyODMuOTM3NSAyMjggMjgzLjYwOTM3NSBDIDIzMC4xMjEwOTQgMjgyLjkxNDA2MiAyMjkuMjgxMjUgMjgwLjE3MTg3NSAyMjkuNDI1NzgxIDI3OC40NTcwMzEgQyAyMjkuNjQ0NTMxIDI3Ni4xNTYyNSAyMjkuMTMyODEyIDI3My43ODEyNSAyMzAuNDE0MDYyIDI3MS41ODU5MzggQyAyMzUuMzA4NTk0IDI3MS4yOTY4NzUgMjQwLjI3MzQzOCAyNzEuNTE1NjI1IDI0NS4xNjc5NjkgMjcxLjQ3NjU2MiBDIDI0OC4yMzgyODEgMjcxLjQ3NjU2MiAyNjQuMTk5MjE5IDI3MS4wMDM5MDYgMjY1LjM2NzE4OCAyNzEuODQzNzUgTCAyNzAuMjI2NTYyIDI5NC4yNzczNDQgTCAzNjguOTYwOTM4IDI5NC4wOTM3NSBDIDM3MS40ODA0NjkgMjkzLjI4OTA2MiAzNjkuODAwNzgxIDI4Ni41MzEyNSAzNzEuNDA2MjUgMjg1LjU4MjAzMSBDIDM3My4wMTU2MjUgMjg0LjYyODkwNiAzODQuNTkzNzUgMjg0Ljg1MTU2MiAzODcuNDA2MjUgMjg0LjQ4NDM3NSBDIDM4OC41MzkwNjIgMjg0LjMzOTg0NCAzOTEuMzUxNTYyIDI4My43MTg3NSAzOTEuODk4NDM4IDI4Mi44Mzk4NDQgQyAzOTMuOTA2MjUgMjc5Ljc3MzQzOCAzOTEuMTMyODEyIDI2MS4xNDA2MjUgMzkxLjM4NjcxOSAyNTYuMDU4NTk0IEMgMzkzLjU3ODEyNSAyMTUuMzU5Mzc1IDQ2OC44MjQyMTkgMjA1LjM1MTU2MiA0OTkuMTQwNjI1IDIwNC44Mzk4NDQgWiBNIDQ5OS4yMTQ4NDQgMjA0Ljg3NSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjxwYXRoIGZpbGw9IiM1NDgyOGYiIGQ9Ik0gNDQ1LjgxMjUgNjAwLjgwNDY4OCBDIDQ0NS40MTAxNTYgNjAwLjY1NjI1IDQ0NC42MDU0NjkgNjAwLjkxNDA2MiA0NDQuMDU4NTk0IDYwMC44MDQ2ODggQyA0NDMuOTQ5MjE5IDUzNC4yMzgyODEgNDQzLjk4NDM3NSA0NjcuNjMyODEyIDQ0NC4wNTg1OTQgNDAxLjA2NjQwNiBMIDQ0NC45Mzc1IDQwMS4wNjY0MDYgQyA0NDQuOTM3NSA0MDEuMDY2NDA2IDQ0NS44ODY3MTkgNDAyLjQxNzk2OSA0NDUuODg2NzE5IDQwNC4wMjczNDQgQyA0NDQuNzg5MDYyIDQ2OS41NzAzMTIgNDQ2LjU3ODEyNSA1MzUuMjIyNjU2IDQ0NS44MTI1IDYwMC43NjU2MjUgWiBNIDQ0NS44MTI1IDYwMC44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNjZGExNzQiIGQ9Ik0gMjI5LjUgMjc4LjQ1NzAzMSBDIDIyOS4zNTE1NjIgMjgwLjE3MTg3NSAyMzAuMTk1MzEyIDI4Mi45MTQwNjIgMjI4LjA3NDIxOSAyODMuNjA5Mzc1IEMgMjI2Ljk4MDQ2OSAyODMuOTcyNjU2IDIyMC4zMzIwMzEgMjg0LjU1ODU5NCAyMTguNTQyOTY5IDI4NC42Njc5NjkgQyAyMTYuNjA1NDY5IDI4NC44MTI1IDIxNi40OTYwOTQgMjgzLjcxODc1IDIxNi4zODY3MTkgMjgzLjcxODc1IEMgMjIwLjI1NzgxMiAyODEuMzQzNzUgMjI1LjAwNzgxMiAyNzkuMDQyOTY5IDIyOS41MzUxNTYgMjc4LjQ1NzAzMSBaIE0gMjI5LjUgMjc4LjQ1NzAzMSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+";

const LogoImage = ({ className = "" }) => (
  <img
    src={LOGO_SRC}
    alt="中文研究室 LOGO"
    className={`object-cover ${className}`}
  />
);


/* ==================== 模擬資料 ==================== */
const nextEvent = {
  date: "2026年3月12日 20:00",
  location: "線上 Google Meet 會議室",
  topic: "神話學與服飾史專題研討",
  papers: [
    "汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉",
    "陳皓渝：〈歷代冠禮所用服飾演變分析〉",
  ],
};

const resourceCategories = [
  {
    title: "文獻查找",
    icon: "Library",
    links: [
      { name: "中文古籍聯合目錄及循證平台", url: "http://gj.library.sh.cn/index" },
      { name: "古籍普查登記基本數據庫", url: "http://gjpc.nlc.cn/xlsworkbench/publish" },
      { name: "典津─全球漢籍影像開放集成", url: "https://guji.cckb.cn/" },
    ],
  },
  {
    title: "古籍 OCR",
    icon: "Edit3",
    links: [
      { name: "識典古籍", url: "https://shidianguji.com/zh" },
      { name: "古籍慧眼", url: "https://gujiocr.com" },
      { name: "中研院文字辨識與校對平台", url: "https://ocr.ascdc.tw" },
    ],
  },
  {
    title: "實用網站",
    icon: "Globe",
    links: [
      { name: "鑒字", url: "https://api.shufashibie.com/page/index.html" },
      { name: "漢典", url: "https://zdic.net" },
      { name: "古音小鏡", url: "https://kaom.net" },
      { name: "古詩文斷句 v3.1", url: "https://seg.shenshen.wiki/" },
      { name: "搜韻", url: "https://sou-yun.cn/index.aspx" },
    ],
  },
];

const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const events = [
  {
    id: 1,
    title: "三月讀書會",
    date: "2026-03-12",
    status: "upcoming",
    details:
      "【討論論文】\n汪博潤：〈經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究〉\n陳皓渝：〈歷代冠禮所用服飾演變分析〉",
  },
];

const researchArticles = [
  {
    id: 1,
    title: "經書與神話的交會：論顧頡剛之〈禹貢〉與〈五臧山經〉研究",
    author: "汪博潤",
    date: "2026-03-12",
    tags: ["經學", "神話學", "顧頡剛"],
    status: "待發表",
    abstract:
      "顧頡剛作為中國神話學奠基人的地位，對於現代神話學的創建，有開創性貢獻。惟其具體的神話學貢獻和典籍考證成果，如其對《山海經》的研究動機、經過和作品，尚無較專門的分析。同時，作為史學家，顧氏針對儒家經書〈禹貢〉之分析，亦常取用〈山海經．五臧山經〉部分進行對照分析。其研究成果的學術影響與參考價值，亦有討論之必要。本文針對這些問題，採用顧氏留下之一手資料，蒐集前人相關論述，附以己意，加以申述，希望對於民國初年學者援引神話材料證經、疑經之研究，有所發掘。",
  },
  {
    id: 2,
    title: "歷代冠禮所用服飾演變分析",
    author: "陳皓渝",
    date: "2026-03-12",
    tags: ["禮制", "服飾史", "冠禮"],
    status: "待發表",
    abstract:
      "本文以文獻分析法，藉《周禮》、《儀禮》、《禮記》及歷代史書〈禮志〉、〈輿服志〉等材料，考察歷代冠禮所用禮服之演變，並分析其所反映之禮制精神。若察歷代冠禮所用禮服，可分四類：冕弁類、梁冠類、襆頭類、巾帽類，四類禮服使用的身分等級、場合輕重各有制度，而施行於冠禮皆遵循《禮記．冠義》所謂「三加彌尊」之義；同時反映時代社會的變遷下，各朝代的禮服制度仍遵循「時為大」的制禮原則，以及「彰顯尊卑」以穩定秩序的目的。",
  },
  {
    id: 3,
    title: "王弼《易》學史地位的釐定──從牟宗三「兩層存有論」看「以老解易」的合理性",
    author: "林昱璋",
    date: "2026-02-03",
    tags: ["易學", "王弼", "牟宗三"],
    status: "已發表",
    abstract:
      "王弼《易》注「以傳解經」與「以老解易」兩個面向，自湯用彤以降遂成為諸多學者的共識。然而，經筆者耙梳，自古代以來對於王弼以老解易之批判，或多或少出自一定的意識形態，不論是政治立場或學術之爭，同時亦沒有根據文獻給出確切證據。而自牟宗三始，不但以「兩層存有論」分判儒釋道各家，更建構起王弼以老解易的面貌。然而，筆者以為若將牟宗三對於王弼《易》學的論述，置於其所提出的「兩層存有論」的架構下來看，反而有更加鮮明的儒家的影子，且從王弼《易》注諸多被討論有《老》學影子的原文來看，卻可以找到淵源於傳文之處。因此，筆者以為與其將王弼《易》學分為兩大面向，不如以「以傳解經」來作為王弼《易》學的代表。在不執著於王弼注《老》的淵源，而正面肯定王弼並非背離儒家《易》的傳統。",
  },
  {
    id: 4,
    title: "重探胡渭《禹貢錐指》之學術史定位",
    author: "汪博潤",
    date: "2026-02-03",
    tags: ["禹貢錐指", "胡渭", "清初學術"],
    status: "已發表",
    abstract:
      "胡渭《禹貢錐指》是清初學術的要籍之一。民初以來之學術史研究，常以「漢宋兼採」作為其學術定位的一個特點。這緣於敘述者限於自身體例與旨趣的需要，有選擇性地接受清儒對《錐指》的評價。為此，本文綜合分析《錐指》涉及之傳注與胡渭之個人表述，論證為何「知古」與「知今」才是完整理解《錐指》不容偏廢的兩端。又根據對30 條〈略例〉、全書174 組傳文之系統性解讀與檢覈，嘗試指出胡渭具備的「水利與水患」思維，是解讀《錐指》、通貫其古今之說的核心線索。由此，建議將清初之河渠水道要籍，一併納入現行研究的比較視閾中。此舉將為後續審視清初〈禹貢〉學之發展、尋求《錐指》在學術史上之合適定位，提供基於經學與「地理之學」兩個層面之佐證。",
  },
  {
    id: 5,
    title: "解構聖王與安頓性命──《莊子》外、雜篇「至德之世」的士人實踐之道",
    author: "李宗祐",
    date: "2026-02-03",
    tags: ["莊子", "外雜篇", "至德之世"],
    status: "已發表",
    abstract: "",
  },
  {
    id: 6,
    title: "林鵞峰《易》學特色析論──以《周易程傳私考》為例",
    author: "林昱璋",
    date: "2026-01-06",
    tags: ["易學", "林鵞峰", "日本儒學"],
    status: "已發表",
    abstract:
      "作為影響日本乃至東亞深遠的朱子學，在日日本所以以 快速發展的原因，在可追溯至江戶初期受到幕府支持的弘文院，在 後世昌平黌的前身， 而有開創所功的林羅山，林林鵞峰父子，在二人的學說便成為理解江戶初期儒學的重要關鍵 由於二人直繼五經的治學傾向，在 ，《易》為五經所首，在 林家，《易》學實可作為重要的探索對向在因林鵞峰有專門性，《易》著傳世，在本文特以其為主要討論對象 其一系列，《易》著，在可中勾勒 出尊崇宋學在但持開放態度吸收新舊學說在且仔細區分程朱，《易》學的特色 實際中其以尊崇的程頤，《易傳》來看，在可以理理出其闡明與發揮程《傳》義理林引歷史證程《傳》與引典明辭義三個核心作法，在可以發先雖其有廣博的治學態度在但仍不免有體系紊亂所失 而日義理的勒 上在可以發現鵞峰日嚴別程朱的同時在仍把握二者以理與太極的共通性在其後才藉著二人對卜筮不同的態度，在應自己 身為日本儒者的時代關懷 可以發現在林鵞峰作為江戶初期的學者在保有開闊的態度以吸收勾國東傳所學在並 進一步將所作為應自己身時代課題的材料，在對於管窺江戶初期，《易》學在實為一值得關注的對象。",
  },
  {
    id: 7,
    title: "何致「孤經」",
    author: "王亭林",
    affiliation: "臺灣師範大學國文學系",
    date: "2026-01-06",
    tags: ["孤經", "經學"],
    status: "已發表",
    abstract: "",
  },
];

/* ==================== 文章全文 blocks ==================== */
const article1Blocks = [
  {
    type: "heading",
    text: "前言",
  },
  {
    type: "para",
    text: "〈有瞽〉為《周頌》之一篇，全詩一章十三句：「有瞽有瞽，在周之庭。設業設虡，崇牙樹羽，應田縣鼓，鞉磬柷圉，既備乃奏，簫管備舉。喤喤厥聲，肅雝和鳴，先祖是聽，我客戾止，永觀厥成。」詩文記載周初行禮樂祭祀的景象，其中提及了周代之樂器等，又有外客觀禮或助祭，為學者從事周代名物制度等相關研究之重要文獻資料之一。",
  },
  {
    type: "para",
    text: "歷代學者對待〈有瞽〉詩之解釋，多據《毛詩正義》發義，試圖解釋「始作樂而合乎祖」之義。自宋以後，理學又有發合為祫祭之論，是解其經義，而於詩之其情其景略筆帶過。直至現代，方有學者關注詩中之樂器、樂制足有可考之處，如鄭建忠先生撰有〈周頌〈有瞽〉詩中之樂器探討〉就詩中出現之樂器考察形制，然僅止於形制之介紹，以合《詩序》之義。付林鵬先生撰〈《周頌‧有瞽》與周初樂制改革〉亦是在《詩序》義下，透過《逸周書‧世俘篇》與〈有瞽〉觀察其樂制的變革。",
  },
  {
    type: "para",
    text: "《毛詩正義》：「〈有瞽〉，始作樂而合乎祖也。」此乃歷代學者解釋本詩之濫觴，後世多從其說而未有疑義。",
  },
  {
    type: "para",
    text: "由此可見，當當今研究主要仍是在《詩序》中「〈有瞽〉為大武樂章之初成」的前提下開展論述。本文試圖跳脫《詩序》的窠臼，而著眼於詩中之景，透過詩中之「瞽」與《周禮》樂制下的官職、樂備分析，由此辨明詩中所述「有瞽」究竟為何，並釐清〈有瞽〉中陳備的樂器與演奏之樂官，藉以發掘本詩之場景與人物。",
  },
    {
    type: "heading",
    text: "「瞽」之職掌與源流",
  },
  {
    type: "para",
    text: "瞽，依《周禮》曰：「大師，下大夫二人，小師，上士四人，瞽矇，上瞽四十人；中瞽百人；下瞽百有六十人。」名之為「瞽矇」，據漢‧鄭眾（？-83）釋曰：「無目眹謂之瞽，有目眹而無見謂之矇。」以瞽者無瞳仁不可見物，矇雖有瞳仁亦不可見物，瞽與矇雖皆盲人，但依其眼眸狀態不同，而有不同稱呼，後乃合義以「瞽矇」為目盲者所任之樂官職。",
  },
  {
    type: "para",
    text: "瞽矇之職又分上、中、下瞽，各四十、一百、百六十，合計有三百人。據漢‧鄭玄（127-200）曰：「凡樂之歌必使瞽矇為焉。命其賢知者以為大師、小師。」是以瞽朦之中選其賢達者以任命為大師與小師，由以見得大師與小師亦皆為目盲者。",
  },
  {
    type: "para",
    text: "瞽矇概原於商學，鄭眾註《周禮‧大司樂》曰：「瞽，樂人。樂人所共宗也，或曰祭於瞽宗，祭於廟中，〈明堂位〉曰：『瞽宗，殷學也。』以此觀之，祭於學宮中」言瞽宗為殷之學校，而大司樂則祭於瞽宗，然未有資料說明大司樂是由瞽矇中選拔產生，但從文中可以看到瞽宗同時可作為商學之學校，此外又為祭祀大司樂的所在。從唐‧賈公彥（生卒年不詳）疏解鄭眾註：",
  },
  {
    type: "quote",
    text: "瞽矇掌樂事，故云「瞽，樂人。」樂人所共宗也云，或曰祭於瞽宗，祭於廟中者，此説非，故引〈明堂位〉為證，是殷學也。祭樂祖必於瞽宗者，案〈文王世子〉云：「春誦夏絃，大師詔之瞽宗」以其教樂在瞽宗，故祭樂祖還在瞽宗。",
  },
  {
    type: "para",
    text: "大司樂既祭於瞽宗，說明瞽宗所學應與樂相關，又從瞽矇職掌樂事，將瞽矇之瞽宗相聯繫。又見《禮記‧明堂位》：「米廩，有虞氏之庠也；序，夏后氏之序也；瞽宗，殷學也；頖宮，周學也。」說虞之學校稱為米廩，夏之學校稱為序，商之學校稱為瞽宗，周之學笑稱為頖宮，亦以瞽宗原出殷商之學校。由此更佐證瞽宗與商學的關聯性。",
  },
  {
    type: "para",
    text: "在明‧張次仲（1589─1676）解〈有瞽〉曰：「有者，昔無而今始有也。以瞽為樂官者，目無所見而于聲音審也。《周禮》有上、中、下三瞽，曰『在周之庭』則瞽尚是商之樂工，而今乃在周之庭也。」則解周初之樂工原為商之樂工，因商失德而奔周，故在周之庭，此說原本《史記‧周本紀》：「太師疵、少師彊抱其樂器而奔周。」據以申論，然於〈有瞽〉一詩是否可與此說合，猶有疑焉。然張氏之解瞽矇亦是自商而來，則瞽矇之職源於商，此說概為學者所宗。",
  },
  {
    type: "para",
    text: "從賈公彥之疏解可見瞽宗所教之科目既為樂，而從《禮記‧文王世子》曰：「春誦夏弦，大師詔之瞽宗，秋學禮，執禮者詔之；冬讀書，典書者詔之。禮在瞽宗，書在上庠。」學子需於春、夏之時從大師學歌樂、絲弦。前文有述，大師為瞽矇之賢達者，授業於瞽宗，而秋學禮，則亦在瞽宗，然而此並未書為大師，而稱「執禮者」，既不為大師，亦不當為小師或瞽矇。但吾人由此可見，瞽矇除了掌樂器、歌樂曲之職外，作為瞽矇中賢達者的大師亦承擔有教育禮樂之責。",
  },
  {
    type: "para",
    text: "又因瞽矇目不能見，於陳設樂器、行止上皆有不便，故設眡瞭為協助瞽矇之職，據《周禮‧眡瞭》曰：「凡樂事，相瞽。」言眡瞭祇要遇到樂事，皆作為瞽矇之副手。釋曰：「眡瞭三百人皆所以扶工，以其扶工之外無事，而兼使作樂。」認為眡瞭本職即是瞽矇之扶工，在此之外，無有業務而兼職奏樂等事宜。疏曰：「瞽矇及大師、小師皆不云廞者，以其無目，其瞽矇所云柷、敔、塤、簫管及琴瑟，皆當眡瞭廞之。」更細緻說明瞽矇、大師、小師皆為目盲者，不利於陳設樂器，是以皆由眡瞭協助陳備。從明‧季本（1485-1563）《詩說解頤》釋〈有瞽〉：「瞽以眡瞭相之，而為之設樂器者，皆眡瞭也。」清‧李光地（1642-1718）《古樂經傳》：「凡瞽矇所掌者，皆眡瞭代廞之。」清‧方苞（1668-1749）《周官集注》：「眡瞭兼為瞽矇廞樂器，則磬、編鍾、鼗鼓皆備矣。」 皆以此說解之。",
  },
  {
    type: "para",
    text: "有瞽非盲人之職一說，肖甫春先生提出《周禮‧樂師》「詔來瞽皋舞」之鄭眾註云：「瞽當為鼓，皋當為告，呼擊鼓者，又告當舞者，持鼓與舞俱來也。」以為瞽即為擊鼓者，「瞽」字之所以通為「鼓」，是因擊鼓者因精神振奮而睜大眼睛，是以於「鼓」字下加註形符「目」字而為「瞽」。",
  },
  {
    type: "para",
    text: "若以《周禮》考之，則可以見樂事中擊樂鼓之職並非瞽矇，而為小師與鎛師二職，小師為瞽矇中之賢達者，鎛師則與鼓曚渾不相關，若要說明瞽為擊鼓者，此說渾沌不精。",
  },
  {
    type: "para",
    text: "肖甫春先生又以《韓非子‧八說》曰：「上下清濁，不以耳斷，決于樂正，則瞽工輕君而重于樂正矣。」解瞽工必須察上下清濁，若決於樂正，則瞽工必須要能視之，以此斷瞽非盲樂師。",
  },
  {
    type: "para",
    text: "若察〈八說〉全段：",
  },
  {
    type: "quote",
    text: "酸甘鹹淡，不以口斷而決於宰尹，則廚人輕君而重於宰尹矣。上下清濁，不以耳斷而決於樂正，則瞽工輕君而重於樂正矣。治國是非，不以術斷而決於寵人，則臣下輕君而重於寵人矣。人主不親觀聽，而制斷在下，託食於國者也。",
  },
  {
    type: "para",
    text: "韓非子所論者，諸事應由國君親為親斷，而非託依下臣，若不如此，則下人必輕君以從臣屬之言。不遑論廚人、瞽工僅是韓非子所用形容比附之例而已，就韓非子論瞽工判樂之上下清濁，正常情況便是由於耳無誤，肖氏以瞽工須察上下輕濁而言瞽工非盲人，此說無法證明瞽非盲樂師。",
  },
  {
    type: "heading",
    text: "從詩中陳備之樂器考察〈有瞽〉",
  },
  {
    type: "para",
    text: "在〈有瞽〉詩中出現的樂器有鍾、磬、應、田、縣鼓、鞉、柷、圉、簫、管等十項樂器，以《周禮‧大師》之八音──金、石、土、革、絲、木、匏、竹分類考察，鍾為金音，磬為石音，應、田、縣鼓、鞉為革音，柷、圉為木音，簫、管為竹音，其中的土音、絲音、匏音三音未出現在詩中。",
  },
  {
    type: "para",
    text: "如按《周禮‧瞽矇》所載：「瞽矇，掌播鼗、柷、敔、塤、簫、管、弦、歌。諷誦詩，世奠繫，鼓琴瑟。掌《九德》、《六詩》之歌，以役大師。」解釋了瞽矇掌有鼗、柷、敔、塤、簫、管、弦等七項樂器，依八音考察，則會發現塤為土音，鼗為革音，弦為絲音，柷、敔為木音，簫、管為竹音，則未有金、石、匏三音。",
  },
  {
    type: "para",
    text: "將詩中的樂器和瞽矇職掌的樂器相互比對，可發現當時之奏樂者絕非皆由瞽矇所奏，且在現場亦非有八音樂器盡皆陳備，以下就詩中出現之各樂器，按《周禮》搜索其由何職所掌所奏，以此觀察當時當景下，樂團演奏的情形。",
  },
  {
    type: "list",
    items: [
      "鍾"
    ],
  },
  {
    type: "para",
    text: "鍾為金類之樂器，〈有瞽〉雖未有言，然以「設業設虡，崇牙樹羽」之語，業為編鍾、編磬所橫之大板，虡為直以立編鍾、編磬之腳，崇牙為業上用以縣鍾、磬所用，樹羽用以飾業、虡，從《樂書》：「筍虡，所以縣鍾磬。崇牙、璧翣，所以飾筍虡。」說明虡與崇牙是為鍾、磬所用的器材和裝飾，由以知其時為鍾磬設備之景，實並非無金石之音，而是詩中未有明言而已。",
  },
  {
    type: "para",
    text: "有說業、虡之用以懸鼓，然若依周之禮樂，鍾與鼓皆為重中之重，豈有鼓至而未有鍾之禮，且考之《周禮‧考工記》，有鍾虡、磬虡，卻無鼓虡，再以近代天星觀一號楚墓出土之懸鼓考之，則可以見其筍呈「ㄩ」形，鼓的懸掛方法亦非循鍾、磬之法懸吊。",
  },
  {
    type: "para",
    text: "雖據學者研究，天星觀一號楚墓之時期接近於戰國中期，然就目前現存的歷史資料，然就樂器的陳備而言，鼓是藉由鼓棒擊打鼓皮發出樂音，但鼓音短促，並非如鍾、磬之音悠揚，故在敲擊的時候，應保持鼓面的穩定，才能發出穩定的聲音，這個部分在天星觀一號楚墓之懸鼓亦可觀察，鼓身藉由左上、右上、下方三個方向固定，是以懸鼓不會如懸鍾、懸磬一般前後擺盪，假使以筍虡作為懸掛鼓身的器材圖示如下，則可以見其有二誤，一是鼓身不穩，無法敲出穩定的樂音；二是鼓面面向兩側，奏樂者在敲擊鼓面時揮動鼓棒容易敲到左右虡，且擺動的幅度不可太大，則敲擊出來的音量有限，是以此說不甚妥當。故此，筆者認為〈有瞽〉詩所設業、虡既應為鍾、磬使用，又磬以於詩後文有書，自不必再述，是以此之業、虡當為鍾所設。",
  },
  {
    type: "para",
    text: "鍾屬金音，金音由磬師所教，鐘師所奏。按《周禮‧磬師》：「磬師，掌教擊磬、擊編鍾。」即是教導樂工擊磬、擊編鍾，又按《周禮‧鍾師》：「鍾師，掌金奏。凡樂事，以鍾鼓奏《九夏》。」可以見前述之磬師所教的樂工之職即為鍾師，鍾師則負責在典禮上演奏金屬樂器。",
  },
  {
    type: "para",
    text: "鍾之演奏，皆不由瞽曚、大師、小師之職負責，概由於鍾的演奏方式非常複雜，同樣的鍾身，敲擊不同的部位會產生不同的音高與音色，據翁志文、辛玫芬以曾侯乙複製編鍾考察其音律：「編鍾撞擊點的不同，人耳會產生音高感知的差異，正鼓部和側鼓部在敲擊時，若稍微偏左或偏右，會出現三度的複合音高，且音色相對會較飽滿或輕量。」由此，演奏鍾時，並非祇需撞擊鍾身，而需撞擊特定位置，如此對於盲人而言，未免強人所難，是故由未盲之鍾師演奏亦在情理之中。",
  },
  {
    type: "list",
    items: [
      "磬"
    ],
  },
  {
    type: "para",
    text: "磬又分作頌磬與笙磬，從《樂律全書》所繪小樣可以見頌磬尺寸約二倍於笙磬，然皆為石音，編之亦為編磬。此外，或可從方位見磬之編制，笙磬懸於東，頌磬懸於西。此說概源於《儀禮‧大射》：「樂人宿縣于阼階東，笙磬西面，其南笙鍾，其南鑮，皆南陳。……西階之西，頌磬東面，其南鍾，其南鑮，皆南陳。」即說明笙磬坐東面西，頌磬坐西面東。",
  },
  {
    type: "para",
    text: "按王清雷先生考察西周早期的出土文物，雖然編鍾在殷商時期便已出現，但在周初並未受到重視，在當時用於「樂懸」之禮樂器僅有鎛鍾與特磬。編磬之形制較特磬而言，在大小、尺寸上皆更具制式，且按其音律序列懸之，不同於特磬單懸。 現代有杜娟先生按目前出土的編磬材料研究，僅發現西周早期的特磬，而未有編磬，進而提出西周中期以前的禮樂祭祀中仍使用特磬，直至周穆王在位（約11th BC）前後才將編磬納入「樂懸」之中，縱使如此，在出土的周孝王、夷王時期（約10th-9th BC）晉厲侯墓之編磬形制中考察當時的磬仍不具備成熟穩定的形制。 以〈有瞽〉之時若為周初「始作樂而合乎祖」之時，則可以見當時之磬並非編磬，而是特磬。",
  },
  {
    type: "para",
    text: "磬由磬師所教，眡瞭所奏，按前文引《周禮‧磬師》，磬師之職負責教授擊磬和擊鍾，祭祀之時磬師則負責演奏縵樂，而在樂事上的擊磬工作則由眡瞭負責。按《周禮‧眡瞭》：「眡瞭，掌凡樂事，播鼗、撃頌磬、笙磬，掌大師之縣。」眡瞭除了負責擊頌磬、笙磬之外，又掌有大師之縣鼓，此外，眡瞭和瞽矇之職於播鼗鼓一事又有重疊。",
  },
  {
    type: "para",
    text: "由鍾和磬的演奏工作以觀，可以見得瞽曚雖為樂職，但因為其本身目盲的限制，對於需要透過視力辨認的樂器，如鍾、磬皆不能由瞽曚負責，然而鍾、磬作為周禮樂中最重要的部分，可以體認但凡樂事之中，皆不會僅有瞽矇、大師、小師出席演奏。",
  },
  {
    type: "list",
    items: [
      "鞉、應、田、縣鼓"
    ],
  },
  {
    type: "para",
    text: "鞉、應、田、縣鼓屬鼓類，為革音，據《周禮》所述，瞽矇之職於革音祇有播鼗鼓，「鼗」「鞉」同字，為小鼓，樂工可持其柄搖之，以旁耳擊打鼓面發聲，概同於現今之撥浪鼓之範疇，除了瞽曚負責鞉鼓之外，眡瞭亦負責之。然鼓之種類繁多，且以《周禮‧大司樂》觀，不同的樂舞使用之鼓亦不相同：",
  },
  {
    type: "quote",
    text: "凡樂，圜鍾為宮，黃鍾為角，大蔟為徵，姑洗為羽，雷鼓雷鼗，孤竹之管，云和之琴瑟，《雲門》之舞。……凡樂，函鍾為宮，大蔟為角，姑洗為徵，南呂為羽，靈鼓靈鼗，孫竹之管，空桑之琴瑟，《咸池》之舞。……凡樂，黃鍾為宮，大呂為角，大蔟為徵，應鍾為羽，路鼓路鼗，陰竹之管，龍門之琴瑟，《九德》之歌，《九鞀》之舞。",
  },
  {
    type: "para",
    text: "從中可見有雷鼓、雷鼗、靈鼓、靈鼗、路鼓、路鼗，按《樂律全書》曰：「建鼓繪以雲雷，則謂之雷鼓. 繪以四靈、飛鷺，則謂之靈鼓、路鼓。」將雷、靈、路之分別歸於鼗、鼓身之畫紋，同屬於晉鼓之列。",
  },
  {
    type: "para",
    text: "此外按歷代之制，夏用足鼓，商用楹鼓，周用縣鼓、應鼓。周制之二鼓，按《禮記‧禮器》：「廟堂之下，縣鼓在西，應鼓在東。」按照鼓陳置的方位而有不同之名。",
  },
  {
    type: "para",
    text: "按《周禮‧小師》：「小師，掌教鼓、鼗、柷、敔、塤、簫、管、弦、歌。大祭祀，登歌擊拊。下管，擊應鼓。」可以見瞽矇所掌奏之樂器及鼓皆由小師所負責教導之，而在下管舞《大武》樂時，小師亦肩負演奏應鼓之職。又按《周禮‧眡瞭》：「賓、射，皆奏其鍾鼓。」（卷23，頁727），在賓禮、射禮之中亦奏鍾與鼓。此外，《周禮‧鍾師》亦有「以鍾鼓奏《九夏》」、「掌鼙，鼓縵樂」見鍾師亦有奏鼓之責。",
  },
  {
    type: "para",
    text: "從《周禮》之文獻可以發現，周制中的鼓種類繁多，且大多其職掌者皆與鍾合之，於此，瞽曚中的小師可擔任祭祀中的擊鼓者，鼓不如鍾或磬可將多個音階編成一架，相較之下，鼓本身大多作為提醒奏樂的節拍使用，故由小師演奏，合情合理。然而，在詩中之大鼓有出現應、田、縣鼓，此三鼓之別為何？按《毛詩正義》曰：",
  },
  {
    type: "quote",
    text: "知「應，小鞞」者，〈釋樂〉云：「大鼓謂之鼖，小者謂之應。」是應為小鼓也。〈大射禮〉應鞞在建鼓東，則為應和。建鼓、應鞞共文，是為一器，故知「應，小鞞」也。應既為小，田宜為大，故云「田，大鼓也。」",
  },
  {
    type: "para",
    text: "可以見應鼓為小鼓，田鼓為大鼓，至於縣鼓為何？按《樂律全書》曰：「田鼓與縣鼓乃一器二名耳，『應田縣鼓』謂應與田縣而鼓之。」則認為田鼓即是縣鼓。按《樂書》所載：「所謂縣鼓也，《禮》曰：『縣鼓在西，應鼓在東』，《詩》曰：『應𣌾縣鼓』，則縣鼓，周人新造之器，始作而合乎祖者也。」卻認為縣鼓為周代新制的樂器，應、田、縣鼓為由小至大的三種鼓器。若從文獻資料中，祇能確定應鼓與縣鼓確實出現在周制的禮樂祭祀之中，但尚無法確定田鼓與縣鼓之間的關聯性，以及在周制下負責演奏樂鼓的官職究竟分別為何。",
  },
  {
    type: "para",
    text: "但從已確認負責演奏樂器的官職中可以看到，瞽曚、小師作為目盲者，所演奏的鼓皆是偏小，如瞽曚負責奏鞉，小師負責奏應鼓。而較大的鼓則會由其他官職負責。由此分析，鼓身越小的鼓器在操作上較不需要視力輔助，而鼓身越大的鼓器，如同鍾、磬一般皆須有固定的敲擊點，則無法交由目盲者演奏。",
  },
  {
    type: "list",
    items: [
      "柷、圉"
    ],
  },
  {
    type: "para",
    text: "柷、敔之功用皆是用於提示樂舞的起始與停止，《尚書‧益稷》：「下管鼗鼓，合止柷敔，笙鏞以閒，鳥獸蹌蹌。」即是以奏樂之時，由柷、敔同時負責提示引導樂曲的行止。據前文所引小師、瞽矇之職，小師教柷、敔，瞽矇奏之。",
  },
  {
    type: "list",
    items: [
      "簫、管"
    ],
  },
  {
    type: "para",
    text: "竹音中之簫、管為小師所教，瞽曚所奏，此外，又設有笙師之職，按《周禮‧笙師》：「笙師，掌教吹竽、笙、塤、籥、簫、篪、笛、管、舂牘、應、雅，以教祴樂。凡祭祀、饗、射，共其鍾笙之樂，燕樂亦如之。」除小師教簫、管外，笙師所教有竹音之簫、篪、籥、管，匏音之竽、笙，木音之舂牘，革音之應、雅，而在祭祀之時，笙師須配合鍾聲吹笙之樂。竹音樂器頗多，因〈有瞽〉詩中祇書有簫、管二種，此僅就二種樂器說明。",
  },
  {
    type: "para",
    text: "管按其音高、音色等樂理條件，分為倍律、正律、半律之形制，倍律最大，正律次之，半律最小，其音高、音色皆刻於管上，　依十二律編成十二管，此外亦有按陰陽之聲變成六管者。",
  },
  {
    type: "para",
    text: "簫之形制，按《爾雅‧釋樂》：「大簫謂之言，小者謂之筊。」晉‧郭璞（276-324）注大簫二十三管，小簫十六管。於大簫之二十三管，《樂律全書》以《隋書‧樂志》論大簫應亦止十六管之數，當自黃鍾倍律排至夾鍾正律，小簫維持十六管，自黃鍾正律自夾鍾半律，則姑洗半律，仲呂半律，蕤賓半律，林鍾半律，夷則半律，南呂半律，無射半律，應鍾半律此八音，簫不能發，料想應不如此，惟此非本文論述重點，權以記之。",
  },
  {
    type: "heading",
    text: "〈有瞽〉中未出現的樂器",
  },  
  {
    type: "list",
    items: [
      "塤"
    ],
  }, 
  {
    type: "para",
    text: "塤為土音，由泥燒製成，此概無疑論。另有說土鼓為土音，因土鼓以瓦製成，為籥章所掌，《周禮‧籥章》：「籥章，掌土鼓豳籥。中春晝擊土鼓，龡《豳詩》以逆暑。中秋夜迎寒，亦如之. 凡國祈年于田祖，龡《豳雅》，擊土鼓，以樂田畯。國祭蜡，則龡《豳頌》，擊土鼓，以息老物。」可以見土鼓之使用僅限於奏豳風之詩所用，並從文中可以見土鼓一般為農業祈年等民生所用，與鼗鼓可用於祭儀之鼓概不相同。",
  },
  {
    type: "list",
    items: [
      "琴、瑟"
    ],
  },   
  {
    type: "para",
    text: "琴、瑟為弦，為絲音，按《禮記‧明堂位》：「拊搏，玉磬，大琴，大瑟，中琴，小瑟，四代之樂器也。」更釋琴與瑟皆有小大之分。琴瑟之弦數諸家論說不一，按《樂律全書》以琴皆七弦，瑟皆二十五弦之數，筆者姑引用之，又：「大者以黄鍾正律之管為尺；中者以太簇正律之管為尺；小者以姑洗正律之管為尺。」將琴、瑟各分大中小三種，依其音調之不同而調律。",
  },
  {
    type: "list",
    items: [
      "笙、竽"
    ],
  }, 
  {
    type: "para",
    text: "匏音為笙、竽之屬，有說因笙、竽之底部即由瓠瓜所製，故以此為匏音。由笙師所奏，二物形近而奏音不同，依其簧管之數有分二十四簧、十九簧、十三簧等。",
  },
  {
    type: "para",
    text: "綜上之八音，以〈有瞽〉之詩考之，共出現金、石、革、木、竹五音，並從樂器之演奏者來看，〈有瞽〉中並非祇有瞽曚出現在詩中，據表一整理，現場應同時有鍾師、眡瞭、小師等。",
  },
  {
    type: "para",
    text: "此之述「有瞽」則不單指瞽矇，吾人以知眡瞭需協助現場陳備樂器，應不為盲人，瞽矇為盲人，小師為瞽矇之賢達者，亦為盲人。鍾師之職則應不為盲人，但綜以八音之演奏與陳備，絕大部分的工作皆可以由瞽曚與眡瞭完成，或說此即可為樂工之指代，如前文引《韓非子》以瞽工為盲眼之樂工，此論可以通。",
  },
  {
    type: "table",
    caption: "表一：〈有瞽〉詩中出現之樂器之屬及演奏之職",
    headers: ["樂器", "八音分類", "演奏之職", "詩文"],
    rows: [
      ["鍾", "金", "鍾師", "設業設虡，崇牙樹羽"],
      ["磬", "石", "眡瞭", "鞉磬柷圉"],
      ["應、田、縣鼓", "革", "小師、鍾師", "應田縣鼓"],
      ["鞉（鼗）", "革", "瞽矇、眡瞭", "鞉磬柷圉"],
      ["柷、圉", "木", "瞽矇", "鞉磬柷圉"],
      ["簫、管", "竹", "瞽矇", "簫管備舉"],
      ["塤", "土", "瞽矇", ""],
      ["琴、瑟", "絲", "瞽矇", ""],
      ["笙、竽", "匏", "笙師", ""]
    ]
  },
  {
    type: "heading",
    text: "藉由〈有瞽〉考察當時之景",
  }, 
  {
    type: "para",
    text: "在詩中，可以看到前半段皆是眾樂器的陳備，唯有簫、管二類樂器是在「既備乃奏」之後方才出現。如此情形，明‧姚舜牧（1543-1627）曰：「簫管備舉者，别人之聲不混于器也。」是用以將樂聲與人聲分作區別。而清‧姜炳璋（1709-1786）曰：「既備乃奏，簫管備舉。言諸器既備而後奏樂，簫管亦備舉焉，兩備字，凡樂器皆在其中。」認為既書簫管，即是所有樂器皆以陳備完成。無論是分別樂聲或是言包含所有樂器之說，筆者皆認為不達。",
  },
  {
    type: "para",
    text: "從「設業設虡，崇牙樹羽」對應到鍾的陳備，「應田縣鼓、鞉磬柷圉」分別對應到鼓、磬以及木音之柷圉，按照此一順序，應有其邏輯性。",
  }, 
  {
    type: "para",
    text: "首先，鍾、鼓、磬三類在周之樂制中應為較重要的樂器，在《周禮》中有諸多詞語將鍾與鼓統稱，如大司樂「令奏鍾鼓」、樂師「以鍾鼓為節」、鍾師「以鍾鼓奏《九夏》」等等，皆可以見鍾和鼓是樂典中不可或缺的樂器。磬雖據上文所考，在周初的發展尚不完備，仍停留在特磬為主的狀態，但亦是樂典中非常重要的一環，如小胥「縣鐘磬」、磬師「教縵樂、燕樂之鐘磬」，同樣表明磬的重要性。且鍾、鼓、磬三類樂器體積龐大，確實需要提前設備妥當，方可演奏。",
  }, 
  {
    type: "para",
    text: "柷、圉作為提示音樂起始與結束的樂器，自然亦須準備。由此，詩中「既備乃奏」確實是在樂工準備好鍾、鼓、磬、柷、圉後，即可開始演奏之，「簫管備舉」則是在樂曲中有需要簫、管之聲，而是備而未吹的狀態。是以，詩文之陳述，應為實際上在樂典時的情景，並不具備要分別樂聲或是象徵所有樂器皆以陳備的背後意義。",
  }, 
  {
    type: "heading",
    text: "結語"
  },
  {
    type: "para",
    text: "綜上文論述，筆者針對〈有瞽〉詩中場景與周初樂制的考察上，主要提出二項主張：",
  },
  {
    type: "para",
    text: "第一，在樂器陳備上，〈有瞽〉詩中樂器雖未提及有鍾，但以周初鼓的形制考察「設業設虡，崇牙樹羽」句，並非描述懸鼓之景，再從鍾在周初樂制下的重要程度以及磬於詩文後有述，可知現場應有鍾。且〈有瞽〉詩中並未出現八音樂器，僅有金、石、革、木、竹五音，並非所有樂器皆有陳備。",
  },  
  {
    type: "para",
    text: "第二，在樂官之職上，以《周禮》與〈有瞽〉詩中所呈現的樂器考察，可以見詩中所見樂師並非僅指盲眼之瞽矇、小師，而另有眡瞭、鍾師等參與奏樂活動，由此推論，詩中之「有瞽」應作為樂工之統稱，並非僅有瞽矇一職在現場而已。並透過瞽曚職掌之樂器觀察，瞽曚一職概信由盲人所擔任。",
  },  
  {
    type: "para",
    text: "然而，透過〈有瞽〉並不能完整的考察出周初樂制的全貌，正如《詩序》言：「始作樂而合乎祖」，學界概信〈有瞽〉之詩所述場景可能僅是初始作樂而在祖廟練習試奏而已，並非是完整儀典，如此，便需仰賴更多文獻材料輔助，方能一窺周初樂制之全豹。 ",
  },  
];

const article2Blocks = [
  {
    type: "heading",
    text: "前言",
  },
  {
    type: "para",
    text:
      "義堂周信（1325-1388），日本土佐國高岡郡人，俗姓平氏，法號周信，道號義堂，師從臨濟宗禪僧夢窗疏石（1275-1351），和同宗師弟絕海中津（1334-1405）並稱「五山文學雙璧」，為五山文學重要的代表人物之一。",
  },
  {
    type: "para",
    text:
      "康永元年（1342），義堂周信年十八，欲往中國江南求法，但因遇風雨患病，最終無法成行。後隨侍夢窗疏石於天龍寺，直至觀應2年（1351）夢窗疏石圓寂，受春屋妙葩（1311-1388）所請，乃應關東管領足利基氏（1340-1367）聘，往鐮倉圓覺寺、善福寺、瑞泉寺等地住持。康歷2年（1380），應幕府大將軍足利義滿（1358-1408）之召，於京都講授中國經典，同時住持建仁寺。嘉慶2年（1388）4月，義堂周信於南禪寺圓寂，世壽64歲。",
  },

  {
    type: "para",
    text:
      "義堂周信著有漢詩文集《空華集》，據蔭木英雄統計，《空華集》納其詩作總計1900首，其中七言絕句1008首，七言律詩601首，五言律詩193首，五言絕句56首，四言詩17首，六言絕句11首，古詩7首，歌3首，五言排律2首，七言排律與楚辭各1首， 其詩作數量非常可觀，為學者研究五山文學前期漢詩創作之重要參考文獻。",
  },

  {
    type: "para",
    text:
      "《空華集》之漢詩於義堂周信《空華日用工夫略集》中多有提及，以赴華歸日的僧侶與義堂的口語中得知，中國亦有文士對其詩的喜愛與推崇，如永和2年（1376）4月20日條：「比在中國，多見公所作詩文，唐人皆稱道。」言義堂詩作足可比擬中國之詩。又應安2年（1369）7月14日條：",
  },
  {
    type: "quote",
    text: "余十五年前，在京之西山，作〈送藝上人歸九州〉詩曰：「海上仙山即九州，平生有意踏鯨游。秋窓一夜閑欹枕，望看靈槎犯斗牛。」今日上人來謁，且云以此詩及所記五六首，擧似唐人，唐人皆云疑是大唐人作也。",
  },
  {
    type: "para",
    text:
      "從其年代已屆明朝洪武年間，若按文中所述15年前之事因屬元朝之事，並由義堂周信所載，其所作之詩被疑為「大唐人」所作，可見其詩之風格應近似於唐朝詩作，但從文中並未能知當時漢人如何認為義堂之詩作近於唐詩。又應安8年（1375）3月18日條：",
  },
  {
    type: "quote",
    text: "淨智無聞聰知客來，問其本貫，乃薩州（薩摩國）人，話曰：「嘗入江南，與端侍者會于楚石會中，會中而多見公所作之詩章，楚石謂是入唐者所作也，鄕人皆曰不然，楚石不信，乃再三，乃曰不謂日本國有此郞耶！」",
  },
  {
    type: "para",
    text:
      "文中曰楚石者，應為中國禪僧梵琦（1296-1370），字楚石，楚石觀其詩作，語發其詩為曾遊覽過中國的日人所作，還原語境，楚石應是在日本僧人聚會中，故楚石當已事先知曉該詩章非中國人之作，其所讚嘆，吾人可知以其詩作的意象和詩法或與中國詩人相似。",
  },
  {
    type: "para",
    text:
      "現代兩岸學者多將五山文學作為一個整體研究，針對義堂周信《空華集》詩文的研究較少，而目前研究亦多就與杜甫（712-770）詩作的連結為討論中心，以下列略舉研究五山文學兼及義堂詩作或專論《空華集》之研究論文為例：",
  },
  {
    type: "list",
    items: [
      "尚永亮〈論前期五山文學對杜詩的接受與嬗變──以義堂周信對杜甫的受容為中心〉"
    ],
  },  
  {
    type: "para",
    text:
      "該文考義堂詩對杜詩章法、句式、字詞的襲用與轉化，發現義堂詩在五律上更多的受益於杜甫，並整理義堂學杜的手法有三：（一）直接襲用杜詩字詞；（二）用其句法和詩意；（三）用其章法及變易次序，雖提及義堂七律詩更偏向晚唐詩、宋詩詩風，然受限於題旨，未有深論。",
  },
  {
    type: "list",
    items: [
      "曹逸梅《日本五山禪林的典範選擇與詩歌創作》"
    ],
  },
  {
    type: "para",
    text:
      "曹氏認為五山禪僧詩歌創作風格受蘇軾（1037-1101）、黃庭堅（1045-1105）、杜甫三人影響最大，並進一步將義堂詩文中的杜甫形象整理分為三類：杜詩成就的評價、杜甫君臣節義、憂國憂民的道德標舉、杜甫重視人情的表現，逐步構成在日本視域下獨有的杜甫形象。亦論及五山詩文對蘇門酬唱及江西詩派詩法的承繼與轉化，從字法、用事、句法三個層面展開論述。",
  },
  {
    type: "list",
    items: [
      "汪磊《義堂周信《空華集》及《空華日用工夫略集》研究》"
    ],
  },
  {
    type: "para",
    text:
      "以義堂對杜詩的借化用提出「化舊詞出新意」與「借舊句出新意」的手法，雖論義堂詩與杜詩名貿實易，然究其論述，則稍嫌武斷，如以義堂〈讀李杜詩戱酬空谷應侍者〉「太白飄零子美窮」比附杜甫〈不見〉「飄零酒一杯」，以「飄零」稱李白（701-762），便直以義堂書太白「飄零」化自杜甫。實則杜甫亦有以「飄零」自況，如〈通泉驛南去通全縣十五里山水作》「我生苦飄零」句。 或如義堂〈天龍火後，化緣四州，山行有作〉「摩挲淚滿襟」比附杜甫〈蜀相〉「常使英雄淚滿襟」，「淚滿襟」此意象並非杜甫獨創獨有，亦多見於其他詩人。",
  },
  {
    type: "list",
    items: [
      "胡睿慈《『空華集』中的中國詩文受容—「夢」的表現》"
    ],
  },
  {
    type: "para",
    text:
      "其搜集《空華集》中提及「夢」與「山」的意象比較，認為義堂詩的「夢」與「山」意義相近，以嶄新的視角解析義堂詩，跳脫比附杜詩的窠臼。",
  },
  {
    type: "list",
    items: [
      "馬蕙穎《義堂周信《空華集》漢詩研究》"
    ],
  },
  {
    type: "para",
    text:
      "針對義堂詩的內容提出六個特色：（一）「日用之境」的禪境；（二）富有「理」的詩意；（三）枯淡閑靜的超脫詩趣；（四）融合禪的悠遠詩境；（五）幽國傷時的沉重詩風；（六）數量眾多的用典。惜雖論義堂之詩風、詩法，指出義堂漢詩之特色，限於論文主題，並未深論。",
  },
  {
    type: "para",
    text:
      "由此筆者整理《空華日用工夫略集》之義堂論詩條目及1973年思文閣出版《五山文學全集》第二卷所收《空華集》卷一至卷十所錄詩作試分析之， 發現義堂詩對中國詩文的擷取可謂頻繁，且義堂善於將中國的詩作中的人物、意象多次襲用，或融中國的逸事於其中，其對於中國的典故、逸事及意象信手拈來，說明詩人對於中國文化有極深的了解，以下先論義堂之詩風與詩法，後整理《空華集》中對中國詩文意象的擷取，進一步分析其用典出處及義堂對於中國典故的使用與轉化。",
  },
  {
    type: "heading",
    text: "脫俗弊之詩風與重音律之詩法",
  },
  {
    type: "para",
    text:
      "義堂周信在《空華日用工夫略集》對於當時詩人應當如何作詩分以詩風與詩法二個層面提出主張：",
  },
  {
    type: "list",
    items: [
      "詩風"
    ],
  },
  {
    type: "para",
    text:
      "義堂以作詩需有「脫俗」氣象，而不可淪於一般俗套。應安三年（1370）2月23日條：「今時學詩者，專以俗樣而為習，是可戒也。」以當時詩人學習作詩的典範仍以俗為範， 在義堂看來非常不妥，足以為戒，而何為俗？在應安三年8月4日條有解：",
  },
  {
    type: "quote",
    text: "今時僧詩皆俗樣也，學高僧詩最好。今僧詩例學士大夫之體，尤可笑也。官樣富貴、金玉文章、衣冠高名崇位等，弊尤多，弊則必跡生，跡生則必改，復古高僧之風可也。",
  },
  {
    type: "para",
    text:
      "義堂認為學詩者最好的學習高僧詩偈，然而其時作詩多流於腐弊的仕宦生活、追名逐利，則弊俗橫生，如要改正，應該回歸古時高僧之詩風。在應安五年（1372）2月11日條：「今時禪子作偈，變爲俗人秀才花鳥之詞，是可痛惜也。假令作詩，當學禪祖之體云云。」揭示在義堂之時， 禪僧作偈語多已脫離佛教世界，而淪為俗世花鳥風月之語，而作詩應從禪祖慧能的詩偈，詩既平易，又能蘊藏妙悟。於康曆二年（1380）5月18日條即有義堂周信於聚會上制止唱和之舉：「宗椿侍者乞題，集諸兄弟作頌，以化青絹扇子而爲題，奮例以物爲賭，余制而令止之，蓋破俗弊也。」即說明義堂將禪林詩作主題僅談花論月的現象視為俗弊。",
  },
  {
    type: "para",
    text:
      "在中國，黃庭堅亦反對詩文「俗氣」，而山谷之「俗」與義堂之「俗」不盡相同，義堂之「俗」多在於詩人選題之上多選擇花鳥風月、玩物娛情的事物進而使得詩文空洞，言之無物，又無法內蘊禪理。而山谷之「俗」則在詩法及個人精神修養之上，〈題意可詩後〉有云：「寧律不諧而不使句弱，用字不工不使語俗。」提及作詩寧可格律不諧、用字不工，寧可破格，也不可使詩句氣弱語俗， 又於〈與黨伯舟帖七〉談詩作：「詩頌要得出塵拔俗，有遠韻而語平易。」在立意上不可流於俗套，還應當詩語平易近人，但又富含高遠的風韻。在立身上，山谷同樣以「不可俗」為處世標準：",
  },
  {
    type: "quote",
    text: "士大夫處世可以百為，唯不可俗，俗遍不可醫也。或問不俗之狀，老夫曰難言也。視其平居無以異於俗人，臨大節而不可奪，此不俗人也。平居終日如含瓦石，臨事一籌不畫，此俗人也。",
  },
  {
    type: "para",
    text:
      "於黃雅莉先生〈杜甫對江西詩派內涵風格的影響〉中提及，江西詩派的詩風反對流俗的精神特質，便指詩歌風骨高峻，即在樸拙剛健的藝術特徵中體現高潔的人格修養。",
  },
  {
    type: "para",
    text:
      "據曹逸梅《日本五山禪林的典範選擇與詩歌創作》論黃庭堅深厚的禪學修養、詩偈、藝術等方面極深的境界，成為五山禪林學習的典範， 而相較山谷推崇積極入世的高潔人格，義堂將「非俗」轉化為禪宗清淨修道的出世精神。黃詩既為五山的典範，會有如此差異，依筆者臆測，其因有三：",
  },
  {
    type: "para",
    text:
      "1.	政治因素：義堂周信雖受幕府器重，入世甚深，但其本質既為貴族，又為禪僧，身分清貴，而黃庭堅為仕宦，深受儒家經世思想薰陶，用行舍藏，縱使禪學素養極高，卻未跳脫中國士人使命的窠臼。",
  },
  {
    type: "para",
    text:
      "2.	環境因素：日本雖值室町幕府前期，後醍醐天皇於奈良開南朝，與光明天皇北朝相對，戰亂頻仍，然義堂既為禪僧，社會階級較高，生活閒適，此亦體現在其詩作主題上，除了少數悲傷戰事、南征之詩外，大多為僧門間的酬唱次和、歌詠景物之作。黃庭堅值北宋末年，時局動盪，又陷於新舊黨爭，生活顛沛。",
  },
  {
    type: "para",
    text:
      "3.	文化因素：「禪」與「詩」的分限在宋時便已逐漸模糊，嚴羽《滄浪詩話》有「論詩如論禪」之說，在王熙元先生〈從「以禪喻詩」論嚴羽的妙悟說〉提及，近體詩絕句的體式與偈頌相合，又受唐詩比興、文采的風格影響，原本不講押韻的偈語逐漸轉變為亦偈亦詩的新體，蘇、黃詩亦有創發禪悟的境界，江西詩派更主張「悟」詩的重要性。",
  },
  {
    type: "para",
    text:
      "從義堂周信，吾輩亦可觀察五山禪僧對於中國詩文、詩法的擷取從不全面，這個現象在義堂周信的詩法特色中更是明顯可見。",
  },
  {
    type: "list",
    items: [
      "詩法"
    ],
  },
  {
    type: "para",
    text:
      "義堂重音律，於《空華日用工夫略集》中見他人來問作詩之法，或探討中國詩人聲律謬誤之言，如應安元年（1368）追抄月未詳11日條：「張翰當日憶鱸魚，改作季鷹，蓋翰字本平聲，老杜作仄用，自爾詩家遂作仄聲，所謂捨祖而取孫也。」解「翰」字音律，認為杜甫破格作仄聲，而後世作詩皆以為仄聲，此法尤不可取。又永和二年9月6日條：",
  },
  {
    type: "quote",
    text: "爲安藏主改近作數字，曰：「釣竿東掣長鯨罷，貝葉西駄瘦馬歸。」，安曰：「駄字恐是去聲。」，余曰：「平聲。李白『十五吳姬細馬駄』（按：應作「吳姬十五細馬馱」）、東坡詩『二八佳人細馬駄』、山谷詩曰『宗文提轡宗武扶，落日寒驢駄醉起』（按：應作「宗文守家宗武扶，落日蹇驢馱醉起」）皆作平聲用。」",
  },
  {
    type: "para",
    text:
      "「駄」通「馱」，義堂以李白〈對酒〉、蘇軾〈李鈴轄座上分題戴花〉、〈老杜浣花溪圖引〉三首詩為安藏主講解聲韻，依義堂之時代，考於《洪武正韻》，馱有平聲之唐何切（駝小韻）與去聲之杜臥切（惰小韻）。海藏主之所以認為是仄聲，直將駄作杜臥切，依其詞性，釣竿對應貝葉為名詞；東對應西為副詞，掣對應駄為動詞，駄即表達背負一動作，則應獨作唐何切。",
  },
  {
    type: "para",
    text:
      "除了格調音律之外，義堂追求詩之用字須平易，且應字字有來處。應安三年8月13日條：「師姪梵芳上人來自東勝，出近作數首，一則歸田詠，一百五十六韻，效古詩體，艱澁用奇字，往往不可讀也。」說明作詩不應一味追求語詞、用字之險峻。又應安二年3月5日條：「雲壑求改詩，詩曰不吹松，余疑，不吹松者何義。又有謂言二字，於律詩不可用也。」解「不吹松」從未有典故，不能知其義，又解「謂言」雖曾見於元稹詩〈青雲驛〉，但不可用於律詩。",
  },
  {
    type: "para",
    text:
      "此外，義堂講詩常為學者講述詩文典故，如講唐僧皎然詩「虎落犀渠」典出《漢書‧晁錯傳》：「爲諸子講高僧皎然詩畢，詩中有虎落犀渠四字，出自前漢《晁錯傳》，謂外蕃竹柵之類。犀渠乃犀革甲也。」。又或是用典錯誤而記，如弓詩錯引「杯弓蛇影」，被義堂所哂：「龍門至，求改弓詩，詩多用盃蛇事，可笑，姑點一二首而還之。」",
  },
  {
    type: "para",
    text:
      "綜觀義堂周信的詩法，過於講求用韻的嚴謹，由此，詩人為求合韻而自創許多怪詞強附，如「怪哉蟲」、「萬簇峰」、「嚼頻」等詞，後世研究者多無以解其義，只得強行比附。",
  },
  {
    type: "heading",
    text: "對中國典故的受容",
  },
  {
    type: "para",
    text:
      "在曹逸梅《日本五山禪林的典範選擇與詩歌創作》認為五山禪林已承繼宋代詩人提倡以才學為詩，「資書以為詩」的特點，此和禪僧透過引用典故來展示博學，並從五山禪僧對於使用典故的討論中，可以發現黃庭堅用事觀念對此的重要影響。",
  },
  {
    type: "para",
    text:
      "在義堂詩作中亦有不少用典的情形，筆者粗略整理義堂有提及中國詩人或使用中國典故之詩作73首，表列於後，從義堂使用的中國典故來源豐富，可以看出詩人本身學識之博深，然礙於筆者能力有限，此絕非義堂詩使用中國典故之全貌。",
  },
  {
    type: "para",
    text:
      "從詩文中觀察，義堂周信詩中對中國詩文的受容主要針對中國詩人及中國詩文意象、典故使用的轉化，其中許多典故的使用在中國詩人筆中並不會如此使用，如〈因修菊笆謝人惠竹〉將修剪菊花園籬笆的困難比喻為「趙氏孤兒」一般困難。",
  },
  {
    type: "para",
    text:
      "義堂詩善將人物故事融入詩作之中，如〈陪大喜師觀櫻花次有作〉：「海棠不入杜陵篇，流落巴雲蜀水遊。幸是櫻花無此恨，開顏得近法王筵。」直接明舉杜甫從未寫過歌詠海棠之詩作，此後杜甫流落四川，藉以起興，歌詠櫻花與大喜師二者相互成趣。",
  },
  {
    type: "para",
    text:
      "〈次韻贈益友石〉：「賛公不負杜陵知，來往風流笻一枝。想見高齋投宿夕，焚香欸欸話幽期。」以杜甫詩文中的贊公意象入詩，由此歌詠友人。",
  },
  {
    type: "para",
    text:
      "在義堂詩文中大多使用此法，由於其臨濟宗的法統傳承，詩中除了常見的李白、杜甫、陶淵明外，義堂也常使用中國禪宗或佛教中的典故，如〈送友知容二首〉之二：「見說家山有竹房，歸來整頓舊門牆。但看圓悟居昭覺，從此兒孫遍大唐。」引用宋代知名臨濟宗僧人圓悟克勤禪師及其住持四川昭覺寺的典故。",
  },
  {
    type: "para",
    text:
      "〈別源和尚遣偈語拆成四首贈龍侍者〉之三：「拚身窮到龍淵底，心苦分明甘如醴。黃蘗當年老婆心，痛棒三度打臨濟。」以唐代知名禪宗僧人黃檗希運禪師及其徒弟開創臨濟宗的臨濟義玄禪師之典故入詩。",
  },
  {
    type: "para",
    text:
      "〈扇面雪江獨釣〉：「江上群山雪打圍，分明寫出柳州詩。漁翁不解催詩思，只愛江魚上釣絲。」藉雪、江、釣翁的意象直指柳宗元〈江雪〉詩，並明白點出眼前景色就是柳宗元筆下詩景。",
  },
  {
    type: "para",
    text:
      "義堂亦有直接將詩文化用，納入詩句之中，如〈又和答少室兼簡芳庭三首〉之三：「教外兼將通教內，雌黃賢首與天台。禪餘對客揮談塵，不盡長江袞袞來。」直接將杜甫〈登高〉「不盡長江袞袞來」詩句寫入，絲毫未有擴寫或化用。",
  },
  {
    type: "para",
    text:
      "而〈讀李杜詩戱酬空谷應侍者〉中則將詩句奪胎：「太白飄零子美窮，也知國亂血流紅。酒酣鯨背天非遠，詩罷鷗邊日過中。渭北年年春樹老，江東處處暮雲空。唐風廢矣無人繼，欲寫憂心擬草蟲。」化用杜甫〈春日憶李白〉「渭北春天樹，江東日暮雲」句，由此處可以推知，義堂應以接觸江西詩派的詩法理論，但其奪胎換骨、點鐵成金等詩法的運用，則於義堂詩中並沒有辦法觀察出頻繁、系統性的使用。",
  },
  {
    type: "para",
    text:
      "另一種引用則是將詩題直接引入詩作，透過所引詩之詩意帶領詩作。如〈予以詩卷贈伊大圓乃作二詩見謝和以為戱二首〉之一：「少年已受空王印，誰復區區學俗儒。書籍送歸天祿閣，缽盂擎向上方廚。欲吟伐木酬諸友，難把雕蟲謁壯夫。想爾禪餘揮玉塵，清風斖斖講唐虞。」將多典融入一詩，其中引《詩經‧小雅之什‧鹿鳴‧伐木》一篇，〈毛詩序〉：「〈伐木〉，燕朋友故舊也」說明詩意為宴饗朋友，呼應詩作以〈伐木〉戲酬友人之意。",
  },
  {
    type: "para",
    text:
      "此外，義堂詩也使用一些中國詩文中並未有的意象加入詩中，如：〈因修菊笆謝人惠竹〉：「炎天種菊趂秋期，保育難如立趙兒。多謝此君知此意，碎身粉骨護東籬。」在中國詩人中並不會將「趙氏孤兒」此一意象和修剪圍籬的艱苦合併。",
  },
  {
    type: "para",
    text:
      "〈中輔題雪求和，迅筆和之〉：「每憶神光立雪庭，曾將趙璧換秦城。童兒只愛團為塔，不解齊腰到天明。」以友人以雪為題，讓義堂和之，將「雪」與「和氏璧」兩種截然不同的意象相合，此在中國詩人中未有所聞。",
  },
  {
    type: "heading",
    text: "結語",
  },
  {
    type: "para",
    text:
      "透過對義堂周信漢詩的整理與觀察，可以發現其使用典故的範疇不僅止於對於杜甫詩文的受容與意象擷取，針對許多漢籍典故皆有使用，同時，從義堂的詩風與詩法中可以看出宋詩詩法理論的影響，由此，針對義堂周信的漢詩，以其深度與廣度二種研究方向，筆者認為值得探討，礙於筆力有限，相關專題有伺後人研究：",
  },
  {
    type: "list",
    items: [
      "深度：以江西詩派對義堂周信漢詩創作的影響"
    ], 
  },
  {
    type: "para",
    text:
      "以黃庭堅為代表的江西詩派主張「點鐵成金」、「奪胎換骨」，提倡煉字、抝句的詩法理論，我們已可從粗略的觀察中發現義堂詩針對某些特定理論的揚棄，在大部分的詩作中，義堂仍維持傳統唐詩「四三」、「二二三」句式，但在格律上的表現卻常出現抝字的情形。",
  },
  {
    type: "list",
    items: [
      "廣度：整理義堂周信漢詩對中國典故的接受"
    ], 
  },
  {
    type: "para",
    text:
      "義堂不僅使用中國詩人及其詩文的意象，更兼顧《詩經》、《左傳》、《楚辭》等中國經典，甚者有以稗官野談入詩，說明詩人對於中國的了解非常深刻，透過更全面的整理，或可得詩人引用典故、意象的內在邏輯或日本對於中國詩文意象的轉化和新意。",
  },
];


/* ==================== 文章專欄資料 ==================== */
const FIXED_CATEGORIES = ["全部", "學術筆記", "讀書會紀錄", "文學創作"];

const columnArticles = [
  {
    id: 1,
    title: "《詩經‧有瞽》中「瞽」與周初樂制的考察",
    author: "王亭林",
    affiliation: "臺灣師範大學國文學系博士候選人",
    contact: "zxc998775@gmail.com",
    date: "2026-03-04",
    category: "學術筆記",
    tags: ["詩經", "有瞽", "周禮", "樂制"],
    summary: "〈有瞽〉作為《詩經‧周頌》之一首，《詩序》解釋「始作樂而合乎祖」，詩即描寫周初制禮作樂成而奏之於祖廟的情景。歷代研究多貼合《詩序》辨義，直至現代，方始關注本詩陳備的樂器與周朝初年樂事之關聯。本文主要透過《周禮》考察〈有瞽〉詩中「瞽」的意義及其由來以及瞽與詩中出現的樂器彼此的關聯，藉以還原詩中之景。由此辨明「瞽」作為盲人樂師，源出於商代之學，並在〈有瞽〉詩中並非僅有「瞽」為演奏者，且非所有樂器皆可由「瞽」所奏，是以詩中的「有瞽」實作為樂工之通稱，並非單指盲人樂師。",
    blocks: article1Blocks,
  },
  {
    id: 2,
    title: "淺談義堂周信漢詩特色",
    author: "王亭林",
    affiliation: "臺灣師範大學國文學系博士候選人",
    contact: "zxc998775@gmail.com",
    date: "2026-03-04",
    category: "學術筆記",
    tags: ["義堂周信", "空華集", "空華日用工夫略集", "黃庭堅"],
    summary: "義堂周信為日本五山時代前期重要的禪僧，其與同宗師弟絕海中津並稱為「五山文學雙璧」，同時著有個人漢文日記輯錄《空華日用工夫略集》，漢詩文集《空華集》傳世，收錄其漢詩1739首，為學者研究五山文學前期詩文風氣的重要文獻。目前兩岸三地學者對義堂周信漢詩文的研究主要以其對杜甫詩文的受容及個人形象，或將五山文學作為一個整體研究，並未深入分析詩作。本文以《空華日用工夫略集》整理記錄義堂周信的詩風及詩法，並分析《空華集》中的漢詩，整理其對中國典故、意象的使用，企圖分析義堂周信詩文創作的脈絡與特色。",
    blocks: article2Blocks,
  },
];

/* ==================== 共用元件 ==================== */
const ThemedButton = ({ active, children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border font-sans spring-transition hover:scale-105 active:scale-95 ${className}`}
    style={
      active
        ? {
            background: "var(--c-nav-active-bg)",
            color: "#fff",
            borderColor: "var(--c-nav-active-border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }
        : { borderColor: "transparent", color: "var(--c-text-secondary)" }
    }
  >
    {children}
  </button>
);

const PageHeader = ({ title }) => (
  <div className="text-center space-y-4">
    <h2 className="text-3xl font-bold font-sans theme-heading">{title}</h2>
    <div
      className="w-16 h-1 mx-auto rounded-full"
      style={{ background: "var(--c-accent)" }}
    />
  </div>
);

/* ==================== 頁面：首頁 ==================== */
const HomePage = ({ setPage }) => {
  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      {/* 頂部主視覺 */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col items-center text-center glass-panel shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-widest font-sans theme-heading relative z-10">
          中文研究室
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-serif content-justify theme-text-secondary relative z-10" style={{ textAlignLast: "center" }}>
          「獨學而無友，則孤陋而寡聞。」
          <br />
          ──《禮記‧學記》
        </p>

        <button
          onClick={() => setPage("about")}
          className="text-white px-8 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 mx-auto spring-transition hover:scale-105 active:scale-95 border relative z-10"
          style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}
        >
          探索研究室 <Icon name="ChevronRight" size={20} />
        </button>
      </section>

      {/* 互動式快速導覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "文章專欄", icon: "PenLine", target: "articles" },
          { title: "討論進度", icon: "ClipboardList", target: "columns" },
          { title: "資訊分享", icon: "Library", target: "books" }
        ].map((item, i) => (
          <div key={i} onClick={() => setPage(item.target)} className="p-8 rounded-3xl glass-panel glass-card-hover cursor-pointer group flex flex-col items-center text-center border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm" style={{ background: "var(--c-badge-bg)", color: "var(--c-primary)" }}>
              <Icon name={item.icon} size={28} />
            </div>
            <h3 className="text-xl font-bold font-sans theme-heading transition-colors duration-300 group-hover:text-[var(--c-accent)]">{item.title}</h3>
          </div>
        ))}
      </div>

      {/* 近期研討區塊 */}
      <section className="rounded-3xl p-8 md:p-12 glass-panel glass-card-hover transition-all duration-500 hover:shadow-xl hover:bg-white/50">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 backdrop-blur-sm font-sans border"
          style={{ background: "var(--c-badge-bg)", color: "var(--c-badge-text)", borderColor: "var(--c-badge-border)" }}
        >
          <Icon name="Calendar" size={16} /> 近期研討
        </div>
        <h2 className="text-3xl font-bold mb-4 font-sans theme-heading">三月讀書會</h2>
        <div className="space-y-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm transition-colors hover:bg-white/70">
          {[["時間", nextEvent.date], ["地點", nextEvent.location], ["主題", nextEvent.topic]].map(([l, v]) => (
            <p key={l} className="flex items-start gap-3 theme-text">
              <strong className="min-w-16 font-sans shrink-0">{l}：</strong>
              <span>{v}</span>
            </p>
          ))}
          <div className="flex items-start gap-3 theme-text">
            <strong className="min-w-16 font-sans shrink-0">論文：</strong>
            <ul className="space-y-2">
              {nextEvent.papers.map((p, i) => (
                <li key={i} className="leading-relaxed relative pl-4">
                  <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--c-accent)" }}></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ==================== 成員資料 ==================== */
const members = [
  { name: "王亭林", school: "臺灣師範大學", dept: "國文學系博士生", field: "春秋學" },
  { name: "李宗祐", school: "臺灣師範大學", dept: "國文學系博士生", field: "先秦思想" },
  { name: "林昱璋", school: "臺灣師範大學", dept: "國文學系碩士生", field: "易學" },
  { name: "朴玹模", school: "臺灣大學", dept: "哲學研究所博士生", field: "先秦思想" },
  { name: "汪博潤", school: "臺灣大學", dept: "中國文學研究所博士生", field: "尚書學" },
  { name: "吳賢愷", school: "臺灣大學", dept: "中國文學研究所博士生", field: "現代文學" },
  { name: "嚴浩然", school: "成功大學", dept: "中國文學研究所博士生", field: "先秦思想" },
  { name: "陳皓渝", school: "高雄師範大學", dept: "國文學系博士生", field: "文字學" },
  { name: "王鈺堤", school: "國立中山大學", dept: "中國文學研究所博士生", field: "春秋學" },
  { name: "夏卓浩", school: "復旦大學", dept: "哲學系博士生", field: "中國哲學" },
];

const fieldColors = {
  "春秋學":   { bg: "rgba(212,162,78,0.15)",  color: "#7a5c1a", border: "rgba(212,162,78,0.35)" },
  "先秦思想": { bg: "rgba(74,106,80,0.15)",   color: "#2e4432", border: "rgba(74,106,80,0.35)" },
  "易學":     { bg: "rgba(61,104,120,0.15)",  color: "#1a3a4a", border: "rgba(61,104,120,0.35)" },
  "尚書學":   { bg: "rgba(140,98,64,0.15)",   color: "#5e3d24", border: "rgba(140,98,64,0.35)" },
  "現代文學": { bg: "rgba(139,92,246,0.12)",  color: "#4c1d95", border: "rgba(139,92,246,0.3)" },
  "文字學":   { bg: "rgba(220,38,38,0.1)",    color: "#7f1d1d", border: "rgba(220,38,38,0.25)" },
  "中國哲學": { bg: "rgba(234,179,8,0.12)",   color: "#713f12", border: "rgba(234,179,8,0.3)" },
};

/* ==================== 頁面：關於讀書會 ==================== */
const AboutPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
    <PageHeader title="關於讀書會" />
    <div className="p-8 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-6 theme-text">
      <p className="text-lg font-serif content-justify">
        在現代學術分科的影響下，研究生對於研究論文的撰寫（特別是人文學科），往往是一場孤獨的馬拉松，研究者們往往花費大量的時間與古籍對話，與前人理論交流。然而，新的知識並不是古人或個人所能生產，它勢必須要與時代建立溝通的橋樑，而學術寫作重就是將已經内化的思考透過文字與公共社會進行對話，尋求建立新的知識觀點。
      </p>
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {[
          { icon: "BookOpen", title: "當局者迷與同儕審查", desc: "傳統俗諺：「當局者迷，旁觀者清」，在研究生撰寫論文的過程中，難免遭遇論述困難、邏輯死角、學術視野缺失等諸多情形。若在此之前，藉由協作學習的成員建立小型的「同儕審查機制（Peer Review）」，不僅可以提供他者的眼光，協助成員提早發現論文問題以及發展方向，便可即時避免、降低正式發表的挫折感。" },
          { icon: "Users", title: "寫作焦慮與進度控管", desc: "研究生的學術寫作之所以常有「拖延症」，不應歸咎於自身的研究能力不足，而是源於長時間孤軍奮戰產生的心理耗損。藉由社群強制訂立發表時程的強制規定，將相對抽象的寫作計畫轉化為具體的「Deadline」，以適度的社交壓力能有效打破學術寫作的延宕。" },
        ].map((item, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
              <span style={{ color: "var(--c-accent)" }}><Icon name={item.icon} size={24} /></span> {item.title}
            </h3>
            <p className="theme-text-secondary content-justify">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
        <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">具體實踐</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "ClipboardList", n: 1, t: "建立學術討論的期程表", d: "計畫伊始，即排定每位成員的發表次序與時段，要求發表人須於會議前一週提交論文初稿。旨在模擬學術期刊或研討會的審稿流程，給予研究生學術寫作的「儀式感」與「責任心」。" },
            { icon: "Users", n: 2, t: "組建同儕審查會議", d: "每位成員須輪流在會議中承擔不同角色。主持人須控管現場對話的次序；發表人須練習在有限時間內精煉陳述核心問題；特約討論人則需針對論文提供具建設性的修改建議。" },
            { icon: "Edit3", n: 3, t: "論文修正與再評議", d: "學術寫作最困難的部分不在於「寫」，而在於「如何改」。本計畫強調在初稿發表與評論意見回饋後，發表人必須針對修改建議進行整理，提出修改說明作為追蹤。" },
            { icon: "Globe", n: 4, t: "跨校數位資源共享群組", d: "現代論文寫作已無法脫離數位工具與資料庫的運用。透過「校際」合作，總合多校資源，便能查漏補缺，為成員的研究添磚加瓦。" },
          ].map((item, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 transition-colors duration-300">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 font-sans theme-heading">
                <span style={{ color: "var(--c-accent)" }}><Icon name={item.icon} size={20} /></span> {item.n}. {item.t}
              </h4>
              <p className="theme-text-secondary text-sm leading-relaxed font-serif content-justify">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 成員介紹 */}
      <div className="mt-10 pt-8 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
        <h3 className="text-2xl font-bold mb-8 font-sans text-center theme-heading">讀書會成員</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => {
            const fc = fieldColors[m.field] || { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
            return (
              <div key={i} className="bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow-sm hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg font-sans shadow-sm"
                  style={{ background: "var(--c-primary)", opacity: 0.85 }}>
                  {m.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-base font-sans theme-heading">{m.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border font-sans"
                      style={{ background: fc.bg, color: fc.color, borderColor: fc.border }}>
                      {m.field}
                    </span>
                  </div>
                  <p className="text-xs theme-text-secondary font-sans leading-relaxed">{m.school}</p>
                  <p className="text-xs theme-text-secondary font-sans opacity-70">{m.dept}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

/* ==================== 頁面：資訊分享 ==================== */
const BooksPage = () => (
  <div className="space-y-16 animate-fade-in relative z-10">
    <PageHeader title="資訊分享" />
    <div className="space-y-12 max-w-5xl mx-auto">
      {resourceCategories.map((cat, idx) => (
        <div key={idx} className="space-y-6">
          <h3 className="text-2xl font-bold font-sans flex items-center gap-3 pb-4 theme-heading theme-divider" style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
            <div className="p-2.5 rounded-xl border" style={{ background: "var(--c-accent-light)", borderColor: "var(--c-badge-border)" }}>
              <Icon name={cat.icon} size={24} />
            </div>
            {idx + 1}. {cat.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.links.map((link, li) => {
              const domain = getDomain(link.url);
              return (
                <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center p-5 rounded-2xl glass-panel glass-card-hover hover:-translate-y-1 shadow-sm">
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-white/60 shrink-0 overflow-hidden">
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold font-sans transition-colors truncate theme-heading">{link.name}</h4>
                    <p className="text-xs font-mono mt-1 truncate theme-text-secondary" style={{ opacity: 0.5 }}>{domain}</p>
                  </div>
                  <Icon name="ExternalLink" size={18} className="shrink-0 ml-3 opacity-20 group-hover:opacity-70 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ==================== 頁面：近期活動 ==================== */
const EventsPage = () => {
  const [activeId, setActiveId] = useState(null);
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
      <PageHeader title="近期活動" />
      <div className="rounded-3xl overflow-hidden glass-panel">
        <ul className="divide-y divide-white/40 flex flex-col">
          {events.map((ev) => {
            const open = activeId === ev.id;
            return (
              <li key={ev.id} onClick={() => setActiveId(open ? null : ev.id)}
                className={`p-6 md:p-8 cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.02] my-2 rounded-2xl border border-white/80 z-10" : "hover:bg-white/40 border-transparent z-0"}`}>
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-3 rounded-xl flex-shrink-0 backdrop-blur-sm border spring-transition ${open ? "scale-110 shadow-sm" : ""}`}
                      style={ev.status === "upcoming" ? { background: "var(--c-badge-bg)", color: "var(--c-accent)", borderColor: "var(--c-badge-border)" } : {}}>
                      <Icon name="Calendar" size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold mb-1 font-sans ${ev.status === "upcoming" ? "theme-heading" : "opacity-60"}`}>{ev.title}</h3>
                      <p className="text-sm theme-text-secondary">
                        <span className="font-mono bg-white/50 border border-white/40 px-2 py-0.5 rounded shadow-sm">{ev.date}</span>
                      </p>
                    </div>
                  </div>
                  {ev.status === "upcoming" ? (
                    <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border font-sans"
                      style={{ background: "var(--c-nav-active-bg)", borderColor: "var(--c-nav-active-border)" }}>會議內容</span>
                  ) : (
                    <span className="inline-block bg-white/40 border border-white/50 text-xs font-bold px-3 py-1 rounded-full font-sans theme-text-secondary">已歸檔</span>
                  )}
                </div>
                <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 text-sm whitespace-pre-line leading-relaxed font-serif bg-white/30 p-4 rounded-xl shadow-inner content-justify theme-text-secondary theme-divider"
                      style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                      {ev.details}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ==================== 頁面：討論進度 ==================== */
const ColumnsPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const statusColor = (s) => {
    if (s === "待發表") return { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };
    if (s === "修改中") return { bg: "rgba(234,179,8,0.15)", color: "#854d0e", border: "rgba(234,179,8,0.3)" };
    if (s === "撰寫中") return { bg: "rgba(139,92,246,0.12)", color: "#5b21b6", border: "rgba(139,92,246,0.25)" };
    if (s === "已發表") return { bg: "rgba(34,197,94,0.12)", color: "#15803d", border: "rgba(34,197,94,0.25)" };
    return { bg: "rgba(100,116,139,0.12)", color: "#475569", border: "rgba(100,116,139,0.25)" };
  };
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
      <PageHeader title="討論進度" />
      <div className="space-y-6">
        {researchArticles.map((art) => {
          const open = expandedId === art.id;
          const sc = statusColor(art.status);
          const hasAbstract = art.abstract && art.abstract.trim().length > 0;
          return (
            <article key={art.id} onClick={() => setExpandedId(open ? null : art.id)}
              className={`rounded-2xl glass-panel cursor-pointer spring-transition ${open ? "bg-white/60 shadow-lg scale-[1.01]" : "glass-card-hover"}`}>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 p-2.5 rounded-xl shrink-0" style={{ background: "var(--c-accent-light)" }}>
                      <Icon name="FileText" size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-sans leading-snug theme-heading">{art.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm theme-text-secondary">
                        <span className="flex items-center gap-1 font-sans"><Icon name="PenLine" size={14} /> {art.author}</span>
                        <span className="flex items-center gap-1 font-mono text-xs opacity-60"><Icon name="Clock" size={14} /> {art.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full font-sans shrink-0 border"
                    style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{art.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {art.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full bg-white/50 border border-white/60 theme-text-secondary">
                      <Icon name="Tag" size={12} /> {tag}
                    </span>
                  ))}
                </div>
                <div className={`grid spring-transition w-full ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 theme-divider" style={{ borderTopWidth: "1px", borderTopStyle: "solid" }}>
                      {hasAbstract ? (
                        <>
                          <h4 className="text-sm font-bold font-sans mb-3 flex items-center gap-2 theme-heading">
                            <Icon name="BookOpen" size={16} /> 摘要
                          </h4>
                          <p className="text-sm leading-relaxed font-serif content-justify theme-text-secondary mb-4">{art.abstract}</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 py-4 px-5 bg-white/30 rounded-xl text-sm theme-text-secondary font-sans">
                          <Icon name="AlertCircle" size={18} />
                          <span>摘要尚在整理中，敬請期待。</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <span className="text-xs font-sans flex items-center gap-1 theme-text-secondary" style={{ opacity: 0.5 }}>
                    {open ? "收合" : hasAbstract ? "展開摘要" : "查看狀態"}
                    <Icon name="ChevronRight" size={14} className={`spring-transition ${open ? "rotate-90" : ""}`} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

/* ==================== 頁面：文章專欄 ==================== */
const BlockRenderer = ({ block }) => {
  if (!block) return null;

  switch (block.type) {
    case "heading":
      return (
        <h4 className="text-xl md:text-2xl font-bold theme-heading mt-10 mb-5 flex items-center gap-3">
          <span style={{ width: "5px", height: "1.2em", background: "var(--c-accent)", borderRadius: "4px" }}></span>
          {block.text}
        </h4>
      );

    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-xl border glass-panel shadow-sm font-sans" style={{ borderColor: "rgba(255,255,255,0.5)" }}>
          <table className="w-full text-left border-collapse min-w-[500px]">
            {block.caption && (
              <caption className="py-3 px-4 text-sm font-bold theme-heading bg-white/50 border-b" style={{ borderColor: "rgba(255,255,255,0.6)" }}>
                {block.caption}
              </caption>
            )}
            <thead className="bg-white/40 theme-heading text-sm border-b" style={{ borderColor: "rgba(255,255,255,0.4)" }}>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="py-3 px-5 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y theme-text-secondary text-sm" style={{ divideColor: "rgba(255,255,255,0.3)" }}>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/30 transition-colors">
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

/* ==================== 分類專屬顏色設定 ==================== */
const categoryColors = {
  "學術筆記": { bg: "rgba(59,130,246,0.12)", color: "#1e40af", border: "rgba(59,130,246,0.3)" }, // 藍色系
  "學術隨筆": { bg: "rgba(59,130,246,0.12)", color: "#1e40af", border: "rgba(59,130,246,0.3)" }, // 藍色系 (相容設定)
  "讀書會紀錄": { bg: "rgba(34,197,94,0.12)", color: "#166534", border: "rgba(34,197,94,0.3)" },  // 綠色系
  "文學創作": { bg: "rgba(244,63,94,0.12)", color: "#9f1239", border: "rgba(244,63,94,0.3)" },   // 玫瑰紅色系
};

const ArticlesPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterCat, setFilterCat] = useState("全部");

  const categories = FIXED_CATEGORIES;
  const filtered = filterCat === "全部" ? columnArticles : columnArticles.filter(a => a.category === filterCat);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative z-10">
      <PageHeader title="文章專欄" />

      {/* 分類篩選 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => {
          const isActive = filterCat === cat;
          const catColor = categoryColors[cat];

          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium font-sans border spring-transition hover:scale-105 active:scale-95"
              style={isActive
                ? { 
                    background: cat === "全部" ? "var(--c-nav-active-bg)" : catColor?.color || "var(--c-primary)", 
                    color: "#fff", 
                    borderColor: cat === "全部" ? "var(--c-nav-active-border)" : catColor?.color || "var(--c-primary)", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
                  }
                : { 
                    background: "rgba(255,255,255,0.4)", 
                    borderColor: "rgba(255,255,255,0.6)", 
                    color: "var(--c-text-secondary)" 
                  }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl theme-text-secondary font-sans">
          <Icon name="FileText" size={40} className="mx-auto mb-4 opacity-30" />
          <p>尚無文章，敬請期待。</p>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {filtered.map((a) => {
            const open = expandedId === a.id;
            const catColor = categoryColors[a.category] || { bg: "var(--c-badge-bg)", color: "var(--c-badge-text)", border: "var(--c-badge-border)" };

            return (
              <article
                key={a.id}
                className={`rounded-3xl glass-panel overflow-hidden spring-transition border border-white/60 ${open ? "shadow-2xl scale-[1.02] bg-white/70" : "glass-card-hover cursor-pointer"}`}
              >
                {/* 預覽區塊（點擊展開/收合） */}
                <div
                  className="p-5 md:p-8 relative"
                  onClick={() => setExpandedId(open ? null : a.id)}
                >
                  {/* 分類與日期標籤 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans border"
                      style={{ background: catColor.bg, color: catColor.color, borderColor: catColor.border }}>
                      <Icon name="Folder" size={14} className="opacity-70" /> {a.category}
                    </span>
                    <span className="text-xs md:text-sm font-mono flex items-center gap-1.5 theme-text-secondary opacity-70">
                      <Icon name="Calendar" size={14} /> {a.date}
                    </span>
                  </div>

                  {/* 標題與作者 */}
                  <h3 className="text-xl md:text-3xl font-bold font-sans theme-heading mb-4 leading-tight transition-colors">
                    {a.title}
                  </h3>
                  
                  {/* 響應式作者資訊區塊（修復手機跑版） */}
                  <div className="mb-5 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm theme-text-secondary font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: catColor.color, opacity: 0.9 }}>
                          {a.author[0]}
                        </span>
                        <span className="font-medium text-base whitespace-nowrap">{a.author}</span>
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

                  {/* 標籤 */}
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    {a.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full border transition-colors hover:brightness-95"
                        style={{ background: catColor.bg, color: catColor.color, borderColor: catColor.border }}>
                        <Icon name="Tag" size={12} className="opacity-60 shrink-0" /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* 摘要與展開提示（未展開時顯示） */}
                  <div className={`grid spring-transition ${open ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                    <div className="overflow-hidden">
                      {a.summary && (
                        <p className="text-sm md:text-base leading-relaxed font-serif content-justify theme-text-secondary mb-4 p-4 rounded-2xl bg-white/30 border border-white/40 shadow-inner">
                          {a.summary}
                        </p>
                      )}
                      <div className="flex justify-center mt-2">
                        <span className="inline-flex items-center justify-center gap-1 text-sm font-medium font-sans px-4 py-2 rounded-full shadow-sm border" style={{ color: "white", background: catColor.color, borderColor: catColor.color }}>
                          <span className="leading-none pt-[1px]">閱讀全文</span>
                          <div className="flex items-center justify-center h-4 w-4 ml-0.5"><Icon name="ChevronDown" size={16} className="animate-bounce" /></div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 完整內容區塊（展開時顯示） */}
                <div className={`grid spring-transition ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-5 md:px-8 pb-16 md:pb-20 pt-2 md:pt-4"> 
                      <div className="theme-divider pt-6 md:pt-8 mb-6 md:mb-8" style={{ borderTopWidth: "2px", borderTopStyle: "dashed" }}></div>
                      
                      {/* 文章內容渲染 */}
                      <div className="space-y-6 font-serif text-[1.05rem] md:text-lg leading-loose content-justify theme-text">
                        {(a.blocks || []).length === 0 ? (
                          <div className="text-center opacity-60 text-base py-10 bg-white/30 rounded-2xl border border-white/40">
                            （此文尚未填入全文內容）
                          </div>
                        ) : (
                          (a.blocks || []).map((b, idx) => <BlockRenderer key={idx} block={b} />)
                        )}
                      </div>

                      {/* 收合按鈕 */}
                      <div className="mt-12 md:mt-16 flex justify-center pb-4 md:pb-8"> 
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(null);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold font-sans transition-all hover:-translate-y-1 shadow-md border"
                          style={{ background: catColor.color, color: "white", borderColor: catColor.color }}
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
  );
};

/* ==================== 頁面：投稿須知 ==================== */
const SubmissionPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
    <PageHeader title="投稿須知" />
    <div className="p-6 md:p-12 rounded-3xl glass-panel leading-relaxed space-y-10 theme-text">
      
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
          請將您的稿件（Word 或 PDF 格式）寄至本室信箱：
        </p>
        
        {/* 信箱按鈕獨立一行，避免在手機版折行時跑版 */}
        <div className="my-5 flex md:block justify-center">
          <a href="mailto:zxc998775@gmail.com" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/60 rounded-xl hover:-translate-y-0.5 transition-all shadow-sm font-sans text-base font-bold border border-white/60" style={{ color: "var(--c-primary)" }}>
            <Icon name="Mail" size={18} /> zxc998775@gmail.com
          </a>
        </div>

        <p className="text-base md:text-lg font-serif content-justify theme-text-secondary leading-loose">
          信件主旨請註明「投稿中文研究室─[您的姓名]」，並於信件內附上您的<strong>真實姓名、所屬單位與職稱</strong>（以便網頁建檔）。我們將在收到後盡快回覆並為您上架！
        </p>
      </section>

    </div>
  </div>
);

/* ==================== 主應用程式 ==================== */
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "研究室首頁", icon: <Icon name="Home" size={18} /> },
    { id: "about", label: "關於讀書會", icon: <Icon name="Info" size={18} /> },
    { id: "books", label: "資訊分享", icon: <Icon name="Library" size={18} /> },
    { id: "events", label: "近期活動", icon: <Icon name="Calendar" size={18} /> },
    { id: "columns", label: "討論進度", icon: <Icon name="PenLine" size={18} /> },
    { id: "articles", label: "文章專欄", icon: <Icon name="BookOpen" size={18} /> },
    { id: "submission", label: "投稿須知", icon: <Icon name="Send" size={18} /> },
  ];

  const go = (id) => { setCurrentPage(id); setMobileOpen(false); };

  const page = (() => {
    switch (currentPage) {
      case "home": return <HomePage setPage={setCurrentPage} />;
      case "about": return <AboutPage />;
      case "books": return <BooksPage />;
      case "events": return <EventsPage />;
      case "columns": return <ColumnsPage />;
      case "articles": return <ArticlesPage />;
      case "submission": return <SubmissionPage />;
      default: return <HomePage setPage={setCurrentPage} />;
    }
  })();

  const themes = {
    home: { primary: "#2d6a6a", primaryDark: "#1a4f4f", accent: "#d4a24e", accentLight: "#fef3d8", text: "#0f3d3d", textSec: "#3a6b6b", blob1: "rgba(77,160,160,0.25)", blob2: "rgba(212,162,78,0.18)", blob3: "rgba(140,190,210,0.18)", footer: "rgba(15,61,61,0.85)", navBg: "rgba(45,106,106,0.9)", navBorder: "rgba(77,160,160,0.5)", badgeBg: "rgba(212,162,78,0.2)", badgeText: "#7a5c1a", badgeBorder: "rgba(212,162,78,0.3)" },
    about: { primary: "#8c6240", primaryDark: "#5e3d24", accent: "#c4935a", accentLight: "#fdf0e0", text: "#3d2414", textSec: "#7a5a3e", blob1: "rgba(196,147,90,0.22)", blob2: "rgba(140,98,64,0.18)", blob3: "rgba(220,180,140,0.2)", footer: "rgba(61,36,20,0.85)", navBg: "rgba(140,98,64,0.9)", navBorder: "rgba(196,147,90,0.5)", badgeBg: "rgba(196,147,90,0.2)", badgeText: "#5e3d24", badgeBorder: "rgba(196,147,90,0.3)" },
    books: { primary: "#8a7a2e", primaryDark: "#5c5218", accent: "#b89a38", accentLight: "#fdf8e8", text: "#3a3410", textSec: "#6b6330", blob1: "rgba(184,154,56,0.22)", blob2: "rgba(138,122,46,0.18)", blob3: "rgba(210,195,120,0.2)", footer: "rgba(58,52,16,0.85)", navBg: "rgba(138,122,46,0.9)", navBorder: "rgba(184,154,56,0.5)", badgeBg: "rgba(184,154,56,0.2)", badgeText: "#5c5218", badgeBorder: "rgba(184,154,56,0.3)" },
    events: { primary: "#3d6878", primaryDark: "#264350", accent: "#6ba0b4", accentLight: "#eaf4f8", text: "#1a3540", textSec: "#4a7080", blob1: "rgba(61,104,120,0.22)", blob2: "rgba(107,160,180,0.18)", blob3: "rgba(80,130,160,0.2)", footer: "rgba(26,53,64,0.85)", navBg: "rgba(61,104,120,0.9)", navBorder: "rgba(107,160,180,0.5)", badgeBg: "rgba(107,160,180,0.2)", badgeText: "#264350", badgeBorder: "rgba(107,160,180,0.3)" },
    
    /* 更新：將文章專欄的主色調改為沉穩的板岩灰 (Slate) 以包容多色的分類標籤 */
    articles: { primary: "#475569", primaryDark: "#1e293b", accent: "#94a3b8", accentLight: "#f1f5f9", text: "#0f172a", textSec: "#334155", blob1: "rgba(71,85,105,0.22)", blob2: "rgba(100,116,139,0.18)", blob3: "rgba(30,41,59,0.2)", footer: "rgba(15,23,42,0.85)", navBg: "rgba(30,41,59,0.9)", navBorder: "rgba(100,116,139,0.5)", badgeBg: "rgba(100,116,139,0.2)", badgeText: "#1e293b", badgeBorder: "rgba(100,116,139,0.3)" },
    
    columns: { primary: "#4a6a50", primaryDark: "#2e4432", accent: "#8aaa60", accentLight: "#f2f7ec", text: "#1e3322", textSec: "#506a54", blob1: "rgba(74,106,80,0.22)", blob2: "rgba(138,170,96,0.18)", blob3: "rgba(100,150,110,0.2)", footer: "rgba(30,51,34,0.85)", navBg: "rgba(74,106,80,0.9)", navBorder: "rgba(138,170,96,0.5)", badgeBg: "rgba(138,170,96,0.2)", badgeText: "#2e4432", badgeBorder: "rgba(138,170,96,0.3)" },
    submission: { primary: "#b45309", primaryDark: "#7c2d12", accent: "#f59e0b", accentLight: "#ffedd5", text: "#431407", textSec: "#9a3412", blob1: "rgba(180,83,9,0.22)", blob2: "rgba(124,45,18,0.18)", blob3: "rgba(245,158,11,0.2)", footer: "rgba(67,20,7,0.85)", navBg: "rgba(124,45,18,0.9)", navBorder: "rgba(180,83,9,0.5)", badgeBg: "rgba(180,83,9,0.2)", badgeText: "#7c2d12", badgeBorder: "rgba(180,83,9,0.3)" },
  };

  const t = themes[currentPage] || themes.home;

  return (
    <div style={{
      "--c-primary": t.primary, "--c-primary-dark": t.primaryDark, "--c-accent": t.accent,
      "--c-accent-light": t.accentLight, "--c-text": t.text, "--c-text-secondary": t.textSec,
      "--c-blob-1": t.blob1, "--c-blob-2": t.blob2, "--c-blob-3": t.blob3,
      "--c-footer": t.footer, "--c-nav-active-bg": t.navBg, "--c-nav-active-border": t.navBorder,
      "--c-badge-bg": t.badgeBg, "--c-badge-text": t.badgeText, "--c-badge-border": t.badgeBorder,
      "--c-selection": `${t.accent}4D`,
      color: t.text, fontFamily: "'Noto Serif TC', serif", minHeight: "100vh", display: "flex", flexDirection: "column",
      transition: "color 500ms ease",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;500;700;900&display=swap');
        @keyframes fadeIn { 0% { opacity:0; transform:translateY(12px);} 100% { opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        @keyframes blobPulse { 0%,100% { opacity:0.6; transform:scale(1);} 50%{ opacity:1; transform:scale(1.05);} }
        .blob-1 { animation: blobPulse 8s ease-in-out infinite; }
        .blob-2 { animation: blobPulse 10s ease-in-out infinite reverse; }
        .blob-3 { animation: blobPulse 12s ease-in-out infinite; }
        .font-sans { font-family: 'Noto Sans TC', sans-serif !important; }
        .font-serif { font-family: 'Noto Serif TC', serif !important; }
        .font-kai { font-family: 'Kaiti TC', 'BiauKai', 'DFKai-SB', 'AR PL UKai TW', serif !important; }
        .content-justify { text-align: justify; text-justify: inter-ideograph; overflow-wrap: break-word; word-break: normal; }
        .spring-transition { transition: all 500ms cubic-bezier(0.34,1.56,0.64,1); }
        .glass-panel { background:rgba(255,255,255,0.4); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.6); box-shadow:0 8px 32px rgba(0,0,0,0.05); }
        .glass-card-hover { transition: all 300ms ease; }
        .glass-card-hover:hover { background:rgba(255,255,255,0.6); box-shadow:0 8px 32px rgba(0,0,0,0.1); }
        .theme-text { color: var(--c-text); }
        .theme-text-secondary { color: var(--c-text-secondary); }
        .theme-heading { color: var(--c-primary-dark); }
        .theme-divider { border-color: color-mix(in srgb, var(--c-primary) 15%, transparent); }

        /* ===== RWD 導覽列 ===== */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }

        /* ===== RWD 頁尾 ===== */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}} />

      {/* 背景光暈 */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="blob-1" style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "9999px", filter: "blur(100px)", background: "var(--c-blob-1)", transition: "background 800ms ease" }} />
        <div className="blob-2" style={{ position: "absolute", top: "20%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "9999px", filter: "blur(100px)", background: "var(--c-blob-2)", transition: "background 800ms ease" }} />
        <div className="blob-3" style={{ position: "absolute", bottom: "-10%", left: "10%", width: "45vw", height: "45vw", borderRadius: "9999px", filter: "blur(120px)", background: "var(--c-blob-3)", transition: "background 800ms ease" }} />
      </div>

      {/* 導覽列 */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "5rem" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }} onClick={() => go("home")}>
              <LogoImage className="w-10 h-10 mr-3 rounded-xl shadow-sm border border-white/50" />
              <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif", color: t.primaryDark, transition: "color 500ms ease" }}>中文研究室</span>
            </div>

            {/* 桌面版導覽（768px 以上顯示） */}
            <div className="desktop-nav" style={{ display: "flex", gap: "0.375rem", flexWrap: "nowrap" }}>
              {navItems.map((item) => (
                <ThemedButton key={item.id} active={currentPage === item.id} onClick={() => go(item.id)}>
                  {item.icon} {item.label}
                </ThemedButton>
              ))}
            </div>

            {/* 手機版漢堡按鈕（768px 以下顯示） */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none", padding: "0.5rem", background: "rgba(255,255,255,0.4)", borderRadius: "0.5rem", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.5)", color: t.primaryDark, cursor: "pointer" }}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* 手機版下拉選單 */}
        {mobileOpen && (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", position: "absolute", width: "100%", left: 0 }} className="animate-fade-in">
            <div style={{ padding: "0.75rem 1rem 1.25rem" }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    width: "100%", textAlign: "left",
                    padding: "0.75rem 1rem", borderRadius: "0.75rem",
                    fontSize: "1rem", fontWeight: 500,
                    fontFamily: "'Noto Sans TC', sans-serif",
                    border: "1px solid",
                    cursor: "pointer",
                    marginBottom: "0.25rem",
                    transition: "all 200ms ease",
                    background: currentPage === item.id ? "rgba(255,255,255,0.8)" : "transparent",
                    borderColor: currentPage === item.id ? "rgba(255,255,255,0.9)" : "transparent",
                    color: currentPage === item.id ? t.primaryDark : t.textSec,
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 調整主容器底部 Padding 確保手機版不會被遮擋 */}
      <main style={{ flexGrow: 1, maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem 6rem", width: "100%" }}>
        {page}
      </main>

      {/* 頁尾 */}
      <footer style={{ position: "relative", zIndex: 10, backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", padding: "3rem 0", background: t.footer, transition: "background 500ms ease" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="footer-grid">
            {/* Logo */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", color: "white", marginBottom: "0.5rem" }}>
                <LogoImage className="w-8 h-8 mr-2 rounded-lg border border-white/30" />
                <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.1em", fontFamily: "'Noto Sans TC', sans-serif" }}>中文研究室</span>
              </div>
            </div>

            {/* 快速連結 */}
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>快速連結</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "0.5rem 1.5rem", fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>
                {navItems.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => go(n.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0, fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 聯絡資訊 */}
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Noto Sans TC', sans-serif" }}>聯絡資訊</h4>
              <p style={{ fontSize: "0.875rem", fontFamily: "'Noto Sans TC', sans-serif" }}>Email：zxc998775@gmail.com</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "1.5rem 1.5rem 0", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans TC', sans-serif" }}>
          &copy; {new Date().getFullYear()} 中文研究室. All rights reserved.
        </div>
      </footer>
    </div>
  );
}