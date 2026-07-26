import { useState } from 'react';
import { Save, DollarSign, Clock, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

export default function LoanManagement() {
  const [loans, setLoans] = useState([{staff:'',amount:'',reason:'',status:'pending',date:new Date().toISOString().split('T')[0]}]);
  const [form, setForm] = useState({ staffName:'', amount:'', reason:'', installment:'', date:new Date().toISOString().split('T')[0] });

  const addLoan = () => { if(!form.staffName||!form.amount) return toast.error('Fill all fields'); setLoans([...loans,{...form,status:'pending'}]); setForm({staffName:'',amount:'',reason:'',installment:'',date:new Date().toISOString().split('T')[0]}); toast.success('Loan added'); };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Salary'},{label:'Loans',active:true}]} />
      <div><h1 className="text-2xl font-bold">Loan Management</h1><p className="text-gray-500 text-sm">Manage staff loans and advances</p></div>
      <Card><div className="p-6 space-y-4">
        <Input label="Staff Name" value={form.staffName} onChange={e=>setForm({...form,staffName:e.target.value})} placeholder="Enter staff name"/>
        <div className="grid grid-cols-2 gap-4"><Input label="Loan Amount (₹)" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/><Input label="Monthly Installment" value={form.installment} onChange={e=>setForm({...form,installment:e.target.value})}/></div>
        <Input label="Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/>
        <Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <Button icon={Save} onClick={addLoan}>Add Loan Record</Button>
      </div></Card>
      {loans.filter(l=>l.staffName).length>0&&(<Card><div className="p-6"><h2 className="font-semibold mb-3">Loan Records</h2><div className="space-y-2">{loans.filter(l=>l.staffName).map((l,i)=>(<div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium text-sm">{l.staffName}</p><p className="text-xs text-gray-500">{l.reason}</p></div><div className="text-right"><p className="font-bold text-sm">₹{l.amount}</p><p className="text-xs text-gray-500">{l.status}</p></div></div>))}</div></div></Card>)}
    </div>
  );
}
