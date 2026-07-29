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

  // Role check based on localStorage user object
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
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    } finally {
      setActionId(null);
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt("Enter quantity to restock:");
    if (!quantity) return;

    try {
      setActionId(id);
      const data = await restockVehicle(id, Number(quantity));
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? data.vehicle : v))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Restock failed");
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
            Reset
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

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">
              Loading inventory…
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {[
                      "Brand",
                      "Model",
                      "Category",
                      "Year",
                      "Price",
                      "Qty",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/80">
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => {
                      const busy = actionId === vehicle._id;
                      return (
                        <tr
                          key={vehicle._id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-4 text-[13.5px] font-semibold text-white">
                            {vehicle.brand}
                          </td>
                          <td className="px-4 py-4 text-[13.5px] text-zinc-300">
                            {vehicle.model}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-2.5 py-1 text-[11.5px] font-medium text-zinc-300">
                              {vehicle.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[13.5px] text-zinc-400 tabular-nums">
                            {vehicle.year}
                          </td>
                          <td className="px-4 py-4 text-[13.5px] font-semibold text-white tabular-nums">
                            {formatPrice(vehicle.price)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${stockBadge(
                                vehicle.quantity
                              )}`}
                            >
                              {vehicle.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {isAdmin && (
                                <Link
                                  to={`/edit-vehicle/${vehicle._id}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-2.5 py-1.5 text-[12px] font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit
                                </Link>
                              )}

                              {isAdmin && (
                                <button
                                  onClick={() => handleDelete(vehicle._id)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-500/10 px-2.5 py-1.5 text-[12px] font-medium text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              )}

                              <button
                                onClick={() => handlePurchase(vehicle._id)}
                                disabled={vehicle.quantity === 0 || busy}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                {vehicle.quantity === 0
                                  ? "Out of Stock"
                                  : "Purchase"}
                              </button>

                              {isAdmin && (
                                <button
                                  onClick={() => handleRestock(vehicle._id)}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1.5 text-[12px] font-medium text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
                                >
                                  <PackagePlus className="w-3.5 h-3.5" />
                                  Restock
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-16 text-center text-sm text-zinc-500"
                      >
                        No vehicles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Inventory;