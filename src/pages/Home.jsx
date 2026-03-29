import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Let's create an accompanying CSS file for specific scoped animations

const Navbar = () => (
  <header className="navbar">
    <div className="navbar-container">
      <div className="navbar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">HushLink</span>
      </div>
      <nav className="navbar-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#testimonials">Testimonials</a>
      </nav>
      <div className="navbar-actions">
        <Link to="/register" className="btn btn-primary btn-sm">Start Free Trial</Link>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="hero" style={{ width: '100%', padding: '2rem 0 4rem 0' }}>
    <div className="container hero-container">
      <div className="hero-content">
        <div className="hero-badge">NEW: AI Content Assistant 2.0</div>
        <h1 className="hero-heading">
          Chat Without <span className="text-stroke">Limits</span>
        </h1>
        <p className="hero-subtext">HushLink combines absolute privacy with seamless connection. Set your terms, stay safe, and communicate without boundaries.</p>
        <div className="hero-ctas">
          <Link to="/register" className="btn btn-primary" style={{padding: '1.25rem 3rem', fontSize: '1.5rem'}}>Signup</Link>
          <Link to="/login" className="btn btn-secondary" style={{padding: '1.25rem 3rem', fontSize: '1.5rem'}}>Login</Link>
        </div>
      </div>
      <div className="hero-visual">
        <div className="browser-mockup">
          <div className="browser-header">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <div className="browser-body">
            {/* Minimal Dashboard Representation */}
            <div className="dash-sidebar bg-base"></div>
            <div className="dash-content">
              <div className="dash-card bg-accent"></div>
              <div className="dash-card bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Marquee = () => (
  <div className="marquee-container bg-base border-y">
    <div className="marquee-track">
      {[...Array(2)].map((_, i) => (
        <div className="marquee-content text-accent" key={i}>
          <span>ACME</span>
          <span>GLOBEX</span>
          <span>SOYUZ</span>
          <span>INITRO</span>
          <span>VANGUARD</span>
          <span>ZENITH</span>
        </div>
      ))}
    </div>
  </div>
);

const ProblemSolution = () => (
  <section id="problem-solution" className="bg-white">
    <div className="container grid-2">
      <div className="card card-problem">
        <h2>The Old Way</h2>
        <ul className="list-styled cross">
          <li>Forced to share your number</li>
          <li>Anyone can message you anytime</li>
          <li>Zero control over incoming requests</li>
        </ul>
      </div>
      <div className="card card-solution">
        <h2>The HushLink Way</h2>
        <ul className="list-styled check">
          <li>Username-only connections</li>
          <li>'Private' mode blocks random DMs</li>
          <li>Full control over who chats with you</li>
        </ul>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="bg-primary border-y border-standard">
    <div className="container">
      <h2 style={{textAlign: 'center', marginBottom:'3rem', fontSize:'3rem'}}>Everything You Need</h2>
      <div className="grid-3">
        {['Local Chats', 'Private Requests', 'Anonymous Mode'].map((feat, i) => (
          <div className="feature-card overflow-hidden" key={feat}>
            <div className="icon-box"></div>
            <h3>{feat}</h3>
            <p>Engage freely with your community while keeping your ultimate privacy strictly in your own hands.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="bg-base text-white border-b-2">
    <div className="container">
      <h2 style={{textAlign: 'center', marginBottom:'4rem', fontSize:'3.5rem', color:'var(--color-white)'}}>How It Works</h2>
      <div className="timeline">
        <div className="line"></div>
        <div className="step-wrapper">
          <div className="step-circle border-sage">1</div>
          <h3 className="text-white">Create Account</h3>
          <p className="text-accent">Pick your username. No phone number required.</p>
        </div>
        <div className="step-wrapper">
          <div className="step-circle border-yellow">2</div>
          <h3 className="text-white">Set Visibility</h3>
          <p className="text-accent">Choose between Local (Open) or Private (Requests Only).</p>
        </div>
        <div className="step-wrapper">
          <div className="step-circle border-white">3</div>
          <h3 className="text-white">Start Chatting</h3>
          <p className="text-accent">Connect with friends, safely and anonymously.</p>
        </div>
      </div>
    </div>
  </section>
);

const Personas = () => (
  <section className="bg-white">
    <div className="container grid-3">
      <div className="card persona-card bg-accent">
        <div className="pill">The Social Butterfly</div>
        <h3 style={{marginTop: '1rem'}}>Keeps profile Local to meet new people instantly.</h3>
      </div>
      <div className="card persona-card bg-primary shadow-hard-lg">
        <div className="pill border-standard">The Private Owl</div>
        <h3 style={{marginTop: '1rem'}}>Uses Private profile. Approves only trusted contacts.</h3>
      </div>
      <div className="card persona-card bg-dark-gray text-white">
        <div className="pill border-standard text-black">The Ghost</div>
        <h3 style={{marginTop: '1rem'}}>Hides username. Sends anonymous texts safely.</h3>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section id="testimonials" className="bg-accent border-y border-standard">
    <div className="container grid-3">
      {[1, 2, 3].map(i => (
        <div className="testimonial-card" key={i}>
          <div className="stars">★★★★★</div>
          <p className="quote">"HushLink completely changed how I connect online. The private requests feature is an absolute lifesaver!"</p>
          <p className="author">— User {i}</p>
        </div>
      ))}
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-primary border-b border-standard">
    <div className="container text-center">
      <h2 style={{fontSize: '4rem', marginBottom:'2rem'}}>Ready to take control?</h2>
      <Link to="/register" className="btn btn-primary" style={{fontSize: '1.25rem', padding: '1.5rem 3rem'}}>Create Your Account</Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer bg-base text-accent border-standard border-y-0 border-x-0">
    <div className="container footer-grid">
      <div className="footer-col">
        <h3 className="text-white">HushLink</h3>
        <p>Your secure space to chat.</p>
      </div>
      <div className="footer-col">
        <h4>Product</h4>
        <a href="#features">Features</a>
        <a href="#how">Pricing</a>
      </div>
      <div className="footer-col">
        <h4>Company</h4>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="footer-col">
        <h4>Social</h4>
        <div className="social-icons">
          <div className="social-icon"></div>
          <div className="social-icon"></div>
          <div className="social-icon"></div>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="landing-page bg-dots text-black" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-ctas {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-ctas {
            justify-content: center;
          }
          .logo-wrapper {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
      <header className="logo-wrapper" style={{ padding: '2rem 5%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontWeight: 900, fontSize: '3.5rem' }}>
        <div className="logo-icon" style={{ background: 'var(--color-black)', color: 'var(--color-primary)', padding: '0.2rem 0.6rem', border: '3px solid black', borderRadius: '4px', boxShadow: '4px 4px 0 0 black' }}>⚡</div>
        <span className="logo-text" style={{ letterSpacing: '-1px' }}>HushLink</span>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Hero />
      </main>
    </div>
  );
}
