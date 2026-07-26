import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger', inquiry: 'info' };

export default function AdmissionRequests() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('pending');
  const pageSize = 15;

  useEffect(() => { load(); }, [filter]);
  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admissions', { params: { status: filter } }); setAdmissions(data); } catch {} finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    try { await api.put(`/admissions/${id}`, { status }); toast.success(`Admission ${status}`); load(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key: 'studentName', label: 'Student', render: r => <span className="font-medium">{r.studentName}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'classApplying', label: 'Class' },
    { key: 'status', label: 'Status', render: r => <Badge variant={statusColors[r.status]}>{r.status}</Badge> },
    { key: 'date', label: 'Date', render: r => new Date(r.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions', render: r => r.status === 'pending' && (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleAction(r._id, 'approved')}><CheckCircle className="w-3 h-3"/> Approve</Button>
        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleAction(r._id, 'rejected')}><XCircle className="w-3 h-3"/> Reject</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Admission'},{label:'Requests',active:true}]} />
      <div><h1 className="text-2xl font-bold">Admission Requests</h1><p className="text-gray-500 text-sm">Review and approve/reject admission applications</p></div>
      <div className="flex gap-2">{['pending','approved','rejected','inquiry'].map(s=><button key={s} onClick={()=>setFilter(s)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize ${filter===s?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{s}</button>)}</div>
      <Card><Table columns={columns} data={admissions.slice((page-1)*pageSize,page*pageSize)} loading={loading} /><Pagination currentPage={page} totalPages={Math.ceil(admissions.length/pageSize)} totalItems={admissions.length} pageSize={pageSize} onPageChange={setPage} /></Card>
    </div>
  );
}
