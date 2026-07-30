import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  ShoppingCart,
  PackagePlus,
  Loader2,
  Car,
  Plus,
  AlertCircle,
  X,
  ImageOff,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import {
  getVehicles,
  purchaseVehicle,
  searchVehicles,
  deleteVehicle,
  restockVehicle,
} from "../services/vehicleService";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatPrice = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const stockBadge = (qty) => {
  if (qty === 0)
    return "bg-rose-500/15 text-rose-400 border-rose-500/25";
  if (qty <= 3)
    return "bg-amber-500/15 text-amber-400 border-amber-500/25";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
};

const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit Card", emoji: "💳" },
  { id: "upi", label: "UPI", emoji: "📱" },
  { id: "netbanking", label: "Net Banking", emoji: "🏦" },
  { id: "emi", label: "EMI", emoji: "💰" },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Inventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockError, setRestockError] = useState("");
  const [stockMode, setStockMode] = useState("increase");

  // Realistic purchase / checkout state
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState("1");
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

  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchVehicles = async () => {
    try {
      setError("");
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchVehicles();
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await searchVehicles(search);
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );
    if (!confirmDelete) return;
    try {
      setActionId(id);
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      if (selectedVehicle?._id === id) setSelectedVehicle(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setActionId(null);
    }
  };

  /* -------------------- Purchase / Checkout -------------------- */

  const openPurchaseDialog = (vehicle) => {
    if (Number(vehicle.quantity) === 0) return;
    setPurchaseTarget(vehicle);
    setPurchaseQuantity("1");
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

  const closePurchaseDialog = () => {
    if (isPurchasing || checkoutStep === "processing") return;
    setPurchaseTarget(null);
    setPurchaseQuantity("1");
    setCheckoutStep("summary");
  };

  const pQtyNum =
    purchaseQuantity === "" ? null : Number(purchaseQuantity);

  const isValidPurchaseQty =
    pQtyNum !== null &&
    Number.isInteger(pQtyNum) &&
    pQtyNum > 0 &&
    purchaseTarget &&
    pQtyNum <= Number(purchaseTarget.quantity || 0);

  const getOrderBreakdown = () => {
    if (!purchaseTarget) return null;
    const unitPrice = Number(purchaseTarget.price) || 0;
    const qty = isValidPurchaseQty ? pQtyNum : 1;
    const subtotal = unitPrice * qty;
    const registration = Math.round(subtotal * 0.05);
    const insurance = Math.round(subtotal * 0.03);
    const fastag = 500 * qty;
    const grandTotal = subtotal + registration + insurance + fastag;
    return { unitPrice, qty, subtotal, registration, insurance, fastag, grandTotal };
  };

  const handlePayNow = () => {
    if (!isValidPurchaseQty) return;
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) return;
    }
    if (paymentMethod === "upi" && !upiId.trim()) return;

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

      // Call real API ONLY after success simulation
      setIsPurchasing(true);
      setActionId(purchaseTarget._id);
      try {
        const data = await purchaseVehicle(purchaseTarget._id, pQtyNum);
        setVehicles((prev) =>
          prev.map((v) => (v._id === purchaseTarget._id ? data.vehicle : v))
        );
        setSelectedVehicle((prev) =>
          prev?._id === purchaseTarget._id ? data.vehicle : prev
        );
        showToast(
          `Successfully purchased ${pQtyNum} × ${purchaseTarget.brand} ${purchaseTarget.model}`,
          "success"
        );
      } catch (err) {
        console.error("Purchase API failed:", err);
        showToast(
          err.response?.data?.message || "Purchase failed after payment",
          "error"
        );
      } finally {
        setIsPurchasing(false);
        setActionId(null);
        setCheckoutStep("success");
      }
    }, 3000);
  };

  /* -------------------- Restock (unchanged) -------------------- */

  const openRestockDialog = (vehicle) => {
    setRestockTarget(vehicle);
    setRestockQuantity("");
    setRestockError("");
    setStockMode("increase");
  };

  const closeRestockDialog = () => {
    if (actionId) return;
    setRestockTarget(null);
    setRestockQuantity("");
    setRestockError("");
    setStockMode("increase");
  };

  const qtyNum =
    restockQuantity === "" ? null : Number(restockQuantity);

  const isValidQty =
    qtyNum !== null && Number.isInteger(qtyNum) && qtyNum > 0;

  const signedDelta = isValidQty
    ? stockMode === "increase"
      ? qtyNum
      : -qtyNum
    : 0;

  const updatedStock = restockTarget
    ? Number(restockTarget.quantity || 0) + signedDelta
    : 0;

  const wouldBeNegative =
    isValidQty && stockMode === "decrease" && updatedStock < 0;

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!isValidQty) {
      setRestockError("Enter a positive whole number.");
      return;
    }
    if (wouldBeNegative) {
      setRestockError("Insufficient stock. Cannot reduce below 0.");
      return;
    }
    try {
      setActionId(restockTarget._id);
      setRestockError("");
      const data = await restockVehicle(restockTarget._id, signedDelta);
      setVehicles((prev) =>
        prev.map((v) => (v._id === restockTarget._id ? data.vehicle : v))
      );
      setSelectedVehicle((prev) =>
        prev?._id === restockTarget._id ? data.vehicle : prev
      );
      setRestockTarget(null);
      setRestockQuantity("");
      setStockMode("increase");
    } catch (err) {
      setRestockError(err.response?.data?.message || "Stock update failed");
    } finally {
      setActionId(null);
    }
  };

  const breakdown = getOrderBreakdown();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Fleet catalog
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Vehicle Inventory
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Search, purchase, restock, and manage every unit on the lot.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/add-vehicle"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 text-[13.5px] shadow-lg shadow-red-600/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Link>
          )}
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder="Search by brand, model or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 pl-11 pr-4 py-3 text-[14px] text-white placeholder:text-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15"
            />
          </div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-3 text-[13.5px] transition-all active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => {
              setSearch("");
              setLoading(true);
              fetchVehicles();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium px-5 py-3 text-[13.5px] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">Loading inventory…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => {
                const busy = actionId === vehicle._id;
                return (
                  <motion.div
                    key={vehicle._id}
                    layout
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80 shadow-xl transition-all cursor-pointer"
                  >
                    <div>
                      <div className="relative w-full h-44 bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
                        {vehicle.image ? (
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-1.5">
                            <ImageOff className="w-6 h-6" />
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                          <span className="inline-flex rounded-lg border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-zinc-300 shadow-md">
                            {vehicle.category}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md shadow-md tabular-nums ${stockBadge(
                              vehicle.quantity
                            )}`}
                          >
                            Qty: {vehicle.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                            {vehicle.year}
                          </p>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                        </div>
                        <div className="pt-1">
                          <span className="text-lg font-bold text-white tabular-nums">
                            {formatPrice(vehicle.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 mt-auto flex items-center gap-1.5 border-t border-zinc-800/60 mt-3 pt-3">
                      {isAdmin && (
                        <Link
                          to={`/edit-vehicle/${vehicle._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700/60 bg-zinc-800/40 py-2 text-[12px] font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      )}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(vehicle._id);
                          }}
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[12px] font-medium text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPurchaseDialog(vehicle);
                          }}
                          disabled={vehicle.quantity === 0 || busy}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            vehicle.quantity === 0
                              ? "border border-zinc-700 bg-zinc-800/40 text-zinc-500"
                              : "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {busy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-3.5 h-3.5" />
                          )}
                          {vehicle.quantity === 0 ? "Out of Stock" : "Purchase"}
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRestockDialog(vehicle);
                          }}
                          disabled={busy}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-[12px] font-medium text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-sm text-zinc-500">
                No vehicles found.
              </div>
            )}
          </div>
        )}

        {/* Vehicle detail modal – unchanged */}
        <AnimatePresence>
          {selectedVehicle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
              onClick={() => setSelectedVehicle(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="min-h-[260px] bg-zinc-900 flex items-center justify-center">
                    {selectedVehicle.image ? (
                      <img
                        src={selectedVehicle.image}
                        alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                        className="w-full h-full max-h-[520px] object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-zinc-600">
                        <ImageOff className="w-10 h-10" />
                        <span className="text-sm font-medium">No image uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                          {selectedVehicle.category}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-white">
                          {selectedVehicle.brand} {selectedVehicle.model}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle(null)}
                        className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">Year</p>
                        <p className="mt-1 text-lg font-semibold text-white">{selectedVehicle.year}</p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">Stock</p>
                        <p className="mt-1 text-lg font-semibold text-white">{selectedVehicle.quantity}</p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">Price</p>
                        <p className="mt-1 text-2xl font-bold text-white">{formatPrice(selectedVehicle.price)}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {isAdmin && (
                        <Link
                          to={`/edit-vehicle/${selectedVehicle._id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Link>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(selectedVehicle._id)}
                          disabled={actionId === selectedVehicle._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={() => openPurchaseDialog(selectedVehicle)}
                          disabled={
                            selectedVehicle.quantity === 0 ||
                            actionId === selectedVehicle._id
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionId === selectedVehicle._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          {selectedVehicle.quantity === 0 ? "Out of Stock" : "Purchase"}
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openRestockDialog(selectedVehicle)}
                          disabled={actionId === selectedVehicle._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-400 hover:bg-violet-500/20 disabled:opacity-50"
                        >
                          <PackagePlus className="w-4 h-4" /> Restock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════
            REALISTIC CHECKOUT MODAL
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {purchaseTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePurchaseDialog}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
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
                        {purchaseTarget.brand} {purchaseTarget.model}
                      </p>
                    </div>
                  </div>
                  {checkoutStep !== "processing" && (
                    <button
                      type="button"
                      onClick={closePurchaseDialog}
                      disabled={isPurchasing}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {/* SUMMARY */}
                  {checkoutStep === "summary" && breakdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                          {purchaseTarget.image ? (
                            <img src={purchaseTarget.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Car className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate">
                            {purchaseTarget.brand} {purchaseTarget.model}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {purchaseTarget.year} · {purchaseTarget.category || "General"}
                          </p>
                          <p className="text-sm font-semibold text-emerald-400 mt-1 tabular-nums">
                            {formatPrice(purchaseTarget.price)} / unit
                          </p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPurchaseQuantity((q) => String(Math.max(1, Number(q || 1) - 1)))
                            }
                            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={purchaseTarget.quantity}
                            step="1"
                            value={purchaseQuantity}
                            onChange={(e) => setPurchaseQuantity(e.target.value)}
                            className="w-20 text-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPurchaseQuantity((q) =>
                                String(Math.min(Number(purchaseTarget.quantity), Number(q || 1) + 1))
                              )
                            }
                            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-zinc-500 ml-1">
                            of {purchaseTarget.quantity} available
                          </span>
                        </div>
                        {!isValidPurchaseQty && purchaseQuantity !== "" && (
                          <p className="mt-1.5 text-xs text-rose-400">
                            {pQtyNum > Number(purchaseTarget.quantity)
                              ? "Exceeds available stock"
                              : "Enter a valid positive whole number"}
                          </p>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                          <Receipt className="w-3.5 h-3.5" /> Order Summary
                        </h4>
                        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 divide-y divide-zinc-800/60 overflow-hidden">
                          <div className="flex justify-between px-4 py-3 text-sm">
                            <span className="text-zinc-400">Vehicle Price × {breakdown.qty}</span>
                            <span className="font-medium text-white tabular-nums">{formatPrice(breakdown.subtotal)}</span>
                          </div>
                          <div className="flex justify-between px-4 py-3 text-sm">
                            <span className="text-zinc-400">Registration Fee (5%)</span>
                            <span className="font-medium text-white tabular-nums">{formatPrice(breakdown.registration)}</span>
                          </div>
                          <div className="flex justify-between px-4 py-3 text-sm">
                            <span className="text-zinc-400">Insurance (3%)</span>
                            <span className="font-medium text-white tabular-nums">{formatPrice(breakdown.insurance)}</span>
                          </div>
                          <div className="flex justify-between px-4 py-3 text-sm">
                            <span className="text-zinc-400">Fastag (₹500 × {breakdown.qty})</span>
                            <span className="font-medium text-white tabular-nums">{formatPrice(breakdown.fastag)}</span>
                          </div>
                          <div className="flex justify-between px-4 py-3.5 bg-zinc-900/80">
                            <span className="font-semibold text-white">Grand Total</span>
                            <span className="text-lg font-bold text-emerald-400 tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment methods */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Payment Method</h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {PAYMENT_METHODS.map((m) => {
                            const active = paymentMethod === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setPaymentMethod(m.id)}
                                className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-all ${
                                  active
                                    ? "border-emerald-500/50 bg-emerald-600/10 text-white"
                                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                                }`}
                              >
                                <span className="text-base">{m.emoji}</span>
                                <span className="text-xs font-medium leading-tight">{m.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {paymentMethod === "card" && (
                          <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                            <div>
                              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Card Number</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={19}
                                placeholder="ACCT-000035"
                                value={cardNumber}
                                onChange={(e) =>
                                  setCardNumber(
                                    e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()
                                  )
                                }
                                className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Expiry</label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/\D/g, "");
                                    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                    setCardExpiry(v);
                                  }}
                                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">CVV</label>
                                <input
                                  type="password"
                                  inputMode="numeric"
                                  maxLength={4}
                                  placeholder="•••"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {paymentMethod === "upi" && (
                          <motion.div key="upi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">UPI ID</label>
                            <input
                              type="text"
                              placeholder="yourname@upi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                          </motion.div>
                        )}
                        {(paymentMethod === "netbanking" || paymentMethod === "emi") && (
                          <motion.div key="other" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-sm text-zinc-400">
                              {paymentMethod === "netbanking"
                                ? "You will be redirected to your bank’s secure portal (demo only)."
                                : "EMI options will be calculated based on your selected tenure (demo only)."}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="button"
                        onClick={handlePayNow}
                        disabled={!isValidPurchaseQty}
                        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 text-sm shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <ShieldCheck className="w-4.5 h-4.5" />
                        Pay {formatPrice(breakdown.grandTotal)}
                      </button>
                      <p className="text-center text-[10px] text-zinc-600">
                        Demo payment · No real money will be charged
                      </p>
                    </motion.div>
                  )}

                  {/* PROCESSING */}
                  {checkoutStep === "processing" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 flex flex-col items-center gap-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className="text-emerald-500"
                            strokeDasharray={264}
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (264 * processingProgress) / 100 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-white tabular-nums">{processingProgress}%</span>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-base font-semibold text-white">{processingLabel}</p>
                        <p className="text-xs text-zinc-500">Please do not close this window</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span className="text-xs text-zinc-400">Securing transaction…</span>
                      </div>
                    </motion.div>
                  )}

                  {/* SUCCESS */}
                  {checkoutStep === "success" && breakdown && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 flex flex-col items-center gap-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </motion.div>
                      <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-white">Payment Successful</h3>
                        <p className="text-sm text-zinc-400">
                          Your vehicle{breakdown.qty > 1 ? "s are" : " is"} now reserved
                        </p>
                      </div>
                      <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/50 divide-y divide-zinc-800/60 overflow-hidden">
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Transaction ID</span>
                          <span className="font-mono text-xs text-white">{transactionId}</span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Vehicle</span>
                          <span className="font-medium text-white text-right">
                            {purchaseTarget.brand} {purchaseTarget.model}
                            {breakdown.qty > 1 ? ` × ${breakdown.qty}` : ""}
                          </span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Amount Paid</span>
                          <span className="font-bold text-emerald-400 tabular-nums">{formatPrice(breakdown.grandTotal)}</span>
                        </div>
                        <div className="flex justify-between px-4 py-3 text-sm">
                          <span className="text-zinc-400">Purchase Date</span>
                          <span className="text-white">{purchaseDate}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={closePurchaseDialog}
                        className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 text-sm shadow-xl shadow-emerald-600/25 transition-all"
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

        {/* Restock modal – unchanged */}
        <AnimatePresence>
          {restockTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 py-6"
              onClick={closeRestockDialog}
            >
              <motion.form
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRestockSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-400">
                      <PackagePlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Update Stock</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {restockTarget.brand} {restockTarget.model}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeRestockDialog}
                    disabled={actionId === restockTarget._id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500">Current Stock</p>
                      <p className="mt-1 text-xl font-bold text-white">{restockTarget.quantity}</p>
                    </div>
                    <div className={`rounded-xl border p-4 ${wouldBeNegative ? "border-rose-500/40 bg-rose-500/10" : "border-zinc-800 bg-zinc-900/70"}`}>
                      <p className={`text-[11px] uppercase tracking-wider ${wouldBeNegative ? "text-rose-400" : "text-zinc-500"}`}>Updated Stock</p>
                      <p className={`mt-1 text-xl font-bold ${wouldBeNegative ? "text-rose-400" : "text-white"}`}>
                        {isValidQty ? updatedStock : restockTarget.quantity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Action</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setStockMode("increase"); setRestockError(""); }}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                          stockMode === "increase"
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <Plus className="w-4 h-4" /> Increase
                      </button>
                      <button
                        type="button"
                        onClick={() => { setStockMode("decrease"); setRestockError(""); }}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                          stockMode === "decrease"
                            ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <Minus className="w-4 h-4" /> Decrease
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="restock-quantity" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-zinc-500">
                      Quantity
                    </label>
                    <input
                      id="restock-quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={restockQuantity}
                      onChange={(e) => { setRestockQuantity(e.target.value); setRestockError(""); }}
                      autoFocus
                      className={`w-full rounded-xl border bg-zinc-950 px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 ${
                        wouldBeNegative
                          ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/15"
                          : "border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/15"
                      }`}
                      placeholder="e.g. 5"
                    />
                  </div>
                  {restockError && <p className="text-xs text-rose-400 font-medium">{restockError}</p>}
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-zinc-800 bg-zinc-900/50 p-4">
                  <button
                    type="button"
                    onClick={closeRestockDialog}
                    disabled={actionId === restockTarget._id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValidQty || wouldBeNegative || actionId === restockTarget._id}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionId === restockTarget._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
                    Confirm Update
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2"
            >
              <div
                className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 shadow-2xl backdrop-blur-md ${
                  toast.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/15 text-rose-300"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Inventory;