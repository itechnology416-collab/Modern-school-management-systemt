import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function StaffAttendance() {
  const [staff, setStaff] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/users/teachers').then(r=>{setStaff(r.data);const init={};r.data.forEach(s=>init[s._id]='present');setAttendance(init);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const toggle = (id) => setAttendance(p=>({...p,[id]:p[id]==='present'?'absent':'present'}));
  const saveAll = async () => {
    try {
      for(const s of staff) { await api.post('/attendance', { studentId: s._id, classId: 'staff', date, status: attendance[s._id]||'present', remark: 'Staff attendance' }).catch(()=>{}); }
      toast.success('Staff attendance saved');
    } catch {}
  };

  const columns = [
    { key:'name', label:'Staff', render:r=>r.userId?.name },
    { key:'email', label:'Email', render:r=>r.userId?.email },
    { key:'status', label:'Today', render:r=>(<button onClick={()=>toggle(r._id)} className={`px-3 py-1 rounded-full text-xs font-medium ${attendance[r._id]==='present'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{attendance[r._id]==='present'?<><CheckCircle className="w-3 h-3 inline mr-1"/>Present</>:<><XCircle className="w-3 h-3 inline mr-1"/>Absent</>}</button>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Staff'},{label:'Attendance',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Staff Attendance</h1><p className="text-gray-500 text-sm">Mark daily staff attendance</p></div><Button onClick={saveAll}>Save Attendance</Button></div>
      <div className="w-40"><label className="label">Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"/></div>
      <Card><Table columns={columns} data={staff} loading={loading}/></Card>
    </div>
  );
}
