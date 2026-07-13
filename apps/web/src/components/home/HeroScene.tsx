'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        THREE: any;
    }
}

export default function HeroScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let loaded = false;

        const initScene = () => {
            if (loaded || !canvasRef.current) return;
            const THREE = window.THREE;
            if (!THREE) return;
            loaded = true;

            const canvas = canvasRef.current;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.set(0, 0, 8);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const resize = () => {
                const p = canvas.parentElement!.getBoundingClientRect();
                renderer.setSize(p.width, p.height, false);
                camera.aspect = p.width / p.height;
                camera.updateProjectionMatrix();
            };
            resize();
            window.addEventListener('resize', resize);

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.55));
            const key = new THREE.DirectionalLight(0xffffff, 1.1);
            key.position.set(3, 4, 5);
            scene.add(key);
            const rim = new THREE.DirectionalLight(0xD4A853, 0.7); // gold
            rim.position.set(-5, -2, -3);
            scene.add(rim);
            const fill = new THREE.DirectionalLight(0x1e2a6e, 0.5); // navy
            fill.position.set(4, -3, 2);
            scene.add(fill);

            const group = new THREE.Group();
            scene.add(group);

            const matA = new THREE.MeshStandardMaterial({ color: 0x0A0F1E, roughness: 0.35, metalness: 0.2 });
            const matB = new THREE.MeshStandardMaterial({ color: 0xD4A853, roughness: 0.25, metalness: 0.6 });
            const matC = new THREE.MeshStandardMaterial({ color: 0xFDFAF4, roughness: 0.6, metalness: 0.0 });
            const matD = new THREE.MeshStandardMaterial({ color: 0x1e2a6e, roughness: 0.3, metalness: 0.4 });

            // Magazine "pages"
            const pageGeo = new THREE.BoxGeometry(2.2, 3, 0.04);
            const pages: any[] = [];
            for (let i = 0; i < 4; i++) {
                const m = new THREE.Mesh(
                    pageGeo,
                    i === 1 ? matB : i === 2 ? matD : i === 0 ? matA : matC
                );
                m.position.set((i - 1.5) * 0.15, (i - 1.5) * 0.05, -i * 0.18);
                m.rotation.y = (i - 1.5) * 0.08;
                m.rotation.x = -0.05;
                group.add(m);
                pages.push(m);
            }

            // Accent shapes
            const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), matB);
            sphere.position.set(1.6, 1.2, 0.8);
            group.add(sphere);

            const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 12, 40), matD);
            torus.position.set(-1.7, -1.0, 0.6);
            group.add(torus);

            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 6), matA);
            cone.position.set(-1.3, 1.5, 0.4);
            group.add(cone);

            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 8, 60), matC);
            ring.position.set(1.4, -1.4, 0.2);
            group.add(ring);

            const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
            const onMouse = (e: MouseEvent) => {
                mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
                mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            window.addEventListener('mousemove', onMouse);

            const t0 = performance.now();
            const tick = () => {
                const t = (performance.now() - t0) / 1000;
                mouse.x += (mouse.tx - mouse.x) * 0.05;
                mouse.y += (mouse.ty - mouse.y) * 0.05;

                group.rotation.y = Math.sin(t * 0.25) * 0.25 + mouse.x * 0.25;
                group.rotation.x = Math.cos(t * 0.2) * 0.12 - mouse.y * 0.18;

                pages.forEach((p, i) => {
                    p.position.y = (i - 1.5) * 0.05 + Math.sin(t * 0.8 + i) * 0.04;
                });
                sphere.position.y = 1.2 + Math.sin(t * 1.1) * 0.15;
                sphere.rotation.x = t * 0.6;
                sphere.rotation.y = t * 0.4;
                torus.rotation.x = t * 0.5;
                torus.rotation.y = t * 0.7;
                torus.position.y = -1.0 + Math.cos(t * 0.9) * 0.12;
                cone.rotation.y = t * 0.8;
                cone.position.y = 1.5 + Math.sin(t * 0.7 + 1) * 0.1;
                ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.3;
                ring.rotation.z = t * 0.3;

                renderer.render(scene, camera);
                rafRef.current = requestAnimationFrame(tick);
            };

            if (!reduced) {
                tick();
            } else {
                renderer.render(scene, camera);
            }

            return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', onMouse);
                renderer.dispose();
            };
        };

        // Load Three.js dynamically
        if (window.THREE) {
            initScene();
        } else {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
            script.onload = () => {
                if ('requestIdleCallback' in window) {
                    (window as any).requestIdleCallback(initScene);
                } else {
                    setTimeout(initScene, 120);
                }
            };
            document.head.appendChild(script);
        }

        return () => {
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
