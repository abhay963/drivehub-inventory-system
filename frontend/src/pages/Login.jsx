import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Flame,
  ShieldAlert,
  Gauge,
} from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid fleet email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
const onSubmit = async (data) => {
  try {
    const response = await loginUser({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    login(response.token);

    toast.success("Login Successful 🚗");

    navigate("/dashboard");
  } catch (err) {
    console.error(err);

    if (err.response) {
      toast.error(err.response.data.message);
    } else if (err.request) {
      toast.error("Unable to connect to server.");
    } else {
      toast.error(err.message || "Something went wrong.");
    }
  }
};
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* Left Immersive Exotic Car Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-zinc-900">
        {/* High-octane luxury car background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2000&auto=format&fit=crop')`,
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
              <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-1">Live Fleet Feed</p>
              <h3 className="text-lg font-bold text-white tracking-tight">Exotic & Performance Tier Active</h3>
              <p className="text-xs text-zinc-400 mt-1">Real-time dealer sync across 42 global stock hubs.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <Gauge className="w-7 h-7 text-red-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right High-End Login Interface */}
      <div className="lg:col-span-5 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-zinc-950">
        {/* Subtle red background ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Mobile view top brand */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-black tracking-widest text-lg uppercase text-red-500">RevMotors</span>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white">Dealer Access</h2>
            <p className="text-sm text-zinc-400 mt-2">
              Log in to oversee stock rotation, pricing adjustments, and live vehicle sales.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Dealer Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@revmotors.com"
                  {...register("email")}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl px-12 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all shadow-inner"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Secure Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl px-12 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden rounded-2xl bg-red-600 p-px font-semibold shadow-xl shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              <div className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-600 to-rose-600 px-8 py-4 rounded-2xl text-white group-hover:from-red-500 group-hover:to-rose-500 transition-all">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Engaging Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Showroom</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Registration Link Switcher */}
          <p className="text-center text-sm text-zinc-400 pt-2">
            Don&apos;t have dealer credentials?{" "}
            <Link
              to="/register"
              className="text-red-500 font-bold hover:text-red-400 transition-colors underline underline-offset-4"
            >
              Request Access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;