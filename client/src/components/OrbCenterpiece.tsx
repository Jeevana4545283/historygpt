import { useEffect, useRef, useState } from "react";

interface OrbCenterpieceProps {
    type?: "energy" | "plasma" | "hologram" | "royal";
    className?: string;
}

export const OrbCenterpiece = ({ type = "energy", className = "" }: OrbCenterpieceProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasWebGL, setHasWebGL] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Try getting WebGL context with transparent alpha and antialiasing enabled
        const gl = (canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true }) || 
                   canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: true, antialias: true })) as WebGLRenderingContext | null;
        
        if (!gl) {
            setHasWebGL(false);
            return;
        }

        // Vertex Shader Source
        const vsSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment Shader Source (Luxury Glass Orb with Rotating Intersecting Tori)
        const fsSource = `
            precision mediump float;
            varying vec2 vUv;
            uniform vec2 uResolution;
            uniform float uTime;

            // Rotation helpers
            mat3 rotateX(float theta) {
                float c = cos(theta);
                float s = sin(theta);
                return mat3(
                    1.0, 0.0, 0.0,
                    0.0, c, -s,
                    0.0, s, c
                );
            }

            mat3 rotateY(float theta) {
                float c = cos(theta);
                float s = sin(theta);
                return mat3(
                    c, 0.0, s,
                    0.0, 1.0, 0.0,
                    -s, 0.0, c
                );
            }

            mat3 rotateZ(float theta) {
                float c = cos(theta);
                float s = sin(theta);
                return mat3(
                    c, -s, 0.0,
                    s, c, 0.0,
                    0.0, 0.0, 1.0
                );
            }

            // Torus distance function
            float sdTorus(vec3 p, vec2 t) {
                vec2 q = vec2(length(p.xz) - t.x, p.y);
                return length(q) - t.y;
            }

            // Sphere distance function
            float sdSphere(vec3 p, float r) {
                return length(p) - r;
            }

            // Dual rotating smooth tori (no noise, luxury look)
            float sdTorus1(vec3 p, float time) {
                // Extremely slow and smooth rotation
                vec3 q = rotateY(time * 0.12) * rotateZ(time * 0.06) * p;
                return sdTorus(q, vec2(0.20, 0.005));
            }

            float sdTorus2(vec3 p, float time) {
                // Reverse rotation for dynamic flow
                vec3 q = rotateX(time * 0.08) * rotateY(-time * 0.18) * p;
                return sdTorus(q, vec2(0.16, 0.004));
            }

            float sdCore(vec3 p, float time) {
                // Slow organic breathing core
                float breathe = 0.085 + 0.006 * sin(time * 0.8);
                return sdSphere(p, breathe);
            }

            vec3 getNormal(vec3 p) {
                vec2 e = vec2(0.001, 0.0);
                return normalize(vec3(
                    sdSphere(p + e.xyy, 0.38) - sdSphere(p - e.xyy, 0.38),
                    sdSphere(p + e.yxy, 0.38) - sdSphere(p - e.yxy, 0.38),
                    sdSphere(p + e.yyx, 0.38) - sdSphere(p - e.yyx, 0.38)
                ));
            }

            void main() {
                // Centered coordinates (supporting aspect ratio mapping)
                vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
                
                // Camera Origin & slow floating animation
                vec3 ro = vec3(0.0, 0.0, 1.25);
                ro.y += 0.02 * sin(uTime * 0.45);
                ro.x += 0.01 * cos(uTime * 0.3);
                
                vec3 rd = normalize(vec3(uv, -1.0));
                
                float t = 0.0;
                float maxD = 3.0;
                bool hit = false;
                vec3 p = ro;
                
                float glow = 0.0;
                
                // Raymarching to intersect outer sphere boundary and gather volumetric glow
                for (int i = 0; i < 75; i++) {
                    p = ro + rd * t;
                    float dGlass = sdSphere(p, 0.38);
                    
                    // Inner elements
                    float dT1 = sdTorus1(p, uTime);
                    float dT2 = sdTorus2(p, uTime);
                    float dC = sdCore(p, uTime);
                    float dInner = min(dC, min(dT1, dT2));
                    
                    // Accumulate premium volumetric glow (vibrant indigo, cyan, violet)
                    float breathe = sin(uTime * 0.9) * 0.15 + 0.85;
                    glow += (0.0009 * breathe) / (0.0012 + dT1 * dT1 * 28.0);
                    glow += (0.0009 * breathe) / (0.0012 + dT2 * dT2 * 28.0);
                    glow += (0.0014 * breathe) / (0.0015 + dC * dC * 20.0);
                    
                    float d = min(dGlass, dInner);
                    if (d < 0.0008) {
                        hit = true;
                        break;
                    }
                    t += d * 0.55; // high quality understepping
                    if (t > maxD) break;
                }
                
                vec3 color = vec3(0.0);
                float alpha = 0.0;
                
                if (hit) {
                    vec3 n = getNormal(p);
                    vec3 ref = reflect(rd, n);
                    
                    // Studio lights setup
                    vec3 lightDir1 = normalize(vec3(1.0, 1.5, 1.0)); // Top right front
                    vec3 lightDir2 = normalize(vec3(-1.0, 1.0, -1.0)); // Top left back
                    
                    // Polished glass specular
                    float spec1 = pow(max(dot(ref, lightDir1), 0.0), 80.0); // very tight highlight
                    float spec2 = pow(max(dot(ref, lightDir2), 0.0), 32.0); // softer fill reflection
                    vec3 specHighlight = vec3(1.0, 1.0, 1.0) * spec1 * 0.95 + vec3(0.5, 0.75, 1.0) * spec2 * 0.35;
                    
                    // Fresnel reflection (bright edge highlights)
                    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 4.5);
                    vec3 glassEdge = mix(vec3(0.05, 0.35, 0.95), vec3(0.6, 0.1, 0.85), sin(uTime * 0.5) * 0.5 + 0.5) * fresnel * 0.85;
                    
                    // Refraction inside the glass
                    vec3 refr = refract(rd, n, 1.0 / 1.15);
                    vec3 insideRo = p + refr * 0.01;
                    float tInside = 0.0;
                    vec3 innerColor = vec3(0.0);
                    float innerHit = 0.0;
                    
                    // Raymarch inside the glass shell
                    for (int j = 0; j < 35; j++) {
                        vec3 ip = insideRo + refr * tInside;
                        float dT1 = sdTorus1(ip, uTime);
                        float dT2 = sdTorus2(ip, uTime);
                        float dC = sdCore(ip, uTime);
                        float dInner = min(dC, min(dT1, dT2));
                        
                        if (dInner < 0.001) {
                            innerHit = 1.0;
                            if (dC < min(dT1, dT2)) {
                                // Core glow: bright blue-purple core with white-hot center
                                innerColor = mix(vec3(0.05, 0.45, 1.0), vec3(0.65, 0.15, 0.95), sin(uTime * 0.7) * 0.5 + 0.5);
                                float distToCenter = length(ip);
                                innerColor += vec3(1.0, 1.0, 1.0) * (1.0 - smoothstep(0.0, 0.05, distToCenter)) * 0.75;
                            } else {
                                // Tori rings: glowing electric cyan-indigo
                                innerColor = mix(vec3(0.0, 0.65, 1.0), vec3(0.55, 0.05, 0.95), sin(ip.y * 12.0 + uTime * 1.5) * 0.5 + 0.5);
                            }
                            break;
                        }
                        tInside += dInner * 0.65;
                        if (tInside > 0.6) break;
                    }
                    
                    // Mix refraction, edge highlights and specular
                    color = innerColor * 0.8 + glassEdge + specHighlight;
                    
                    // Opacity computation: grazing edges (fresnel) and specular highlights are opaque.
                    // The core hit increases opacity. The empty body is highly transparent (0.08 opacity).
                    float glassAlpha = fresnel * 0.65 + spec1 * 0.95 + spec2 * 0.4 + (innerHit > 0.5 ? 0.65 : 0.08);
                    alpha = clamp(glassAlpha, 0.0, 1.0);
                }
                
                // Add soft volumetric glow to the pixel
                vec3 glowColor = mix(vec3(0.5, 0.1, 0.95), vec3(0.02, 0.45, 0.95), sin(uTime * 0.35) * 0.5 + 0.5);
                
                if (!hit) {
                    color = glowColor * glow * 0.5;
                    alpha = clamp(glow * 0.45, 0.0, 1.0);
                } else {
                    color += glowColor * glow * 0.35;
                    alpha = clamp(alpha + glow * 0.3, 0.0, 1.0);
                }
                
                // Edge canvas falloff to prevent clipping at canvas borders
                float edgeFalloff = smoothstep(0.48, 0.36, length(uv));
                color *= edgeFalloff;
                alpha *= edgeFalloff;
                
                // Tone mapping / Gamma correction
                color = pow(color, vec3(1.0 / 1.4));
                
                // Premultiplied alpha output for clean compositing with web browser layers
                gl_FragColor = vec4(color * alpha, alpha);
            }
        `;

        // Shader Compiler Helper
        const compileShader = (source: string, shaderType: number) => {
            const shader = gl.createShader(shaderType);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vs = compileShader(vsSource, gl.VERTEX_SHADER);
        const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return;

        // Link program
        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad geometry covering screen
        const vertices = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posAttr = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        // Uniforms locations
        const uResolution = gl.getUniformLocation(program, "uResolution");
        const uTime = gl.getUniformLocation(program, "uTime");

        let animationFrameId: number;
        const startTime = Date.now();

        // Render loop
        const render = () => {
            if (!canvasRef.current) return;

            // Handle resizing reactively with devicePixelRatio for Retina/HD displays
            const dpr = window.devicePixelRatio || 1;
            const width = Math.floor(canvas.clientWidth * dpr);
            const height = Math.floor(canvas.clientHeight * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }

            const elapsedSeconds = (Date.now() - startTime) / 1000.0;

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform1f(uTime, elapsedSeconds);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Cleanup WebGL resources
        return () => {
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buffer);
        };
    }, []);

    if (!hasWebGL) {
        // Fallback pulsing radial CSS gradient portal if WebGL is disabled or unavailable
        return (
            <div className={`relative flex items-center justify-center ${className}`}>
                <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-sky-500/20 via-purple-600/20 to-blue-500/20 blur-3xl animate-pulse" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-sky-400/30 animate-spin" style={{ animationDuration: "35s" }} />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: "50s", animationDirection: "reverse" }} />
            </div>
        );
    }

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Background Ambient Reflection Glow card */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[90px] pointer-events-none z-0 mix-blend-screen animate-pulse" />
            
            <canvas 
                ref={canvasRef} 
                className="w-full h-full relative z-10 block pointer-events-none"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
        </div>
    );
};
