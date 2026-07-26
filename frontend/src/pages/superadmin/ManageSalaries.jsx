import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function ManageSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/salaries').then(r=>{setSalaries(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);
  const columns = [
    { key:'staff', label:'Staff', render:r=>r.staffId?.name||'N/A' },
    { key:'month', label:'Period', render:r=>`${r.month} ${r.year}` },
    { key:'netPay', label:'Net Pay', render:r=><span className="font-semibold">₹{r.netPay?.toLocaleString()}</span> },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='paid'?'success':'warning'}>{r.status}</Badge> },
    { key:'paidDate', label:'Paid Date', render:r=>r.paidDate?new Date(r.paidDate).toLocaleDateString():'-' },
  ];
  const exportCsv = () => { const rows=[['Staff','Period','Basic','Allowances','Deductions','Net Pay','Status'].join(',')];salaries.forEach(s=>rows.push([s.staffId?.name,`${s.month} ${s.year}`,s.basic,s.allowances,s.deductions,s.netPay,s.status].join(',')));const b=new Blob([rows.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='salary_report.csv';a.click(); };
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Salary'},{label:'Manage',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Manage Salaries</h1><p className="text-gray-500 text-sm">View all salary records</p></div><button onClick={exportCsv} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"><Download className="w-4 h-4 inline mr-1"/>Export CSV</button></div>
      <Card><Table columns={columns} data={salaries} loading={loading}/></Card>
    </div>
  );
}
