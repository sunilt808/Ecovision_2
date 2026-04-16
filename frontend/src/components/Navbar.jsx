import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { speechService } from "../utils/speechService";

export default function Navbar({ onMenuToggle }) {
  const location = useLocation();
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ecovision-theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = stored || (prefersDark ? "dark" : "light");
    setIsDarkMode(initialTheme === "dark");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("ecovision-theme", nextTheme);
  };

  const handleSpeechToggle = () => {
    if (!speechService.isSupported()) {
      alert("Speech Recognition is not supported in your browser");
      return;
    }
    if (!isSpeechEnabled) {
      const rec = speechService.initializeRecognition(
        (transcript) => {
          console.log("Heard:", transcript);
          navigateByVoice(transcript.toLowerCase());
        },
        (error) => {
          console.error("Speech error:", error);
          setIsListening(false);
        }
      );
      setIsSpeechEnabled(true);
    } else {
      if (recognition) speechService.stopListening(recognition);
      setIsSpeechEnabled(false);
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (!isSpeechEnabled) return;
    if (!isListening) {
      speechService.startListening(recognition);
      setIsListening(true);
    } else {
      speechService.stopListening(recognition);
      setIsListening(false);
    }
  };

  const navigateByVoice = (transcript) => {
    const mapping = {
      "home": "/home",
      "predict": "/predict",
      "categor": "/categories",
      "stats": "/stats",
      "statistic": "/stats",
      "nlp": "/nlp",
      "query": "/nlp",
      "natural": "/nlp",
      "recycling": "/recycling",
      "tips": "/recycling",
      "about": "/about",
      "contact": "/contact"
    };
    for (const [key, path] of Object.entries(mapping)) {
      if (transcript.includes(key)) {
        window.location.href = path;
        break;
      }
    }
  };

  return (
    <nav className={`premium-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Logo width={40} height={40} />
          <span className="brand-text">Eco-Vision</span>
        </Link>

        <div className="nav-menu">
          {[
            { path: "/home", label: "Dashboard", icon: "🏠" },
            { path: "/predict", label: "Predict", icon: "📸" },
            { path: "/categories", label: "Categories", icon: "📦" },
            { path: "/stats", label: "Stats", icon: "📊" },
            { path: "/nlp", label: "NLP Query", icon: "🧠" },
            { path: "/recycling", label: "Recycling Tips", icon: "♻️" },
            { path: "/about", label: "About", icon: "ℹ️" },
            { path: "/contact", label: "Contact", icon: "✉️" }
          ].map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button 
            className={`action-btn speech ${isSpeechEnabled ? "active" : ""}`} 
            onClick={handleSpeechToggle}
            title="Toggle Voice Navigation"
          >
            🎤
          </button>
          <button 
            className="action-btn theme-toggle" 
            onClick={handleThemeToggle}
            title="Toggle Dark Mode"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>
          {isSpeechEnabled && (
            <button 
              className={`action-btn mic ${isListening ? "listening" : ""}`} 
              onClick={handleMicClick}
            >
              <span className="dot"></span>
            </button>
          )}
          <button 
            className="hamburger-menu" 
            onClick={onMenuToggle}
            title="Toggle Mobile Menu"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <style>{`
        .premium-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1.25rem 2rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent;
        }

        .premium-navbar.scrolled {
          padding: 0.75rem 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid var(--glass-border);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .nav-menu {
          display: flex;
          gap: 0.5rem;
          background: var(--glass-bg);
          padding: 0.4rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-muted);
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: var(--text-main);
          background: rgba(0,0,0,0.03);
        }

        .nav-link.active {
          background: var(--glass-bg);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        [data-theme="dark"] .nav-link.active {
          background: rgba(255, 255, 255, 0.1);
          color: var(--primary);
        }

        .nav-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.05);
          background: var(--glass-bg);
          color: var(--text-main);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        [data-theme="dark"] .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }

        .action-btn.theme-toggle {
          width: auto;
          padding: 0 0.9rem;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .action-btn.speech.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .action-btn.mic.listening {
          background: #ef4444;
          border-color: #ef4444;
        }

        .action-btn.mic.listening .dot {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 900px) {
          .nav-menu { display: none; }
          .premium-navbar { padding: 1rem; }
        }

        [data-theme="dark"] .premium-navbar.scrolled {
          background: rgba(15, 23, 42, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.35);
        }

        [data-theme="dark"] .nav-menu {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.08);
        }

        [data-theme="dark"] .nav-link {
          color: var(--text-muted);
        }

        [data-theme="dark"] .nav-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.08);
        }

        [data-theme="dark"] .nav-link.active {
          background: rgba(255, 255, 255, 0.12);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        }

        [data-theme="dark"] .action-btn {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }
      `}</style>
    </nav>
  );
}