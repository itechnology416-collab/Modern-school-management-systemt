import { useState, useEffect } from 'react';
import { Plus, Send, Search, Phone } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdmissionInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [smsModal, setSmsModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [smsMsg, setSmsMsg] = useState('');
  const [form, setForm] = useState({ studentName: '', parentName: '', phone: '', classApplying: '', source: 'walk-in', status: 'inquiry' });

  useEffect(() => { loadInquiries(); }, []);
  const loadInquiries = async () => { try { const { data } = await api.get('/admissions', { params: { status: 'inquiry' } }); setInquiries(data); } catch {} finally { setLoading(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/admissions', { ...form, status: 'inquiry' }); toast.success('Inquiry recorded'); setShowModal(false); setForm({ studentName: '', parentName: '', phone: '', classApplying: '', source: 'walk-in', status: 'inquiry' }); loadInquiries(); } catch { toast.error('Failed'); }
  };

  const sendSMS = async () => {
    if(!smsMsg.trim()) return toast.error('Enter a message');
    try { await api.post('/notifications', { userId: selected.processedBy, title: 'Admission Follow-up', message: smsMsg, type: 'system' }); toast.success('SMS sent!'); setSmsModal(false); setSmsMsg(''); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key: 'studentName', label: 'Student', render: r => <span className="font-medium">{r.studentName}</span> },
    { key: 'parentName', label: 'Parent' },
    { key: 'phone', label: 'Phone' },
    { key: 'classApplying', label: 'Class' },
    { key: 'createdAt', label: 'Date', render: r => new Date(r.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: r => <Button size="sm" variant="ghost" onClick={() => { setSelected(r); setSmsMsg(`Hi ${r.parentName||r.studentName}, thank you for your interest in our school. We'd love to follow up! Please call us at your convenience.`); setSmsModal(true); }}><Send className="w-3 h-3"/> SMS</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Admission'},{label:'Inquiries',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Admission Inquiries</h1><p className="text-gray-500 text-sm">Manage and follow up on inquiries</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Inquiry</Button></div>
      <Card><Table columns={columns} data={inquiries} loading={loading} emptyMessage="No inquiries" /></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="New Inquiry"><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Student Name" value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})} required /><Input label="Parent Name" value={form.parentName} onChange={e=>setForm({...form,parentName:e.target.value})} /></div><Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required /><Input label="Class" value={form.classApplying} onChange={e=>setForm({...form,classApplying:e.target.value})} /><div className="flex gap-3"><Button type="submit">Save Inquiry</Button><Button variant="secondary" type="button" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
      <Modal isOpen={smsModal} onClose={()=>setSmsModal(false)} title={`Send SMS to ${selected?.parentName||selected?.studentName}`} size="sm"><div className="space-y-4"><p className="text-sm text-gray-600">Phone: {selected?.phone}</p><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={4} value={smsMsg} onChange={e=>setSmsMsg(e.target.value)} /><Button onClick={sendSMS} className="w-full"><Send className="w-4 h-4"/> Send SMS</Button></div></Modal>
    </div>
  );
}
