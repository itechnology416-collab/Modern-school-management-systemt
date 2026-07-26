import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState([]); const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { load(); }, [filter]);
  const load = async () => { try{const{data}=await api.get('/org/approvals',{params:{status:filter}});setApprovals(data)}catch{}finally{setLoading(false)}; };

  const handleAction = async (id, action, comment) => {
    try { await api.put(`/org/approvals/${id}`, { action, comment }); toast.success(`${action} — ${comment}`); load(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'type', label:'Type', render:r=><Badge>{r.type}</Badge> },
    { key:'title', label:'Request', render:r=><span className="font-medium">{r.title}</span> },
    { key:'submittedBy', label:'From', render:r=>r.submittedBy?.name },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='approved'?'success':r.status==='rejected'?'danger':'warning'}>{r.status}</Badge> },
    { key:'createdAt', label:'Date', render:r=>new Date(r.createdAt).toLocaleDateString() },
    { key:'actions', label:'Actions', render:r=>r.status==='pending'&&(<div className="flex gap-1"><Button size="sm" variant="ghost" className="text-green-600" onClick={()=>handleAction(r._id,'approved','Approved')}><CheckCircle className="w-3 h-3"/> Approve</Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>handleAction(r._id,'rejected','Rejected')}><XCircle className="w-3 h-3"/> Reject</Button></div>)},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Approval Workflows',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><FileCheck className="w-6 h-6"/>Approval Workflows</h1><p className="text-gray-500 text-sm">Manage leave requests, fee concessions, and other approvals</p></div>
      <div className="flex gap-2">{['pending','approved','rejected'].map(s=><button key={s} onClick={()=>setFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize ${filter===s?'bg-blue-600 text-white':'bg-gray-100'}`}>{s}</button>)}</div>
      <Card><Table columns={columns} data={approvals} loading={loading} emptyMessage="No pending approvals"/></Card>
    </div>
  );
}
