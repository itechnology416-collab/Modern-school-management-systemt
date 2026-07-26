import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentTransfer() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [transfer, setTransfer] = useState({ reason: '', transferTo: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try { await api.put(`/users/${selected.userId?._id}`, { isActive: false }); toast.success('Student marked as transferred'); setShowModal(false); const { data } = await api.get('/users/students'); setStudents(data); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'name', label:'Student', render:r=>r.userId?.name },
    { key:'rollNo', label:'Roll' },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'status', label:'Status', render:r=><Badge variant={r.userId?.isActive?'success':'danger'}>{r.userId?.isActive?'Active':'Transferred'}</Badge> },
    { key:'actions', label:'Actions', render:r=>r.userId?.isActive&&<Button size="sm" variant="ghost" className="text-orange-600" onClick={()=>{setSelected(r);setTransfer({reason:'',transferTo:'',date:new Date().toISOString().split('T')[0]});setShowModal(true)}}><ArrowRightLeft className="w-3 h-3"/> Transfer</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Students'},{label:'Transfer',active:true}]} />
      <div><h1 className="text-2xl font-bold">Student Transfer</h1><p className="text-gray-500 text-sm">Manage student transfers to other schools</p></div>
      <Card><Table columns={columns} data={students.filter(s=>s.userId?.isActive)} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={`Transfer: ${selected?.userId?.name}`} size="sm"><form onSubmit={handleTransfer} className="space-y-4"><p className="text-sm text-gray-600">This will mark the student as inactive/transferred.</p><div><label className="label">Reason</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} value={transfer.reason} onChange={e=>setTransfer({...transfer,reason:e.target.value})} placeholder="Reason for transfer"/></div><div><label className="label">Transferring To</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={transfer.transferTo} onChange={e=>setTransfer({...transfer,transferTo:e.target.value})} placeholder="School name"/></div><div className="flex gap-3"><Button type="submit">Confirm Transfer</Button><Button variant="secondary" type="button" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
