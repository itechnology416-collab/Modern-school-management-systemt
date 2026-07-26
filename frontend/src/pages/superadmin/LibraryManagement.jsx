import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, BookCheck, Library, Search, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function LibraryManagement() {
  const [books, setBooks] = useState([]); const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true); const [tab, setTab] = useState('books');
  const [showModal, setShowModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', author:'', isbn:'', category:'', quantity:1 });
  const [issueForm, setIssueForm] = useState({ bookId:'', userId:'', dueDate:'' });
  const [showIssue, setShowIssue] = useState(false);

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => { setLoading(true); try { const [b, i] = await Promise.all([api.get('/library/books'), api.get('/library/issues')]); setBooks(b.data); setIssues(i.data); } catch {} finally { setLoading(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/library/books/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/library/books', form); toast.success('Book added'); }
      setShowModal(false); resetForm(); loadAll();
    } catch { toast.error('Failed'); }
  };
  const handleIssue = async (e) => {
    e.preventDefault();
    try { await api.post('/library/issues', issueForm); toast.success('Issued!'); setShowIssue(false); loadAll(); } catch { toast.error('Failed'); }
  };
  const handleReturn = async (id) => { try { await api.post(`/library/issues/${id}/return`); toast.success('Returned!'); loadAll(); } catch { toast.error('Failed'); } };
  const resetForm = () => { setForm({ title:'', author:'', isbn:'', category:'', quantity:1 }); setEditing(null); };

  const bookColumns = [
    { key:'title', label:'Title', render:r=><span className="font-medium">{r.title}</span> }, { key:'author', label:'Author' }, { key:'isbn', label:'ISBN', render:r=><span className="font-mono text-xs">{r.isbn||'-'}</span> },
    { key:'category', label:'Category', render:r=><Badge>{r.category}</Badge> },
    { key:'available', label:'Available', render:r=><span className={r.available===0?'text-red-600 font-bold':''}>{r.available}/{r.quantity}</span> },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({title:r.title,author:r.author,isbn:r.isbn,category:r.category,quantity:r.quantity});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/library/books/${r._id}`);loadAll()}}}><Trash2 className="w-3 h-3"/></Button></div>)}],
  ];
  const issueColumns = [
    { key:'book', label:'Book', render:r=>r.bookId?.title }, { key:'user', label:'Borrower', render:r=>r.userId?.name },
    { key:'issueDate', label:'Issued', render:r=>new Date(r.issueDate).toLocaleDateString() },
    { key:'dueDate', label:'Due', render:r=>new Date(r.dueDate).toLocaleDateString() },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='issued'?'warning':r.status==='overdue'?'danger':'success'}>{r.status}</Badge> },
    { key:'fine', label:'Fine', render:r=>r.fine>0?<span className="text-red-600 font-medium">₹{r.fine}</span>:'-' },
    { key:'actions', label:'Actions', render:r=>r.status!=='returned'&&<Button size="sm" variant="ghost" className="text-green-600" onClick={()=>handleReturn(r._id)}><BookCheck className="w-3 h-3"/> Return</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Library Management',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Library className="w-6 h-6"/>Library Management</h1><p className="text-gray-500 text-sm">Manage books, issue/return tracking, and fines</p></div><div className="flex gap-2"><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Add Book</Button><Button variant="secondary" icon={BookOpen} onClick={()=>{setIssueForm({bookId:'',userId:'',dueDate:''});setShowIssue(true)}}>Issue Book</Button></div></div>
      <div className="flex gap-2">{[{k:'books',l:'Books'},{k:'issues',l:'Issues'}].map(t=><button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${tab===t.k?'bg-blue-600 text-white':'bg-gray-100'}`}>{t.l} ({t.k==='books'?books.length:issues.length})</button>)}</div>
      <Card><Table columns={tab==='books'?bookColumns:issueColumns} data={tab==='books'?books:issues} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Book':'Add Book'}><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><Input label="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Input label="ISBN" value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})}/><Input label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></div><Input label="Quantity" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} min={1}/><Button type="submit">{editing?'Update':'Add'} Book</Button></form></Modal>
      <Modal isOpen={showIssue} onClose={()=>setShowIssue(false)} title="Issue Book"><form onSubmit={handleIssue} className="space-y-4"><Select label="Book" value={issueForm.bookId} onChange={e=>setIssueForm({...issueForm,bookId:e.target.value})} options={books.filter(b=>b.available>0).map(b=>({value:b._id,label:`${b.title} (${b.available} available)`}))} required/><Input label="Borrower User ID" value={issueForm.userId} onChange={e=>setIssueForm({...issueForm,userId:e.target.value})} placeholder="Student/Staff ID"/><Input label="Due Date" type="date" value={issueForm.dueDate} onChange={e=>setIssueForm({...issueForm,dueDate:e.target.value})} required/><Button type="submit" className="w-full">Issue Book</Button></form></Modal>
    </div>
  );
}
