import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HostelManagement() {
  const [hostels, setHostels] = useState([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', type:'boys', capacity:50, monthlyFee:0, wardenName:'', wardenPhone:'' });

  useEffect(() => { api.get('/campus/hostels').then(r=>{setHostels(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/campus/hostels/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/campus/hostels', form); toast.success('Hostel added'); }
      setShowModal(false); resetForm(); const{data}=await api.get('/campus/hostels');setHostels(data);
    } catch { toast.error('Failed'); }
  };
  const resetForm = () => { setForm({ name:'', type:'boys', capacity:50, monthlyFee:0, wardenName:'', wardenPhone:'' }); setEditing(null); };

  const columns = [
    { key:'name', label:'Hostel', render:r=><span className="font-medium">{r.name}</span> },
    { key:'type', label:'Type', render:r=><span className="capitalize">{r.type}</span> },
    { key:'capacity', label:'Capacity', render:r=>`${r.occupied||0}/${r.capacity}` },
    { key:'monthlyFee', label:'Fee (₹/mo)', render:r=>`₹${r.monthlyFee?.toLocaleString()}` },
    { key:'wardenName', label:'Warden' }, { key:'wardenPhone', label:'Phone' },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.name,type:r.type,capacity:r.capacity,monthlyFee:r.monthlyFee,wardenName:r.wardenName,wardenPhone:r.wardenPhone});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/campus/hostels/${r._id}`);const{data}=await api.get('/campus/hostels');setHostels(data)}}}><Trash2 className="w-3 h-3"/></Button></div>)},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Hostel Management',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6"/>Hostel Management</h1><p className="text-gray-500 text-sm">Manage hostel buildings, rooms, and fees</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Add Hostel</Button></div>
      <div className="grid grid-cols-3 gap-4"><div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-700">{hostels.length}</p><p className="text-xs">Total Hostels</p></div><div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-700">{hostels.reduce((s,h)=>s+(h.occupied||0),0)}</p><p className="text-xs">Occupied</p></div><div className="bg-purple-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-700">{hostels.reduce((s,h)=>s+h.capacity,0)}</p><p className="text-xs">Total Capacity</p></div></div>
      <Card><Table columns={columns} data={hostels} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Hostel':'Add Hostel'}><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Hostel Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Select label="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} options={[{value:'boys',label:'Boys'},{value:'girls',label:'Girls'},{value:'co-ed',label:'Co-Ed'}]}/></div><div className="grid grid-cols-2 gap-4"><Input label="Capacity" type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/><Input label="Monthly Fee (₹)" type="number" value={form.monthlyFee} onChange={e=>setForm({...form,monthlyFee:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Input label="Warden Name" value={form.wardenName} onChange={e=>setForm({...form,wardenName:e.target.value})}/><Input label="Warden Phone" value={form.wardenPhone} onChange={e=>setForm({...form,wardenPhone:e.target.value})}/></div><Button type="submit">{editing?'Update':'Add'} Hostel</Button></form></Modal>
    </div>
  );
}
