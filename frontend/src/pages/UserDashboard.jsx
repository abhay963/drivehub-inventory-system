import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  Package,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Loader2,
  Calendar,
  Tag,
  IndianRupee,
} from "lucide-react";
import { getInventorySummary, getVehicles } from "../services/vehicleService";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

const formatINR = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const UserDashboard = () => {
  const [summary, setSummary] = useState({
    totalModels: 0,
    totalStock: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || user?.username || "Customer";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, vehicleData] = await Promise.all([
          getInventorySummary().catch(() => ({})),
          getVehicles().catch(() => []),
        ]);
        setSummary({
          totalModels: summaryData.totalModels ?? 0,
          totalStock: summaryData.totalStock ?? 0,
        });
        setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      } catch (err) {
        console.error("Failed to load user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ready to purchase: count of vehicles with stock > 0
  const readyToPurchaseCount = useMemo(() => {
    return vehicles.filter((v) => Number(v.quantity) > 0).length;
  }, [vehicles]);

  // Latest available vehicles (e.g. 4-6 cards)
  const availableVehicles = useMemo(() => {
    return vehicles.slice(0, 6);
  }, [vehicles]);

  // Recently added vehicles (sorted by creation date or array slice)
  const recentlyAddedVehicles = useMemo(() => {
    return [...vehicles]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [vehicles]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading catalog…</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12 text-zinc-100"
    >
      {/* 1. Welcome Section */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Browse and purchase vehicles from our premium inventory with live stock status and instant checkout options.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link
            to="/inventory"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3.5 text-sm shadow-xl shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
          >
            Browse Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* 2. Three simple summary cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
        <motion.div
          variants={item}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-red-500 to-rose-500 opacity-60" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-400">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Available Models
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white tabular-nums">
            {summary.totalModels}
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Total Cars In Stock
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white tabular-nums">
            {summary.totalStock}
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-600/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Ready To Purchase
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white tabular-nums">
            {readyToPurchaseCount}
          </p>
        </motion.div>
      </div>

      {/* 4 & 5. Display Latest 4-6 Available Vehicles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Featured Vehicles
          </h2>
          <Link
            to="/inventory"
            className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            View all catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableVehicles.map((vehicle) => {
            const isOutOfStock = Number(vehicle.quantity) === 0;
            return (
              <motion.div
                variants={item}
                key={vehicle._id || vehicle.id}
                className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 overflow-hidden flex flex-col transition-all duration-300"
              >
                {/* Vehicle image placeholder or tag */}
                <div className="h-44 bg-zinc-950/60 border-b border-zinc-800/60 relative p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                      <Tag className="w-3 h-3 text-red-500" />
                      {vehicle.category || "General"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        isOutOfStock
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {isOutOfStock ? "Out of Stock" : `${vehicle.quantity} in stock`}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                  </div>
                </div>

                {/* Specs & Price */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Year: {vehicle.year || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-800/50">
                      <Package className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Stock: {vehicle.quantity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
                        Price
                      </p>
                      <p className="text-lg font-bold text-white tabular-nums">
                        {formatINR(vehicle.price)}
                      </p>
                    </div>

                    {/* Purchase Button */}
                    <Link
                      to={isOutOfStock ? "#" : `/inventory`}
                      onClick={(e) => isOutOfStock && e.preventDefault()}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                        isOutOfStock
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                          : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {isOutOfStock ? "Out of Stock" : "Purchase"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. Recently Added Vehicles Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Recently Added Vehicles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyAddedVehicles.map((vehicle) => {
            const isOutOfStock = Number(vehicle.quantity) === 0;
            return (
              <motion.div
                variants={item}
                key={`recent-${vehicle._id || vehicle.id}`}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 space-y-3 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-red-500">
                      {vehicle.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {vehicle.model}
                    </h4>
                  </div>
                  <span className="text-xs text-zinc-400 tabular-nums font-medium">
                    {vehicle.year}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                  <span className="text-xs font-bold text-white tabular-nums">
                    {formatINR(vehicle.price)}
                  </span>
                  <Link
                    to="/inventory"
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;