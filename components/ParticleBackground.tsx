'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let scrollY = 0;
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.35 + 0.08,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      }));
    };

    const onScroll = () => { scrollY = window.scrollY; };

    const draw = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parallaxFactor = 0.15;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += p.pulseSpeed;
        const pulsedRadius = p.radius * (1 + 0.3 * Math.sin(p.pulse));
        const pulsedOpacity = p.opacity * (1 + 0.2 * Math.sin(p.pulse * 1.3));
        const drawY = ((p.y - scrollY * parallaxFactor) % canvas.height + canvas.height) % canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, drawY, pulsedRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${pulsedOpacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const drawY2 = ((p2.y - scrollY * parallaxFactor) % canvas.height + canvas.height) % canvas.height;
          const dx = p.x - p2.x;
          const dy = drawY - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245,158,11,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, drawY);
            ctx.lineTo(p2.x, drawY2);
            ctx.stroke();
          }
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -2) p.x = canvas.width + 2;
        if (p.x > canvas.width + 2) p.x = -2;
        if (p.y < -2) p.y = canvas.height + 2;
        if (p.y > canvas.height + 2) p.y = -2;
      }

      // Occasional sound-wave ripple
      if (frameCount % 180 === 0) {
        const rippleX = Math.random() * canvas.width;
        const rippleY = Math.random() * canvas.height;
        let r = 0;
        const maxR = 80 + Math.random() * 60;
        const drawRipple = () => {
          r += 1.5;
          const alpha = (1 - r / maxR) * 0.12;
          ctx.beginPath();
          ctx.arc(rippleX, rippleY, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245,158,11,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          if (r < maxR) requestAnimationFrame(drawRipple);
        };
        drawRipple();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}
