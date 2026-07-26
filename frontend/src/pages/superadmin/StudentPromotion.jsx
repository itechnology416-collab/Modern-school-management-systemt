import { useState, useEffect } from 'react';
import { ArrowUp, Search, GraduationCap } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentPromotion() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [promoteTo, setPromoteTo] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/users/students'), api.get('/classes')]).then(([s,c])=>{setStudents(s.data);setClasses(c.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const toggleSelect = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const handlePromote = async () => {
    if(!promoteTo) return toast.error('Select target class');
    try {
      for(const id of selected){ await api.put(`/users/${id}`, { classId: promoteTo }); }
      toast.success(`${selected.length} students promoted!`);
      setShowModal(false); setSelected([]); setPromoteTo('');
    } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'check', label:'', render:r=><input type="checkbox" checked={selected.includes(r._id)} onChange={()=>toggleSelect(r._id)} className="w-4 h-4"/> },
    { key:'rollNo', label:'Roll' }, { key:'name', label:'Name', render:r=>r.userId?.name },
    { key:'class', label:'Current Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'status', label:'Status', render:r=><Badge variant={r.userId?.isActive?'success':'danger'}>{r.userId?.isActive?'Active':'Inactive'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Students'},{label:'Promotion',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Student Promotion</h1><p className="text-gray-500 text-sm">Promote students to next class</p></div><Button icon={ArrowUp} disabled={selected.length===0} onClick={()=>setShowModal(true)}>Promote {selected.length} Students</Button></div>
      <Card><Table columns={columns} data={students} loading={loading} /></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Promote Students" size="sm"><div className="space-y-4"><p className="text-sm text-gray-600">{selected.length} student(s) selected</p><div><label className="label">Promote To</label><select value={promoteTo} onChange={e=>setPromoteTo(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name} {c.section}</option>)}</select></div><Button onClick={handlePromote} className="w-full"><ArrowUp className="w-4 h-4"/> Confirm Promotion</Button></div></Modal>
    </div>
  );
}
