import React, { useState } from 'react';
import '../styles/CardEditor.css';
import { FiX, FiCheck, FiArrowLeft, FiShoppingCart, FiUpload } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import api from '../api';

const cardDesigns = [
  {
    id: 1,
    name: 'Classic Pink',
    occasion: 'Birthday',
    bg: '#FFF0F5',
    accent: '#E8709A',
    pattern: '♥',
    topBar: '#E8709A',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#FFF0F5', border: '2px solid #E8709A22', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#E8709A' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2, padding: '8px', opacity: 0.06, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#E8709A' }}>{'♥ '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#E8709A', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#E8709A' : '#E8709A55', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#444' : '#ccc', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#E8709A' : '#E8709A33'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#E8709A' : '#E8709A55', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `With love, ${senderName} ✦` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#E8709A', opacity: 0.5 }} />
        </div>
      );
    }
  },
  {
    id: 2,
    name: 'Golden Elegance',
    occasion: 'Wedding',
    bg: '#FFFBF0',
    accent: '#BA7517',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#FFFBF0', border: '2px solid #BA751722', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#BA7517' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2, padding: '8px', opacity: 0.06, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#BA7517' }}>{'★ '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#BA7517', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#BA7517' : '#BA751755', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#444' : '#ccc', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#BA7517' : '#BA751733'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#BA7517' : '#BA751755', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `With love, ${senderName} ✦` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#BA7517', opacity: 0.5 }} />
        </div>
      );
    }
  },
  {
    id: 3,
    name: 'Ivory Romance',
    occasion: 'Anniversary',
    bg: '#FFFDF5',
    accent: '#D4527F',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#FFFDF5', border: '2px solid #D4527F22', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#D4527F' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2, padding: '8px', opacity: 0.06, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#D4527F' }}>{'❀ '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#D4527F', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#D4527F' : '#D4527F55', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#444' : '#ccc', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#D4527F' : '#D4527F33'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#D4527F' : '#D4527F55', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `With love, ${senderName} ✦` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#D4527F', opacity: 0.5 }} />
        </div>
      );
    }
  },
  {
    id: 4,
    name: 'Sky Blue',
    occasion: 'Corporate',
    bg: '#EFF6FF',
    accent: '#185FA5',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#EFF6FF', border: '2px solid #185FA522', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#185FA5' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2.5, padding: '8px', opacity: 0.06, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#185FA5' }}>{'— '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#185FA5', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#185FA5' : '#185FA555', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#444' : '#ccc', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#185FA5' : '#185FA533'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#185FA5' : '#185FA555', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `Regards, ${senderName}` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#185FA5', opacity: 0.5 }} />
        </div>
      );
    }
  },
  {
    id: 5,
    name: 'Forest Green',
    occasion: 'Festival',
    bg: '#F0FFF5',
    accent: '#3B6D11',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#F0FFF5', border: '2px solid #3B6D1122', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#3B6D11' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2, padding: '8px', opacity: 0.06, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#3B6D11' }}>{'✿ '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#3B6D11', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#3B6D11' : '#3B6D1155', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#444' : '#ccc', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#3B6D11' : '#3B6D1133'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#3B6D11' : '#3B6D1155', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `With love, ${senderName} ✦` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#3B6D11', opacity: 0.5 }} />
        </div>
      );
    }
  },
  {
    id: 6,
    name: 'Midnight Dark',
    occasion: 'General',
    bg: '#1a1a1a',
    accent: '#e8a0b4',
    render: ({ title, recipientName, message, senderName, photo, size }) => {
      const s = size === 'small';
      return (
        <div style={{ backgroundColor: '#1a1a1a', border: '2px solid #e8a0b422', borderRadius: s ? '8px' : '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: s ? '130px' : '340px' }}>
          <div style={{ height: s ? '4px' : '8px', backgroundColor: '#e8a0b4' }} />
          <div style={{ position: 'absolute', inset: 0, fontSize: s ? '14px' : '22px', lineHeight: 2, padding: '8px', opacity: 0.08, overflow: 'hidden', wordBreak: 'break-all', pointerEvents: 'none', color: '#e8a0b4' }}>{'✦ '.repeat(80)}</div>
          <div style={{ position: 'relative', zIndex: 1, padding: s ? '10px 12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: s ? '6px' : '12px', flex: 1 }}>
            {photo && <div style={{ width: '100%', height: s ? '55px' : '160px', borderRadius: s ? '4px' : '8px', overflow: 'hidden', flexShrink: 0 }}><img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
            {title && <p style={{ fontSize: s ? '13px' : '22px', fontWeight: '700', color: '#e8a0b4', fontFamily: 'Playfair Display, serif', margin: 0 }}>{title}</p>}
            <p style={{ fontSize: s ? '10px' : '15px', fontWeight: '600', color: recipientName ? '#e8a0b4' : '#e8a0b455', fontFamily: 'Playfair Display, serif', margin: 0, fontStyle: recipientName ? 'normal' : 'italic' }}>{recipientName ? `Dear ${recipientName},` : 'Recipient name...'}</p>
            <p style={{ fontSize: s ? '9px' : '13px', color: message ? '#ccc' : '#555', fontStyle: 'italic', lineHeight: 1.6, fontFamily: 'Playfair Display, serif', margin: 0, paddingLeft: s ? '6px' : '12px', borderLeft: `2px solid ${message ? '#e8a0b4' : '#e8a0b433'}`, flex: 1 }}>{message ? `"${message}"` : 'Your message...'}</p>
            <p style={{ fontSize: s ? '9px' : '12px', fontWeight: '600', color: senderName ? '#e8a0b4' : '#e8a0b455', fontFamily: 'Playfair Display, serif', margin: 0, textAlign: 'right' }}>{senderName ? `With love, ${senderName} ✦` : '— Your name...'}</p>
          </div>
          <div style={{ height: s ? '3px' : '5px', backgroundColor: '#e8a0b4', opacity: 0.5 }} />
        </div>
      );
    }
  },
];

function CardEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));

  const [selectedDesign, setSelectedDesign] = useState(cardDesigns[0]);
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const cardProps = { title, recipientName, message, senderName, photo };

  const handleAddToCart = async () => {
    const isLoggedIn = !!localStorage.getItem('giftbloom_token');
const cartItem = {
  product_id: product.id,
  quantity: 1,
  personalization: {
    ...cardProps,
    designId: selectedDesign.id,
    designName: selectedDesign.name
  },
  cartId: Date.now()
};
    if (isLoggedIn) {
      await api.addToCart({ product_id: product.id, quantity: 1, personalization: cartItem.personalization });
    } else {
      const cart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
      cart.push(cartItem);
      localStorage.setItem('giftbloom_cart', JSON.stringify(cart));
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = async () => {
    const isLoggedIn = !!localStorage.getItem('giftbloom_token');
const cartItem = {
  product_id: product.id,
  quantity: 1,
  personalization: {
    ...cardProps,
    designId: selectedDesign.id,
    designName: selectedDesign.name
  },
  cartId: Date.now()
};
    if (isLoggedIn) {
      await api.addToCart({ product_id: product.id, quantity: 1, personalization: cartItem.personalization });
    } else {
      const cart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
      cart.push(cartItem);
      localStorage.setItem('giftbloom_cart', JSON.stringify(cart));
    }
    navigate(isLoggedIn ? '/delivery' : '/login?redirect=delivery');
  };

  if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}><h2>Card not found</h2></div>;

  return (
    <div className="card-editor-page">

      <div className="card-editor-header">
        <button className="back-btn-detail" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div>
          <p className="section-label">GREETING CARD EDITOR</p>
          <h1>{product.name}</h1>
          <p className="card-editor-sub">Choose a design and personalize the text — we print exactly what you see</p>
        </div>
      </div>

      <div className="card-editor-body">

        {/* Controls */}
        <div className="card-editor-controls">

          {/* Step 1: Choose Design */}
          <div className="editor-section">
            <h3>1. Choose a Card Design</h3>
            <p className="editor-section-sub">Select from our beautiful pre-designed cards</p>
            <div className="template-picker">
              {cardDesigns.map(design => (
                <div
                  key={design.id}
                  className={`template-pick ${selectedDesign.id === design.id ? 'active' : ''}`}
                  onClick={() => setSelectedDesign(design)}
                >
                  {design.render({ ...cardProps, size: 'small' })}
                  <p>{design.name}</p>
                  {selectedDesign.id === design.id && <FiCheck className="template-picked" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Edit Text */}
          <div className="editor-section">
            <h3>2. Personalize the Text</h3>
            <p className="editor-section-sub">Edit the content — the beautiful design stays as is</p>

            <div className="editor-field">
              <label>Card Title / Heading</label>
              <input type="text" placeholder='e.g. "Happy Birthday!", "With Love", "Congratulations!"' value={title} onChange={e => setTitle(e.target.value)} className="editor-input" maxLength={50} />
              <p className="editor-hint">{title.length}/50 characters</p>
            </div>

            <div className="editor-field">
              <label>Recipient's Name <span className="req">*</span></label>
              <input type="text" placeholder="Who is this card for? e.g. Sarah" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="editor-input" maxLength={30} />
            </div>

            <div className="editor-field">
              <label>Your Heartfelt Message</label>
              <textarea placeholder="Write something meaningful... e.g. May this special day bring you all the joy and happiness you deserve!" value={message} onChange={e => setMessage(e.target.value)} className="editor-textarea" maxLength={250} />
              <p className="editor-hint">{message.length}/250 characters</p>
            </div>

            <div className="editor-field">
              <label>Your Name <span className="req">*</span></label>
              <input type="text" placeholder="Your name e.g. Rahul" value={senderName} onChange={e => setSenderName(e.target.value)} className="editor-input" maxLength={30} />
            </div>
          </div>

          {/* Step 3: Add Photo */}
          <div className="editor-section">
            <h3>3. Add a Photo <span className="opt-label">(Optional)</span></h3>
            <p className="editor-section-sub">A personal photo makes the card extra special</p>
            {photo ? (
              <div className="editor-photo-preview">
                <img src={photo} alt="uploaded" />
                <button onClick={() => setPhoto(null)} className="remove-photo-btn"><FiX /> Remove</button>
              </div>
            ) : (
              <label className="editor-photo-upload">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                <FiUpload className="upload-icon" />
                <p>Click to upload a photo</p>
                <span>PNG or JPG, up to 10MB</span>
              </label>
            )}
          </div>

          {/* Price & Actions */}
          <div className="editor-section">
            <div className="editor-price-row">
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>Card Price</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#bbb' }}>Printed on 350gsm premium matte paper</p>
              </div>
              <span className="editor-price">&#8377;{product.price}</span>
            </div>
            <div className="editor-actions">
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                {addedToCart ? <><FiCheck /> Added to Cart!</> : <><FiShoppingCart /> Add to Cart</>}
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>Order Now →</button>
            </div>
          </div>

        </div>

        {/* Live Preview */}
        <div className="card-editor-preview">
          <p className="preview-label">Live Preview</p>
          <p className="preview-note">This is exactly what gets printed and delivered</p>
          {selectedDesign.render({ ...cardProps, size: 'large' })}
          <div className="preview-print-note">
            <p>Printed on 350gsm premium matte paper</p>
            <p>Delivered in a protective envelope</p>
            <p>Free delivery on all cards</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CardEditor;