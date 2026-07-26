import { useState, useEffect } from 'react';
import { Printer, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PrintAdmissionForms() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => { api.get('/admissions').then(r=>{setAdmissions(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handlePrint = () => {
    const toPrint = admissions.filter(a => selected.includes(a._id));
    if(toPrint.length===0) return toast.error('Select at least one admission');
    const printWindow = window.open('','_blank');
    printWindow.document.write(`<html><head><title>Admission Forms</title><style>body{font-family:Arial;padding:20px}.form{border:2px solid #000;padding:20px;margin-bottom:20px;page-break-after:always}h1{text-align:center}label{font-weight:bold}</style></head><body>${toPrint.map(a=>`<div class="form"><h1>ADMISSION FORM</h1><p><label>Student:</label> ${a.studentName}</p><p><label>Parent:</label> ${a.parentName||'N/A'}</p><p><label>Email:</label> ${a.email||'N/A'}</p><p><label>Phone:</label> ${a.phone||'N/A'}</p><p><label>Class:</label> ${a.classApplying||'N/A'}</p><p><label>Date:</label> ${new Date(a.createdAt).toLocaleDateString()}</p><p><label>Status:</label> ${a.status}</p></div>`).join('')}</body></html>`);
    printWindow.document.close(); printWindow.print();
  };

  const columns = [
    { key: 'check', label: '', render: r => <input type="checkbox" checked={selected.includes(r._id)} onChange={()=>toggleSelect(r._id)} className="w-4 h-4" /> },
    { key: 'studentName', label: 'Student', render: r => <span className="font-medium">{r.studentName}</span> },
    { key: 'parentName', label: 'Parent' },
    { key: 'classApplying', label: 'Class' },
    { key: 'status', label: 'Status', render: r => <Badge variant={r.status==='approved'?'success':r.status==='pending'?'warning':'danger'}>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Admission'},{label:'Print Forms',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Print Admission Forms</h1><p className="text-gray-500 text-sm">Select admissions and print forms</p></div><Button icon={Printer} onClick={handlePrint} disabled={selected.length===0}>Print {selected.length} Forms</Button></div>
      <Card><Table columns={columns} data={admissions} loading={loading} emptyMessage="No admissions" /></Card>
    </div>
  );
}
