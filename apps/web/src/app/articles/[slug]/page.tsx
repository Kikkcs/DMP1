'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, User, Calendar, Crown, ArrowLeft, BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react';
import { articlesApi, usersApi } from '@/lib/api';
import { Article } from '@/types';
import { formatDate, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import PremiumGate from '@/components/articles/PremiumGate';
import ArticleCard from '@/components/articles/ArticleCard';

export default function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [related, setRelated] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const isSubscribed = user?.isSubscribed ?? false;
    const isGated = article?.isPremium && !isSubscribed;

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        Promise.all([
            articlesApi.getBySlug(slug),
            articlesApi.getRelated(slug),
        ]).then(([artRes, relRes]) => {
            setArticle(artRes.data.article);
            setRelated(relRes.data.articles);
        }).finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        if (user?.savedArticles && article) {
            setSaved(user.savedArticles.some((s: any) =>
                (typeof s === 'string' ? s : s._id) === article._id
            ));
        }
    }, [user, article]);

    const handleSave = async () => {
        if (!user || !article) return;
        setSaveLoading(true);
        try {
            if (saved) { await usersApi.unsaveArticle(article._id); setSaved(false); }
            else { await usersApi.saveArticle(article._id); setSaved(true); }
        } catch { /* ignore */ }
        setSaveLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-serif text-3xl text-navy-900 mb-4">Article Not Found</h1>
                <Link href="/articles" className="btn-primary">Browse Articles</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen">

            {/* Cover */}
            <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
                <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`badge text-xs ${getCategoryColor(article.category)}`}>
                                {getCategoryIcon(article.category)} {article.category}
                            </span>
                            {article.isPremium && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-gold-500 text-navy-950 text-xs font-bold rounded-full">
                                    <Crown className="w-3 h-3" /> Premium
                                </span>
                            )}
                        </div>
                        <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {article.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Meta bar */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-navy-100"
                >
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500">
                        <span className="flex items-center gap-1.5 font-medium text-navy-800">
                            <div className="w-7 h-7 rounded-full gradient-navy flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-cream-50" />
                            </div>
                            {article.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.publishDate)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {article.readingTimeMins} min read
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/articles" className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        {user && (
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy-200 text-sm font-medium hover:border-gold-400 transition-all"
                            >
                                {saved ? <BookmarkCheck className="w-4 h-4 text-gold-600" /> : <BookmarkPlus className="w-4 h-4" />}
                                {saved ? 'Saved' : 'Save'}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Excerpt */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-xl text-navy-600 leading-relaxed italic my-8 pl-6 border-l-4 border-gold-400"
                >
                    {article.excerpt}
                </motion.p>

                {/* Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {isGated ? (
                        <>
                            <div
                                className="prose prose-lg max-w-none text-navy-700 leading-relaxed overflow-hidden"
                                style={{ maxHeight: '200px' }}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                            <PremiumGate />
                        </>
                    ) : (
                        <div
                            className="prose prose-lg max-w-none text-navy-700 leading-relaxed pb-12"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    )}
                </motion.div>

                {/* Tags */}
                {!isGated && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-12 border-t border-navy-100 pt-8">
                        {article.tags.map(tag => (
                            <Link
                                key={tag}
                                href={`/articles?search=${tag}`}
                                className="px-3 py-1 rounded-full bg-navy-50 text-navy-600 text-sm hover:bg-gold-50 hover:text-gold-700 transition-colors"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
                <section className="bg-cream-100 py-16 mt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="section-title mb-8">Related Stories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((rel, i) => (
                                <ArticleCard key={rel._id} article={rel} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
