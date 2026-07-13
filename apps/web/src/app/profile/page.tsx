'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Bookmark, BookmarkX, Edit2, Save, Loader2, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api';
import { Article } from '@/types';
import { getInitials, formatDate } from '@/lib/utils';

export default function ProfilePage() {
    const { user, token, logout, updateUser, refreshUser } = useAuth();
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [savedArticles, setSavedArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(true);

    useEffect(() => {
        if (!token) { router.push('/login'); return; }
        setLoadingArticles(true);
        refreshUser().then(() => setLoadingArticles(false));
    }, [token]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setSavedArticles((user.savedArticles as Article[]) || []);
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await usersApi.updateMe({ name, email });
            const u = res.data.user;
            updateUser({ ...user!, name: u.name, email: u.email });
            setSaveSuccess(true);
            setEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch { /* ignore */ }
        setSaving(false);
    };

    const handleUnsave = async (articleId: string) => {
        try {
            await usersApi.unsaveArticle(articleId);
            setSavedArticles(prev => prev.filter(a => a._id !== articleId));
        } catch { /* ignore */ }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
            </div>
        );
    }

    const subColor = user.isSubscribed
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-navy-50 text-navy-500 border-navy-200';

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="section-title">My Profile</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left — Profile card */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl border border-navy-100 shadow-sm p-8 text-center"
                        >
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl gradient-navy flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="font-serif text-2xl font-bold text-cream-50">{getInitials(user.name)}</span>
                            </div>
                            <h2 className="font-serif text-xl font-bold text-navy-950 mb-1">{user.name}</h2>
                            <p className="text-navy-400 text-sm mb-4">{user.email}</p>

                            {/* Subscription badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${subColor}`}>
                                {user.isSubscribed ? <><Crown className="w-3 h-3" /> Premium Member</> : 'Free Reader'}
                            </span>

                            {user.isSubscribed && user.subscriptionExpiry && (
                                <p className="text-xs text-navy-400 mt-2 flex items-center justify-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Renews {formatDate(user.subscriptionExpiry)}
                                </p>
                            )}

                            {!user.isSubscribed && (
                                <Link href="/subscribe" className="btn-primary mt-4 w-full justify-center !text-sm">
                                    <Crown className="w-4 h-4" /> Upgrade to Premium
                                </Link>
                            )}
                        </motion.div>

                        {/* Edit Profile */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-navy-100 shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-navy-900">Account Details</h3>
                                <button
                                    onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700"
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                                        editing ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
                                </button>
                            </div>

                            {saveSuccess && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-emerald-600 text-xs mb-4">
                                    <CheckCircle className="w-4 h-4" /> Profile updated!
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="label text-xs">Name</label>
                                    <input
                                        id="profile-name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        disabled={!editing}
                                        className={`input-field !py-2 text-sm ${!editing ? 'bg-navy-50 cursor-default' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="label text-xs">Email</label>
                                    <input
                                        id="profile-email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={!editing}
                                        className={`input-field !py-2 text-sm ${!editing ? 'bg-navy-50 cursor-default' : ''}`}
                                    />
                                </div>
                                {editing && (
                                    <button onClick={() => setEditing(false)} className="text-xs text-navy-400 hover:text-navy-700">
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-navy-50">
                                <button
                                    onClick={() => { logout(); router.push('/'); }}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Saved articles */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl border border-navy-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Bookmark className="w-5 h-5 text-gold-500" />
                                <h3 className="font-semibold text-navy-900">Saved Articles</h3>
                                <span className="badge badge-outline">{savedArticles.length}</span>
                            </div>

                            {loadingArticles ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                                </div>
                            ) : savedArticles.length === 0 ? (
                                <div className="text-center py-16">
                                    <Bookmark className="w-12 h-12 text-navy-200 mx-auto mb-4" />
                                    <h4 className="font-serif text-lg text-navy-700 mb-2">No saved articles yet</h4>
                                    <p className="text-navy-400 text-sm mb-6">Click the bookmark icon on any article to save it here.</p>
                                    <Link href="/articles" className="btn-primary !text-sm">Browse Articles</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {savedArticles.map((article, i) => (
                                        <motion.div
                                            key={article._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-4 p-4 rounded-xl border border-navy-50 hover:border-navy-200 transition-all group"
                                        >
                                            {article.coverImage && (
                                                <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="80px" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    className="font-serif font-semibold text-navy-900 hover:text-navy-600 transition-colors text-sm leading-snug line-clamp-2 block"
                                                >
                                                    {article.title}
                                                </Link>
                                                <p className="text-xs text-navy-400 mt-1">{article.author} · {article.readingTimeMins}m read</p>
                                            </div>
                                            <button
                                                onClick={() => handleUnsave(article._id)}
                                                className="p-2 rounded-lg text-navy-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                aria-label="Remove from saved"
                                            >
                                                <BookmarkX className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
