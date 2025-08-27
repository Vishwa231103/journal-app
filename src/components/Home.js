import React, { useState, useEffect } from "react";
import { FiBookOpen, FiArrowRight, FiFeather, FiHeart, FiBarChart2, FiLock } from "react-icons/fi";
import "./Home.css";

function Home({ onStart }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      {/* Hero Section */}
      <div className={`hero ${loaded ? 'loaded' : ''}`}>
        <div className="hero-content">
          <div className="logo-container">
            <FiBookOpen className="hero-icon" />
          </div>
          <h1 className="hero-title">My Journal App</h1>
          <p className="hero-subtitle">
            Capture your thoughts, track your mood, and reflect on your personal journey in a beautiful, private space.
          </p>
          <button className="btn btn-primary hero-btn" onClick={onStart}>
            <span>Get Started</span>
            <FiArrowRight className="btn-icon" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Why Choose Our Journal App?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiFeather />
            </div>
            <h3>Easy to Use</h3>
            <p>Simple, intuitive interface designed for effortless journaling anytime, anywhere.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FiBarChart2 />
            </div>
            <h3>Track Your Progress</h3>
            <p>Review your entries over time and observe patterns in your thoughts and moods.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FiLock />
            </div>
            <h3>Private & Secure</h3>
            <p>Your thoughts are yours alone. We use encryption to keep your journal private.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FiHeart />
            </div>
            <h3>Mood Tracking</h3>
            <p>Tag your entries with moods to better understand your emotional journey.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">What Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <div className="testimonial-content">
              "This journal app has become an essential part of my daily routine. It's beautiful and easy to use!"
            </div>
            <div className="testimonial-author">- Alex K.</div>
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              "I've tried many journal apps, but this one stands out with its clean design and mood tracking features."
            </div>
            <div className="testimonial-author">- Sarah M.</div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="footer-cta">
        <h2>Ready to Start Your Journaling Journey?</h2>
        <button className="btn btn-secondary" onClick={onStart}>
          Begin Journaling Now
        </button>
      </div>
    </div>
  );
}

export default Home;
