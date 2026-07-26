import { useState, useEffect } from 'react';
import { Plus, DollarSign, Download, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function GenerateSalary() {
  const [staff, setStaff] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ staffId:'', month:new Date().toLocaleString('default',{month:'long'}), year:new Date().getFullYear(), basic:0, allowances:0, deductions:0 });
  const [month, setMonth] = useState(new Date().toLocaleString('default',{month:'long'}));
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([api.get('/users/teachers'),api.get('/salaries',{params:{month,year}})]).then(([t,s])=>{setStaff(t.data);setSalaries(s.data);setLoading(false)}).catch(()=>setLoading(false));
  }, [month,year]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const net = Number(form.basic)+Number(form.allowances)-Number(form.deductions);
    try { await api.post('/salaries', {...form,netPay:net}); toast.success('Salary generated'); setShowModal(false); const{data}=await api.get('/salaries',{params:{month,year}});setSalaries(data); } catch { toast.error('Failed'); }
  };

  const generateAll = async () => {
    for(const s of staff){ await api.post('/salaries', {staffId:s._id,month,year,basic:s.salary||0,allowances:0,deductions:0,netPay:s.salary||0}).catch(()=>{}); }
    toast.success('Salaries generated for all staff'); const{data}=await api.get('/salaries',{params:{month,year}});setSalaries(data);
  };

  const columns = [
    { key:'staff', label:'Staff', render:r=>r.staffId?.name||'N/A' },
    { key:'month', label:'Period', render:r=>`${r.month} ${r.year}` },
    { key:'basic', label:'Basic', render:r=>`₹${r.basic?.toLocaleString()}` },
    { key:'netPay', label:'Net Pay', render:r=><span className="font-semibold">₹{r.netPay?.toLocaleString()}</span> },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='paid'?'success':'warning'}>{r.status}</Badge> },
    { key:'actions', label:'Actions', render:r=>r.status==='pending'&&<Button size="sm" variant="ghost" className="text-green-600" onClick={async()=>{await api.put(`/salaries/${r._id}`,{status:'paid',paidDate:new Date()});const{data}=await api.get('/salaries',{params:{month,year}});setSalaries(data);toast.success('Marked as paid')}}><CheckCircle className="w-3 h-3"/> Mark Paid</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Salary'},{label:'Generate',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Generate Salary</h1><p className="text-gray-500 text-sm">Generate and manage staff salaries</p></div><div className="flex gap-2"><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Salary</Button><Button variant="secondary" onClick={generateAll}>Generate All</Button></div></div>
      <div className="flex gap-4"><Select value={month} onChange={e=>setMonth(e.target.value)} options={['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=>({value:m,label:m}))} className="w-36"/><Select value={year} onChange={e=>setYear(Number(e.target.value))} options={[year-1,year,year+1].map(y=>({value:y,label:String(y)}))} className="w-24"/></div>
      <Card><Table columns={columns} data={salaries} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Generate Salary"><form onSubmit={handleGenerate} className="space-y-4"><Select label="Staff" value={form.staffId} onChange={e=>setForm({...form,staffId:e.target.value})} options={staff.map(s=>({value:s._id,label:s.userId?.name}))} /><div className="grid grid-cols-2 gap-4"><Select label="Month" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} options={['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=>({value:m,label:m}))}/><Select label="Year" value={form.year} onChange={e=>setForm({...form,year:Number(e.target.value)})} options={[year-1,year,year+1].map(y=>({value:y,label:String(y)}))}/></div><div className="grid grid-cols-3 gap-4"><Input label="Basic" type="number" value={form.basic} onChange={e=>setForm({...form,basic:e.target.value})}/><Input label="Allowances" type="number" value={form.allowances} onChange={e=>setForm({...form,allowances:e.target.value})}/><Input label="Deductions" type="number" value={form.deductions} onChange={e=>setForm({...form,deductions:e.target.value})}/></div><p className="text-sm text-right font-semibold">Net Pay: ₹{(Number(form.basic)+Number(form.allowances)-Number(form.deductions)).toLocaleString()}</p><Button type="submit" className="w-full">Generate Salary</Button></form></Modal>
    </div>
  );
}
