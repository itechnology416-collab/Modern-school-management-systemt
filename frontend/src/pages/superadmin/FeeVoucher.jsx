import { useState, useEffect } from 'react';
import { Printer, Search, IndianRupee } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function FeeVoucher() {
  const [students, setStudents] = useState([]); const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const printVoucher = async (student) => {
    try {
      const { data: studentFees } = await api.get('/fees', { params: { studentId: student._id } });
      const total = studentFees.reduce((s,f)=>s+f.totalAmount,0);
      const paid = studentFees.reduce((s,f)=>s+f.paidAmount,0);
      const pending = total - paid;
      const res = await api.post('/download/fee-receipt', {
        studentName: student.userId?.name || 'Student',
        feeName: 'Fee Voucher',
        amount: total, paidAmount: paid, date: new Date().toISOString(),
        transactionId: `VCH-${Date.now()}`
      }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url;
      a.download = `fee-voucher-${student.userId?.name?.replace(/\s/g,'-')}.pdf`; a.click();
      toast.success('Voucher downloaded!');
    } catch {
      // Fallback printable HTML
      const w = window.open('','_blank');
      w.document.write(`<html><head><title>Fee Voucher</title><style>body{font-family:Arial;padding:20px}.voucher{border:2px dashed #1a2744;border-radius:12px;padding:24px;max-width:480px;margin:0 auto}.voucher h2{text-align:center;color:#1a2744}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}.total{font-weight:bold;font-size:16px}@media print{body{margin:0}}</style></head><body><div class="voucher"><h2>FEE VOUCHER</h2><p style="text-align:center;color:#666">${new Date().toLocaleDateString()}</p><div class="row"><span>Student:</span><strong>${student.userId?.name||'N/A'}</strong></div><div class="row"><span>Roll No:</span><strong>${student.rollNo||'N/A'}</strong></div><div class="row"><span>Class:</span><strong>${student.classId?.name||'N/A'}</strong></div><div class="row total"><span>TOTAL DUE</span><strong style="color:#dc2626">₹${pending.toLocaleString()}</strong></div><p style="text-align:center;margin-top:24px;font-size:12px;color:#888">This is a computer-generated voucher</p></div></body></html>`);
      w.document.close(); w.print();
    }
  };

  const handleFamilyVoucher = async () => {
    const familyName = prompt('Enter parent/family name:');
    if (!familyName) return;
    try { const { data } = await api.get('/users/parents'); const parent = data.find(p=>p.userId?.name?.toLowerCase()===familyName.toLowerCase()); if (!parent) return toast.error('Parent not found'); const { data: famData } = await api.get(`/fees-extended/family-calculator/${parent._id}`); const w = window.open('','_blank'); w.document.write(`<html><head><title>Family Fee Voucher</title><style>body{font-family:Arial;padding:20px}.v{border:2px dashed #1a2744;border-radius:12px;padding:20px;max-width:500px;margin:10px auto}.v h3{color:#1a2744}.row{display:flex;justify-content:space-between;padding:6px 0}.total{font-weight:bold;font-size:14px;border-top:2px solid #1a2744;margin-top:8px;padding-top:8px}</style></head><body><h1 style="text-align:center">Family Fee Voucher — ${familyName}</h1><p style="text-align:center;color:#666">${famData.studentCount} children | Total: <strong>₹${famData.totalFees?.toLocaleString()}</strong> | Paid: ₹${famData.paidFees?.toLocaleString()} | Pending: <strong style="color:#dc2626">₹${famData.pendingFees?.toLocaleString()}</strong></p></body></html>`); w.document.close(); w.print(); } catch { toast.error('Failed'); }
  };

  const filtered = students.filter(s=> s.userId?.name?.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key:'name', label:'Student', render:r=><span className="font-medium">{r.userId?.name}</span> },
    { key:'rollNo', label:'Roll No' },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" className="text-blue-600" onClick={()=>printVoucher(r)}><Printer className="w-3 h-3"/> Print Voucher</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Fees'},{label:'Print Vouchers',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Printer className="w-6 h-6"/>Fee Voucher Printing</h1><p className="text-gray-500 text-sm">Print individual student or family fee vouchers</p></div><Button variant="secondary" icon={IndianRupee} onClick={handleFamilyVoucher}>Family Voucher</Button></div>
      <div className="max-w-sm"><Input placeholder="Search student..." value={search} onChange={e=>setSearch(e.target.value)} icon={Search}/></div>
      <Card><Table columns={columns} data={filtered.slice(0,50)} loading={loading}/></Card>
    </div>
  );
}
