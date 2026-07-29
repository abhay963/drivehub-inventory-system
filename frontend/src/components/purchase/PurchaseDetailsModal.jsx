import { X, ImageOff, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const PurchaseDetailsModal = ({ purchase, onClose }) => {
  if (!purchase) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Purchase Details</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Transaction reference & summary information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
            {/* Customer & Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm text-zinc-300">
                  <p>
                    <span className="font-medium text-zinc-500">Name:</span>{" "}
                    <span className="text-white font-semibold">
                      {purchase.user?.name || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-zinc-500">Email:</span>{" "}
                    <span className="text-white">{purchase.user?.email || "N/A"}</span>
                  </p>
                  <p>
                    <span className="font-medium text-zinc-500">Phone:</span>{" "}
                    <span className="text-white">
                      {purchase.user?.phone || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Vehicle Info Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  Vehicle Summary
                </h3>
                <div className="relative w-full h-32 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                  {purchase.vehicle?.image ? (
                    <img
                      src={purchase.vehicle.image}
                      alt={`${purchase.vehicle?.brand} ${purchase.vehicle?.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-1">
                      <ImageOff className="w-5 h-5" />
                      <span className="text-[11px]">No image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-sm text-zinc-300">
                  <p className="font-bold text-white">
                    {purchase.vehicle?.brand} {purchase.vehicle?.model}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {purchase.vehicle?.category} • {purchase.vehicle?.year}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase / Financial Metrics */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                Order & Payment Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Unit Price
                  </p>
                  <p className="mt-1 text-base font-bold text-white tabular-nums">
                    {formatPrice(purchase.price)}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Quantity
                  </p>
                  <p className="mt-1 text-base font-bold text-white tabular-nums">
                    {purchase.quantity}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-400/80">
                    Total Paid
                  </p>
                  <p className="mt-1 text-base font-bold text-white tabular-nums">
                    {formatPrice(purchase.totalPrice)}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {new Date(purchase.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Payment Status
                  </p>
                  <p className="mt-1 text-sm font-semibold capitalize text-emerald-400">
                    {purchase.paymentStatus || "Completed"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    Delivery Status
                  </p>
                  <p className="mt-1 text-sm font-semibold capitalize text-zinc-300">
                    {purchase.deliveryStatus || "Processing"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-zinc-800 bg-zinc-900/50 p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseDetailsModal;