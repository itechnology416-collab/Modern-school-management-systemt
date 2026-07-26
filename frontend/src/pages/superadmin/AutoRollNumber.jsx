import { useState, useEffect } from 'react';
import { Hash, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AutoRollNumber() {
  const [classes, setClasses] = useState([]); const [form, setForm] = useState({ classId:'', startFrom:1 });
  const [result, setResult] = useState(null);

  useEffect(() => { api.get('/classes').then(r=>setClasses(r.data)).catch(()=>{}); }, []);

  const handleGenerate = async () => {
    if (!form.classId) return toast.error('Select a class');
    try { const { data } = await api.post(`/org/auto-roll/${form.classId}`, { startFrom: form.startFrom }); setResult(data); toast.success(data.message); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Breadcrumb items={[{label:'Auto Roll Numbers',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Hash className="w-6 h-6"/>Auto-Generate Roll Numbers</h1><p className="text-gray-500 text-sm">Automatically assign sequential roll numbers to students</p></div>
      <Card><div className="p-6 space-y-4"><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/><Input label="Start From" type="number" value={form.startFrom} onChange={e=>setForm({...form,startFrom:Number(e.target.value)})} min={1}/><Button onClick={handleGenerate} className="w-full"><Hash className="w-4 h-4"/> Generate Roll Numbers</Button></div></Card>
      {result&&(<Card className="border-green-200"><div className="p-6"><p className="text-lg font-bold text-green-600">{result.message}</p><p className="text-sm text-gray-500">Range: {result.startFrom} to {result.endAt}</p></div></Card>)}
    </div>
  );
}
