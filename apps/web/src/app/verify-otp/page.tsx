'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { user, token, updateUser } = useAuth();
    const router = useRouter();

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste) {
            const newOtp = paste.split('');
            setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
            inputRefs.current[Math.min(paste.length, 5)]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
        if (!token) { router.push('/login'); return; }
        setLoading(true);
        setError('');
        try {
            await authApi.verifyOtp(code);
            if (user) updateUser({ ...user, otpVerified: true });
            setVerified(true);
            setTimeout(() => router.push('/'), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Verification failed. Try again.');
        }
        setLoading(false);
    };

    if (verified) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-3xl gradient-gold flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-navy-950" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-navy-950 mb-3">Account verified!</h2>
                    <p className="text-navy-500">Redirecting you to Luminary…</p>
                </motion.div>
            </div>
        );
    }

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
                        <h1 className="font-serif text-3xl font-bold text-navy-950 mb-3">Verify your email</h1>
                        <p className="text-navy-500 text-sm">
                            We sent a 6-digit code to <strong>{user?.email || 'your email'}</strong>.
                            <br />Enter it below, or use the test code: <strong className="text-gold-600">123456</strong>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    id={`otp-${i}`}
                                    className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${digit ? 'border-gold-400 bg-gold-50 text-navy-950' : 'border-navy-200 text-navy-900'
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-center text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.join('').length < 6}
                            id="verify-otp-btn"
                            className="btn-primary w-full justify-center !py-3.5 !text-base disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Verify Account</>}
                        </button>
                    </form>

                    <p className="text-center text-navy-400 text-sm mt-6">
                        <Link href="/" className="flex items-center justify-center gap-1 hover:text-navy-700 transition-colors">
                            <ArrowRight className="w-3 h-3 rotate-180" /> Skip for now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
