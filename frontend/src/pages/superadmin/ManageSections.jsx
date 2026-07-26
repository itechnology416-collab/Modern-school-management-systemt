import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageSections() {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'A', classId:'', capacity:40, roomNumber:'' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/classes')]).then(([c])=>{setClasses(c.data);setLoading(false)}).catch(()=>setLoading(false));
    // Since Section model is separate, we display classes as sections for now
    setSections(classes);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editing){ await api.put(`/classes/${editing._id}`, { section: form.name }); toast.success('Updated'); }
      else { await api.post('/classes', { name: form.classId?.split(' ')[0] || 'New', section: form.name, roomNumber: form.roomNumber, capacity: form.capacity }); toast.success('Section created'); }
      setShowModal(false); const { data } = await api.get('/classes'); setSections(data);
    } catch(err) { toast.error('Failed'); }
  };

  const columns = [
    { key:'name', label:'Class', render:r=>r.name },
    { key:'section', label:'Section', render:r=>r.section },
    { key:'roomNumber', label:'Room' },
    { key:'capacity', label:'Capacity' },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.section,classId:r._id,capacity:r.capacity,roomNumber:r.roomNumber});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/classes/${r._id}`);const{data}=await api.get('/classes');setSections(data)}}}><Trash2 className="w-3 h-3"/></Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Classes & Sections'},{label:'Sections',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Manage Sections</h1><p className="text-gray-500 text-sm">Create and manage class sections</p></div><Button icon={Plus} onClick={()=>{setEditing(null);setForm({name:'A',classId:'',capacity:40,roomNumber:''});setShowModal(true)}}>Add Section</Button></div>
      <Card><Table columns={columns} data={sections} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Section':'Add Section'}><form onSubmit={handleSubmit} className="space-y-4"><Select label="Class" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} options={classes.map(c=>({value:c._id,label:`${c.name} ${c.section}`}))} /><Input label="Section Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><div className="grid grid-cols-2 gap-4"><Input label="Capacity" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/><Input label="Room Number" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})}/></div><div className="flex gap-3"><Button type="submit">{editing?'Update':'Create'}</Button><Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
