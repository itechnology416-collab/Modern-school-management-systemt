import { useState, useEffect } from 'react';
import { Plus, Users, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ConferencePage() {
  const [conferences, setConferences] = useState([]);
  const [teachers, setTeachers] = useState([]); const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', teacherId:'', parentId:'', studentId:'', date:'', time:'', duration:30, notes:'' });

  useEffect(() => {
    Promise.all([api.get('/campus/conferences'), api.get('/users/teachers'), api.get('/users/parents')]).then(([c,t,p])=>{setConferences(c.data);setTeachers(t.data);setParents(p.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/campus/conferences', form); toast.success('Conference scheduled'); setShowModal(false); const{data}=await api.get('/campus/conferences');setConferences(data); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'title', label:'Title', render:r=><span className="font-medium">{r.title}</span> },
    { key:'teacher', label:'Teacher', render:r=>r.teacherId?.name }, { key:'parent', label:'Parent', render:r=>r.parentId?.name },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() }, { key:'time', label:'Time' },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='scheduled'?'info':r.status==='completed'?'success':'danger'}>{r.status}</Badge> },
    { key:'actions', label:'Actions', render:r=>r.status==='scheduled'&&<Button size="sm" variant="ghost" className="text-green-600" onClick={async()=>{await api.put(`/campus/conferences/${r._id}`,{status:'completed'});const{data}=await api.get('/campus/conferences');setConferences(data);toast.success('Marked completed')}}>Complete</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Parent-Teacher Conference',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6"/>Parent-Teacher Conference</h1><p className="text-gray-500 text-sm">Schedule and manage parent-teacher meetings</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Schedule</Button></div>
      <Card><Table columns={columns} data={conferences} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Schedule Conference"><form onSubmit={handleSubmit} className="space-y-4"><Input label="Meeting Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><Select label="Teacher" value={form.teacherId} onChange={e=>setForm({...form,teacherId:e.target.value})} options={teachers.map(t=>({value:t._id,label:t.userId?.name}))} required/><Select label="Parent" value={form.parentId} onChange={e=>setForm({...form,parentId:e.target.value})} options={parents.map(p=>({value:p.userId?._id,label:p.userId?.name}))} required/><div className="grid grid-cols-2 gap-4"><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/><Input label="Time" type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div><Input label="Duration (min)" type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/><div><label className="label">Notes</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div><Button type="submit" className="w-full">Schedule Conference</Button></form></Modal>
    </div>
  );
}
