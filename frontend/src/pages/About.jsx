import React from "react";
import { speechService } from "../utils/speechService";

export default function About() {
  const handleSpeak = () => {
    speechService.speak("Eco-Vision is a smart waste classification system powered by advanced deep learning. Our mission is to revolutionize waste management and support sustainable environmental practices.");
  };

  return (
    <div className="about-container">
      <header className="about-hero">
        <h1 className="gradient-text">About Eco-Vision</h1>
        <p>Revolutionizing waste management through advanced neural classification</p>
        <button className="speak-btn premium-card" onClick={handleSpeak}>
          🔊 Listen to Overview
        </button>
      </header>

      <div className="about-content">
        <section className="about-grid">
          <div className="mission-card premium-card">
            <div className="card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>To automate waste classification using Artificial Intelligence and support efficient waste segregation for better recycling and environmental management. We aim to bridge the gap between complex neural networks and everyday sustainable actions.</p>
          </div>

          <div className="stack-card premium-card">
            <h2>Technology Stack</h2>
            <div className="tech-tags">
              <span className="tech-tag">MobileNetV2</span>
              <span className="tech-tag">TensorFlow.js</span>
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">Neural Transfer</span>
            </div>
            <p className="stack-desc">Powered by a custom-tuned MobileNetV2 architecture with 87% validation accuracy across 17 distinct material categories.</p>
          </div>
        </section>

        <section className="training-section">
          <h2 className="section-title">Neural Training Roadmap</h2>
          <div className="roadmap">
            {[
              { title: "Data Ingestion", desc: "Gathered 5,000+ high-resolution samples in diverse environmental conditions." },
              { title: "Refinement", desc: "Advanced augmentation and normalization for robust classification." },
              { title: "Feature Extraction", desc: "Leveraged ImageNet pre-trained weights for deep feature understanding." },
              { title: "Fine-Tuning", desc: "Domain-specific optimization via specialized dense layers." }
            ].map((step, i) => (
              <div key={i} className="roadmap-step">
                <div className="step-num">{i + 1}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="future-scope premium-card">
          <h2>Future Horizons</h2>
          <ul className="horizons-list">
            <li>Integration with automated IoT smart receptacle systems</li>
            <li>Real-time object detection for high-volume sorting facilities</li>
            <li>Carbon footprint tracking based on classification volume</li>
            <li>Extended support for hazardous and medical waste materials</li>
          </ul>
        </section>
      </div>

      <style>{`
        .about-container {
          animation: fadeInUp 0.8s ease-out;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        .about-hero h1 { font-size: 3.5rem; }
        .about-hero p { color: var(--text-muted); font-size: 1.1rem; }

        .speak-btn {
          margin-top: 2rem;
          background: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 100px;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .speak-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .mission-card, .stack-card {
          padding: 3rem;
        }
        .card-icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .mission-card h2, .stack-card h2 { margin-bottom: 1.25rem; font-size: 1.8rem; }
        .mission-card p { line-height: 1.7; color: var(--text-muted); }

        .tech-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }
        .tech-tag {
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .stack-desc { color: var(--text-muted); line-height: 1.6; }

        .training-section { margin-bottom: 5rem; }
        .section-title { text-align: center; margin-bottom: 3rem; font-size: 2.2rem; }
        
        .roadmap {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }
        .roadmap-step {
          position: relative;
          padding: 1.5rem;
        }
        .step-num {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .roadmap-step h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
        .roadmap-step p { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }

        .future-scope {
          padding: 3.5rem;
          background: var(--text-main);
          color: white;
        }
        .future-scope h2 { color: white; margin-bottom: 2rem; font-size: 1.8rem; }
        .horizons-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem 3rem;
        }
        .horizons-list li {
          position: relative;
          padding-left: 1.5rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        .horizons-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .about-hero h1 { font-size: 2.5rem; }
          .horizons-list { grid-template-columns: 1fr; }
          .about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}