import { useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

export default function CertificateTemplates() {
  const [templates, setTemplates] = useState([
    { id:1, name:'Achievement Gold', type:'achievement', content:'This is to certify that {student} has achieved excellence in {field}.' },
    { id:2, name:'Participation', type:'participation', content:'This certifies that {student} actively participated in {event}.' },
    { id:3, name:'Transfer Certificate', type:'transfer', content:'This is to certify that {student} of class {class} has been transferred.' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', type:'achievement', content:'' });

  const addTemplate = () => {
    if(!form.name||!form.content) return toast.error('Fill all fields');
    setTemplates([...templates,{id:Date.now(),...form}]); setShowModal(false); setForm({name:'',type:'achievement',content:''}); toast.success('Template added');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Certificates'},{label:'Templates',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Certificate Templates</h1><p className="text-gray-500 text-sm">Manage certificate design templates</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Template</Button></div>
      <div className="space-y-3">{templates.map(t=>(<Card key={t.id}><div className="p-4 flex justify-between"><div><h3 className="font-medium">{t.name}</h3><p className="text-xs text-gray-500 capitalize">{t.type}</p><p className="text-sm text-gray-600 mt-1">{t.content.substring(0,80)}...</p></div><button onClick={()=>{setTemplates(templates.filter(x=>x.id!==t.id));toast.success('Deleted')}} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div></Card>))}</div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Template"><div className="space-y-4"><Input label="Template Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Select label="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} options={[{value:'achievement',label:'Achievement'},{value:'participation',label:'Participation'},{value:'transfer',label:'Transfer'},{value:'character',label:'Character'},{value:'custom',label:'Custom'}]}/><div><label className="label">Content</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={4} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Use {student}, {class}, {field} as placeholders"/></div><Button onClick={addTemplate} className="w-full">Add Template</Button></div></Modal>
    </div>
  );
}
