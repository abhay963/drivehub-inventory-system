import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ShoppingBag,
  Search,
  RotateCcw,
  AlertCircle,
  Car,
} from "lucide-react";
import Layout from "../layout/Layout";
import { getPurchaseHistory } from "../../services/vehicleService";
import PurchaseCard from "./PurchaseCard";

/* -------------------------------------------------------------------------- */
/* Animation variants                                                         */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getPurchaseHistory();
      const list = Array.isArray(data) ? data : [];
      setPurchases(list);
      setFilteredPurchases(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredPurchases(purchases);
      return;
    }

    const query = search.toLowerCase().trim();
    const results = purchases.filter((p) => {
      const v = p.vehicle;
      const brand = v?.brand?.toLowerCase() || "";
      const model = v?.model?.toLowerCase() || "";
      const category = v?.category?.toLowerCase() || "";
      return (
        brand.includes(query) ||
        model.includes(query) ||
        category.includes(query)
      );
    });

    setFilteredPurchases(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
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
                Transaction records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Purchase History
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Review your past vehicle orders, transaction records and details.
            </p>
          </div>
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
              setFilteredPurchases(purchases);
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

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">
              Loading purchase history…
            </p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center space-y-3 shadow-xl">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-200 font-bold text-lg">No purchases yet</p>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              You haven&apos;t bought any vehicles from our inventory yet.
              Explore the catalog to place your first order.
            </p>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center space-y-3 shadow-xl">
            <Search className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-200 font-bold text-base">
              No matching purchases found
            </p>
            <p className="text-sm text-zinc-500">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredPurchases.map((purchase) => (
              <motion.div variants={item} key={purchase._id || purchase.id}>
                <PurchaseCard purchase={purchase} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default PurchaseHistory;