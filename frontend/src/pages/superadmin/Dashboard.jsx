import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt,
  GraduationCap, UserCheck, Calendar, ChevronDown, Search, Globe,
} from 'lucide-react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [analytics, attendance] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/attendance', { params: { date: new Date().toISOString().split('T')[0] } }),
        ]);
        setData({ analytics: analytics.data, attendance: attendance.data });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  // Use real API data or fall back to defaults
  const stats = data?.analytics?.stats || {};
  const monthlyData = (data?.analytics?.monthlyIncomeExpense || []).map(m => ({
    month: m._id?.split('-')[1] ? new Date(2000, parseInt(m._id.split('-')[1]) - 1).toLocaleString('default', { month: 'short' }) : m._id,
    income: m.collected || 0,
    expense: (data?.analytics?.monthlyExpenses || []).find(e => e._id === m._id)?.total || 0,
  }));

  const statCards = [
    { label: 'Unpaid invoices', value: stats.unpaidInvoices ?? 0, color: 'from-red-500 to-rose-500', icon: CreditCard, more: 'More info' },
    { label: 'Unpaid Amount', value: `₹${(stats.unpaidAmount ?? 0).toLocaleString()}`, color: 'from-orange-500 to-amber-500', icon: Receipt, more: 'More info' },
    { label: 'Total Students', value: stats.totalStudents ?? 0, color: 'from-emerald-500 to-green-500', icon: TrendingUp, more: 'More info' },
    { label: 'Expense This Month', value: `₹${(stats.expenseThisMonth ?? 0).toLocaleString()}`, color: 'from-blue-500 to-cyan-500', icon: TrendingDown, more: 'More info' },
    { label: 'Collected Fees', value: `₹${(stats.collectedFees ?? 0).toLocaleString()}`, color: 'from-violet-500 to-purple-500', icon: DollarSign, more: 'More info' },
    { label: 'Total Fees', value: `₹${(stats.totalFees ?? 0).toLocaleString()}`, color: 'from-emerald-600 to-teal-500', icon: TrendingUp, more: 'More info' },
    { label: 'Total Teachers', value: stats.totalTeachers ?? 0, color: 'from-sky-500 to-blue-500', icon: TrendingDown, more: 'More info' },
    { label: 'Pending Fees', value: `₹${(stats.unpaidAmount ?? 0).toLocaleString()}`, color: 'from-fuchsia-500 to-pink-500', icon: DollarSign, more: 'More info' },
  ];

  const monthlyData = [
    { month: 'Jan', income: 15000, expense: 5000 },
    { month: 'Feb', income: 18000, expense: 6000 },
    { month: 'Mar', income: 20000, expense: 7000 },
    { month: 'Apr', income: 17000, expense: 5500 },
    { month: 'May', income: 22000, expense: 8000 },
    { month: 'Jun', income: 19444, expense: 5000 },
    { month: 'Jul', income: 21000, expense: 6500 },
    { month: 'Aug', income: 19000, expense: 5800 },
    { month: 'Sep', income: 23000, expense: 7200 },
    { month: 'Oct', income: 25000, expense: 8500 },
    { month: 'Nov', income: 20000, expense: 6200 },
    { month: 'Dec', income: 28000, expense: 9000 },
  ];

  const latestAdmissions = (data?.analytics?.recentAdmissions || []).map(a => ({
    name: a.name, campus: 'Campus', date: a.date ? new Date(a.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '', color: a.status === 'approved' ? 'bg-green-500' : a.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500',
  }));

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => setShowDetails(!showDetails)} className="text-sm text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1">
            {showDetails ? 'Hide Details' : 'Show Details'} <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search Student..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>English</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Main Campus</option>
          </select>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <card.icon className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold mb-1">{card.value}</p>
                <p className="text-sm opacity-90">{card.label}</p>
                <p className="text-xs opacity-70 mt-2 hover:opacity-100 cursor-pointer">{card.more} →</p>
              </div>
            ))}
          </div>

          {/* Current Session */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">2023-2024</p>
                  <p className="text-sm opacity-80">Current Session</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                Change Session
              </button>
            </div>
          </div>

          {/* Monthly Chart + Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Income & Expense Chart */}
            <Card className="lg:col-span-2" title="Monthly Income & Expense Overview">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Latest Admissions */}
            <Card title="Latest Admissions">
              <div className="space-y-3">
                {latestAdmissions.map((admission, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${admission.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {admission.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{admission.name}</p>
                      <p className="text-xs text-gray-500">{admission.campus} · {admission.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 mt-3 hover:text-blue-700 font-medium">View All →</button>
            </Card>
          </div>

          {/* Staff Attendance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Staff Attendance Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-600">{data?.analytics?.staffAttendance?.present ?? 0}</p>
                  <p className="text-sm text-green-700">Total present today</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-red-600">{data?.analytics?.staffAttendance?.absent ?? 0}</p>
                  <p className="text-sm text-red-700">Total absent today</p>
                </div>
              </div>
            </Card>

            {/* Student Attendance */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Attendance Today</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {data?.attendance?.presentCount || 0}
                  </p>
                  <p className="text-sm text-blue-700">Present</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {data?.attendance?.absentCount || 0}
                  </p>
                  <p className="text-sm text-orange-700">Absent</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
