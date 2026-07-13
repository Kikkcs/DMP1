'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Crown, BookOpen } from 'lucide-react';
import { articlesApi } from '@/lib/api';
import { Article, CATEGORIES, PaginationInfo } from '@/types';
import ArticleCard from '@/components/articles/ArticleCard';
import { getCategoryIcon } from '@/lib/utils';

function ArticlesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [premiumFilter, setPremiumFilter] = useState<'all' | 'free' | 'premium'>(
        (searchParams.get('premium') as any) || 'all'
    );
    const [page, setPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const fetchArticles = useCallback(async (append = false) => {
        setLoading(true);
        const params: Record<string, string | number> = { page, limit: 12 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (category !== 'All') params.category = category;
        if (premiumFilter === 'free') params.premium = 'false';
        if (premiumFilter === 'premium') params.premium = 'true';

        try {
            const res = await articlesApi.getAll(params);
            setArticles(prev => append ? [...prev, ...res.data.articles] : res.data.articles);
            setPagination(res.data.pagination);
        } catch { /* ignore */ }
        setLoading(false);
    }, [page, debouncedSearch, category, premiumFilter]);

    useEffect(() => { setPage(1); }, [debouncedSearch, category, premiumFilter]);
    useEffect(() => { fetchArticles(page > 1); }, [fetchArticles, page]);

    // Sync URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category !== 'All') params.set('category', category);
        if (premiumFilter !== 'all') params.set('premium', premiumFilter);
        router.replace(`/articles?${params.toString()}`, { scroll: false });
    }, [debouncedSearch, category, premiumFilter, router]);

    const hasMore = pagination ? page < pagination.totalPages : false;

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page header */}
                <div className="mb-10">
                    <h1 className="section-title mb-2">All Articles</h1>
                    <p className="section-subtitle">
                        {pagination ? `${pagination.total} stories across 5 categories` : 'Exploring our collection...'}
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-navy-100 p-5 mb-8 shadow-sm space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                        <input
                            id="article-search"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search articles, authors, topics…"
                            className="input-field pl-10 pr-10"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {['All', ...CATEGORIES].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat
                                        ? 'bg-navy-950 text-white shadow-sm'
                                        : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                                    }`}
                            >
                                {cat !== 'All' && getCategoryIcon(cat)} {cat}
                            </button>
                        ))}
                    </div>

                    {/* Premium filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-navy-600 mr-1">Filter:</span>
                        {(['all', 'free', 'premium'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setPremiumFilter(f)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${premiumFilter === f
                                        ? f === 'premium' ? 'bg-gold-500 text-navy-950' : 'bg-navy-950 text-white'
                                        : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                                    }`}
                            >
                                {f === 'premium' && <Crown className="w-3 h-3" />}
                                {f === 'all' ? 'All Stories' : f === 'free' ? '🆓 Free' : '✦ Premium'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles grid */}
                {loading && page === 1 ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
                    </div>
                ) : articles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <BookOpen className="w-16 h-16 text-navy-200 mx-auto mb-4" />
                        <h3 className="font-serif text-xl text-navy-700 mb-2">No articles found</h3>
                        <p className="text-navy-400">Try adjusting your search or filters.</p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${debouncedSearch}-${category}-${premiumFilter}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {articles.map((article, i) => (
                                <ArticleCard key={article._id} article={article} index={i} showSave />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={loading}
                            className="btn-secondary !px-10 !py-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More Stories'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold-500" /></div>}>
            <ArticlesContent />
        </Suspense>
    );
}
