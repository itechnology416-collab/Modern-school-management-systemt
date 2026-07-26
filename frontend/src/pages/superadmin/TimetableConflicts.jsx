import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function TimetableConflicts() {
  const [conflicts, setConflicts] = useState([]); const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); try{const{data}=await api.get('/org/conflicts');setConflicts(data)}catch{}finally{setLoading(false)}; };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Timetable Conflicts',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-orange-500"/>Timetable Conflict Detection</h1><p className="text-gray-500 text-sm">Detect and resolve teacher scheduling conflicts</p></div><Button variant="secondary" onClick={load} icon={RefreshCw}>Refresh</Button></div>
      {conflicts.length===0&&!loading?<Card><div className="p-8 text-center text-green-600"><p className="text-xl font-semibold">No conflicts detected!</p><p className="text-sm text-gray-500">All timetables are properly scheduled.</p></div></Card>:<div className="space-y-3">{conflicts.map((c,i)=>(<Card key={i} className="border-orange-200"><div className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0"/><div><p className="font-medium">{c.teacher}</p><p className="text-sm text-gray-600">{c.day} at {c.time} — <Badge>{c.class1}</Badge> vs <Badge>{c.class2}</Badge></p></div></div></Card>))}</div>}
    </div>
  );
}
