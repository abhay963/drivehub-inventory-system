import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import L from "leaflet";
import {
  Flame,
  Shield,
  Gauge,
  ArrowRight,
  Zap,
  Car,
  Lock,
  Menu,
  X,
  Search,
  Package,
  Users,
  MapPin,
  CheckCircle2,
  BarChart3,
  Clock,
  ShoppingCart,
  RefreshCw,
  Star,
  Phone,
  Mail,
  ChevronRight,
  KeyRound,
  Sparkles,
  Globe,
  Layers,
  Activity,
  Award,
  ChevronLeft,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Animations                                                                */
/* -------------------------------------------------------------------------- */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Locations", href: "#locations" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
];

const SHOWCASE_CARS = [
  {
    name: "2026 GT-R NISMO Track Ed.",
    category: "Supercar",
    price: "$225,000",
    stock: "3 units",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    hub: "Mumbai Flagship",
  },
  {
    name: "2025 Porsche 911 GT3 RS",
    category: "Track Performance",
    price: "$285,000",
    stock: "2 units",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    hub: "Bengaluru Hub",
  },
  {
    name: "2026 Lamborghini Revuelto",
    category: "Hybrid V12",
    price: "$608,000",
    stock: "1 unit",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop",
    hub: "Delhi NCR Operations",
  },
  {
    name: "2025 Ferrari 296 GTB",
    category: "Plug-in Hybrid",
    price: "$342,000",
    stock: "4 units",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop",
    hub: "Hyderabad EV Hub",
  },
  {
    name: "2026 Aston Martin Vantage",
    category: "Luxury Gran Tourer",
    price: "$191,000",
    stock: "5 units",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
    hub: "Mumbai Flagship",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Secure Access",
    desc: "Only authorized team members can add, update, or remove vehicles. Your inventory stays protected at every step.",
  },
  {
    icon: Search,
    title: "Instant Search",
    desc: "Find any vehicle by brand, model, category, or price in seconds — so your sales team never keeps a customer waiting.",
  },
  {
    icon: ShoppingCart,
    title: "Seamless Sales",
    desc: "Mark a unit as sold with one click. Stock levels update automatically so everyone works with live numbers.",
  },
  {
    icon: RefreshCw,
    title: "Easy Restocking",
    desc: "Add new arrivals or replenish existing models in moments. Keep every rooftop accurately stocked.",
  },
  {
    icon: Package,
    title: "Complete Records",
    desc: "Every vehicle is tracked with make, model, category, price, and quantity — a single source of truth for the entire lot.",
  },
  {
    icon: BarChart3,
    title: "Clear Overview",
    desc: "See total models, units on hand, and overall inventory value at a glance. Start every day with full clarity.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up in minutes and give your team secure access to the platform.",
  },
  {
    step: "02",
    title: "Build your catalog",
    desc: "Add vehicles with brand, model, category, year, price, and quantity. Edit or remove anytime.",
  },
  {
    step: "03",
    title: "Sell & restock with ease",
    desc: "Search the fleet, close deals, and restock when new inventory arrives — all in one place.",
  },
];

const STATS = [
  { value: "5,200+", label: "Vehicles tracked", icon: Car },
  { value: "120+", label: "Active dealerships", icon: Users },
  { value: "99.9%", label: "Platform reliability", icon: Gauge },
  { value: "Instant", label: "Search results", icon: Zap },
  { value: "24/7", label: "Always in sync", icon: Clock },
  { value: "Secure", label: "Protected access", icon: KeyRound },
];

const LOCATIONS = [
  {
    name: "DriveHub Flagship — Mumbai",
    coords: [19.076, 72.8777],
    detail: "Primary inventory hub · 180+ units",
  },
  {
    name: "DriveHub — Bengaluru",
    coords: [12.9716, 77.5946],
    detail: "South region allocation · 95 units",
  },
  {
    name: "DriveHub — Delhi NCR",
    coords: [28.6139, 77.209],
    detail: "North operations · 140 units",
  },
  {
    name: "DriveHub — Hyderabad",
    coords: [17.385, 78.4867],
    detail: "EV & luxury focus · 70 units",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Sales and restocking finally live in one system. Our floor team stopped chasing spreadsheets the first week.",
    name: "Ananya Rao",
    role: "GM, Apex Auto Group",
  },
  {
    quote:
      "Only the right people can update or remove inventory. That peace of mind alone was worth the switch.",
    name: "Vikram Shah",
    role: "Operations, Sterling Motors",
  },
  {
    quote:
      "Finding cars by category and price is instant. Customers see what’s actually on the lot, not last week’s list.",
    name: "Meera Kapoor",
    role: "Sales Lead, Velocity Cars",
  },
];

