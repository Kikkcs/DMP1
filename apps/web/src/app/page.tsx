'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Crown, ChevronRight, Clock, User, CheckCircle, Mail } from 'lucide-react';
import { articlesApi } from '@/lib/api';
import { Article, CATEGORIES } from '@/types';
import ArticleCard from '@/components/articles/ArticleCard';
import { formatDate, getCategoryColor, getCategoryIcon } from '@/lib/utils';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' }
    }),
};

export default function HomePage() {
    const [featured, setFeatured] = useState<Article | null>(null);
    const [recent, setRecent] = useState<Article[]>([]);
    const [premiumArticles, setPremiumArticles] = useState<Article[]>([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        articlesApi.getAll({ limit: 9 }).then(res => {
            const articles: Article[] = res.data.articles;
            setFeatured(articles[0] || null);
            setRecent(articles.slice(1, 7));
        });
        articlesApi.getAll({ premium: 'true', limit: 3 }).then(res => {
            setPremiumArticles(res.data.articles);
        });
    }, []);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail('');
    };

    return (
        <div className="overflow-x-hidden">

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {featured && (
                    <>
                        <Image
                            src={featured.coverImage}
                            alt={featured.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/50 to-navy-950/90" />
                    </>
                )}
                {!featured && <div className="absolute inset-0 gradient-navy" />}

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
                    <motion.span
                        variants={fadeUp} initial="hidden" animate="visible" custom={0}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/20 border border-gold-500/40 text-gold-300 text-sm font-semibold rounded-full mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Ideas Worth Reading
                    </motion.span>

                    <motion.h1
                        variants={fadeUp} initial="hidden" animate="visible" custom={1}
                        className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                    >
                        The world's most{' '}
                        <span className="text-gradient">compelling</span>{' '}
                        stories, curated for you
                    </motion.h1>

                    <motion.p
                        variants={fadeUp} initial="hidden" animate="visible" custom={2}
                        className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Long-form journalism across technology, culture, science, business, and health.
                        Join 140,000+ readers who never miss a great story.
                    </motion.p>

                    <motion.div
                        variants={fadeUp} initial="hidden" animate="visible" custom={3}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/articles" className="btn-primary !px-8 !py-4 !text-base shadow-xl">
                            Explore Articles <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/subscribe" className="btn-secondary !px-8 !py-4 !text-base !border-white/30 !text-white hover:!border-gold-400">
                            <Crown className="w-4 h-4" /> Subscribe
                        </Link>
                    </motion.div>

                    {featured && (
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="visible" custom={4}
                            className="mt-16 text-left max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"
                        >
                            <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Featured Story</p>
                            <Link href={`/articles/${featured.slug}`} className="group">
                                <h2 className="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors leading-snug mb-3">
                                    {featured.title}
                                </h2>
                            </Link>
                            <div className="flex items-center gap-3 text-white/60 text-xs">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{featured.author}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readingTimeMins} min read</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2"
                >
                    <div className="w-1 h-2.5 bg-white/60 rounded-full" />
                </motion.div>
            </section>

            {/* ── CATEGORY BROWSER ── */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="section-title text-2xl md:text-3xl">Browse by Category</h2>
                        <Link href="/articles" className="text-gold-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link
                                    href={`/articles?category=${cat}`}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-navy-100 bg-cream-50 hover:border-gold-400 hover:bg-gold-50 group transition-all"
                                >
                                    <span className="text-3xl">{getCategoryIcon(cat)}</span>
                                    <span className="font-semibold text-navy-800 group-hover:text-gold-700 transition-colors text-sm">
                                        {cat}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── RECENT ARTICLES ── */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="section-title">Latest Stories</h2>
                        <p className="section-subtitle mt-2">Fresh perspectives from our editors</p>
                    </div>
                    <Link href="/articles" className="hidden md:flex items-center gap-1 text-gold-600 font-semibold hover:gap-2 transition-all">
                        All articles <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recent.map((article, i) => (
                        <ArticleCard key={article._id} article={article} index={i} showSave />
                    ))}
                </div>
                <div className="mt-10 text-center md:hidden">
                    <Link href="/articles" className="btn-secondary">All Articles <ArrowRight className="w-4 h-4" /></Link>
                </div>
            </section>

            {/* ── FREE vs PREMIUM SHOWCASE ── */}
            <section className="py-20 bg-navy-950 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-3xl md:text-5xl font-bold mb-4"
                        >
                            Free to read. More to discover.
                        </motion.h2>
                        <p className="text-navy-300 text-lg max-w-xl mx-auto">
                            All our free stories are just the beginning. Premium unlocks the deepest reporting.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Free side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-navy-800 rounded-3xl p-8 border border-navy-700"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center">
                                    <span className="text-xl">📖</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Free Access</h3>
                                    <p className="text-navy-400 text-sm">Always available</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-navy-300">
                                {['Curated daily stories', '15 free articles per month', 'Newsletter delivery', 'Mobile access'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Premium side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gold-600/20 to-gold-500/5 rounded-3xl p-8 border border-gold-500/40 relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4">
                                <span className="badge-gold text-xs">✦ PREMIUM</span>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-navy-950" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Premium Membership</h3>
                                    <p className="text-gold-400 text-sm">From $9/month</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-navy-200">
                                {['Unlimited article access', 'Exclusive long-form investigations', 'Ad-free reading experience', 'Early access to new series', 'Save & bookmark articles', 'Priority support'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            {premiumArticles[0] && (
                                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">Latest Premium</p>
                                    <Link href={`/articles/${premiumArticles[0].slug}`} className="font-serif text-white hover:text-gold-300 transition-colors text-sm leading-snug">
                                        {premiumArticles[0].title}
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/subscribe" className="btn-primary !px-10 !py-4 !text-base shadow-xl shadow-gold-900/20">
                            <Crown className="w-5 h-5" /> Unlock Premium Access
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── NEWSLETTER ── */}
            <section className="py-20 bg-cream-100">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Mail className="w-6 h-6 text-navy-950" />
                        </div>
                        <h2 className="section-title mb-3">Never miss a great story</h2>
                        <p className="section-subtitle mb-8">
                            Get the week's most essential reads delivered to your inbox every Sunday morning.
                        </p>

                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2 text-emerald-600 font-semibold"
                            >
                                <CheckCircle className="w-5 h-5" /> You're on the list! See you Sunday.
                            </motion.div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="input-field flex-1"
                                    id="newsletter-email"
                                />
                                <button type="submit" className="btn-primary flex-shrink-0">
                                    Subscribe <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                        <p className="text-navy-400 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
