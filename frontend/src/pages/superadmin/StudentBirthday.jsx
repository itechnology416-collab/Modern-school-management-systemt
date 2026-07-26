import { useState, useEffect } from 'react';
import { Cake, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function StudentBirthday() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth()+1);

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const filtered = students.filter(s=> s.dateOfBirth && new Date(s.dateOfBirth).getMonth()+1 === month).sort((a,b)=> new Date(a.dateOfBirth).getDate() - new Date(b.dateOfBirth).getDate());

  const columns = [
    { key:'name', label:'Student', render:r=>r.userId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'dateOfBirth', label:'Birthday', render:r=>r.dateOfBirth?new Date(r.dateOfBirth).toLocaleDateString('en-US',{month:'long',day:'numeric'}):'N/A' },
    { key:'age', label:'Age', render:r=>r.dateOfBirth?Math.floor((Date.now()-new Date(r.dateOfBirth))/(365.25*86400000)):'-' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Students'},{label:'Birthdays',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Cake className="w-6 h-6 text-pink-500"/>Student Birthdays</h1><p className="text-gray-500 text-sm">View upcoming student birthdays</p></div></div>
      <div className="flex gap-2">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=><button key={m} onClick={()=>setMonth(i+1)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${month===i+1?'bg-pink-600 text-white':'bg-gray-100 text-gray-600'}`}>{m}</button>)}</div>
      <Card><Table columns={columns} data={filtered} loading={loading} emptyMessage={`No birthdays in ${new Date(2024,month-1).toLocaleString('default',{month:'long'})}`}/></Card>
    </div>
  );
}
