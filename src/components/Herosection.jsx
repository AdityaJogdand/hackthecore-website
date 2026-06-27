import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ─── constants ──────────────────────────────────────────────────────────── */

const CYCLE_WORDS = ["BUILDERS", "HACKERS", "FOUNDERS", "MAKERS", "INNOVATORS"];

const MARQUEE_ITEMS = [
  "Hackathons", "✦", "Open Source", "✦", "Side Projects", "✦",
  "AI / ML", "✦", "Community", "✦", "Product Design", "✦",
  "Web3", "✦", "Deep Tech", "✦",
];

const STATS = [
  { value: "2,400+", label: "Community members" },
  { value: "18",     label: "Hackathons hosted" },
  { value: "₹12L+",  label: "Prizes awarded" },
];

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg:        "#FAFAF8",
  ink:       "#111110",
  inkMid:    "#555553",
  inkFaint:  "#ABABAA",
  yellow:    "#E8D20A",
  yellowBg:  "#F4DD0E",
  rule:      "#DDDDD9",
};

/* ─── cycling word ───────────────────────────────────────────────────────── */
function CycleWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % CYCLE_WORDS.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={i}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%",   opacity: 1 }}
        exit={{    y: "-110%", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: "block" }}
      >
        {CYCLE_WORDS[i]}
      </motion.span>
    </AnimatePresence>
  );
}

