import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AIChat from "../components/chat/AIChat";

import {
  Car,
  Package,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Loader2,
  Calendar,
  Tag,
  X,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import {
  getInventorySummary,
  getVehicles,
  // ⚠️ Make sure this function exists in your vehicleService.
  // Typical signature: purchaseVehicle(vehicleId) → updates quantity + creates purchase history
  purchaseVehicle,
} from "../services/vehicleService";

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

const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, emoji: "💳" },
  { id: "upi", label: "UPI", icon: Smartphone, emoji: "📱" },
  { id: "netbanking", label: "Net Banking", icon: Building2, emoji: "🏦" },
  { id: "emi", label: "EMI", icon: Wallet, emoji: "💰" },
];

const UserDashboard = () => {
const [summary, setSummary] = useState({
  totalVehicles: 0,
  totalStock: 0,
});
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("summary"); // summary | processing | success
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingLabel, setProcessingLabel] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || user?.username || "Customer";

  const fetchData = async () => {
    try {
      const [summaryData, vehicleData] = await Promise.all([
        getInventorySummary().catch(() => ({})),
        getVehicles().catch(() => []),
      ]);
      setSummary({
  totalVehicles: summaryData.totalVehicles ?? 0,
  totalStock: summaryData.totalStock ?? 0,
});
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
    } catch (err) {
      console.error("Failed to load user dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const readyToPurchaseCount = useMemo(() => {
    return vehicles.filter((v) => Number(v.quantity) > 0).length;
  }, [vehicles]);

  const availableVehicles = useMemo(() => {
    return vehicles.slice(0, 6);
  }, [vehicles]);

  const recentlyAddedVehicles = useMemo(() => {
    return [...vehicles]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [vehicles]);

  // ─── Order calculation ───────────────────────────────────────────────
  const getOrderBreakdown = (vehicle) => {
    if (!vehicle) return null;
    const price = Number(vehicle.price) || 0;
    const registration = Math.round(price * 0.05);
    const insurance = Math.round(price * 0.03);
    const fastag = 500;
    const grandTotal = price + registration + insurance + fastag;
    return { price, registration, insurance, fastag, grandTotal };
  };

  const openCheckout = (vehicle) => {
    if (Number(vehicle.quantity) === 0) return;
    setSelectedVehicle(vehicle);
    setCheckoutStep("summary");
    setPaymentMethod("card");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    setProcessingProgress(0);
    setProcessingLabel("");
    setTransactionId("");
    setPurchaseDate("");
  };

  const closeCheckout = () => {
    if (isPurchasing) return;
    setSelectedVehicle(null);
    setCheckoutStep("summary");
  };

  // ─── Simulated payment flow ──────────────────────────────────────────
  const handlePayNow = () => {
    // Basic demo validation
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        return; // silently ignore incomplete demo form
      }
    }
    if (paymentMethod === "upi" && !upiId.trim()) {
      return;
    }

    setCheckoutStep("processing");
    setProcessingProgress(20);
    setProcessingLabel("Processing Payment...");

    setTimeout(() => {
      setProcessingProgress(60);
      setProcessingLabel("Checking Bank...");
    }, 1000);

    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingLabel("Verifying Transaction...");
    }, 2000);

    setTimeout(async () => {
      // Generate demo transaction details
      const txnId = `TXN${Date.now().toString().slice(-8)}${Math.floor(
        Math.random() * 900 + 100
      )}`;
      const now = new Date();
      setTransactionId(txnId);
      setPurchaseDate(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // ── Call real purchase API ONLY after successful simulation ──
      setIsPurchasing(true);
      try {
        if (typeof purchaseVehicle === "function") {
          await purchaseVehicle(selectedVehicle._id || selectedVehicle.id);
        } else {
          // Fallback: if the service function name is different,
          // replace the call above with your actual API.
          console.warn(
            "purchaseVehicle not found in vehicleService – skipping API call"
          );
        }
        // Refresh inventory after successful purchase
        await fetchData();
      } catch (err) {
        console.error("Purchase API failed:", err);
        // Still show success UI for the simulation (or handle error as you prefer)
      } finally {
        setIsPurchasing(false);
        setCheckoutStep("success");
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading catalog…</p>
      </div>
    );
  }

  const breakdown = getOrderBreakdown(selectedVehicle);

  return (
    <>
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
              Browse and purchase vehicles from our premium inventory with live
              stock status and instant checkout options.
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

        {/* 2. Three summary cards */}
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
              {summary.totalVehicles}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 relative overflow-hidden"
          >
              <AIChat />
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

        {/* Featured Vehicles */}
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
              const vehicleImage = vehicle.image || vehicle.imageUrl;

              return (
                <motion.div
                  variants={item}
                  key={vehicle._id || vehicle.id}
                  className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 overflow-hidden flex flex-col transition-all duration-300"
                >
                  <div className="h-48 bg-zinc-950 border-b border-zinc-800/60 relative overflow-hidden">
                    {vehicleImage ? (
                      <img
                        src={vehicleImage}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600 bg-zinc-950/80">
                        <Car className="w-8 h-8 opacity-40" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">
                          No Image Available
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10">
                        <Tag className="w-3 h-3 text-red-500" />
                        {vehicle.category || "General"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${
                          isOutOfStock
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : `${vehicle.quantity} in stock`}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors drop-shadow">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                    </div>
                  </div>

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

                      {/* Purchase Button → opens modal */}
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => openCheckout(vehicle)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                          isOutOfStock
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                            : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isOutOfStock ? "Out of Stock" : "Purchase"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recently Added */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Recently Added Vehicles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyAddedVehicles.map((vehicle) => {
              const vehicleImage = vehicle.image || vehicle.imageUrl;
              return (
                <motion.div
                  variants={item}
                  key={`recent-${vehicle._id || vehicle.id}`}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 overflow-hidden hover:border-zinc-700 transition-all flex flex-col"
                >
                  <div className="h-28 bg-zinc-900 relative overflow-hidden">
                    {vehicleImage ? (
                      <img
                        src={vehicleImage}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Car className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          CHECKOUT MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCheckout}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-400">
                    <ShoppingCart className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {checkoutStep === "success"
                        ? "Payment Successful"
                        : checkoutStep === "processing"
                        ? "Processing Payment"
                        : "Secure Checkout"}
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      {selectedVehicle.brand} {selectedVehicle.model}
                    </p>
                  </div>
                </div>
                {checkoutStep !== "processing" && (
                  <button
                    type="button"
                    onClick={closeCheckout}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-6">
                {/* ── SUMMARY STEP ── */}
                {checkoutStep === "summary" && breakdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Vehicle mini card */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                        {(selectedVehicle.image || selectedVehicle.imageUrl) ? (
                          <img
                            src={selectedVehicle.image || selectedVehicle.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <Car className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">
                          {selectedVehicle.brand} {selectedVehicle.model}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {selectedVehicle.year} · {selectedVehicle.category || "General"}
                        </p>
                        <p className="text-sm font-semibold text-red-400 mt-1 tabular-nums">
                          {formatINR(selectedVehicle.price)}
                        </p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5" />
                        Order Summary
                      </h4>
                      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 divide-y divide-zinc-800/60 overflow-hidden">
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Vehicle Price</span>
                          <span className="font-medium text-white tabular-nums">
                            {formatINR(breakdown.price)}
                          </span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">
                            Registration Fee (5%)
                          </span>
                          <span className="font-medium text-white tabular-nums">
                            {formatINR(breakdown.registration)}
                          </span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Insurance (3%)</span>
                          <span className="font-medium text-white tabular-nums">
                            {formatINR(breakdown.insurance)}
                          </span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Fastag</span>
                          <span className="font-medium text-white tabular-nums">
                            {formatINR(breakdown.fastag)}
                          </span>
                        </div>
                        <div className="flex justify-between px-4 py-3.5 bg-zinc-900/80">
                          <span className="font-semibold text-white">
                            Grand Total
                          </span>
                          <span className="text-lg font-bold text-red-400 tabular-nums">
                            {formatINR(breakdown.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Payment Method
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        {PAYMENT_METHODS.map((m) => {
                          const Icon = m.icon;
                          const active = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id)}
                              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-all ${
                                active
                                  ? "border-red-500/50 bg-red-600/10 text-white"
                                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                              }`}
                            >
                              <span className="text-base">{m.emoji}</span>
                              <span className="text-xs font-medium leading-tight">
                                {m.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment form fields */}
                    <AnimatePresence mode="wait">
                      {paymentMethod === "card" && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div>
                            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                              Card Number
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={19}
                              placeholder="ACCT-000035"
                              value={cardNumber}
                              onChange={(e) =>
                                setCardNumber(
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .replace(/(.{4})/g, "$1 ")
                                    .trim()
                                )
                              }
                              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                                Expiry
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/\D/g, "");
                                  if (v.length >= 2)
                                    v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                  setCardExpiry(v);
                                }}
                                className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                                CVV
                              </label>
                              <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) =>
                                  setCardCvv(e.target.value.replace(/\D/g, ""))
                                }
                                className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "upi" && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                          />
                        </motion.div>
                      )}

                      {(paymentMethod === "netbanking" ||
                        paymentMethod === "emi") && (
                        <motion.div
                          key="other"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-sm text-zinc-400">
                            {paymentMethod === "netbanking"
                              ? "You will be redirected to your bank’s secure portal (demo only)."
                              : "EMI options will be calculated based on your selected tenure (demo only)."}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pay Now */}
                    <button
                      type="button"
                      onClick={handlePayNow}
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 text-sm shadow-xl shadow-red-600/25 transition-all transform hover:-translate-y-0.5"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
                      Pay {formatINR(breakdown.grandTotal)}
                    </button>

                    <p className="text-center text-[10px] text-zinc-600">
                      Demo payment · No real money will be charged
                    </p>
                  </motion.div>
                )}

                {/* ── PROCESSING STEP ── */}
                {checkoutStep === "processing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-10 flex flex-col items-center gap-6"
                  >
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-zinc-800"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="text-red-500"
                          strokeDasharray={264}
                          initial={{ strokeDashoffset: 264 }}
                          animate={{
                            strokeDashoffset:
                              264 - (264 * processingProgress) / 100,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white tabular-nums">
                          {processingProgress}%
                        </span>
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-base font-semibold text-white">
                        {processingLabel}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Please do not close this window
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                      <span className="text-xs text-zinc-400">
                        Securing transaction…
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ── SUCCESS STEP ── */}
                {checkoutStep === "success" && breakdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 flex flex-col items-center gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </motion.div>

                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        Payment Successful
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Your vehicle is now reserved
                      </p>
                    </div>

                    <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/50 divide-y divide-zinc-800/60 overflow-hidden">
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-zinc-400">Transaction ID</span>
                        <span className="font-mono text-xs text-white">
                          {transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-zinc-400">Vehicle</span>
                        <span className="font-medium text-white text-right">
                          {selectedVehicle.brand} {selectedVehicle.model}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-zinc-400">Amount Paid</span>
                        <span className="font-bold text-emerald-400 tabular-nums">
                          {formatINR(breakdown.grandTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 text-sm">
                        <span className="text-zinc-400">Purchase Date</span>
                        <span className="text-white">{purchaseDate}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeCheckout}
                      className="w-full rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 text-sm shadow-xl shadow-red-600/25 transition-all"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDashboard;