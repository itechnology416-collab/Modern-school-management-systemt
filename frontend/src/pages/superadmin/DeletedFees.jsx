import { useState, useEffect } from 'react';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DeletedFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/fees-extended/deleted'); setFees(data); } catch {} finally { setLoading(false); } };

  const restore = async (id) => { try { await api.post(`/fees-extended/restore/${id}`); toast.success('Fee restored!'); load(); } catch { toast.error('Failed'); } };

  const columns = [
    { key:'student', label:'Student', render:r=>r.studentId?.userId?.name||'N/A' },
    { key:'feeName', label:'Fee' },
    { key:'amount', label:'Amount', render:r=>`₹${r.totalAmount?.toLocaleString()}` },
    { key:'deletedAt', label:'Deleted', render:r=>r.deletedAt?new Date(r.deletedAt).toLocaleString():'-' },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" className="text-green-600" onClick={()=>restore(r._id)}><RotateCcw className="w-3 h-3"/> Restore</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Fees'},{label:'Deleted Fees',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-orange-500"/>Deleted Fees Recovery</h1><p className="text-gray-500 text-sm">Restore accidentally deleted fee records</p></div>
      <Card><Table columns={columns} data={fees} loading={loading} emptyMessage="No deleted fees — great job!"/></Card>
    </div>
  );
}
