'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Crown, Clock, User, CheckCircle, Mail } from 'lucide-react';
import { articlesApi } from '@/lib/api';
import { Article } from '@/types';
import TiltCard from '@/components/home/TiltCard';
import FlipPlanCard, { PLANS } from '@/components/home/FlipPlanCard';
import dynamic from 'next/dynamic';

// Lazy-load Three.js components (client-only, no SSR)
const HeroScene = dynamic(() => import('@/components/home/HeroScene'), { ssr: false });
const LockIcon3D = dynamic(() => import('@/components/home/LockIcon3D'), { ssr: false });

/* ── Reveal wrapper using framer-motion whileInView ── */
function Reveal({
    children,
    delay = 0,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay, ease: [0.2, 0.7, 0.2, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ── Section wrapper to fade in on scroll ── */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <section
            ref={ref}
            className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
        >
            {children}
        </section>
    );
}

/* ── Kicker label (section eyebrow) ── */
function Kicker({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
    return (
        <p className={`flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] mb-3 ${gold ? 'text-gold-500' : 'text-gold-600'}`}>
            <span className="kicker-dot" />
            {children}
        </p>
    );
}

/* ── Article card for featured section ── */
function FeaturedArticleCard({ article, type }: { article: Article; type: string }) {
    return (
        <TiltCard className="h-full">
            <Link
                href={`/articles/${article.slug}`}
                className="group block h-full bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-400"
            >
                <div className="relative overflow-hidden aspect-[4/5]">
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="text-[0.68rem] font-bold uppercase tracking-widest bg-cream-50/90 backdrop-blur-sm text-navy-800 px-3 py-1 rounded-full">
                            {type}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-navy-400 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>{article.readingTimeMins} min read</span>
                        <span>·</span>
                        <span>{article.category}</span>
                    </div>
                    <h3 className="font-serif text-xl leading-snug text-navy-950 group-hover:text-gold-600 transition-colors mb-2">
                        {article.title}
                    </h3>
                    <p className="text-sm text-navy-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <div className="mt-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 flex-shrink-0" />
                        <div className="text-xs">
                            <div className="font-semibold text-navy-800">{article.author}</div>
                            <div className="text-navy-400">{article.category}</div>
                        </div>
                    </div>
                </div>
            </Link>
        </TiltCard>
    );
}

/* ── Premium wide card ── */
function PremiumCard({ article, dark = false }: { article: Article; dark?: boolean }) {
    return (
        <TiltCard className="h-full">
            <Link
                href={`/articles/${article.slug}`}
                className={`holo-card group block rounded-3xl overflow-hidden border transition-shadow duration-400 hover:shadow-2xl ${dark
                    ? 'bg-navy-950 border-white/10'
                    : 'bg-white border-navy-100'
                    }`}
            >
                <div className="grid md:grid-cols-5">
                    <div className="md:col-span-3 relative overflow-hidden aspect-[4/3] md:aspect-auto min-h-[200px]">
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {dark && <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/70 via-transparent to-transparent" />}
                        <div className="absolute top-4 left-4">
                            <span className="badge-gold text-[0.62rem] px-2.5 py-0.5">Premium</span>
                        </div>
                    </div>
                    <div className={`md:col-span-2 p-8 flex flex-col justify-between ${dark ? 'text-white' : 'text-navy-950'}`}>
                        <div>
                            <div className={`text-[0.68rem] font-bold uppercase tracking-widest mb-4 ${dark ? 'text-white/50' : 'text-navy-400'}`}>
                                Investigation · {article.readingTimeMins} min
                            </div>
                            <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:text-gold-500 transition-colors">
                                {article.title}
                            </h3>
                            <p className={`text-sm leading-relaxed line-clamp-3 ${dark ? 'text-white/65' : 'text-navy-500'}`}>
                                {article.excerpt}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <span className={`text-xs ${dark ? 'text-white/40' : 'text-navy-400'}`}>By {article.author}</span>
                            <span className={`text-[0.68rem] font-bold uppercase tracking-widest flex items-center gap-1 ${dark ? 'text-gold-400' : 'text-gold-600'}`}>
                                Read <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </TiltCard>
    );
}

/* ═══════════════════════════════════════════════
   Main HomePage
═══════════════════════════════════════════════ */
export default function HomePage() {
    const [featured, setFeatured] = useState<Article | null>(null);
    const [recent, setRecent] = useState<Article[]>([]);
    const [premiumArticles, setPremiumArticles] = useState<Article[]>([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

    useEffect(() => {
        articlesApi.getAll({ limit: 9 }).then(res => {
            const articles: Article[] = res.data.articles;
            setFeatured(articles[0] || null);
            setRecent(articles.slice(1, 4));
            setPreviewArticle(articles[4] || null);
        });
        articlesApi.getAll({ premium: 'true', limit: 2 }).then(res => {
            setPremiumArticles(res.data.articles);
        });
    }, []);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail('');
    };

    const ARTICLE_TYPES = ['Essay', 'Reportage', 'Field Notes'];
    const MARQUEE_ITEMS = [
        '— Technology', '— Culture', '— Science', '— Business', '— Health',
        '— Longform', '— Investigations', '— Field Notes', '— Profiles',
    ];

    return (
        <div className="grain overflow-x-hidden">

            {/* ══════════════════ HERO ══════════════════ */}
            <section className="hero-bg relative overflow-hidden pt-28 pb-24 md:pt-40 md:pb-36 min-h-[92vh]">
                {/* Three.js canvas fills right half of hero */}
                <div className="absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-none">
                    <HeroScene />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7">
                        <Reveal delay={0}>
                            <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-gold-600 mb-6">
                                <span className="kicker-dot" /> Issue 042 — Winter Solstice
                            </p>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <h1 className="font-serif font-light leading-[0.95] tracking-tight text-[clamp(2.4rem,6vw,5.5rem)] text-navy-950 mb-8">
                                Stories that{' '}
                                <em className="italic text-gold-500">linger</em>,<br />
                                long after the scroll.
                            </h1>
                        </Reveal>

                        <Reveal delay={0.24}>
                            <p className="text-lg text-navy-600 leading-relaxed max-w-xl mb-10">
                                Luminary is a slow-read magazine for the curious. Essays, reportage
                                and visual narratives on design, cities, craft and the quiet
                                revolutions happening in plain sight.
                            </p>
                        </Reveal>

                        <Reveal delay={0.36}>
                            <div className="flex flex-wrap items-center gap-4 mb-14">
                                <Link
                                    href="/articles"
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-navy-950 text-cream-50 hover:bg-gold-500 hover:text-navy-950 transition-colors duration-300 text-sm font-semibold"
                                >
                                    Start reading
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/subscribe"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-navy-200 hover:border-navy-400 transition-colors text-sm font-medium text-navy-700"
                                >
                                    <Crown className="w-4 h-4" /> View plans
                                </Link>
                            </div>
                        </Reveal>

                        <Reveal delay={0.48}>
                            <div className="grid grid-cols-3 max-w-md gap-6">
                                {[
                                    { num: '148', label: 'Essays' },
                                    { num: '24', label: 'Contributors' },
                                    { num: '12', label: 'Countries' },
                                ].map(({ num, label }) => (
                                    <div key={label}>
                                        <div className="font-serif text-3xl text-navy-950">{num}</div>
                                        <div className="text-[0.65rem] font-bold uppercase tracking-widest text-navy-400 mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* Right column is occupied by the 3D canvas absolutely */}
                    <div className="md:col-span-5 hidden md:block min-h-[520px]" />
                </div>

                {/* "Now reading" bar (bottom of hero) */}
                {featured && (
                    <Reveal delay={0.6}>
                        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-8">
                            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-navy-100 rounded-full px-4 py-2 text-xs text-navy-400">
                                <span className="font-bold uppercase tracking-widest">Now reading</span>
                                <span className="w-px h-3 bg-navy-200" />
                                <span className="text-navy-600 truncate max-w-[240px]">{featured.title}</span>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* Marquee strip */}
                <div className="relative z-10 mt-16 border-y border-navy-100 py-4 overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <span key={i} className="font-serif text-2xl md:text-3xl italic text-navy-400 px-8">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ FEATURED ARTICLES ══════════════════ */}
            <Section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <Kicker>Featured</Kicker>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-navy-950">
                                This week, we're reading
                            </h2>
                        </div>
                        <Link href="/articles" className="hidden md:inline text-sm text-navy-500 navlink hover:text-navy-900 transition-colors">
                            All stories →
                        </Link>
                    </div>

                    {recent.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {recent.map((article, i) => (
                                <Reveal key={article._id} delay={i * 0.1}>
                                    <FeaturedArticleCard article={article} type={ARTICLE_TYPES[i] || article.category} />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="rounded-2xl bg-navy-50 animate-pulse aspect-[4/5]" />
                            ))}
                        </div>
                    )}
                </div>
            </Section>

            {/* ══════════════════ PREMIUM ARTICLES ══════════════════ */}
            <Section className="py-24 md:py-32 bg-gradient-to-b from-cream-100 to-cream-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <Kicker gold>Luminary+</Kicker>
                            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-navy-950">
                                The long reads,{' '}
                                <em className="italic text-gold-500">unlocked.</em>
                            </h2>
                        </div>
                        <Link href="/subscribe" className="hidden md:inline text-sm text-navy-500 navlink hover:text-navy-900 transition-colors">
                            See membership →
                        </Link>
                    </div>

                    {premiumArticles.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <Reveal delay={0}>
                                <PremiumCard article={premiumArticles[0]} dark />
                            </Reveal>
                            {premiumArticles[1] && (
                                <Reveal delay={0.1}>
                                    <PremiumCard article={premiumArticles[1]} />
                                </Reveal>
                            )}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            {[0, 1].map(i => (
                                <div key={i} className="rounded-3xl bg-navy-50 animate-pulse h-64" />
                            ))}
                        </div>
                    )}
                </div>
            </Section>

            {/* ══════════════════ LOCKED LONGFORM PREVIEW ══════════════════ */}
            {previewArticle && (
                <Section className="py-24 md:py-32">
                    <div className="max-w-4xl mx-auto px-6">
                        <Reveal>
                            <Kicker>Longform Preview</Kicker>
                            <h2 className="font-serif text-center text-4xl md:text-5xl tracking-tight text-navy-950 mb-4">
                                {previewArticle.title}
                            </h2>
                            <p className="text-center text-navy-400 mb-10 text-sm">
                                By {previewArticle.author} · {previewArticle.readingTimeMins} min read · {previewArticle.category}
                            </p>
                        </Reveal>

                        <div className="relative rounded-3xl overflow-hidden bg-white border border-navy-100 shadow-[0_30px_80px_-30px_rgba(10,15,30,0.18)]">
                            {/* Blurred preview text */}
                            <div className="p-8 md:p-12 lock-blur">
                                <p className="font-serif text-xl leading-relaxed text-navy-700 mb-6">
                                    {previewArticle.excerpt} Somewhere between the second and third cup
                                    of coffee, I noticed the difference in how long-form writing asks you
                                    to slow down — to sit with an idea rather than scroll past it.
                                </p>
                                <p className="font-serif text-xl leading-relaxed text-navy-700 mb-6">
                                    We don't read like this anymore. Not because we can't, but because
                                    the infrastructure of our attention has been rebuilt around speed.
                                    An essay is an act of deliberate friction. It asks you to slow down
                                    twice — once to read it, once to let it settle.
                                </p>
                                <p className="font-serif text-xl leading-relaxed text-navy-700">
                                    The implications reach further than we might expect. In a world of
                                    algorithmic feeds optimized for outrage and brevity, choosing to read
                                    slowly is itself a political act — a refusal of the attention economy
                                    on its own terms…
                                </p>
                            </div>

                            {/* Lock overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-cream-50/50 to-cream-50/95">
                                <div className="text-center max-w-md px-6">
                                    <div className="relative w-28 h-28 mx-auto mb-6">
                                        <LockIcon3D />
                                    </div>
                                    <h3 className="font-serif text-2xl text-navy-950 mb-2">
                                        This is a Luminary+ story
                                    </h3>
                                    <p className="text-sm text-navy-500 mb-6 leading-relaxed">
                                        Members read every longform piece, ad-free, with the full archive.
                                    </p>
                                    <Link
                                        href="/subscribe"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-950 text-cream-50 hover:bg-gold-500 hover:text-navy-950 transition-colors text-sm font-semibold"
                                    >
                                        Unlock with membership <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <p className="text-xs text-navy-400 mt-4">
                                        Already a member?{' '}
                                        <Link href="/login" className="underline hover:text-navy-600 transition-colors">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {/* ══════════════════ SUBSCRIPTION PLANS ══════════════════ */}
            <Section className="py-24 md:py-32 bg-navy-950 text-white overflow-hidden relative">
                <div className="absolute inset-0 plans-glow opacity-40 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Kicker gold>Membership</Kicker>
                        <h2 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
                            Read at the pace{' '}
                            <em className="italic text-gold-400">the writing asks for.</em>
                        </h2>
                        <p className="text-navy-300 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                            Cancel anytime. Every plan includes the full archive and our weekly letter.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
                        {PLANS.map((plan, i) => (
                            <Reveal key={plan.id} delay={i * 0.1}>
                                <div className={plan.featured ? 'md:-mt-4' : ''}>
                                    <FlipPlanCard plan={plan} />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════ NEWSLETTER ══════════════════ */}
            <Section className="py-20 bg-cream-100">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <Reveal>
                        <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Mail className="w-6 h-6 text-navy-950" />
                        </div>
                        <h2 className="section-title mb-3">One story, every Sunday</h2>
                        <p className="section-subtitle mb-8">
                            No tracking, no noise. Just one piece of writing worth your time,
                            delivered to your inbox before the week begins.
                        </p>

                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2 text-emerald-600 font-semibold"
                            >
                                <CheckCircle className="w-5 h-5" /> You're on the list. See you Sunday.
                            </motion.div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@domain.com"
                                    className="flex-1 px-4 py-3 rounded-full bg-white border border-navy-100 text-sm text-navy-900 placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                                />
                                <button type="submit" className="px-5 py-3 rounded-full bg-navy-950 text-cream-50 hover:bg-gold-500 hover:text-navy-950 transition-colors text-sm font-semibold flex-shrink-0">
                                    Join
                                </button>
                            </form>
                        )}
                        <p className="text-navy-400 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
                    </Reveal>
                </div>
            </Section>

        </div>
    );
}
