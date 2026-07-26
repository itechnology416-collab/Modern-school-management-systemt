import { useState } from 'react';
import { Monitor, Video, Plus, Link, Copy } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

export default function OnlineClasses() {
  const [classes, setClasses] = useState([
    {id:1,subject:'Mathematics',teacher:'Mr. Smith',class:'10 A',platform:'Zoom',link:'https://zoom.us/j/12345',date:'2024-07-15',time:'09:00',status:'upcoming'},
    {id:2,subject:'Physics',teacher:'Ms. Johnson',class:'10 A',platform:'Google Meet',link:'https://meet.google.com/abc-defg-hij',date:'2024-07-16',time:'10:00',status:'upcoming'},
    {id:3,subject:'English',teacher:'Mrs. Davis',class:'9 B',platform:'Jitsi',link:'https://meet.jit.si/school-english',date:'2024-07-15',time:'11:00',status:'live'},
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({subject:'',teacher:'',class:'',platform:'Zoom',link:'',date:'',time:'',status:'upcoming'});

  const addClass = () => {
    if(!form.subject||!form.link) return toast.error('Fill required fields');
    setClasses([{id:Date.now(),...form},...classes]); setShowModal(false);
    setForm({subject:'',teacher:'',class:'',platform:'Zoom',link:'',date:'',time:'',status:'upcoming'}); toast.success('Class added');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Online Classes',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Online Classes</h1><p className="text-gray-500 text-sm">Manage virtual classrooms via Zoom, Google Meet, Jitsi</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Create Class</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c=>(<Card key={c.id}><div className="p-5"><div className="flex justify-between items-start mb-3"><div><h3 className="font-semibold">{c.subject}</h3><p className="text-xs text-gray-500">{c.teacher} | {c.class}</p></div><Badge variant={c.status==='live'?'success':c.status==='upcoming'?'warning':'neutral'}>{c.status}</Badge></div><div className="flex items-center gap-2 text-xs text-gray-500 mb-3"><Monitor className="w-3 h-3"/><span>{c.platform}</span><span>•</span><span>{c.date} {c.time}</span></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>{navigator.clipboard.writeText(c.link);toast.success('Link copied!')}}><Copy className="w-3 h-3"/> Copy Link</Button><a href={c.link} target="_blank" rel="noreferrer"><Button size="sm" icon={Video}>Join</Button></a></div></div></Card>))}
      </div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Create Online Class"><form onSubmit={e=>{e.preventDefault();addClass()}} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required/><Input label="Teacher" value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})}/></div><Input label="Class" value={form.class} onChange={e=>setForm({...form,class:e.target.value})} placeholder="e.g. 10 A"/><Select label="Platform" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} options={[{value:'Zoom',label:'Zoom'},{value:'Google Meet',label:'Google Meet'},{value:'Jitsi',label:'Jitsi'},{value:'Microsoft Teams',label:'Teams'}]}/><Input label="Meeting Link" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} required placeholder="https://..."/><div className="grid grid-cols-2 gap-4"><Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><Input label="Time" type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div><Button type="submit" className="w-full">Create Class</Button></form></Modal>
    </div>
  );
}
