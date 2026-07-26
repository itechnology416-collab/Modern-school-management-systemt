import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ParentAccounts() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', occupation: '', relationship: 'father' });
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => { api.get('/users/parents').then(r=>{setParents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editing){ await api.put(`/users/${editing.userId?._id}`, form); toast.success('Updated'); }
      else { await api.post('/auth/create-user', { ...form, role: 'parent' }); toast.success('Parent created'); }
      setModalOpen(false); resetForm();
      const { data } = await api.get('/users/parents'); setParents(data);
    } catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => { if(!confirm('Delete?')) return; try { await api.delete(`/users/${id}`); toast.success('Deleted'); const { data } = await api.get('/users/parents'); setParents(data); } catch { toast.error('Failed'); } };

  const resetForm = () => { setForm({ name: '', email: '', phone: '', occupation: '', relationship: 'father' }); setEditing(null); };

  const columns = [
    { key:'name', label:'Name', render:r=>r.userId?.name },
    { key:'email', label:'Email', render:r=>r.userId?.email },
    { key:'phone', label:'Phone', render:r=>r.userId?.phone },
    { key:'children', label:'Children', render:r=>r.children?.length||0 },
    { key:'status', label:'Status', render:r=><Badge variant={r.userId?.isActive?'success':'danger'}>{r.userId?.isActive?'Active':'Inactive'}</Badge> },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.userId?.name,email:r.userId?.email,phone:r.userId?.phone,occupation:r.occupation,relationship:r.relationship});setModalOpen(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>handleDelete(r.userId?._id)}><Trash2 className="w-3 h-3"/></Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Parents'},{label:'Accounts',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Parent Accounts</h1><p className="text-gray-500 text-sm">Manage all parent accounts</p></div><Button icon={Plus} onClick={()=>{resetForm();setModalOpen(true)}}>Add Parent</Button></div>
      <Card><Table columns={columns} data={parents.slice((page-1)*pageSize,page*pageSize)} loading={loading} /><Pagination currentPage={page} totalPages={Math.ceil(parents.length/pageSize)} totalItems={parents.length} pageSize={pageSize} onPageChange={setPage} /></Card>
      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Parent':'Add Parent'}><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /><Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required disabled={!!editing}/></div><div className="grid grid-cols-2 gap-4"><Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /><Input label="Occupation" value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})}/></div><Select label="Relationship" value={form.relationship} onChange={e=>setForm({...form,relationship:e.target.value})} options={[{value:'father',label:'Father'},{value:'mother',label:'Mother'},{value:'guardian',label:'Guardian'},{value:'other',label:'Other'}]} /><div className="flex gap-3"><Button type="submit">{editing?'Update':'Create'}</Button><Button variant="secondary" type="button" onClick={()=>setModalOpen(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
