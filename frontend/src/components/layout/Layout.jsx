import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 sm:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;