import React, { useState, useEffect, useRef } from "react";
import { speechService } from "../utils/speechService";
import recyclablesHero from "../assets/Recyclables.png";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TIP_CARDS = [
  {
    title: "Plastic",
    bin: "Blue Bin",
    tip: "Rinse and dry. Avoid oily plastics.",
    icon: "🧴",
    steps: [
      "Remove caps and labels when possible.",
      "Rinse and dry to avoid contamination.",
      "Flatten bottles and containers.",
      "Place in the blue recyclables bin."
    ]
  },
  {
    title: "Glass",
    bin: "Glass Bin",
    tip: "Remove caps and rinse bottles.",
    icon: "🍾",
    steps: [
      "Remove lids or caps.",
      "Rinse to remove residue.",
      "Keep broken glass wrapped or boxed.",
      "Place in the glass bin or drop-off."
    ]
  },
  {
    title: "Metal",
    bin: "Blue Bin",
    tip: "Crush cans to save space.",
    icon: "🥫",
    steps: [
      "Empty and rinse cans.",
      "Crush if safe to reduce volume.",
      "Remove non-metal parts if easy.",
      "Place in the blue recyclables bin."
    ]
  },
  {
    title: "Paper",
    bin: "Paper Bin",
    tip: "Keep paper dry and clean.",
    icon: "📄",
    steps: [
      "Keep paper dry and clean.",
      "Remove plastic covers or bindings.",
      "Flatten or stack neatly.",
      "Place in the paper bin."
    ]
  },
  {
    title: "Cardboard",
    bin: "Paper Bin",
    tip: "Flatten boxes before disposal.",
    icon: "📦",
    steps: [
      "Break down and flatten boxes.",
      "Remove tape if possible.",
      "Keep dry to prevent contamination.",
      "Place in the paper/cardboard bin."
    ]
  },
  {
    title: "Organic",
    bin: "Green Bin",
    tip: "Compost food scraps if possible.",
    icon: "🍎",
    steps: [
      "Remove packaging from food waste.",
      "Drain liquids when possible.",
      "Use compostable liners if available.",
      "Place in the green/organic bin."
    ]
  },
  {
    title: "Battery",
    bin: "E-Waste Drop-off",
    tip: "Never place in regular bins.",
    icon: "🔋",
    steps: [
      "Tape terminals to prevent sparks.",
      "Store in a dry container.",
      "Take to a certified drop-off point.",
      "Never place in household bins."
    ]
  },
  {
    title: "E-Waste",
    bin: "E-Waste Drop-off",
    tip: "Use certified recycling centers.",
    icon: "🔌",
    steps: [
      "Remove personal data if possible.",
      "Separate accessories like cables.",
      "Use authorized e-waste facilities.",
      "Ask for take-back programs."
    ]
  }
];

const SUGGESTIONS = [
  "How do I recycle batteries?",
  "Which bin for glass bottles?",
  "How to dispose a microwave?",
  "Where do I put plastic containers?",
  "Explain recycling tips for paper"
];

