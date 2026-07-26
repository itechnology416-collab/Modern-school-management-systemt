import { useState, useEffect } from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MedicalRecords() {
  const [students, setStudents] = useState([]); const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ bloodGroup:'', allergies:'', conditions:'', medications:'', emergencyContact:'', emergencyPhone:'', doctorName:'', doctorPhone:'' });
  const [search, setSearch] = useState('');

  useEffect(() => { api.get('/users/students').then(r=>setStudents(r.data)).catch(()=>{}); }, []);

  const loadRecord = async (s) => {
    setSelected(s);
    try { const { data } = await api.get(`/misc-ext/medical/${s._id}`); if (data) setForm(data); } catch { setForm({ bloodGroup:'', allergies:'', conditions:'', medications:'', emergencyContact:'', emergencyPhone:'', doctorName:'', doctorPhone:'' }); }
  };

  const save = async () => {
    if (!selected) return;
    try { await api.put(`/misc-ext/medical/${selected._id}`, form); toast.success('Medical record saved!'); } catch { toast.error('Failed'); }
  };

  const filtered = students.filter(s=> s.userId?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Medical Records',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Heart className="w-6 h-6 text-red-500"/>Student Medical Records</h1><p className="text-gray-500 text-sm">Track allergies, conditions, medications, and emergency contacts</p></div>
      <div className="max-w-sm"><Input placeholder="Search student..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card><div className="p-4 max-h-96 overflow-y-auto">{filtered.slice(0,30).map(s=>(<button key={s._id} onClick={()=>loadRecord(s)} className={`w-full text-left p-2 rounded-lg mb-1 text-sm ${selected?._id===s._id?'bg-blue-100 font-medium':'hover:bg-gray-50'}`}>{s.userId?.name} <span className="text-gray-400">({s.rollNo})</span></button>))}</div></Card>
        <Card className="lg:col-span-2"><div className="p-6">{selected ? (<><h2 className="font-semibold mb-4">{selected.userId?.name}</h2><div className="grid grid-cols-2 gap-4"><Input label="Blood Group" value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} placeholder="A+, B+, O+..."/><Input label="Allergies" value={form.allergies} onChange={e=>setForm({...form,allergies:e.target.value})} placeholder="e.g. Peanuts, Pollen"/></div><div className="grid grid-cols-2 gap-4 mt-4"><Input label="Medical Conditions" value={form.conditions} onChange={e=>setForm({...form,conditions:e.target.value})} placeholder="e.g. Asthma"/><Input label="Medications" value={form.medications} onChange={e=>setForm({...form,medications:e.target.value})} placeholder="Current medications"/></div><div className="grid grid-cols-2 gap-4 mt-4"><Input label="Emergency Contact" value={form.emergencyContact} onChange={e=>setForm({...form,emergencyContact:e.target.value})}/><Input label="Emergency Phone" value={form.emergencyPhone} onChange={e=>setForm({...form,emergencyPhone:e.target.value})}/></div><div className="grid grid-cols-2 gap-4 mt-4"><Input label="Doctor Name" value={form.doctorName} onChange={e=>setForm({...form,doctorName:e.target.value})}/><Input label="Doctor Phone" value={form.doctorPhone} onChange={e=>setForm({...form,doctorPhone:e.target.value})}/></div><Button onClick={save} className="mt-6 w-full"><Heart className="w-4 h-4"/> Save Medical Record</Button></>) : <p className="text-gray-400 text-center py-12">Select a student to view/edit medical records</p>}</div></Card>
      </div>
    </div>
  );
}
