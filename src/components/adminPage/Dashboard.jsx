import React, { useMemo } from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Loader,
  AlertCircle,
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
import { useQuery } from "@tanstack/react-query";
import { useGetAllUsers } from "../../api/users/userApi";
import { getAllOrders } from "../../api/order/orderApi";

const DashboardCard = ({ icon, title, value, change, positive }) => (
  <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center">
      <div className="p-3 bg-[#A0522D]/10 rounded-full">{icon}</div>
      <div className="text-right">
        <h3 className="text-sm text-[#8a8888] mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#131313]">{value}</p>
        {change !== undefined && (
          <p
            className={`text-xs ${
              positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {positive ? "↑" : "↓"} {change}% from last month
          </p>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  // Fetch users data
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAllUsers();

  // Fetch orders data
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useQuery({
    queryKey: ["getAllOrders"],
    queryFn: getAllOrders,
  });

  // Calculate total revenue from orders
  const totalRevenue = useMemo(() => {
    if (!orders) return 0;
    return orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }, [orders]);

  // Format total revenue as currency
  const formattedRevenue = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(totalRevenue);
  }, [totalRevenue]);

  // Prepare data for the sales chart (group by month)
  const salesData = useMemo(() => {
    if (!orders) return [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlySales = Array(12).fill(0);

    orders.forEach((order) => {
      if (order.createdAt && order.isPaid) {
        const date = new Date(order.createdAt);
        const month = date.getMonth();
        monthlySales[month] += order.totalPrice || 0;
      }
    });

    return monthNames.map((name, index) => ({
      name,
      sales: monthlySales[index],
    }));
  }, [orders]);

  // Get recently placed orders
  const recentOrders = useMemo(() => {
    if (!orders) return [];

    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order._id?.substring(0, 6) || "N/A",
        customer: order.user?.name || "Anonymous",
        total: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(order.totalPrice || 0),
        status: order.orderStatus || "Processing",
      }));
  }, [orders]);

  // Loading state for the entire dashboard
  if (isUsersLoading || isOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-12 h-12 text-[#A0522D] animate-spin mb-4" />
        <p className="text-lg text-[#8a8888]">Loading dashboard data...</p>
      </div>
    );
  }

  // Error state
  if (isUsersError || isOrdersError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-[#131313] mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-[#8a8888] mb-4">
          {ordersError?.message ||
            "Unable to load dashboard data. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#A0522D] text-white rounded-md hover:bg-[#8B4513]"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#131313] mb-6">Dashboard</h1>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          icon={<DollarSign className="w-6 h-6 text-[#A0522D]" />}
          title="Total Revenue"
          value={formattedRevenue}
          change={12.5}
          positive={true}
        />
        <DashboardCard
          icon={<ShoppingCart className="w-6 h-6 text-[#A0522D]" />}
          title="Total Orders"
          value={orders?.length || 0}
          change={8.2}
          positive={true}
        />
        <DashboardCard
          icon={<Users className="w-6 h-6 text-[#A0522D]" />}
          title="Total Customers"
          value={users?.length || 0}
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
              formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]}
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

        {recentOrders.length > 0 ? (
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
                  <td className="py-3 text-sm">#{order.id}</td>
                  <td className="py-3 text-sm">{order.customer}</td>
                  <td className="py-3 text-sm font-semibold">{order.total}</td>
                  <td className="py-3">
                    <span
                      className={`
                      text-xs px-2 py-1 rounded-full
                      ${
                        order.status === "delivered" ||
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "placed" ||
                            order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "shipped" ||
                            order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "canceled" ||
                            order.status === "Canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-[#8a8888]">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
