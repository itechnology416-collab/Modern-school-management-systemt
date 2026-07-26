import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ClipboardList } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function TestManagement() {
  const [tests, setTests] = useState([]); const [classes, setClasses] = useState([]); const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', classId:'', subjectId:'', date:'', maxMarks:100, passingMarks:35, duration:60 });

  useEffect(() => {
    Promise.all([api.get('/org/tests'), api.get('/classes'), api.get('/subjects')]).then(([t,c,s])=>{setTests(t.data);setClasses(c.data);setSubjects(s.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/org/tests/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/org/tests', form); toast.success('Test created'); }
      setShowModal(false); resetForm(); const{data}=await api.get('/org/tests');setTests(data);
    } catch { toast.error('Failed'); }
  };
  const resetForm = () => { setForm({ name:'', classId:'', subjectId:'', date:'', maxMarks:100, passingMarks:35, duration:60 }); setEditing(null); };

  const columns = [
    { key:'name', label:'Test', render:r=><span className="font-medium">{r.name}</span> },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'marks', label:'Marks', render:r=>`${r.maxMarks}` },
    { key:'status', label:'Status', render:r=><Badge variant={r.isPublished?'success':'warning'}>{r.isPublished?'Published':'Draft'}</Badge> },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.name,classId:r.classId?._id,subjectId:r.subjectId?._id,date:r.date?.split('T')[0],maxMarks:r.maxMarks,passingMarks:r.passingMarks,duration:r.duration});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/org/tests/${r._id}`);const{data}=await api.get('/org/tests');setTests(data)}}}><Trash2 className="w-3 h-3"/></Button></div>)},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Test Management',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="w-6 h-6"/>Test Management</h1><p className="text-gray-500 text-sm">Manage class tests separately from exams</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Create Test</Button></div>
      <Card><Table columns={columns} data={tests} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Test':'Create Test'}><form onSubmit={handleSubmit} className="space-y-4"><Input label="Test Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><div className="grid grid-cols-2 gap-4"><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} required/><Select label="Subject" value={form.subjectId} onChange={e=>setForm({...form,subjectId:e.target.value})} options={subjects.map(s=>({value:s._id,label:s.name}))} required/></div><div className="grid grid-cols-3 gap-4"><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/><Input label="Max Marks" type="number" value={form.maxMarks} onChange={e=>setForm({...form,maxMarks:e.target.value})}/><Input label="Passing" type="number" value={form.passingMarks} onChange={e=>setForm({...form,passingMarks:e.target.value})}/></div><Input label="Duration (min)" type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/><Button type="submit">{editing?'Update':'Create'} Test</Button></form></Modal>
    </div>
  );
}
