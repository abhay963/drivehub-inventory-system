import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
} from "lucide-react";

const allLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/add-vehicle", label: "Add Vehicle", icon: PlusCircle, adminOnly: true },
];

const Sidebar = () => {
  // Role check based on localStorage user object
  const user = JSON.parse(localStorage.getItem("user"));
 



const isAdmin = user?.role === "admin";



  // Filter links based on user role
  const links = allLinks.filter((link) => !link.adminOnly || isAdmin);

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 min-h-[calc(100vh-4rem)] py-6 px-3">
      <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
        Navigation
      </p>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all",
                isActive
                  ? "bg-red-600/15 text-red-400 border border-red-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent",
              ].join(" ")
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;