/* -------------------------------------------------------------------------- */
/*  Leaflet map                                                               */
/* -------------------------------------------------------------------------- */

function DealershipMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:linear-gradient(135deg, #ef4444, #dc2626);border:2px solid rgba(255,255,255,0.4);
        box-shadow:0 0 20px rgba(239,68,68,0.6);
      "></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    LOCATIONS.forEach((loc) => {
      L.marker(loc.coords, { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:inherit;padding:4px;"><strong style="color:#000;font-size:14px;">${loc.name}</strong><br/><span style="color:#4b5563;font-size:12px;">${loc.detail}</span></div>`
        );
    });

    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-0"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#070709] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-red-600/15 via-rose-600/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] bg-red-900/10 blur-[160px] pointer-events-none" />
      <div className="absolute top-[60%] -right-[20%] w-[600px] h-[600px] bg-orange-600/10 blur-[160px] pointer-events-none" />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="relative z-50 sticky top-0 border-b border-white/10 bg-[#070709]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-wider uppercase bg-gradient-to-r from-white via-zinc-100 to-red-400 bg-clip-text text-transparent">
              DriveHub
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 bg-white/[0.02] border border-white/5 px-6 py-2.5 rounded-full backdrop-blur-md">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold px-5 py-2.5 shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-6 py-6 space-y-4 bg-[#070709]/95 backdrop-blur-2xl">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-semibold text-zinc-300 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-200 text-sm font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-600/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-10 pt-10 sm:pt-10 pb-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center ">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 space-y-8 relative z-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400 animate-spin" />
            Next-Gen Dealership Operating System
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]"
          >
            Command Your{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
              Entire Inventory
            </span>{" "}
            With Precision.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-normal"
          >
            DriveHub gives dealerships a clear, modern way to manage every vehicle
            on the lot — search, sell, restock, and stay in control from one
            elegant platform.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <Link
              to="/register"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-zinc-200 hover:text-white font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition-all"
            >
              <Lock className="w-4 h-4 text-zinc-400" />
              Dealer Sign In
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10"
          >
            {[
              ["$450M+", "Fleet value managed"],
              ["99.9%", "Reliability"],
              ["Secure", "Team access"],
            ].map(([value, label]) => (
              <div key={label} className="space-y-1">
                <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {value}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-5 relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-red-600/30 via-rose-600/20 to-orange-500/30 rounded-[32px] blur-2xl opacity-60 animate-pulse pointer-events-none" />
          <div className="relative rounded-[32px] overflow-hidden border border-white/15 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl">
            <div
              className="h-96 sm:h-[440px] bg-cover bg-center transform hover:scale-105 transition-transform duration-1000"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-2xl bg-black/60 border border-white/15 rounded-2xl flex items-center justify-between gap-4 shadow-2xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                  Featured allocation
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  2026 GT-R NISMO Track Ed.
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Available stock:{" "}
                  <span className="text-emerald-400 font-semibold">3 units</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600/30 to-rose-600/30 border border-red-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <Car className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Logo / trust strip ───────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.01] py-8 px-6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
          <span className="hover:text-zinc-300 transition-colors flex items-center gap-2"><Activity className="w-4 h-4 text-red-500" /> Live Inventory</span>
          <span className="hover:text-zinc-300 transition-colors flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> Secure Access</span>
          <span className="hover:text-zinc-300 transition-colors flex items-center gap-2"><Globe className="w-4 h-4 text-red-500" /> Multi-Location</span>
          <span className="hover:text-zinc-300 transition-colors flex items-center gap-2"><Zap className="w-4 h-4 text-red-500" /> Instant Search</span>
          <span className="hover:text-zinc-300 transition-colors flex items-center gap-2"><Award className="w-4 h-4 text-red-500" /> Sales Ready</span>
        </div>
      </section>

      {/* ── Interactive Image Card Slider Showcase ──────────────────────── */}
      <section id="showcase" className="py-28 px-6 sm:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
                Live Lot Showcase
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Explore available premium units
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollSlider("left")}
                className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Row */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 sm:px-10 pb-8 scrollbar-none no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SHOWCASE_CARS.map((car, idx) => (
            <div
              key={car.name}
              className="min-w-[320px] sm:min-w-[400px] lg:min-w-[440px] snap-start rounded-[32px] overflow-hidden border border-white/15 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl group flex flex-col justify-between shrink-0"
            >
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${car.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white uppercase tracking-wider">
                    {car.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-red-600/80 backdrop-blur-md text-[11px] font-bold text-white shadow-lg">
                    {car.stock}
                  </span>
                </div>
              </div>
              <div className="p-7 space-y-4 bg-gradient-to-b from-transparent to-black/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {car.hub}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block font-semibold">Price</span>
                    <span className="text-lg font-black text-emerald-400">{car.price}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Ready for immediate delivery</span>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-red-600 px-4 py-2 rounded-xl transition-all"
                  >
                    Reserve Unit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section id="stats" className="py-28 px-6 sm:px-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              By the numbers
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Built to scale with your lot
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Real results for dealerships that demand accuracy, speed, and control.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 hover:border-red-500/50 hover:bg-white/[0.06] transition-all duration-300 group shadow-xl backdrop-blur-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                  {s.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-9 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all"
            >
              Start tracking inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white font-semibold px-9 py-4 rounded-2xl backdrop-blur-md transition-all"
            >
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="border-t border-white/10 bg-[#09090d] py-28 px-6 sm:px-10 relative"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Core capabilities
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Everything your dealership needs — refined and ready
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Secure access, powerful search, effortless sales, and clear oversight
              in one premium experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-[28px] bg-white/[0.02] border border-white/10 space-y-5 hover:border-red-500/40 hover:bg-white/[0.05] transition-all duration-300 group backdrop-blur-xl shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 sm:px-10 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Workflow
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              From setup to daily operations in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 hover:border-red-500/30 transition-all group"
              >
                <span className="text-5xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent opacity-40 group-hover:opacity-100 transition-opacity">
                  {s.step}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map / locations ──────────────────────────────────────────────── */}
      <section
        id="locations"
        className="py-28 px-6 sm:px-10 border-t border-white/10 bg-[#09090d]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              Locations
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Multi-city inventory, one operating system
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Manage every rooftop from a single view. Each location stays
              synchronized so your team always works with accurate stock.
            </p>

            <ul className="space-y-3.5">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.name}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md hover:border-red-500/40 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">
                      {loc.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{loc.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors pt-2"
            >
              Onboard your dealership
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <DealershipMap />
            <p className="mt-4 text-xs text-zinc-500 text-center uppercase tracking-widest font-semibold">
              Interactive map · sample locations across India
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 sm:px-10 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Field notes
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Trusted on the sales floor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 flex flex-col justify-between hover:border-red-500/40 transition-all shadow-2xl"
              >
                <div>
                  <div className="flex gap-1 text-red-500 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                    ))}
                  </div>
                  <p className="text-base text-zinc-300 leading-relaxed font-normal">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-base font-bold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 font-medium">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-28 px-6 sm:px-10 border-t border-white/10 relative overflow-hidden bg-[#09090d]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-red-600/20 to-orange-500/20 blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative text-center">
          <div className="rounded-[36px] border border-white/15 bg-black/40 backdrop-blur-2xl p-10 sm:p-16 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-xl">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Put your lot in order today
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Create your account, invite your team, and start managing inventory
              with clarity and confidence. Built for modern dealerships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-9 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02]"
              >
                Create account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white font-semibold px-9 py-4 rounded-2xl backdrop-blur-md transition-all"
              >
                <Lock className="w-4 h-4" />
                Sign in
              </Link>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-400 pt-8 border-t border-white/10">
              <a
                href="mailto:hello@drivehub.app"
                className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-red-500" />
                hello@drivehub.app
              </a>
              <span className="hidden sm:inline text-zinc-700">·</span>
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-red-500" />
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 sm:px-10 py-16 bg-[#050507]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-wider text-white uppercase text-sm">
                DriveHub
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Premium inventory management for modern car dealerships. Search,
              sell, restock, and stay in complete control of every vehicle on
              the lot.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Product
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#showcase" className="hover:text-white transition-colors">
                Showcase
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#locations" className="hover:text-white transition-colors">
                Locations
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Account
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <Link to="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-white transition-colors">
                Register
              </Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} DriveHub. All rights reserved.</p>
          <p className="uppercase tracking-widest font-semibold text-zinc-600">Premium Dealership Inventory</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Landing;