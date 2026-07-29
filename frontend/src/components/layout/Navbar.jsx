import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Flame,
  LogOut,
  User,
  LayoutDashboard,
  Package,
  PlusCircle,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getInitials(name = "", email = "") {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

/** Best-effort user from context or JWT payload in localStorage */
function resolveUser(authUser) {
  if (authUser && (authUser.name || authUser.email)) {
    return {
      name: authUser.name || "",
      email: authUser.email || "",
      role: authUser.role || "Dealer",
    };
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) return { name: "", email: "Signed in", role: "Dealer" };

    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return {
      name: payload.name || payload.username || "",
      email: payload.email || payload.sub || "Signed in",
      role: payload.role || "Dealer",
    };
  } catch {
    return { name: "", email: "Signed in", role: "Dealer" };
  }
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { logout } = auth;

  const user = resolveUser(auth.user);
  const isAdmin = user.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const initials = getInitials(user.name, user.email);
  const displayName = user.name || user.email?.split("@")[0] || "User";

  const navLinkClass = ({ isActive }) =>
    [
      "hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
      isActive
        ? "bg-red-600/15 text-red-400"
        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl px-4 sm:px-6">
      {/* Brand */}
      <div className="flex items-center gap-6 min-w-0">
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition-shadow">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white">
            Drive<span className="text-red-500">Vault</span>
          </span>
        </Link>

        {/* Desktop quick links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={navLinkClass}>
            <Package className="w-3.5 h-3.5" />
            Inventory
          </NavLink>
          {isAdmin && (
            <NavLink to="/add-vehicle" className={navLinkClass}>
              <PlusCircle className="w-3.5 h-3.5" />
              Add Vehicle
            </NavLink>
          )}
        </div>
      </div>

      {/* Profile menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={[
            "inline-flex items-center gap-2.5 rounded-xl border px-2 py-1.5 sm:px-2.5 sm:py-1.5 transition-all",
            menuOpen
              ? "border-red-500/40 bg-red-600/10"
              : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900",
          ].join(" ")}
        >
          {/* Avatar */}
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-[11px] font-bold text-white shadow-inner">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400" />
          </span>

          {/* Name — desktop */}
          <span className="hidden sm:flex flex-col items-start text-left min-w-0">
            <span className="text-[13px] font-semibold text-white truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
              {user.role}
            </span>
          </span>

          <ChevronDown
            className={[
              "w-4 h-4 text-zinc-500 transition-transform duration-200 hidden sm:block",
              menuOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* User header */}
            <div className="px-4 py-3.5 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-sm font-bold text-white">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">
                    {user.name || displayName}
                  </p>
                  <p className="text-[12px] text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <span className="mt-2.5 inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-800/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {user.role}
              </span>
            </div>

            {/* Mobile nav links */}
            <div className="md:hidden py-1.5 border-b border-zinc-800/80">
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                Dashboard
              </Link>
              <Link
                to="/inventory"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <Package className="w-4 h-4 text-zinc-500" />
                Inventory
              </Link>
              {isAdmin && (
                <Link
                  to="/add-vehicle"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-zinc-500" />
                  Add Vehicle
                </Link>
              )}
            </div>

            <div className="py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <User className="w-4 h-4 text-zinc-500" />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-500" />
                Settings
              </button>
            </div>

            <div className="border-t border-zinc-800/80 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;