'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FlowState = 'EMAIL_INPUT' | 'CODE_VERIFICATION' | 'NEW_PASSWORD' | 'SUCCESS';

// Volumetric Background with animated orbs
function VolumetricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,206,209,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,206,209,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00CED1]/15 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00CED1]/5 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
    </div>
  );
}

// Custom Input Field with glow focus
function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm text-[#a1a1aa] font-medium">{label}</label>
      <div className="relative">
        <motion.div
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#00CED1]/50 to-[#D4AF37]/50 opacity-0 blur-sm"
          animate={{ opacity: focused ? 0.6 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="relative w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-[#fafafa] placeholder-[#52525b] focus:border-[#00CED1]/50 focus:outline-none transition-colors duration-200"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [flowState, setFlowState] = useState<FlowState>('EMAIL_INPUT');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect signed-in users to dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isSignedIn, router]);

  // Step 1: Request password reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setFlowState('CODE_VERIFICATION');
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      if (result.status === 'needs_new_password') {
        setFlowState('NEW_PASSWORD');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn.resetPassword({
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setFlowState('SUCCESS');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (flowState) {
      case 'EMAIL_INPUT':
        return 'Reset your password';
      case 'CODE_VERIFICATION':
        return 'Check your email';
      case 'NEW_PASSWORD':
        return 'Create new password';
      case 'SUCCESS':
        return 'Password reset!';
    }
  };

  const getSubtitle = () => {
    switch (flowState) {
      case 'EMAIL_INPUT':
        return "Enter your email and we'll send you a reset code";
      case 'CODE_VERIFICATION':
        return `We sent a code to ${email}`;
      case 'NEW_PASSWORD':
        return 'Enter your new password below';
      case 'SUCCESS':
        return 'Your password has been successfully reset';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0F] relative">
      <VolumetricBackground />

      {/* Auth Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/brand/barrios-a2i-shard-logo.png"
            alt="Barrios A2I"
            className="h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(0,206,209,0.4)]"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            BARRIOS <span className="text-[#00CED1]">A2I</span>
          </span>
        </Link>
        <Link
          href="/sign-in"
          className="text-sm text-[#a1a1aa] hover:text-[#00CED1] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Sign In
        </Link>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow ring behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00CED1]/20 via-[#D4AF37]/20 to-[#00CED1]/20 rounded-2xl blur-xl opacity-60" />

        {/* Glass card */}
        <div className="relative bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,206,209,0.15)]">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-6"
            >
              <img
                src="/brand/barrios-a2i-shard-logo.png"
                alt="Barrios A2I"
                className="w-20 h-20 mx-auto object-contain drop-shadow-[0_0_15px_rgba(0,206,209,0.4)]"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#fafafa] tracking-tight">
              {getTitle()}
            </h1>
            <p className="text-[#a1a1aa] mt-2">
              {getSubtitle()}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {flowState === 'EMAIL_INPUT' && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestCode}
                className="space-y-4"
              >
                <InputField
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  autoComplete="email"
                />

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading || !email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 hover:shadow-[0_0_30px_rgba(0,206,209,0.4)] text-[#0a0a0a] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending code...' : 'Send reset code'}
                </motion.button>
              </motion.form>
            )}

            {/* Step 2: Code Verification */}
            {flowState === 'CODE_VERIFICATION' && (
              <motion.form
                key="code-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <InputField
                  label="Verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  autoComplete="one-time-code"
                />

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading || !code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 hover:shadow-[0_0_30px_rgba(0,206,209,0.4)] text-[#0a0a0a] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify code'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setFlowState('EMAIL_INPUT');
                    setCode('');
                    setError('');
                  }}
                  className="w-full text-sm text-[#a1a1aa] hover:text-[#00CED1] transition-colors"
                >
                  Back to email
                </button>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {flowState === 'NEW_PASSWORD' && (
              <motion.form
                key="password-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <InputField
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <InputField
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 hover:shadow-[0_0_30px_rgba(0,206,209,0.4)] text-[#0a0a0a] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </motion.button>
              </motion.form>
            )}

            {/* Step 4: Success */}
            {flowState === 'SUCCESS' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00CED1]/20 flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-[#00CED1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-[#a1a1aa] text-sm">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          {flowState === 'EMAIL_INPUT' && (
            <p className="text-center text-[#a1a1aa] text-sm mt-6">
              Remember your password?{' '}
              <Link href="/sign-in" className="text-[#00CED1] hover:text-[#00CED1]/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}
