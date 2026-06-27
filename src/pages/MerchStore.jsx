import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────── TOKENS ─────────────────────────── */
const C = {
  bg:       "#0C0C0D",
  surface:  "#111113",
  card:     "#141416",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,0,0.35)",
  yellow:   "#FFFF00",
  yellowDim:"rgba(255,255,0,0.6)",
  text:     "#FFFFFF",
  muted:    "rgba(255,255,255,0.38)",
  faint:    "rgba(255,255,255,0.1)",
};
const DISPLAY = "'Anton', 'Barlow', sans-serif";
const BODY    = "'Barlow', sans-serif";
const ease    = [0.22, 1, 0.36, 1];

/* ─────────────────────────── CATALOGUE ─────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "Core Tee",
    subtitle: "Heavyweight 280gsm",
    price: 1299,
    original: 1699,
    tag: "BESTSELLER",
    category: "apparel",
    color: "Pitch Black",
    colors: ["#0C0C0D","#1a1a1a","#FFFF00"],
    sizes: ["XS","S","M","L","XL","XXL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=90&fit=crop",
    featured: true,
    desc: "280gsm ring-spun cotton. Boxy silhouette. The tee you reach for the morning after shipping.",
  },
  {
    id: 2,
    name: "Build hoodie",
    subtitle: "French Terry 400gsm",
    price: 2499,
    original: null,
    tag: "NEW DROP",
    category: "apparel",
    color: "Void Grey",
    colors: ["#2a2a2c","#0C0C0D"],
    sizes: ["S","M","L","XL","XXL"],
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=90&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=90&fit=crop",
    featured: false,
    desc: "Double-lined hood. Kangaroo pocket deep enough for a MacBook. Ships in 3–5 days.",
  },
  {
    id: 3,
    name: "Hack Cap",
    subtitle: "6-panel structured",
    price: 899,
    original: null,
    tag: null,
    category: "accessories",
    color: "Black / Yellow",
    colors: ["#0C0C0D","#FFFF00"],
    sizes: ["ONE SIZE"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=90&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=90&fit=crop",
    featured: false,
    desc: "Embroidered HTC logo. Adjustable metal buckle. Curved brim for the low-key build session.",
  },
{
  id: 4,
  name: "Carry bag",
  subtitle: "20L daypack",
  price: 3299,
  original: 3999,
  tag: "LIMITED",
  category: "accessories",
  color: "Stealth",
  colors: ["#1a1a1a"],
  sizes: ["ONE SIZE"],
  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=90&fit=crop",
  imageAlt: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=90&fit=crop",
  featured: false,
  desc: 'Laptop sleeve fits 16". Magnetic top-load. Built for 48-hour hackathon survival.',
},
  {
    id: 5,
    name: "Stack mug",
    subtitle: "12oz ceramic",
    price: 599,
    original: null,
    tag: null,
    category: "gear",
    color: "Gloss Black",
    colors: ["#0C0C0D","#fff"],
    sizes: ["ONE SIZE"],
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=90&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1608133153246-de39d75f5843?w=800&q=90&fit=crop",
    featured: false,
    desc: "Microwave and dishwasher safe. Ships with a sticker pack. Caffeine interface included.",
  },
  {
    id: 6,
    name: "Sticker sheet",
    subtitle: "12 die-cut stickers",
    price: 199,
    original: null,
    tag: "FAN FAVE",
    category: "gear",
    color: "Multi",
    colors: ["#FFFF00","#fff","#0C0C0D"],
    sizes: ["ONE SIZE"],
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=90&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&q=90&fit=crop",
    featured: false,
    desc: "Waterproof vinyl. Laptop-tested, MacBook-approved. Includes 2 holographic exclusives.",
  },
];

const CATEGORIES = ["all", "apparel", "accessories", "gear"];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const fmt = n => `₹${n.toLocaleString("en-IN")}`;

/* ─────────────────────────── COMPONENTS ─────────────────────────── */

