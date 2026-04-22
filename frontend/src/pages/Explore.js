import React, { useState, useEffect } from 'react';
import '../styles/Explore.css';
import { FiHeart, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { products, categories } from '../data/products';

const occasions = ['All', 'Birthday', 'Anniversary', "Valentine's", 'Wedding', 'Baby Shower', 'Festival', 'Corporate', 'General'];
const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest'];

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState(params.get('occasion') || 'All');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [search, setSearch] = useState(params.get('search') || '');
  const [wishlist, setWishlist] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);

  useEffect(() => {
    setSelectedCategory(params.get('category') || 'all');
    setSelectedOccasion(params.get('occasion') || 'All');
    setSearch(params.get('search') || '');
  }, [location.search]);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedOccasion === 'All' || p.occasion === selectedOccasion)
    .filter(p => p.price <= priceRange)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.occasion.toLowerCase().includes(q) || p.keywords.some(k => k.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (selectedSort === 'Price: Low to High') return a.price - b.price;
      if (selectedSort === 'Price: High to Low') return b.price - a.price;
      return 0;
    });

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="explore">

      {/* Header */}
      <div className="explore-header">
        <p className="section-label">OUR COLLECTION</p>
        <h1>{currentCategory ? currentCategory.label : 'All Gifts'}</h1>
        <p className="explore-sub">{currentCategory ? currentCategory.description : 'Discover thoughtfully curated gifts for every occasion'}</p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('all'); navigate('/explore'); }}
        >
          All Gifts
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(cat.id); navigate(`/explore?category=${cat.id}`); }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search gifts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <FiX className="search-clear-btn" onClick={() => setSearch('')} />}
        </div>
      </div>

      {/* Occasion Pills */}
      <div className="occasion-pills">
        {occasions.map(o => (
          <button
            key={o}
            className={`pill ${selectedOccasion === o ? 'active' : ''}`}
            onClick={() => setSelectedOccasion(o)}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="explore-body">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h4><FiSliders style={{marginRight:'8px'}}/>Filters</h4>
          </div>

          <div className="sidebar-section">
            <p className="filter-label">Category</p>
            <div className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>All Gifts</div>
            {categories.map(c => (
              <div key={c.id} className={`filter-option ${selectedCategory === c.id ? 'active' : ''}`} onClick={() => setSelectedCategory(c.id)}>
                {c.emoji} {c.label}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <p className="filter-label">Max Price: ₹{priceRange.toLocaleString()}</p>
            <input type="range" min="100" max="5000" step="100" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="price-range" />
            <div className="price-labels"><span>₹100</span><span>₹5,000</span></div>
          </div>

          <div className="sidebar-section">
            <p className="filter-label">Sort By</p>
            {sortOptions.map(s => (
              <div key={s} className={`filter-option ${selectedSort === s ? 'active' : ''}`} onClick={() => setSelectedSort(s)}>{s}</div>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="products-section">
          <p className="results-count">{filtered.length} gifts found</p>
          {filtered.length === 0 ? (
            <div className="no-results"><p>No gifts found. Try adjusting your filters.</p></div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-img" onClick={() => navigate(`/product/${product.id}`)} style={{cursor:'pointer'}}>
                    <img src={product.image} alt={product.name} />
                    <button className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`} onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}>
                      <FiHeart />
                    </button>
                    <span className="product-tag">{product.tag}</span>
                  </div>
                  <div className="product-info">
                    <p className="product-category">{categories.find(c => c.id === product.category)?.label}</p>
                    <h3 onClick={() => navigate(`/product/${product.id}`)} style={{cursor:'pointer'}}>{product.name}</h3>
                    <p className="product-price">₹{product.price.toLocaleString()}</p>
                    <button className="btn-primary small" onClick={() => navigate(`/product/${product.id}`)}>
                      View & Personalize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Explore;