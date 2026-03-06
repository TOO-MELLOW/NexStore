import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ============================================================
// DESIGN SYSTEM
// ============================================================
const C = {
  navy: "#0A0F1E", navyMid: "#111827", navyLight: "#1E2A3B",
  slate: "#2D3A4A", amber: "#F59E0B", amberDark: "#D97706",
  white: "#FFFFFF", gray300: "#D1D5DB", gray500: "#6B7280",
  green: "#10B981", red: "#EF4444",
};

const CATEGORIES = ["All", "MacBooks", "iPhones", "Accessories", "Audio", "Gaming", "Wearables"];

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================
const Stars = ({ rating = 5 }) => (
  <span style={{ color: C.amber, fontSize: "13px" }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
  </span>
);

const Badge = ({ text }) => {
  if (!text) return null;
  const colors = {
    "New": "#10B981", "Sale": C.red, "Bestseller": C.amber,
    "Limited": "#8B5CF6", "Hot": C.red, "Premium": C.amber,
    "Popular": "#3B82F6", "Top Rated": "#059669", "Value Pick": "#6366F1",
  };
  return (
    <span style={{
      background: colors[text] || C.slate,
      color: text === "Bestseller" || text === "Premium" ? C.navy : "#fff",
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
      padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase",
    }}>{text}</span>
  );
};

const Btn = ({ children, variant = "primary", onClick, style: s = {}, disabled = false, size = "md" }) => {
  const [hov, setHov] = useState(false);
  const base = {
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    borderRadius: "8px", fontWeight: 600, transition: "all 0.2s ease",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "6px", opacity: disabled ? 0.5 : 1,
    fontSize: size === "sm" ? "13px" : size === "lg" ? "16px" : "14px",
    padding: size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
  };
  const variants = {
    primary: { background: hov ? C.amberDark : C.amber, color: C.navy },
    secondary: { background: hov ? C.navyLight : C.navyMid, color: C.white, border: `1px solid ${C.slate}` },
    ghost: { background: hov ? "rgba(255,255,255,0.08)" : "transparent", color: C.gray300 },
    danger: { background: hov ? "#DC2626" : C.red, color: "#fff" },
    outline: { background: hov ? "rgba(245,158,11,0.1)" : "transparent", color: C.amber, border: `1px solid ${C.amber}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant], ...s }}
    >{children}</button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, style: s = {} }) => (
  <div style={{ marginBottom: "16px" }}>
    {label && <label style={{ display: "block", color: C.gray300, fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", background: C.navyLight, border: `1px solid ${C.slate}`,
        borderRadius: "8px", padding: "10px 14px", color: C.white, fontSize: "14px",
        outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", ...s
      }}
      onFocus={e => e.target.style.borderColor = C.amber}
      onBlur={e => e.target.style.borderColor = C.slate}
    />
  </div>
);

const ErrorBox = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
      <p style={{ color: C.red, fontSize: "13px", margin: 0, textAlign: "center" }}>⚠️ {message}</p>
    </div>
  );
};

const Toast = ({ message, type = "success", onClose }) => (
  <div style={{
    position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
    background: type === "success" ? C.green : C.red, color: "#fff",
    padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 500,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "10px",
    animation: "slideIn 0.3s ease",
  }}>
    {type === "success" ? "✓" : "✕"} {message}
    <span onClick={onClose} style={{ cursor: "pointer", marginLeft: "8px", opacity: 0.7 }}>×</span>
  </div>
);

const EmptyState = ({ icon, title, message, btnText, onBtn }) => (
  <div style={{ textAlign: "center", padding: "80px 24px" }}>
    <div style={{ fontSize: "64px", marginBottom: "16px" }}>{icon}</div>
    <h2 style={{ color: C.white, fontSize: "28px", marginBottom: "12px" }}>{title}</h2>
    {message && <p style={{ color: C.gray500, marginBottom: "32px" }}>{message}</p>}
    {btnText && <Btn size="lg" onClick={onBtn}>{btnText}</Btn>}
  </div>
);

// ============================================================
// PRODUCT CARD
// ============================================================
const ProductCard = ({ product, onAddToCart, onWishlist, wishlist, onNavigate }) => {
  const [hov, setHov] = useState(false);
  const isWished = wishlist.includes(product.id);
  const discount = product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.navyLight : C.navyMid, borderRadius: "16px",
        border: `1px solid ${hov ? C.amber + "44" : C.slate}`,
        transition: "all 0.3s ease", transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 40px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "pointer", display: "flex", flexDirection: "column",
      }}
    >
      <div onClick={() => onNavigate("product", product)}
        style={{
          height: "200px", display: "flex", alignItems: "center", justifyContent: "center",
          background: `radial-gradient(circle at 50% 50%, ${C.navyLight} 0%, ${C.navy} 100%)`,
          fontSize: "72px", position: "relative", borderBottom: `1px solid ${C.slate}`,
          borderRadius: "16px 16px 0 0",
        }}
      >
        <span style={{ filter: hov ? "drop-shadow(0 0 20px rgba(245,158,11,0.3))" : "none", transition: "filter 0.3s" }}>
          {product.image || "📦"}
        </span>
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
          <Badge text={product.badge} />
          {discount > 0 && (
            <span style={{ background: C.red, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>
              -{discount}%
            </span>
          )}
        </div>
        <button onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "16px" }}>
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ color: C.gray500, fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>{product.category}</div>
        <div onClick={() => onNavigate("product", product)} style={{ color: C.white, fontWeight: 600, fontSize: "15px", marginBottom: "8px", lineHeight: "1.4" }}>{product.name}</div>
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Stars rating={product.rating} />
          <span style={{ color: C.gray500, fontSize: "12px" }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          <div>
            <span style={{ color: C.amber, fontWeight: 700, fontSize: "20px" }}>${Number(product.price).toLocaleString()}</span>
            {discount > 0 && <span style={{ color: C.gray500, fontSize: "13px", textDecoration: "line-through", marginLeft: "8px" }}>${Number(product.original_price).toLocaleString()}</span>}
          </div>
          <span style={{ color: product.stock < 10 ? C.red : C.green, fontSize: "11px", fontWeight: 600 }}>
            {product.stock < 10 ? `Only ${product.stock} left` : "In Stock"}
          </span>
        </div>
        <Btn onClick={() => onAddToCart(product)} style={{ marginTop: "12px", width: "100%" }}>+ Add to Cart</Btn>
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

  return (
    <nav style={{ background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.slate}`, position: "sticky", top: 0, zIndex: 1000, padding: "0 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: C.amber, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: C.navy }}>N</div>
          <span style={{ color: C.white, fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" }}>NexStore<span style={{ color: C.amber }}>.</span></span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[["home", "Home"], ["products", "Products"], ["about", "About"], ["contact", "Contact"]].map(([id, label]) => (
            <button key={id} onClick={() => onNavigate(id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: page === id ? C.amber : C.gray300, fontWeight: page === id ? 600 : 400, padding: "6px 14px", borderRadius: "6px", fontSize: "14px", borderBottom: `2px solid ${page === id ? C.amber : "transparent"}` }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {searchOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { onNavigate("products", { search: searchQuery }); setSearchOpen(false); } }}
                placeholder="Search products..."
                style={{ background: C.navyLight, border: `1px solid ${C.amber}`, borderRadius: "8px", padding: "8px 14px", color: C.white, fontSize: "14px", outline: "none", width: "200px" }} />
              <Btn variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>✕</Btn>
            </div>
          ) : (
            <Btn variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>🔍</Btn>
          )}
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("wishlist")}>♡</Btn>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("cart")} style={{ position: "relative" }}>
            🛒
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", background: C.amber, color: C.navy, borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </Btn>
          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: C.amber, color: C.navy, border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", top: "44px", right: 0, minWidth: "180px", background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "12px", padding: "8px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding: "8px 12px", color: C.gray500, fontSize: "12px" }}>Signed in as <strong style={{ color: C.white }}>{user.name}</strong></div>
                  <hr style={{ border: `0.5px solid ${C.slate}`, margin: "4px 0" }} />
                  {[["dashboard", "Dashboard"], ["orders", "My Orders"]].map(([id, label]) => (
                    <button key={id} onClick={() => { onNavigate(id); setMenuOpen(false); }}
                      style={{ width: "100%", background: "none", border: "none", color: C.gray300, padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px", fontSize: "14px" }}>
                      {label}
                    </button>
                  ))}
                  {user.isAdmin && (
                    <button onClick={() => { onNavigate("admin"); setMenuOpen(false); }}
                      style={{ width: "100%", background: "none", border: "none", color: C.amber, padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px", fontSize: "14px", fontWeight: 600 }}>
                      ⚙️ Admin Panel
                    </button>
                  )}
                  <hr style={{ border: `0.5px solid ${C.slate}`, margin: "4px 0" }} />
                  <button onClick={() => { onLogout(); setMenuOpen(false); }}
                    style={{ width: "100%", background: "none", border: "none", color: C.red, padding: "8px 12px", cursor: "pointer", textAlign: "left", borderRadius: "6px", fontSize: "14px" }}>
                    Sign Out
                  </button>
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
// HOME PAGE
// ============================================================
const HomePage = ({ onNavigate, onAddToCart, wishlist, onWishlist, products }) => {
  const featured = products.slice(0, 4);
  return (
    <div>
      <div style={{ background: `radial-gradient(ellipse at 30% 50%, ${C.navyLight} 0%, ${C.navy} 60%)`, minHeight: "88vh", display: "flex", alignItems: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {[400, 600, 800].map((s, i) => (
          <div key={i} style={{ position: "absolute", right: `${-s / 3 + 100}px`, top: "50%", transform: "translateY(-50%)", width: `${s}px`, height: `${s}px`, borderRadius: "50%", border: `1px solid rgba(245,158,11,${0.08 - i * 0.02})`, pointerEvents: "none" }} />
        ))}
        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "40px" }}>
          <div style={{ maxWidth: "560px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.3)`, borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.amber, display: "inline-block" }} />
              <span style={{ color: C.amber, fontSize: "13px", fontWeight: 600 }}>Free shipping on orders over $99</span>
            </div>
            <h1 style={{ color: C.white, fontSize: "clamp(42px, 5vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-2px" }}>
              The Future of<br /><span style={{ color: C.amber }}>Tech Shopping</span><br />Starts Here.
            </h1>
            <p style={{ color: C.gray300, fontSize: "18px", lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
              Discover the world's most coveted technology. Curated products, unbeatable prices, next-day delivery.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Btn size="lg" onClick={() => onNavigate("products")}>Shop Now →</Btn>
              <Btn size="lg" variant="outline" onClick={() => onNavigate("about")}>Our Story</Btn>
            </div>
          </div>
          <div style={{ fontSize: "180px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "300px" }}>
            <div style={{ width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {products[0]?.image || "🛍️"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: C.navyMid, borderTop: `1px solid ${C.slate}`, borderBottom: `1px solid ${C.slate}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto" }}>
          {CATEGORIES.filter(c => c !== "All").map(cat => (
            <button key={cat} onClick={() => onNavigate("products", { category: cat })}
              style={{ background: "none", border: "none", color: C.gray300, padding: "16px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", borderBottom: "2px solid transparent", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = C.amber; e.target.style.borderBottomColor = C.amber; }}
              onMouseLeave={e => { e.target.style.color = C.gray300; e.target.style.borderBottomColor = "transparent"; }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h2 style={{ color: C.white, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>Featured Products</h2>
          <Btn variant="outline" onClick={() => onNavigate("products")}>View All →</Btn>
        </div>
        {featured.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: C.gray500 }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p>No products yet. Add products in your Supabase database.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
          </div>
        )}
      </div>

      <div style={{ background: C.navyMid, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {[{ icon: "🚚", title: "Free Shipping", desc: "On all orders over $99" }, { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption" }, { icon: "↩️", title: "30-Day Returns", desc: "Hassle-free returns" }, { icon: "💬", title: "24/7 Support", desc: "Expert help anytime" }].map(t => (
            <div key={t.title} style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{t.icon}</div>
              <div style={{ color: C.white, fontWeight: 700, marginBottom: "4px" }}>{t.title}</div>
              <div style={{ color: C.gray500, fontSize: "13px" }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PRODUCTS PAGE
// ============================================================
const ProductsPage = ({ onAddToCart, wishlist, onWishlist, onNavigate, initCategory = "All", initSearch = "", products }) => {
  const [category, setCategory] = useState(initCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [search, setSearch] = useState(initSearch);

  const filtered = products
    .filter(p => category === "All" || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "price-low" ? a.price - b.price : sortBy === "price-high" ? b.price - a.price : sortBy === "rating" ? b.rating - a.rating : 0);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: C.white, fontSize: "40px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-1.5px" }}>All Products</h1>
      <p style={{ color: C.gray500, marginBottom: "32px" }}>{filtered.length} of {products.length} products</p>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ width: "220px", flexShrink: 0 }}>
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: C.white, fontWeight: 700, marginBottom: "14px" }}>🔍 Search</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              style={{ width: "100%", background: C.navyLight, border: `1px solid ${C.slate}`, borderRadius: "8px", padding: "8px 12px", color: C.white, fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: C.white, fontWeight: 700, marginBottom: "14px" }}>📦 Category</div>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ display: "block", width: "100%", textAlign: "left", border: "none", color: category === cat ? C.amber : C.gray300, fontWeight: category === cat ? 600 : 400, padding: "7px 10px", cursor: "pointer", borderRadius: "6px", fontSize: "13px", background: category === cat ? "rgba(245,158,11,0.1)" : "transparent", marginBottom: "2px" }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px" }}>
            <div style={{ color: C.white, fontWeight: 700, marginBottom: "14px" }}>💰 Sort By</div>
            {[["featured", "Featured"], ["price-low", "Price: Low → High"], ["price-high", "Price: High → Low"], ["rating", "Top Rated"]].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)}
                style={{ display: "block", width: "100%", textAlign: "left", border: "none", color: sortBy === val ? C.amber : C.gray300, fontWeight: sortBy === val ? 600 : 400, padding: "7px 10px", cursor: "pointer", borderRadius: "6px", fontSize: "13px", background: sortBy === val ? "rgba(245,158,11,0.1)" : "transparent", marginBottom: "2px" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No products found" message="Try a different search or category." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PRODUCT DETAIL
// ============================================================
const ProductDetailPage = ({ product, onAddToCart, wishlist, onWishlist, onNavigate, products }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const isWished = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <Btn variant="ghost" size="sm" onClick={() => onNavigate("products")} style={{ marginBottom: "24px" }}>← Back to Products</Btn>
      <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 400px", height: "400px", background: `radial-gradient(circle at 50% 50%, ${C.navyLight} 0%, ${C.navy} 100%)`, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.slate}`, fontSize: "140px" }}>
          {product.image || "📦"}
        </div>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{ color: C.amber, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>{product.category}</div>
          <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "12px", letterSpacing: "-1px" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Stars rating={product.rating} />
            <span style={{ color: C.gray500 }}>{(product.reviews || 0).toLocaleString()} reviews</span>
            <Badge text={product.badge} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: C.amber, fontSize: "40px", fontWeight: 800 }}>${Number(product.price).toLocaleString()}</span>
            {product.original_price > product.price && <span style={{ color: C.gray500, fontSize: "20px", textDecoration: "line-through", marginLeft: "12px" }}>${Number(product.original_price).toLocaleString()}</span>}
          </div>
          <p style={{ color: C.gray300, lineHeight: 1.7, marginBottom: "24px" }}>{product.description}</p>
          <div style={{ color: product.stock < 10 ? C.red : C.green, fontWeight: 600, marginBottom: "20px", fontSize: "14px" }}>
            {product.stock < 10 ? `⚠️ Only ${product.stock} left!` : "✓ In Stock — Ships in 1-2 days"}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.slate}`, borderRadius: "8px", overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: C.navyLight, border: "none", color: C.white, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>−</button>
              <span style={{ background: C.navyMid, padding: "10px 20px", color: C.white, minWidth: "50px", textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: C.navyLight, border: "none", color: C.white, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>+</button>
            </div>
            <Btn size="lg" onClick={() => onAddToCart(product, qty)} style={{ flex: 1, minWidth: "160px" }}>Add to Cart — ${(Number(product.price) * qty).toLocaleString()}</Btn>
            <Btn variant="secondary" size="lg" onClick={() => onWishlist(product.id)}>{isWished ? "❤️" : "🤍"}</Btn>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "60px", borderTop: `1px solid ${C.slate}`, paddingTop: "40px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "32px" }}>
          {[["desc", "Description"], ["shipping", "Shipping"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ background: tab === id ? C.amber : "transparent", color: tab === id ? C.navy : C.gray300, border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
              {label}
            </button>
          ))}
        </div>
        {tab === "desc" && <p style={{ color: C.gray300, lineHeight: 1.8, maxWidth: "700px" }}>{product.description}</p>}
        {tab === "shipping" && (
          <div style={{ color: C.gray300, lineHeight: 1.8, maxWidth: "600px" }}>
            <p><strong style={{ color: C.amber }}>Free Standard Shipping</strong> — 5-7 business days on orders over $99.</p>
            <p><strong style={{ color: C.white }}>Express Shipping</strong> — $12.99. Delivered in 2-3 business days.</p>
            <p><strong style={{ color: C.white }}>Overnight</strong> — $24.99. Next business day.</p>
          </div>
        )}
      </div>
      {related.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <h2 style={{ color: C.white, fontSize: "28px", fontWeight: 700, marginBottom: "24px" }}>You Might Also Like</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// CART PAGE
// ============================================================
const CartPage = ({ cart, onUpdateCart, onRemove, onNavigate }) => {
  const subtotal = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const shipping = subtotal > 99 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) return <EmptyState icon="🛒" title="Your cart is empty" message="Looks like you haven't added anything yet." btnText="Start Shopping →" onBtn={() => onNavigate("products")} />;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px", letterSpacing: "-1px" }}>Shopping Cart ({cart.length})</h1>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px", marginBottom: "12px", display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: "80px", height: "80px", background: C.navyLight, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", flexShrink: 0 }}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontWeight: 600, marginBottom: "4px" }}>{item.name}</div>
                <div style={{ color: C.amber, fontWeight: 700, marginTop: "6px" }}>${Number(item.price).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.slate}`, borderRadius: "8px", overflow: "hidden" }}>
                  <button onClick={() => onUpdateCart(item.id, item.qty - 1)} style={{ background: C.navyLight, border: "none", color: C.white, padding: "6px 12px", cursor: "pointer" }}>−</button>
                  <span style={{ padding: "6px 14px", color: C.white, background: C.navyMid, fontSize: "14px" }}>{item.qty}</span>
                  <button onClick={() => onUpdateCart(item.id, item.qty + 1)} style={{ background: C.navyLight, border: "none", color: C.white, padding: "6px 12px", cursor: "pointer" }}>+</button>
                </div>
                <div style={{ color: C.white, fontWeight: 700, minWidth: "70px", textAlign: "right" }}>${(Number(item.price) * item.qty).toLocaleString()}</div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "18px" }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: "320px", flexShrink: 0 }}>
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "24px", position: "sticky", top: "80px" }}>
            <h3 style={{ color: C.white, fontWeight: 700, marginBottom: "20px" }}>Order Summary</h3>
            {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Shipping", shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`], ["Tax (8%)", `$${tax.toFixed(2)}`]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", color: C.gray300, fontSize: "14px", marginBottom: "12px" }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <hr style={{ border: `0.5px solid ${C.slate}`, margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: C.white, fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>
              <span>Total</span><span style={{ color: C.amber }}>${total.toFixed(2)}</span>
            </div>
            <Btn size="lg" onClick={() => onNavigate("checkout")} style={{ width: "100%" }}>Proceed to Checkout →</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CHECKOUT PAGE
// ============================================================
const CheckoutPage = ({ cart, onPlaceOrder, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", payMethod: "card", card: "", expiry: "", cvv: "" });
  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0) * 1.08;

  if (cart.length === 0) return <EmptyState icon="🛒" title="Your cart is empty" btnText="Shop Now" onBtn={() => onNavigate("products")} />;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>Checkout</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
        {["Shipping", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: step > i + 1 ? C.green : step === i + 1 ? C.amber : C.slate, color: step > i + 1 ? "#fff" : step === i + 1 ? C.navy : C.gray500, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ color: step === i + 1 ? C.amber : C.gray500, fontWeight: step === i + 1 ? 600 : 400, fontSize: "14px" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: "1px", background: C.slate, margin: "0 16px" }} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          {step === 1 && (
            <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: C.white, marginBottom: "20px", fontWeight: 700 }}>Shipping Information</h3>
              <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />
              <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="john@example.com" />
              <Input label="Street Address" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="123 Main St" />
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}><Input label="City" value={form.city} onChange={v => setForm({ ...form, city: v })} placeholder="New York" /></div>
                <div style={{ width: "100px" }}><Input label="ZIP" value={form.zip} onChange={v => setForm({ ...form, zip: v })} placeholder="10001" /></div>
              </div>
              <Btn size="lg" onClick={() => setStep(2)} style={{ width: "100%" }}>Continue to Payment →</Btn>
            </div>
          )}
          {step === 2 && (
            <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: C.white, marginBottom: "20px", fontWeight: 700 }}>Payment Method</h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {[["card", "💳 Card"], ["paypal", "🅿️ PayPal"]].map(([val, label]) => (
                  <button key={val} onClick={() => setForm({ ...form, payMethod: val })}
                    style={{ flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, border: `2px solid ${form.payMethod === val ? C.amber : C.slate}`, background: form.payMethod === val ? "rgba(245,158,11,0.1)" : C.navyLight, color: form.payMethod === val ? C.amber : C.gray300 }}>
                    {label}
                  </button>
                ))}
              </div>
              {form.payMethod === "card" && (
                <>
                  <Input label="Card Number" value={form.card} onChange={v => setForm({ ...form, card: v })} placeholder="1234 5678 9012 3456" />
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}><Input label="Expiry" value={form.expiry} onChange={v => setForm({ ...form, expiry: v })} placeholder="MM/YY" /></div>
                    <div style={{ width: "100px" }}><Input label="CVV" value={form.cvv} onChange={v => setForm({ ...form, cvv: v })} placeholder="123" /></div>
                  </div>
                </>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
                <Btn size="lg" onClick={() => setStep(3)} style={{ flex: 1 }}>Review Order →</Btn>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "28px" }}>
              <h3 style={{ color: C.white, marginBottom: "20px", fontWeight: 700 }}>Review Your Order</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", color: C.gray300, marginBottom: "10px", fontSize: "14px" }}>
                  <span>{item.image} {item.name} × {item.qty}</span>
                  <span style={{ color: C.white, fontWeight: 600 }}>${(Number(item.price) * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <hr style={{ border: `0.5px solid ${C.slate}`, margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", color: C.amber, fontWeight: 700, fontSize: "18px", marginBottom: "20px" }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
                <Btn size="lg" onClick={() => onPlaceOrder(form)} style={{ flex: 1 }}>🔒 Place Order</Btn>
              </div>
              <p style={{ color: C.gray500, fontSize: "12px", textAlign: "center", marginTop: "12px" }}>Protected by 256-bit SSL encryption</p>
            </div>
          )}
        </div>
        <div style={{ width: "260px", flexShrink: 0 }}>
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px" }}>
            <h4 style={{ color: C.white, marginBottom: "14px", fontWeight: 600 }}>Order ({cart.length} items)</h4>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "24px" }}>{item.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.white, fontSize: "12px", fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: C.amber, fontSize: "13px", fontWeight: 700 }}>${item.price} × {item.qty}</div>
                </div>
              </div>
            ))}
            <hr style={{ border: `0.5px solid ${C.slate}`, margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: C.amber, fontWeight: 700 }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LOGIN PAGE — REAL SUPABASE AUTH ONLY. NO FAKE LOGIN.
// ============================================================
const LoginPage = ({ onLogin, onNavigate, supabase: sb }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (mode === "register" && !form.name) { setError("Please enter your full name."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: err } = await sb.auth.signInWithPassword({ email: form.email, password: form.password });
        if (err) throw err;
        onLogin({ name: data.user.user_metadata?.full_name || form.email.split("@")[0], email: data.user.email, isAdmin: data.user.email.includes("admin"), id: data.user.id });
      } else {
        const { data, error: err } = await sb.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } });
        if (err) throw err;
        if (!data.user) throw new Error("Please check your email to confirm your account.");
        onLogin({ name: form.name, email: data.user.email, isAdmin: false, id: data.user.id });
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
          <h1 style={{ color: C.white, fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p style={{ color: C.gray500, marginTop: "8px" }}>{mode === "login" ? "Sign in to your NexStore account" : "Join thousands of happy shoppers"}</p>
        </div>
        <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "20px", padding: "32px" }}>
          {mode === "register" && <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />}
          <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="Min. 6 characters" />
          <ErrorBox message={error} />
          <Btn size="lg" onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Btn>
        </div>
        <p style={{ textAlign: "center", color: C.gray500, marginTop: "20px", fontSize: "14px" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: C.amber, cursor: "pointer" }} onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================
