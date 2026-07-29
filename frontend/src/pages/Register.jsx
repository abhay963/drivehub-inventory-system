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
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Flame,
  ShieldAlert,
  Gauge,
  ArrowLeft,
} from "lucide-react";
import { sendOtp } from "../services/authService";
import OtpModal from "../components/auth/OtpModal";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name cannot exceed 40 characters")
      .regex(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState(null);
  
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
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const nameValue = watch("name");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const confirmValue = watch("confirmPassword");

  const strength = useMemo(() => {
    if (!passwordValue) return null;
    return zxcvbn(passwordValue);
  }, [passwordValue]);

  const strengthScore = strength?.score ?? 0;

  const isNameValid =
    dirtyFields.name && !errors.name && nameValue?.length >= 3;
  const isEmailValid =
    dirtyFields.email && !errors.email && emailValue?.includes("@");
  const isPhoneValid =
    dirtyFields.phone && !errors.phone && phoneValue?.length === 10;
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
        phone: data.phone.trim(),
        password: data.password,
      };

      await sendOtp(payload);

      setUserEmail(payload.email);
setUserData(payload);
      toast.success("OTP sent to your email");

      setShowOtpModal(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-zinc-950 text-white font-sans"
    >
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white shadow-lg shadow-red-600/40">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
              DriveHub
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      {/* Main content – accounts for navbar height */}
      <div className="pt-14 min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left panel */}
        <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-zinc-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent" />

          {/* Bottom card only – no duplicate logo */}
          <div className="relative z-10 mt-auto p-10 w-full">
            <div className="backdrop-blur-xl bg-zinc-900/70 border border-zinc-700/50 p-5 rounded-2xl shadow-2xl max-w-md flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-red-500 font-bold mb-1">
                  Dealership network
                </p>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Create your account
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Get access to inventory, pricing, and sales tools.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <Gauge className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="lg:col-span-5 flex items-start lg:items-center justify-center px-6 py-10 sm:px-10 lg:px-12 relative bg-zinc-950 overflow-y-auto">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md space-y-6 relative z-10"
          >
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <span className="font-black tracking-widest text-base uppercase text-red-500">
                DriveHub
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Create account
              </h2>
              <p className="text-sm text-zinc-400 mt-1.5">
                Create an account to manage inventory, pricing, and sales.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Full name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                        : isNameValid
                        ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                        : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                    }`}
                  />
                  {isNameValid && (
                    <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {errors.name && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="admin@drivehub.app"
                    {...register("email")}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all ${
                      errors.email
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                        : isEmailValid
                        ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                        : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                    }`}
                  />
                  {isEmailValid && (
                    <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    {...register("phone")}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all ${
                      errors.phone
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                        : isPhoneValid
                        ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                        : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                    }`}
                  />
                  {isPhoneValid && (
                    <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {errors.phone && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.phone.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all ${
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>

                {passwordValue.length > 0 && (
                  <div className="mt-2 space-y-1">
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
                    <p
                      className={`text-[11px] font-semibold ${STRENGTH_TEXT[strengthScore]}`}
                    >
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
                      className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Confirm password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-4 transition-all ${
                      errors.confirmPassword
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-600/20"
                        : isConfirmValid
                        ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-600/20"
                        : "border-zinc-800 focus:border-red-600 focus:ring-red-600/20"
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isConfirmValid && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="text-zinc-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
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
                      className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 shadow-lg shadow-red-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {showOtpModal && (
             <OtpModal
  email={userEmail}
  userData={userData}
  onClose={() => setShowOtpModal(false)}
/>
            )}

            <p className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 font-semibold hover:text-red-400 transition-colors underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;