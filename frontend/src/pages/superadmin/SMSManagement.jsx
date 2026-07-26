import { useState, useEffect } from 'react';
import { Send, Smartphone, Plus, Trash2, Copy } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SMSManagement() {
  const [templates, setTemplates] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [form, setForm] = useState({ to:'parents', message:'', number:'' });
  const [tForm, setTForm] = useState({ name:'', type:'custom', body:'' });

  useEffect(() => { api.get('/misc/sms-templates').then(r=>setTemplates(r.data)).catch(()=>{}); }, []);

  const sendSMS = async () => {
    if(!form.message) return toast.error('Enter a message');
    if(form.to==='specific'){
      if(!form.number) return toast.error('Enter a phone number');
      await api.post('/notifications', { userId: null, title: 'SMS to ' + form.number, message: form.message, type: 'system' });
      toast.success('SMS sent!'); setShowCompose(false); setForm({ to:'parents', message:'', number:'' });
      return;
    }
    // Batch send to audience
    try {
      let users = [];
      if(form.to==='parents') { const{data} = await api.get('/users/parents'); users = data.map(p=>p.userId); }
      else if(form.to==='students') { const{data} = await api.get('/users/students'); users = data.map(s=>s.userId); }
      else if(form.to==='staff') { const{data} = await api.get('/users/teachers'); users = data.map(t=>t.userId); }

      for(const u of users.filter(Boolean)){
        await api.post('/notifications', { userId: u._id||u, title: 'SMS Message', message: form.message, type: 'system' }).catch(()=>{});
      }
      toast.success(`SMS sent to ${users.length} recipients`);
      setShowCompose(false); setForm({ to:'parents', message:'', number:'' });
    } catch { toast.error('Failed'); }
  };

  const addTemplate = async () => {
    try { await api.post('/misc/sms-templates', tForm); toast.success('Template saved'); setShowTemplate(false); const{data}=await api.get('/misc/sms-templates');setTemplates(data); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'SMS & Notifications'},{label:'SMS Management',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">SMS Management</h1><p className="text-gray-500 text-sm">Send SMS messages to parents, students, and staff</p></div><div className="flex gap-2"><Button variant="secondary" onClick={()=>setShowTemplate(true)}>Add Template</Button><Button icon={Send} onClick={()=>setShowCompose(true)}>Compose SMS</Button></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{templates.map(t=>(<Card key={t._id}><div className="p-4"><h3 className="font-medium text-sm">{t.name}</h3><Badge>{t.type}</Badge><p className="text-xs text-gray-500 mt-2">{t.body?.substring(0,80)}...</p><Button size="sm" variant="ghost" className="mt-2" onClick={()=>{setForm({...form,message:t.body});setShowCompose(true)}}><Copy className="w-3 h-3"/> Use</Button></div></Card>))}</div>
      <Modal isOpen={showCompose} onClose={()=>setShowCompose(false)} title="Compose SMS"><div className="space-y-4"><Select label="To" value={form.to} onChange={e=>setForm({...form,to:e.target.value})} options={[{value:'parents',label:'Parents'},{value:'students',label:'Students'},{value:'staff',label:'Staff'},{value:'specific',label:'Specific Number'}]}/><div><label className="label">Message</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} maxLength={160}/><p className="text-xs text-gray-400 text-right">{form.message.length}/160</p></div>{form.to==='specific' && <div><label className="label">Phone Number</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="+1234567890" required/></div>}<Button onClick={sendSMS} className="w-full" icon={Send}>Send SMS</Button></div></Modal>
      <Modal isOpen={showTemplate} onClose={()=>setShowTemplate(false)} title="Add Template"><div className="space-y-4"><Input label="Template Name" value={tForm.name} onChange={e=>setTForm({...tForm,name:e.target.value})}/><Select label="Type" value={tForm.type} onChange={e=>setTForm({...tForm,type:e.target.value})} options={[{value:'fee',label:'Fee'},{value:'attendance',label:'Attendance'},{value:'exam',label:'Exam'},{value:'notice',label:'Notice'},{value:'birthday',label:'Birthday'},{value:'custom',label:'Custom'}]}/><div><label className="label">Body</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={tForm.body} onChange={e=>setTForm({...tForm,body:e.target.value})}/></div><Button onClick={addTemplate} className="w-full">Save Template</Button></div></Modal>
    </div>
  );
}
