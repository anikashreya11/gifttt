import React from 'react';
import '../styles/Home.css';
import { FiArrowRight, FiGift, FiTruck, FiBell, FiCreditCard, FiEdit3, FiPackage, FiStar, FiHeart, FiSun, FiBriefcase, FiAward, FiHome, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';

const features = [
  { icon: <FiGift />, title: 'Fully Customizable', desc: 'Personalize every gift with your name, message and photo.' },
  { icon: <FiTruck />, title: 'Reliable Delivery', desc: 'On-time delivery tracked at every step.' },
  { icon: <FiBell />, title: 'Smart Reminders', desc: 'Never miss a birthday or anniversary again.' },
  { icon: <FiCreditCard />, title: 'Secure Payments', desc: '100% safe and encrypted checkout.' },
];

const categoryIcons = {
  'greeting-cards': <FiEdit3 />,
  'hampers': <FiPackage />,
  'flowers': <FiHeart />,
  'jewellery': <FiStar />,
  'photo-frames': <FiGift />,
  'cake-flowers': <FiStar />,
};

const occasions = [
  { label: 'Birthday', filter: 'Birthday', icon: <FiStar /> },
  { label: 'Anniversary', filter: 'Anniversary', icon: <FiHeart /> },
  { label: "Valentine's", filter: "Valentine's", icon: <FiHeart /> },
  { label: 'Wedding', filter: 'Wedding', icon: <FiStar /> },
  { label: 'Baby Shower', filter: 'Baby Shower', icon: <FiUsers /> },
  { label: 'Festival', filter: 'Festival', icon: <FiSun /> },
  { label: 'Corporate', filter: 'Corporate', icon: <FiBriefcase /> },
  { label: 'General', filter: 'General', icon: <FiGift /> },
];

function Home() {
  const navigate = useNavigate();
  const bestsellers = products.filter(p => p.tag === 'Bestseller').slice(0, 4);

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-tagline">Thoughtfully Curated Gifts</p>
          <h1>Give the gift of <span>a memory</span></h1>
          <p className="hero-sub">Personalized hampers, custom cards, fresh flowers and meaningful gifts — delivered to your loved ones with care.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/explore')}>
              Explore Gifts <FiArrowRight style={{marginLeft: '8px'}} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/explore?category=greeting-cards')}>
              Design a Card
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFF0F5"/><stop offset="100%" stopColor="#FFF8F0"/></linearGradient>
                <linearGradient id="giftTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F9D0DE"/><stop offset="100%" stopColor="#F4B8CC"/></linearGradient>
                <linearGradient id="giftBox" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFF0F5"/></linearGradient>
                <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDDBB8"/><stop offset="100%" stopColor="#F9C99A"/></linearGradient>
                <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4B8CC"/><stop offset="100%" stopColor="#E8A0B4"/></linearGradient>
                <linearGradient id="ribbonV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8709A"/><stop offset="100%" stopColor="#D4527F"/></linearGradient>
              </defs>
              <rect x="20" y="20" width="640" height="480" rx="28" fill="url(#bgGrad)"/>
              <circle cx="580" cy="80" r="55" fill="#F9D0DE" opacity="0.35"/>
              <circle cx="100" cy="400" r="70" fill="#FFE4C4" opacity="0.3"/>
              <circle cx="560" cy="400" r="45" fill="#F9D0DE" opacity="0.25"/>
              <g opacity="0.5">
                <path d="M530,140 C530,137 534,133 538,137 C542,133 546,137 546,140 C546,145 538,152 538,152 C538,152 530,145 530,140Z" fill="#E8709A"/>
                <path d="M108,300 C108,297 112,293 116,297 C120,293 124,297 124,300 C124,305 116,312 116,312 C116,312 108,305 108,300Z" fill="#F9C99A" opacity="0.7"/>
              </g>
              <ellipse cx="340" cy="420" rx="75" ry="30" fill="#E8A0B4" opacity="0.2"/>
              <path d="M295,300 Q310,380 280,440 L400,440 Q370,380 385,300 Q362,320 340,318 Q318,320 295,300Z" fill="url(#dressGrad)"/>
              <path d="M300,310 Q260,340 245,370" stroke="#FDDBB8" strokeWidth="22" strokeLinecap="round" fill="none"/>
              <path d="M380,310 Q420,340 435,370" stroke="#FDDBB8" strokeWidth="22" strokeLinecap="round" fill="none"/>
              <ellipse cx="245" cy="373" rx="18" ry="14" fill="#FDDBB8"/>
              <ellipse cx="435" cy="373" rx="18" ry="14" fill="#FDDBB8"/>
              <rect x="238" y="330" width="204" height="42" rx="8" fill="url(#giftTop)"/>
              <rect x="248" y="370" width="184" height="120" rx="6" fill="url(#giftBox)" stroke="#F4B8CC" strokeWidth="1"/>
              <rect x="328" y="370" width="24" height="120" fill="url(#ribbonV)" opacity="0.7"/>
              <rect x="238" y="346" width="204" height="18" rx="4" fill="url(#ribbonV)" opacity="0.75"/>
              <rect x="328" y="330" width="24" height="42" fill="#D4527F" opacity="0.6"/>
              <ellipse cx="340" cy="333" rx="14" ry="10" fill="#E8709A"/>
              <ellipse cx="316" cy="326" rx="18" ry="11" fill="#E8709A" transform="rotate(-20,316,326)"/>
              <ellipse cx="364" cy="326" rx="18" ry="11" fill="#E8709A" transform="rotate(20,364,326)"/>
              <circle cx="340" cy="333" r="8" fill="#D4527F"/>
              <rect x="328" y="268" width="24" height="38" rx="10" fill="#FDDBB8"/>
              <ellipse cx="340" cy="240" rx="52" ry="56" fill="url(#skinGrad)"/>
              <path d="M292,225 Q295,170 340,168 Q385,170 388,225 Q375,195 340,192 Q305,195 292,225Z" fill="#6B3F2A"/>
              <path d="M292,225 Q285,250 290,270 Q295,215 310,210Z" fill="#6B3F2A"/>
              <path d="M388,225 Q395,250 390,270 Q385,215 370,210Z" fill="#6B3F2A"/>
              <path d="M316,238 Q322,232 328,238" stroke="#6B3F2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M352,238 Q358,232 364,238" stroke="#6B3F2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <ellipse cx="307" cy="252" rx="14" ry="9" fill="#F4A0B5" opacity="0.45"/>
              <ellipse cx="373" cy="252" rx="14" ry="9" fill="#F4A0B5" opacity="0.45"/>
              <path d="M322,262 Q340,276 358,262" stroke="#D4527F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <circle cx="290" cy="250" r="5" fill="#E8709A" opacity="0.8"/>
              <circle cx="390" cy="250" r="5" fill="#E8709A" opacity="0.8"/>
              <rect x="480" y="48" width="168" height="36" rx="18" fill="white" stroke="#F4B8CC" strokeWidth="1"/>
              <text x="514" y="71" fontFamily="Georgia, serif" fontSize="12" fill="#C06080" fontStyle="italic">Curated with love</text>
              <rect x="38" y="400" width="220" height="68" rx="16" fill="white" stroke="#F4B8CC" strokeWidth="0.5"/>
              <circle cx="66" cy="422" r="14" fill="#F9D0DE"/>
              <circle cx="66" cy="416" r="7" fill="#FDDBB8"/>
              <ellipse cx="66" cy="430" rx="9" ry="6" fill="#E8A0B4"/>
              <text x="88" y="418" fontFamily="Georgia, serif" fontSize="11.5" fontWeight="bold" fill="#2a2a2a">Priya just received her gift</text>
              <text x="88" y="434" fontFamily="Arial, sans-serif" fontSize="10.5" fill="#888">"I cried happy tears! Thank you!"</text>
              <circle cx="240" cy="412" r="5" fill="#4CAF88"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <p className="section-label">WHAT WE OFFER</p>
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className="category-card" onClick={() => navigate(`/explore?category=${cat.id}`)}>
              <div className="category-icon-wrap">{categoryIcons[cat.id]}</div>
              <h3>{cat.label}</h3>
              <p>{cat.description}</p>
              <span className="category-arrow">Shop Now <FiArrowRight size={12} /></span>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="trending">
        <p className="section-label">MOST LOVED</p>
        <h2>Bestselling Gifts</h2>
        <div className="product-grid">
          {bestsellers.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-img" onClick={() => navigate(`/product/${product.id}`)} style={{cursor:'pointer'}}>
                <img src={product.image} alt={product.name} />
                <span className="product-tag">{product.tag}</span>
              </div>
              <div className="product-info">
                <p className="product-category">{categories.find(c => c.id === product.category)?.label}</p>
                <h3 onClick={() => navigate(`/product/${product.id}`)} style={{cursor:'pointer'}}>{product.name}</h3>
                <p className="product-price">&#8377;{product.price.toLocaleString()}</p>
                <button className="btn-primary small" onClick={() => navigate(`/product/${product.id}`)}>View & Personalize</button>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <button className="btn-secondary" onClick={() => navigate('/explore')}>View All Gifts <FiArrowRight style={{marginLeft:'8px'}} /></button>
        </div>
      </section>

      {/* Occasions */}
      <section className="occasions">
        <p className="section-label">SHOP BY OCCASION</p>
        <h2>What are you celebrating?</h2>
        <div className="occasion-grid">
          {occasions.map((item, index) => (
            <div className="occasion-card" key={index} onClick={() => navigate(`/explore?occasion=${item.filter}`)} style={{cursor:'pointer'}}>
              <div className="occasion-icon">{item.icon}</div>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Giftbloom */}
      <section className="why-us">
        <p className="section-label">WHY GIFTBLOOM</p>
        <h2>Gifting, reimagined</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Giftbloom</h3>
            <p>Making every occasion unforgettable.</p>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <a href="/explore?category=greeting-cards">Greeting Cards</a>
            <a href="/explore?category=hampers">Hampers</a>
            <a href="/explore?category=flowers">Flowers</a>
            <a href="/explore?category=cake-flowers">Cake + Flowers</a>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <a href="/about">About Us</a>
            <a href="/about">Contact Us</a>
            <a href="/dashboard">Track Order</a>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Service</a>
            <a href="/">Refund Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Giftbloom. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;