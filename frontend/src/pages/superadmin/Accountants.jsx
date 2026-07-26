import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function Accountants() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/fees').then(r=>{setFees(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const total = fees.reduce((s,f)=>s+f.totalAmount,0);
  const collected = fees.reduce((s,f)=>s+f.paidAmount,0);

  const columns = [
    { key:'student', label:'Student', render:r=>r.studentId?.userId?.name||'N/A' },
    { key:'feeName', label:'Fee' },
    { key:'amount', label:'Amount', render:r=><span>₹{r.paidAmount}/₹{r.totalAmount}</span> },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='paid'?'success':r.status==='overdue'?'danger':'warning'}>{r.status}</Badge> },
    { key:'dueDate', label:'Due', render:r=>new Date(r.dueDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Accountants',active:true}]} />
      <div><h1 className="text-2xl font-bold">Accountants Dashboard</h1><p className="text-gray-500 text-sm">Financial overview and fee management</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center"><IndianRupee className="w-6 h-6 text-blue-600 mx-auto mb-1"/><p className="text-2xl font-bold text-blue-700">₹{total.toLocaleString()}</p><p className="text-xs text-blue-600">Total Fees</p></div>
        <div className="bg-green-50 rounded-xl p-4 text-center"><TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1"/><p className="text-2xl font-bold text-green-700">₹{collected.toLocaleString()}</p><p className="text-xs text-green-600">Collected</p></div>
        <div className="bg-red-50 rounded-xl p-4 text-center"><IndianRupee className="w-6 h-6 text-red-600 mx-auto mb-1"/><p className="text-2xl font-bold text-red-700">₹{(total-collected).toLocaleString()}</p><p className="text-xs text-red-600">Pending</p></div>
      </div>
      <Card><Table columns={columns} data={fees.slice(0,20)} loading={loading}/></Card>
    </div>
  );
}
