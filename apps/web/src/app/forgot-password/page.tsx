'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError('');
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-cream-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl border border-navy-100 shadow-xl p-8 md:p-12">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-navy-950" />
                            </div>
                            <span className="font-serif text-xl font-bold text-navy-950">Luminary</span>
                        </Link>

                        {sent ? (
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h1 className="font-serif text-2xl font-bold text-navy-950 mb-3">Check your inbox</h1>
                                <p className="text-navy-500 text-sm mb-6">
                                    If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                                    <br /><br />
                                    <span className="text-gold-600 font-medium">(Demo: no real email is sent)</span>
                                </p>
                                <Link href="/login" className="btn-primary justify-center w-full">
                                    Back to Sign In
                                </Link>
                            </motion.div>
                        ) : (
                            <>
                                <h1 className="font-serif text-3xl font-bold text-navy-950 mb-3">Forgot password?</h1>
                                <p className="text-navy-500 text-sm">
                                    Enter your email and we'll send you a reset link.
                                    <br /><span className="text-gold-600 font-medium">(Mock — no real email is sent)</span>
                                </p>
                            </>
                        )}
                    </div>

                    {!sent && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label" htmlFor="forgot-email">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button type="submit" disabled={loading} id="forgot-pw-submit"
                                className="btn-primary w-full justify-center !py-3.5 !text-base disabled:opacity-60">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Send Reset Link</>}
                            </button>

                            <p className="text-center text-navy-400 text-sm">
                                <Link href="/login" className="text-gold-600 font-semibold hover:text-gold-700">← Back to Sign In</Link>
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
