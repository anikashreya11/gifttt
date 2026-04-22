import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiBell, FiMenu, FiX, FiUser, FiSearch, FiLogOut, FiPackage } from 'react-icons/fi';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

 const { user, isLoggedIn, logout } = useAuth();

const handleLogout = () => {
  logout();
  setShowUserMenu(false);
  navigate('/');
};

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (product) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/product/${product.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/explore?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">Giftbloom</Link>
      </div>

      {/* Search */}
      <div className="navbar-search" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <FiSearch className="search-bar-icon" />
          <input
            type="text"
            placeholder="Search gifts, hampers, flowers..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="navbar-search-input"
            onFocus={() => searchQuery.length > 1 && setShowResults(true)}
          />
          {searchQuery && (
            <button type="button" className="search-clear" onClick={() => { setSearchQuery(''); setShowResults(false); }}>
              <FiX />
            </button>
          )}
        </form>
        {showResults && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map(product => (
              <div key={product.id} className="search-result-item" onClick={() => handleResultClick(product)}>
                <img src={product.image} alt={product.name} className="search-result-img" />
                <div className="search-result-info">
                  <p className="search-result-name">{product.name}</p>
                  <p className="search-result-price">&#8377;{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div className="search-see-all" onClick={() => { navigate(`/explore?search=${searchQuery}`); setShowResults(false); setSearchQuery(''); }}>
              See all results for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
      </div>

      {/* Right Icons */}
      <div className="navbar-icons">
        <FiHeart className="nav-icon" title="Wishlist" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}} />
        <div className="cart-icon-wrap" onClick={() => navigate('/cart')} style={{cursor:'pointer'}}>
          <FiShoppingCart className="nav-icon" title="Cart" />
          <span className="cart-badge">0</span>
        </div>
        <FiBell className="nav-icon" title="Notifications" onClick={() => navigate('/notifications')} style={{cursor:'pointer'}} />

        {isLoggedIn ? (
          <div className="user-menu-wrap" ref={userMenuRef}>
            <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <p className="user-dropdown-name">{user.name}</p>
                  <p className="user-dropdown-email">{user.email}</p>
                </div>
                <div className="user-dropdown-divider" />
                <button className="user-dropdown-item" onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                  <FiUser /> My Account
                </button>
                <button className="user-dropdown-item" onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                  <FiPackage /> My Orders
                </button>
                <button className="user-dropdown-item" onClick={() => { navigate('/notifications'); setShowUserMenu(false); }}>
                  <FiBell /> Notifications
                </button>
                <div className="user-dropdown-divider" />
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
}

export default Navbar;