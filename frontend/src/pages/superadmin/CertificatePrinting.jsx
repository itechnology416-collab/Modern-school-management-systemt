import { useState, useEffect } from 'react';
import { Award, Plus, Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CertificatePrinting() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId:'', type:'achievement', title:'Certificate of Achievement', content:'' });

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try { await api.post('/misc/certificates', form); toast.success('Certificate issued!'); setShowModal(false); setForm({studentId:'',type:'achievement',title:'Certificate of Achievement',content:''}); } catch { toast.error('Failed'); }
  };

  const printCertificate = (student) => {
    const w = window.open('','_blank');
    w.document.write(`<html><head><style>body{font-family:Georgia;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}.cert{text-align:center;border:10px double #1a2744;padding:60px;max-width:700px}h1{font-size:36px;color:#1a2744}h2{font-size:20px;color:#555}</style></head><body><div class="cert"><h1>Certificate of Achievement</h1><p style="font-size:18px">This is to certify that</p><h2>${student.userId?.name}</h2><p>has successfully demonstrated excellence</p><p style="margin-top:30px">Date: ${new Date().toLocaleDateString()}</p></div></body></html>`);
    w.document.close(); setTimeout(()=>w.print(),500);
  };

  const columns = [
    { key:'name', label:'Student', render:r=>r.userId?.name },
    { key:'rollNo', label:'Roll' },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" onClick={()=>printCertificate(r)}><Printer className="w-3 h-3"/> Print</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Certificates'},{label:'Printing',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Certificate Printing</h1><p className="text-gray-500 text-sm">Issue and print student certificates</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Issue Certificate</Button></div>
      <Card><Table columns={columns} data={students.slice(0,50)} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Issue Certificate"><form onSubmit={handleIssue} className="space-y-4"><Select label="Student" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} options={students.map(s=>({value:s._id,label:s.userId?.name}))} required/><Select label="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} options={[{value:'achievement',label:'Achievement'},{value:'participation',label:'Participation'},{value:'transfer',label:'Transfer'},{value:'character',label:'Character'},{value:'custom',label:'Custom'}]}/><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><div><label className="label">Content</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></div><Button type="submit" className="w-full">Issue Certificate</Button></form></Modal>
    </div>
  );
}
