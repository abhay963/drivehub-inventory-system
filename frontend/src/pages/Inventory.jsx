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
  const [stockMode, setStockMode] = useState("increase"); // "increase" | "decrease"

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchVehicles();
  }, []);

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
      if (selectedVehicle?._id === id) {
        setSelectedVehicle(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setActionId(null);
    }
  };

  const handlePurchase = async (id) => {
    try {
      setActionId(id);
      const data = await purchaseVehicle(id);
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? data.vehicle : v))
      );
      setSelectedVehicle((prev) =>
        prev?._id === id ? data.vehicle : prev
      );
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    } finally {
      setActionId(null);
    }
  };

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

        {/* Error */}
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

        {/* Cards Grid Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">
              Loading inventory…
            </p>
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
                      {/* Vehicle Image Banner */}
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

                        {/* Top Badges */}
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

                      {/* Content Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                              {vehicle.year}
                            </p>
                            <h3 className="text-base font-bold text-white leading-tight">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                          </div>
                        </div>

                        <div className="pt-1">
                          <span className="text-lg font-bold text-white tabular-nums">
                            {formatPrice(vehicle.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
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
                            handlePurchase(vehicle._id);
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

        {/* Vehicle detail modal */}
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
                        <span className="text-sm font-medium">
                          No image uploaded
                        </span>
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
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Year
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {selectedVehicle.year}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Stock
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {selectedVehicle.quantity}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Price
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {formatPrice(selectedVehicle.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {isAdmin && (
                        <Link
                          to={`/edit-vehicle/${selectedVehicle._id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Link>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(selectedVehicle._id)}
                          disabled={actionId === selectedVehicle._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}

                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={() => handlePurchase(selectedVehicle._id)}
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
                          {selectedVehicle.quantity === 0
                            ? "Out of Stock"
                            : "Purchase"}
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openRestockDialog(selectedVehicle)}
                          disabled={actionId === selectedVehicle._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-400 hover:bg-violet-500/20 disabled:opacity-50"
                        >
                          <PackagePlus className="w-4 h-4" />
                          Restock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Update Stock modal */}
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
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-400">
                      <PackagePlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Update Stock
                      </h2>
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
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 p-5">
                  {/* Current / Updated preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                        Current Stock
                      </p>
                      <p className="mt-1 text-xl font-bold text-white">
                        {restockTarget.quantity}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl border p-4 ${
                        wouldBeNegative
                          ? "border-rose-500/40 bg-rose-500/10"
                          : "border-zinc-800 bg-zinc-900/70"
                      }`}
                    >
                      <p
                        className={`text-[11px] uppercase tracking-wider ${
                          wouldBeNegative ? "text-rose-400" : "text-zinc-500"
                        }`}
                      >
                        Updated Stock
                      </p>
                      <p
                        className={`mt-1 text-xl font-bold ${
                          wouldBeNegative ? "text-rose-400" : "text-white"
                        }`}
                      >
                        {isValidQty ? updatedStock : restockTarget.quantity}
                      </p>
                    </div>
                  </div>

                  {/* + / − mode buttons */}
                  <div>
                    <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">
                      Action
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStockMode("increase");
                          setRestockError("");
                        }}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                          stockMode === "increase"
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Increase
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStockMode("decrease");
                          setRestockError("");
                        }}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                          stockMode === "decrease"
                            ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                        Decrease
                      </button>
                    </div>
                  </div>

                  {/* Quantity input */}
                  <div>
                    <label
                      htmlFor="restock-quantity"
                      className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-zinc-500"
                    >
                      Quantity
                    </label>
                    <input
                      id="restock-quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={restockQuantity}
                      onChange={(e) => {
                        setRestockQuantity(e.target.value);
                        setRestockError("");
                      }}
                      autoFocus
                      className={`w-full rounded-xl border bg-zinc-950 px-4 py-3 text-[14px] text-white outline-none transition-all placeholder:text-zinc-600 focus:ring-2 ${
                        wouldBeNegative
                          ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/15"
                          : "border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/15"
                      }`}
                      placeholder="e.g. 5"
                    />
                  </div>

                  {restockError && (
                    <p className="text-xs text-rose-400 font-medium">{restockError}</p>
                  )}
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
                    {actionId === restockTarget._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PackagePlus className="w-4 h-4" />
                    )}
                    Confirm Update
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Inventory;