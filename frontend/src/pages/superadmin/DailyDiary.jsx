import { useState, useEffect } from 'react';
import { Plus, BookOpen, Calendar, Trash2, Send } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DailyDiary() {
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('');
  const [form, setForm] = useState({ classId:'', subjectId:'', date:new Date().toISOString().split('T')[0], topic:'', description:'' });

  useEffect(() => {
    Promise.all([api.get('/classes'), api.get('/subjects')]).then(([c, s]) => { setClasses(c.data); setSubjects(s.data); });
    loadDiary();
  }, [classFilter, date]);

  const loadDiary = async () => {
    setLoading(true);
    try { const params = {}; if (classFilter) params.classId = classFilter; if (date) params.date = date; const { data } = await api.get('/features/diary', { params }); setEntries(data); } catch {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/features/diary', form); toast.success('Diary entry added'); setShowModal(false); setForm({ classId:'', subjectId:'', date:new Date().toISOString().split('T')[0], topic:'', description:'' }); loadDiary(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name||'-' },
    { key:'topic', label:'Topic', render:r=><span className="font-medium">{r.topic}</span> },
    { key:'description', label:'Description', render:r=><span className="text-sm text-gray-600 line-clamp-2">{r.description}</span> },
    { key:'teacher', label:'Teacher', render:r=>r.teacherId?.name||'-' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Daily Diary',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/>Daily Homework Diary</h1><p className="text-gray-500 text-sm">Track daily class activities and homework</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Entry</Button></div>
      <div className="flex gap-4 items-end">
        <Select label="Class" value={classFilter} onChange={e=>setClassFilter(e.target.value)} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} className="w-48"/>
        <Input label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-40"/>
      </div>
      <Card><Table columns={columns} data={entries} loading={loading} emptyMessage="No diary entries for this date"/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Diary Entry"><form onSubmit={handleSubmit} className="space-y-4"><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/><Select label="Subject" value={form.subjectId} onChange={e=>setForm({...form,subjectId:e.target.value})} options={subjects.map(s=>({value:s._id,label:s.name}))}/><Input label="Topic" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} required/><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><div><label className="label">Description</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><Button type="submit" className="w-full">Add Entry</Button></form></Modal>
    </div>
  );
}
