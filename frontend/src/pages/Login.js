import React, { useState } from 'react';
import '../styles/Login.css';
import { FiEye, FiEyeOff, FiArrowRight, FiCheck, FiMail, FiLock, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '';

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');

  // Forgot
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#e24b4a', '#EF9F27', '#185FA5', '#3B6D11'];
  const pwdStrength = getStrength(signupPassword);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) { setLoginError('Please enter your email address'); return; }
    if (!loginEmail.includes('@')) { setLoginError('Please enter a valid email address'); return; }
    if (!loginPassword) { setLoginError('Please enter your password'); return; }
    if (loginPassword.length < 6) { setLoginError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const res = await api.login({ email: loginEmail.trim(), password: loginPassword });
      if (res.success) {
        login(res.user, res.token);
        if (redirectTo) {
          navigate('/' + redirectTo);
        } else {
          navigate('/');
        }
      } else {
        setLoginError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoginError('Something went wrong. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const handleSignupStep1 = () => {
    setSignupError('');
    if (!signupName.trim()) { setSignupError('Please enter your full name'); return; }
    if (!signupEmail.trim()) { setSignupError('Please enter your email address'); return; }
    if (!signupEmail.includes('@')) { setSignupError('Please enter a valid email address'); return; }
    if (signupPhone && signupPhone.length !== 10) { setSignupError('Please enter a valid 10-digit phone number'); return; }
    setStep(2);
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setSignupError('');
    if (!signupPassword) { setSignupError('Please create a password'); return; }
    if (signupPassword.length < 8) { setSignupError('Password must be at least 8 characters'); return; }
    if (signupPassword !== signupConfirm) { setSignupError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await api.signup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone || null,
        password: signupPassword,
      });
      if (res.success) {
        login(res.user, res.token);
        if (redirectTo) {
          navigate('/' + redirectTo);
        } else {
          navigate('/');
        }
      } else {
        setSignupError(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSignupError('Something went wrong. Please check your connection and try again.');
    }
    setLoading(false);
  };

const handleForgotPassword = async (e) => {
  e?.preventDefault();
  setForgotError('');
  if (!forgotEmail.trim()) { setForgotError('Please enter your email address'); return; }
  if (!forgotEmail.includes('@') || !forgotEmail.includes('.')) {
    setForgotError('Please enter a valid email address');
    return;
  }
  setLoading(true);
  try {
    const res = await api.forgotPassword(forgotEmail.trim());
    if (res.success) {
      setForgotSent(true);
    } else {
      setForgotError(res.message || 'No account found with this email');
    }
  } catch (err) {
    setForgotError('Something went wrong. Please try again.');
  }
  setLoading(false);
};

  const switchMode = (newMode) => {
    setMode(newMode);
    setLoginError('');
    setSignupError('');
    setForgotError('');
    setStep(1);
    setLoading(false);
  };

  return (
    <div className="login-page">

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <h1>Giftbloom</h1>
            <p>Making every occasion unforgettable</p>
          </div>
          <div className="login-features">
            {[
              { title: 'Personalized Gifts', desc: 'Custom gifts for every special occasion' },
              { title: 'Smart Reminders', desc: 'Never miss a birthday or anniversary' },
              { title: 'Reliable Delivery', desc: 'Safe packaging, on-time delivery' },
              { title: 'Secure Payments', desc: '100% safe and encrypted checkout' },
            ].map((f, i) => (
              <div key={i} className="login-feature-item">
                <div className="login-feature-check"><FiCheck size={12} /></div>
                <div>
                  <p className="feature-title">{f.title}</p>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="login-deco">
          <div className="deco-ring r1" />
          <div className="deco-ring r2" />
          <div className="deco-ring r3" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-box">

          {/* LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} noValidate>
              <div className="login-box-header">
                <h2>Sign in</h2>
                <p>Welcome back to Giftbloom</p>
              </div>

              {loginError && (
                <div className="form-error-box">
                  <FiAlertCircle size={14} />
                  {loginError}
                </div>
              )}

              <div className="input-group">
                <label>Email address</label>
                <div className={`input-wrap ${loginError && !loginEmail.includes('@') ? 'error' : ''}`}>
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(''); }}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-label-row">
                  <label>Password</label>
                  <span className="forgot-link" onClick={() => switchMode('forgot')}>Forgot password?</span>
                </div>
                <div className="input-wrap">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }}
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className={`btn-auth ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Signing in...' : <><span>Sign In</span> <FiArrowRight size={16} /></>}
              </button>

              <p className="auth-switch">
                New to Giftbloom? <span onClick={() => switchMode('signup')}>Create account</span>
              </p>

              <p className="login-terms">
                By signing in, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {mode === 'signup' && (
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleSignupStep1(); } : handleSignup} noValidate>
              <div className="login-box-header">
                <h2>Create account</h2>
                <p>Join Giftbloom and start gifting</p>
              </div>

              <div className="signup-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                  <div className="progress-dot">{step > 1 ? <FiCheck size={12} /> : '1'}</div>
                  <span>Your Details</span>
                </div>
                <div className="progress-line" />
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="progress-dot">{step > 2 ? <FiCheck size={12} /> : '2'}</div>
                  <span>Set Password</span>
                </div>
              </div>

              {signupError && (
                <div className="form-error-box">
                  <FiAlertCircle size={14} />
                  {signupError}
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="input-group">
                    <label>Full Name <span className="req">*</span></label>
                    <div className="input-wrap">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={signupName}
                        onChange={e => { setSignupName(e.target.value); setSignupError(''); }}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address <span className="req">*</span></label>
                    <div className="input-wrap">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={e => { setSignupEmail(e.target.value); setSignupError(''); }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Phone Number <span className="optional">(Optional)</span></label>
                    <div className="input-wrap phone-wrap">
                      <span className="country-code">+91</span>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={signupPhone}
                        onChange={e => { setSignupPhone(e.target.value.replace(/\D/, '').slice(0, 10)); setSignupError(''); }}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-auth" disabled={loading}>
                    Continue <FiArrowRight size={16} />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="input-group">
                    <label>Create Password <span className="req">*</span></label>
                    <div className="input-wrap">
                      <FiLock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={signupPassword}
                        onChange={e => { setSignupPassword(e.target.value); setSignupError(''); }}
                        autoComplete="new-password"
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {signupPassword.length > 0 && (
                      <div className="pwd-strength">
                        <div className="strength-bars">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="strength-bar" style={{ backgroundColor: i <= pwdStrength ? strengthColor[pwdStrength] : '#e0e0e0' }} />
                          ))}
                        </div>
                        <span style={{ color: strengthColor[pwdStrength], fontSize: '11px', fontWeight: 600 }}>
                          {strengthLabel[pwdStrength]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label>Confirm Password <span className="req">*</span></label>
                    <div className="input-wrap">
                      <FiLock className="input-icon" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={signupConfirm}
                        onChange={e => { setSignupConfirm(e.target.value); setSignupError(''); }}
                        autoComplete="new-password"
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {signupConfirm.length > 0 && (
                      <p className={`match-msg ${signupPassword === signupConfirm ? 'match' : 'no-match'}`}>
                        {signupPassword === signupConfirm ? <><FiCheck size={11} /> Passwords match</> : 'Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <div className="step2-buttons">
                    <button type="button" className="btn-auth-secondary" onClick={() => { setStep(1); setSignupError(''); }}>
                      Back
                    </button>
                    <button type="submit" className={`btn-auth ${loading ? 'loading' : ''}`} disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </>
              )}

              <p className="auth-switch">
                Already have an account? <span onClick={() => switchMode('login')}>Sign in</span>
              </p>

              <p className="login-terms">
                By creating an account, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} noValidate>
              <div className="login-box-header">
                <h2>Reset password</h2>
                <p>Enter your email and we'll send a reset link</p>
              </div>

              {forgotSent ? (
                <div className="forgot-success">
                  <div className="forgot-success-icon"><FiCheck size={24} /></div>
                  <h3>Check your email</h3>
                  <p>We've sent a password reset link to <strong>{forgotEmail}</strong></p>
                  <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                    Don't see it? Check your spam folder.
                  </p>
                  <button type="button" className="btn-auth" onClick={() => switchMode('login')}>
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  {forgotError && (
                    <div className="form-error-box">
                      <FiAlertCircle size={14} />
                      {forgotError}
                    </div>
                  )}

                  <div className="input-group">
                    <label>Email address</label>
                    <div className="input-wrap">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button type="submit" className={`btn-auth ${loading ? 'loading' : ''}`} disabled={loading || !forgotEmail.includes('@')}>
                    {loading ? 'Sending...' : <><span>Send Reset Link</span> <FiArrowRight size={16} /></>}
                  </button>

                  <p className="auth-switch">
                    Remember your password? <span onClick={() => switchMode('login')}>Sign in</span>
                  </p>
                </>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;