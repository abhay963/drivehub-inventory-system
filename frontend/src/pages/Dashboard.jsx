import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  Package,
  IndianRupee,
  TrendingUp,
  Loader2,
  Activity,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ArrowRight,
  ShoppingCart,
  Gauge,
  Calendar,
  Tag,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Line,
} from "recharts";
import Layout from "../components/layout/Layout";
import {
  getInventorySummary,
  getVehicles,
} from "../services/vehicleService";

/* -------------------------------------------------------------------------- */
/*  Animation                                                                 */
/* -------------------------------------------------------------------------- */

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*  Theme                                                                     */
/* -------------------------------------------------------------------------- */

const CHART_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
];

const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "12px",
  fontSize: "12px",
  color: "#e4e4e7",
};

const formatINR = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

function StatCard({ icon: Icon, label, value, accent, hint }) {
  const accents = {
    red: {
      iconBg: "bg-red-600/15 border-red-500/25 text-red-400",
      bar: "from-red-500 to-rose-500",
    },
    emerald: {
      iconBg: "bg-emerald-600/15 border-emerald-500/25 text-emerald-400",
      bar: "from-emerald-500 to-teal-500",
    },
    violet: {
      iconBg: "bg-violet-600/15 border-violet-500/25 text-violet-400",
      bar: "from-violet-500 to-indigo-500",
    },
    amber: {
      iconBg: "bg-amber-600/15 border-amber-500/25 text-amber-400",
      bar: "from-amber-500 to-orange-500",
    },
    cyan: {
      iconBg: "bg-cyan-600/15 border-cyan-500/25 text-cyan-400",
      bar: "from-cyan-500 to-sky-500",
    },
    rose: {
      iconBg: "bg-rose-600/15 border-rose-500/25 text-rose-400",
      bar: "from-rose-500 to-pink-500",
    },
  };
  const a = accents[accent] || accents.red;

  return (
    <motion.div
      variants={item}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 hover:border-zinc-700 transition-all duration-300"
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${a.bar} opacity-60`}
      />
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${a.iconBg}`}
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <Activity className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-zinc-600">{hint}</p>}
    </motion.div>
  );
}

