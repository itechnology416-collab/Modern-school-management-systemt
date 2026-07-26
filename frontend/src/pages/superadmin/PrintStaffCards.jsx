import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function PrintStaffCards() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => { api.get('/users/teachers').then(r=>{setStaff(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);
  const toggle = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const handlePrint = () => {
    const toPrint = staff.filter(s=>selected.includes(s._id));
    const w = window.open('','_blank');
    w.document.write(`<html><head><style>body{font-family:Arial;display:flex;flex-wrap:wrap;gap:20px;padding:20px}.card{border:2px solid #1a2744;border-radius:12px;padding:16px;width:300px;text-align:center}.name{font-size:16px;font-weight:bold}.role{font-size:14px;color:#666;text-transform:capitalize}.id{font-size:12px;color:#999;margin-top:8px}</style></head><body>${toPrint.map(s=>`<div class="card"><div class="name">${s.userId?.name}</div><div class="role">${s.userId?.role} | ${s.qualification||'Staff'}</div><div class="id">ID: ${(s.userId?._id||'').substring(0,8).toUpperCase()}</div></div>`).join('')}</body></html>`);
    w.document.close(); setTimeout(()=>w.print(),500);
  };

  const columns = [
    { key:'check', label:'', render:r=><input type="checkbox" checked={selected.includes(r._id)} onChange={()=>toggle(r._id)} className="w-4 h-4"/> },
    { key:'name', label:'Name', render:r=>r.userId?.name },
    { key:'email', label:'Email', render:r=>r.userId?.email },
    { key:'role', label:'Role', render:r=><span className="capitalize">{r.userId?.role}</span> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'ID Cards'},{label:'Staff Cards',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Print Staff ID Cards</h1><p className="text-gray-500 text-sm">Select staff and print ID cards</p></div><Button icon={Printer} onClick={handlePrint} disabled={selected.length===0}>Print {selected.length} Cards</Button></div>
      <Card><Table columns={columns} data={staff} loading={loading}/></Card>
    </div>
  );
}
