import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-vehicle/:id"
          element={
            <ProtectedRoute>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

export default App;