import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GraduationCap, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AlumniManagement() {
  const [alumni, setAlumni] = useState([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', graduationYear:new Date().getFullYear(), degree:'', occupation:'', company:'', address:'' });

  useEffect(() => { api.get('/campus/alumni').then(r=>{setAlumni(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/campus/alumni/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/campus/alumni', form); toast.success('Alumni added'); }
      setShowModal(false); resetForm(); const{data}=await api.get('/campus/alumni');setAlumni(data);
    } catch { toast.error('Failed'); }
  };
  const resetForm = () => { setForm({ name:'', email:'', phone:'', graduationYear:new Date().getFullYear(), degree:'', occupation:'', company:'', address:'' }); setEditing(null); };

  const columns = [
    { key:'name', label:'Name', render:r=><span className="font-medium">{r.name}</span> },
    { key:'graduationYear', label:'Batch' },
    { key:'degree', label:'Degree' },
    { key:'occupation', label:'Occupation', render:r=>r.occupation||'-' },
    { key:'company', label:'Company', render:r=>r.company||'-' },
    { key:'phone', label:'Phone' },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.name,email:r.email,phone:r.phone,graduationYear:r.graduationYear,degree:r.degree,occupation:r.occupation,company:r.company,address:r.address});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/campus/alumni/${r._id}`);const{data}=await api.get('/campus/alumni');setAlumni(data)}}}><Trash2 className="w-3 h-3"/></Button></div>)},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Alumni Management',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><GraduationCap className="w-6 h-6"/>Alumni Management</h1><p className="text-gray-500 text-sm">Track and manage school alumni records</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Add Alumni</Button></div>
      <Card><Table columns={columns} data={alumni} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Alumni':'Add Alumni'} size="lg"><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Input label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Input label="Graduation Year" type="number" value={form.graduationYear} onChange={e=>setForm({...form,graduationYear:e.target.value})} required/></div><div className="grid grid-cols-2 gap-4"><Input label="Degree" value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})}/><Input label="Occupation" value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})}/></div><Input label="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/><Input label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><Button type="submit">{editing?'Update':'Add'} Alumni</Button></form></Modal>
    </div>
  );
}
