'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    maxTilt?: number;
}

export default function TiltCard({ children, className = '', maxTilt = 10 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawX, { stiffness: 200, damping: 30 });
    const rotateY = useSpring(rawY, { stiffness: 200, damping: 30 });
    const scale = useSpring(1, { stiffness: 200, damping: 30 });

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rawX.set((0.5 - py) * maxTilt);
        rawY.set((px - 0.5) * maxTilt * 1.2);
        scale.set(1.02);
    };

    const onLeave = () => {
        rawX.set(0);
        rawY.set(0);
        scale.set(1);
    };

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, scale, transformPerspective: 1200 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`transform-gpu ${className}`}
        >
            {children}
        </motion.div>
    );
}
