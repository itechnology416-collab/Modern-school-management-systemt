import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, IndianRupee, BookOpen, GraduationCap } from 'lucide-react';
import Card from '../../components/common/Card';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function AdvancedAnalytics() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/dashboard'), api.get('/fees-extended/balance-sheet', { params: { month: new Date().getMonth()+1, year: new Date().getFullYear() } })]).then(([a,b])=>{setData({...a.data, balance:b.data});setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Advanced Analytics',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6"/>Advanced Analytics</h1><p className="text-gray-500 text-sm">School performance insights and predictive analytics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{label:'Total Students',val:stats.totalStudents||0,icon:Users,color:'blue'},
          {label:'Total Teachers',val:stats.totalTeachers||0,icon:GraduationCap,color:'purple'},
          {label:'Fee Collection',val:`₹${(stats.collectedFees||0).toLocaleString()}`,icon:IndianRupee,color:'green'},
          {label:'Unpaid Fees',val:`₹${(stats.unpaidAmount||0).toLocaleString()}`,icon:TrendingUp,color:'red'}].map((s,i)=>(
          <Card key={i}><div className="p-5 text-center"><s.icon className={`w-6 h-6 text-${s.color}-500 mx-auto mb-2`}/><p className="text-2xl font-bold text-${s.color}-600">{s.val}</p><p className="text-xs text-gray-500">{s.label}</p></div></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><div className="p-6"><h2 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5"/>Monthly Fee Collection</h2><div className="space-y-2">{(data?.monthlyIncomeExpense||[]).slice(-6).map((m,i)=>(<div key={i} className="flex items-center gap-3"><span className="w-10 text-xs">{m.month}</span><div className="flex-1 bg-gray-100 rounded-full h-4"><div className="bg-green-500 h-4 rounded-full" style={{width:`${data?.stats?.totalFees>0?(m.income/data.stats.totalFees)*100:0}%`}}/></div><span className="w-16 text-xs text-right">₹{m.income?.toLocaleString()}</span></div>))||<p className="text-gray-400 text-center py-4">No data available</p>}</div></div></Card>
        <Card><div className="p-6"><h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5"/>Key Metrics</h2><div className="space-y-4"><div className="flex justify-between"><span>Collection Rate</span><span className="font-bold">{data?.balance?.percentage||'0'}%</span></div><div className="flex justify-between"><span>Staff Present Today</span><span className="font-bold">{data?.staffAttendance?.present||0}</span></div><div className="flex justify-between"><span>Unpaid Invoices</span><span className="font-bold text-red-600">{stats.unpaidInvoices||0}</span></div><div className="flex justify-between"><span>This Month's Expenses</span><span className="font-bold">₹{(stats.expenseThisMonth||0).toLocaleString()}</span></div></div></div></Card>
      </div>
    </div>
  );
}
