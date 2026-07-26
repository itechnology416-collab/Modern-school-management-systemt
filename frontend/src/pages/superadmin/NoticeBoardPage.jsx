import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Megaphone, Eye, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', content:'', audience:'all', priority:'normal', expiryDate:'' });

  useEffect(() => { api.get('/features/notices').then(r=>{setNotices(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/features/notices/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/features/notices', form); toast.success('Notice published'); }
      setShowModal(false); resetForm();
      const { data } = await api.get('/features/notices'); setNotices(data);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/features/notices/${id}`); setNotices(prev=>prev.filter(n=>n._id!==id)); toast.success('Deleted'); };
  const resetForm = () => { setForm({ title:'', content:'', audience:'all', priority:'normal', expiryDate:'' }); setEditing(null); };

  const priorityColors = { low:'info', normal:'', high:'warning', urgent:'danger' };

  const columns = [
    { key:'title', label:'Title', render:r=><span className="font-medium">{r.title}</span> },
    { key:'audience', label:'Audience', render:r=><Badge>{r.audience}</Badge> },
    { key:'priority', label:'Priority', render:r=><Badge variant={priorityColors[r.priority]}>{r.priority}</Badge> },
    { key:'createdAt', label:'Date', render:r=>new Date(r.createdAt).toLocaleDateString() },
    { key:'views', label:'Views', render:r=>r.viewCount||0 },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({title:r.title,content:r.content,audience:r.audience,priority:r.priority,expiryDate:r.expiryDate?.split('T')[0]||''});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>handleDelete(r._id)}><Trash2 className="w-3 h-3"/></Button></div>)},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Notice Board',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Megaphone className="w-6 h-6"/>Notice Board</h1><p className="text-gray-500 text-sm">Create and manage school notices</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>New Notice</Button></div>
      <Card><Table columns={columns} data={notices} loading={loading} emptyMessage="No notices yet"/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Notice':'New Notice'} size="lg"><form onSubmit={handleSubmit} className="space-y-4"><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><div><label className="label">Content</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={5} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/></div><div className="grid grid-cols-2 gap-4"><Select label="Audience" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} options={[{value:'all',label:'Everyone'},{value:'parents',label:'Parents'},{value:'students',label:'Students'},{value:'staff',label:'Staff'}]}/><Select label="Priority" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} options={[{value:'low',label:'Low'},{value:'normal',label:'Normal'},{value:'high',label:'High'},{value:'urgent',label:'Urgent'}]}/></div><Input label="Expiry Date" type="date" value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})}/><div className="flex gap-3"><Button type="submit">{editing?'Update':'Publish'} Notice</Button><Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
