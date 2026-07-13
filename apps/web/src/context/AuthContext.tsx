'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { usersApi } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('luminary_token');
        const savedUser = localStorage.getItem('luminary_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            try { setUser(JSON.parse(savedUser)); } catch { /* ignore */ }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('luminary_token', newToken);
        localStorage.setItem('luminary_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('luminary_token');
        localStorage.removeItem('luminary_user');
        setToken(null);
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const res = await usersApi.getMe();
            const freshUser = res.data.user;
            const mapped: User = {
                id: freshUser._id,
                name: freshUser.name,
                email: freshUser.email,
                otpVerified: freshUser.otpVerified,
                isSubscribed: freshUser.isSubscribed,
                subscriptionPlan: freshUser.subscriptionPlan,
                subscriptionExpiry: freshUser.subscriptionExpiry,
                savedArticles: freshUser.savedArticles,
            };
            setUser(mapped);
            localStorage.setItem('luminary_user', JSON.stringify(mapped));
        } catch { /* ignore */ }
    }, [token]);

    const updateUser = useCallback((updated: User) => {
        setUser(updated);
        localStorage.setItem('luminary_user', JSON.stringify(updated));
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
