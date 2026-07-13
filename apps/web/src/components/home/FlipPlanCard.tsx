'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Plan {
    id: string;
    label: string;
    price: string;
    period: string;
    features: { text: string; included: boolean }[];
    featured?: boolean;
    cta: string;
    confirmTitle: string;
    confirmDesc: string;
    confirmCta: string;
    frontBg: string;
    backBg: string;
    checkColor: string;
    ctaBg: string;
    ctaText: string;
}

const PLANS: Plan[] = [
    {
        id: 'reader',
        label: 'Reader',
        price: '$4',
        period: 'per month',
        features: [
            { text: 'Weekly digital issue', included: true },
            { text: 'Full archive access', included: true },
            { text: 'Ad-free reading', included: true },
            { text: 'Audio narration', included: false },
            { text: 'Author notes & drafts', included: false },
        ],
        cta: 'Choose Reader',
        confirmTitle: 'Welcome aboard.',
        confirmDesc: 'Reader plan selected. You\'ll be redirected to complete payment.',
        confirmCta: 'Continue →',
        frontBg: 'bg-white/5 backdrop-blur border border-white/10',
        backBg: 'bg-gradient-to-br from-gold-600 to-gold-500',
        checkColor: 'text-gold-400',
        ctaBg: 'border border-white/20 hover:bg-white/10',
        ctaText: 'text-white',
    },
    {
        id: 'plus',
        label: 'Luminary+',
        price: '$9',
        period: 'per month',
        featured: true,
        features: [
            { text: 'Everything in Reader', included: true },
            { text: 'All longform & investigations', included: true },
            { text: 'Audio narration', included: true },
            { text: 'Author\'s notes & drafts', included: true },
            { text: 'Quarterly print edition', included: true },
        ],
        cta: 'Choose Luminary+',
        confirmTitle: 'Excellent choice.',
        confirmDesc: 'Luminary+ selected. Your first print edition ships this month.',
        confirmCta: 'Continue →',
        frontBg: 'bg-white',
        backBg: 'bg-navy-950 border border-gold-500/60',
        checkColor: 'text-gold-500',
        ctaBg: 'bg-navy-950 hover:bg-navy-800',
        ctaText: 'text-white',
    },
    {
        id: 'patron',
        label: 'Patron',
        price: '$24',
        period: 'per month',
        features: [
            { text: 'Everything in Luminary+', included: true },
            { text: 'Name in the annual colophon', included: true },
            { text: 'Two guest passes per year', included: true },
            { text: "Editor's letter, handwritten", included: true },
            { text: 'Invitations to salon events', included: true },
        ],
        cta: 'Choose Patron',
        confirmTitle: 'Thank you.',
        confirmDesc: 'Patron plan selected. We\'ll be in touch within 24 hours.',
        confirmCta: 'Continue →',
        frontBg: 'bg-white/5 backdrop-blur border border-white/10',
        backBg: 'bg-gradient-to-br from-navy-700 to-navy-950',
        checkColor: 'text-gold-400',
        ctaBg: 'border border-white/20 hover:bg-white/10',
        ctaText: 'text-white',
    },
];

export default function FlipPlanCard({ plan }: { plan: Plan }) {
    const [flipped, setFlipped] = useState(false);
    const isFeatured = plan.featured;

    return (
        <div
            className="relative"
            style={{ perspective: '1400px' }}
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                style={{ transformStyle: 'preserve-3d', minHeight: '460px' }}
                className="relative w-full"
            >
                {/* Front */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col ${plan.frontBg} ${isFeatured ? 'text-navy-950' : 'text-white'
                        } ${isFeatured ? 'shadow-[0_50px_90px_-30px_rgba(10,15,30,0.45)]' : ''}`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {isFeatured && (
                        <div className="absolute top-0 right-0">
                            <span className="badge-gold text-xs px-3 py-1 rounded-bl-xl rounded-tr-3xl">
                                Most chosen
                            </span>
                        </div>
                    )}
                    <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${isFeatured ? 'text-navy-400' : 'text-white/60'}`}>
                        {plan.label}
                    </div>
                    <div className={`font-serif text-5xl mb-1 ${isFeatured ? 'text-navy-950' : 'text-white'}`}>
                        {plan.price}
                    </div>
                    <div className={`text-sm mb-6 ${isFeatured ? 'text-navy-400' : 'text-white/50'}`}>
                        {plan.period}
                    </div>
                    <ul className="space-y-3 text-sm flex-1">
                        {plan.features.map((f) => (
                            <li
                                key={f.text}
                                className={`flex items-center gap-2 ${f.included
                                    ? isFeatured ? 'text-navy-700' : 'text-white/80'
                                    : 'text-white/30'
                                    }`}
                            >
                                <span className={f.included ? plan.checkColor : 'text-white/20'}>
                                    {f.included ? '✓' : '—'}
                                </span>
                                {f.text}
                            </li>
                        ))}
                    </ul>
                    <button
                        id={`plan-btn-${plan.id}`}
                        onClick={() => setFlipped(true)}
                        className={`mt-8 w-full py-3 rounded-full text-sm font-semibold transition-all ${plan.ctaBg} ${plan.ctaText}`}
                    >
                        {plan.cta}
                    </button>
                </div>

                {/* Back */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col justify-center items-center text-center ${plan.backBg}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="w-14 h-14 rounded-full bg-white/20 grid place-items-center mb-4">
                        <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-serif text-3xl text-white mb-2">{plan.confirmTitle}</div>
                    <p className="text-white/80 text-sm mb-6">{plan.confirmDesc}</p>
                    <Link
                        href="/subscribe"
                        className={`px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 ${isFeatured ? 'bg-gold-500 text-navy-950 hover:bg-gold-400' : 'bg-white text-navy-950 hover:bg-cream-50'} transition-colors`}
                    >
                        {plan.confirmCta} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => setFlipped(false)}
                        className="mt-4 text-xs text-white/50 hover:text-white/80 transition-colors underline"
                    >
                        Go back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export { PLANS };
export type { Plan };
