import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { path: "/home", label: "Dashboard", icon: "🏠" },
    { path: "/predict", label: "Predict", icon: "📸" },
    { path: "/categories", label: "Categories", icon: "📦" },
    { path: "/stats", label: "Stats", icon: "📊" },
    { path: "/nlp", label: "NLP Query", icon: "🧠" },
    { path: "/recycling", label: "Recycling Tips", icon: "♻️" },
    { path: "/about", label: "About", icon: "ℹ️" },
    { path: "/contact", label: "Contact", icon: "✉️" }
  ];

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <aside className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={onClose}>
            <Logo width={32} height={32} />
            <span className="brand-text">Eco-Vision</span>
          </Link>
          <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 1;
          transition: opacity 0.3s ease;
          z-index: 999;
          display: block;
        }

        .mobile-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 280px;
          background: var(--bg);
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        [data-theme="dark"] .mobile-sidebar {
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          gap: 1rem;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex: 1;
        }

        .sidebar-brand .brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-main);
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-main);
          padding-left: 1.5rem;
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .sidebar-icon {
          font-size: 1.25rem;
          min-width: 24px;
          text-align: center;
        }

        .sidebar-label {
          flex: 1;
        }

        @media (max-width: 768px) {
          .mobile-sidebar {
            width: 260px;
          }
        }
      `}</style>
    </>
  );
}
