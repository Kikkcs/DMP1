'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, User, Crown, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Article } from '@/types';
import { formatDate, getCategoryColor, getCategoryIcon, cn } from '@/lib/utils';
import { useState } from 'react';
import { usersApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ArticleCardProps {
    article: Article;
    index?: number;
    size?: 'sm' | 'md' | 'lg';
    showSave?: boolean;
    isSaved?: boolean;
    onUnsave?: (id: string) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function ArticleCard({
    article,
    index = 0,
    size = 'md',
    showSave = false,
    isSaved = false,
    onUnsave,
}: ArticleCardProps) {
    const { user } = useAuth();
    const [saved, setSaved] = useState(isSaved);
    const [savingLoading, setSavingLoading] = useState(false);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return;
        setSavingLoading(true);
        try {
            if (saved) {
                await usersApi.unsaveArticle(article._id);
                setSaved(false);
                onUnsave?.(article._id);
            } else {
                await usersApi.saveArticle(article._id);
                setSaved(true);
            }
        } catch { /* ignore */ }
        setSavingLoading(false);
    };

    const imgHeight = size === 'lg' ? 'h-64' : size === 'sm' ? 'h-40' : 'h-48';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <Link href={`/articles/${article.slug}`} className="group block">
                <article className="card h-full flex flex-col">
                    {/* Cover Image */}
                    <div className={`relative ${imgHeight} overflow-hidden`}>
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        {/* Premium badge */}
                        {article.isPremium && (
                            <div className="absolute top-3 right-3">
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-gold-500 text-navy-950 text-xs font-bold rounded-full shadow-lg">
                                    <Crown className="w-3 h-3" /> Premium
                                </span>
                            </div>
                        )}

                        {/* Save button */}
                        {showSave && user && (
                            <button
                                onClick={handleSave}
                                disabled={savingLoading}
                                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                                aria-label={saved ? 'Unsave article' : 'Save article'}
                            >
                                {saved
                                    ? <BookmarkCheck className="w-4 h-4 text-gold-600" />
                                    : <BookmarkPlus className="w-4 h-4 text-navy-600" />
                                }
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={cn('badge text-xs', getCategoryColor(article.category))}>
                                {getCategoryIcon(article.category)} {article.category}
                            </span>
                        </div>

                        <h3 className={cn(
                            'font-serif font-bold text-navy-950 leading-snug mb-2 group-hover:text-navy-700 transition-colors line-clamp-2',
                            size === 'lg' ? 'text-xl md:text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'
                        )}>
                            {article.title}
                        </h3>

                        {size !== 'sm' && (
                            <p className="text-navy-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                                {article.excerpt}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-navy-50">
                            <div className="w-6 h-6 rounded-full gradient-navy flex items-center justify-center flex-shrink-0">
                                <User className="w-3 h-3 text-cream-50" />
                            </div>
                            <span className="text-xs font-medium text-navy-600 truncate">{article.author}</span>
                            <span className="text-navy-200">·</span>
                            <span className="flex items-center gap-1 text-xs text-navy-400 flex-shrink-0">
                                <Clock className="w-3 h-3" /> {article.readingTimeMins}m
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
