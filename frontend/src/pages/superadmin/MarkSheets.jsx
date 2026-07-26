import { useState, useEffect } from 'react';
import { Printer, FileText, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MarkSheets() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => { api.get('/exams').then(r=>{setExams(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const exam = exams.find(e=>e._id===selectedExam);

  const handlePrintMarkSheet = async () => {
    if (!exam?.results?.length) return toast.error('No results');
    try {
      const res = await api.post('/download/report-card', {
        studentName: `Combined Report — ${exam.name}`,
        className: `${exam.classId?.name} ${exam.classId?.section}`,
        examName: exam.name,
        subjects: exam.results.map(r => ({ name: String(r.studentId || 'Student'), marks: r.marksObtained || 0, maxMarks: exam.maxMarks, grade: r.grade || '-', percentage: exam.maxMarks ? ((r.marksObtained / exam.maxMarks) * 100).toFixed(1) + '%' : '-' })),
      }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `mark-sheet-${exam.name.replace(/\s/g,'-')}.pdf`; a.click();
      toast.success('Mark sheet downloaded!');
    } catch {
      // Fallback print
      const w = window.open('','_blank');
      w.document.write(`<html><head><title>Mark Sheet</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px}th{background:#1a2744;color:#fff}.passed{color:green}.failed{color:red}</style></head><body><h1>Mark Sheet — ${exam.name}</h1><table><tr><th>#</th><th>Student</th><th>Marks</th><th>Max</th><th>%</th><th>Grade</th><th>Result</th></tr>${exam.results.map((r,i)=>`<tr><td>${i+1}</td><td>${r.studentId}</td><td>${r.marksObtained}</td><td>${exam.maxMarks}</td><td>${((r.marksObtained/exam.maxMarks)*100).toFixed(1)}%</td><td>${r.grade}</td><td class="${(r.marksObtained>=exam.passingMarks)?'passed':'failed'}">${(r.marksObtained>=exam.passingMarks)?'PASS':'FAIL'}</td></tr>`).join('')}</table></body></html>`);
      w.document.close(); w.print();
    }
  };

  const columns = [
    { key:'name', label:'Exam', render:r=><span className="font-medium">{r.name}</span> },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name },
    { key:'class', label:'Class', render:r=>r.classId?`${r.classId.name} ${r.classId.section}`:'-' },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'results', label:'Results', render:r=>r.results?.length||0 },
    { key:'status', label:'Status', render:r=><Badge variant={r.isPublished?'success':'warning'}>{r.isPublished?'Published':'Draft'}</Badge> },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" onClick={()=>{setSelectedExam(r._id);setTimeout(()=>document.getElementById('print-btn')?.scrollIntoView({behavior:'smooth'}),100)}}><FileText className="w-3 h-3"/> Preview</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Exams'},{label:'Print Mark Sheets',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Printer className="w-6 h-6"/>Print Mark Sheets</h1><p className="text-gray-500 text-sm">Generate and print mark sheets for published exams</p></div></div>
      <Card><Table columns={columns} data={exams.filter(e=>e.isPublished)} loading={loading} emptyMessage="No published exams"/></Card>
      {exam && (<Card className="print-area"><div className="p-4"><div className="flex justify-between items-center mb-4"><h2 className="font-semibold">{exam.name} — {exam.subjectId?.name} ({exam.classId?.name} {exam.classId?.section})</h2><Button id="print-btn" icon={Printer} onClick={handlePrintMarkSheet}>Print Mark Sheet</Button></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-left">Marks</th><th className="px-4 py-3 text-left">Max</th><th className="px-4 py-3 text-left">%</th><th className="px-4 py-3 text-left">Grade</th><th className="px-4 py-3 text-left">Result</th></tr></thead><tbody>{exam.results?.map((r,i)=>(<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3">{i+1}</td><td className="px-4 py-3">{r.studentId}</td><td className="px-4 py-3 font-medium">{r.marksObtained}</td><td className="px-4 py-3">{exam.maxMarks}</td><td className="px-4 py-3">{((r.marksObtained/exam.maxMarks)*100).toFixed(1)}%</td><td className="px-4 py-3"><Badge variant={r.marksObtained>=exam.passingMarks?'success':'danger'}>{r.grade}</Badge></td><td className="px-4 py-3"><span className={r.marksObtained>=exam.passingMarks?'text-green-600 font-medium':'text-red-600 font-medium'}>{r.marksObtained>=exam.passingMarks?'PASS':'FAIL'}</span></td></tr>))}</tbody></table></div></div></Card>)}
    </div>
  );
}
