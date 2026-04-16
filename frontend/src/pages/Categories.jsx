import React, { useState } from "react";
import { speechService } from "../utils/speechService";

const WASTE_CATEGORIES = [
  { id: 1, name: "Battery", icon: "🔋", color: "#ef4444", description: "Rechargeable and single-use batteries", examples: "AA, phone batteries, power banks"},
  { id: 2, name: "Keyboard", icon: "⌨️", color: "#3b82f6", description: "Computer and electronic keyboards", examples: "USB, wireless, mechanical" },
  { id: 3, name: "Mobile", icon: "📱", color: "#10b981", description: "Smartphones and mobile devices", examples: "Phones, tablets, smartwatches" },
  { id: 4, name: "PCB", icon: "🔌", color: "#8b5cf6", description: "Printed circuit boards and components", examples: "Circuits, microchips, processors" },
  { id: 5, name: "Glass", icon: "🥤", color: "#06b6d4", description: "Glass bottles and containers", examples: "Bottles, jars, glassware" },
  { id: 6, name: "Metal", icon: "⚙️", color: "#475569", description: "Metal cans, foil, and metal items", examples: "Aluminium cans, steel, scrap" },
  { id: 7, name: "Plastic", icon: "🛍️", color: "#f59e0b", description: "Plastic bottles and packaging", examples: "PET bottles, bags, containers" },
  { id: 8, name: "Paper", icon: "📄", color: "#94a3b8", description: "Paper and cardboard products", examples: "Newspapers, boxes, paper bags" },
  { id: 9, name: "Trash", icon: "🗑️", color: "#451a03", description: "General non-recyclable waste", examples: "Mixed materials, soiled items" },
  { id: 10, name: "Printer", icon: "🖨️", color: "#0d9488", description: "Printers and printing equipment", examples: "Inkjets, lasers, cartridges" },
  { id: 11, name: "Mouse", icon: "🖱️", color: "#16a34a", description: "Computer mice and input devices", examples: "Wireless, optical, trackpads" },
  { id: 12, name: "Television", icon: "📺", color: "#6366f1", description: "Television sets and displays", examples: "LED, CRT, monitors" },
  { id: 13, name: "Microwave", icon: "🌊", color: "#dc2626", description: "Microwave ovens and appliances", examples: "Microwaves, toasters" },
  { id: 14, name: "Washing Machine", icon: "🧺", color: "#2563eb", description: "Laundry equipment", examples: "Washers, dryers" },
  { id: 15, name: "Cardboard", icon: "📦", color: "#92400e", description: "Cardboard and corrugated board", examples: "Delivery boxes, cartons" },
  { id: 16, name: "Organic", icon: "🌱", color: "#059669", description: "Food waste and organic materials", examples: "Peels, scraps, leaves" },
  { id: 17, name: "Player", icon: "🎮", color: "#4f46e5", description: "Media and gaming devices", examples: "Consoles, DVD players" }
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = WASTE_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    speechService.speak(`${category.name}: ${category.description}`);
  };

  return (
    <div className="categories-container">
      <header className="categories-hero">
        <h1 className="gradient-text">Waste Categories</h1>
        <p>A comprehensive guide to material classification and recycling</p>
        
        <div className="search-bar premium-card">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search categories (e.g. plastic, PCB)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>
      </header>

      <section className="categories-overview premium-card">
        <div className="overview-text">
          <h2>Overview</h2>
          <p>
            Eco-Vision recognizes <strong>17 waste categories</strong> organized into <strong>4 core groups</strong>:
            <strong style={{color: 'var(--primary)'}}>E-waste</strong> (electronics & appliances),
            <strong style={{color: 'var(--primary)'}}>Recyclables</strong> (paper, plastic, metal, glass),
            <strong style={{color: 'var(--primary)'}}>Organic</strong> (food waste & biodegradables),
            and <strong style={{color: 'var(--primary)'}}>General Trash</strong> (non-recyclable mixed waste).
          </p>
          <p style={{marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
            Use the search bar to filter by name or description, and click any card to open a detailed profile with disposal guidelines.
          </p>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">
            <span className="stat-number">17</span>
            <span className="stat-label">Total Categories</span>
          </div>
          <div className="overview-stat">
            <span className="stat-number">4</span>
            <span className="stat-label">Core Groups</span>
          </div>
          <div className="overview-stat">
            <span className="stat-number">1</span>
            <span className="stat-label">Click for Details</span>
          </div>
        </div>

        <div className="group-breakdown">
          <div className="group-item group-ewaste">
            <span className="group-label">🔌 E-waste</span>
            <span className="group-items">Battery, Keyboard, Mobile, Mouse, Printer, TV, Microwave, Washing Machine, Player, PCB</span>
          </div>
          <div className="group-item group-recyclable">
            <span className="group-label">♻️ Recyclables</span>
            <span className="group-items">Paper, Cardboard, Plastic, Glass, Metal</span>
          </div>
          <div className="group-item group-organic">
            <span className="group-label">🌱 Organic</span>
            <span className="group-items">Food scraps, peels, leaves, biodegradables</span>
          </div>
          <div className="group-item group-trash">
            <span className="group-label">🗑️ General Trash</span>
            <span className="group-items">Non-recyclable mixed waste, contaminated items</span>
          </div>
        </div>
      </section>

      <div className="categories-grid">
        {filteredCategories.map((cat) => (
          <div 
            key={cat.id} 
            className={`cat-card premium-card ${selectedCategory?.id === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
            style={{'--accent-color': cat.color}}
          >
            <div className="cat-icon-blob">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            <span className="view-link">Details →</span>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="detail-modal-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="detail-modal premium-card" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedCategory(null)}>✕</button>
            <div className="modal-header">
              <div className="modal-icon">{selectedCategory.icon}</div>
              <div className="modal-title-group">
                <h2 style={{color: selectedCategory.color}}>{selectedCategory.name}</h2>
                <p>Material Classification Profile</p>
              </div>
            </div>
            <div className="modal-body">
              <div className="info-section">
                <h4>Description</h4>
                <p>{selectedCategory.description}</p>
              </div>
              <div className="info-section">
                <h4>Common Examples</h4>
                <div className="example-tags">
                  {selectedCategory.examples.split(',').map((ex, i) => (
                    <span key={i} className="ex-tag">{ex.trim()}</span>
                  ))}
                </div>
              </div>
              <div className="info-section">
                <h4>Recycling Guidelines</h4>
                <p>Ensure these items are sorted correctly. {selectedCategory.name} specifically requires disposal at authorized facilities to minimize environmental footprint.</p>
              </div>
              <button 
                className="modal-audio-btn"
                onClick={() => speechService.speak(`${selectedCategory.name}: ${selectedCategory.description}. Examples include ${selectedCategory.examples}`)}
              >
                🔊 Audio Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="no-results premium-card">
          <h3>No matches found</h3>
          <p>Try adjusting your search terms</p>
          <button onClick={() => setSearchTerm("")}>Reset Search</button>
        </div>
      )}

      <style>{`
        .categories-container {
          animation: fadeInUp 0.8s ease-out;
        }

        .categories-hero {
          text-align: center;
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .categories-hero h1 {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
        }
        .categories-hero p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
        }

        .search-bar {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          padding: 0.5rem 1.5rem;
          gap: 1rem;
          border-radius: 100px;
        }
        .search-bar input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 0;
          font-size: 1.1rem;
          font-family: inherit;
          color: inherit;
          outline: none;
        }
        .search-icon {
          font-size: 1.25rem;
          opacity: 0.5;
        }
        .clear-search {
          background: #e2e8f0;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .categories-overview {
          width: 100%;
          margin: 0 auto 3rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        
        .overview-text {
          flex: 1;
        }
        
        .overview-text h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--text-main);
          font-weight: 800;
        }
        
        .overview-text p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 0.95rem;
        }
        
        .overview-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
          width: 100%;
        }
        
        .overview-stat {
          background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%);
          border: 1.5px solid rgba(16,185,129,0.2);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .overview-stat:hover {
          border-color: rgba(16,185,129,0.4);
          background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.08) 100%);
        }
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cat-card {
          padding: 2rem;
          cursor: pointer;
          text-align: center;
          border-top: 4px solid var(--accent-color);
        }
        .cat-icon-blob {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          background: white;
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 20px;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
        }
        .cat-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .cat-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .view-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          display: block;
        }
        .cat-card:hover .view-link {
          opacity: 1;
          transform: translateY(0);
        }

        .detail-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }
        .detail-modal {
          width: 100%;
          max-width: 600px;
          padding: 3rem;
          position: relative;
          background: white;
          animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .close-modal {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .modal-icon {
          font-size: 4rem;
          background: #f8fafc;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
        }
        .modal-title-group h2 {
          font-size: 2.25rem;
          font-weight: 800;
        }
        .modal-title-group p {
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }

        .info-section {
          margin-bottom: 2rem;
        }
        .info-section h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
        }
        .example-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .ex-tag {
          background: #f1f5f9;
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .modal-audio-btn {
          width: 100%;
          background: var(--text-main);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: transform 0.2s ease;
        }
        .modal-audio-btn:hover {
          transform: scale(1.02);
        }

        .no-results {
          text-align: center;
          padding: 4rem;
        }
        .no-results button {
          margin-top: 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .categories-hero h1 { font-size: 2.25rem; }
          .categories-overview {
            padding: 2rem 1.5rem;
            gap: 2rem;
          }
          .overview-text h2 {
            font-size: 1.5rem;
          }
          .overview-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .group-breakdown {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .group-item {
            padding: 1.5rem;
          }
          .modal-header { flex-direction: column; text-align: center; gap: 1rem; }
          .detail-modal { padding: 2rem; }
        }
        @media (max-width: 900px) {
          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
          .group-breakdown {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .group-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
          width: 100%;
        }

        .group-item {
          padding: 1.75rem;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 2px solid;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .group-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .group-item.group-ewaste {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .group-item.group-recyclable {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(34, 197, 94, 0.08) 100%);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .group-item.group-organic {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .group-item.group-trash {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(107, 114, 128, 0.08) 100%);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .group-label {
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .group-items {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
