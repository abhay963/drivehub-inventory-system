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
  Mail,
  BadgeCheck,
  Camera,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
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

/**
 * Cartoon avatar via DiceBear — unique & stable per user.
 * Styles: avataaars | bottts | lorelei | personas | fun-emoji | shapes
 */
function getAvatarUrl(email = "", name = "") {
  const seed = encodeURIComponent((email || name || "user").toLowerCase().trim());
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/* -------------------------------------------------------------------------- */
/* Navbar                                                                     */
/* -------------------------------------------------------------------------- */

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { logout } = auth;
  const user = resolveUser(auth.user);
  const isAdmin = user.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "profile" | "settings" | null

  // Interactive state for profile modification
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Cartoon avatar — unique per user
  const avatarUrl = getAvatarUrl(user.email, user.name);

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
      if (e.key === "Escape") {
        setMenuOpen(false);
        setModalType(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2500);
      setModalType(null);
    }, 600);
  };

  const initials = getInitials(user.name, user.email);

  const formatNameFromEmail = (email) => {
    if (!email || email === "Signed in") return "User";
    const localPart = email.split("@")[0];
    return localPart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const displayName = user.name || formatNameFromEmail(user.email);

  const navLinkClass = ({ isActive }) =>
    [
      "hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
      isActive
        ? "bg-red-600/15 text-red-400"
        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]",
    ].join(" ");

  return (
    <>
      <nav className="sticky top-0 z-45 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition-shadow">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              Drive<span className="text-red-500">Hub</span>
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
            {/* Cartoon avatar — unique per user */}
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-zinc-800 shadow-inner shrink-0">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden absolute inset-0 flex items-center justify-center bg-zinc-800 text-[11px] font-bold text-white">
                {initials}
              </span>
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">
                      {displayName}
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
                  onClick={() => {
                    setMenuOpen(false);
                    setModalType("profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-500" />
                  Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setModalType("settings");
                  }}
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

      {/* Profile / Settings Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800/80 bg-zinc-950 shadow-2xl shadow-red-950/20 overflow-hidden relative">
            {/* Modal Header */}
            <div className="relative px-6 pt-6 pb-5 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-transparent flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-widest mb-1">
                  {modalType === "profile" ? (
                    <BadgeCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Settings className="w-3.5 h-3.5" />
                  )}
                  {modalType === "profile" ? "Account Control" : "Configuration"}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white capitalize">
                  {modalType === "profile" ? "User Profile Settings" : "App Settings"}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {modalType === "profile" ? (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Banner / Avatar Section */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
                    <div className="relative group">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden bg-zinc-800 shadow-lg">
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{displayName}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Role:{" "}
                        <span className="text-red-400 uppercase font-semibold">
                          {user.role}
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                        ● Active Status
                      </span>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Email Notifications
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Receive alerts regarding vehicle updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 accent-red-600 cursor-pointer"
                      />
                    </div>
                    <hr className="border-zinc-800" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          High Contrast Theme
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Enhance UI borders and text layout
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
                    <button
                      onClick={() => setModalType(null)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 shadow-lg shadow-red-600/25 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-semibold shadow-xl backdrop-blur-md">
          <BadgeCheck className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}
    </>
  );
};

export default Navbar;