const DashboardPage = ({ user, onNavigate, orders }) => (
  <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
      <div>
        <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "4px" }}>Hello, {user.name} 👋</h1>
        <p style={{ color: C.gray500 }}>Welcome back to your dashboard</p>
      </div>
      <Btn onClick={() => onNavigate("products")}>Continue Shopping →</Btn>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
      {[
        { icon: "📦", label: "Total Orders", value: orders.length, color: C.amber },
        { icon: "💰", label: "Total Spent", value: `$${orders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2)}`, color: C.green },
        { icon: "✅", label: "Delivered", value: orders.filter(o => o.status === "delivered").length, color: C.green },
        { icon: "⏳", label: "Processing", value: orders.filter(o => o.status === "processing").length, color: "#8B5CF6" },
      ].map(s => (
        <div key={s.label} style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>{s.icon}</div>
          <div style={{ color: s.color, fontSize: "28px", fontWeight: 800 }}>{s.value}</div>
          <div style={{ color: C.gray500, fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: C.white, fontWeight: 700 }}>Recent Orders</h3>
        <Btn variant="ghost" size="sm" onClick={() => onNavigate("orders")}>View All →</Btn>
      </div>
      {orders.length === 0 ? (
        <p style={{ color: C.gray500, textAlign: "center", padding: "24px" }}>No orders yet. Start shopping!</p>
      ) : (
        orders.slice(0, 5).map((order, i) => (
          <div key={order.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.slate}`, flexWrap: "wrap", gap: "8px" }}>
            <div>
              <div style={{ color: C.white, fontWeight: 600, fontSize: "14px" }}>Order #{order.id}</div>
              <div style={{ color: C.gray500, fontSize: "12px" }}>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>${Number(order.total).toFixed(2)}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px", background: "rgba(245,158,11,0.15)", color: C.amber }}>{order.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ============================================================
// ORDERS PAGE
// ============================================================
const OrdersPage = ({ orders }) => (
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
    <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>Order History</h1>
    {orders.length === 0 ? (
      <EmptyState icon="📦" title="No orders yet" message="Your orders will appear here after you make a purchase." />
    ) : (
      orders.map((order, i) => (
        <div key={order.id || i} style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ color: C.amber, fontWeight: 700, fontSize: "15px" }}>Order #{order.id}</div>
              <div style={{ color: C.gray500, fontSize: "13px", marginTop: "4px" }}>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: C.white, fontWeight: 800, fontSize: "20px" }}>${Number(order.total).toFixed(2)}</div>
              <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "100px", background: "rgba(245,158,11,0.15)", color: C.amber }}>{order.status}</span>
            </div>
          </div>
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${C.slate}` }}>
              {order.items.map((item, j) => (
                <div key={j} style={{ color: C.gray300, fontSize: "13px", marginBottom: "4px" }}>
                  {item.image} {item.name} × {item.qty} — ${(Number(item.price) * item.qty).toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

// ============================================================
// WISHLIST PAGE
// ============================================================
const WishlistPage = ({ wishlist, onAddToCart, onWishlist, onNavigate, products }) => {
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0) return <EmptyState icon="♡" title="Your wishlist is empty" message="Save products you love for later." btnText="Discover Products →" onBtn={() => onNavigate("products")} />;
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: C.white, fontSize: "36px", fontWeight: 800, marginBottom: "32px" }}>My Wishlist ({items.length})</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {items.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onWishlist={onWishlist} onNavigate={onNavigate} />)}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN PAGE
// ============================================================
const AdminPage = ({ user, products, supabase: sb }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [localProducts, setLocalProducts] = useState(products);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    sb.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setOrders(data); });
  }, []);

  useEffect(() => { setLocalProducts(products); }, [products]);

  if (!user?.isAdmin) return <EmptyState icon="🚫" title="Access Denied" message="Admin access required." />;

  const deleteProduct = async (id) => {
    await sb.from('products').delete().eq('id', id);
    setLocalProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: C.amber, fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>⚙️ Admin Panel</h1>
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: `1px solid ${C.slate}` }}>
        {["overview", "products", "orders"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 20px", color: activeTab === t ? C.amber : C.gray500, fontWeight: activeTab === t ? 700 : 400, textTransform: "capitalize", borderBottom: `2px solid ${activeTab === t ? C.amber : "transparent"}`, fontSize: "14px" }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[{ label: "Total Products", value: localProducts.length, icon: "🏪" }, { label: "Total Orders", value: orders.length, icon: "📦" }, { label: "Revenue", value: `$${orders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2)}`, icon: "💰" }, { label: "Processing", value: orders.filter(o => o.status === "processing").length, icon: "⏳" }].map(s => (
            <div key={s.label} style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "14px", padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{s.icon}</div>
              <div style={{ color: C.white, fontSize: "26px", fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: C.gray500, fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "products" && (
        <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.slate}` }}>
                {["Product", "Category", "Price", "Stock", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: C.gray500, fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localProducts.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: C.gray500 }}>No products yet. Add some in Supabase.</td></tr>
              ) : (
                localProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.slate}` }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "24px" }}>{p.image}</span>
                        <div style={{ color: C.white, fontWeight: 500, fontSize: "14px" }}>{p.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", color: C.gray300, fontSize: "13px" }}>{p.category}</td>
                    <td style={{ padding: "14px 20px", color: C.amber, fontWeight: 700 }}>${Number(p.price).toLocaleString()}</td>
                    <td style={{ padding: "14px 20px", color: p.stock < 10 ? C.red : C.green, fontWeight: 600, fontSize: "13px" }}>{p.stock}</td>
                    <td style={{ padding: "14px 20px" }}><Btn variant="danger" size="sm" onClick={() => deleteProduct(p.id)}>Delete</Btn></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.slate}` }}>
                {["Order ID", "Customer", "Date", "Total", "Status"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: C.gray500, fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: C.gray500 }}>No orders yet</td></tr>
              ) : (
                orders.map((o, i) => (
                  <tr key={o.id || i} style={{ borderBottom: `1px solid ${C.slate}` }}>
                    <td style={{ padding: "14px 20px", color: C.amber, fontWeight: 600, fontSize: "13px" }}>#{o.id}</td>
                    <td style={{ padding: "14px 20px", color: C.gray300, fontSize: "13px" }}>{o.user_email}</td>
                    <td style={{ padding: "14px 20px", color: C.gray300, fontSize: "13px" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 20px", color: C.white, fontWeight: 700 }}>${Number(o.total).toFixed(2)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", background: "rgba(245,158,11,0.15)", color: C.amber }}>{o.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ABOUT PAGE
// ============================================================
const AboutPage = () => (
  <div>
    <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 100%)`, padding: "100px 24px", textAlign: "center" }}>
      <h1 style={{ color: C.white, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "16px" }}>We're <span style={{ color: C.amber }}>NexStore</span></h1>
      <p style={{ color: C.gray300, maxWidth: "560px", margin: "0 auto", fontSize: "18px", lineHeight: 1.7 }}>The world's most curated technology marketplace. We believe exceptional products deserve exceptional experiences.</p>
    </div>
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
        {[{ icon: "🚀", title: "Our Mission", desc: "Make world-class technology accessible to everyone. We partner with top brands to bring authentic products at fair prices." }, { icon: "🏆", title: "Our Story", desc: "Founded in 2020, NexStore started as a passion project and has grown to serve over 500,000 customers across 120+ countries." }, { icon: "💡", title: "Our Values", desc: "Transparency, authenticity, and customer obsession drive everything we do. We stand behind every product with our 30-day guarantee." }].map(item => (
          <div key={item.title} style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "28px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.icon}</div>
            <h3 style={{ color: C.white, fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>{item.title}</h3>
            <p style={{ color: C.gray300, lineHeight: 1.7, fontSize: "14px", margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// CONTACT PAGE
// ============================================================
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ color: C.white, fontSize: "48px", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "12px" }}>Get in Touch</h1>
        <p style={{ color: C.gray500, fontSize: "18px" }}>Our team is here to help.</p>
      </div>
      {sent ? (
        <div style={{ background: C.navyMid, border: `1px solid ${C.green}`, borderRadius: "16px", padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
          <h3 style={{ color: C.white, fontSize: "24px", marginBottom: "8px" }}>Message Sent!</h3>
          <Btn onClick={() => setSent(false)} style={{ marginTop: "16px" }}>Send Another</Btn>
        </div>
      ) : (
        <div style={{ background: C.navyMid, border: `1px solid ${C.slate}`, borderRadius: "16px", padding: "32px" }}>
          <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="John Doe" />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="john@example.com" />
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: C.gray300, fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={5}
              style={{ width: "100%", background: C.navyLight, border: `1px solid ${C.slate}`, borderRadius: "8px", padding: "10px 14px", color: C.white, fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <Btn size="lg" onClick={() => setSent(true)} style={{ width: "100%" }}>Send Message →</Btn>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ORDER CONFIRM PAGE
// ============================================================
const OrderConfirmPage = ({ onNavigate }) => (
  <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: "600px", margin: "0 auto" }}>
    <div style={{ fontSize: "80px", marginBottom: "24px" }}>🎉</div>
    <h1 style={{ color: C.white, fontSize: "40px", fontWeight: 800, marginBottom: "16px" }}>Order Confirmed!</h1>
    <p style={{ color: C.gray300, marginBottom: "8px", fontSize: "16px" }}>Thank you! Your order has been saved to your account.</p>
    <div style={{ background: C.navyMid, border: `1px solid ${C.green}`, borderRadius: "14px", padding: "20px", marginBottom: "32px", marginTop: "24px" }}>
      <div style={{ color: C.green, fontWeight: 700, fontSize: "18px" }}>Estimated delivery: 3–5 business days</div>
    </div>
    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
      <Btn onClick={() => onNavigate("orders")}>View My Orders</Btn>
      <Btn variant="secondary" onClick={() => onNavigate("products")}>Continue Shopping</Btn>
    </div>
  </div>
);

// ============================================================
// FOOTER
// ============================================================
const Footer = ({ onNavigate }) => (
  <footer style={{ background: C.navy, borderTop: `1px solid ${C.slate}`, padding: "60px 24px 32px" }}>
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}>
        <div>
          <div style={{ color: C.white, fontWeight: 800, fontSize: "22px", marginBottom: "12px" }}>NexStore<span style={{ color: C.amber }}>.</span></div>
          <p style={{ color: C.gray500, fontSize: "13px", lineHeight: 1.7 }}>The world's most curated technology marketplace.</p>
        </div>
        {[{ title: "Shop", links: [["products", "All Products"], ["about", "About Us"], ["contact", "Contact"]] }, { title: "Support", links: [["contact", "Help Center"], ["contact", "Returns"], ["contact", "Warranty"]] }].map(col => (
          <div key={col.title}>
            <div style={{ color: C.white, fontWeight: 700, marginBottom: "14px" }}>{col.title}</div>
            {col.links.map(([page, label]) => (
              <button key={label} onClick={() => onNavigate(page)}
                style={{ display: "block", background: "none", border: "none", color: C.gray500, cursor: "pointer", padding: "4px 0", fontSize: "13px", textAlign: "left" }}
                onMouseEnter={e => e.target.style.color = C.amber}
                onMouseLeave={e => e.target.style.color = C.gray500}>
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.slate}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ color: C.gray500, fontSize: "13px" }}>© 2024 NexStore. All rights reserved.</span>
        <div style={{ display: "flex", gap: "16px" }}>
          {["💳 Secure Payments", "🚚 Free Shipping", "🔒 SSL Protected"].map(t => <span key={t} style={{ color: C.gray500, fontSize: "12px" }}>{t}</span>)}
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// APP ROOT — 100% REAL DATA, ZERO FAKE FALLBACKS
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Supabase
  useEffect(() => {
    supabase.from('products').select('*').order('id')
      .then(({ data }) => { if (data) setProducts(data); })
      .finally(() => setLoading(false));
  }, []);

  // Listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ name: session.user.user_metadata?.full_name || session.user.email.split("@")[0], email: session.user.email, isAdmin: session.user.email.includes("admin"), id: session.user.id });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser({ name: session.user.user_metadata?.full_name || session.user.email.split("@")[0], email: session.user.email, isAdmin: session.user.email.includes("admin"), id: session.user.id });
      } else {
        setUser(null);
        setOrders([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load this user's orders
  useEffect(() => {
    if (!user?.email) return;
    supabase.from('orders').select('*').eq('user_email', user.email).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOrders(data); });
  }, [user]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((pg, data = null) => {
    setPage(pg); setPageData(data); window.scrollTo(0, 0);
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
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

  const placeOrder = useCallback(async (shippingForm) => {
    const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0) * 1.08;
    try {
      await supabase.from('orders').insert({
        user_email: user?.email || shippingForm?.email || 'guest',
        user_id: user?.id || null,
        items: cart,
        total: parseFloat(total.toFixed(2)),
        status: 'processing',
        shipping_address: shippingForm || {},
      });
      if (user?.email) {
        const { data } = await supabase.from('orders').select('*').eq('user_email', user.email).order('created_at', { ascending: false });
        if (data) setOrders(data);
      }
    } catch (err) {
      console.log("Order error:", err.message);
    }
    setCart([]);
    navigate("confirm");
    showToast("Order placed successfully! 🎉");
  }, [cart, user, navigate, showToast]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    navigate("home");
    showToast("Signed out successfully");
  }, [navigate, showToast]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const commonProps = { onNavigate: navigate, onAddToCart: addToCart, wishlist, onWishlist: toggleWishlist, products };

  if (loading) {
    return (
      <div style={{ background: C.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🛍️</div>
        <div style={{ color: C.amber, fontWeight: 700, fontSize: "18px" }}>Loading NexStore...</div>
        <div style={{ color: C.gray500, fontSize: "14px" }}>Connecting to database</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage {...commonProps} />;
      case "products": return <ProductsPage {...commonProps} initCategory={pageData?.category || "All"} initSearch={pageData?.search || ""} />;
      case "product": return pageData ? <ProductDetailPage product={pageData} {...commonProps} /> : null;
      case "cart": return <CartPage cart={cart} onUpdateCart={updateCart} onRemove={id => setCart(c => c.filter(i => i.id !== id))} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} onPlaceOrder={placeOrder} onNavigate={navigate} />;
      case "login": return <LoginPage onLogin={u => { setUser(u); navigate("dashboard"); showToast(`Welcome back, ${u.name}!`); }} onNavigate={navigate} supabase={supabase} />;
      case "dashboard": return user ? <DashboardPage user={user} onNavigate={navigate} orders={orders} /> : <LoginPage onLogin={u => { setUser(u); navigate("dashboard"); }} onNavigate={navigate} supabase={supabase} />;
      case "orders": return <OrdersPage orders={orders} />;
      case "wishlist": return <WishlistPage {...commonProps} />;
      case "admin": return <AdminPage user={user} products={products} supabase={supabase} />;
      case "confirm": return <OrderConfirmPage onNavigate={navigate} />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      default: return <HomePage {...commonProps} />;
    }
  };

  return (
    <div style={{ background: C.navy, minHeight: "100vh", fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif" }}>
      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.navy}; } ::-webkit-scrollbar-thumb { background: ${C.slate}; border-radius: 3px; } @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <Nav page={page} onNavigate={navigate} cartCount={cartCount} user={user} onLogout={handleLogout} />
      <main style={{ minHeight: "calc(100vh - 64px)" }}>{renderPage()}</main>
      <Footer onNavigate={navigate} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
