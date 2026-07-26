import { useState, useEffect } from 'react';
import { Printer, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function AdmitCards() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/exams').then(r=>{setExams(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const printAdmitCard = (exam) => {
    // Generate PDF via backend
    const w = window.open('','_blank');
    w.document.write(`<html><head><style>body{font-family:Arial;padding:20px}.card{border:2px solid #1a2744;border-radius:12px;padding:20px;margin:10px 0;max-width:400px}.title{text-align:center;font-size:18px;font-weight:bold}.details{margin-top:10px}@media print{.card{page-break-after:always}}</style></head><body><h1 style="text-align:center">ADMIT CARDS - ${exam.name}</h1><p style="text-align:center;color:#888">Loading PDF...</p></body></html>`);
    w.document.close();
    // Generate and download
    api.post('/download/certificate', { studentName: `Exam: ${exam.name}`, title: 'ADMIT CARD', content: `This is an admit card for ${exam.name}\nSubject: ${exam.subjectId?.name || 'N/A'}\nDate: ${new Date(exam.date).toLocaleDateString()}\nClass: ${exam.classId?.name} ${exam.classId?.section}` }, { responseType: 'blob' }).then(res => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `admit-card-${exam.name.replace(/\s/g,'-')}.pdf`; a.click();
    }).catch(() => {});
  };

  const columns = [
    { key:'name', label:'Exam', render:r=><span className="font-medium">{r.name}</span> },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'status', label:'Status', render:r=><Badge variant={r.isPublished?'success':'warning'}>{r.isPublished?'Published':'Draft'}</Badge> },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" onClick={()=>printAdmitCard(r)}><Printer className="w-3 h-3"/> Print</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Exams'},{label:'Admit Cards',active:true}]} />
      <div><h1 className="text-2xl font-bold">Print Admit Cards</h1><p className="text-gray-500 text-sm">Generate and print admit cards for exams</p></div>
      <Card><Table columns={columns} data={exams} loading={loading}/></Card>
    </div>
  );
}
