import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Tag,
  Calendar,
  IndianRupee,
  Package,
  Layers,
  Loader2,
  ArrowLeft,
  Plus,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { addVehicle } from "../services/vehicleService";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Truck",
  "Luxury",
  "Electric",
  "Sports",
];

const fieldClass =
  "w-full rounded-xl bg-zinc-950/60 border border-zinc-800 pl-11 pr-4 py-3.5 text-[14px] text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15 focus:bg-zinc-950";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
    year: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addVehicle({
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });

      navigate("/inventory");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl"
      >
        {/* Back + header */}
        <div className="mb-8">
          <Link
            to="/inventory"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-white transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to inventory
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-400">
              <Plus className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Add Vehicle
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Register a new unit into your dealership catalog.
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
              >
                Brand
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                  strokeWidth={1.75}
                />
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  placeholder="e.g. Tesla, Porsche"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
              >
                Model
              </label>
              <div className="relative">
                <Car
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                  strokeWidth={1.75}
                />
                <input
                  id="model"
                  type="text"
                  name="model"
                  placeholder="e.g. Model S Plaid"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
              >
                Category
              </label>
              <div className="relative">
                <Layers
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                  strokeWidth={1.75}
                />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year + Quantity row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="year"
                  className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
                >
                  Year
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <input
                    id="year"
                    type="number"
                    name="year"
                    placeholder="2026"
                    min="1900"
                    max="2100"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
                >
                  Quantity
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    placeholder="1"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
              >
                Price (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-zinc-500 pointer-events-none"
                  strokeWidth={1.75}
                />
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="e.g. 8999000"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Vehicle Image Upload Section */}
            <div>
              <label
                htmlFor="vehicle-image-upload"
                className="block text-[12px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5"
              >
                Vehicle Image
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Vehicle Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="vehicle-image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-950 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-2 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      Click to upload vehicle image
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      PNG, JPG or WEBP (up to 5MB)
                    </p>
                    <input
                      id="vehicle-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 text-[14px] shadow-lg shadow-red-600/25 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Vehicle
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/inventory")}
                disabled={loading}
                className="sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-700 font-medium text-[14px] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddVehicle;
