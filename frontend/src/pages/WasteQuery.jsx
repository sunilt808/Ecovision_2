import React, { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ─── intent colour map ────────────────────────────────────────────────────────
const INTENT_COLORS = {
  today_count:    { bg: "#dbeafe", text: "#1d4ed8", label: "Today" },
  week_count:     { bg: "#dcfce7", text: "#15803d", label: "This Week" },
  month_count:    { bg: "#fef9c3", text: "#a16207", label: "Monthly" },
  total_count:    { bg: "#f3e8ff", text: "#7e22ce", label: "Total" },
  total_uploads:  { bg: "#f3e8ff", text: "#7e22ce", label: "Uploads" },
  total_camera:   { bg: "#f3e8ff", text: "#7e22ce", label: "Camera" },
  category_count: { bg: "#ffedd5", text: "#c2410c", label: "Category" },
  performance:    { bg: "#d1fae5", text: "#065f46", label: "Performance" },
  top_category:   { bg: "#fee2e2", text: "#be123c", label: "Top Type" },
  comparison:     { bg: "#e0f2fe", text: "#0369a1", label: "Comparison" },
  ewaste:         { bg: "#ede9fe", text: "#6d28d9", label: "E-Waste" },
  recyclable:     { bg: "#dcfce7", text: "#166534", label: "Recyclable" },
  recent:         { bg: "#fce7f3", text: "#9d174d", label: "Recent" },
  trend:          { bg: "#fef3c7", text: "#b45309", label: "Trend" },
  help:           { bg: "#f0fdf4", text: "#15803d", label: "Help" },
  fallback:       { bg: "#f1f5f9", text: "#64748b", label: "General" },
  no_data:        { bg: "#fef2f2", text: "#991b1b", label: "No Data" },
};

export default function WasteQuery() {
  const [query, setQuery]           = useState("");
  const [response, setResponse]     = useState(null);
  const [intent, setIntent]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory]       = useState([]);
  const [breakdown, setBreakdown]   = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [typingText, setTypingText] = useState("");
  const inputRef   = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenRef = useRef("");

  // ── fetch initial data ───────────────────────────────────────────────────
  useEffect(() => {
    fetchSuggestions();
    fetchHistory();
    fetchBreakdown();
  }, []);

  useEffect(() => {
    if (!response || loading || !window.speechSynthesis) return;
    if (response === lastSpokenRef.current) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(response);
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
    lastSpokenRef.current = response;
  }, [response, loading]);

  const fetchSuggestions = async () => {
    try {
      const r = await fetch(`${API}/nlp/suggestions`);
      const d = await r.json();
      setSuggestions(d.suggestions || []);
    } catch {}
  };

  const fetchHistory = async () => {
    try {
      const r = await fetch(`${API}/nlp/history?limit=8`);
      const d = await r.json();
      setHistory(Array.isArray(d) ? d : []);
    } catch {}
  };

  const fetchBreakdown = async () => {
    try {
      const r = await fetch(`${API}/analytics/breakdown`);
      const d = await r.json();
      setBreakdown(d.breakdown || []);
    } catch {}
  };

  // ── typing animation ────────────────────────────────────────────────────
  const animateResponse = (text) => {
    setTypingText("");
    let i = 0;
    const tick = () => {
      setTypingText(text.slice(0, i + 1));
      i++;
      if (i < text.length) setTimeout(tick, 18);
    };
    tick();
  };

  // ── submit query ────────────────────────────────────────────────────────
  const handleQuery = async (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setResponse(null);
    setIntent(null);
    setTypingText("");
    try {
      const res = await fetch(`${API}/nlp/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (data.answer) {
        setResponse(data.answer);
        setIntent(data.intent || "fallback");
        animateResponse(data.answer);
        fetchHistory();
      } else if (data.error) {
        setResponse(data.error);
        setIntent("fallback");
        setTypingText(data.error);
      } else {
        setResponse("No answer returned. Please try a different query.");
        setIntent("fallback");
        setTypingText("No answer returned. Please try a different query.");
      }
    } catch {
      setResponse("Unable to connect to the analytics engine. Please ensure the backend is running.");
      setIntent("fallback");
      setTypingText("Unable to connect to the analytics engine. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleQuery();
  };

  const handleChipClick = (chip) => {
    setQuery(chip);
    handleQuery(chip);
  };

  // ── voice input ─────────────────────────────────────────────────────────
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      handleQuery(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  // ── speak response ──────────────────────────────────────────────────────
  const speakResponse = () => {
    if (!response || !window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(response);
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  const intentMeta = INTENT_COLORS[intent] || INTENT_COLORS.fallback;

  // ── chart colours ───────────────────────────────────────────────────────
  const CHART_COLORS = ["#10b981","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16"];

  const displayText = typingText || response || "";

  return (
    <div className="wq-page">

      {/* ─── hero ─── */}
      <header className="wq-hero">
        <div className="wq-hero-badge">NLP ELECTIVE COMPONENT</div>
        <h1 className="gradient-text">Waste Intelligence Query</h1>
        <p className="wq-hero-sub">
          Ask anything about waste trends, model performance, or category statistics
          in plain English — powered by a multi-intent NLP engine.
        </p>
      </header>

      <div className="wq-layout">

        {/* ─── main column ─── */}
        <div className="wq-main">

          {/* query box */}
          <form className="wq-form premium-card" onSubmit={handleFormSubmit}>
            <div className="wq-input-row">
              <div className="wq-input-wrap">
                <span className="wq-input-icon">🔍</span>
                <input
                  ref={inputRef}
                  id="nlp-query-input"
                  type="text"
                  className="wq-input"
                  placeholder="e.g. How many plastic items this week?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                type="button"
                id="nlp-voice-btn"
                className={`wq-icon-btn ${isListening ? "listening" : ""}`}
                onClick={toggleVoice}
                title="Voice Input"
              >
                {isListening ? "🔴" : "🎤"}
              </button>
              <button
                type="submit"
                id="nlp-ask-btn"
                className="wq-ask-btn"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <span className="wq-spinner" />
                ) : (
                  "Ask AI →"
                )}
              </button>
            </div>

            {/* suggestion chips */}
            {suggestions.length > 0 && (
              <div className="wq-chips">
                {suggestions.map((s, i) => (
                  <button
                    type="button"
                    key={i}
                    className="wq-chip"
                    onClick={() => handleChipClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* response card */}
          {(response || loading) && (
            <div className="wq-response premium-card">
              {loading ? (
                <div className="wq-thinking">
                  <span className="wq-dot" />
                  <span className="wq-dot" />
                  <span className="wq-dot" />
                  <span className="wq-thinking-text">Analyzing your query…</span>
                </div>
              ) : (
                <>
                  <div className="wq-res-header">
                    <div className="wq-res-label">AI Response</div>
                    <div className="wq-res-meta">
                      {intent && (
                        <span
                          className="wq-intent-badge"
                          style={{
                            background: intentMeta.bg,
                            color: intentMeta.text,
                          }}
                        >
                          {intentMeta.label}
                        </span>
                      )}
                      <button
                        className="wq-speak-btn"
                        onClick={speakResponse}
                        title="Speak response"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                  <p className="wq-res-text">{displayText}</p>
                </>
              )}
            </div>
          )}

          {/* ─── breakdown chart ─── */}
          {breakdown.length > 0 && (
            <section className="wq-breakdown premium-card">
              <h3 className="wq-section-title">Live Category Breakdown</h3>
              <div className="bd-list">
                {breakdown.slice(0, 8).map((b, i) => (
                  <div key={b.category} className="bd-row">
                    <div className="bd-label">
                      <span
                        className="bd-dot"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="bd-name">{b.category}</span>
                    </div>
                    <div className="bd-track">
                      <div
                        className="bd-fill"
                        style={{
                          width: `${Math.max(b.percentage, 2)}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                    <span className="bd-count">{b.count}</span>
                    <span className="bd-pct">{b.percentage}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* example prompts */}
          <section className="wq-examples premium-card">
            <h3 className="wq-section-title">💡 Example Queries</h3>
            <div className="eg-grid">
              {[
                { icon:"📅", cat:"Time-Based",    examples:["How many items today?","Plastic count this week","Total waste this month"] },
                { icon:"🏷️", cat:"Categories",    examples:["How many glass items?","Show me organic waste count","Battery items in system"] },
                { icon:"📊", cat:"Performance",   examples:["What is the model accuracy?","Average confidence score?","Show model performance"] },
                { icon:"🔄", cat:"Comparisons",   examples:["Compare plastic vs metal","Plastic versus glass","E-waste vs organic"] },
              ].map((g) => (
                <div key={g.cat} className="eg-card">
                  <div className="eg-icon">{g.icon}</div>
                  <div className="eg-cat">{g.cat}</div>
                  {g.examples.map((ex) => (
                    <button
                      key={ex}
                      className="eg-example"
                      onClick={() => handleChipClick(ex)}
                    >
                      "{ex}"
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ─── sidebar: history ─── */}
        <aside className="wq-sidebar">
          <div className="wq-sidebar-card premium-card">
            <div className="wq-sidebar-header">
              <h3>Query History</h3>
              <button
                className="wq-refresh-btn"
                onClick={fetchHistory}
                title="Refresh"
              >
                ↻
              </button>
            </div>

            {history.length === 0 ? (
              <p className="wq-empty">No queries yet. Ask something above!</p>
            ) : (
              <ul className="wq-history-list">
                {history.map((h) => {
                  const meta = INTENT_COLORS[h.intent] || INTENT_COLORS.fallback;
                  return (
                    <li
                      key={h.id}
                      className="wq-hist-item"
                      onClick={() => handleChipClick(h.query)}
                    >
                      <span
                        className="wq-hist-badge"
                        style={{ background: meta.bg, color: meta.text }}
                      >
                        {meta.label}
                      </span>
                      <p className="wq-hist-q">"{h.query}"</p>
                      <p className="wq-hist-a">{h.response.slice(0, 80)}…</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* NLP info card */}
          <div className="wq-info-card premium-card">
            <h4>🧠 NLP Engine</h4>
            <p>Multi-intent keyword processor with <strong>12+ intent types</strong> including time-based filtering, category extraction, trend analysis, and comparison queries.</p>
            <div className="wq-intent-list">
              {["Total Count","Category Count","Today / Week / Month","Performance","Comparison","Trend","E-Waste","Recyclable","Recent"].map((i) => (
                <span key={i} className="wq-intent-pill">{i}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        /* ── page ── */
        .wq-page {
          animation: fadeInUp 0.8s ease-out;
          padding-bottom: 5rem;
        }

        /* ── hero ── */
        .wq-hero {
          text-align: center;
          margin-bottom: 3rem;
        }
        .wq-hero-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(16,185,129,.12), rgba(59,130,246,.12));
          border: 1px solid rgba(16,185,129,.25);
          color: var(--primary);
          padding: .4rem 1.25rem;
          border-radius: 50px;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 1.25rem;
        }
        .wq-hero h1 { font-size: 3rem; margin-bottom: .75rem; }
        .wq-hero-sub {
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── layout ── */
        .wq-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .wq-layout { grid-template-columns: 1fr; }
          .wq-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        }
        @media (max-width: 640px) {
          .wq-sidebar { grid-template-columns: 1fr; }
          .wq-hero h1 { font-size: 2rem; }
        }

        /* ── form ── */
        .wq-form {
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .wq-input-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .wq-input-wrap {
          flex: 1;
          position: relative;
        }
        .wq-input-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
        }
        .wq-input {
          width: 100%;
          padding: 1.1rem 1.25rem 1.1rem 3.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: .3s;
          background: #fafafa;
        }
        .wq-input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 5px rgba(16,185,129,.08);
        }
        .wq-icon-btn {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: .3s;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .wq-icon-btn.listening {
          background: #fef2f2;
          border-color: #ef4444;
          animation: pulse-ring 1s infinite;
        }
        .wq-ask-btn {
          padding: 0 2rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: .95rem;
          font-family: inherit;
          cursor: pointer;
          transition: .3s;
          white-space: nowrap;
          display: flex; align-items: center; gap: .5rem;
          flex-shrink: 0;
        }
        .wq-ask-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16,185,129,.35);
        }
        .wq-ask-btn:disabled { opacity: .55; cursor: not-allowed; }
        .wq-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          display: inline-block;
        }

        /* ── chips ── */
        .wq-chips {
          display: flex;
          flex-wrap: wrap;
          gap: .6rem;
        }
        .wq-chip {
          padding: .45rem 1rem;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: .8rem;
          font-family: inherit;
          color: var(--text-muted);
          cursor: pointer;
          transition: .25s;
          font-weight: 600;
        }
        .wq-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(16,185,129,.05);
        }

        /* ── response ── */
        .wq-response {
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .wq-res-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .wq-res-label {
          font-size: .75rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .wq-res-meta { display: flex; align-items: center; gap: .75rem; }
        .wq-intent-badge {
          font-size: .7rem;
          font-weight: 800;
          padding: .3rem .75rem;
          border-radius: 50px;
        }
        .wq-speak-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 1.1rem;
          cursor: pointer;
          opacity: .9;
          transition: .2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .wq-speak-btn:hover {
          opacity: 1;
          transform: translateY(-1px);
          border-color: var(--primary);
          box-shadow: 0 6px 14px rgba(16,185,129,.2);
        }
        .wq-res-text {
          font-size: 1.3rem;
          font-weight: 500;
          line-height: 1.65;
          color: var(--text-main);
          min-height: 1.5em;
        }

        /* ── thinking animation ── */
        .wq-thinking {
          display: flex;
          align-items: center;
          gap: .6rem;
          padding: .5rem 0;
        }
        .wq-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--primary);
          animation: bounce 1.2s infinite;
        }
        .wq-dot:nth-child(2) { animation-delay: .2s; }
        .wq-dot:nth-child(3) { animation-delay: .4s; }
        .wq-thinking-text { color: var(--text-muted); font-size: .95rem; }

        /* ── breakdown ── */
        .wq-breakdown { padding: 2rem; margin-bottom: 2rem; }
        .wq-section-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }
        .bd-list { display: flex; flex-direction: column; gap: .9rem; }
        .bd-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .bd-label {
          display: flex; align-items: center; gap: .6rem;
          width: 120px; flex-shrink: 0;
        }
        .bd-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .bd-name { font-weight: 700; font-size: .9rem; }
        .bd-track {
          flex: 1;
          height: 10px;
          background: #f1f5f9;
          border-radius: 50px;
          overflow: hidden;
        }
        .bd-fill {
          height: 100%;
          border-radius: 50px;
          transition: width 1.2s cubic-bezier(.16,1,.3,1);
        }
        .bd-count { width: 36px; text-align: right; font-weight: 700; font-size: .85rem; color: var(--text-muted); }
        .bd-pct   { width: 40px; text-align: right; font-weight: 800; font-size: .85rem; }

        /* ── examples ── */
        .wq-examples { padding: 2rem; }
        .eg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 1.25rem;
        }
        .eg-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid #e8edf2;
        }
        .eg-icon { font-size: 1.5rem; margin-bottom: .5rem; }
        .eg-cat  { font-weight: 800; font-size: .85rem; color: var(--text-muted); margin-bottom: .75rem; text-transform: uppercase; letter-spacing: .5px; }
        .eg-example {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          font-family: inherit;
          font-size: .85rem;
          color: var(--secondary);
          cursor: pointer;
          padding: .25rem 0;
          transition: .2s;
        }
        .eg-example:hover { color: var(--primary); text-decoration: underline; }

        /* ── sidebar ── */
        .wq-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .wq-sidebar-card { padding: 1.75rem; }
        .wq-sidebar-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.25rem;
        }
        .wq-sidebar-header h3 { font-size: 1rem; font-weight: 800; }
        .wq-refresh-btn {
          background: none; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: .3rem .6rem;
          cursor: pointer; font-size: 1rem; transition: .2s;
        }
        .wq-refresh-btn:hover { border-color: var(--primary); color: var(--primary); }
        .wq-empty { color: var(--text-muted); font-size: .9rem; text-align: center; padding: 1.5rem 0; }

        .wq-history-list { list-style: none; display: flex; flex-direction: column; gap: .75rem; }
        .wq-hist-item {
          padding: 1rem;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e8edf2;
          cursor: pointer;
          transition: .2s;
        }
        .wq-hist-item:hover { border-color: var(--primary); background: rgba(16,185,129,.03); }
        .wq-hist-badge {
          font-size: .65rem; font-weight: 800;
          padding: .2rem .6rem; border-radius: 50px;
          display: inline-block; margin-bottom: .4rem;
        }
        .wq-hist-q { font-weight: 700; font-size: .85rem; color: var(--text-main); margin-bottom: .25rem; }
        .wq-hist-a { font-size: .8rem; color: var(--text-muted); line-height: 1.4; }

        /* ── info card ── */
        .wq-info-card { padding: 1.75rem; }
        .wq-info-card h4 { font-weight: 800; margin-bottom: .75rem; }
        .wq-info-card p  { font-size: .85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem; }
        .wq-intent-list  { display: flex; flex-wrap: wrap; gap: .4rem; }
        .wq-intent-pill  {
          font-size: .7rem; font-weight: 700;
          padding: .25rem .65rem;
          border-radius: 50px;
          background: rgba(16,185,129,.08);
          color: var(--primary);
        }

        /* ── animations ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%,80%,100% { transform: scale(0.8); opacity: .5; }
          40%          { transform: scale(1.2); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,.4); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
}
