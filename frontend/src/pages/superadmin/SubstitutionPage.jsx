import { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SubstitutionPage() {
  const [subs, setSubs] = useState([]); const [teachers, setTeachers] = useState([]); const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ absentTeacherId:'', substituteTeacherId:'', classId:'', date:'', period:'', reason:'' });

  useEffect(() => {
    Promise.all([api.get('/org/substitutions'), api.get('/users/teachers'), api.get('/classes')]).then(([s,t,c])=>{setSubs(s.data);setTeachers(t.data);setClasses(c.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/org/substitutions', form); toast.success('Substitution assigned'); setShowModal(false); const{data}=await api.get('/org/substitutions');setSubs(data); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'absent', label:'Absent', render:r=>r.absentTeacherId?.name }, { key:'substitute', label:'Substitute', render:r=>r.substituteTeacherId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() }, { key:'period', label:'Period' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Teacher Substitution',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><ArrowLeftRight className="w-6 h-6"/>Teacher Substitution</h1><p className="text-gray-500 text-sm">Assign substitute teachers for absent staff</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Assign Substitute</Button></div>
      <Card><Table columns={columns} data={subs} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Assign Substitute"><form onSubmit={handleSubmit} className="space-y-4"><Select label="Absent Teacher" value={form.absentTeacherId} onChange={e=>setForm({...form,absentTeacherId:e.target.value})} options={teachers.map(t=>({value:t._id,label:t.userId?.name}))} required/><Select label="Substitute Teacher" value={form.substituteTeacherId} onChange={e=>setForm({...form,substituteTeacherId:e.target.value})} options={teachers.map(t=>({value:t._id,label:t.userId?.name}))} required/><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/><div className="grid grid-cols-2 gap-4"><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/><Input label="Period" value={form.period} onChange={e=>setForm({...form,period:e.target.value})} placeholder="e.g. 3rd"/></div><Input label="Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/><Button type="submit" className="w-full">Assign Substitute</Button></form></Modal>
    </div>
  );
}