export default function RecyclingTips() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [featuredTip, setFeaturedTip] = useState(TIP_CARDS[0]);
  const [outOfScope, setOutOfScope] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const pick = TIP_CARDS[Math.floor(Math.random() * TIP_CARDS.length)];
    setFeaturedTip(pick);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${API}/nlp/suggestions`);
        const data = await res.json();
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions.slice(0, 6));
        }
      } catch {
        setSuggestions(SUGGESTIONS);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        speechService.stopListening(recognitionRef.current);
      }
    };
  }, []);

  const currentTip = TIP_CARDS.find((c) => c.title === selectedCategory) || featuredTip;

  const isRecyclingQuery = (text) => {
    const q = text.toLowerCase();
    const keywords = [
      "recycle", "recycling", "bin", "dispose", "disposal", "compost",
      "plastic", "paper", "glass", "metal", "cardboard", "organic",
      "battery", "e-waste", "ewaste", "tv", "microwave", "appliance"
    ];
    return keywords.some((k) => q.includes(k));
  };

  const fallbackSteps = (
    "I can only answer recycling questions here.\n" +
    "\nHow recycling works (simple steps):\n" +
    "1) Identify the material (plastic, glass, metal, paper, organic, e-waste).\n" +
    "2) Clean and dry items to avoid contamination.\n" +
    "3) Place items into the correct bin (Blue for recyclables, Green for organic, E-waste drop-off).\n" +
    "4) Flatten or break down items to save space.\n" +
    "5) Follow local rules for special items like batteries or appliances."
  );

  const handleAsk = async (customQuery) => {
    const q = (customQuery || query).trim();
    if (!q) return;
    if (!isRecyclingQuery(q)) {
      setOutOfScope(true);
      setResponse(fallbackSteps);
      speechService.speak("I can only answer recycling questions. Please ask about bins or recycling tips.");
      return;
    }
    setOutOfScope(false);
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch(`${API}/nlp/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setResponse(data.answer || data.error || "No response yet.");
      speechService.speak(data.answer || "I could not find a clear answer.");
    } catch (err) {
      setResponse("Unable to reach the recycling assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!speechService.isSupported()) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      speechService.stopListening(recognitionRef.current);
      setIsListening(false);
      return;
    }
    const rec = speechService.initializeRecognition((text) => {
      setQuery(text);
      setIsListening(false);
      handleAsk(text);
    }, () => setIsListening(false));
    recognitionRef.current = rec;
    speechService.startListening(rec);
    setIsListening(true);
  };

  return (
    <div className="tips-page">
      <header className="tips-hero">
        <div className="tips-hero-image">
          <img src={recyclablesHero} alt="Recycling guidance" />
        </div>
        <div className="tips-badge">SMART RECYCLING ASSISTANT</div>
        <h1 className="gradient-text">Recycling Tips & Smart Help</h1>
        <p>Ask questions in plain English and get practical, local-ready guidance.</p>
      </header>

      <section className="tips-nlp premium-card">
        <div className="tips-nlp-header">
          <h2>Ask the Recycling Assistant</h2>
          <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={toggleVoice}>
            {isListening ? "Listening..." : "🎤 Ask by Voice"}
          </button>
        </div>
        <div className="tips-quick-grid">
          <div className="tips-quick-card">
            <h4>Tip of the Day</h4>
            <p><strong>{featuredTip.title}</strong> → {featuredTip.tip}</p>
          </div>
          <div className="tips-quick-card">
            <h4>Bin Finder</h4>
            <div className="bin-finder">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Choose a category</option>
                {TIP_CARDS.map((card) => (
                  <option key={card.title} value={card.title}>{card.title}</option>
                ))}
              </select>
              <div className="bin-result">
                <span className="bin-icon">{currentTip.icon}</span>
                <div>
                  <div className="bin-name">{currentTip.bin}</div>
                  <div className="bin-tip">{currentTip.tip}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tips-input-row">
          <input
            type="text"
            placeholder="e.g. Which bin for a broken glass bottle?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => handleAsk()} disabled={loading || !query.trim()}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
        <div className="tips-suggestions">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleAsk(s)} className="tip-chip">{s}</button>
          ))}
        </div>
        {response && (
          <div className={`tips-response ${outOfScope ? "tips-response-alert" : ""}`}>
            <h4>Answer</h4>
            <p>{response}</p>
          </div>
        )}
      </section>

      <section className="tips-guide premium-card">
        <div className="guide-step">
          <span className="step-number">1</span>
          <div>
            <h3>Check the material</h3>
            <p>Identify the material type before placing it in a bin.</p>
          </div>
        </div>
        <div className="guide-step">
          <span className="step-number">2</span>
          <div>
            <h3>Clean & dry</h3>
            <p>Remove food residue and liquids for cleaner recycling streams.</p>
          </div>
        </div>
        <div className="guide-step">
          <span className="step-number">3</span>
          <div>
            <h3>Use the right bin</h3>
            <p>Follow local rules for glass, metal, paper, and e-waste.</p>
          </div>
        </div>
      </section>

      <section className="tips-grid">
        {TIP_CARDS.map((card) => (
          <div
            key={card.title}
            className={`tips-card premium-card ${activeCard === card.title ? "active" : ""}`}
            onClick={() => setActiveCard(activeCard === card.title ? null : card.title)}
          >
            <div className="tips-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p className="tips-bin">Bin: <strong>{card.bin}</strong></p>
            <p className="tips-tip">{card.tip}</p>
            <div className="tips-cta">View recycling steps →</div>
            {activeCard === card.title && (
              <div className="tips-steps">
                <h4>Recycling Steps</h4>
                <ol>
                  {card.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="tips-footer premium-card">
        <div>
          <h3>Need more help?</h3>
          <p>Ask the assistant specific items like "TV", "battery", or "microwave" for safe disposal guidance.</p>
        </div>
        <button onClick={() => speechService.speak("Ask me how to recycle batteries, glass, paper, or electronics.")}>🔊 Read Tips</button>
      </section>

      <style>{`
        .tips-page {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .tips-hero {
          text-align: center;
          position: relative;
          padding-top: 1rem;
          padding-right: 220px;
        }
        .tips-badge {
          display: inline-block;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary-dark);
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .tips-hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          margin-bottom: 0.5rem;
        }
        .tips-hero p {
          color: var(--text-muted);
          font-size: 1.05rem;
        }
        .tips-hero-image {
          position: absolute;
          top: 0.5rem;
          right: 0;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tips-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: rgba(15, 23, 42, 0.04);
          border-radius: 18px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .tips-nlp {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tips-quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        .tips-quick-card {
          padding: 1rem 1.2rem;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .tips-quick-card h4 {
          margin-bottom: 0.4rem;
          font-size: 1rem;
        }
        .bin-finder {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .bin-finder select {
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.1);
          font-family: inherit;
          background: rgba(255,255,255,0.8);
        }
        .bin-result {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }
        .bin-icon {
          font-size: 1.6rem;
        }
        .bin-name {
          font-weight: 700;
        }
        .bin-tip {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .tips-nlp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .voice-btn {
          border: none;
          background: rgba(59, 130, 246, 0.1);
          color: var(--secondary);
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
        }
        .voice-btn.listening {
          background: rgba(239, 68, 68, 0.15);
          color: #b91c1c;
        }

        .tips-input-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tips-input-row input {
          flex: 1;
          min-width: 260px;
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.7);
          font-family: inherit;
          color: var(--text-main);
        }
        .tips-input-row input::placeholder {
          color: #64748b;
          opacity: 1;
        }
        .tips-input-row button {
          border: none;
          padding: 0.9rem 1.4rem;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .tips-suggestions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .tip-chip {
          border: 1px dashed rgba(16, 185, 129, 0.3);
          background: transparent;
          border-radius: 999px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .tips-response {
          background: rgba(16, 185, 129, 0.08);
          padding: 1rem 1.2rem;
          border-radius: 12px;
          color: var(--text-main);
        }
        .tips-response-alert {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .tips-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .tips-card.active {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(0,0,0,0.08);
        }
        .tips-cta {
          margin-top: 0.4rem;
          font-weight: 700;
          color: var(--primary-dark);
        }
        .tips-steps {
          margin-top: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .tips-steps h4 {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        .tips-steps ol {
          padding-left: 1.2rem;
          color: var(--text-muted);
        }
        .tips-icon {
          font-size: 2rem;
        }
        .tips-bin {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .tips-tip {
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .tips-guide {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
        }
        .guide-step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.15);
          font-weight: 800;
          color: var(--primary-dark);
        }

        .tips-footer {
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tips-footer button {
          border: none;
          padding: 0.7rem 1.4rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--secondary);
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .tips-nlp {
            padding: 1.5rem;
          }
          .tips-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          .tips-hero {
            padding-right: 0;
          }
          .tips-hero-image {
            position: static;
            width: 100%;
            height: 200px;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