function ChartCard({ title, subtitle, icon: Icon, children, className = "", action }) {
  return (
    <motion.div
      variants={item}
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-zinc-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ProgressRow({ label, value, max, color = "bg-red-500" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-zinc-400 font-medium truncate pr-2">{label}</span>
        <span className="text-zinc-300 tabular-nums shrink-0">
          {value} <span className="text-zinc-600">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-full text-xs text-zinc-500">
      No data available
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                 */
/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalModels: 0,
    totalStock: 0,
    totalValue: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user role from localStorage or auth state
  // Adjust this depending on how your app stores user role (e.g., localStorage.getItem('role') or user.role)
  const userRole = localStorage.getItem("role") || "user"; 
  const isUser = userRole.toLowerCase() === "user";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [summaryData, vehicleData] = await Promise.all([
        getInventorySummary(),
        getVehicles().catch(() => []),
      ]);
      setSummary({
        totalModels: summaryData.totalModels ?? 0,
        totalStock: summaryData.totalStock ?? 0,
        totalValue: summaryData.totalInventoryValue ?? 0,
      });
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory summary.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived metrics ──────────────────────────────────────────────────── */

  const outOfStock = useMemo(
    () => vehicles.filter((v) => Number(v.quantity) === 0),
    [vehicles]
  );

  const lowStock = useMemo(
    () =>
      vehicles.filter((v) => {
        const q = Number(v.quantity);
        return q > 0 && q <= 3;
      }),
    [vehicles]
  );

  const healthyStock = useMemo(
    () => vehicles.filter((v) => Number(v.quantity) > 3),
    [vehicles]
  );

  const avgPrice = useMemo(() => {
    if (!vehicles.length) return 0;
    const sum = vehicles.reduce((a, v) => a + (Number(v.price) || 0), 0);
    return Math.round(sum / vehicles.length);
  }, [vehicles]);

  const categoryCount = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.category).filter(Boolean));
    return set.size;
  }, [vehicles]);

  const categoryData = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => {
      const key = v.category || "Other";
      map[key] = (map[key] || 0) + (Number(v.quantity) || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [vehicles]);

  const brandData = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => {
      const key = v.brand || "Unknown";
      map[key] = (map[key] || 0) + (Number(v.quantity) || 0);
    });
    return Object.entries(map)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 8);
  }, [vehicles]);

  const valueByCategory = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => {
      const key = v.category || "Other";
      map[key] =
        (map[key] || 0) + (Number(v.price) || 0) * (Number(v.quantity) || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [vehicles]);

  const yearData = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => {
      const y = String(v.year || "N/A");
      map[y] = (map[y] || 0) + (Number(v.quantity) || 0);
    });
    return Object.entries(map)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [vehicles]);

  const priceBands = useMemo(() => {
    const bands = [
      { name: "< ₹5L", min: 0, max: 500000, count: 0 },
      { name: "₹5–15L", min: 500000, max: 1500000, count: 0 },
      { name: "₹15–40L", min: 1500000, max: 4000000, count: 0 },
      { name: "₹40L–1Cr", min: 4000000, max: 10000000, count: 0 },
      { name: "₹1Cr+", min: 10000000, max: Infinity, count: 0 },
    ];
    vehicles.forEach((v) => {
      const p = Number(v.price) || 0;
      const band = bands.find((b) => p >= b.min && p < b.max);
      if (band) band.count += Number(v.quantity) || 0;
    });
    return bands;
  }, [vehicles]);

  const stockHealthRadar = useMemo(() => {
    const total = vehicles.length || 1;
    return [
      {
        metric: "In stock",
        score: Math.round((healthyStock.length / total) * 100),
      },
      {
        metric: "Low stock",
        score: Math.round((lowStock.length / total) * 100),
      },
      {
        metric: "Out of stock",
        score: Math.round((outOfStock.length / total) * 100),
      },
      {
        metric: "Categories",
        score: Math.min(100, categoryCount * 14),
      },
      {
        metric: "Brand mix",
        score: Math.min(100, brandData.length * 12),
      },
    ];
  }, [vehicles, healthyStock, lowStock, outOfStock, categoryCount, brandData]);

  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const stock = summary.totalStock || 1;
    const value = summary.totalValue || 1;
    return months.map((month, i) => {
      const factor = 0.55 + i * 0.07;
      return {
        month,
        stock: Math.max(
          1,
          Math.round(stock * factor * (0.9 + (i % 3) * 0.05))
        ),
        value: Math.round(value * factor * (0.85 + (i % 2) * 0.08)),
        purchases: Math.max(1, Math.round(stock * 0.08 * (1 + (i % 4) * 0.2))),
      };
    });
  }, [summary]);

  const maxCategoryUnits = useMemo(
    () => Math.max(1, ...categoryData.map((c) => c.value), 1),
    [categoryData]
  );

  const activityFeed = useMemo(() => {
    const events = [];
    lowStock.slice(0, 3).forEach((v) => {
      events.push({
        type: "low",
        text: `${v.brand} ${v.model} is low (${v.quantity} left)`,
        icon: AlertTriangle,
        color: "text-amber-400",
      });
    });
    outOfStock.slice(0, 2).forEach((v) => {
      events.push({
        type: "out",
        text: `${v.brand} ${v.model} is out of stock`,
        icon: XCircle,
        color: "text-rose-400",
      });
    });
    if (vehicles.length) {
      events.push({
        type: "ok",
        text: `${vehicles.length} models loaded in catalog`,
        icon: CheckCircle2,
        color: "text-emerald-400",
      });
    }
    events.push({
      type: "sync",
      text: "Inventory summary synchronized",
      icon: RefreshCw,
      color: "text-cyan-400",
    });
    return events.slice(0, 6);
  }, [vehicles, lowStock, outOfStock]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Loading dashboard…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        {/* Header */}
        <motion.div
          variants={item}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Live inventory · control center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500 max-w-xl">
              Fleet overview, stock health, valuation mix, and quick actions for
              your dealership inventory system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchData();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 py-2 text-[13px] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3.5 py-2 text-[13px] text-zinc-300 hover:text-white transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              Inventory
            </Link>
            {!isUser && (
              <Link
                to="/add-vehicle"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 text-[13px] shadow-lg shadow-red-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add vehicle
              </Link>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            variants={item}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          >
            {error}
          </motion.div>
        )}

        {/* KPI row — remaining cards (Low stock, Out of stock, and Categories cards removed) */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Car}
            label="Models"
            value={summary.totalModels.toLocaleString()}
            accent="red"
            hint="Unique SKUs"
          />
          <StatCard
            icon={Package}
            label="Total stock"
            value={summary.totalStock.toLocaleString()}
            accent="emerald"
            hint="Units on hand"
          />
          <StatCard
            icon={IndianRupee}
            label="Inventory value"
            value={formatINR(summary.totalValue)}
            accent="violet"
            hint="Price × qty"
          />
        </div>

        {/* Insight + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div
            variants={item}
            className="lg:col-span-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Avg. value / unit
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {summary.totalStock > 0
                      ? formatINR(
                          Math.round(summary.totalValue / summary.totalStock)
                        )
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Healthy SKUs
                </p>
                <p className="text-lg font-bold text-white">
                  {healthyStock.length}{" "}
                  <span className="text-sm font-medium text-zinc-500">
                    with qty &gt; 3
                  </span>
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Avg. list price
                </p>
                <p className="text-lg font-bold text-white tabular-nums">
                  {formatINR(avgPrice)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex flex-col justify-center gap-2"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              Quick actions
            </p>
            {!isUser && (
              <Link
                to="/add-vehicle"
                className="flex items-center gap-2 text-[13px] text-zinc-300 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-red-400" /> Add vehicle
                <ArrowRight className="w-3 h-3 ml-auto text-zinc-600" />
              </Link>
            )}
            <Link
              to="/inventory"
              className="flex items-center gap-2 text-[13px] text-zinc-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" /> Purchase
              / restock
              <ArrowRight className="w-3 h-3 ml-auto text-zinc-600" />
            </Link>
            <Link
              to="/inventory"
              className="flex items-center gap-2 text-[13px] text-zinc-300 hover:text-white transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Search catalog
              <ArrowRight className="w-3 h-3 ml-auto text-zinc-600" />
            </Link>
          </motion.div>
        </div>

        {/* Charts row 1 — trend + category pie */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <ChartCard
            title="Inventory trend"
            subtitle="Stock, valuation & simulated purchases"
            icon={BarChart3}
            className="xl:col-span-3"
          >
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <defs>
                    <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#3f3f46" }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(v) =>
                      v >= 1e7
                        ? `${(v / 1e7).toFixed(1)}Cr`
                        : v >= 1e5
                        ? `${(v / 1e5).toFixed(0)}L`
                        : v
                    }
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => {
                      if (name === "value")
                        return [formatINR(value), "Value"];
                      if (name === "purchases")
                        return [value, "Purchases"];
                      return [value, "Stock"];
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="stock"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#stockFill)"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="purchases"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={18}
                    opacity={0.85}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stock by category"
            subtitle="Units currently on hand"
            icon={PieIcon}
            className="xl:col-span-2"
          >
            <div className="h-[280px] w-full">
              {categoryData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="46%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categoryData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => [`${value} units`, name]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      formatter={(v) => (
                        <span className="text-zinc-400 text-[11px]">{v}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Stock health + category progress + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ChartCard
            title="Stock health radar"
            subtitle="Share of catalog by status"
            icon={Gauge}
          >
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stockHealthRadar}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#52525b", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.25}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Category share"
            subtitle="Progress vs largest segment"
            icon={Layers}
          >
            <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
              {categoryData.length === 0 ? (
                <EmptyChart />
              ) : (
                categoryData.map((c, i) => (
                  <ProgressRow
                    key={c.name}
                    label={c.name}
                    value={c.value}
                    max={maxCategoryUnits}
                    color={
                      [
                        "bg-red-500",
                        "bg-orange-500",
                        "bg-amber-500",
                        "bg-emerald-500",
                        "bg-cyan-500",
                        "bg-violet-500",
                        "bg-pink-500",
                      ][i % 7]
                    }
                  />
                ))
              )}
            </div>
          </ChartCard>

          <ChartCard title="Activity feed" subtitle="Stock alerts & sync" icon={Activity}>
            <ul className="space-y-3 max-h-[240px] overflow-y-auto">
              {activityFeed.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[13px] text-zinc-300"
                >
                  <e.icon className={`w-4 h-4 mt-0.5 shrink-0 ${e.color}`} />
                  <span>{e.text}</span>
                </li>
              ))}
              {activityFeed.length === 0 && (
                <li className="text-sm text-zinc-500">No activity yet.</li>
              )}
            </ul>
          </ChartCard>
        </div>

        {/* Brand + value charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard
            title="Top brands by units"
            subtitle="Highest stock on the lot"
            icon={Car}
          >
            <div className="h-[260px] w-full">
              {brandData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={brandData}
                    layout="vertical"
                    margin={{ left: 4 }}
                  >
                    <CartesianGrid
                      stroke="#27272a"
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={88}
                      tick={{ fill: "#a1a1aa", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v} units`, "Stock"]}
                    />
                    <Bar
                      dataKey="units"
                      fill="#ef4444"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Value by category"
            subtitle="Price × quantity"
            icon={IndianRupee}
          >
            <div className="h-[260px] w-full">
              {valueByCategory.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueByCategory}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                      tickFormatter={(v) =>
                        v >= 1e7
                          ? `${(v / 1e7).toFixed(1)}Cr`
                          : v >= 1e5
                          ? `${(v / 1e5).toFixed(0)}L`
                          : v
                      }
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [formatINR(v), "Value"]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#8b5cf6"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Year + price bands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard
            title="Stock by model year"
            subtitle="Units grouped by year"
            icon={Calendar}
          >
            <div className="h-[240px] w-full">
              {yearData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={{ stroke: "#3f3f46" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v} units`, "Stock"]}
                    />
                    <Bar
                      dataKey="units"
                      fill="#06b6d4"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>

          <ChartCard
            title="Price distribution bands"
            subtitle="Units by pricing bracket"
            icon={Tag}
          >
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceBands}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#3f3f46" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => [`${v} units`, "Models"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;