'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Check, Sparkles, Shield, Zap, Star, ChevronRight } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const PLANS = [
    {
        id: 'monthly' as const,
        name: 'Monthly',
        price: '$9',
        period: '/month',
        annualEquiv: '$108/year',
        popular: false,
        features: [
            'Unlimited article access',
            'Ad-free reading',
            'Save & bookmark articles',
            'Early access to new series',
            'Cancel anytime',
        ],
    },
    {
        id: 'yearly' as const,
        name: 'Annual',
        price: '$79',
        period: '/year',
        annualEquiv: 'Save $29 vs monthly',
        popular: true,
        features: [
            'Everything in Monthly',
            '2 months free',
            'Priority support',
            'Exclusive member newsletter',
            'Annual reading report',
            'Gift subscriptions',
        ],
    },
];

const TRUST = [
    { icon: Shield, label: 'Secure checkout' },
    { icon: Zap, label: 'Instant access' },
    { icon: Star, label: '30-day guarantee' },
];

export default function SubscribePage() {
    const [selected, setSelected] = useState<'monthly' | 'yearly'>('yearly');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user, token, refreshUser } = useAuth();
    const router = useRouter();

    const plan = PLANS.find(p => p.id === selected)!;

    const handleSubscribe = async () => {
        if (!token) { router.push('/login?redirect=/subscribe'); return; }
        setLoading(true);
        try {
            await usersApi.subscribe(selected);
            await refreshUser();
            setSuccess(true);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.6 }}
                        className="w-24 h-24 rounded-3xl gradient-gold flex items-center justify-center mx-auto mb-8 shadow-2xl"
                    >
                        <Crown className="w-12 h-12 text-navy-950" />
                    </motion.div>
                    <h1 className="font-serif text-4xl font-bold text-navy-950 mb-4">
                        Welcome to Luminary Premium!
                    </h1>
                    <p className="text-navy-500 text-lg mb-8">
                        Your {selected} subscription is now active. Enjoy unlimited access to all premium stories.
                    </p>
                    <Link href="/articles" className="btn-primary !px-10 !py-4 !text-base">
                        Start Reading <ChevronRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200 text-gold-700 text-sm font-semibold rounded-full mb-6">
                            <Crown className="w-3.5 h-3.5" /> Luminary Premium
                        </span>
                        <h1 className="section-title text-4xl md:text-5xl mb-4">
                            Invest in ideas that matter
                        </h1>
                        <p className="section-subtitle max-w-xl mx-auto">
                            Join 140,000+ readers who rely on Luminary for in-depth journalism that makes them think, question, and understand the world better.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Plan cards */}
                    <div className="lg:col-span-2 space-y-4">
                        {PLANS.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelected(p.id)}
                                className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${selected === p.id
                                        ? 'border-gold-500 bg-gold-50 shadow-lg shadow-gold-100'
                                        : 'border-navy-100 bg-white hover:border-navy-300'
                                    }`}
                            >
                                {p.popular && (
                                    <div className="absolute -top-3 right-6">
                                        <span className="bg-gold-500 text-navy-950 text-xs font-bold px-4 py-1 rounded-full shadow-md">
                                            ✦ MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected === p.id ? 'border-gold-500 bg-gold-500' : 'border-navy-300'
                                            }`}>
                                            {selected === p.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-navy-900">{p.name}</h3>
                                            <p className="text-sm text-navy-400">{p.annualEquiv}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-serif text-3xl font-bold text-navy-950">{p.price}</span>
                                        <span className="text-navy-500 text-sm">{p.period}</span>
                                    </div>
                                </div>

                                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {p.features.map(f => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-navy-600">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Checkout summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:sticky lg:top-28 bg-white rounded-2xl border border-navy-100 shadow-xl overflow-hidden"
                    >
                        <div className="gradient-navy p-6 text-white">
                            <h3 className="font-serif text-xl font-bold mb-1">Order Summary</h3>
                            <p className="text-navy-300 text-sm">Luminary Premium</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-navy-600">{plan.name} plan</span>
                                        <span className="font-semibold text-navy-900">{plan.price}{plan.period}</span>
                                    </div>
                                    {selected === 'yearly' && (
                                        <div className="flex justify-between text-sm py-2 text-emerald-600">
                                            <span>Annual discount</span>
                                            <span className="font-semibold">−$29</span>
                                        </div>
                                    )}
                                    <div className="border-t border-navy-100 mt-2 pt-3 flex justify-between font-bold">
                                        <span className="text-navy-900">Total today</span>
                                        <span className="text-navy-950 font-serif text-xl">{plan.price}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {user?.isSubscribed ? (
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
                                    <Check className="w-4 h-4" /> You're already subscribed!
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    id="subscribe-btn"
                                    className="btn-primary w-full justify-center !py-4 !text-base disabled:opacity-60"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Activating…</span>
                                    ) : (
                                        <><Crown className="w-5 h-5" /> Start {plan.name} Membership</>
                                    )}
                                </button>
                            )}

                            <div className="flex items-center justify-center gap-4 pt-2">
                                {TRUST.map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1 text-xs text-navy-400">
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-center text-xs text-navy-400">
                                No real payment required. This is a demo platform.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
