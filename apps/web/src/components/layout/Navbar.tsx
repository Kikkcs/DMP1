'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, LogOut, BookOpen, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';

const NAV_LINKS = [
    { href: '/articles', label: 'Articles' },
    { href: '/articles?category=Technology', label: 'Tech' },
    { href: '/articles?category=Culture', label: 'Culture' },
    { href: '/articles?category=Science', label: 'Science' },
    { href: '/subscribe', label: 'Subscribe' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        router.push('/');
    };

    const isHome = pathname === '/';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-navy-100'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-sm">
                            <BookOpen className="w-4 h-4 text-navy-950" />
                        </div>
                        <span className={`font-serif font-bold text-xl tracking-tight transition-colors ${scrolled || !isHome ? 'text-navy-950' : 'text-white'
                            }`}>
                            Luminary
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                                        ? 'text-gold-600 bg-gold-50'
                                        : scrolled || !isHome
                                            ? 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label === 'Subscribe' ? (
                                    <span className="flex items-center gap-1">
                                        <Crown className="w-3.5 h-3.5" /> {link.label}
                                    </span>
                                ) : link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/articles"
                            className={`p-2 rounded-lg transition-all ${scrolled || !isHome
                                    ? 'text-navy-500 hover:text-navy-900 hover:bg-navy-50'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            aria-label="Search articles"
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    id="profile-menu-btn"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-navy-100 bg-white hover:border-gold-400 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full gradient-navy flex items-center justify-center text-cream-50 text-xs font-bold">
                                        {getInitials(user.name)}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-navy-800 max-w-[100px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-navy-100 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-navy-50">
                                                <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                                                <p className="text-xs text-navy-400 truncate">{user.email}</p>
                                                {user.isSubscribed && (
                                                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-600">
                                                        <Crown className="w-3 h-3" /> Premium
                                                    </span>
                                                )}
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 transition-colors"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    <User className="w-4 h-4" /> My Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled || !isHome
                                            ? 'text-navy-700 hover:text-navy-900'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    Sign In
                                </Link>
                                <Link href="/signup" className="btn-primary !px-4 !py-2 !text-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-navy-700 hover:bg-navy-50' : 'text-white hover:bg-white/10'
                                }`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-navy-100 overflow-hidden"
                    >
                        <nav className="flex flex-col px-4 py-4 gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-3 rounded-xl text-navy-700 font-medium hover:bg-navy-50 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <div className="mt-3 flex flex-col gap-2">
                                    <Link href="/login" className="btn-secondary justify-center">Sign In</Link>
                                    <Link href="/signup" className="btn-primary justify-center">Get Started</Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
