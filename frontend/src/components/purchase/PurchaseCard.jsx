import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Calendar,
  Package,
  X,
  ImageOff,
  CheckCircle2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatINR = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const PurchaseCard = ({ purchase }) => {
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const vehicle = purchase.vehicle;
  const vehicleImage = vehicle?.image || vehicle?.imageUrl;

  return (
    <>
      {/* Main Card */}
      <motion.div
        layout
        onClick={() => setSelectedPurchase(purchase)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80 shadow-xl transition-all cursor-pointer"
      >
        <div>
          {/* Image Banner */}
          <div className="relative w-full h-44 bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt={`${vehicle?.brand || ""} ${vehicle?.model || "Vehicle"}`}
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
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-zinc-300 shadow-md">
                <Tag className="w-3 h-3 text-red-500" />
                {vehicle?.category || "General"}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 backdrop-blur-md shadow-md">
                Completed
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {vehicle?.year || "—"}
                </p>
                <h3 className="text-base font-bold text-white leading-tight">
                  {vehicle?.brand} {vehicle?.model}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/50">
                <Package className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">
                  Qty: <strong className="text-white">{purchase.quantity}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/50">
                <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-0 mt-auto flex items-center justify-between border-t border-zinc-800/60 mt-3 pt-3">
          <div>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              Total Paid
            </p>
            <p className="text-lg font-bold text-white tabular-nums">
              {formatINR(purchase.totalPrice)}
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            View Details →
          </span>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPurchase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
            onClick={() => setSelectedPurchase(null)}
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
                {/* Image */}
                <div className="min-h-[260px] bg-zinc-900 flex items-center justify-center">
                  {vehicleImage ? (
                    <img
                      src={vehicleImage}
                      alt={`${vehicle?.brand || ""} ${vehicle?.model || "Vehicle"}`}
                      className="w-full h-full max-h-[520px] object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-zinc-600">
                      <ImageOff className="w-10 h-10" />
                      <span className="text-sm font-medium">No image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                          {vehicle?.category || "General"}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-white">
                          {vehicle?.brand} {vehicle?.model}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPurchase(null)}
                        className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition-colors"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Quantity
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {selectedPurchase.quantity}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Purchase Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white pt-1">
                          {new Date(selectedPurchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                          Total Paid
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                          {formatINR(selectedPurchase.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Transaction Completed
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPurchase(null)}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseCard;