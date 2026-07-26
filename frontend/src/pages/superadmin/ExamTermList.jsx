import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ExamTermList() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', classId:'', subjectId:'', examType:'test', date:'', maxMarks:100, passingMarks:35 });

  useEffect(() => {
    Promise.all([api.get('/exams'),api.get('/classes'),api.get('/subjects')]).then(([e,c,s])=>{setExams(e.data);setClasses(c.data);setSubjects(s.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editing){ await api.put(`/exams/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/exams', form); toast.success('Exam created'); }
      setShowModal(false); resetForm(); const{data}=await api.get('/exams');setExams(data);
    } catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ name:'', classId:'', subjectId:'', examType:'test', date:'', maxMarks:100, passingMarks:35 }); setEditing(null); };

  const columns = [
    { key:'name', label:'Exam', render:r=><span className="font-medium">{r.name}</span> },
    { key:'examType', label:'Type', render:r=><Badge>{r.examType}</Badge> },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'published', label:'Status', render:r=><Badge variant={r.isPublished?'success':'warning'}>{r.isPublished?'Published':'Draft'}</Badge> },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.name,classId:r.classId?._id,subjectId:r.subjectId?._id,examType:r.examType,date:r.date?.split('T')[0],maxMarks:r.maxMarks,passingMarks:r.passingMarks});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/exams/${r._id}`);const{data}=await api.get('/exams');setExams(data)}}}><Trash2 className="w-3 h-3"/></Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Exams'},{label:'Term List',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Exam Term / Semester List</h1><p className="text-gray-500 text-sm">Manage exam terms and semesters</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Create Exam</Button></div>
      <Card><Table columns={columns} data={exams} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Exam':'Create Exam'}><form onSubmit={handleSubmit} className="space-y-4"><Input label="Exam Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Select label="Type" value={form.examType} onChange={e=>setForm({...form,examType:e.target.value})} options={[{value:'test',label:'Test'},{value:'mid-term',label:'Mid Term'},{value:'final',label:'Final'},{value:'quiz',label:'Quiz'}]}/><div className="grid grid-cols-2 gap-4"><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))}/><Select label="Subject" value={form.subjectId} onChange={e=>setForm({...form,subjectId:e.target.value})} options={subjects.map(s=>({value:s._id,label:s.name}))}/></div><div className="grid grid-cols-3 gap-4"><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><Input label="Max Marks" type="number" value={form.maxMarks} onChange={e=>setForm({...form,maxMarks:e.target.value})}/><Input label="Passing" type="number" value={form.passingMarks} onChange={e=>setForm({...form,passingMarks:e.target.value})}/></div><div className="flex gap-3"><Button type="submit">{editing?'Update':'Create'}</Button><Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
