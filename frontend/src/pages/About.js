import React from 'react';
import '../styles/About.css';
import { FiHeart, FiGift, FiBell, FiTruck, FiMail, FiPhone } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const team = [
  { name: 'Abhishek B', role: 'Co-Founder & CEO', initial: 'A' },
  { name: 'Design Team', role: 'Creative & UI/UX', initial: 'D' },
  { name: 'Tech Team', role: 'Engineering', initial: 'T' },
  { name: 'Ops Team', role: 'Delivery & Logistics', initial: 'O' },
];

const values = [
  { icon: <FiHeart />, title: 'Made with Love', desc: 'Every gift we curate is chosen with care and thoughtfulness, because we believe gifting is an act of love.' },
  { icon: <FiGift />, title: 'Personal Touch', desc: 'We believe the best gifts are the ones that feel personal. That\'s why we make every gift uniquely yours.' },
  { icon: <FiBell />, title: 'Never Miss a Moment', desc: 'Our smart reminders ensure you never miss a birthday, anniversary, or special occasion ever again.' },
  { icon: <FiTruck />, title: 'Reliable Delivery', desc: 'We take the last-mile seriously. Every gift is packed with care and delivered on time, every time.' },
];

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="about-hero">
        <p className="section-label">OUR STORY</p>
        <h1>We believe every gift <span>tells a story</span></h1>
        <p className="about-hero-sub">Giftbloom was born from a simple idea — that gifting should be personal, meaningful, and effortless. We're on a mission to make every occasion unforgettable.</p>
        <button className="btn-primary" onClick={() => navigate('/explore')}>
          Explore Our Gifts
        </button>
      </div>

      {/* Mission */}
      <section className="about-mission">
        <div className="mission-content">
          <div className="mission-text">
            <p className="section-label">OUR MISSION</p>
            <h2>Making gifting personal again</h2>
            <p>In a world of generic gifts and last-minute orders, we're building something different. Giftbloom lets you create truly personalized gifts — from custom cards to curated hampers — that show the people you love just how much you care.</p>
            <p>We started with a simple question: why is it so hard to find the perfect gift? The answer led us to build a platform where every gift is thoughtfully designed, beautifully packaged, and delivered with care.</p>
          </div>
          <div className="mission-stats">
            <div className="mission-stat">
              <p className="stat-big">10K+</p>
              <p className="stat-desc">Happy Customers</p>
            </div>
            <div className="mission-stat">
              <p className="stat-big">50K+</p>
              <p className="stat-desc">Gifts Delivered</p>
            </div>
            <div className="mission-stat">
              <p className="stat-big">100+</p>
              <p className="stat-desc">Cities Covered</p>
            </div>
            <div className="mission-stat">
              <p className="stat-big">4.9★</p>
              <p className="stat-desc">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <p className="section-label">WHAT WE STAND FOR</p>
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <p className="section-label">THE PEOPLE BEHIND GIFTBLOOM</p>
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar-initial">{member.initial}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="about-contact">
        <div className="contact-card">
          <h2>Get in Touch</h2>
          <p>Have questions or feedback? We'd love to hear from you.</p>
          <div className="contact-options">
            <div className="contact-option">
              <FiMail className="contact-icon" />
              <div>
                <p className="contact-label">Email Us</p>
                <p className="contact-value">hello@giftbloom.in</p>
              </div>
            </div>
            <div className="contact-option">
              <FiPhone className="contact-icon" />
              <div>
                <p className="contact-label">Call Us</p>
                <p className="contact-value">+91 98765 43210</p>
              </div>
            </div>
          </div>
          <button className="btn-contact" onClick={() => navigate('/explore')}>
            Start Gifting Today →
          </button>
        </div>
      </section>

    </div>
  );
}

export default About;