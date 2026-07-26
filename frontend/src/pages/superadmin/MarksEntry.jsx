import { useState, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MarksEntry() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState({});
  const [remarks, setRemarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => { api.get('/exams').then(r=>{setExams(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const openEntry = (exam) => {
    setSelectedExam(exam);
    const entry = {}; const rem = {};
    exam.results?.forEach(r=>{entry[r.studentId]=r.marksObtained||'';rem[r.studentId]=r.remarks||''});
    setResults(entry); setRemarks(rem);
    setShowModal(true);
  };

  const handlePublish = async () => {
    setPublishing(true);
    const entries = Object.entries(results).filter(([_,m])=>m!=='').map(([studentId,marksObtained])=>{
      const pct = (Number(marksObtained)/selectedExam.maxMarks)*100;
      let grade = 'F'; if(pct>=90)grade='A+';else if(pct>=80)grade='A';else if(pct>=70)grade='B';else if(pct>=60)grade='C';else if(pct>=50)grade='D';else if(pct>=selectedExam.passingMarks/selectedExam.maxMarks*100)grade='E';
      return {studentId,marksObtained:Number(marksObtained),grade,remarks:remarks[studentId]||''};
    });
    try{await api.post(`/exams/${selectedExam._id}/results`,{results:entries});toast.success('Results published!');setShowModal(false);const{data}=await api.get('/exams');setExams(data)}catch{toast.error('Failed')}finally{setPublishing(false)};
  };

  const columns = [
    { key:'name', label:'Exam', render:r=>r.name },
    { key:'examType', label:'Type', render:r=><Badge>{r.examType}</Badge> },
    { key:'subject', label:'Subject', render:r=>r.subjectId?.name },
    { key:'date', label:'Date', render:r=>new Date(r.date).toLocaleDateString() },
    { key:'status', label:'Status', render:r=><Badge variant={r.isPublished?'success':'warning'}>{r.isPublished?'Published':'Draft'}</Badge> },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant={r.isPublished?'ghost':'primary'} onClick={()=>openEntry(r)}>{r.isPublished?'View':'Enter Marks'}</Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Exams'},{label:'Marks Entry',active:true}]} />
      <div><h1 className="text-2xl font-bold">Marks Entry</h1><p className="text-gray-500 text-sm">Enter and publish exam marks</p></div>
      <Card><Table columns={columns} data={exams} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={`Marks: ${selectedExam?.name}`} size="lg"><div className="space-y-4"><p className="text-sm text-gray-600">Max: {selectedExam?.maxMarks} | Pass: {selectedExam?.passingMarks}</p><div className="max-h-96 overflow-y-auto space-y-2">{selectedExam?.results?.map?.(r=>(<div key={r._id||r.studentId} className="p-3 bg-gray-50 rounded-lg space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">{r.studentId}</span><Input type="number" value={results[r.studentId]??''} onChange={e=>setResults({...results,[r.studentId]:e.target.value})} className="w-24" placeholder="Marks"/></div><Input value={remarks[r.studentId]||''} onChange={e=>setRemarks({...remarks,[r.studentId]:e.target.value})} className="w-full text-sm" placeholder="Teacher remarks (optional)"/></div>))||<p className="text-gray-400 text-center py-4">No students found. Ensure the exam has a class assigned.</p>}</div><Button onClick={handlePublish} loading={publishing} className="w-full"><Upload className="w-4 h-4"/> Publish Results</Button></div></Modal>
    </div>
  );
}
