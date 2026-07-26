import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
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

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', inquiry: 'info' };

export default function AdmitStudent() {
  const [admissions, setAdmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [form, setForm] = useState({ studentName: '', parentName: '', email: '', phone: '', classApplying: '', dateOfBirth: '', gender: 'male', address: '', previousSchool: '', status: 'pending' });

  useEffect(() => { api.get('/classes').then(r => setClasses(r.data)).catch(()=>{}); loadAdmissions(); }, []);

  const loadAdmissions = async () => { try { const { data } = await api.get('/admissions'); setAdmissions(data); } catch {} finally { setLoading(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/admissions/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/admissions', form); toast.success('Admission created'); }
      setShowModal(false); resetForm(); loadAdmissions();
    } catch (err) { toast.error('Failed'); }
  };

  const approveAdmission = async (admission) => {
    try {
      await api.put(`/admissions/${admission._id}`, { status: 'approved' });
      // Also create a student user
      await api.post('/auth/create-user', { name: admission.studentName, email: admission.email, phone: admission.phone, role: 'student', classId: admission.classApplying, dateOfBirth: admission.dateOfBirth, gender: admission.gender });
      toast.success('Admission approved & student created!');
      loadAdmissions();
    } catch (err) { toast.error('Failed to approve'); }
  };

  const resetForm = () => { setForm({ studentName: '', parentName: '', email: '', phone: '', classApplying: '', dateOfBirth: '', gender: 'male', address: '', previousSchool: '', status: 'pending' }); setEditing(null); };

  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => <span className="font-medium">{r.studentName}</span> },
    { key: 'parentName', label: 'Parent', render: (r) => r.parentName || '-' },
    { key: 'email', label: 'Email' },
    { key: 'classApplying', label: 'Class' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusColors[r.status]}>{r.status}</Badge> },
    { key: 'date', label: 'Applied', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-1">
        {r.status === 'pending' && <Button size="sm" variant="ghost" className="text-green-600" onClick={() => approveAdmission(r)}><CheckCircle className="w-3 h-3" /> Approve</Button>}
        <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setForm({ studentName: r.studentName, parentName: r.parentName, email: r.email, phone: r.phone, classApplying: r.classApplying, dateOfBirth: r.dateOfBirth?.split('T')[0]||'', gender: r.gender, address: r.address, previousSchool: r.previousSchool, status: r.status }); setShowModal(true); }}><Edit className="w-3 h-3" /></Button>
        <Button size="sm" variant="ghost" className="text-red-600" onClick={async () => { if(confirm('Delete?')) { await api.delete(`/admissions/${r._id}`); loadAdmissions(); } }}><Trash2 className="w-3 h-3" /></Button>
      </div>
    )},
  ];

  const paginated = admissions.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admission', href: '/superadmin/admission/admit' }, { label: 'Admit Student', active: true }]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Admit Student</h1><p className="text-gray-500 text-sm">Manage new student admissions</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>New Admission</Button></div>
      <Card><Table columns={columns} data={paginated} loading={loading} emptyMessage="No admissions yet" /><Pagination currentPage={page} totalPages={Math.ceil(admissions.length/pageSize)} totalItems={admissions.length} pageSize={pageSize} onPageChange={setPage} /></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Admission':'New Admission'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><Input label="Student Name" value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})} required /><Input label="Parent Name" value={form.parentName} onChange={e=>setForm({...form,parentName:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4"><Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4"><Select label="Class Applying" value={form.classApplying} onChange={e=>setForm({...form,classApplying:e.target.value})} options={classes.map(c=>({value:c.name+' '+c.section,label:c.name+' '+c.section}))} /><Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})} /></div>
          <Select label="Gender" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} options={[{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}]} />
          <Input label="Previous School" value={form.previousSchool} onChange={e=>setForm({...form,previousSchool:e.target.value})} />
          <div className="flex gap-3"><Button type="submit">{editing?'Update':'Create'} Admission</Button><Button variant="secondary" type="button" onClick={()=>setShowModal(false)}>Cancel</Button></div>
        </form>
      </Modal>
    </div>
  );
}
