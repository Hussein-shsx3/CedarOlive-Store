import React from "react";

function AdminDashboard() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
      <p className="mt-4 text-gray-600">Only accessible to authorized users.</p>
    </div>
  );
}

export default AdminDashboard;