/* ─── 3D Node Network Globe ──────────────────────────────────────────────── */
function NodeNetwork() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* scene / camera */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    /* ── geometry: fibonacci-sphere node positions ── */
    const NODE_COUNT = 88;
    const RADIUS = 2.0;

    const positions = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions.push(
        new THREE.Vector3(
          Math.cos(theta) * r * RADIUS,
          y * RADIUS,
          Math.sin(theta) * r * RADIUS
        )
      );
    }

    /* ── edges: connect nodes within distance threshold ── */
    const EDGE_THRESHOLD = 1.18;
    const edgePoints = [];
    for (let a = 0; a < NODE_COUNT; a++) {
      for (let b = a + 1; b < NODE_COUNT; b++) {
        if (positions[a].distanceTo(positions[b]) < EDGE_THRESHOLD) {
          edgePoints.push(positions[a].clone(), positions[b].clone());
        }
      }
    }

    /* edge lines */
    const lineGeo = new THREE.BufferGeometry().setFromPoints(edgePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xDDDDD9,
      transparent: true,
      opacity: 0.55,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    /* node dots — two sizes for depth */
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(NODE_COUNT * 3);
    positions.forEach((p, i) => {
      dotPositions[i * 3]     = p.x;
      dotPositions[i * 3 + 1] = p.y;
      dotPositions[i * 3 + 2] = p.z;
    });
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));

    const dotMat = new THREE.PointsMaterial({
      color: 0x111110,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    /* accent: a handful of yellow "hot" nodes */
    const HOT_INDICES = [0, 7, 14, 23, 38, 51, 64, 77];
    const hotPositions = new Float32Array(HOT_INDICES.length * 3);
    HOT_INDICES.forEach((idx, i) => {
      hotPositions[i * 3]     = positions[idx].x;
      hotPositions[i * 3 + 1] = positions[idx].y;
      hotPositions[i * 3 + 2] = positions[idx].z;
    });
    const hotGeo = new THREE.BufferGeometry();
    hotGeo.setAttribute("position", new THREE.BufferAttribute(hotPositions, 3));
    const hotMat = new THREE.PointsMaterial({
      color: 0xF4DD0E,
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1.0,
    });
    const hotDots = new THREE.Points(hotGeo, hotMat);
    scene.add(hotDots);

    /* group everything for unified rotation */
    const group = new THREE.Group();
    group.add(lines, dots, hotDots);
    scene.add(group);

    /* mouse parallax */
    const onMouse = (e) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    /* animate */
    const clock = new THREE.Clock();
    const BASE_SPEED = 0.08; // rad/s, slow and dignified

    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      /* base rotation */
      group.rotation.y = t * BASE_SPEED;
      group.rotation.x = Math.sin(t * 0.04) * 0.15;

      /* mouse parallax — gentle lean */
      group.rotation.y += mouseRef.current.x * 0.06;
      group.rotation.x += mouseRef.current.y * 0.04;

      /* breathing scale */
      const breath = 1 + Math.sin(t * 0.5) * 0.012;
      group.scale.setScalar(breath);

      renderer.render(scene, camera);
    };
    tick();

    /* resize */
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const { scrollY } = useScroll();
  const pillY = useTransform(scrollY, [0, 600], [0, -30]);

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        marginTop: "30px",
      }}
    >
      {/* ── 3D background ── */}
      <NodeNetwork />

      {/* ── vignette so globe fades at edges ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 70% at 50% 48%, transparent 38%, ${C.bg} 78%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ══════════════════ HERO CONTENT ══════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem)",
          minHeight: 0,
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* eyebrow */}
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            width: "100%",
            maxWidth: 680,
          }}
        >
          <div style={{ flex: 1, height: 1, background: C.rule }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "0.68rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.inkFaint,
              whiteSpace: "nowrap",
            }}
          >
            Community · Hackathons · Builders
          </span>
          <div style={{ flex: 1, height: 1, background: C.rule }} />
        </motion.div>

        {/* headline */}
        <h1
          style={{
            fontFamily: "'SansPlomb', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(3.4rem, 10.5vw, 11rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            color: C.ink,
            margin: 0,
            marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            overflow: "hidden",
          }}
        >
          <motion.span
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
            style={{ display: "block", lineHeight: 1.1 }}
          >
            BUILT FOR
          </motion.span>

          <motion.span
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.38 }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.25em" }}
          >
            <span>THE</span>
            <motion.span style={{ y: pillY, display: "inline-block", position: "relative" }}>
              <span
                style={{
                  display: "inline-block",
                  background: C.yellowBg,
                  color: C.ink,
                  padding: "0.04em 0.22em 0.08em",
                  borderRadius: "0.12em",
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  position: "relative",
                  boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,0.06)`,
                }}
              >
                BEST
              </span>
            </motion.span>
          </motion.span>

          <motion.span
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
            style={{ display: "block", overflow: "hidden", height: "1.08em" }}
          >
            <CycleWord />
          </motion.span>
        </h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
            color: C.inkMid,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "clamp(1rem, 2vw, 1.5rem) 0 0",
          }}
        >
          India's most ambitious builder community. Ship products, win hackathons,
          and grow with the best minds in tech.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.ink,
              color: C.bg,
              border: "none",
              padding: "0.85em 1.8em",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.6em",
              borderRadius: 2,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#333"}
            onMouseLeave={e => e.currentTarget.style.background = C.ink}
          >
            Join Community
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: C.ink,
              border: `1.5px solid ${C.rule}`,
              padding: "0.85em 1.8em",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.6em",
              borderRadius: 2,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.ink}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.rule}
          >
            Explore Events
          </motion.button>
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          style={{
            display: "flex",
            gap: "clamp(2rem, 5vw, 4rem)",
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {STATS.map(s => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  color: C.ink,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.inkFaint,
                  marginTop: "0.35em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════ MARQUEE ══════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{
          borderTop: `1px solid ${C.rule}`,
          padding: "0.9rem 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
        }}
      >
        {["left", "right"].map(side => (
          <div
            key={side}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              [side]: 0,
              width: 80,
              background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${C.bg}, transparent)`,
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        ))}

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "2rem", width: "max-content", willChange: "transform" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: item === "✦" ? "serif" : "'Inter', sans-serif",
                fontWeight: item === "✦" ? 400 : 500,
                fontSize: item === "✦" ? "0.55rem" : "0.62rem",
                letterSpacing: item === "✦" ? 0 : "0.2em",
                textTransform: "uppercase",
                color: item === "✦" ? C.yellow : C.inkMid,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}