function TagPill({ label }) {
  const isNew = label === "NEW DROP";
  const isLtd = label === "LIMITED";
  return (
    <span style={{
      fontFamily: BODY, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
      textTransform: "uppercase", padding: "4px 10px", borderRadius: 4,
      background: isNew ? C.yellow : isLtd ? "rgba(255,80,80,0.15)" : "rgba(255,255,0,0.08)",
      color: isNew ? "#0C0C0D" : isLtd ? "rgba(255,100,100,0.9)" : C.yellowDim,
      border: isNew ? "none" : `1px solid ${isLtd ? "rgba(255,100,100,0.25)" : "rgba(255,255,0,0.2)"}`,
    }}>
      {label}
    </span>
  );
}

function ColorDot({ hex, active, onClick }) {
  return (
    <button onClick={onClick} type="button" style={{
      width: 16, height: 16, borderRadius: "50%", background: hex, border: "none",
      cursor: "pointer", outline: "none",
      boxShadow: active ? `0 0 0 2px ${C.bg}, 0 0 0 3.5px ${hex === "#FFFF00" ? C.yellow : "rgba(255,255,255,0.5)"}` : "none",
      transition: "box-shadow 0.15s",
    }} />
  );
}

function SizePill({ size, active, onClick, disabled }) {
  return (
    <button onClick={onClick} type="button" disabled={disabled} style={{
      fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "6px 12px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
      background: active ? C.yellow : "transparent",
      color: active ? "#0C0C0D" : disabled ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)",
      border: `1px solid ${active ? C.yellow : disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"}`,
      transition: "all 0.15s",
      textDecoration: disabled ? "line-through" : "none",
    }}>
      {size}
    </button>
  );
}

/* ── Product Card ── */
function ProductCard({ product, onAdd, featured }) {
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize && product.sizes.length > 1) return;
    setAdding(true);
    setTimeout(() => {
      onAdd(product, selectedSize || product.sizes[0]);
      setAdding(false);
    }, 420);
  };

  const needsSize = product.sizes.length > 1 && !selectedSize;

  if (featured) {
    return (
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          gridColumn: "1 / -1",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          border: `1px solid ${hovered ? C.borderHi : C.border}`,
          borderRadius: 20, overflow: "hidden",
          background: C.card, transition: "border-color 0.3s",
          cursor: "default",
        }}
      >
        {/* Image half */}
        <div style={{ position: "relative", overflow: "hidden", height: 520 }}>
          <motion.img
            src={hovered ? product.imageAlt : product.image}
            onLoad={() => setImgLoaded(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(20,20,22,0.8) 100%)" }} />
          {product.tag && (
            <div style={{ position: "absolute", top: 20, left: 20 }}>
              <TagPill label={product.tag} />
            </div>
          )}
        </div>

        {/* Info half */}
        <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          <p style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.yellowDim, margin: "0 0 14px" }}>
            Featured drop
          </p>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(3rem,5vw,5rem)", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.9, color: C.text, margin: "0 0 16px" }}>
            {product.name}
          </h2>
          <p style={{ fontFamily: BODY, fontSize: 13, color: C.muted, margin: "0 0 32px", lineHeight: 1.7, maxWidth: 340 }}>
            {product.desc}
          </p>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
            <span style={{ fontFamily: DISPLAY, fontSize: "2.2rem", color: C.yellow, letterSpacing: "-0.02em" }}>{fmt(product.price)}</span>
            {product.original && <span style={{ fontFamily: BODY, fontSize: 16, color: "rgba(255,255,255,0.22)", textDecoration: "line-through" }}>{fmt(product.original)}</span>}
          </div>

          {/* Colors */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
              Colour — {product.color}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {product.colors.map((c, i) => (
                <ColorDot key={i} hex={c} active={selectedColor === i} onClick={() => setSelectedColor(i)} />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
              Size {needsSize && <span style={{ color: "rgba(255,100,100,0.7)", marginLeft: 6 }}>— pick one</span>}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.sizes.map(s => (
                <SizePill key={s} size={s} active={selectedSize === s} onClick={() => setSelectedSize(s)} />
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              alignSelf: "flex-start",
              background: adding ? "rgba(255,255,0,0.5)" : needsSize ? "rgba(255,255,0,0.1)" : C.yellow,
              color: needsSize ? C.yellowDim : "#0C0C0D",
              border: `1px solid ${needsSize ? "rgba(255,255,0,0.2)" : C.yellow}`,
              borderRadius: 12, padding: "16px 36px",
              fontFamily: BODY, fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
              cursor: adding ? "not-allowed" : "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {adding ? "Added ✓" : needsSize ? "Select a size" : "Add to bag →"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease }}
      style={{
        border: `1px solid ${hovered ? C.borderHi : C.border}`,
        borderRadius: 18, overflow: "hidden",
        background: C.card, transition: "border-color 0.3s",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: 300, flexShrink: 0 }}>
        <motion.img
          src={hovered ? product.imageAlt : product.image}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,20,22,0.7) 0%, transparent 50%)" }} />
        {product.tag && (
          <div style={{ position: "absolute", top: 14, left: 14 }}>
            <TagPill label={product.tag} />
          </div>
        )}
        {product.original && (
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <span style={{ fontFamily: BODY, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(255,80,80,0.85)", color: "#fff", borderRadius: 4, padding: "3px 8px" }}>
              -{Math.round((1 - product.price / product.original) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", flex: 1, gap: 0 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontFamily: DISPLAY, fontSize: "1.7rem", textTransform: "uppercase", letterSpacing: "-0.01em", color: C.text, margin: "0 0 2px", lineHeight: 1 }}>
            {product.name}
          </h3>
          <p style={{ fontFamily: BODY, fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>{product.subtitle}</p>
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: "1.4rem", color: C.yellow, letterSpacing: "-0.01em" }}>{fmt(product.price)}</span>
          {product.original && <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.22)", textDecoration: "line-through" }}>{fmt(product.original)}</span>}
        </div>

        {/* Colors */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {product.colors.map((c, i) => (
            <ColorDot key={i} hex={c} active={selectedColor === i} onClick={() => setSelectedColor(i)} />
          ))}
        </div>

        {/* Sizes */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {product.sizes.map(s => (
            <SizePill key={s} size={s} active={selectedSize === s} onClick={() => setSelectedSize(s)} />
          ))}
        </div>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={handleAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: "auto",
            background: adding ? "rgba(255,255,0,0.5)" : needsSize ? "transparent" : C.yellow,
            color: needsSize ? C.yellowDim : "#0C0C0D",
            border: `1px solid ${needsSize ? "rgba(255,255,0,0.2)" : C.yellow}`,
            borderRadius: 10, padding: "13px 0", width: "100%",
            fontFamily: BODY, fontWeight: 900, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          {adding ? "Added ✓" : needsSize ? "Pick size first" : "Add to bag"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Cart Drawer ── */
function CartDrawer({ items, onClose, onRemove, onQty }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ duration: 0.45, ease }}
      style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "95vw",
        background: "#111113", borderLeft: `1px solid ${C.border}`,
        zIndex: 999, display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text, margin: "0 0 2px" }}>Your bag</h2>
          <p style={{ fontFamily: BODY, fontSize: 12, color: C.muted, margin: 0 }}>{items.reduce((s, i) => s + i.qty, 0)} item{items.reduce((s,i)=>s+i.qty,0)!==1?"s":""}</p>
        </div>
        <button onClick={onClose} type="button" style={{ background: "none", border: `1px solid ${C.faint}`, borderRadius: 8, color: C.muted, width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
        {items.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
            <span style={{ fontSize: 40 }}>🛍</span>
            <p style={{ fontFamily: BODY, fontSize: 14, color: C.muted, textAlign: "center" }}>Your bag is empty.<br />Go find something good.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, idx) => (
              <motion.div key={`${item.id}-${item.size}`} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ display: "flex", gap: 14, padding: "14px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}` }}>
                <img src={item.image} style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={item.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontFamily: DISPLAY, fontSize: "1rem", textTransform: "uppercase", color: C.text, margin: 0, letterSpacing: "-0.01em" }}>{item.name}</p>
                    <button onClick={() => onRemove(item.id, item.size)} type="button" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
                  </div>
                  <p style={{ fontFamily: BODY, fontSize: 11, color: C.muted, margin: "0 0 10px" }}>Size: {item.size}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${C.faint}`, borderRadius: 7, overflow: "hidden" }}>
                      {[-1,1].map(d => (
                        <button key={d} onClick={() => onQty(item.id, item.size, d)} type="button" style={{ background: "none", border: "none", color: C.muted, width: 30, height: 28, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{d === -1 ? "−" : "+"}</button>
                      ))}
                      <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: C.text, padding: "0 10px", borderLeft: `1px solid ${C.faint}`, borderRight: `1px solid ${C.faint}`, height: 28, display: "flex", alignItems: "center" }}>{item.qty}</span>
                    </div>
                    <span style={{ fontFamily: DISPLAY, fontSize: "1rem", color: C.yellow, letterSpacing: "-0.01em" }}>{fmt(item.price * item.qty)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div style={{ padding: "24px 28px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>Subtotal</span>
            <span style={{ fontFamily: DISPLAY, fontSize: "1.8rem", color: C.text, letterSpacing: "-0.02em" }}>{fmt(total)}</span>
          </div>
          <p style={{ fontFamily: BODY, fontSize: 11, color: C.muted, marginBottom: 20 }}>Shipping calculated at checkout. Free over ₹2,999.</p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ width: "100%", background: C.yellow, color: "#0C0C0D", border: "none", borderRadius: 12, padding: "18px 0", fontFamily: BODY, fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Checkout →
          </motion.button>
          <button type="button" onClick={onClose} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: C.muted, fontFamily: BODY, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: "8px 0" }}>
            Continue shopping
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */
export default function MerchStore() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const filtered = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
  const featured = filtered.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const addToCart = (product, size) => {
    setCart(prev => {
      const key = `${product.id}-${size}`;
      const exists = prev.find(i => `${i.id}-${i.size}` === key);
      const next = exists
        ? prev.map(i => `${i.id}-${i.size}` === key ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, size, qty: 1 }];
      return next;
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  };

  const adjustQty = (id, size, delta) => {
    setCart(prev =>
      prev
        .map(i => i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* prevent body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        ::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes cartPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(12,12,13,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        padding: "0 5vw", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: "1.15rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: C.text }}>HackTheCore</span>
          <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.yellowDim, background: "rgba(255,255,0,0.07)", border: `1px solid rgba(255,255,0,0.2)`, borderRadius: 99, padding: "3px 10px" }}>Merch</span>
        </div>

        {/* Cart button */}
        <motion.button
          type="button"
          onClick={() => setCartOpen(true)}
          whileHover={{ borderColor: C.borderHi }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: cartCount > 0 ? "rgba(255,255,0,0.07)" : "none",
            border: `1px solid ${cartCount > 0 ? "rgba(255,255,0,0.25)" : C.faint}`,
            borderRadius: 10, padding: "8px 16px", cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted }}>Bag</span>
          {cartCount > 0 && (
            <span style={{
              fontFamily: DISPLAY, fontSize: "0.95rem", color: "#0C0C0D",
              background: C.yellow, borderRadius: 6, width: 24, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: cartBounce ? "cartPop 0.5s ease" : "none",
            }}>
              {cartCount}
            </span>
          )}
        </motion.button>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <div ref={heroRef} style={{ position: "relative", height: "88vh", minHeight: 520, overflow: "hidden" }}>
        <motion.div
          style={{
            position: "absolute", inset: 0, y: heroY,
            backgroundImage: `url(https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1800&q=85&fit=crop)`,
            backgroundSize: "cover", backgroundPosition: "center 30%",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(12,12,13,0.3) 0%, rgba(12,12,13,0.75) 55%, rgba(12,12,13,0.97) 100%)" }} />

        <motion.div
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 5vw 80px", opacity: heroOpacity }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease }}
            style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.yellowDim, margin: "0 0 20px" }}
          >
            SS26 Drop — Limited run
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease }}
            style={{ fontFamily: DISPLAY, fontSize: "clamp(4.5rem, 13vw, 11rem)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.87, color: C.text, margin: "0 0 28px" }}
          >
            Wear the<br /><span style={{ color: C.yellow }}>build.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease }}
            style={{ display: "flex", alignItems: "center", gap: 24 }}
          >
            <span style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.4)", letterSpacing: "0.01em" }}>6 drops · Free shipping over ₹2,999 · Ships in 3–5 days</span>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.5 }}
          style={{ position: "absolute", bottom: 28, right: "5vw", display: "flex", alignItems: "center", gap: 10 }}
        >
          <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Scroll</span>
          <div style={{ width: 20, height: 32, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5px 0" }}>
            <motion.div style={{ width: 3, height: 7, background: "rgba(255,255,255,0.3)", borderRadius: 99 }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </div>

      {/* ══════════════════ MARQUEE STRIP ══════════════════ */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: "hidden", height: 44, display: "flex", alignItems: "center", background: C.surface }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
        >
          {Array(6).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", padding: "0 36px" }}>
              HackTheCore Merch &nbsp;·&nbsp; Free shipping over ₹2,999 &nbsp;·&nbsp; Limited drops &nbsp;·&nbsp; Ships India-wide &nbsp;·&nbsp; SS26 collection &nbsp;·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════ SHOP BODY ══════════════════ */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 5vw 120px" }}>

        {/* ── Filter bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 52 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "8px 20px", borderRadius: 8, cursor: "pointer", transition: "all 0.18s",
                  background: activeCategory === cat ? C.yellow : "transparent",
                  color: activeCategory === cat ? "#0C0C0D" : C.muted,
                  border: `1px solid ${activeCategory === cat ? C.yellow : "rgba(255,255,255,0.12)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: BODY, fontSize: 12, color: C.muted, letterSpacing: "0.06em" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Featured card (full width) ── */}
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div key={`featured-${activeCategory}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 24 }}>
              <ProductCard product={featured} onAdd={addToCart} featured={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}
          >
            {rest.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.07, ease }}>
                <ProductCard product={product} onAdd={addToCart} featured={false} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "2rem", textTransform: "uppercase", color: "rgba(255,255,255,0.1)", letterSpacing: "-0.02em" }}>Nothing here yet</p>
          </div>
        )}
      </div>

      {/* ══════════════════ FOOTER STRIP ══════════════════ */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "48px 5vw", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28 }}>
        {[
          { icon: "🚚", head: "Free shipping", body: "On all orders above ₹2,999. Pan-India delivery." },
          { icon: "↩", head: "Easy returns", body: "7-day return window on unworn items with tags." },
          { icon: "🔒", head: "Secure checkout", body: "UPI, cards, wallets — all encrypted end-to-end." },
          { icon: "📦", head: "Ships in 3–5 days", body: "Orders before 12 PM ship same business day." },
        ].map(({ icon, head, body }) => (
          <div key={head} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</span>
            <div>
              <p style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text, margin: "0 0 5px" }}>{head}</p>
              <p style={{ fontFamily: BODY, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: BODY, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}>© 2026 HackTheCore</span>
        <span style={{ fontFamily: DISPLAY, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.01em", color: "rgba(255,255,255,0.06)" }}>wear the build.</span>
      </div>

      {/* ══════════════════ CART OVERLAY ══════════════════ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998, backdropFilter: "blur(4px)" }}
            />
            <CartDrawer
              key="drawer"
              items={cart}
              onClose={() => setCartOpen(false)}
              onRemove={removeFromCart}
              onQty={adjustQty}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}