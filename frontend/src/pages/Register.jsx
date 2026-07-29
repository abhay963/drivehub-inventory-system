import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Flame,
  ShieldAlert,
  Gauge,
} from "lucide-react";
import { registerUser } from "../services/authService";

/* -------------------------------------------------------------------------- */
/*  Zod Schema                                                                */
/* -------------------------------------------------------------------------- */

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name cannot exceed 40 characters")
      .regex(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

    email: z.string().trim().email("Please enter a valid fleet email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter is required")
      .regex(/[a-z]/, "At least one lowercase letter is required")
      .regex(/[0-9]/, "At least one number is required")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "At least one special character is required"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* -------------------------------------------------------------------------- */
/*  Password Strength Helpers                                                 */
/* -------------------------------------------------------------------------- */

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong", "Strong"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-emerald-500",
];
const STRENGTH_TEXT = [
  "text-red-400",
  "text-orange-400",
  "text-yellow-400",
  "text-emerald-400",
  "text-emerald-400",
];

/* -------------------------------------------------------------------------- */
/*  Animation Variants                                                        */
/* -------------------------------------------------------------------------- */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, y: -4 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.22 },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -4,
    transition: { duration: 0.15 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, dirtyFields, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const nameValue = watch("name");
  const emailValue = watch("email");
  const confirmValue = watch("confirmPassword");

  const strength = useMemo(() => {
    if (!passwordValue) return null;
    return zxcvbn(passwordValue);
  }, [passwordValue]);

  const strengthScore = strength?.score ?? 0;

  /* Field validity helpers (dirty + no error) */
  const isNameValid = dirtyFields.name && !errors.name && nameValue?.length >= 3;
  const isEmailValid = dirtyFields.email && !errors.email && emailValue?.includes("@");
  const isPasswordValid =
    dirtyFields.password && !errors.password && passwordValue.length >= 8;
  const isConfirmValid =
    dirtyFields.confirmPassword &&
    !errors.confirmPassword &&
    confirmValue === passwordValue &&
    confirmValue.length > 0;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      await registerUser(payload);

      toast.success("Ignition sequence complete. Welcome to the fleet!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed. Check your clearance.");
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-950 text-white font-sans overflow-hidden"
    >
      
      {/* Left Immersive Exotic Car Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-zinc-950">
        {/* High-octane luxury car background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        
        {/* Cinematic Multi-stop Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-red-950/20 mix-blend-color-burn" />

        {/* Top Brand Badge */}
        <div className="relative z-10 p-12 flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/50">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-widest uppercase bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
            RevMotors
          </span>
        </div>

        {/* Bottom Floating Telemetry Card */}
        <div className="relative z-10 mt-auto p-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-700/50 p-6 rounded-3xl shadow-2xl max-w-lg flex items-center justify-between gap-6"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-1">Global Dealership Network</p>
              <h3 className="text-lg font-bold text-white tracking-tight">Register for Secure Allocation</h3>
              <p className="text-xs text-zinc-400 mt-1">Gain instant access to premier exotic inventory feeds.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <Gauge className="w-7 h-7 text-red-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right High-End Registration Interface */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative bg-zinc-950 overflow-y-auto max-h-screen">
        {/* Subtle red background ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-6 relative z-10 py-6"
        >
          {/* Mobile view top brand */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-black tracking-widest text-lg uppercase text-red-500">RevMotors</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Request Access</h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Create your dealer account to oversee inventory, pricing, and client allocations.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`w-full bg-zinc-900/90 border rounded-2xl px-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all shadow-inner ${
                    errors.name
                      ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                      : isNameValid
                      ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                      : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                  }`}
                />
                {isNameValid && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                )}
              </div>
              <AnimatePresence mode="wait">
                {errors.name && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Dealer Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@revmotors.com"
                  {...register("email")}
                  className={`w-full bg-zinc-900/90 border rounded-2xl px-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all shadow-inner ${
                    errors.email
                      ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                      : isEmailValid
                      ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                      : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                  }`}
                />
                {isEmailValid && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                )}
              </div>
              <AnimatePresence mode="wait">
                {errors.email && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Secure Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full bg-zinc-900/90 border rounded-2xl px-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all shadow-inner ${
                    errors.password
                      ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                      : isPasswordValid
                      ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                      : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength meter */}
              {passwordValue.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strengthScore
                            ? STRENGTH_COLORS[strengthScore]
                            : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11.5px] font-semibold ${STRENGTH_TEXT[strengthScore]}`}>
                    Strength: {STRENGTH_LABELS[strengthScore]}
                  </p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full bg-zinc-900/90 border rounded-2xl px-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all shadow-inner ${
                    errors.confirmPassword
                      ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                      : isConfirmValid
                      ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                      : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isConfirmValid && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="text-zinc-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {errors.confirmPassword && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errors.confirmPassword.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full relative group overflow-hidden rounded-2xl bg-red-600 p-px font-semibold shadow-xl shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <div className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-600 to-rose-600 px-8 py-4 rounded-2xl text-white group-hover:from-red-500 group-hover:to-rose-500 transition-all">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Engaging Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Request Access</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Login Link Switcher */}
          <p className="text-center text-sm text-zinc-400 pt-2">
            Already have dealer credentials?{" "}
            <Link
              to="/login"
              className="text-red-500 font-bold hover:text-red-400 transition-colors underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;