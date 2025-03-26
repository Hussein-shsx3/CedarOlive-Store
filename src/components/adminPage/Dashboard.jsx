import React from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardCard = ({ icon, title, value, change, positive }) => (
  <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center">
      <div className="p-3 bg-[#A0522D]/10 rounded-full">{icon}</div>
      <div className="text-right">
        <h3 className="text-sm text-[#8a8888] mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#131313]">{value}</p>
        <p
          className={`text-xs ${positive ? "text-green-600" : "text-red-600"}`}
        >
          {positive ? "↑" : "↓"} {change}% from last month
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 5500 },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      total: "$250.00",
      status: "Completed",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      total: "$175.50",
      status: "Processing",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      total: "$300.75",
      status: "Shipped",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#131313] mb-6">Dashboard</h1>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          icon={<DollarSign className="w-6 h-6 text-[#A0522D]" />}
          title="Total Revenue"
          value="$45,231.89"
          change={12.5}
          positive={true}
        />
        <DashboardCard
          icon={<ShoppingCart className="w-6 h-6 text-[#A0522D]" />}
          title="Total Orders"
          value="452"
          change={8.2}
          positive={true}
        />
        <DashboardCard
          icon={<Users className="w-6 h-6 text-[#A0522D]" />}
          title="New Customers"
          value="123"
          change={5.3}
          positive={false}
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold text-[#131313] mb-4">
          Monthly Sales Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#8a8888" />
            <YAxis stroke="#8a8888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#A0522D"
              strokeWidth={3}
              dot={{ r: 5, fill: "#A0522D" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#131313]">
            Recent Orders
          </h2>
          <button className="text-[#A0522D] hover:underline">View All</button>
        </div>
        <table className="w-full text-left">
          <thead className="border-b border-[#e2e8f0]">
            <tr>
              <th className="py-2 text-sm text-[#8a8888]">Order ID</th>
              <th className="py-2 text-sm text-[#8a8888]">Customer</th>
              <th className="py-2 text-sm text-[#8a8888]">Total</th>
              <th className="py-2 text-sm text-[#8a8888]">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f7f3f3]"
              >
                <td className="py-3 text-sm">{order.id}</td>
                <td className="py-3 text-sm">{order.customer}</td>
                <td className="py-3 text-sm font-semibold">{order.total}</td>
                <td className="py-3">
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full
                    ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  `}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
