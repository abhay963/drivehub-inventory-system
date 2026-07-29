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
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Animations                                                                */
/* -------------------------------------------------------------------------- */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Locations", href: "#locations" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
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
        width:28px;height:28px;border-radius:50%;
        background:#dc2626;border:3px solid #fca5a5;
        box-shadow:0 0 0 6px rgba(220,38,38,0.25);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    LOCATIONS.forEach((loc) => {
      L.marker(loc.coords, { icon })
        .addTo(map)
        .bindPopup(
          `<strong style="color:#111">${loc.name}</strong><br/><span style="color:#555">${loc.detail}</span>`
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
      className="h-[360px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-zinc-800 z-0"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden"
    >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-[120px] pointer-events-none" />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="relative z-50 sticky top-0 border-b border-zinc-900/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/40">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-widest uppercase bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
              DriveHub
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2.5 shadow-lg shadow-red-600/25 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-900 px-6 py-5 space-y-4 bg-zinc-950">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-zinc-400 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 pt-16 sm:pt-24 pb-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 space-y-6 relative z-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase"
          >
            <Zap className="w-3.5 h-3.5" />
            Premium dealership inventory
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08]"
          >
            Command Your{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              Entire Inventory
            </span>{" "}
            With Precision.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed"
          >
            DriveHub gives dealerships a clear, modern way to manage every vehicle
            on the lot — search, sell, restock, and stay in control from one
            elegant platform.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
          >
            <Link
              to="/register"
              className="flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              <Lock className="w-4 h-4 text-zinc-500" />
              Dealer Sign In
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-500 hover:text-white transition-colors px-2"
            >
              See features
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900/80"
          >
            {[
              ["$450M+", "Fleet value managed"],
              ["99.9%", "Reliability"],
              ["Secure", "Team access"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {value}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">
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
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div
              className="h-80 sm:h-96 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-xl bg-zinc-900/80 border border-zinc-700/40 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                  Featured allocation
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  2026 GT-R NISMO Track Ed.
                </h4>
                <p className="text-xs text-zinc-400">
                  Available stock:{" "}
                  <span className="text-emerald-400 font-semibold">3 units</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Logo / trust strip ───────────────────────────────────────────── */}
      <section className="border-y border-zinc-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          <span>Live Inventory</span>
          <span>Secure Access</span>
          <span>Multi-Location</span>
          <span>Instant Search</span>
          <span>Sales Ready</span>
          <span>Always Synced</span>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section id="stats" className="py-24 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              By the numbers
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Built to scale with your lot
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Real results for dealerships that demand accuracy, speed, and control.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 hover:border-red-600/40 transition-colors"
              >
                <s.icon className="w-5 h-5 text-red-500 mb-4" />
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-red-600/25 transition-all"
            >
              Start tracking inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:text-white font-semibold px-8 py-3.5 rounded-2xl transition-all"
            >
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="border-t border-zinc-900 bg-zinc-950/50 py-24 px-6 sm:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Core capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything your dealership needs — refined and ready
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Secure access, powerful search, effortless sales, and clear oversight
              in one premium experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 hover:border-red-600/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 sm:px-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From setup to daily operations in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7"
              >
                <span className="text-4xl font-black text-red-600/30">
                  {s.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
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
        className="py-24 px-6 sm:px-8 border-t border-zinc-900 bg-zinc-950/50"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              Locations
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Multi-city inventory, one operating system
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Manage every rooftop from a single view. Each location stays
              synchronized so your team always works with accurate stock.
            </p>

            <ul className="space-y-3">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.name}
                  className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5"
                >
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {loc.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{loc.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              Onboard your dealership
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <DealershipMap />
            <p className="mt-3 text-[11px] text-zinc-600 text-center">
              Interactive map · sample locations across India
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
              Field notes
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trusted on the sales floor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 text-red-500 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-red-500" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 px-6 sm:px-8 border-t border-zinc-900 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative text-center">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-10 sm:p-14 shadow-2xl">
            <Package className="w-10 h-10 text-red-500 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Put your lot in order today
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8">
              Create your account, invite your team, and start managing inventory
              with clarity and confidence. Built for modern dealerships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all"
              >
                Create account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-950/50 text-zinc-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all"
              >
                <Lock className="w-4 h-4" />
                Sign in
              </Link>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-500">
              <a
                href="mailto:hello@drivehub.app"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-red-500" />
                hello@drivehub.app
              </a>
              <span className="hidden sm:inline text-zinc-700">·</span>
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-red-500" />
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 px-6 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-widest text-zinc-200 uppercase text-sm">
                DriveHub
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Premium inventory management for modern car dealerships. Search,
              sell, restock, and stay in complete control of every vehicle on
              the lot.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Product
            </p>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#locations" className="hover:text-white transition-colors">
                Locations
              </a>
              <a href="#stats" className="hover:text-white transition-colors">
                Stats
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Account
            </p>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
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

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} DriveHub. All rights reserved.</p>
          <p>Premium Dealership Inventory</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Landing;