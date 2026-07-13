'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

function LoginContent() {
    const [showPw, setShowPw] = useState(false);
    const [serverError, setServerError] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            const res = await authApi.login(data as { email: string; password: string });
            const { token, user } = res.data;
            login(token, {
                id: user.id || user._id,
                name: user.name,
                email: user.email,
                otpVerified: user.otpVerified,
                isSubscribed: user.isSubscribed,
                subscriptionPlan: user.subscriptionPlan,
                subscriptionExpiry: user.subscriptionExpiry,
            });
            router.push(redirect);
        } catch (err: any) {
            setServerError(err?.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-navy items-center justify-center p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`absolute w-96 h-96 rounded-full border border-white/20`}
                            style={{ top: `${i * 20}%`, left: `${-20 + i * 15}%` }} />
                    ))}
                </div>
                <div className="relative z-10 max-w-md text-white">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-navy-950" />
                        </div>
                        <span className="font-serif text-2xl font-bold">Luminary</span>
                    </Link>
                    <h2 className="font-serif text-4xl font-bold mb-6 leading-tight">
                        "Good journalism is not just a craft — it's a public service."
                    </h2>
                    <p className="text-navy-300 text-lg">Welcome back. Your stories are waiting.</p>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-cream-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden mb-8 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-navy-950" />
                        </div>
                        <span className="font-serif text-xl font-bold text-navy-950">Luminary</span>
                    </div>

                    <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">Welcome back</h1>
                    <p className="text-navy-500 mb-8">Sign in to your Luminary account</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label" htmlFor="login-email">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                <input
                                    id="login-email"
                                    type="email"
                                    {...register('email')}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="label mb-0" htmlFor="login-password">Password</label>
                                <Link href="/forgot-password" className="text-xs text-gold-600 hover:text-gold-700">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                <input
                                    id="login-password"
                                    type={showPw ? 'text' : 'password'}
                                    {...register('password')}
                                    className="input-field pl-10 pr-10"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {serverError && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">{serverError}</div>
                        )}

                        <button type="submit" disabled={isSubmitting} id="login-submit"
                            className="btn-primary w-full justify-center !py-3.5 !text-base disabled:opacity-60">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Sign In</>}
                        </button>
                    </form>

                    <p className="text-center text-navy-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-gold-600 font-semibold hover:text-gold-700">Create one free</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
