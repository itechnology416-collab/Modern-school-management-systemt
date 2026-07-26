import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, CalendarDays } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EventCalendar() {
  const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', eventType:'other', startDate:'', endDate:'', audience:'all', allDay:false });

  useEffect(() => { api.get('/campus/events').then(r=>{setEvents(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/campus/events', form); toast.success('Event added'); setShowModal(false); const{data}=await api.get('/campus/events');setEvents(data); } catch { toast.error('Failed'); }
  };

  const typeColors = { academic:'info', sports:'success', cultural:'warning', holiday:'danger', exam:'', meeting:'', other:'neutral' };
  const columns = [
    { key:'startDate', label:'Date', render:r=>new Date(r.startDate).toLocaleDateString() },
    { key:'title', label:'Event', render:r=><span className="font-medium">{r.title}</span> },
    { key:'eventType', label:'Type', render:r=><Badge variant={typeColors[r.eventType]}>{r.eventType}</Badge> },
    { key:'audience', label:'For', render:r=><span className="capitalize text-sm">{r.audience}</span> },
    { key:'actions', label:'Actions', render:r=><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{await api.delete(`/campus/events/${r._id}`);const{data}=await api.get('/campus/events');setEvents(data)}}><Trash2 className="w-3 h-3"/></Button> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Event Calendar',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="w-6 h-6"/>Event Calendar</h1><p className="text-gray-500 text-sm">Manage school events, holidays, and activities</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Event</Button></div>
      <Card><Table columns={columns} data={events} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Event"><form onSubmit={handleSubmit} className="space-y-4"><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><div><label className="label">Description</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Select label="Type" value={form.eventType} onChange={e=>setForm({...form,eventType:e.target.value})} options={[{value:'academic',label:'Academic'},{value:'sports',label:'Sports'},{value:'cultural',label:'Cultural'},{value:'holiday',label:'Holiday'},{value:'exam',label:'Exam'},{value:'meeting',label:'Meeting'},{value:'other',label:'Other'}]}/><Select label="Audience" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} options={[{value:'all',label:'Everyone'},{value:'students',label:'Students'},{value:'staff',label:'Staff'},{value:'parents',label:'Parents'}]}/></div><div className="grid grid-cols-2 gap-4"><Input label="Start Date" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} required/><Input label="End Date" type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></div><label className="flex items-center gap-2"><input type="checkbox" checked={form.allDay} onChange={e=>setForm({...form,allDay:e.target.checked})}/><span className="text-sm">All Day</span></label><Button type="submit" className="w-full">Add Event</Button></form></Modal>
    </div>
  );
}
