import { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function TabulationSheet() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => { api.get('/exams').then(r=>{setExams(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const exam = exams.find(e=>e._id===selectedExam);

  const handlePrint = () => {
    if(!exam?.results?.length) return;
    const studentName = 'Combined Class';
    const subjects = exam.results.map(r => ({ name: String(r.studentId || 'Student'), marks: r.marksObtained || 0, maxMarks: exam.maxMarks, grade: r.grade || '-', percentage: exam.maxMarks ? ((r.marksObtained / exam.maxMarks) * 100).toFixed(1) + '%' : '-' }));
    api.post('/download/report-card', { studentName, className: `${exam.classId?.name || ''} ${exam.classId?.section || ''}`, examName: exam.name, subjects }, { responseType: 'blob' }).then(res => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `tabulation-${exam.name.replace(/\s/g,'-')}.pdf`; a.click();
    }).catch(() => {
      // Fallback to print
      const w = window.open('','_blank');
      w.document.write(`<html><head><title>Tabulation - ${exam.name}</title><style>body{font-family:Arial}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}th{background:#1a2744;color:#fff}</style></head><body><h1>${exam.name}</h1><table>${exam.results.map((r,i) => `<tr><td>${i+1}</td><td>${r.studentId}</td><td>${r.marksObtained}</td><td>${exam.maxMarks}</td><td>${((r.marksObtained/exam.maxMarks)*100).toFixed(1)}%</td><td>${r.grade}</td></tr>`).join('')}</table></body></html>`);
      w.document.close(); w.print();
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Exams'},{label:'Tabulation',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Tabulation Sheet</h1><p className="text-gray-500 text-sm">View and print exam tabulation sheets</p></div></div>
      <div className="w-64"><select value={selectedExam} onChange={e=>setSelectedExam(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Exam</option>{exams.filter(e=>e.isPublished).map(e=><option key={e._id} value={e._id}>{e.name} - {e.subjectId?.name}</option>)}</select></div>
      {exam&&(<Card><div className="p-4 flex justify-between items-center"><h2 className="font-semibold">{exam.name} — {exam.subjectId?.name} ({exam.classId?.name} {exam.classId?.section})</h2><div className="flex gap-2"><Button variant="secondary" size="sm" onClick={handlePrint}><Printer className="w-4 h-4"/> Print</Button></div></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-left">Marks</th><th className="px-4 py-3 text-left">Max</th><th className="px-4 py-3 text-left">%</th><th className="px-4 py-3 text-left">Grade</th></tr></thead><tbody>{exam.results?.map((r,i)=>(<tr key={i} className="hover:bg-gray-50"><td className="px-4 py-3">{i+1}</td><td className="px-4 py-3">{r.studentId}</td><td className="px-4 py-3 font-medium">{r.marksObtained}</td><td className="px-4 py-3">{exam.maxMarks}</td><td className="px-4 py-3">{((r.marksObtained/exam.maxMarks)*100).toFixed(1)}%</td><td className="px-4 py-3"><Badge variant={r.marksObtained>=exam.passingMarks?'success':'danger'}>{r.grade}</Badge></td></tr>))}</tbody></table></div></Card>)}
    </div>
  );
}
