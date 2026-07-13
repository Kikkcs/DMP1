'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window { THREE: any; }
}

export default function LockIcon3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const initScene = () => {
            if (!canvasRef.current) return;
            const THREE = window.THREE;
            if (!THREE) return;

            const canvas = canvasRef.current;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
            camera.position.set(0, 0, 6);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const size = () => {
                const r = canvas.parentElement!.getBoundingClientRect();
                renderer.setSize(r.width, r.height, false);
            };
            size();
            window.addEventListener('resize', size);

            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            const d1 = new THREE.DirectionalLight(0xffffff, 1.2);
            d1.position.set(3, 4, 5);
            scene.add(d1);
            const d2 = new THREE.DirectionalLight(0xD4A853, 0.6);
            d2.position.set(-4, -2, 2);
            scene.add(d2);

            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0A0F1E, roughness: 0.3, metalness: 0.6 });
            const shackleMat = new THREE.MeshStandardMaterial({ color: 0xD4A853, roughness: 0.25, metalness: 0.9 });

            const group = new THREE.Group();
            const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 0.9), bodyMat);
            body.position.y = -0.2;
            group.add(body);

            const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.11, 16, 40, Math.PI), shackleMat);
            shackle.rotation.z = Math.PI;
            shackle.position.y = 0.45;
            group.add(shackle);

            const keyhole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 20), shackleMat);
            keyhole.rotation.x = Math.PI / 2;
            keyhole.position.set(0, -0.1, 0.46);
            group.add(keyhole);

            const keySlot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.1), shackleMat);
            keySlot.position.set(0, -0.22, 0.46);
            group.add(keySlot);

            scene.add(group);

            const t0 = performance.now();
            const tick = () => {
                const t = (performance.now() - t0) / 1000;
                group.rotation.y = Math.sin(t * 0.6) * 0.5;
                group.rotation.x = Math.sin(t * 0.4) * 0.12;
                group.position.y = Math.sin(t * 0.8) * 0.05;
                renderer.render(scene, camera);
                rafRef.current = requestAnimationFrame(tick);
            };

            if (!reduced) tick();
            else renderer.render(scene, camera);

            return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                window.removeEventListener('resize', size);
                renderer.dispose();
            };
        };

        // Three.js is already loaded by HeroScene on the page; reuse it
        const tryInit = () => {
            if (window.THREE) {
                initScene();
            } else {
                setTimeout(tryInit, 300);
            }
        };

        // Use IntersectionObserver so this only starts when visible
        const el = canvasRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                tryInit();
                io.disconnect();
            }
        }, { threshold: 0.2 });
        io.observe(el);

        return () => {
            io.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
        />
    );
}
