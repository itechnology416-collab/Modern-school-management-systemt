import { useState, useEffect } from 'react';
import { ArrowUp, Settings, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PromotionRules() {
  const [classes, setClasses] = useState([]); const [rules, setRules] = useState(null);
  const [form, setForm] = useState({ fromClassId:'', toClassId:'', minAttendance:75, minSubjectsPassed:3, minPercentage:35, autoPromote:false, academicYear:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/classes').then(r=>setClasses(r.data)).catch(()=>{}); }, []);

  const applyPromotion = async () => {
    if (!form.fromClassId||!form.toClassId) return toast.error('Select both classes');
    setLoading(true);
    try {
      const { data } = await api.post('/misc-ext/promote', form);
      setRules(data);
      toast.success(`${data.promotedCount||0} students promoted`);
    } catch { toast.error('Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Students'},{label:'Promotion Rules',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><ArrowUp className="w-6 h-6 text-green-600"/>Class Promotion Rules</h1><p className="text-gray-500 text-sm">Configure promotion criteria and promote students to the next class</p></div>
      <Card><div className="p-6 space-y-4"><h2 className="font-semibold">Promotion Criteria</h2>
        <div className="grid grid-cols-2 gap-4"><Select label="From Class" value={form.fromClassId} onChange={e=>setForm({...form,fromClassId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/><Select label="To Class" value={form.toClassId} onChange={e=>setForm({...form,toClassId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Min Attendance (%)" type="number" value={form.minAttendance} onChange={e=>setForm({...form,minAttendance:Number(e.target.value)})}/><Input label="Min Subjects Passed" type="number" value={form.minSubjectsPassed} onChange={e=>setForm({...form,minSubjectsPassed:Number(e.target.value)})}/></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Min Percentage (%)" type="number" value={form.minPercentage} onChange={e=>setForm({...form,minPercentage:Number(e.target.value)})}/><Input label="Academic Year" value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} placeholder="2024-2025"/></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.autoPromote} onChange={e=>setForm({...form,autoPromote:e.target.checked})}/><span className="text-sm">Auto-promote eligible students</span></label>
        <Button onClick={applyPromotion} loading={loading} className="w-full">Apply Promotion Rules & Promote Students</Button>
      </div></Card>
      {rules && (<Card className="border-green-200"><div className="p-6"><h2 className="font-semibold">Results</h2><p className="text-2xl font-bold text-green-600 mt-2">{rules.promotedCount||0}</p><p className="text-sm text-gray-500">students promoted from {rules.fromClass} to {rules.toClass}</p></div></Card>)}
    </div>
  );
}
