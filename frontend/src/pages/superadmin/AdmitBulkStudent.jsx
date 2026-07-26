import { useState, useEffect } from 'react';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdmitBulkStudent() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => { api.get('/classes').then(r => setClasses(r.data)).catch(() => {}); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0]; if(!f) return; setFile(f); setResults(null);
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = ev.target.result.split('\n').filter(r=>r.trim());
      if(rows.length<2) return toast.error('Empty file');
      const headers = rows[0].split(',').map(h=>h.trim().toLowerCase());
      const parsed = rows.slice(1).map((row,i)=>{
        const c = row.split(',').map(x=>x.trim().replace(/^"|"$/g,''));
        return {_idx:i,name:c[headers.indexOf('name')]||'',email:c[headers.indexOf('email')]||'',phone:c[headers.indexOf('phone')]||'',rollNo:c[headers.indexOf('roll no')]||'',gender:c[headers.indexOf('gender')]||'male',valid:!!(c[headers.indexOf('name')]&&c[headers.indexOf('email')])};
      });
      setPreview(parsed);
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if(!classId) return toast.error('Select class'); setImporting(true);
    const res = {success:0,failed:0,errors:[]};
    for(const s of preview){
      if(!s.valid){res.failed++;res.errors.push(`${s.name}: Invalid`);continue}
      try{await api.post('/auth/create-user',{name:s.name,email:s.email,phone:s.phone,role:'student',classId,rollNo:s.rollNo,gender:s.gender});res.success++}
      catch(err){res.failed++;res.errors.push(`${s.name}: ${err.response?.data?.message||'Failed'}`)}
    }
    setResults(res); setImporting(false);
    if(res.success>0) toast.success(`${res.success} students imported!`);
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Phone,Roll No,Gender\nJohn Doe,john@example.com,9876543210,101,male\nJane Smith,jane@example.com,9876543211,102,female';
    const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='student_template.csv';a.click();
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Admission'},{label:'Bulk Admit',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Bulk Student Admission</h1><p className="text-gray-500 text-sm">Import multiple students via CSV</p></div><Button variant="secondary" onClick={downloadTemplate}><Download className="w-4 h-4" /> Template</Button></div>
      <Card>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">CSV: <strong>Name, Email, Phone, Roll No, Gender</strong></p>
          <div className="flex gap-4 items-end">
            <input type="file" accept=".csv" onChange={handleFile} className="text-sm flex-1" />
            <select value={classId} onChange={e=>setClassId(e.target.value)} className="w-48 px-3 py-2 border rounded-lg text-sm"><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name} {c.section}</option>)}</select>
          </div>
        </div>
      </Card>
      {preview.length>0&&(<Card><div className="p-6"><div className="flex justify-between mb-3"><h2 className="font-semibold">Preview ({preview.length})</h2><Badge variant={preview.filter(p=>p.valid).length===preview.length?'success':'warning'}>{preview.filter(p=>p.valid).length} valid</Badge></div><div className="max-h-60 overflow-y-auto text-sm"><table className="w-full"><thead><tr className="bg-gray-50"><th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-left">Status</th></tr></thead><tbody>{preview.map((r,i)=><tr key={i} className={r.valid?'':'bg-red-50'}><td className="px-3 py-2">{i+2}</td><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.email}</td><td className="px-3 py-2">{r.valid?<CheckCircle className="w-4 h-4 text-green-500"/>:<AlertCircle className="w-4 h-4 text-red-500"/>}</td></tr>)}</tbody></table></div><Button onClick={handleImport} loading={importing} disabled={!classId} className="mt-4"><Upload className="w-4 h-4"/> Import {preview.filter(p=>p.valid).length} Students</Button></div></Card>)}
      {results&&(<Card className={results.failed>0?'border-red-200':'border-green-200'}><div className="p-6"><div className="grid grid-cols-3 gap-4 mb-4"><div className="p-3 bg-green-50 rounded text-center"><p className="text-2xl font-bold text-green-700">{results.success}</p><p className="text-xs">Succeeded</p></div><div className="p-3 bg-red-50 rounded text-center"><p className="text-2xl font-bold text-red-700">{results.failed}</p><p className="text-xs">Failed</p></div><div className="p-3 bg-blue-50 rounded text-center"><p className="text-2xl font-bold text-blue-700">{preview.length}</p><p className="text-xs">Total</p></div></div>{results.errors.length>0&&<div className="max-h-40 overflow-y-auto">{results.errors.map((e,i)=><p key={i} className="text-xs text-red-600 py-1">{e}</p>)}</div>}</div></Card>)}
    </div>
  );
}
