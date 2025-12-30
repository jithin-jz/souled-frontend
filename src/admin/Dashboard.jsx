import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import api from '../utils/api';
import Loader from '../components/Loader';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { handleApiError } from '../utils/errorHandler';

const Dashboard = () => {
  const location = useLocation();
  const isRootDashboard = location.pathname === '/admin' || location.pathname === '/admin/dashboard';

  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    recent_orders: [],
    category_data: [],
    low_stock_products: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/panel/dashboard/');
      setStats(res.data);
    } catch (err) {
      handleApiError(err, 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const {
    total_users,
    total_products,
    total_orders,
    total_revenue,
    recent_orders,
    category_data,
    low_stock_products,
  } = stats;

  const COLORS = ['#f87171', '#60a5fa'];
  const BAR_COLORS = ['#f87171', '#fb923c', '#34d399', '#a78bfa', '#facc15'];

  // Prepare data for charts
  const barData = low_stock_products.map((p, i) => ({
    name: p.name,
    stock: p.stock,
    fill: BAR_COLORS[i % BAR_COLORS.length]
  }));

  // Reverse recent orders for timeline (oldest to newest among the recent ones)
  const lineData = [...recent_orders].reverse().map((o) => ({
    name: new Date(o.created_at).toLocaleDateString(),
    total: o.total_amount,
  }));

  const chartTheme = {
    textColor: '#e2e8f0',
    gridColor: '#4a5568',
    tooltip: {
      contentStyle: {
        backgroundColor: '#1f2937',
        borderColor: '#4a5568',
        borderRadius: 8,
        color: '#e2e8f0',
      },
      itemStyle: { color: '#e2e8f0' },
      labelStyle: { color: '#f1f5f9' },
      cursor: { fill: 'transparent' },
    },
    legendStyle: { color: '#cbd5e1' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />
      <main className={`flex-grow p-4 sm:p-6 ${loading ? 'flex flex-col items-center justify-center' : ''}`}>
        {loading ? (
          <Loader />
        ) : isRootDashboard ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Users" value={total_users} color="bg-blue-600" />
              <StatCard title="Products" value={total_products} color="bg-green-600" />
              <StatCard title="Orders" value={total_orders} color="bg-orange-600" />
              <StatCard title="Revenue" value={`₹${total_revenue}`} color="bg-purple-600" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-slate-800 rounded-xl p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={category_data}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {category_data.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTheme.tooltip} />
                      <Legend wrapperStyle={{ color: chartTheme.legendStyle.color }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-slate-800 rounded-xl p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                      <XAxis dataKey="name" stroke={chartTheme.textColor} />
                      <YAxis stroke={chartTheme.textColor} />
                      <Tooltip {...chartTheme.tooltip} />
                      <Bar dataKey="stock">
                        {barData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-slate-800 rounded-xl p-4 shadow-md lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Recent Orders Revenue</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                      <XAxis dataKey="name" stroke={chartTheme.textColor} />
                      <YAxis stroke={chartTheme.textColor} />
                      <Tooltip {...chartTheme.tooltip} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={{ fill: '#7c3aed' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="text-center text-sm p-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        &copy; {new Date().getFullYear()} SOULED Admin. All rights reserved.
      </footer>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`rounded-xl text-white p-5 ${color} transition-transform hover:scale-105`}>
    <p className="text-sm uppercase font-semibold opacity-90">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

export default Dashboard;

