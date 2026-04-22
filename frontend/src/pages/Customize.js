import React, { useState } from 'react';
import '../styles/Customize.css';
import { FiCheck, FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const occasionTemplates = {
  Birthday: [
    { id: 1, name: 'Confetti Celebration', bg: '#FFF0F5', accent: '#E8709A', pattern: 'confetti', emoji: '🎂' },
    { id: 2, name: 'Golden Wishes', bg: '#FFFBF0', accent: '#BA7517', pattern: 'stars', emoji: '⭐' },
    { id: 3, name: 'Minimal Bloom', bg: '#F5FFF5', accent: '#3B6D11', pattern: 'floral', emoji: '🌸' },
  ],
  Wedding: [
    { id: 4, name: 'Ivory Elegance', bg: '#FFFDF5', accent: '#BA7517', pattern: 'rings', emoji: '💍' },
    { id: 5, name: 'Rose Romance', bg: '#FFF0F5', accent: '#D4527F', pattern: 'roses', emoji: '🌹' },
    { id: 6, name: 'Classic White', bg: '#FFFFFF', accent: '#888', pattern: 'minimal', emoji: '🕊️' },
  ],
  Anniversary: [
    { id: 7, name: 'Forever Yours', bg: '#FFF0F5', accent: '#E8709A', pattern: 'hearts', emoji: '❤️' },
    { id: 8, name: 'Golden Years', bg: '#FFFBF0', accent: '#BA7517', pattern: 'stars', emoji: '✨' },
    { id: 9, name: 'Eternal Love', bg: '#F5F0FF', accent: '#534AB7', pattern: 'floral', emoji: '💜' },
  ],
  "Valentine's": [
    { id: 10, name: 'Sweet Heart', bg: '#FFF0F5', accent: '#E8709A', pattern: 'hearts', emoji: '💝' },
    { id: 11, name: 'Red Passion', bg: '#FFF5F5', accent: '#A32D2D', pattern: 'roses', emoji: '🌹' },
    { id: 12, name: 'Love Notes', bg: '#FFF8F0', accent: '#D4527F', pattern: 'minimal', emoji: '💌' },
  ],
  Festival: [
    { id: 13, name: 'Festive Gold', bg: '#FFFBF0', accent: '#BA7517', pattern: 'stars', emoji: '✨' },
    { id: 14, name: 'Diwali Glow', bg: '#FFF5E0', accent: '#EF9F27', pattern: 'confetti', emoji: '🪔' },
    { id: 15, name: 'Celebration', bg: '#F0FFF5', accent: '#3B6D11', pattern: 'floral', emoji: '🎊' },
  ],
  Corporate: [
    { id: 16, name: 'Professional', bg: '#F5F8FF', accent: '#185FA5', pattern: 'minimal', emoji: '💼' },
    { id: 17, name: 'Executive', bg: '#F5F5F5', accent: '#2C2C2A', pattern: 'minimal', emoji: '🏆' },
    { id: 18, name: 'Modern Blue', bg: '#EFF6FF', accent: '#378ADD', pattern: 'stars', emoji: '⭐' },
  ],
};

const addonCategories = [
  {
    category: 'Chocolates',
    items: [
      { id: 101, name: 'Ferrero Rocher', desc: 'Box of 16 golden hazelnut chocolates', price: 399, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=200&q=80' },
      { id: 102, name: 'Cadbury Silk Heart', desc: 'Velvety smooth milk chocolate heart box', price: 249, image: 'https://images.unsplash.com/photo-1511381939415-e44d9db77f71?w=200&q=80' },
      { id: 103, name: 'Lindt Assorted Box', desc: 'Premium Swiss chocolates, 20 pieces', price: 549, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80' },
    ]
  },
  {
    category: 'Flowers',
    items: [
      { id: 201, name: 'Red Rose Bouquet', desc: '12 fresh red roses with baby breath', price: 349, image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=200&q=80' },
      { id: 202, name: 'Sunflower Bunch', desc: '6 bright sunflowers with green fillers', price: 249, image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&q=80' },
      { id: 203, name: 'Mixed Lily Bouquet', desc: 'Fragrant pink and white lilies', price: 399, image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc01?w=200&q=80' },
    ]
  },
  {
    category: 'Greeting Cards',
    items: [
      { id: 301, name: 'Handcrafted Paper Card', desc: 'Elegant handmade paper with gold foil', price: 99, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=200&q=80' },
      { id: 302, name: 'Pop-up 3D Card', desc: 'Stunning 3D pop-up surprise inside', price: 149, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80' },
      { id: 303, name: 'Musical Greeting Card', desc: 'Plays a melody when opened', price: 199, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80' },
    ]
  },
  {
    category: 'Candles',
    items: [
      { id: 401, name: 'Lavender Soy Candle', desc: 'Hand-poured, 40hr burn time', price: 299, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&q=80' },
      { id: 402, name: 'Rose & Oud Candle', desc: 'Luxury scent, marble finish jar', price: 449, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80' },
      { id: 403, name: 'Vanilla Dream Candle', desc: 'Warm vanilla, wooden wick crackle', price: 349, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&q=80' },
    ]
  },
  {
    category: 'Soft Toys',
    items: [
      { id: 501, name: 'Teddy Bear Classic', desc: 'Super soft 30cm brown teddy bear', price: 349, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
      { id: 502, name: 'Bunny Plush', desc: 'Adorable white bunny, 25cm', price: 299, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
      { id: 503, name: 'Giant Panda Plush', desc: 'Huggable 50cm panda stuffed toy', price: 599, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
    ]
  },
  {
    category: 'Packaging',
    items: [
      { id: 601, name: 'Luxury Gift Box', desc: 'Rigid black box with satin ribbon', price: 149, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80' },
      { id: 602, name: 'Kraft Paper Wrap', desc: 'Eco-friendly wrap with twine bow', price: 79, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80' },
      { id: 603, name: 'Premium Hamper Basket', desc: 'Woven wicker basket with tissue fill', price: 249, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=200&q=80' },
    ]
  },
];

function GiftCardPreview({ template, recipientName, senderName, message, photo, size = 'large' }) {
  if (!template) return null;
  const isSmall = size === 'small';

  const patternContent = {
    hearts: '♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥',
    stars: '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★',
    confetti: '◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ● ◆ ◇ ●',
    floral: '✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀',
    roses: '❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾ ❀ ✾',
    rings: '○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯ ○ ◯',
    minimal: '— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —',
  };

  return (
    <div className={`gift-card-preview ${size}`} style={{ backgroundColor: template.bg, border: `2px solid ${template.accent}33` }}>

      {/* Top bar */}
      <div className="card-top-bar" style={{ backgroundColor: template.accent }} />

      {/* Background pattern */}
      <div className="card-pattern-bg" style={{ color: template.accent }}>
        {patternContent[template.pattern]}
      </div>

      {/* Content */}
      <div className="card-content">

        {/* Header row */}
        <div className="card-header-row">
          <div className="card-emoji-circle" style={{ backgroundColor: template.accent + '20' }}>
            <span className="card-emoji">{template.emoji}</span>
          </div>
          <div className="card-corner-circle" style={{ border: `2px solid ${template.accent}33` }} />
        </div>

        {/* Photo */}
        {photo && (
          <div className="card-photo">
            <img src={photo} alt="Personal" />
          </div>
        )}

        {/* Recipient */}
        <p className="card-recipient" style={{ color: template.accent }}>
          {recipientName ? `Dear ${recipientName},` : <span className="card-placeholder">Recipient name...</span>}
        </p>

        {/* Message */}
        <div className="card-message-wrap" style={{ borderLeft: `3px solid ${message ? template.accent : template.accent + '33'}` }}>
          <p className="card-message" style={{ color: message ? '#444' : '#ccc' }}>
            {message ? `"${message}"` : 'Your message will appear here...'}
          </p>
        </div>

        {/* Sender */}
        <p className="card-sender" style={{ color: template.accent }}>
          {senderName ? `With love, ${senderName} ✦` : <span className="card-placeholder">— Your name...</span>}
        </p>

      </div>

      {/* Bottom bar */}
      <div className="card-bottom-bar" style={{ backgroundColor: template.accent }} />

    </div>
  );
}

function Customize() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState('Birthday');
  const [selectedTemplate, setSelectedTemplate] = useState(occasionTemplates['Birthday'][0]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [activeAddonCategory, setActiveAddonCategory] = useState('Chocolates');

  const basePrice = 599;
  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = basePrice + addonTotal;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleAddon = (item) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === item.id)
        ? prev.filter(a => a.id !== item.id)
        : [...prev, item]
    );
  };

  const steps = ['Template', 'Personalize', 'Add-ons', 'Preview'];

  return (
    <div className="customize">

      {/* Header */}
      <div className="customize-header">
        <p className="section-label">CREATE YOUR GIFT</p>
        <h1>Customize Your Gift</h1>
        <p className="customize-sub">Design something truly personal and meaningful</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {steps.map((s, i) => (
          <div key={i} className={`step-item ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <div className="step-circle">
              {step > i + 1 ? <FiCheck /> : i + 1}
            </div>
            <p>{s}</p>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="customize-body">

        {/* Left Panel */}
        <div className="customize-panel">

          {/* STEP 1 — Template */}
          {step === 1 && (
            <div className="panel-section">
              <h2>Choose a Template</h2>
              <p className="panel-sub">Select an occasion and pick a design you love</p>

              <div className="occasion-selector">
                {Object.keys(occasionTemplates).map(occ => (
                  <button
                    key={occ}
                    className={`occasion-btn ${selectedOccasion === occ ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedOccasion(occ);
                      setSelectedTemplate(occasionTemplates[occ][0]);
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              <div className="template-list">
                {occasionTemplates[selectedOccasion].map(t => (
                  <div
                    key={t.id}
                    className={`template-option ${selectedTemplate.id === t.id ? 'active' : ''}`}
                    onClick={() => setSelectedTemplate(t)}
                  >
                    <div className="template-card-preview">
                      <GiftCardPreview
                        template={t}
                        recipientName="Sarah"
                        message="Wishing you a wonderful day!"
                        senderName="With love"
                        size="small"
                      />
                    </div>
                    <div className="template-option-info">
                      <p>{t.name}</p>
                      {selectedTemplate.id === t.id && <FiCheck className="template-check-icon" />}
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary full" onClick={() => setStep(2)}>
                Continue to Personalize →
              </button>
            </div>
          )}

          {/* STEP 2 — Personalize */}
         {/* STEP 2 — Personalize */}
{step === 2 && (
  <div className="panel-section">
    <h2>Personalize Your Card</h2>
    <p className="panel-sub">Add your personal touch — clean, simple and meaningful</p>

    <div className="personalize-form">

      <div className="personalize-field">
        <label>Recipient's Name <span className="required">*</span></label>
        <input
          type="text"
          placeholder="Who is this gift for? e.g. Sarah"
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          className="text-input"
          maxLength={30}
        />
        <p className="field-hint">This will appear on the card as "Dear {recipientName || '...'}"</p>
      </div>

      <div className="personalize-field">
        <label>Your Name <span className="required">*</span></label>
        <input
          type="text"
          placeholder="Your name e.g. Rahul"
          value={senderName}
          onChange={e => setSenderName(e.target.value)}
          className="text-input"
          maxLength={30}
        />
        <p className="field-hint">This will appear as "With love, {senderName || '...'}"</p>
      </div>

      <div className="personalize-field">
        <label>Your Message <span className="optional">(Optional)</span></label>
        <textarea
          className="message-box"
          placeholder="Write something heartfelt... e.g. Wishing you all the happiness in the world on your special day!"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={150}
        />
        <div className="message-footer">
          <p className="field-hint">Keep it short and meaningful</p>
          <p className="char-count">{message.length}/150</p>
        </div>
      </div>

      <div className="personalize-field">
        <label>Personal Photo <span className="optional">(Optional)</span></label>
        <p className="field-hint-top">Add a photo to make it extra special — it will appear on the card</p>
        {photo ? (
          <div className="photo-preview-box">
            <img src={photo} alt="Personal" />
            <button className="remove-photo" onClick={() => setPhoto(null)}>
              <FiX /> Remove Photo
            </button>
          </div>
        ) : (
          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
            <FiUpload className="upload-icon" />
            <p>Click to upload a photo</p>
            <span>PNG or JPG, up to 10MB</span>
          </label>
        )}
      </div>

    </div>

    <div className="step-buttons">
      <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
      <button
        className="btn-primary"
        onClick={() => setStep(3)}
        disabled={!recipientName || !senderName}
        style={{ opacity: (!recipientName || !senderName) ? 0.5 : 1 }}
      >
        Continue to Add-ons →
      </button>
    </div>
  </div>
)}

          {/* STEP 3 — Add-ons */}
          {step === 3 && (
            <div className="panel-section">
              <h2>Add Something Extra</h2>
              <p className="panel-sub">Choose specific items to make your gift even more special</p>

              <div className="addon-category-tabs">
                {addonCategories.map(cat => (
                  <button
                    key={cat.category}
                    className={`addon-tab ${activeAddonCategory === cat.category ? 'active' : ''}`}
                    onClick={() => setActiveAddonCategory(cat.category)}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              <div className="addon-items-grid">
                {addonCategories.find(c => c.category === activeAddonCategory)?.items.map(item => {
                  const selected = selectedAddons.find(a => a.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`addon-item-card ${selected ? 'active' : ''}`}
                      onClick={() => toggleAddon(item)}
                    >
                      <div className="addon-item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="addon-item-info">
                        <h4>{item.name}</h4>
                        <p>{item.desc}</p>
                        <span>₹{item.price}</span>
                      </div>
                      <div className={`addon-check ${selected ? 'active' : ''}`}>
                        {selected ? <FiCheck /> : '+'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedAddons.length > 0 && (
                <div className="addon-summary">
                  <p>Selected: <strong>{selectedAddons.map(a => a.name).join(', ')}</strong></p>
                  <p>Add-ons total: <strong>₹{addonTotal}</strong></p>
                </div>
              )}

              <div className="step-buttons">
                <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" onClick={() => setStep(4)}>Preview Gift →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — Preview */}
          {step === 4 && (
            <div className="panel-section">
              <h2>Your Gift is Ready!</h2>
              <p className="panel-sub">Here's exactly how your gift card will look when printed</p>

              <GiftCardPreview
                template={selectedTemplate}
                recipientName={recipientName}
                senderName={senderName}
                message={message}
                photo={photo}
                size="large"
              />

              <div className="summary-box" style={{ marginTop: '32px' }}>
                <div className="summary-row">
                  <span>Template</span>
                  <strong>{selectedTemplate.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Occasion</span>
                  <strong>{selectedOccasion}</strong>
                </div>
                <div className="summary-row">
                  <span>Recipient</span>
                  <strong>{recipientName}</strong>
                </div>
                <div className="summary-row">
                  <span>From</span>
                  <strong>{senderName}</strong>
                </div>
                <div className="summary-row">
                  <span>Add-ons</span>
                  <strong>{selectedAddons.length > 0 ? selectedAddons.map(a => a.name).join(', ') : 'None'}</strong>
                </div>
                <div className="summary-divider" />
                <div className="summary-row">
                  <span>Base Price</span>
                  <strong>₹{basePrice}</strong>
                </div>
                <div className="summary-row">
                  <span>Add-ons</span>
                  <strong>₹{addonTotal}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>₹{total}</strong>
                </div>
              </div>

              <div className="step-buttons" style={{ marginTop: '32px' }}>
                <button className="btn-secondary" onClick={() => setStep(3)}>← Back</button>
<button
  className="btn-primary"
  onClick={() => {
    const isLoggedIn = localStorage.getItem('giftbloom_user');
    if (isLoggedIn) {
      navigate('/delivery');
    } else {
      navigate('/login?redirect=delivery');
    }
  }}
>
  Proceed to Delivery →
</button>              </div>
            </div>
          )}

        </div>

        {/* Right Panel — Live Preview */}
        <div className="preview-panel">
          <p className="filter-label">Live Preview</p>
          <p className="preview-note">This is exactly how your card will look</p>

          <GiftCardPreview
            template={selectedTemplate}
            recipientName={recipientName}
            senderName={senderName}
            message={message}
            photo={photo}
            size="large"
          />

          {selectedAddons.length > 0 && (
            <div className="preview-addons">
              <p className="filter-label">Add-ons Included</p>
              <div className="addon-pills">
                {selectedAddons.map(a => (
                  <span key={a.id} className="addon-pill">✓ {a.name}</span>
                ))}
              </div>
            </div>
          )}

          <div className="price-summary">
            <div className="price-row">
              <span>Base Price</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="price-row">
              <span>Add-ons</span>
              <span>₹{addonTotal}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Customize;