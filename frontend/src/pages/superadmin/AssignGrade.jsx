import { useState, useEffect } from 'react';
import { Award, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AssignGrade() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [gradeBoundaries, setGradeBoundaries] = useState({ 'A+':90, 'A':80, 'B':70, 'C':60, 'D':50, 'E':40, 'F':0 });

  useEffect(() => { api.get('/exams').then(r=>setExams(r.data)).catch(()=>{}); }, []);

  const handleApply = async () => {
    const exam = exams.find(e=>e._id===selectedExam);
    if(!exam?.results?.length) return toast.error('No results to grade');
    const updated = exam.results.map(r=>{
      const pct = (r.marksObtained/exam.maxMarks)*100;
      let grade = 'F'; const boundaries = Object.entries(gradeBoundaries).sort((a,b)=>b[1]-a[1]);
      for(const [g, threshold] of boundaries){ if(pct>=threshold){ grade=g; break; } }
      return {...r, grade};
    });
    try { await api.post(`/exams/${selectedExam}/results`, { results: updated }); toast.success('Grades applied!'); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Breadcrumb items={[{label:'Exams'},{label:'Assign Grade',active:true}]} />
      <div><h1 className="text-2xl font-bold">Assign Grade</h1><p className="text-gray-500 text-sm">Configure grade boundaries and apply to exams</p></div>
      <div className="w-64"><select value={selectedExam} onChange={e=>setSelectedExam(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Exam</option>{exams.filter(e=>e.results?.length>0).map(e=><option key={e._id} value={e._id}>{e.name}</option>)}</select></div>
      <Card><div className="p-6"><h2 className="font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-600"/>Grade Boundaries</h2><div className="space-y-3">{Object.entries(gradeBoundaries).map(([grade,min],i)=><div key={grade} className="flex items-center gap-3"><span className="w-12 font-bold text-lg">{grade}</span><span className="text-sm text-gray-500 w-40">≥ {min}%</span><input type="range" min="0" max="100" value={min} onChange={e=>{const b={...gradeBoundaries};b[grade]=Number(e.target.value);setGradeBoundaries(b)}} className="flex-1"/><span className="w-10 text-sm text-right">{min}%</span></div>)}</div><Button icon={Save} onClick={handleApply} className="w-full mt-4">Apply Grades</Button></div></Card>
    </div>
  );
}
