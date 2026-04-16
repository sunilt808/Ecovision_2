import React, { useEffect, useState } from "react";
import { speechService } from "../utils/speechService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, dailyRes, topRes, errRes] = await Promise.all([
          fetch(`${API}/statistics`),
          fetch(`${API}/analytics/daily?days=7`),
          fetch(`${API}/analytics/top-categories?limit=6`),
          fetch(`${API}/analytics/recent-errors?limit=6`)
        ]);

        const statsData = await statsRes.json();
        const dailyData = await dailyRes.json();
        const topData = await topRes.json();
        const errData = await errRes.json();

        setStats(statsData.error ? null : statsData);
        setDaily(dailyData.series || []);
        setTopCategories(topData.top_categories || []);
        setRecentErrors(errData.errors || []);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSpeak = () => {
    if (!stats) return;
    const summary = `Total predictions ${stats.total_predictions}. Average confidence ${stats.average_confidence} percent. Most common category ${stats.most_common || "unknown"}.`;
    speechService.speak(summary);
  };

  return (
    <div className="stats-page">
      <header className="stats-hero">
        <div>
          <h1 className="gradient-text">Live System Dashboard</h1>
          <p>Daily prediction flow, category insights, and correction feedback.</p>
        </div>
        <button className="stats-voice" onClick={handleSpeak} disabled={!stats}>
          🔊 Read Summary
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card premium-card">
          <h3>Total Predictions</h3>
          <p className="stat-value">{stats ? stats.total_predictions.toLocaleString() : loading ? "..." : "0"}</p>
        </div>
        <div className="stat-card premium-card">
          <h3>Avg Confidence</h3>
          <p className="stat-value">{stats ? `${stats.average_confidence}%` : loading ? "..." : "0%"}</p>
        </div>
        <div className="stat-card premium-card">
          <h3>Top Category</h3>
          <p className="stat-value">{stats ? stats.most_common || "-" : loading ? "..." : "-"}</p>
        </div>
        <div className="stat-card premium-card">
          <h3>Uploads / Camera</h3>
          <p className="stat-value">{stats ? `${stats.total_uploads} / ${stats.total_cameras}` : loading ? "..." : "0"}</p>
        </div>
      </section>

      <section className="stats-panels">
        <div className="panel premium-card">
          <h2>Last 7 Days Activity</h2>
          <div className="daily-list">
            {daily.length === 0 && !loading && <p>No data yet.</p>}
            {daily.map((d) => (
              <div key={d.date} className="daily-row">
                <span>{d.date}</span>
                <span>{d.count}</span>
                <div className="daily-bar">
                  <div className="daily-fill" style={{ width: `${Math.min(d.count * 5, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel premium-card">
          <h2>Top Categories</h2>
          <div className="top-list">
            {topCategories.length === 0 && !loading && <p>No data yet.</p>}
            {topCategories.map((c) => (
              <div key={c.category} className="top-row">
                <span>{c.category}</span>
                <span>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel premium-card">
          <h2>Recent Corrections</h2>
          <div className="error-list">
            {recentErrors.length === 0 && !loading && <p>No corrections yet.</p>}
            {recentErrors.map((e) => (
              <div key={e.id} className="error-row">
                <span>{e.predicted_category} → {e.corrected_category}</span>
                <span>{e.confidence ? `${e.confidence}%` : "-"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .stats-page {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: fadeInUp 0.8s ease-out;
        }
        .stats-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .stats-voice {
          border: none;
          background: rgba(59, 130, 246, 0.1);
          color: var(--secondary);
          font-weight: 700;
          padding: 0.7rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          padding: 1.5rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 0.5rem;
        }
        .stats-panels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .daily-row,
        .top-row,
        .error-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .daily-bar {
          flex: 1;
          height: 6px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 999px;
          margin-left: 1rem;
          overflow: hidden;
        }
        .daily-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        .error-row span:first-child {
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .stats-hero {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
