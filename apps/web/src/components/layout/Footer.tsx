import Link from 'next/link';
import { BookOpen, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const FOOTER_LINKS = {
    Explore: [
        { href: '/articles', label: 'All Articles' },
        { href: '/articles?category=Technology', label: 'Technology' },
        { href: '/articles?category=Culture', label: 'Culture' },
        { href: '/articles?category=Science', label: 'Science' },
        { href: '/articles?category=Business', label: 'Business' },
        { href: '/articles?category=Health', label: 'Health' },
    ],
    Membership: [
        { href: '/subscribe', label: 'Subscribe' },
        { href: '/subscribe#monthly', label: 'Monthly Plan' },
        { href: '/subscribe#yearly', label: 'Yearly Plan' },
        { href: '/profile', label: 'My Account' },
    ],
    Company: [
        { href: '#', label: 'About Luminary' },
        { href: '#', label: 'Editorial Standards' },
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms of Use' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-navy-950 text-white mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-navy-950" />
                            </div>
                            <span className="font-serif font-bold text-xl">Luminary</span>
                        </Link>
                        <p className="text-navy-300 text-sm leading-relaxed mb-6">
                            Premium long-form journalism for the intellectually curious. Ideas that matter, stories that endure.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Twitter, label: 'Twitter' },
                                { icon: Linkedin, label: 'LinkedIn' },
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Mail, label: 'Email' },
                            ].map(({ icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-gold-500 hover:text-navy-950 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-navy-400 text-sm hover:text-gold-400 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-navy-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-navy-500 text-sm">
                        © 2024 Luminary Publishing. All rights reserved.
                    </p>
                    <p className="text-navy-600 text-xs">
                        Built with passion for great writing
                    </p>
                </div>
            </div>
        </footer>
    );
}
