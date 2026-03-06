import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// SUPABASE CLIENT — connects to your real database
// ============================================================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ============================================================
// DESIGN SYSTEM — Deep Navy + Electric Amber, Editorial luxury
// ============================================================
const COLORS = {
  navy: "#0A0F1E",
  navyMid: "#111827",
  navyLight: "#1E2A3B",
  slate: "#2D3A4A",
  amber: "#F59E0B",
  amberLight: "#FCD34D",
  amberDark: "#D97706",
  white: "#FFFFFF",
  offWhite: "#F8F9FB",
  gray100: "#F3F4F6",
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray600: "#4B5563",
  green: "#10B981",
  red: "#EF4444",
  purple: "#8B5CF6",
};

// ============================================================
// DATA
// ============================================================
const CATEGORIES = ["All", "MacBooks", "iPhones", "Accessories", "Audio", "Gaming", "Wearables"];

const PRODUCTS = [
  { id: 1, name: "MacBook Pro 16\"", category: "MacBooks", price: 2499, originalPrice: 2799, rating: 4.9, reviews: 312, stock: 8, badge: "Bestseller", image: "💻", description: "M3 Max chip, 36GB RAM, 1TB SSD. The ultimate pro laptop for creatives and developers.", specs: ["M3 Max Chip", "36GB Unified Memory", "1TB SSD", "16-inch Liquid Retina XDR"] },
  { id: 2, name: "iPhone 15 Pro Max", category: "iPhones", price: 1199, originalPrice: 1299, rating: 4.8, reviews: 892, stock: 24, badge: "New", image: "📱", description: "Titanium design, A17 Pro chip, 48MP camera system with 5x telephoto.", specs: ["A17 Pro Chip", "48MP Camera System", "Titanium Frame", "USB-C with USB 3"] },
  { id: 3, name: "AirPods Pro 2nd Gen", category: "Audio", price: 249, originalPrice: 279, rating: 4.7, reviews: 1204, stock: 45, badge: "Sale", image: "🎧", description: "Active Noise Cancellation, Adaptive Audio, and up to 30 hours total battery life.", specs: ["Active Noise Cancellation", "Adaptive Transparency", "H2 Chip", "MagSafe Charging Case"] },
  { id: 4, name: "Apple Watch Ultra 2", category: "Wearables", price: 799, originalPrice: 799, rating: 4.9, reviews: 445, stock: 12, badge: "Premium", image: "⌚", description: "Most rugged and capable Apple Watch. Built for endurance athletes and adventurers.", specs: ["49mm Titanium Case", "S9 SiP", "Action Button", "2000 nits brightness"] },
  { id: 5, name: "iPad Pro 12.9\"", category: "Accessories", price: 1099, originalPrice: 1199, rating: 4.8, reviews: 267, stock: 18, badge: "Popular", image: "🖥️", description: "M2 chip, Liquid Retina XDR display, Thunderbolt connectivity.", specs: ["M2 Chip", "12.9-inch Liquid Retina XDR", "Thunderbolt / USB 4", "Face ID"] },
  { id: 6, name: "Sony WH-1000XM5", category: "Audio", price: 349, originalPrice: 399, rating: 4.8, reviews: 678, stock: 30, badge: "Top Rated", image: "🎵", description: "Industry-leading noise cancellation with 30-hour battery and crystal clear calls.", specs: ["Industry-leading ANC", "30-hour battery", "Multipoint connection", "Hi-Res Audio"] },
  { id: 7, name: "PlayStation 5", category: "Gaming", price: 499, originalPrice: 499, rating: 4.9, reviews: 2103, stock: 5, badge: "Limited", image: "🎮", description: "Experience lightning-fast loading, haptic feedback, adaptive triggers and 3D Audio.", specs: ["Custom AMD CPU/GPU", "16GB GDDR6 RAM", "825GB Custom SSD", "4K 120fps support"] },
  { id: 8, name: "MacBook Air M2", category: "MacBooks", price: 1099, originalPrice: 1199, rating: 4.7, reviews: 891, stock: 22, badge: "Value Pick", image: "💻", description: "Supercharged by M2. Up to 18 hours battery. Fanless and utterly silent.", specs: ["M2 Chip", "8GB Unified Memory", "256GB SSD", "13.6-inch Liquid Retina"] },
  { id: 9, name: "Samsung Galaxy S24 Ultra", category: "iPhones", price: 1299, originalPrice: 1399, rating: 4.7, reviews: 543, stock: 16, badge: "Hot", image: "📲", description: "Built-in S Pen, 200MP camera, titanium frame, AI-powered Galaxy experience.", specs: ["Snapdragon 8 Gen 3", "200MP Camera", "Built-in S Pen", "6.8-inch Dynamic AMOLED"] },
  { id: 10, name: "Dell XPS 15", category: "MacBooks", price: 1799, originalPrice: 1999, rating: 4.6, reviews: 334, stock: 9, badge: "Sale", image: "🖱️", description: "Intel Core i9, NVIDIA RTX 4070, 15.6\" OLED touch display.", specs: ["Intel Core i9-13900H", "NVIDIA RTX 4070", "32GB DDR5 RAM", "15.6\" OLED Touch"] },
  { id: 11, name: "Meta Quest 3", category: "Gaming", price: 499, originalPrice: 549, rating: 4.6, reviews: 765, stock: 20, badge: "New", image: "🥽", description: "Mixed reality headset with breakthrough Meta Reality technology.", specs: ["Snapdragon XR2 Gen 2", "128GB Storage", "Mixed Reality", "Pancake Lenses"] },
  { id: 12, name: "Apple Magic Keyboard", category: "Accessories", price: 179, originalPrice: 179, rating: 4.7, reviews: 445, stock: 55, badge: null, image: "⌨️", description: "Wireless, rechargeable keyboard with Touch ID and numeric keypad.", specs: ["Touch ID", "Wireless Bluetooth", "USB-C Charging", "Compatible with Mac"] },
];

const ORDERS = [
  { id: "ORD-2024-001", date: "Jan 15, 2024", status: "Delivered", total: 2749, items: 2 },
  { id: "ORD-2024-002", date: "Feb 3, 2024", status: "Shipped", total: 499, items: 1 },
  { id: "ORD-2024-003", date: "Mar 10, 2024", status: "Processing", total: 1448, items: 3 },
];

// ============================================================
// UTILITY HOOKS
// ============================================================
function useLocalState(key, initial) {
  const [val, setVal] = useState(initial);
  return [val, setVal];
}

// ============================================================
// MICRO COMPONENTS
// ============================================================
const Stars = ({ rating }) => {
  return (
    <span style={{ color: COLORS.amber, fontSize: "13px", letterSpacing: "1px" }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
};

const Badge = ({ text }) => {
  if (!text) return null;
  const badgeColors = {
    "New": { bg: "#10B981", color: "#fff" },
    "Sale": { bg: COLORS.red, color: "#fff" },
    "Bestseller": { bg: COLORS.amber, color: COLORS.navy },
    "Limited": { bg: "#8B5CF6", color: "#fff" },
    "Hot": { bg: "#EF4444", color: "#fff" },
    "Premium": { bg: "#1E2A3B", color: COLORS.amber },
    "Popular": { bg: "#3B82F6", color: "#fff" },
    "Top Rated": { bg: "#059669", color: "#fff" },
    "Value Pick": { bg: "#6366F1", color: "#fff" },
  };
  const style = badgeColors[text] || { bg: COLORS.slate, color: "#fff" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
      padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase",
    }}>{text}</span>
  );
};

