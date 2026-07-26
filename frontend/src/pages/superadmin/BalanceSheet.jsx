import { useState, useEffect } from 'react';
import { BarChart3, IndianRupee, TrendingUp, TrendingDown, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function BalanceSheet() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { loadSheet(); }, [month, year]);
  const loadSheet = async () => {
    setLoading(true);
    try { const { data:res } = await api.get('/fees-extended/balance-sheet', { params: { month, year } }); setData(res); } catch {} finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Reports'},{label:'Balance Sheet',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6"/>Balance Sheet</h1><p className="text-gray-500 text-sm">Financial statement for income and expenses</p></div>
      <div className="flex gap-4"><select value={month} onChange={e=>setMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select><select value={year} onChange={e=>setYear(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">{[year-2,year-1,year,year+1].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><div className="p-6"><h2 className="font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600"/>Income</h2><div className="mt-4 space-y-3"><div className="flex justify-between"><span>Fee Collection</span><span className="font-bold">₹{(data?.income?.fees||0).toLocaleString()}</span></div><div className="flex justify-between"><span>Sales (POS)</span><span className="font-bold">₹{(data?.income?.sales||0).toLocaleString()}</span></div><div className="flex justify-between pt-2 border-t"><span className="font-bold">Total Income</span><span className="font-bold text-green-600">₹{((data?.income?.total||0)).toLocaleString()}</span></div></div></div></Card>
        <Card><div className="p-6"><h2 className="font-semibold flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-600"/>Expenses</h2><div className="mt-4 space-y-3"><div className="flex justify-between"><span>Operational</span><span className="font-bold">₹{(data?.expenses?.operational||0).toLocaleString()}</span></div><div className="flex justify-between"><span>Salaries</span><span className="font-bold">₹{(data?.expenses?.salaries||0).toLocaleString()}</span></div><div className="flex justify-between pt-2 border-t"><span className="font-bold">Total Expenses</span><span className="font-bold text-red-600">₹{((data?.expenses?.total||0)).toLocaleString()}</span></div></div></div></Card>
        <Card><div className="p-6 text-center"><h2 className="font-semibold">Net Profit</h2><div className="mt-6"><p className={`text-4xl font-bold ${(data?.netProfit||0)>=0?'text-green-600':'text-red-600'}`}>₹{(data?.netProfit||0).toLocaleString()}</p><p className="text-sm text-gray-500 mt-2">{new Date(year,month-1).toLocaleString('default',{month:'long'})} {year}</p></div></div></Card>
      </div>
    </div>
  );
}
