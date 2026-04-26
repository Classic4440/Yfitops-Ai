import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/stores/uiStore';
import { useThemeStore } from '@/stores/themeStore';
import { THEMES } from '@/constants/themes';
import { KeyRound, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type Mode = 'signin' | 'signup';
type SigninStep = 'credentials';
type SignupStep = 'email' | 'otp' | 'password';
type Step = SigninStep | SignupStep;

export const LoginPage: React.FC = () => {
  const setShowLanding = useUIStore((s) => s.setShowLanding);
  const { theme, activeThemeId, setTheme } = useThemeStore();

  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const { bg, surface, border, accent, accentFg, text, textMuted, radius, fontSans } = theme;

  const clearState = () => { setError(''); setInfo(''); };

  // ── Sign in with email + password ──────────────────────────────────────
  const handleSignin = async () => {
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true); clearState();
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) {
      // Friendly messages for common errors
      if (e.message.toLowerCase().includes('invalid login credentials') || e.message.toLowerCase().includes('invalid_credentials')) {
        setError('Incorrect email or password. Try again, or use "Forgot password?" to reset.');
      } else {
        setError(e.message);
      }
      setLoading(false);
      return;
    }
    setShowLanding(false);
    setLoading(false);
  };

  // ── Forgot password (magic link / OTP reset) ───────────────────────────
  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address above first.'); return; }
    setLoading(true); clearState();
    const { error: e } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?reset=true`,
    });
    if (e) { setError(e.message); setLoading(false); return; }
    setInfo(`Password reset email sent to ${email}. Check your inbox.`);
    setLoading(false);
  };

  // ── Sign up: step 1 — send OTP ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) { setError('Enter your email address.'); return; }
    setLoading(true); clearState();
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (e) { setError(e.message); setLoading(false); return; }
    setInfo(`Verification code sent to ${email}.`);
    setStep('otp');
    setLoading(false);
  };

  // ── Sign up: step 2 — verify OTP ──────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the full verification code.'); return; }
    setLoading(true); clearState();
    const { error: e } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (e) { setError(e.message); setLoading(false); return; }
    setStep('password');
    setLoading(false);
  };

  // ── Sign up: step 3 — set password ────────────────────────────────────
  const handleSetPassword = async () => {
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); clearState();
    const { error: e } = await supabase.auth.updateUser({ password });
    if (e) { setError(e.message); setLoading(false); return; }
    setShowLanding(false);
    setLoading(false);
  };

  const switchToSignup = () => {
    setMode('signup');
    setStep('email');
    setPassword('');
    setOtp('');
    clearState();
  };

  const switchToSignin = () => {
    setMode('signin');
    setStep('credentials');
    setOtp('');
    clearState();
  };

  // ── Shared input style ─────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: bg,
    border: `1px solid ${border}`,
    color: text,
    borderRadius: radius,
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
    fontFamily: fontSans,
  };

  const btnPrimary: React.CSSProperties = {
    background: accent,
    color: accentFg,
    borderRadius: radius,
    width: '100%',
    padding: '11px',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    opacity: loading ? 0.6 : 1,
    fontFamily: fontSans,
  };

  const btnGhost: React.CSSProperties = {
    background: 'transparent',
    color: textMuted,
    borderRadius: radius,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: fontSans,
    padding: '4px 0',
  };

  const stepTitle: Record<Step, string> = {
    credentials: 'Welcome back',
    email: 'Create your account',
    otp: 'Check your email',
    password: 'Set a password',
  };

  const stepSub: Record<Step, string> = {
    credentials: 'Sign in with your email and password.',
    email: 'Enter your email to receive a verification code.',
    otp: `Enter the code sent to ${email}.`,
    password: 'Choose a password — you can use it to sign in next time.',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: bg, color: text, fontFamily: fontSans }}
    >
      {/* Brand */}
      <div className="mb-8 text-center select-none">
        <div className="text-4xl font-black mb-1" style={{ color: accent }}>YfitOps</div>
        <div className="text-sm" style={{ color: textMuted }}>AI Engineering Super-Agent Platform</div>
      </div>

      {/* Theme swatches */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {THEMES.map((t) => (
          <button
            key={t.id}
            title={t.label}
            onClick={() => setTheme(t.id)}
            className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
            style={{ background: t.accent, borderColor: activeThemeId === t.id ? text : 'transparent' }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
      >
        {/* Back button for multi-step signup */}
        {mode === 'signup' && step !== 'email' && (
          <button
            onClick={() => setStep(step === 'otp' ? 'email' : 'otp')}
            style={{ ...btnGhost, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}
          >
            <ArrowLeft size={13} /> Back
          </button>
        )}

        {/* Step icon */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: accent + '20', color: accent }}
          >
            {step === 'credentials' || step === 'password' ? <KeyRound size={16} /> : <Mail size={16} />}
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight" style={{ color: text }}>{stepTitle[step]}</h2>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>{stepSub[step]}</p>
          </div>
        </div>

        {/* Error / info banners */}
        {error && (
          <div
            className="text-sm px-3 py-2 rounded mb-4"
            style={{ background: '#FF6B6B22', color: '#FF6B6B', borderRadius: radius }}
          >
            {error}
          </div>
        )}
        {info && (
          <div
            className="text-sm px-3 py-2 rounded mb-4"
            style={{ background: accent + '18', color: accent, borderRadius: radius }}
          >
            {info}
          </div>
        )}

        {/* ── SIGN IN ──────────────────────────────────────────────── */}
        {mode === 'signin' && step === 'credentials' && (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignin()}
              style={inputStyle}
              autoComplete="email"
            />

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignin()}
                style={{ ...inputStyle, paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: textMuted, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button
              disabled={loading}
              onClick={handleSignin}
              style={btnPrimary}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button onClick={handleForgotPassword} style={btnGhost} disabled={loading}>
                Forgot password?
              </button>
              <button onClick={switchToSignup} style={{ ...btnGhost, color: accent }}>
                Create account
              </button>
            </div>
          </div>
        )}

        {/* ── SIGN UP step 1: email ─────────────────────────────────── */}
        {mode === 'signup' && step === 'email' && (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
              style={inputStyle}
              autoComplete="email"
            />
            <button disabled={loading || !email} onClick={handleSendOtp} style={btnPrimary}>
              {loading ? 'Sending…' : 'Send verification code'}
            </button>
            <button onClick={switchToSignin} style={{ ...btnGhost, width: '100%', textAlign: 'center' }}>
              Already have an account? <span style={{ color: accent }}>Sign in</span>
            </button>
          </div>
        )}

        {/* ── SIGN UP step 2: OTP ───────────────────────────────────── */}
        {mode === 'signup' && step === 'otp' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
              style={{ ...inputStyle, letterSpacing: '0.3em', textAlign: 'center', fontSize: 20, fontWeight: 700 }}
              autoComplete="one-time-code"
              inputMode="numeric"
            />
            <button disabled={loading || otp.length < 4} onClick={handleVerifyOtp} style={btnPrimary}>
              {loading ? 'Verifying…' : 'Verify code'}
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              style={{ ...btnGhost, width: '100%', textAlign: 'center' }}
            >
              Didn't receive it? <span style={{ color: accent }}>Resend</span>
            </button>
          </div>
        )}

        {/* ── SIGN UP step 3: password ──────────────────────────────── */}
        {mode === 'signup' && step === 'password' && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="New password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetPassword()}
                style={{ ...inputStyle, paddingRight: 40 }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: textMuted, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button disabled={loading || password.length < 6} onClick={handleSetPassword} style={btnPrimary}>
              {loading ? 'Setting up…' : 'Enter workspace'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs" style={{ color: textMuted }}>Free. Open-source. No credit card required.</p>
    </div>
  );
};
