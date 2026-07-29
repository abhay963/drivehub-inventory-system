import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ShoppingBag,
  Eye,
  AlertCircle,
  IndianRupee,
  Calendar,
  User,
  Car,
  Search,
  RotateCcw,
  TrendingUp,
  PackageCheck,
} from "lucide-react";
import { getAllPurchaseHistory } from "../services/vehicleService";
import PurchaseDetailsModal from "../components/purchase/PurchaseDetailsModal";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const formatPrice = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const AdminSales = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Mock user profile passed down to Navbar (can be replaced with your auth state)
  const currentUser = {
    name: "Admin User",
    role: "Administrator",
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllPurchaseHistory();
      setPurchases(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = useMemo(() => {
    if (!searchQuery.trim()) return purchases;
    const q = searchQuery.toLowerCase();
    return purchases.filter((item) => {
      const userName = item.user?.name?.toLowerCase() || "";
      const userEmail = item.user?.email?.toLowerCase() || "";
      const brand = item.vehicle?.brand?.toLowerCase() || "";
      const model = item.vehicle?.model?.toLowerCase() || "";
      return userName.includes(q) || userEmail.includes(q) || brand.includes(q) || model.includes(q);
    });
  }, [purchases, searchQuery]);

  const totalRevenue = useMemo(() => {
    return purchases.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);
  }, [purchases]);

  const totalOrders = purchases.length;

  if (loading && purchases.length === 0) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar user={currentUser} />
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-400 font-medium">Loading sales history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={currentUser} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* Header & Metrics Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Revenue & Orders
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Sales Management
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Track every customer purchase across the fleet.
                </p>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 sm:flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                      Total Revenue
                    </p>
                    <p className="text-base font-bold text-white tabular-nums">
                      {formatPrice(totalRevenue)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-400">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                      Total Orders
                    </p>
                    <p className="text-base font-bold text-white tabular-nums">
                      {totalOrders}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Banner */}
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

            {/* Search & Refresh Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-400 pointer-events-none"
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  placeholder="Search by customer name, email or vehicle model/brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <button
                onClick={fetchPurchases}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 font-medium px-5 py-3 text-sm transition-all disabled:opacity-50 shadow-sm"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* Table Container Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-xl">
              {filteredPurchases.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-medium">
                    {searchQuery ? "No matching sales records found." : "No sales recorded yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950/80">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-500" />
                            Customer
                          </span>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-zinc-500" />
                            Vehicle
                          </span>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <IndianRupee className="w-3.5 h-3.5 text-zinc-500" />
                            Total
                          </span>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            Date
                          </span>
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredPurchases.map((purchase, idx) => (
                        <motion.tr
                          key={purchase._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.25 }}
                          className="hover:bg-zinc-800/40 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-white">
                                {purchase.user?.name || "—"}
                              </span>
                              {purchase.user?.email && (
                                <span className="text-xs text-zinc-400 mt-0.5">
                                  {purchase.user.email}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">
                                {purchase.vehicle?.brand} {purchase.vehicle?.model}
                              </span>
                              {purchase.vehicle?.year && (
                                <span className="text-xs text-zinc-400 mt-0.5">
                                  {purchase.vehicle.year}
                                  {purchase.quantity > 1 && (
                                    <span className="ml-2 text-zinc-300">
                                      × {purchase.quantity}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-white tabular-nums">
                              {formatPrice(purchase.totalPrice)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-zinc-300">
                              {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedPurchase(purchase)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Details Modal */}
            <PurchaseDetailsModal
              purchase={selectedPurchase}
              onClose={() => setSelectedPurchase(null)}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminSales;