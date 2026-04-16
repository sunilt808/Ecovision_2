import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import heroEcoFuture from "../assets/LandingPageImages/The Eco-Future Hero.jpg";
import smartHubBin from "../assets/LandingPageImages/The Smart Hub Bin.jpg";
import pureMaterials from "../assets/LandingPageImages/The Purity of Materials.jpg";
import digitalEcoFlow from "../assets/LandingPageImages/Digital Eco-Flow (Abstract).jpg";
import advancedAiDetection from "../assets/LandingPageImages/Advanced AI Detection.jpg";
import automatedRecycling from "../assets/LandingPageImages/Automated Recycling Robotics.jpg";
import globalConnectivity from "../assets/LandingPageImages/Global Connectivity.jpg";
import sustainableCommunity from "../assets/LandingPageImages/Sustainable Community Lifestyle.jpg";
import ecoCity from "../assets/eco_city.png";
import heroPremium from "../assets/hero_premium.png";
import smartDetection from "../assets/smart_detection.png";

export default function Landing() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { url: heroEcoFuture, title: "Eco-Future", desc: "Building sustainable cities through technology" },
    { url: heroPremium, title: "Hero Vision", desc: "Premium-grade sustainability experience" },
    { url: ecoCity, title: "Eco City", desc: "Smart urban waste intelligence" },
    { url: smartDetection, title: "Smart Detection", desc: "AI-assisted material recognition" },
    { url: smartHubBin, title: "Smart Segregation", desc: "AI-driven waste sorting with precision" },
    { url: pureMaterials, title: "Purity of Materials", desc: "Real-time material detection and classification" },
    { url: digitalEcoFlow, title: "Digital Eco-Flow", desc: "Optimizing the circular economy" },
    { url: advancedAiDetection, title: "Advanced AI Detection", desc: "Deep learning at the edge" },
    { url: automatedRecycling, title: "Automated Recycling", desc: "Robotics for efficient sorting" },
    { url: globalConnectivity, title: "Global Connectivity", desc: "Connected bins, connected cities" },
    { url: sustainableCommunity, title: "Sustainable Community", desc: "People-first circular systems" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="landing-container">
      <div className="bg-orbit"></div>
      <div className="bg-grid"></div>

      <header className="landing-topbar">
        <div className="landing-brand">
          <div className="landing-logo-wrapper">
            <Logo />
          </div>
          <div>
            <h1 className="landing-title">Eco-Vision</h1>
            <p className="landing-subtitle">Next-Gen Waste Classification</p>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="topbar-ghost" onClick={() => navigate("/recycling")}>
            Recycling Tips
          </button>
          <button className="topbar-primary" onClick={() => navigate("/home")}>
            Open Dashboard
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-kicker">AI-POWERED WASTE INTELLIGENCE</p>
          <h2 className="hero-title">A smarter city starts with smarter sorting.</h2>
          <p className="hero-description">
            Eco-Vision classifies waste into 17 categories, explains the best bin, and logs every prediction for impact analytics.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => navigate("/home")}>
              Get Started →
            </button>
            <button className="cta-ghost" onClick={() => navigate("/predict")}>
              Try Live Demo
            </button>
          </div>
          <div className="hero-metrics">
            <div className="metric-pill">17 Categories</div>
            <div className="metric-pill">Smart Bin Logic</div>
            <div className="metric-pill">Realtime Insights</div>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroPremium} alt="Eco-Vision AI preview" />
          <div className="visual-card">
            <h4>Live Recognition</h4>
            <p>Top-3 predictions + disposal tips in seconds.</p>
          </div>
          <div className="visual-chip">AI + IOT READY</div>
        </div>
      </section>

      <section className="impact-row">
        <div className="impact-card">
          <h3>90% Accuracy</h3>
          <p>Reliable classification from mixed waste images.</p>
        </div>
        <div className="impact-card">
          <h3>Smart Bins</h3>
          <p>Actionable disposal guidance for every category.</p>
        </div>
        <div className="impact-card">
          <h3>Analytics Ready</h3>
          <p>Track trends, volumes, and impact over time.</p>
        </div>
      </section>

      <section className="landing-showcase">
        <div className="showcase-header">
          <h2>Visualizing Sustainability</h2>
          <div className="showcase-line"></div>
        </div>

        <div className="slider-container">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === activeSlide ? "active" : ""}`}>
              <img src={slide.url} alt={slide.title} />
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}

          <div className="slide-progress">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-head">
          <p className="section-kicker">How it works</p>
          <h2>From photo to bin decision in seconds</h2>
          <p className="section-sub">
            Eco-Vision combines image intelligence, guidance logic, and analytics to help teams act fast and measure impact.
          </p>
        </div>
        <div className="how-steps">
          <div className="how-card">
            <span className="how-index">01</span>
            <h3>Capture</h3>
            <p>Upload or snap a waste image from any device or kiosk.</p>
          </div>
          <div className="how-card">
            <span className="how-index">02</span>
            <h3>Classify</h3>
            <p>AI predicts the top categories with confidence and context.</p>
          </div>
          <div className="how-card">
            <span className="how-index">03</span>
            <h3>Guide</h3>
            <p>Smart bin logic recommends the correct disposal path.</p>
          </div>
          <div className="how-card">
            <span className="how-index">04</span>
            <h3>Learn</h3>
            <p>Dashboards track trends, errors, and recycling impact.</p>
          </div>
        </div>
      </section>

      <section className="capabilities-section">
        <div className="section-head">
          <p className="section-kicker">Capabilities</p>
          <h2>Built for teams running real cities</h2>
          <p className="section-sub">Operational features that turn predictions into action.</p>
        </div>
        <div className="capability-grid">
          <div className="capability-card">
            <h3>Quality Gate</h3>
            <p>Detect blurry or low-light images before prediction.</p>
          </div>
          <div className="capability-card">
            <h3>Explainability</h3>
            <p>Show why the model made a decision in clear terms.</p>
          </div>
          <div className="capability-card">
            <h3>Offline Queue</h3>
            <p>Store predictions locally and sync when back online.</p>
          </div>
          <div className="capability-card">
            <h3>Batch Processing</h3>
            <p>Upload multiple items and export results instantly.</p>
          </div>
          <div className="capability-card">
            <h3>Recycling Tips NLP</h3>
            <p>Answer recycling questions with guided steps.</p>
          </div>
          <div className="capability-card">
            <h3>Feedback Loop</h3>
            <p>Collect user corrections to improve accuracy.</p>
          </div>
        </div>
      </section>

      <section className="integration-section">
        <div className="section-head">
          <p className="section-kicker">Ecosystem</p>
          <h2>Integrates with smart infrastructure</h2>
          <p className="section-sub">Designed to plug into bins, kiosks, and city dashboards.</p>
        </div>
        <div className="integration-strip">
          <span>Smart Bins</span>
          <span>Mobile Apps</span>
          <span>IoT Sensors</span>
          <span>City Dashboards</span>
          <span>Recycling Partners</span>
        </div>
      </section>

      <section className="voice-section">
        <div className="voice-card">
          <div>
            <p className="section-kicker">Voice assist</p>
            <h2>Hands-free guidance on the floor</h2>
            <p className="section-sub">
              Voice prompts help workers and citizens know the right bin without checking a screen.
            </p>
          </div>
          <div className="voice-cta">
            <button className="cta-ghost" onClick={() => navigate("/predict")}>Try Voice Demo</button>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="section-head">
          <p className="section-kicker">Field notes</p>
          <h2>What partners say</h2>
          <p className="section-sub">Early pilots highlight clarity, speed, and measurable impact.</p>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>“We reduced contamination in recyclable bins within two weeks.”</p>
            <span>City Ops Lead</span>
          </div>
          <div className="testimonial-card">
            <p>“The dashboard finally gives us evidence to plan routes.”</p>
            <span>Waste Analytics Manager</span>
          </div>
          <div className="testimonial-card">
            <p>“Operators love the live guidance. It feels effortless.”</p>
            <span>Facility Supervisor</span>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-head">
          <p className="section-kicker">FAQ</p>
          <h2>Common questions</h2>
          <p className="section-sub">Answers for teams evaluating Eco-Vision.</p>
        </div>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How accurate is the model?</h3>
            <p>Current pilots average around 90% with continuous feedback training.</p>
          </div>
          <div className="faq-item">
            <h3>Can it work offline?</h3>
            <p>Yes. Predictions can queue locally and sync when connectivity returns.</p>
          </div>
          <div className="faq-item">
            <h3>Does it support multiple sites?</h3>
            <p>Multi-site dashboards group data by location or facility.</p>
          </div>
          <div className="faq-item">
            <h3>What about privacy?</h3>
            <p>We store only prediction metadata and bin guidance results.</p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div>
          <h2>Ready to build a cleaner city?</h2>
          <p>Launch the dashboard, test live predictions, or explore recycling tips.</p>
        </div>
        <div className="hero-actions">
          <button className="cta-button" onClick={() => navigate("/home")}>Launch Dashboard</button>
          <button className="cta-ghost" onClick={() => navigate("/predict")}>Run a Test</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <h3>Eco-Vision</h3>
          <p>Waste intelligence for smarter, cleaner cities.</p>
        </div>
        <div className="footer-links">
          <button onClick={() => navigate("/recycling")}>Recycling Tips</button>
          <button onClick={() => navigate("/predict")}>Live Demo</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:wght@500;600;700&display=swap');

        :root {
          --primary: #10b981;
          --primary-dark: #059669;
          --secondary: #3b82f6;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --bg-light: #f8fafc;
          --card-bg: #ffffff;
          --card-border: rgba(15, 23, 42, 0.08);
          --glass-bg: rgba(255, 255, 255, 0.9);
        }

        .landing-container {
          font-family: 'Space Grotesk', sans-serif;
          min-height: 100vh;
          background-color: var(--bg-light);
          color: var(--text-main);
          position: relative;
          overflow: hidden;
          padding: 3.5rem 2rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        [data-theme="dark"] .landing-container {
          --text-main: #e2e8f0;
          --text-muted: #94a3b8;
          --bg-light: #0b1220;
          --card-bg: #0f172a;
          --card-border: rgba(255, 255, 255, 0.08);
          --glass-bg: rgba(15, 23, 42, 0.9);
          background-color: var(--bg-light);
          color: var(--text-main);
        }

        .bg-orbit {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 70%);
          filter: blur(20px);
          z-index: 0;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
          background-size: 120px 120px;
          z-index: 0;
        }

        [data-theme="dark"] .bg-grid {
          background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
        }

        .landing-topbar {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          z-index: 10;
        }

        .landing-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .landing-logo-wrapper {
          background: var(--card-bg);
          padding: 0.35rem;
          border-radius: 10px;
          box-shadow: 0 8px 18px rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--card-border);
        }

        .landing-title {
          font-size: 1.9rem;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
          font-family: 'Fraunces', serif;
        }

        .landing-subtitle {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary-dark);
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .topbar-ghost {
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--text-main);
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
        }

        .topbar-primary {
          border: none;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 0.65rem 1.5rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
        }

        .hero-section {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: minmax(280px, 1.1fr) minmax(260px, 0.9fr);
          gap: 3rem;
          align-items: center;
          z-index: 10;
        }

        .hero-kicker {
          font-size: 0.85rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--primary-dark);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .hero-title {
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.25rem;
          font-family: 'Fraunces', serif;
        }

        .hero-description {
          max-width: 640px;
          margin: 0 0 2rem;
          font-size: 1.15rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .cta-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 1.1rem 2.6rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.25);
        }

        .cta-ghost {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--text-main);
          padding: 1.05rem 2.4rem;
          font-size: 1.05rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .metric-pill {
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          color: var(--primary-dark);
          font-weight: 700;
          font-size: 0.85rem;
        }

        .hero-visual {
          position: relative;
          background: linear-gradient(145deg, var(--glass-bg), rgba(248,250,252,0.7));
          border-radius: 28px;
          padding: 1.25rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.12);
          border: 1px solid var(--card-border);
        }

        .hero-visual img {
          width: 100%;
          height: 360px;
          object-fit: cover;
          border-radius: 20px;
        }

        .visual-card {
          position: absolute;
          bottom: -1.2rem;
          left: 1.5rem;
          right: 1.5rem;
          background: var(--card-bg);
          padding: 1rem 1.2rem;
          border-radius: 16px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          border: 1px solid var(--card-border);
        }

        .visual-card h4 {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .visual-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .visual-chip {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: rgba(16, 185, 129, 0.9);
          color: white;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-size: 0.75rem;
          letter-spacing: 1px;
        }

        .impact-row {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          z-index: 10;
        }

        .impact-card {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid var(--card-border);
          box-shadow: 0 12px 24px rgba(0,0,0,0.05);
        }

        .impact-card h3 {
          font-weight: 700;
          margin-bottom: 0.6rem;
        }

        .impact-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .landing-showcase {
          width: 100%;
          max-width: 1200px;
          padding: 0 2rem;
          margin-bottom: 4rem;
          z-index: 10;
        }

        .section-head {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-kicker {
          font-size: 0.8rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--primary-dark);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .section-sub {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .how-section,
        .capabilities-section,
        .integration-section,
        .voice-section,
        .testimonial-section,
        .faq-section,
        .final-cta {
          width: 100%;
          max-width: 1200px;
          z-index: 10;
        }

        .how-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .how-card {
          background: var(--card-bg);
          padding: 1.6rem;
          border-radius: 18px;
          border: 1px solid var(--card-border);
          box-shadow: 0 12px 24px rgba(0,0,0,0.05);
        }

        .how-index {
          font-weight: 800;
          color: var(--secondary);
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .capability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .capability-card {
          background: linear-gradient(135deg, var(--glass-bg), rgba(248,250,252,0.7));
          padding: 1.5rem;
          border-radius: 18px;
          border: 1px solid var(--card-border);
          box-shadow: 0 14px 28px rgba(0,0,0,0.05);
        }

        .integration-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .integration-strip span {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-weight: 600;
        }

        .voice-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          border-radius: 22px;
          background: linear-gradient(120deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12));
          border: 1px solid rgba(0,0,0,0.06);
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .testimonial-card {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 18px;
          border: 1px solid var(--card-border);
          box-shadow: 0 14px 28px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-weight: 600;
        }

        .testimonial-card span {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .faq-item {
          background: var(--card-bg);
          padding: 1.4rem;
          border-radius: 16px;
          border: 1px solid var(--card-border);
        }

        .final-cta {
          background: linear-gradient(120deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15));
          padding: 2.5rem;
          border-radius: 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .landing-footer {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0 1rem;
          border-top: 1px solid var(--card-border);
          z-index: 10;
        }

        .landing-footer h3 {
          font-family: 'Fraunces', serif;
          margin-bottom: 0.25rem;
        }

        .footer-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer-links button {
          border: none;
          background: transparent;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .showcase-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .showcase-line {
          width: 80px;
          height: 6px;
          background: var(--primary);
          border-radius: 10px;
          margin: 0 auto;
        }

        .slider-container {
          position: relative;
          height: 560px;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.15);
        }

        .slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform: scale(1.05);
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
        }

        .slide-content {
          position: absolute;
          bottom: 3rem;
          left: 4rem;
          color: white;
          z-index: 20;
          max-width: 500px;
          text-align: left;
        }

        .slide-content h3 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .slide-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .slide-progress {
          position: absolute;
          bottom: 3rem;
          right: 4rem;
          display: flex;
          gap: 12px;
          z-index: 30;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: white;
          width: 35px;
          border-radius: 10px;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
          }
          .hero-visual img {
            height: 300px;
          }
          .visual-card {
            position: static;
            margin-top: 1rem;
          }
        }

        @media (max-width: 768px) {
          .landing-topbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-actions {
            flex-direction: column;
            align-items: flex-start;
          }
          .voice-card,
          .final-cta,
          .landing-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          .slider-container {
            height: 400px;
          }
          .slide-content {
            left: 1.5rem;
            bottom: 1.5rem;
          }
          .slide-progress {
            right: 1.5rem;
            bottom: 1.5rem;
          }
          .slide-content h3 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
