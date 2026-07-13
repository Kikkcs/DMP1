import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
    try {
        return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch {
        return dateString;
    }
}

export function getCategoryColor(category: string): string {
    const map: Record<string, string> = {
        Technology: 'bg-blue-100 text-blue-700',
        Culture: 'bg-purple-100 text-purple-700',
        Science: 'bg-emerald-100 text-emerald-700',
        Business: 'bg-amber-100 text-amber-700',
        Health: 'bg-rose-100 text-rose-700',
    };
    return map[category] ?? 'bg-navy-100 text-navy-700';
}

export function getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
        Technology: '⚡',
        Culture: '🎭',
        Science: '🔬',
        Business: '📈',
        Health: '🌿',
    };
    return map[category] ?? '📄';
}

export function getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
