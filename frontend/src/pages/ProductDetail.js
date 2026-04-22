import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { FiHeart, FiShare2, FiStar, FiTruck, FiShield, FiArrowLeft, FiShoppingCart, FiCheck, FiUpload, FiX } from 'react-icons/fi';
import { products, categories } from '../data/products';
import api from '../api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Personalization
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);

  if (!product) {
    return (
      <div style={{textAlign:'center', padding:'120px 60px'}}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/explore')} style={{marginTop:'16px', padding:'12px 24px', background:'#1a1a1a', color:'#fff', border:'none', cursor:'pointer', borderRadius:'4px'}}>Back to Explore</button>
      </div>
    );
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

const handleAddToCart = async () => {
  const isLoggedIn = !!localStorage.getItem('giftbloom_token');

  if (isLoggedIn) {
    const res = await api.addToCart({
      product_id: product.id,
      quantity,
      personalization: { recipientName, senderName, message, photo }
    });
    if (res.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  } else {
    const cart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
    const item = {
  product_id: product.id,
  quantity,
  personalization: {
    recipientName,
    senderName,
    message,
    photo
  },
  cartId: Date.now()
};
    cart.push(item);
    localStorage.setItem('giftbloom_cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  }
};

  const handleBuyNow = () => {
    const cart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
    const item = {
  product_id: product.id,
  quantity,
  personalization: {
    recipientName,
    senderName,
    message,
    photo
  },
  cartId: Date.now()
};
    cart.push(item);
    localStorage.setItem('giftbloom_cart', JSON.stringify(cart));
    const isLoggedIn = localStorage.getItem('giftbloom_user');
    navigate(isLoggedIn ? '/delivery' : '/login?redirect=delivery');
  };

  const isGreetingCard = product.category === 'greeting-cards';
  const categoryLabel = categories.find(c => c.id === product.category)?.label;

  return (
    <div className="product-detail-page">

      <button className="back-btn-detail" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="product-detail-body">

        {/* Left — Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            <button className={`detail-wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={() => setWishlisted(!wishlisted)}>
              <FiHeart />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((img, i) => (
                <div key={i} className={`thumbnail ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="product-details">

          <div className="detail-tags">
            <span className="detail-tag">{product.tag}</span>
            <span className="detail-category">{categoryLabel}</span>
            <span className="detail-occasion">{product.occasion}</span>
          </div>

          <h1>{product.name}</h1>

          <div className="detail-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'} />
              ))}
            </div>
            <span className="rating-number">{product.rating}</span>
            <span className="rating-reviews">({product.reviews} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="price-main">₹{product.price.toLocaleString()}</span>
            <span className="price-tax">Inclusive of all taxes</span>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-includes">
            <p className="includes-label">What's Included</p>
            <div className="includes-list">
              {product.includes.map((item, i) => (
                <div key={i} className="include-item">
                  <div className="include-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== PERSONALIZATION ===== */}
          <div className="personalization-section">
            <p className="personalization-title">
              {isGreetingCard ? '✏️ Design Your Card' : '🎨 Personalize This Gift'}
            </p>

            {isGreetingCard ? (
              // Greeting Card — Go to Card Editor
              <div className="card-editor-prompt">
                <p>This is a fully customizable greeting card. Click below to open our card editor where you can personalize text, add photos, and preview your card before printing.</p>
                <button className="btn-card-editor" onClick={() => navigate(`/card-editor/${product.id}`)}>
                  Open Card Editor →
                </button>
              </div>
            ) : (
              // Other products — Simple personalization
              <div className="personalize-fields">
                <div className="p-field">
                  <label>Recipient's Name <span className="req">*</span></label>
                  <input type="text" placeholder="Who is this for? e.g. Sarah" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="p-input" maxLength={30} />
                </div>
                <div className="p-field">
                  <label>Your Name <span className="req">*</span></label>
                  <input type="text" placeholder="Your name e.g. Rahul" value={senderName} onChange={e => setSenderName(e.target.value)} className="p-input" maxLength={30} />
                </div>
                <div className="p-field">
                  <label>Gift Message <span className="opt">(Optional)</span></label>
                  <textarea placeholder="Write a heartfelt message..." value={message} onChange={e => setMessage(e.target.value)} className="p-textarea" maxLength={150} />
                  <p className="p-hint">{message.length}/150</p>
                </div>
                <div className="p-field">
                  <label>Add a Photo <span className="opt">(Optional)</span></label>
                  {photo ? (
                    <div className="p-photo-preview">
                      <img src={photo} alt="uploaded" />
                      <button onClick={() => setPhoto(null)} className="p-remove-photo"><FiX /> Remove</button>
                    </div>
                  ) : (
                    <label className="p-upload">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                      <FiUpload /> Upload Photo
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantity */}
          {!isGreetingCard && (
            <div className="quantity-row">
              <p className="quantity-label">Quantity</p>
              <div className="quantity-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>
          )}

          {/* Delivery */}
          <div className="detail-delivery">
            <div className="delivery-info-row">
              <FiTruck className="delivery-info-icon" />
              <div>
                <p className="delivery-info-title">Estimated Delivery</p>
                <p className="delivery-info-value">{product.deliveryDays} business days</p>
              </div>
            </div>
            <div className="delivery-info-row">
              <FiShield className="delivery-info-icon" />
              <div>
                <p className="delivery-info-title">100% Secure</p>
                <p className="delivery-info-value">Safe packaging & secure payment</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isGreetingCard && (
            <div className="detail-actions">
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                {addedToCart ? <><FiCheck /> Added to Cart!</> : <><FiShoppingCart /> Add to Cart</>}
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Buy Now →
              </button>
              <button className={`btn-wishlist-detail ${wishlisted ? 'active' : ''}`} onClick={() => setWishlisted(!wishlisted)}>
                <FiHeart />
              </button>
              <button className="btn-share-detail" onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
                <FiShare2 />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      <div className="related-products">
        <h2>You might also like</h2>
        <div className="related-grid">
          {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
            <div key={p.id} className="related-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="related-img"><img src={p.image} alt={p.name} /></div>
              <p className="related-name">{p.name}</p>
              <p className="related-price">₹{p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ProductDetail;