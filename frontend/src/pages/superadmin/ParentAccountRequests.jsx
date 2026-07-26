import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Parent account requests - similar to admission but for parent accounts
export default function ParentAccountRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // For demo, we use admissions with 'approved' needed for parent accounts
  useEffect(() => {
    api.get('/admissions', { params: { status: 'pending' } })
      .then(r => setRequests(r.data.map(a => ({ ...a, parentEmail: a.email, parentPhone: a.phone, parentName: a.parentName || a.studentName + "'s Parent" }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key:'parentName', label:'Parent', render:r=><span className="font-medium">{r.parentName}</span> },
    { key:'parentEmail', label:'Email' },
    { key:'parentPhone', label:'Phone' },
    { key:'studentName', label:'Student' },
    { key:'createdAt', label:'Date', render:r=>new Date(r.createdAt).toLocaleDateString() },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" className="text-green-600" onClick={async()=>{try{await api.post('/auth/create-user',{name:r.parentName,email:r.parentEmail,phone:r.parentPhone,role:'parent'});toast.success('Account created!');setRequests(prev=>prev.filter(x=>x._id!==r._id))}catch{toast.error('Failed')}}><CheckCircle className="w-3 h-3"/> Approve</Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>setRequests(prev=>prev.filter(x=>x._id!==r._id))}><XCircle className="w-3 h-3"/> Reject</Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Parents'},{label:'Requests',active:true}]} />
      <div><h1 className="text-2xl font-bold">Parent Account Requests</h1><p className="text-gray-500 text-sm">Approve or reject parent account requests</p></div>
      <Card><Table columns={columns} data={requests} loading={loading} emptyMessage="No pending requests"/></Card>
    </div>
  );
}
