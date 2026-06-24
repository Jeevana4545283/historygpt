import { useEffect, useRef } from "react";

export const CinematicParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            opacity: number;
            fadeSpeed: number;
            pulseDir: number;
        }> = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Initialize particles
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.15, // extremely slow drifting
                vy: -Math.random() * 0.15 - 0.05,  // drift upwards gently
                radius: Math.random() * 3 + 1,      // tiny soft dots
                opacity: Math.random() * 0.35 + 0.05,
                fadeSpeed: Math.random() * 0.002 + 0.001,
                pulseDir: Math.random() > 0.5 ? 1 : -1
            });
        }

        // Render loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Update coordinates
                p.x += p.vx;
                p.y += p.vy;

                // Animate opacity pulsing
                p.opacity += p.fadeSpeed * p.pulseDir;
                if (p.opacity > 0.45) {
                    p.pulseDir = -1;
                } else if (p.opacity < 0.05) {
                    p.pulseDir = 1;
                }

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }

                // Render soft glowing particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                
                // Set gradient fill for subtle atmospheric glow
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `rgba(217, 180, 250, ${p.opacity})`); // soft purple-goldish white
                grad.addColorStop(1, `rgba(217, 180, 250, 0)`);
                
                ctx.fillStyle = grad;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ mixBlendMode: "screen" }}
        />
    );
};
