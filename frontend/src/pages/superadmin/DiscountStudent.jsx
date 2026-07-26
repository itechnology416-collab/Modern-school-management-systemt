import { useState, useEffect } from 'react';
import { Percent, Search, Gift } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DiscountStudent() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [discount, setDiscount] = useState({ percent: 0, amount: 0, reason: '' });
  const [fees, setFees] = useState([]);

  useEffect(() => { api.get('/users/students').then(r=>setStudents(r.data)).catch(()=>{}); }, []);

  const selectStudent = async (s) => {
    setSelected(s);
    try { const { data } = await api.get('/fees', { params: { studentId: s._id } }); setFees(data); } catch { setFees([]); }
  };

  const applyDiscount = async () => {
    if (!selected) return toast.error('Select a student');
    try {
      await api.post(`/fees-extended/discount/${selected._id}`, discount);
      toast.success(`Discount applied to ${selected.userId?.name}`);
      const { data } = await api.get('/fees', { params: { studentId: selected._id } }); setFees(data);
      setDiscount({ percent: 0, amount: 0, reason: '' });
    } catch { toast.error('Failed'); }
  };

  const filtered = students.filter(s=> s.userId?.name?.toLowerCase().includes(search.toLowerCase()) || s.rollNo?.toString().includes(search));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Fees'},{label:'Discount Student',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="w-6 h-6"/>Discount Student</h1><p className="text-gray-500 text-sm">Apply fee discounts to individual students</p></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input placeholder="Search student..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card><div className="p-4 max-h-96 overflow-y-auto"><h2 className="font-semibold mb-2">Students</h2>{filtered.slice(0,30).map(s=>(<button key={s._id} onClick={()=>selectStudent(s)} className={`w-full text-left p-2 rounded-lg mb-1 text-sm ${selected?._id===s._id?'bg-blue-100 font-medium':'hover:bg-gray-50'}`}>{s.userId?.name} <span className="text-gray-400">(Roll {s.rollNo})</span></button>))}</div></Card>
        <Card className="lg:col-span-2"><div className="p-4">
          {selected ? (<><h2 className="font-semibold mb-4">{selected.userId?.name} — Current Fees</h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">{fees.map(f=>(<div key={f._id} className="flex justify-between p-2 bg-gray-50 rounded text-sm"><span>{f.feeName}</span><span>₹{f.totalAmount?.toLocaleString()}</span></div>))}</div>
          <div className="border-t pt-4 space-y-3"><h3 className="font-medium">Apply Discount</h3><div className="grid grid-cols-2 gap-4"><Input label="Percent (%)" type="number" value={discount.percent} onChange={e=>setDiscount({...discount,percent:Number(e.target.value),amount:0})} placeholder="e.g. 10"/><Input label="Or Fixed Amount (₹)" type="number" value={discount.amount} onChange={e=>setDiscount({...discount,amount:Number(e.target.value),percent:0})} placeholder="e.g. 500"/></div><Input label="Reason" value={discount.reason} onChange={e=>setDiscount({...discount,reason:e.target.value})} placeholder="e.g. Sibling discount"/><Button onClick={applyDiscount} className="w-full"><Gift className="w-4 h-4"/> Apply Discount</Button></div></>) : <p className="text-gray-400 text-center py-12">Select a student to apply discounts</p>}
        </div></Card>
      </div>
    </div>
  );
}
