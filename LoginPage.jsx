import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage({ onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const hasClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

  // Real Google OAuth — opens the native Google account picker popup
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        setGoogleError('');
        // Fetch user profile from Google using the access token
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        setGoogleLoading(false);
        onLoginSuccess?.({
          name: profile.name || profile.email,
          email: profile.email,
          avatar: profile.picture,
          googleId: profile.sub,
        });
      } catch {
        setGoogleLoading(false);
        setGoogleError('Failed to fetch Google profile. Please try again.');
      }
    },
    onError: (err) => {
      setGoogleLoading(false);
      setGoogleError('Google Sign-In was cancelled or failed. Please try again.');
      console.error('Google OAuth error:', err);
    },
    onNonOAuthError: (err) => {
      setGoogleLoading(false);
      if (err.type === 'popup_closed') {
        setGoogleError('Popup was closed. Please try again.');
      } else if (err.type === 'popup_failed_to_open') {
        setGoogleError('Popup was blocked. Allow popups for this site and try again.');
      }
    },
  });

  const handleGoogleClick = () => {
    if (!hasClientId) {
      setGoogleError('Google Client ID not configured. See setup instructions below.');
      return;
    }
    setGoogleError('');
    setGoogleLoading(true);
    googleLogin();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (mode === 'signup' && !form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (mode === 'signup' && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    // Simulate email/password auth — replace with real backend call
    await new Promise(r => setTimeout(r, 1200));
    setIsSubmitting(false);
    
    let finalName = form.name;
    if (mode === 'signup') {
      localStorage.setItem('mockUser_' + form.email, JSON.stringify({ name: form.name }));
    } else {
      const savedUser = localStorage.getItem('mockUser_' + form.email);
      if (savedUser) {
        try {
          finalName = JSON.parse(savedUser).name;
        } catch (err) {}
      }
      if (!finalName) {
        finalName = 'Student'; // Fallback instead of email prefix
      }
    }

    onLoginSuccess?.({ name: finalName, email: form.email });
  };

  return (
    <div className="login-overlay fade-in">
      <div className="login-modal glass-panel">

        {/* Back button */}
        <button className="login-close-btn" onClick={onClose} aria-label="Go back">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Brand */}
        <div className="login-brand">
          <BookOpen size={32} />
          <span>Student Assistant</span>
        </div>

        <h2 className="login-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="login-subtitle">
          {mode === 'signin'
            ? 'Sign in to access your personalized study tools'
            : 'Join thousands of students studying smarter'}
        </p>

        {/* Google Sign In Button */}
        <button
          className="google-signin-btn"
          onClick={handleGoogleClick}
          disabled={googleLoading || isSubmitting}
          aria-label="Sign in with Google"
          id="google-signin-btn"
        >
          {googleLoading ? (
            <span className="google-spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.5 20H24v8.5h11.7C34.3 33 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.3 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.3 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" fill="#FF3D00"/>
              <path d="M24 44c5.4 0 10.3-1.9 14.1-5.1l-6.5-5.4C29.7 35.4 27 36 24 36c-5.6 0-10.3-3.1-11.8-7.5l-7 5.4C8 40 15.5 44 24 44z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-.7 2-2.1 3.8-3.9 5l6.5 5.4C42 35.6 44.5 30.3 44.5 24c0-1.3-.1-2.7-.2-4H44.5z" fill="#1976D2"/>
            </svg>
          )}
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Google error banner */}
        {googleError && (
          <div className="google-error-banner">
            <AlertCircle size={15} />
            <span>{googleError}</span>
          </div>
        )}

        {/* Removed setup notice to keep format clean */}

        {/* Divider */}
        <div className="login-divider">
          <span>or continue with email</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {mode === 'signup' && (
            <div className="login-field">
              <label htmlFor="login-name" className="input-label">Full Name</label>
              <div className={`login-input-wrap ${errors.name ? 'has-error' : ''}`}>
                <User size={18} className="input-icon" />
                <input
                  id="login-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="login-input"
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email" className="input-label">Email Address</label>
            <div className={`login-input-wrap ${errors.email ? 'has-error' : ''}`}>
              <Mail size={18} className="input-icon" />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="login-input"
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="input-label">Password</label>
            <div className={`login-input-wrap ${errors.password ? 'has-error' : ''}`}>
              <Lock size={18} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                value={form.password}
                onChange={handleChange}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="login-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {mode === 'signup' && (
            <div className="login-field">
              <label htmlFor="login-confirm" className="input-label">Confirm Password</label>
              <div className={`login-input-wrap ${errors.confirmPassword ? 'has-error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input
                  id="login-confirm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="login-input"
                />
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          )}

          {mode === 'signin' && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
              <button type="button" className="forgot-link">Forgot password?</button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={isSubmitting || googleLoading}
            id="login-submit"
          >
            {isSubmitting ? (
              <>
                <span className="google-spinner" style={{ borderTopColor: '#fff' }} />
                <span>{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="login-toggle-text">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="login-toggle-btn"
            onClick={() => {
              setMode(m => m === 'signin' ? 'signup' : 'signin');
              setErrors({});
              setGoogleError('');
              setForm({ name: '', email: '', password: '', confirmPassword: '' });
            }}
          >
            {mode === 'signin' ? 'Create one →' : 'Sign in →'}
          </button>
        </p>
      </div>
    </div>
  );
}
