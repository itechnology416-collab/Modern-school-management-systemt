import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Receipt, TrendingDown } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', amount:'', category:'misc', date:new Date().toISOString().split('T')[0], description:'' });

  useEffect(() => { loadExpenses(); }, []);
  const loadExpenses = async () => { try{const{data}=await api.get('/expenses');setExpenses(data.expenses||data)}catch{}finally{setLoading(false)} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editing){ await api.put(`/expenses/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/expenses', form); toast.success('Expense added'); }
      setShowModal(false); resetForm(); loadExpenses();
    } catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ title:'', amount:'', category:'misc', date:new Date().toISOString().split('T')[0], description:'' }); setEditing(null); };

  const total = Array.isArray(expenses)?expenses.reduce((s,e)=>s+(e.amount||0),0):0;

  const columns = [
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'title', label:'Title', render:r=><span className="font-medium">{r.title}</span> },
    { key:'category', label:'Category', render:r=><Badge>{r.category}</Badge> },
    { key:'amount', label:'Amount', render:r=><span className="font-medium text-red-600">₹{r.amount?.toLocaleString()}</span> },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({title:r.title,amount:r.amount,category:r.category,date:r.date?.split('T')[0],description:r.description});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/expenses/${r._id}`);loadExpenses()}}}><Trash2 className="w-3 h-3"/></Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Expenses'},{label:'Manage',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Expense Management</h1><p className="text-gray-500 text-sm">Track and manage all expenses</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Add Expense</Button></div>
      <div className="grid grid-cols-3 gap-4"><div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-red-700">₹{total.toLocaleString()}</p><p className="text-xs text-red-600">Total Expenses</p></div><div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-700">{Array.isArray(expenses)?expenses.length:0}</p><p className="text-xs text-blue-600">Total Entries</p></div><div className="bg-yellow-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-yellow-700">{Array.isArray(expenses)?new Set(expenses.map(e=>e.category)).size:0}</p><p className="text-xs text-yellow-600">Categories</p></div></div>
      <Card><Table columns={columns} data={Array.isArray(expenses)?expenses:[]} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Expense':'Add Expense'}><form onSubmit={handleSubmit} className="space-y-4"><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><div className="grid grid-cols-2 gap-4"><Input label="Amount (₹)" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/><Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={[{value:'salary',label:'Salary'},{value:'utilities',label:'Utilities'},{value:'maintenance',label:'Maintenance'},{value:'supplies',label:'Supplies'},{value:'transport',label:'Transport'},{value:'events',label:'Events'},{value:'misc',label:'Miscellaneous'}]}/></div><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><div className="flex gap-3"><Button type="submit">{editing?'Update':'Add'} Expense</Button><Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
