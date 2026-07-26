import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Percent } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FeeAdjustment() {
  const [classes, setClasses] = useState([]);
  const [mode, setMode] = useState('increment'); // increment | decrement
  const [form, setForm] = useState({ classId:'', percent:0, amount:0, feeName:'', academicYear:'' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/classes').then(r=>setClasses(r.data)).catch(()=>{}); }, []);

  const handleApply = async () => {
    setLoading(true);
    try {
      const endpoint = mode === 'increment' ? '/fees-extended/increment' : '/fees-extended/decrement';
      const { data } = await api.post(endpoint, form);
      setResult(data);
      toast.success(`${data.count} fees ${mode === 'increment' ? 'incremented' : 'decremented'}!`);
    } catch { toast.error('Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Fees'},{label:mode==='increment'?'Fee Increment':'Fee Decrement',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2">{mode==='increment'?<TrendingUp className="w-6 h-6 text-red-500"/>:<TrendingDown className="w-6 h-6 text-green-500"/>}{mode==='increment'?'Fee Increment':'Fee Decrement'}</h1><p className="text-gray-500 text-sm">{mode==='increment'?'Increase fees by percentage or fixed amount':'Decrease fees by percentage or fixed amount'}</p></div>
      <div className="flex gap-2"><button onClick={()=>setMode('increment')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==='increment'?'bg-red-600 text-white':'bg-gray-100'}`}><TrendingUp className="w-4 h-4 inline mr-1"/>Increment</button><button onClick={()=>setMode('decrement')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==='decrement'?'bg-green-600 text-white':'bg-gray-100'}`}><TrendingDown className="w-4 h-4 inline mr-1"/>Decrement</button></div>
      <Card><div className="p-6 space-y-4">
        <Select label="Class (optional — leave empty for all)" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={[{value:'',label:'All Classes'},...classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))]}/>
        <div className="grid grid-cols-2 gap-4"><Input label="Percent (%)" type="number" value={form.percent} onChange={e=>setForm({...form,percent:Number(e.target.value),amount:0})} placeholder="e.g. 5"/><Input label={`Or Fixed Amount (₹)`} type="number" value={form.amount} onChange={e=>setForm({...form,amount:Number(e.target.value),percent:0})} placeholder="e.g. 200"/></div>
        <Input label="Fee Name (optional)" value={form.feeName} onChange={e=>setForm({...form,feeName:e.target.value})} placeholder="e.g. Tuition Fee"/>
        <Input label="Academic Year (optional)" value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} placeholder="e.g. 2024-2025"/>
        <Button onClick={handleApply} loading={loading} className="w-full" variant={mode==='increment'?'danger':'primary'}>Apply {mode==='increment'?'Increment':'Decrement'} to Fees</Button>
      </div></Card>
      {result && (<Card className={result.count>0?'border-green-200':'border-yellow-200'}><div className="p-6"><h2 className="font-semibold mb-2">Results</h2><p className="text-2xl font-bold text-green-600">{result.count} fees {mode==='increment'?'incremented':'decremented'}</p><div className="mt-2 max-h-40 overflow-y-auto text-xs space-y-1">{(result.updates||[]).slice(0,20).map((u,i)=><div key={i} className="flex justify-between p-1 bg-gray-50 rounded">₹{u.previous?.toLocaleString()} → ₹{u.updated?.toLocaleString()}</div>)}</div></div></Card>)}
    </div>
  );
}
