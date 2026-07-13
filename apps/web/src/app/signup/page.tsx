'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, BookOpen, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
    const [showPw, setShowPw] = useState(false);
    const [serverError, setServerError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            const res = await authApi.signup(data as { name: string; email: string; password: string });
            const { token, user } = res.data;
            login(token, {
                id: user.id || user._id,
                name: user.name,
                email: user.email,
                otpVerified: user.otpVerified ?? false,
                isSubscribed: user.isSubscribed ?? false,
                subscriptionPlan: user.subscriptionPlan ?? 'none',
                subscriptionExpiry: user.subscriptionExpiry,
                savedArticles: user.savedArticles ?? [],
            });
            router.push('/verify-otp');
        } catch (err: any) {
            setServerError(err?.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-navy-950 items-center justify-center p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="absolute rounded-full border border-gold-400"
                            style={{ width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
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
                        Join a community of curious, critical readers.
                    </h2>
                    <p className="text-navy-300 text-lg">140,000+ readers already inside. Free to join.</p>
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

                    <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">Create your account</h1>
                    <p className="text-navy-500 mb-8">Free forever. Upgrade anytime.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label" htmlFor="signup-name">Full name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                <input id="signup-name" type="text" {...register('name')} className="input-field pl-10" placeholder="Jane Smith" />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="label" htmlFor="signup-email">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                <input id="signup-email" type="email" {...register('email')} className="input-field pl-10" placeholder="you@example.com" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="label" htmlFor="signup-password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                                <input id="signup-password" type={showPw ? 'text' : 'password'} {...register('password')}
                                    className="input-field pl-10 pr-10" placeholder="At least 6 characters" />
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

                        <button type="submit" disabled={isSubmitting} id="signup-submit"
                            className="btn-primary w-full justify-center !py-3.5 !text-base disabled:opacity-60">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Create Account</>}
                        </button>
                    </form>

                    <p className="text-center text-navy-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold-600 font-semibold hover:text-gold-700">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
