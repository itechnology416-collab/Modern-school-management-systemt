import { useState, useEffect } from 'react';
import { Printer, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function PrintStudentCards() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const toggle = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const filtered = students.filter(s=> s.userId?.name?.toLowerCase().includes(search.toLowerCase()) || s.rollNo?.toString().includes(search));

  const handlePrint = () => {
    const toPrint = students.filter(s=>selected.includes(s._id));
    const w = window.open('','_blank');
    w.document.write(`<html><head><style>body{font-family:Arial;display:flex;flex-wrap:wrap;gap:20px;padding:20px}.card{border:2px solid #1a2744;border-radius:12px;padding:16px;width:300px;text-align:center}.name{font-size:16px;font-weight:bold}.roll{font-size:14px;color:#666}.barcode{font-family:monospace;font-size:12px;background:#f0f0f0;padding:4px;margin-top:8px}</style></head><body>${toPrint.map(s=>`<div class="card"><div class="name">${s.userId?.name}</div><div class="roll">Roll: ${s.rollNo} | ${s.classId?.name} ${s.classId?.section}</div><div class="barcode">STU-${(s.userId?._id||'').substring(0,8).toUpperCase()}</div></div>`).join('')}</body></html>`);
    w.document.close(); setTimeout(()=>w.print(),500);
  };

  const columns = [
    { key:'check', label:'', render:r=><input type="checkbox" checked={selected.includes(r._id)} onChange={()=>toggle(r._id)} className="w-4 h-4"/> },
    { key:'rollNo', label:'Roll' },
    { key:'name', label:'Name', render:r=>r.userId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'ID Cards'},{label:'Student Cards',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Print Student ID Cards</h1><p className="text-gray-500 text-sm">Select students and print ID cards</p></div><Button icon={Printer} onClick={handlePrint} disabled={selected.length===0}>Print {selected.length} Cards</Button></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <Card><Table columns={columns} data={filtered} loading={loading}/></Card>
    </div>
  );
}
