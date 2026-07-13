'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Crown, Sparkles } from 'lucide-react';

export default function PremiumGate() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
        >
            {/* Fade mask */}
            <div className="h-32 bg-gradient-to-b from-transparent to-white pointer-events-none -mt-32 relative z-10" />

            {/* Gate card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative z-20 mx-auto max-w-lg text-center py-12 px-8 rounded-3xl border border-gold-300 bg-white shadow-xl"
            >
                {/* Lock icon */}
                <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                    <Lock className="w-7 h-7 text-navy-950" />
                </motion.div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-700 text-xs font-bold rounded-full mb-4">
                    <Crown className="w-3 h-3" /> Premium Content
                </span>

                <h3 className="font-serif text-2xl font-bold text-navy-950 mb-3">
                    This article is for Luminary members
                </h3>
                <p className="text-navy-500 mb-8 leading-relaxed">
                    Subscribe to unlock unlimited access to our premium stories, in-depth analysis, and exclusive long-form journalism.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/subscribe" className="btn-primary justify-center">
                        <Sparkles className="w-4 h-4" />
                        Start Membership — $9/mo
                    </Link>
                    <Link href="/login" className="btn-secondary justify-center">
                        Already a member? Sign in
                    </Link>
                </div>

                <p className="text-xs text-navy-400 mt-6">
                    Cancel anytime · No hidden fees · Unlimited access
                </p>
            </motion.div>
        </motion.div>
    );
}
