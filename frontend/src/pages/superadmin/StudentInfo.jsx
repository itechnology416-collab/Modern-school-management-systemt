import { useState, useEffect } from 'react';
import { Search, Edit, UserCog } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export default function StudentInfo() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => { api.get('/users/students').then(r=>{setStudents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const filtered = students.filter(s=> s.userId?.name?.toLowerCase().includes(search.toLowerCase()) || s.rollNo?.toString().includes(search));
  const columns = [
    { key: 'rollNo', label: 'Roll' }, { key: 'name', label: 'Name', render: r=>r.userId?.name }, { key: 'email', label: 'Email', render: r=>r.userId?.email },
    { key: 'class', label: 'Class', render: r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key: 'gender', label: 'Gender', render: r=><span className="capitalize">{r.gender}</span> },
    { key: 'status', label: 'Status', render: r=><Badge variant={r.userId?.isActive?'success':'danger'}>{r.userId?.isActive?'Active':'Inactive'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Students'},{label:'Information',active:true}]} />
      <div><h1 className="text-2xl font-bold">Student Information</h1><p className="text-gray-500 text-sm">View and manage all student records</p></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input placeholder="Search by name or roll..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <Card><Table columns={columns} data={filtered.slice((page-1)*pageSize,page*pageSize)} loading={loading} /><Pagination currentPage={page} totalPages={Math.ceil(filtered.length/pageSize)} totalItems={filtered.length} pageSize={pageSize} onPageChange={setPage} /></Card>
    </div>
  );
}
