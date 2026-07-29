import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Search, 
  RotateCcw, 
  ShoppingCart, 
  ImageOff, 
  AlertCircle, 
  Loader2 
} from "lucide-react";

const formatPrice = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const SalesTable = ({ purchases = [], loading = false, onViewDetails, onRefresh }) => {
  const [search, setSearch] = useState("");

  const filteredPurchases = purchases.filter((p) => {
    const query = search.toLowerCase();
    const userName = p.user?.name?.toLowerCase() || "";
    const userEmail = p.user?.email?.toLowerCase() || "";
    const brand = p.vehicle?.brand?.toLowerCase() || "";
    const model = p.vehicle?.model?.toLowerCase() || "";
    return userName.includes(query) || userEmail.includes(query) || brand.includes(query) || model.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none" 
            strokeWidth={1.75} 
          />
          <input
            type="text"
            placeholder="Search by customer name, email or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 pl-11 pr-4 py-3 text-[14px] text-white placeholder:text-zinc-600 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15"
          />
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium px-5 py-3 text-[13.5px] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
                      <p className="text-sm text-zinc-500 font-medium">Loading sales records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <motion.tr 
                    key={purchase._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-zinc-800/20 transition-colors"
                  >
                    {/* Customer */}
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-white">
                        {purchase.user?.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {purchase.user?.email || "No email"}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0">
                          {purchase.vehicle?.image ? (
                            <img 
                              src={purchase.vehicle.image} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600">
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {purchase.vehicle?.brand} {purchase.vehicle?.model}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {purchase.vehicle?.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-4 font-semibold text-white tabular-nums">
                      {purchase.quantity}
                    </td>

                    {/* Total Paid */}
                    <td className="p-4 font-bold text-white tabular-nums">
                      {formatPrice(purchase.totalPrice)}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-zinc-400 text-xs">
                      {new Date(purchase.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 capitalize">
                        {purchase.paymentStatus || "Completed"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => onViewDetails && onViewDetails(purchase)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700/60 bg-zinc-800/40 px-3 py-2 text-[12px] font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-sm text-zinc-500">
                    No sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;