const Btn = ({ children, variant = "primary", onClick, style: s = {}, disabled = false, size = "md" }) => {
  const [hov, setHov] = useState(false);
  const base = {
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: "8px", fontWeight: 600,
    transition: "all 0.2s ease", display: "inline-flex",
    alignItems: "center", justifyContent: "center", gap: "6px",
    opacity: disabled ? 0.5 : 1,
    fontSize: size === "sm" ? "13px" : size === "lg" ? "16px" : "14px",
    padding: size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
  };
  const variants = {
    primary: { background: hov ? COLORS.amberDark : COLORS.amber, color: COLORS.navy },
    secondary: { background: hov ? COLORS.navyLight : COLORS.navyMid, color: COLORS.white, border: `1px solid ${COLORS.slate}` },
    ghost: { background: hov ? "rgba(255,255,255,0.08)" : "transparent", color: COLORS.gray300 },
    danger: { background: hov ? "#DC2626" : COLORS.red, color: "#fff" },
    outline: { background: "transparent", color: COLORS.amber, border: `1px solid ${COLORS.amber}`, ...(hov ? { background: "rgba(245,158,11,0.1)" } : {}) },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant], ...s }}
    >{children}</button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, style: s = {} }) => (
  <div style={{ marginBottom: "16px" }}>
    {label && <label style={{ display: "block", color: COLORS.gray300, fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>{label}</label>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: COLORS.navyLight, border: `1px solid ${COLORS.slate}`,
        borderRadius: "8px", padding: "10px 14px", color: COLORS.white,
        fontSize: "14px", outline: "none", boxSizing: "border-box",
        transition: "border-color 0.2s", ...s
      }}
      onFocus={e => e.target.style.borderColor = COLORS.amber}
      onBlur={e => e.target.style.borderColor = COLORS.slate}
    />
  </div>
);

const Toast = ({ message, type = "success", onClose }) => (
  <div style={{
    position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
    background: type === "success" ? COLORS.green : COLORS.red,
    color: "#fff", padding: "12px 20px", borderRadius: "10px",
    fontSize: "14px", fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", gap: "10px",
    animation: "slideIn 0.3s ease",
  }}>
    {type === "success" ? "✓" : "✕"} {message}
    <span onClick={onClose} style={{ cursor: "pointer", marginLeft: "8px", opacity: 0.7 }}>×</span>
  </div>
);

// ============================================================
// PRODUCT CARD
// ============================================================
const ProductCard = ({ product, onAddToCart, onWishlist, wishlist, onNavigate }) => {
  const [hov, setHov] = useState(false);
  const isWished = wishlist.includes(product.id);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? COLORS.navyLight : COLORS.navyMid,
        borderRadius: "16px", overflow: "hidden",
        border: `1px solid ${hov ? COLORS.amber + "44" : COLORS.slate}`,
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 40px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "pointer", display: "flex", flexDirection: "column",
      }}
    >
      {/* Image Area */}
      <div
        onClick={() => onNavigate("product", product)}
        style={{
          height: "200px", display: "flex", alignItems: "center", justifyContent: "center",
          background: `radial-gradient(circle at 50% 50%, ${COLORS.navyLight} 0%, ${COLORS.navy} 100%)`,
          fontSize: "72px", position: "relative",
          borderBottom: `1px solid ${COLORS.slate}`,
        }}
      >
        <span style={{ filter: hov ? "drop-shadow(0 0 20px rgba(245,158,11,0.3))" : "none", transition: "filter 0.3s" }}>
          {product.image}
        </span>
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Badge text={product.badge} />
          {discount > 0 && (
            <span style={{ background: COLORS.red, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>
              -{discount}%
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
            width: "34px", height: "34px", cursor: "pointer", fontSize: "16px",
            transition: "transform 0.2s",
          }}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ color: COLORS.gray500, fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
          {product.category}
        </div>
        <div
          onClick={() => onNavigate("product", product)}
          style={{ color: COLORS.white, fontWeight: 600, fontSize: "15px", marginBottom: "8px", lineHeight: "1.4" }}
        >
          {product.name}
        </div>
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Stars rating={product.rating} />
          <span style={{ color: COLORS.gray500, fontSize: "12px" }}>({product.reviews.toLocaleString()})</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          <div>
            <span style={{ color: COLORS.amber, fontWeight: 700, fontSize: "20px" }}>${product.price.toLocaleString()}</span>
            {discount > 0 && (
              <span style={{ color: COLORS.gray500, fontSize: "13px", textDecoration: "line-through", marginLeft: "8px" }}>
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span style={{ color: product.stock < 10 ? COLORS.red : COLORS.green, fontSize: "11px", fontWeight: 600 }}>
            {product.stock < 10 ? `Only ${product.stock} left` : "In Stock"}
          </span>
        </div>
        <Btn
          onClick={() => onAddToCart(product)}
          style={{ marginTop: "12px", width: "100%" }}
        >
          + Add to Cart
        </Btn>
      </div>
    </div>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const Nav = ({ page, onNavigate, cartCount, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { id: "home", label: "Home" }, { id: "products", label: "Products" },
    { id: "about", label: "About" }, { id: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.slate}`,
      position: "sticky", top: 0, zIndex: 1000,
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "32px", height: "32px", background: COLORS.amber,
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 900, color: COLORS.navy,
          }}>N</div>
          <span style={{ color: COLORS.white, fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" }}>
            NexStore<span style={{ color: COLORS.amber }}>.</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "4px" }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: page === link.id ? COLORS.amber : COLORS.gray300,
                fontWeight: page === link.id ? 600 : 400,
                padding: "6px 14px", borderRadius: "6px", fontSize: "14px",
                transition: "all 0.2s",
                borderBottom: page === link.id ? `2px solid ${COLORS.amber}` : "2px solid transparent",
              }}
            >{link.label}</button>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {searchOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { onNavigate("products", { search: searchQuery }); setSearchOpen(false); } }}
                placeholder="Search products..."
                style={{
                  background: COLORS.navyLight, border: `1px solid ${COLORS.amber}`,
                  borderRadius: "8px", padding: "8px 14px", color: COLORS.white,
                  fontSize: "14px", outline: "none", width: "200px",
                }}
              />
              <Btn variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>✕</Btn>
            </div>
          ) : (
            <Btn variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>🔍</Btn>
          )}
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("wishlist")}>♡</Btn>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("cart")} style={{ position: "relative" }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                background: COLORS.amber, color: COLORS.navy,
                borderRadius: "50%", width: "18px", height: "18px",
                fontSize: "10px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount}</span>
            )}
          </Btn>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: COLORS.amber, color: COLORS.navy,
                  border: "none", borderRadius: "50%", width: "34px", height: "34px",
                  cursor: "pointer", fontWeight: 700, fontSize: "14px",
                }}
              >{user.name[0].toUpperCase()}</button>
              {menuOpen && (
                <div style={{
                  position: "absolute", top: "44px", right: 0, minWidth: "180px",
                  background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`,
                  borderRadius: "12px", padding: "8px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ padding: "8px 12px", color: COLORS.gray500, fontSize: "12px" }}>
                    Signed in as <strong style={{ color: COLORS.white }}>{user.name}</strong>
                  </div>
                  <hr style={{ border: `0.5px solid ${COLORS.slate}`, margin: "4px 0" }} />
                  {[["dashboard", "Dashboard"], ["orders", "My Orders"]].map(([id, label]) => (
                    <button key={id} onClick={() => { onNavigate(id); setMenuOpen(false); }}
                      style={{
                        width: "100%", background: "none", border: "none", color: COLORS.gray300,
                        padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px",
                        fontSize: "14px", display: "block",
                      }}
                    >{label}</button>
                  ))}
                  {user.isAdmin && (
                    <button onClick={() => { onNavigate("admin"); setMenuOpen(false); }}
                      style={{
                        width: "100%", background: "none", border: "none", color: COLORS.amber,
                        padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px",
                        fontSize: "14px", fontWeight: 600,
                      }}
                    >⚙️ Admin Panel</button>
                  )}
                  <hr style={{ border: `0.5px solid ${COLORS.slate}`, margin: "4px 0" }} />
                  <button onClick={() => { onLogout(); setMenuOpen(false); }}
                    style={{
                      width: "100%", background: "none", border: "none", color: COLORS.red,
                      padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px", fontSize: "14px",
                    }}
                  >Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Btn size="sm" onClick={() => onNavigate("login")}>Sign In</Btn>
          )}
        </div>
      </div>
    </nav>
  );
};

// ============================================================
// PAGES
// ============================================================

// HOME PAGE
const HomePage = ({ onNavigate, onAddToCart, wishlist, onWishlist }) => {
  const featured = PRODUCTS.slice(0, 4);
  const stats = [
    { label: "Products", value: "10K+" }, { label: "Customers", value: "500K+" },
    { label: "Countries", value: "120+" }, { label: "5-Star Reviews", value: "98K+" },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `radial-gradient(ellipse at 30% 50%, ${COLORS.navyLight} 0%, ${COLORS.navy} 60%)`,
        minHeight: "88vh", display: "flex", alignItems: "center",
        padding: "80px 24px", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        {[400, 600, 800].map((s, i) => (
          <div key={i} style={{
            position: "absolute", right: `${-s / 3 + 100}px`, top: "50%",
            transform: "translateY(-50%)",
            width: `${s}px`, height: `${s}px`, borderRadius: "50%",
            border: `1px solid rgba(245,158,11,${0.08 - i * 0.02})`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
          <div style={{ maxWidth: "560px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`,
              borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: COLORS.amber, display: "inline-block" }} />
              <span style={{ color: COLORS.amber, fontSize: "13px", fontWeight: 600 }}>Free shipping on orders over $99</span>
            </div>
            <h1 style={{
              color: COLORS.white, fontSize: "clamp(42px, 5vw, 72px)",
              fontWeight: 800, lineHeight: 1.1, marginBottom: "24px",
              letterSpacing: "-2px",
            }}>
              The Future of<br />
              <span style={{ color: COLORS.amber }}>Tech Shopping</span><br />
              Starts Here.
            </h1>
            <p style={{ color: COLORS.gray300, fontSize: "18px", lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
              Discover the world's most coveted technology. Curated products, unbeatable prices, and next-day delivery.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Btn size="lg" onClick={() => onNavigate("products")}>Shop Now →</Btn>
              <Btn size="lg" variant="outline" onClick={() => onNavigate("about")}>Our Story</Btn>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: "32px", marginTop: "56px", flexWrap: "wrap" }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ color: COLORS.amber, fontWeight: 800, fontSize: "22px" }}>{s.value}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero product showcase */}
          <div style={{ position: "relative", fontSize: "180px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "300px" }}>
            <div style={{
              width: "320px", height: "320px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              💻
            </div>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div style={{ background: COLORS.navyMid, borderTop: `1px solid ${COLORS.slate}`, borderBottom: `1px solid ${COLORS.slate}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto" }}>
          {CATEGORIES.filter(c => c !== "All").map(cat => (
            <button key={cat} onClick={() => onNavigate("products", { category: cat })}
              style={{
                background: "none", border: "none", color: COLORS.gray300, padding: "16px 20px",
                cursor: "pointer", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap",
                borderBottom: "2px solid transparent", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.color = COLORS.amber; e.target.style.borderBottomColor = COLORS.amber; }}
              onMouseLeave={e => { e.target.style.color = COLORS.gray300; e.target.style.borderBottomColor = "transparent"; }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <div style={{ color: COLORS.amber, fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
              Curated for You
            </div>
            <h2 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
              Featured Products
            </h2>
          </div>
          <Btn variant="outline" onClick={() => onNavigate("products")}>View All →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div style={{ background: COLORS.amber, padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ color: COLORS.navy, fontSize: "36px", fontWeight: 800, marginBottom: "12px" }}>
            Summer Sale — Up to 40% Off
          </h2>
          <p style={{ color: COLORS.navyMid, marginBottom: "24px", fontSize: "16px" }}>
            Limited time offer on top tech. Use code <strong>SUMMER40</strong> at checkout.
          </p>
          <Btn variant="secondary" size="lg" onClick={() => onNavigate("products")}>Claim Offer</Btn>
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{ background: COLORS.navyMid, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On all orders over $99" },
            { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption" },
            { icon: "↩️", title: "30-Day Returns", desc: "Hassle-free returns policy" },
            { icon: "💬", title: "24/7 Support", desc: "Expert help anytime" },
          ].map(t => (
            <div key={t.title} style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{t.icon}</div>
              <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "4px" }}>{t.title}</div>
              <div style={{ color: COLORS.gray500, fontSize: "13px" }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// PRODUCTS PAGE
const ProductsPage = ({ onAddToCart, wishlist, onWishlist, onNavigate, initCategory = "All", initSearch = "" }) => {
  const [category, setCategory] = useState(initCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [search, setSearch] = useState(initSearch);

  const filtered = PRODUCTS
    .filter(p => category === "All" || p.category === category)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: COLORS.white, fontSize: "40px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-1.5px" }}>
        All Products
      </h1>
      <p style={{ color: COLORS.gray500, marginBottom: "32px" }}>
        {filtered.length} of {PRODUCTS.length} products
      </p>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }}>
          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "14px" }}>🔍 Search</div>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                width: "100%", background: COLORS.navyLight, border: `1px solid ${COLORS.slate}`,
                borderRadius: "8px", padding: "8px 12px", color: COLORS.white,
                fontSize: "13px", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "14px" }}>📦 Category</div>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                  color: category === cat ? COLORS.amber : COLORS.gray300,
                  fontWeight: category === cat ? 600 : 400,
                  padding: "7px 10px", cursor: "pointer", borderRadius: "6px", fontSize: "13px",
                  background: category === cat ? "rgba(245,158,11,0.1)" : "transparent",
                  marginBottom: "2px",
                }}
              >{cat}</button>
            ))}
          </div>

          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px" }}>
            <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "14px" }}>💰 Sort By</div>
            {[["featured", "Featured"], ["price-low", "Price: Low → High"], ["price-high", "Price: High → Low"], ["rating", "Top Rated"]].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)}
                style={{
                  display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                  color: sortBy === val ? COLORS.amber : COLORS.gray300,
                  fontWeight: sortBy === val ? 600 : 400,
                  padding: "7px 10px", cursor: "pointer", borderRadius: "6px", fontSize: "13px",
                  background: sortBy === val ? "rgba(245,158,11,0.1)" : "transparent",
                  marginBottom: "2px",
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: COLORS.gray500 }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <div style={{ fontSize: "18px" }}>No products found</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PRODUCT DETAIL PAGE
const ProductDetailPage = ({ product, onAddToCart, wishlist, onWishlist, onNavigate }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const isWished = wishlist.includes(product.id);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const reviews = [
    { user: "Alex M.", rating: 5, text: "Absolutely stunning product. Exceeded all my expectations.", date: "Jan 2024" },
    { user: "Sarah K.", rating: 5, text: "Fast shipping, great packaging, product is perfect.", date: "Feb 2024" },
    { user: "Jordan T.", rating: 4, text: "Very happy with my purchase. Would definitely buy again.", date: "Mar 2024" },
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <Btn variant="ghost" size="sm" onClick={() => onNavigate("products")} style={{ marginBottom: "24px" }}>
        ← Back to Products
      </Btn>

      <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
        {/* Image */}
        <div style={{
          flex: "0 0 400px", height: "400px",
          background: `radial-gradient(circle at 50% 50%, ${COLORS.navyLight} 0%, ${COLORS.navy} 100%)`,
          borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${COLORS.slate}`, fontSize: "140px",
        }}>
          {product.image}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{ color: COLORS.amber, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
            {product.category}
          </div>
          <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "12px", letterSpacing: "-1px" }}>
            {product.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Stars rating={product.rating} />
            <span style={{ color: COLORS.gray500 }}>{product.reviews.toLocaleString()} reviews</span>
            <Badge text={product.badge} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: COLORS.amber, fontSize: "40px", fontWeight: 800 }}>${product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span style={{ color: COLORS.gray500, fontSize: "20px", textDecoration: "line-through", marginLeft: "12px" }}>
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p style={{ color: COLORS.gray300, lineHeight: 1.7, marginBottom: "24px" }}>{product.description}</p>

          {/* Specs */}
          <div style={{ marginBottom: "28px" }}>
            {product.specs.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: COLORS.gray300, fontSize: "14px" }}>
                <span style={{ color: COLORS.amber }}>✓</span> {s}
              </div>
            ))}
          </div>

          {/* Stock */}
          <div style={{ color: product.stock < 10 ? COLORS.red : COLORS.green, fontWeight: 600, marginBottom: "20px", fontSize: "14px" }}>
            {product.stock < 10 ? `⚠️ Only ${product.stock} left in stock!` : `✓ In Stock — Ships in 1-2 days`}
          </div>

          {/* Qty + Buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0", border: `1px solid ${COLORS.slate}`, borderRadius: "8px", overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ background: COLORS.navyLight, border: "none", color: COLORS.white, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>−</button>
              <span style={{ background: COLORS.navyMid, padding: "10px 20px", color: COLORS.white, minWidth: "50px", textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                style={{ background: COLORS.navyLight, border: "none", color: COLORS.white, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>+</button>
            </div>
            <Btn size="lg" onClick={() => onAddToCart(product, qty)} style={{ flex: 1, minWidth: "160px" }}>
              Add to Cart — ${(product.price * qty).toLocaleString()}
            </Btn>
            <Btn variant="secondary" size="lg" onClick={() => onWishlist(product.id)}>
              {isWished ? "❤️" : "🤍"}
            </Btn>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: "60px", borderTop: `1px solid ${COLORS.slate}`, paddingTop: "40px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "32px" }}>
          {[["desc", "Description"], ["reviews", "Reviews (" + product.reviews + ")"], ["shipping", "Shipping"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                background: tab === id ? COLORS.amber : "transparent",
                color: tab === id ? COLORS.navy : COLORS.gray300,
                border: "none", borderRadius: "8px", padding: "10px 20px",
                cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.2s",
              }}
            >{label}</button>
          ))}
        </div>
        {tab === "desc" && (
          <p style={{ color: COLORS.gray300, lineHeight: 1.8, maxWidth: "700px" }}>
            {product.description} Designed for professionals and enthusiasts alike, this product delivers unmatched performance and reliability. 
            Our team has rigorously tested every unit to ensure it meets the highest quality standards before shipping.
          </p>
        )}
        {tab === "reviews" && (
          <div style={{ maxWidth: "700px" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", background: COLORS.amber, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: COLORS.navy, fontSize: "14px" }}>{r.user[0]}</div>
                    <div>
                      <div style={{ color: COLORS.white, fontWeight: 600, fontSize: "14px" }}>{r.user}</div>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  <span style={{ color: COLORS.gray500, fontSize: "12px" }}>{r.date}</span>
                </div>
                <p style={{ color: COLORS.gray300, fontSize: "14px", margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "shipping" && (
          <div style={{ color: COLORS.gray300, lineHeight: 1.8, maxWidth: "600px" }}>
            <p><strong style={{ color: COLORS.amber }}>Free Standard Shipping</strong> — Delivered in 5-7 business days on orders over $99.</p>
            <p><strong style={{ color: COLORS.white }}>Express Shipping</strong> — $12.99. Delivered in 2-3 business days.</p>
            <p><strong style={{ color: COLORS.white }}>Overnight Shipping</strong> — $24.99. Next business day delivery.</p>
            <p style={{ color: COLORS.gray500, fontSize: "13px" }}>All orders are fully tracked and insured. 30-day hassle-free returns accepted on all items.</p>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <h2 style={{ color: COLORS.white, fontSize: "28px", fontWeight: 700, marginBottom: "24px" }}>You Might Also Like</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// CART PAGE
const CartPage = ({ cart, onUpdateCart, onRemove, onNavigate }) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 99 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "80px", marginBottom: "24px" }}>🛒</div>
        <h2 style={{ color: COLORS.white, fontSize: "28px", marginBottom: "12px" }}>Your cart is empty</h2>
        <p style={{ color: COLORS.gray500, marginBottom: "32px" }}>Looks like you haven't added anything yet.</p>
        <Btn size="lg" onClick={() => onNavigate("products")}>Start Shopping →</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px", letterSpacing: "-1px" }}>
        Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
      </h1>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {/* Items */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {cart.map(item => (
            <div key={item.id} style={{
              background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`,
              borderRadius: "14px", padding: "20px", marginBottom: "12px",
              display: "flex", gap: "16px", alignItems: "center",
            }}>
              <div style={{
                width: "80px", height: "80px", background: COLORS.navyLight,
                borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "40px", flexShrink: 0,
              }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: "4px" }}>{item.name}</div>
                <div style={{ color: COLORS.gray500, fontSize: "13px" }}>{item.category}</div>
                <div style={{ color: COLORS.amber, fontWeight: 700, marginTop: "6px" }}>${item.price.toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.slate}`, borderRadius: "8px", overflow: "hidden" }}>
                  <button onClick={() => onUpdateCart(item.id, item.qty - 1)}
                    style={{ background: COLORS.navyLight, border: "none", color: COLORS.white, padding: "6px 12px", cursor: "pointer" }}>−</button>
                  <span style={{ padding: "6px 14px", color: COLORS.white, background: COLORS.navyMid, fontSize: "14px" }}>{item.qty}</span>
                  <button onClick={() => onUpdateCart(item.id, item.qty + 1)}
                    style={{ background: COLORS.navyLight, border: "none", color: COLORS.white, padding: "6px 12px", cursor: "pointer" }}>+</button>
                </div>
                <div style={{ color: COLORS.white, fontWeight: 700, minWidth: "70px", textAlign: "right" }}>
                  ${(item.price * item.qty).toLocaleString()}
                </div>
                <button onClick={() => onRemove(item.id)}
                  style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", fontSize: "18px", padding: "4px" }}>×</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ width: "320px", flexShrink: 0 }}>
          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "24px", position: "sticky", top: "80px" }}>
            <h3 style={{ color: COLORS.white, fontWeight: 700, marginBottom: "20px" }}>Order Summary</h3>
            {[
              ["Subtotal", `$${subtotal.toFixed(2)}`],
              ["Shipping", shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`],
              ["Tax (8%)", `$${tax.toFixed(2)}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", color: COLORS.gray300, fontSize: "14px", marginBottom: "12px" }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <hr style={{ border: `0.5px solid ${COLORS.slate}`, margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.white, fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>
              <span>Total</span><span style={{ color: COLORS.amber }}>${total.toFixed(2)}</span>
            </div>
            {/* Promo code */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input placeholder="Promo code"
                style={{ flex: 1, background: COLORS.navyLight, border: `1px solid ${COLORS.slate}`, borderRadius: "8px", padding: "8px 12px", color: COLORS.white, fontSize: "13px", outline: "none" }} />
              <Btn variant="secondary" size="sm">Apply</Btn>
            </div>
            <Btn size="lg" onClick={() => onNavigate("checkout")} style={{ width: "100%" }}>
              Proceed to Checkout →
            </Btn>
            {shipping > 0 && (
              <p style={{ color: COLORS.gray500, fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                Add ${(99 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// CHECKOUT PAGE
const CheckoutPage = ({ cart, onPlaceOrder, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", country: "US", card: "", expiry: "", cvv: "", payMethod: "card" });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0) * 1.08;

  const Field = ({ label, key2, type = "text", placeholder }) => (
    <Input label={label} type={type} value={form[key2]} onChange={v => setForm({ ...form, [key2]: v })} placeholder={placeholder} />
  );

  const steps = ["Shipping", "Payment", "Review"];

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ color: COLORS.white }}>Your cart is empty.</h2>
        <Btn onClick={() => onNavigate("products")} style={{ marginTop: "20px" }}>Shop Now</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>Checkout</h1>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: step > i + 1 ? COLORS.green : step === i + 1 ? COLORS.amber : COLORS.slate,
                color: step > i + 1 ? "#fff" : step === i + 1 ? COLORS.navy : COLORS.gray500,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "14px",
              }}>{step > i + 1 ? "✓" : i + 1}</div>
              <span style={{ color: step === i + 1 ? COLORS.amber : COLORS.gray500, fontWeight: step === i + 1 ? 600 : 400, fontSize: "14px" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: COLORS.slate, margin: "0 16px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {step === 1 && (
            <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: COLORS.white, marginBottom: "20px", fontWeight: 700 }}>Shipping Information</h3>
              <Field label="Full Name" key2="name" placeholder="John Doe" />
              <Field label="Email" key2="email" type="email" placeholder="john@example.com" />
              <Field label="Street Address" key2="address" placeholder="123 Main St" />
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}><Field label="City" key2="city" placeholder="New York" /></div>
                <div style={{ width: "100px" }}><Field label="ZIP" key2="zip" placeholder="10001" /></div>
              </div>
              <Btn size="lg" onClick={() => setStep(2)} style={{ width: "100%" }}>Continue to Payment →</Btn>
            </div>
          )}
          {step === 2 && (
            <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: COLORS.white, marginBottom: "20px", fontWeight: 700 }}>Payment Method</h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {[["card", "💳 Credit Card"], ["paypal", "🅿️ PayPal"], ["apple", "🍎 Apple Pay"]].map(([val, label]) => (
                  <button key={val} onClick={() => setForm({ ...form, payMethod: val })}
                    style={{
                      flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                      border: `2px solid ${form.payMethod === val ? COLORS.amber : COLORS.slate}`,
                      background: form.payMethod === val ? "rgba(245,158,11,0.1)" : COLORS.navyLight,
                      color: form.payMethod === val ? COLORS.amber : COLORS.gray300,
                    }}
                  >{label}</button>
                ))}
              </div>
              {form.payMethod === "card" && (
                <>
                  <Field label="Card Number" key2="card" placeholder="1234 5678 9012 3456" />
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}><Field label="Expiry" key2="expiry" placeholder="MM/YY" /></div>
                    <div style={{ width: "100px" }}><Field label="CVV" key2="cvv" placeholder="123" /></div>
                  </div>
                </>
              )}
              {form.payMethod !== "card" && (
                <div style={{ background: COLORS.navyLight, borderRadius: "10px", padding: "20px", textAlign: "center", color: COLORS.gray300, marginBottom: "16px" }}>
                  You'll be redirected to {form.payMethod === "paypal" ? "PayPal" : "Apple Pay"} to complete payment.
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
                <Btn size="lg" onClick={() => setStep(3)} style={{ flex: 1 }}>Review Order →</Btn>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: COLORS.white, marginBottom: "20px", fontWeight: 700 }}>Review Your Order</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", color: COLORS.gray300, marginBottom: "10px", fontSize: "14px" }}>
                  <span>{item.image} {item.name} × {item.qty}</span>
                  <span style={{ color: COLORS.white, fontWeight: 600 }}>${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <hr style={{ border: `0.5px solid ${COLORS.slate}`, margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.amber, fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
                <Btn size="lg" onClick={onPlaceOrder} style={{ flex: 1 }}>
                  🔒 Place Order
                </Btn>
              </div>
              <p style={{ color: COLORS.gray500, fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
                Protected by 256-bit SSL encryption
              </p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div style={{ width: "260px", flexShrink: 0 }}>
          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px" }}>
            <h4 style={{ color: COLORS.white, marginBottom: "14px", fontWeight: 600 }}>Order ({cart.length} items)</h4>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "24px" }}>{item.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.white, fontSize: "12px", fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: COLORS.amber, fontSize: "13px", fontWeight: 700 }}>${item.price} × {item.qty}</div>
                </div>
              </div>
            ))}
            <hr style={{ border: `0.5px solid ${COLORS.slate}`, margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.amber, fontWeight: 700 }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// LOGIN PAGE
const LoginPage = ({ onLogin, onNavigate }) => {
const LoginPage = ({ onLogin, onNavigate, supabase }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Real Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        onLogin({
          name: data.user.user_metadata?.full_name || form.email.split("@")[0],
          email: data.user.email,
          isAdmin: data.user.email.includes("admin"),
          id: data.user.id,
        });
      } else {
        // Real Supabase signup
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name }
          }
        });
        if (error) throw error;
        onLogin({
          name: form.name || form.email.split("@")[0],
          email: data.user.email,
          isAdmin: false,
          id: data.user.id,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔐</div>
          <h1 style={{ color: COLORS.white, fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p style={{ color: COLORS.gray500, marginTop: "8px" }}>
            {mode === "login" ? "Sign in to your NexStore account" : "Join thousands of happy shoppers"}
          </p>
        </div>

        <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "20px", padding: "32px" }}>
          {mode === "register" && <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />}
          <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="••••••••" />
          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "16px" }}>
              <span style={{ color: COLORS.amber, fontSize: "13px", cursor: "pointer" }}>Forgot password?</span>
            </div>
          )}
          <Btn size="lg" onClick={handleSubmit} style={{ width: "100%", marginBottom: "12px" }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Btn>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1, height: "1px", background: COLORS.slate }} />
            <span style={{ color: COLORS.gray500, fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: COLORS.slate }} />
          </div>

          <Btn variant="secondary" size="lg" onClick={handleSubmit} style={{ width: "100%" }}>
            🍎 Continue with Apple
          </Btn>
        </div>

        <p style={{ textAlign: "center", color: COLORS.gray500, marginTop: "20px", fontSize: "14px" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: COLORS.amber, cursor: "pointer" }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${COLORS.red}`, borderRadius: "10px", padding: "12px 16px", marginTop: "16px" }}>
            <p style={{ color: COLORS.red, fontSize: "13px", margin: 0, textAlign: "center" }}>
              ⚠️ {error}
            </p>
          </div>
        )}
        <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.amber}22`, borderRadius: "10px", padding: "12px 16px", marginTop: "16px" }}>
          <p style={{ color: COLORS.gray500, fontSize: "12px", margin: 0, textAlign: "center" }}>
            💡 Create a real account or sign in with your email
          </p>
        </div>
      </div>
    </div>
  );
};

// DASHBOARD PAGE
const DashboardPage = ({ user, onNavigate }) => {
  const quickStats = [
    { icon: "📦", label: "Total Orders", value: "12", color: COLORS.amber },
    { icon: "❤️", label: "Wishlist Items", value: "7", color: "#EF4444" },
    { icon: "⭐", label: "Reviews Given", value: "4", color: "#8B5CF6" },
    { icon: "💰", label: "Total Spent", value: "$4,296", color: COLORS.green },
  ];
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "4px" }}>
            Hello, {user.name} 👋
          </h1>
          <p style={{ color: COLORS.gray500 }}>Welcome back to your dashboard</p>
        </div>
        <Btn onClick={() => onNavigate("products")}>Continue Shopping →</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {quickStats.map(s => (
          <div key={s.label} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: "28px", fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: COLORS.gray500, fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ color: COLORS.white, fontWeight: 700 }}>Recent Orders</h3>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("orders")}>View All →</Btn>
        </div>
        {ORDERS.map(order => (
          <div key={order.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0", borderBottom: `1px solid ${COLORS.slate}`, flexWrap: "wrap", gap: "8px",
          }}>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 600, fontSize: "14px" }}>{order.id}</div>
              <div style={{ color: COLORS.gray500, fontSize: "12px" }}>{order.date} · {order.items} items</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ color: COLORS.amber, fontWeight: 700 }}>${order.total.toLocaleString()}</span>
              <span style={{
                fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px",
                background: order.status === "Delivered" ? "rgba(16,185,129,0.15)" : order.status === "Shipped" ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
                color: order.status === "Delivered" ? COLORS.green : order.status === "Shipped" ? "#60A5FA" : COLORS.amber,
              }}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ORDERS PAGE
const OrdersPage = () => (
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
    <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>Order History</h1>
    {ORDERS.map(order => (
      <div key={order.id} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ color: COLORS.amber, fontWeight: 700, fontSize: "15px" }}>{order.id}</div>
            <div style={{ color: COLORS.gray500, fontSize: "13px", marginTop: "4px" }}>Placed: {order.date} · {order.items} items</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: "20px" }}>${order.total.toLocaleString()}</div>
            <span style={{
              fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "100px",
              background: order.status === "Delivered" ? "rgba(16,185,129,0.15)" : order.status === "Shipped" ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
              color: order.status === "Delivered" ? COLORS.green : order.status === "Shipped" ? "#60A5FA" : COLORS.amber,
            }}>{order.status}</span>
          </div>
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Btn variant="secondary" size="sm">View Details</Btn>
          {order.status === "Delivered" && <Btn variant="ghost" size="sm">Write Review</Btn>}
          {order.status === "Processing" && <Btn variant="ghost" size="sm">Cancel Order</Btn>}
        </div>
      </div>
    ))}
  </div>
);

