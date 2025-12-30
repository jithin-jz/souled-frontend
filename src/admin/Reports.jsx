import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import AdminNavbar from './AdminNavbar';
import Loader from '../components/Loader';
import { handleApiError } from '../utils/errorHandler';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#34d399', '#f87171', '#facc15'];

const chartTheme = {
  backgroundColor: 'transparent',
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
  legendStyle: {
    color: '#cbd5e1',
  },
};

const Reports = () => {
  const [data, setData] = useState({
    total_orders: 0,
    total_revenue: 0,
    revenue_timeline: [],
    payment_distribution: [],
    status_distribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/panel/reports/');
        setData(res.data);
      } catch (error) {
        handleApiError(error, 'Failed to fetch reports');
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const {
    total_orders,
    total_revenue,
    revenue_timeline,
    payment_distribution,
    status_distribution,
  } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <AdminNavbar />

      <main className={`flex-grow p-6 max-w-7xl mx-auto w-full ${loading ? 'flex flex-col items-center justify-center' : ''}`}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Orders" value={total_orders} color="bg-blue-600" />
              <StatCard title="Revenue" value={`₹${Number(total_revenue).toFixed(2)}`} color="bg-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[300px]">
                <h2 className="text-lg font-semibold mb-2">Revenue Timeline</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenue_timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                    <XAxis dataKey="name" stroke={chartTheme.textColor} />
                    <YAxis stroke={chartTheme.textColor} />
                    <Tooltip {...chartTheme.tooltip} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#facc15"
                      strokeWidth={2}
                      dot={{ fill: '#facc15' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px]">
                <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={payment_distribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {payment_distribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTheme.tooltip} />
                    <Legend wrapperStyle={{ color: chartTheme.legendStyle.color }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px] lg:col-span-2">
                <h2 className="text-lg font-semibold mb-2">Order Status Distribution</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={status_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                    <XAxis dataKey="name" stroke={chartTheme.textColor} />
                    <YAxis stroke={chartTheme.textColor} />
                    <Tooltip {...chartTheme.tooltip} />
                    <Bar dataKey="count">
                      {status_distribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-sm p-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        © {new Date().getFullYear()}{' '}
        <span className="text-white font-semibold">Souled Admin</span>. All rights reserved.
      </footer>
    </div>
  );
};


const StatCard = ({ title, value, color }) => (
  <div className={`rounded-xl text-white p-5 ${color} transition-transform hover:scale-105`}>
    <p className="text-sm uppercase font-semibold opacity-80">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Reports;

