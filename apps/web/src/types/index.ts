export interface Article {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    content: string;
    author: string;
    category: 'Technology' | 'Culture' | 'Science' | 'Business' | 'Health';
    tags: string[];
    isPremium: boolean;
    publishDate: string;
    readingTimeMins: number;
    views: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    otpVerified: boolean;
    isSubscribed: boolean;
    subscriptionPlan: 'none' | 'monthly' | 'yearly';
    subscriptionExpiry?: string;
    savedArticles?: Article[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ArticlesResponse {
    articles: Article[];
    pagination: PaginationInfo;
}

export const CATEGORIES = ['Technology', 'Culture', 'Science', 'Business', 'Health'] as const;
export type Category = typeof CATEGORIES[number];
