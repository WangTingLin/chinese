import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("App crash:", e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: "fixed", inset: 0, background: "#1c1c1e",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.7)", fontFamily: "system-ui",
          padding: "2rem", textAlign: "center", gap: "1rem",
        }}>
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <div style={{ fontWeight: 600 }}>發生錯誤，請重新整理</div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", maxWidth: 300, wordBreak: "break-all" }}>
            {this.state.error?.message}
          </div>
          <button onClick={() => window.location.reload()}
            style={{ marginTop: "1rem", padding: "0.6rem 1.6rem", borderRadius: "2rem",
              background: "rgba(255,255,255,0.12)", border: "none", color: "white",
              fontFamily: "system-ui", cursor: "pointer" }}>
            重新載入
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
