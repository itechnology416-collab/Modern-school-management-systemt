import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function AccountSettlement() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth()+1); const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { setLoading(true); api.get('/org/settlement',{params:{month,year}}).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, [month, year]);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Accounts Settlement',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><IndianRupee className="w-6 h-6"/>Accounts Settlement</h1><p className="text-gray-500 text-sm">Reconcile expected fees vs actual collection</p></div>
      <div className="flex gap-4"><select value={month} onChange={e=>setMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select><select value={year} onChange={e=>setYear(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">{[year-2,year-1,year,year+1].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><div className="p-6 text-center"><p className="text-sm text-gray-500">Expected Fees</p><p className="text-3xl font-bold text-blue-600">₹{data?.expected?.toLocaleString()||'0'}</p></div></Card>
        <Card><div className="p-6 text-center"><p className="text-sm text-gray-500">Collected</p><p className="text-3xl font-bold text-green-600">₹{data?.collected?.toLocaleString()||'0'}</p></div></Card>
        <Card><div className="p-6 text-center"><p className="text-sm text-gray-500">Outstanding</p><p className="text-3xl font-bold text-red-600">₹{data?.outstanding?.toLocaleString()||'0'}</p><p className="text-xs text-gray-400 mt-1">{data?.percentage||'0'}% collected</p></div></Card>
      </div>
    </div>
  );
}
