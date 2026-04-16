import React, { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    type: "integration",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would send to an API
  };

  return (
    <div className="contact-container">
      <header className="contact-hero">
        <div className="hero-pill">Support + Partnerships</div>
        <h1 className="gradient-text">Get in Touch</h1>
        <p>Expert support for smart waste systems, AI integration, and field deployment</p>
        <div className="contact-highlights">
          <div className="highlight-card">
            <span className="highlight-value">24h</span>
            <span className="highlight-label">Response Time</span>
          </div>
          <div className="highlight-card">
            <span className="highlight-value">17</span>
            <span className="highlight-label">Categories Supported</span>
          </div>
          <div className="highlight-card">
            <span className="highlight-value">IoT + AI</span>
            <span className="highlight-label">Full Stack Guidance</span>
          </div>
        </div>
      </header>

      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-info premium-card">
            <h2>Contact Information</h2>
            <p>Connect with our technical team for integration support, hardware inquiries, or partnership opportunities.</p>
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Research Lab</h4>
                  <p>Eco-Vision Innovation Hub, Suite 402</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>support@ecovision.ai</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Technical Support</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Our Progress</h3>
              <div className="social-tags">
                <a className="social-tag" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
                <a className="social-tag" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="social-tag" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
              </div>
            </div>
            <div className="contact-cta">
              <a className="cta-btn" href="mailto:support@ecovision.ai">Email Support</a>
              <a className="cta-btn ghost" href="tel:+15551234567">Call Lab</a>
            </div>
          </div>

          <div className="contact-form-container premium-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-header">
                  <h2>Send a Request</h2>
                  <p>Tell us what you need and the right team member will respond.</p>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      required 
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Organization</label>
                    <input 
                      type="text" 
                      placeholder="EcoVision Lab" 
                      value={formState.organization}
                      onChange={e => setFormState({...formState, organization: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Inquiry Type</label>
                    <select
                      value={formState.type}
                      onChange={e => setFormState({...formState, type: e.target.value})}
                    >
                      <option value="integration">System Integration</option>
                      <option value="hardware">Hardware & Sensors</option>
                      <option value="partnership">Partnership</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message / Hardware Query</label>
                  <textarea 
                    rows="5" 
                    placeholder="Tell us about your project or required hardware support..." 
                    required
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
                <p className="form-note">We keep your information private and only use it to respond.</p>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out, {formState.name.split(' ')[0]}. Our technical team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="reset-btn">Send Another</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-container {
          animation: fadeInUp 0.8s ease-out;
          position: relative;
        }
        .contact-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.08), transparent 45%),
                      radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.08), transparent 40%),
                      radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.08), transparent 40%);
          z-index: -1;
        }
        .contact-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        .contact-hero h1 { font-size: 3.5rem; }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          color: var(--primary-dark);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .contact-highlights {
          margin-top: 2.5rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        .highlight-card {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .highlight-value {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary);
        }
        .highlight-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3rem;
          align-items: start;
        }

        .contact-info {
          padding: 3rem;
          background: #ffffff;
          color: var(--text-main);
          border: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        .contact-info::after {
          content: "";
          position: absolute;
          right: -60px;
          top: -60px;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 60%);
          opacity: 0.6;
        }
        .contact-info h2 { color: var(--text-main); margin-bottom: 1.5rem; }
        .contact-info p { color: var(--text-main); line-height: 1.6; margin-bottom: 2.5rem; }
        .contact-info h3,
        .contact-info h4,
        .contact-info a,
        .contact-info span {
          color: var(--text-main);
        }

        .info-items { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
        .info-item { display: flex; gap: 1.5rem; }
        .info-icon { font-size: 1.5rem; background: rgba(16, 185, 129, 0.2); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .info-item h4 { margin-top: 0; margin-bottom: 0.25rem; }
        .info-item p { margin: 0; font-size: 0.95rem; }

        .social-tags { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
        .social-tag { background: rgba(16, 185, 129, 0.1); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: 0.3s; color: var(--text-main); text-decoration: none; }
        .social-tag:hover { background: var(--primary); color: white; }

        .contact-cta {
          margin-top: 2.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cta-btn {
          padding: 0.7rem 1.4rem;
          border-radius: 999px;
          background: var(--primary);
          color: white;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn.ghost {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.2);
          color: var(--text-main);
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }

        .contact-form-container { padding: 3rem; }
        .form-header {
          margin-bottom: 2rem;
        }
        .form-header h2 {
          margin-bottom: 0.4rem;
        }
        .form-header p {
          color: var(--text-muted);
          margin: 0;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
        }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          transition: 0.3s;
          background: white;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

        .submit-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .submit-btn:hover { background: #059669; transform: translateY(-2px); }
        .form-note {
          margin-top: 1rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-align: center;
        }

        .success-message { text-align: center; padding: 2rem 0; }
        .success-icon { font-size: 3rem; color: var(--primary); margin-bottom: 1.5rem; }
        .reset-btn { margin-top: 1.5rem; background: transparent; border: 1px solid #e2e8f0; padding: 0.6rem 1.5rem; border-radius: 50px; cursor: pointer; }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-hero h1 { font-size: 2.5rem; }
          .contact-highlights { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}