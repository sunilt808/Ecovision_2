import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { speechService } from "../utils/speechService";
import { apiService } from "../services/apiService";
import realTimeSensor from "../assets/homepageimgs/Real-time Material Sensor.jpg";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Home = () => {
  const [showHow, setShowHow] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [modelError, setModelError] = useState(null);
  const handleSpeak = () => {
    speechService.speak("Welcome to Eco-Vision. This is your dashboard for intelligent waste classification. Navigate to Predict to upload waste images, view all categories, check statistics, or learn more about our project.");
  };

  const handleHowSpeak = () => {
    speechService.speak(
      "Eco-Vision works in five steps. One: capture or upload a photo. Two: the model detects the waste category. Three: you get the smart bin decision and disposal tips. Four: you can correct the label to improve the model. Five: analytics update in real time."
    );
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/history?limit=5`);
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
        setHistoryError(null);
      } catch {
        setHistoryError("Unable to load history.");
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const info = await apiService.getModelInfo();
        setModelInfo(info);
        setModelError(null);
      } catch {
        setModelError("Model status unavailable.");
      }
    };
    fetchModelInfo();
  }, []);

  const navCards = [
    { to: "/predict", icon: "📸", title: "Predict Waste", desc: "Instantly classify waste with AI-powered vision.", color: "var(--primary)" },
    { to: "/categories", icon: "📦", title: "Categories", desc: "Explore 17+ types of recyclable materials.", color: "var(--secondary)" },
    { to: "/stats", icon: "📊", title: "Statistics", desc: "Visualize environmental impact and trends.", color: "var(--accent)" },
    { to: "/recycling", icon: "♻️", title: "Recycling Tips", desc: "Get guidance on bins, tips, and disposal rules.", color: "#059669" },
    { to: "/nlp", icon: "🧠", title: "NLP Query", desc: "Ask natural language questions about waste data.", color: "#0ea5e9" },
    { to: "/about", icon: "ℹ️", title: "About", desc: "Learn about our vision for a zero-waste world.", color: "var(--text-main)" },
    { to: "/contact", icon: "✉️", title: "Contact", desc: "Get in touch with the Eco-Vision team.", color: "#f97316" }
  ];

  return (
    <div className="home-container">
      <header className="home-hero">
        <h1 className="gradient-text">Eco-Vision Dashboard</h1>
        <p>Smart Intelligence for Sustainable Waste Management</p>
        <div className="hero-actions">
          <button className="listen-btn" onClick={handleSpeak}>
            <span className="icon">🔊</span> Listen to Overview
          </button>
          <button className="how-btn" onClick={() => setShowHow(true)}>
            🧭 How the App Works
          </button>
        </div>
      </header>

      {showHow && (
        <div className="how-overlay" onClick={() => setShowHow(false)}>
          <div className="how-modal premium-card" onClick={(e) => e.stopPropagation()}>
            <div className="how-header">
              <h2>How Eco-Vision Works</h2>
              <button className="how-close" onClick={() => setShowHow(false)}>✕</button>
            </div>
            <p className="how-intro">
              Eco-Vision combines computer vision, smart bin logic, and real-time analytics to guide waste disposal.
            </p>
            <div className="how-steps">
              <div className="how-step">
                <span className="step-badge">1</span>
                <div>
                  <h4>Capture or Upload</h4>
                  <p>Use the camera or upload an image on the Predict page.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-badge">2</span>
                <div>
                  <h4>AI Classification</h4>
                  <p>The model detects the material from 17 waste categories.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-badge">3</span>
                <div>
                  <h4>Smart Bin Decision</h4>
                  <p>You receive the correct bin, confidence score, and disposal tips.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-badge">4</span>
                <div>
                  <h4>Feedback Loop</h4>
                  <p>Correct wrong results to improve future retraining.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-badge">5</span>
                <div>
                  <h4>Live Analytics</h4>
                  <p>Stats and trends update in real time on the dashboard.</p>
                </div>
              </div>
            </div>
            <div className="how-actions">
              <button className="how-audio" onClick={handleHowSpeak}>🔊 Read Steps</button>
              <button className="how-primary" onClick={() => setShowHow(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}

      <div className="home-nav-grid">
        {navCards.map((card, idx) => (
          <Link to={card.to} key={idx} className="home-card premium-card">
            <div className="card-icon-wrapper" style={{'--card-color': card.color}}>
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <div className="card-footer">
              <span>Continue</span>
              <span className="arrow">→</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="history-card premium-card">
        <div className="history-header">
          <h2>Recent Predictions</h2>
          <Link to="/predict" className="history-link">View Predict →</Link>
        </div>
        {historyLoading && <p className="history-muted">Loading recent predictions...</p>}
        {historyError && <p className="history-muted">{historyError}</p>}
        {!historyLoading && !historyError && history.length === 0 && (
          <p className="history-muted">No predictions yet. Try the Predict page.</p>
        )}
        {!historyLoading && history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-row">
                <span className="history-category">{item.category}</span>
                <span className="history-confidence">{item.confidence}%</span>
                <span className="history-time">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="model-status premium-card">
        <div className="model-status-header">
          <h2>Model Status</h2>
          <span className={`model-pill ${modelInfo?.loaded ? "ok" : "warn"}`}>
            {modelInfo?.loaded ? "Loaded" : "Not Loaded"}
          </span>
        </div>
        {modelError && <p className="history-muted">{modelError}</p>}
        {!modelError && modelInfo && (
          <div className="model-details">
            <div>
              <span className="detail-label">Classes</span>
              <span className="detail-value">{modelInfo.class_count}</span>
            </div>
            <div>
              <span className="detail-label">Model Path</span>
              <span className="detail-value">{modelInfo.model_path || "-"}</span>
            </div>
            <div>
              <span className="detail-label">Class Names</span>
              <span className="detail-value">{modelInfo.class_names_path || "-"}</span>
            </div>
          </div>
        )}
      </section>

      <section className="home-info-section">
        <h2 className="section-title">Why Eco-Vision?</h2>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">⚡</div>
            <h4>Real-time Processing</h4>
            <p>Get instant classification with 90% accuracy using our custom-trained MobileNetV2 architecture.</p>
          </div>
          <div className="info-item">
            <div className="info-icon">♻️</div>
            <h4>Eco Integration</h4>
            <p>Directly connected to local disposal guidelines for all identified waste categories.</p>
          </div>
          <div className="info-item">
            <div className="info-icon">🎙️</div>
            <h4>Accessibility</h4>
            <p>Voice-enabled navigation and audio descriptions for an inclusive user experience.</p>
          </div>
        </div>
      </section>

      <section className="home-snapshot premium-card">
        <div className="snapshot-text">
          <h2>System Snapshot</h2>
          <p>See how Eco-Vision detects materials in real time before sorting.</p>
        </div>
        <div className="snapshot-image">
          <img src={realTimeSensor} alt="Real-time material detection" />
        </div>
      </section>

      <style>{`
        .home-container {
          padding-bottom: 4rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .home-hero {
          text-align: center;
          margin-bottom: 2rem;
        }
        .home-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 0.5rem;
        }
        .home-hero p {
          color: var(--text-muted);
          font-size: 1.25rem;
          font-weight: 500;
        }

        .hero-actions {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .listen-btn {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          color: var(--primary-dark);
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        .how-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border: none;
          padding: 0.75rem 1.6rem;
          border-radius: 100px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
          transition: all 0.3s ease;
        }
        .how-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
        }
        .listen-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
          border-color: var(--primary);
        }

        .home-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          margin-bottom: 3rem;
          grid-auto-rows: 1fr;
        }

        .home-card {
          padding: 2.5rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .card-icon-wrapper {
          font-size: 3rem;
          width: 70px;
          height: 70px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.02);
        }
        .home-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .home-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex: 1;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          color: var(--primary);
          margin-top: auto;
        }
        .card-footer .arrow {
          transition: transform 0.3s ease;
        }
        .home-card:hover .card-footer .arrow {
          transform: translateX(5px);
        }

        .how-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
        }
        .how-modal {
          max-width: 720px;
          width: 100%;
          padding: 2rem;
        }
        .how-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .how-close {
          border: none;
          background: rgba(0,0,0,0.05);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
        }
        .how-intro {
          margin: 1rem 0 1.5rem;
          color: var(--text-muted);
        }
        .how-steps {
          display: grid;
          gap: 1rem;
        }
        .how-step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .step-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--primary-dark);
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .how-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .how-audio {
          border: none;
          background: rgba(59, 130, 246, 0.1);
          color: var(--secondary);
          font-weight: 700;
          padding: 0.7rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
        }
        .how-primary {
          border: none;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          font-weight: 700;
          padding: 0.7rem 1.6rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .section-title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .info-item {
          text-align: center;
        }
        .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          background: white;
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        }
        .info-item h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .info-item p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        .history-card {
          padding: 2rem;
          margin-bottom: 3rem;
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .history-link {
          text-decoration: none;
          color: var(--primary);
          font-weight: 700;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .history-row {
          display: grid;
          grid-template-columns: 1fr 120px 180px;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          background: rgba(255,255,255,0.7);
        }
        .history-category {
          font-weight: 700;
        }
        .history-confidence {
          color: var(--primary-dark);
          font-weight: 700;
          text-align: right;
        }
        .history-time {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: right;
        }
        .history-muted {
          color: var(--text-muted);
        }

        .model-status {
          padding: 2rem;
          margin-bottom: 3rem;
        }
        .model-status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .model-pill {
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          background: rgba(148, 163, 184, 0.2);
          color: var(--text-main);
        }
        .model-pill.ok {
          background: rgba(16, 185, 129, 0.15);
          color: var(--primary-dark);
        }
        .model-pill.warn {
          background: rgba(248, 113, 113, 0.15);
          color: #b91c1c;
        }
        .model-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .detail-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .detail-value {
          font-weight: 600;
          word-break: break-word;
        }

        .home-snapshot {
          margin-bottom: 2rem;
          padding: 2rem;
          display: grid;
          grid-template-columns: minmax(220px, 320px) 1fr;
          gap: 2rem;
          align-items: center;
        }
        .snapshot-text h2 {
          margin-bottom: 0.5rem;
        }
        .snapshot-text p {
          color: var(--text-muted);
        }
        .snapshot-image img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .home-hero h1 { font-size: 2rem; }
          .home-nav-grid { grid-template-columns: 1fr; }
          .info-grid { gap: 2rem; }
          .how-modal { padding: 1.5rem; }
          .history-row {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .history-confidence,
          .history-time {
            text-align: left;
          }
          .home-snapshot {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
          .snapshot-image img {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;