// WISHLIST PAGE
const WishlistPage = ({ wishlist, onAddToCart, onWishlist, onNavigate }) => {
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>♡</div>
        <h2 style={{ color: COLORS.white, fontSize: "28px", marginBottom: "12px" }}>Your wishlist is empty</h2>
        <Btn onClick={() => onNavigate("products")}>Discover Products →</Btn>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>My Wishlist ({items.length})</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {items.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
      </div>
    </div>
  );
};

// ADMIN PANEL
const AdminPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState(PRODUCTS);

  if (!user?.isAdmin) return (
    <div style={{ textAlign: "center", padding: "80px", color: COLORS.gray300 }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🚫</div>
      <h2>Access Denied</h2><p>Admin access required.</p>
    </div>
  );

  const tabs = ["overview", "products", "orders", "users"];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: COLORS.amber, fontSize: "32px", fontWeight: 800, marginBottom: "4px" }}>⚙️ Admin Panel</h1>
          <p style={{ color: COLORS.gray500 }}>Manage your store</p>
        </div>
        <Btn size="sm">+ Add Product</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: `1px solid ${COLORS.slate}`, paddingBottom: "0" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "10px 20px",
              color: activeTab === t ? COLORS.amber : COLORS.gray500,
              fontWeight: activeTab === t ? 700 : 400, textTransform: "capitalize",
              borderBottom: `2px solid ${activeTab === t ? COLORS.amber : "transparent"}`,
              transition: "all 0.2s", fontSize: "14px",
            }}
          >{t}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Total Revenue", value: "$284,290", icon: "💰", trend: "+12.4%" },
              { label: "Total Orders", value: "1,842", icon: "📦", trend: "+8.2%" },
              { label: "Active Users", value: "9,341", icon: "👥", trend: "+23.1%" },
              { label: "Products", value: PRODUCTS.length, icon: "🏪", trend: "+2" },
            ].map(s => (
              <div key={s.label} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: COLORS.gray500, fontSize: "12px", marginBottom: "8px" }}>{s.label}</div>
                    <div style={{ color: COLORS.white, fontSize: "26px", fontWeight: 800 }}>{s.value}</div>
                  </div>
                  <span style={{ fontSize: "28px" }}>{s.icon}</span>
                </div>
                <div style={{ color: COLORS.green, fontSize: "12px", fontWeight: 600, marginTop: "8px" }}>{s.trend} this month</div>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ color: COLORS.white, marginBottom: "16px" }}>Recent Activity</h3>
            {[
              { action: "New order placed", detail: "ORD-2024-089 — $2,449", time: "2m ago", icon: "📦" },
              { action: "New user registered", detail: "james.morrison@email.com", time: "14m ago", icon: "👤" },
              { action: "Product updated", detail: "MacBook Pro 16\" — stock updated", time: "1h ago", icon: "✏️" },
              { action: "Payment received", detail: "$1,299 via Stripe", time: "2h ago", icon: "💳" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: `1px solid ${COLORS.slate}` }}>
                <span style={{ fontSize: "20px" }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500 }}>{a.action}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "12px" }}>{a.detail}</div>
                </div>
                <span style={{ color: COLORS.gray500, fontSize: "12px" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.slate}` }}>
                {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: COLORS.gray500, fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.slate}` }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.navyLight}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "24px" }}>{p.image}</span>
                      <div>
                        <div style={{ color: COLORS.white, fontWeight: 500, fontSize: "14px" }}>{p.name}</div>
                        <div style={{ color: COLORS.gray500, fontSize: "11px" }}>ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: COLORS.gray300, fontSize: "13px" }}>{p.category}</td>
                  <td style={{ padding: "14px 20px", color: COLORS.amber, fontWeight: 700 }}>${p.price.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ color: p.stock < 10 ? COLORS.red : COLORS.green, fontWeight: 600, fontSize: "13px" }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: COLORS.amber }}>★</span>
                      <span style={{ color: COLORS.white, fontSize: "13px" }}>{p.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Btn variant="secondary" size="sm">Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => setProducts(products.filter(x => x.id !== p.id))}>Del</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.slate}` }}>
                {["Order ID", "Date", "Items", "Total", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: COLORS.gray500, fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDERS.map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${COLORS.slate}` }}>
                  <td style={{ padding: "14px 20px", color: COLORS.amber, fontWeight: 600, fontSize: "13px" }}>{o.id}</td>
                  <td style={{ padding: "14px 20px", color: COLORS.gray300, fontSize: "13px" }}>{o.date}</td>
                  <td style={{ padding: "14px 20px", color: COLORS.gray300, fontSize: "13px" }}>{o.items}</td>
                  <td style={{ padding: "14px 20px", color: COLORS.white, fontWeight: 700 }}>${o.total.toLocaleString()}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px",
                      background: o.status === "Delivered" ? "rgba(16,185,129,0.15)" : o.status === "Shipped" ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
                      color: o.status === "Delivered" ? COLORS.green : o.status === "Shipped" ? "#60A5FA" : COLORS.amber,
                    }}>{o.status}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}><Btn variant="secondary" size="sm">View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "24px" }}>
          {[
            { name: "Alex Johnson", email: "alex@example.com", orders: 8, spent: "$3,240", joined: "Jan 2024", role: "Customer" },
            { name: "Sarah Williams", email: "sarah@example.com", orders: 3, spent: "$890", joined: "Feb 2024", role: "Customer" },
            { name: "Admin User", email: "admin@test.com", orders: 0, spent: "$0", joined: "Dec 2023", role: "Admin" },
          ].map((u, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${COLORS.slate}`, flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "38px", height: "38px", background: COLORS.amber, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: COLORS.navy }}>
                  {u.name[0]}
                </div>
                <div>
                  <div style={{ color: COLORS.white, fontWeight: 600, fontSize: "14px" }}>{u.name}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "12px" }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: COLORS.white, fontWeight: 700 }}>{u.orders}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "11px" }}>orders</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: COLORS.amber, fontWeight: 700 }}>{u.spent}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "11px" }}>spent</div>
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px",
                  background: u.role === "Admin" ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
                  color: u.role === "Admin" ? COLORS.amber : "#818CF8",
                }}>{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ABOUT PAGE
const AboutPage = () => (
  <div>
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
      padding: "100px 24px", textAlign: "center",
    }}>
      <h1 style={{ color: COLORS.white, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "16px" }}>
        We're <span style={{ color: COLORS.amber }}>NexStore</span>
      </h1>
      <p style={{ color: COLORS.gray300, maxWidth: "560px", margin: "0 auto", fontSize: "18px", lineHeight: 1.7 }}>
        The world's most curated technology marketplace. We believe exceptional products deserve exceptional experiences.
      </p>
    </div>
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "64px" }}>
        {[
          { icon: "🚀", title: "Our Mission", desc: "Make world-class technology accessible to everyone, everywhere. We partner with the world's top brands to bring you authentic products at fair prices." },
          { icon: "🏆", title: "Our Story", desc: "Founded in 2020, NexStore started as a passion project and has grown to serve over 500,000 customers across 120+ countries worldwide." },
          { icon: "💡", title: "Our Values", desc: "Transparency, authenticity, and customer obsession drive everything we do. We stand behind every product we sell with our 30-day guarantee." },
        ].map(item => (
          <div key={item.title} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.icon}</div>
            <h3 style={{ color: COLORS.white, fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>{item.title}</h3>
            <p style={{ color: COLORS.gray300, lineHeight: 1.7, fontSize: "14px", margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: COLORS.white, fontSize: "36px", fontWeight: 800, marginBottom: "40px" }}>Our Team</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          {[
            { name: "Sarah Chen", role: "CEO & Co-founder", emoji: "👩‍💼" },
            { name: "Marcus Rivera", role: "CTO & Co-founder", emoji: "👨‍💻" },
            { name: "Priya Patel", role: "Head of Design", emoji: "👩‍🎨" },
            { name: "James Wu", role: "Head of Operations", emoji: "👨‍💼" },
          ].map(m => (
            <div key={m.name} style={{ textAlign: "center" }}>
              <div style={{
                width: "80px", height: "80px", background: COLORS.navyMid, borderRadius: "50%",
                border: `2px solid ${COLORS.slate}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", margin: "0 auto 12px",
              }}>{m.emoji}</div>
              <div style={{ color: COLORS.white, fontWeight: 700 }}>{m.name}</div>
              <div style={{ color: COLORS.amber, fontSize: "12px", marginTop: "2px" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// CONTACT PAGE
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ color: COLORS.white, fontSize: "48px", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "12px" }}>Get in Touch</h1>
        <p style={{ color: COLORS.gray500, fontSize: "18px" }}>Our team is here to help. Expect a response within 2 hours.</p>
      </div>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {sent ? (
            <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.green}`, borderRadius: "16px", padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
              <h3 style={{ color: COLORS.white, fontSize: "24px", marginBottom: "8px" }}>Message Sent!</h3>
              <p style={{ color: COLORS.gray500 }}>We'll get back to you within 2 hours.</p>
              <Btn onClick={() => setSent(false)} style={{ marginTop: "16px" }}>Send Another</Btn>
            </div>
          ) : (
            <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "16px", padding: "32px" }}>
              <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />
              <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="john@example.com" />
              <Input label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} placeholder="How can we help?" />
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: COLORS.gray300, fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more..."
                  rows={5}
                  style={{
                    width: "100%", background: COLORS.navyLight, border: `1px solid ${COLORS.slate}`,
                    borderRadius: "8px", padding: "10px 14px", color: COLORS.white, fontSize: "14px",
                    outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
              </div>
              <Btn size="lg" onClick={() => setSent(true)} style={{ width: "100%" }}>Send Message →</Btn>
            </div>
          )}
        </div>
        <div style={{ width: "280px", flexShrink: 0 }}>
          {[
            { icon: "📧", title: "Email Us", info: "support@nexstore.com", sub: "Reply within 2 hours" },
            { icon: "📞", title: "Call Us", info: "+1 (800) NEX-STOR", sub: "Mon–Fri, 9am–6pm ET" },
            { icon: "💬", title: "Live Chat", info: "Available Now", sub: "Average wait: 2 minutes" },
          ].map(c => (
            <div key={c.title} style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ fontSize: "28px" }}>{c.icon}</div>
                <div>
                  <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "2px" }}>{c.title}</div>
                  <div style={{ color: COLORS.amber, fontSize: "14px" }}>{c.info}</div>
                  <div style={{ color: COLORS.gray500, fontSize: "12px" }}>{c.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ORDER CONFIRMATION
const OrderConfirmPage = ({ onNavigate }) => (
  <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: "600px", margin: "0 auto" }}>
    <div style={{ fontSize: "80px", marginBottom: "24px" }}>🎉</div>
    <h1 style={{ color: COLORS.white, fontSize: "40px", fontWeight: 800, marginBottom: "16px" }}>Order Confirmed!</h1>
    <p style={{ color: COLORS.gray300, marginBottom: "8px", fontSize: "16px" }}>
      Thank you for your order. A confirmation has been sent to your email.
    </p>
    <div style={{ background: COLORS.navyMid, border: `1px solid ${COLORS.green}`, borderRadius: "14px", padding: "20px", marginBottom: "32px", marginTop: "24px" }}>
      <div style={{ color: COLORS.green, fontWeight: 700, fontSize: "18px" }}>ORD-{Date.now().toString().slice(-6)}</div>
      <div style={{ color: COLORS.gray300, fontSize: "14px", marginTop: "4px" }}>Estimated delivery: 3–5 business days</div>
    </div>
    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
      <Btn onClick={() => onNavigate("orders")}>View Orders</Btn>
      <Btn variant="secondary" onClick={() => onNavigate("products")}>Continue Shopping</Btn>
    </div>
  </div>
);

// FOOTER
const Footer = ({ onNavigate }) => (
  <footer style={{ background: COLORS.navy, borderTop: `1px solid ${COLORS.slate}`, padding: "60px 24px 32px" }}>
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}>
        <div>
          <div style={{ color: COLORS.white, fontWeight: 800, fontSize: "22px", marginBottom: "12px" }}>
            NexStore<span style={{ color: COLORS.amber }}>.</span>
          </div>
          <p style={{ color: COLORS.gray500, fontSize: "13px", lineHeight: 1.7 }}>
            The world's most curated technology marketplace. Trusted by 500,000+ customers.
          </p>
        </div>
        {[
          { title: "Shop", links: [["products", "All Products"], ["products", "MacBooks"], ["products", "Audio"], ["products", "Gaming"]] },
          { title: "Company", links: [["about", "About Us"], ["contact", "Contact"], ["home", "Careers"], ["home", "Press"]] },
          { title: "Support", links: [["home", "Help Center"], ["home", "Track Order"], ["home", "Returns"], ["home", "Warranty"]] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ color: COLORS.white, fontWeight: 700, marginBottom: "14px" }}>{col.title}</div>
            {col.links.map(([page, label]) => (
              <button key={label} onClick={() => onNavigate(page)}
                style={{ display: "block", background: "none", border: "none", color: COLORS.gray500, cursor: "pointer", padding: "4px 0", fontSize: "13px", textAlign: "left" }}
                onMouseEnter={e => e.target.style.color = COLORS.amber}
                onMouseLeave={e => e.target.style.color = COLORS.gray500}
              >{label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.slate}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ color: COLORS.gray500, fontSize: "13px" }}>© 2024 NexStore. All rights reserved.</span>
        <div style={{ display: "flex", gap: "16px" }}>
          {["💳 Secure Payments", "🚚 Free Shipping", "🔒 SSL Protected"].map(t => (
            <span key={t} style={{ color: COLORS.gray500, fontSize: "12px" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbOrders, setDbOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Supabase on startup
  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');
        if (error) throw error;
        const mapped = (data || []).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.original_price || p.price,
          rating: p.rating || 4.8,
          reviews: p.reviews || 0,
          stock: p.stock || 10,
          badge: p.badge || null,
          image: p.image || "📦",
          description: p.description || "",
          specs: p.specs || [],
        }));
        if (mapped.length > 0) setDbProducts(mapped);
      } catch (err) {
        console.log("Using demo products:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Check for existing Supabase login session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          isAdmin: session.user.email.includes("admin"),
          id: session.user.id,
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          isAdmin: session.user.email.includes("admin"),
          id: session.user.id,
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load real orders when user logs in
  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setDbOrders(data); });
  }, [user]);

  // Use real data if available, otherwise fall back to demo data
  const activeProducts = dbProducts.length > 0 ? dbProducts : PRODUCTS;
  const activeOrders = dbOrders.length > 0 ? dbOrders : ORDERS;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((pg, data = null) => {
    setPage(pg);
    setPageData(data);
    window.scrollTo(0, 0);
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const updateCart = useCallback((id, qty) => {
    if (qty < 1) { setCart(prev => prev.filter(i => i.id !== id)); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const isIn = prev.includes(id);
      showToast(isIn ? "Removed from wishlist" : "Added to wishlist ♡");
      return isIn ? prev.filter(x => x !== id) : [...prev, id];
    });
  }, [showToast]);

  // Save real order to Supabase on checkout
  const placeOrder = useCallback(async () => {
    try {
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0) * 1.08;
      await supabase.from('orders').insert({
        user_email: user?.email || 'guest@nexstore.com',
        user_id: user?.id || null,
        items: cart,
        total: parseFloat(total.toFixed(2)),
        status: 'processing',
      });
      if (user?.email) {
        const { data } = await supabase.from('orders').select('*').eq('user_email', user.email).order('created_at', { ascending: false });
        if (data) setDbOrders(data);
      }
    } catch (err) {
      console.log("Order save error:", err.message);
    }
    setCart([]);
    navigate("confirm");
    showToast("Order placed successfully! 🎉");
  }, [cart, user, navigate, showToast]);

  // Real logout via Supabase
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("home");
    showToast("Signed out successfully");
  }, [navigate, showToast]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (loading) {
    return (
      <div style={{ background: COLORS.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🛍️</div>
        <div style={{ color: COLORS.amber, fontWeight: 700, fontSize: "18px" }}>Loading NexStore...</div>
        <div style={{ color: COLORS.gray500, fontSize: "14px" }}>Connecting to database</div>
      </div>
    );
  }

  const renderPage = () => {
    const commonProps = { onNavigate: navigate, onAddToCart: addToCart, wishlist, onWishlist: toggleWishlist, products: activeProducts };
    switch (page) {
      case "home": return <HomePage {...commonProps} />;
      case "products": return <ProductsPage {...commonProps} initCategory={pageData?.category || "All"} initSearch={pageData?.search || ""} />;
      case "product": return pageData ? <ProductDetailPage product={pageData} {...commonProps} /> : null;
      case "cart": return <CartPage cart={cart} onUpdateCart={updateCart} onRemove={id => setCart(c => c.filter(i => i.id !== id))} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} onPlaceOrder={placeOrder} onNavigate={navigate} />;
      case "login": return <LoginPage onLogin={(u) => { setUser(u); navigate("dashboard"); showToast(`Welcome back, ${u.name}!`); }} onNavigate={navigate} supabase={supabase} />;
      case "dashboard": return user ? <DashboardPage user={user} onNavigate={navigate} orders={activeOrders} /> : <LoginPage onLogin={(u) => { setUser(u); navigate("dashboard"); }} onNavigate={navigate} supabase={supabase} />;
      case "orders": return <OrdersPage orders={activeOrders} />;
      case "wishlist": return <WishlistPage {...commonProps} />;
      case "admin": return <AdminPage user={user} products={activeProducts} supabase={supabase} />;
      case "confirm": return <OrderConfirmPage onNavigate={navigate} />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      default: return <HomePage {...commonProps} />;
    }
  };

  return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.navy}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.slate}; border-radius: 3px; }
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      <Nav page={page} onNavigate={navigate} cartCount={cartCount} user={user} onLogout={handleLogout} />
      <main style={{ minHeight: "calc(100vh - 64px)" }}>
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
