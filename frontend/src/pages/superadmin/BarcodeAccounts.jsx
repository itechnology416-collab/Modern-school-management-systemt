import { useState, useEffect } from 'react';
import { Camera, QrCode, Plus, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function BarcodeAccounts() {
  const [accounts, setAccounts] = useState([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId:'', barcode:'' });

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try{const{data}=await api.get('/misc-ext/barcodes');setAccounts(data)}catch{}finally{setLoading(false)}; };

  const generate = async () => {
    try { const { data } = await api.post('/misc-ext/barcodes/generate', form); toast.success('Barcode generated!'); setShowModal(false); load(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'studentName', label:'Student', render:r=><span className="font-medium">{r.studentId?.userId?.name||r.studentName}</span> },
    { key:'barcode', label:'Barcode', render:r=><span className="font-mono text-xs">{r.barcode}</span> },
    { key:'createdAt', label:'Created', render:r=>new Date(r.createdAt).toLocaleDateString() },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" onClick={()=>{const w=window.open('');w.document.write(`<html><body style="text-align:center;padding:40px"><h2>${r.studentId?.userId?.name||r.studentName}</h2><p>${r.barcode}</p><img src="https://barcode.tec-it.com/barcode.ashx?data=${r.barcode}&code=Code128&translate-esc=true" /><script>window.print()</script></body></html>`)}}><QrCode className="w-3 h-3"/> Print</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Barcode Attendance',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Camera className="w-6 h-6"/>Barcode Attendance Accounts</h1><p className="text-gray-500 text-sm">Generate and manage student barcode IDs for attendance</p></div><div className="flex gap-2"><Button variant="secondary" icon={RefreshCw} onClick={load}>Refresh</Button><Button icon={Plus} onClick={()=>setShowModal(true)}>Generate Barcode</Button></div></div>
      <Card><Table columns={columns} data={accounts} loading={loading} emptyMessage="No barcodes generated yet"/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Generate Barcode"><div className="space-y-4"><Input label="Student ID" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} required/><Input label="Custom Barcode (optional)" value={form.barcode} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Auto-generated if empty"/><Button onClick={generate} className="w-full">Generate Barcode</Button></div></Modal>
    </div>
  );
}
