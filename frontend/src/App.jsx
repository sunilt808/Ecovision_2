import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Categories from "./pages/Categories";
import Stats from "./pages/Stats";
import About from "./pages/About";
import Contact from "./pages/Contact";
import WasteQuery from "./pages/WasteQuery";
import RecyclingTips from "./pages/RecyclingTips";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clear cached data on app startup
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("✅ Cache cleared on startup");
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <div className="app-wrapper">
              <Navbar onMenuToggle={handleMenuToggle} />
              <Sidebar isOpen={isSidebarOpen} onClose={handleMenuClose} />
              <main className="app-main">
                <div className="page-transition-container">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/predict" element={<Predict />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/nlp" element={<WasteQuery />} />
                    <Route path="/recycling" element={<RecyclingTips />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </div>
              </main>
              {/* Optional footer can go here */}
            </div>
          }
        />
      </Routes>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        :root {
          --primary: #10b981;
          --primary-dark: #059669;
          --secondary: #3b82f6;
          --accent: #8b5cf6;
          --bg: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --error-dark: #b91c1c;
          --error-light: #dc2626;
          --success-dark: #047857;
          --warning-dark: #b45309;
          --glass-bg: rgba(255, 255, 255, 0.7);
          --glass-border: rgba(255, 255, 255, 0.125);
          --input-bg: #ffffff;
          --card-bg: rgba(255, 255, 255, 0.7);
        }

        [data-theme="dark"] {
          --bg: #0b1220;
          --text-main: #e2e8f0;
          --text-muted: #94a3b8;
          --error-dark: #fca5a5;
          --error-light: #fecaca;
          --success-dark: #6ee7b7;
          --warning-dark: #fcd34d;
          --glass-bg: rgba(15, 23, 42, 0.7);
          --glass-border: rgba(255, 255, 255, 0.08);
          --input-bg: rgba(30, 41, 59, 0.9);
          --card-bg: rgba(15, 23, 42, 0.6);
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--bg);
          background-image: 
            radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%);
          color: var(--text-main);
          line-height: 1.6;
          min-height: 100vh;
          overflow-x: hidden;
        }

        [data-theme="dark"] body {
          background-image:
            radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.08) 0px, transparent 55%),
            radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 55%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0px, transparent 55%),
            radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.08) 0px, transparent 55%);
        }

        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-main {
          flex: 1;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          animation: pageFadeIn 0.8s ease-out;
        }

        .page-transition-container > * {
          animation: pageContentIn 0.6s ease-out;
        }

        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pageContentIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .app-main,
          .page-transition-container > * {
            animation: none !important;
          }
        }

        /* Reusable UI Components styling */
        .premium-card {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .app-main {
            padding: 1rem;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;