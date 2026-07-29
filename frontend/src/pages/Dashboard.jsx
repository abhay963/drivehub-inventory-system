import React from "react";
import Layout from "../components/layout/Layout"
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  // Retrieve logged-in user securely from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || localStorage.getItem("role") || "user";
  const isAdmin = role.toLowerCase() === "admin";

  return (
    <Layout>
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </Layout>
  );
};

export default Dashboard;