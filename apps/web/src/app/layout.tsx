import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: {
        default: 'Luminary — Ideas Worth Reading',
        template: '%s | Luminary',
    },
    description: 'Luminary is a premium digital magazine covering technology, culture, science, business, and health. Curated long-form journalism for the intellectually curious.',
    keywords: ['magazine', 'journalism', 'technology', 'culture', 'science', 'premium content'],
    openGraph: {
        type: 'website',
        siteName: 'Luminary',
        title: 'Luminary — Ideas Worth Reading',
        description: 'Premium digital magazine for the intellectually curious.',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
