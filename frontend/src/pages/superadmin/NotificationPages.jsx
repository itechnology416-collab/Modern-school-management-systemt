import { useState, useEffect } from 'react';
import { BellRing, Send, Smartphone } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Shared component for app/whatsapp/telegram notifications
export function NotificationSender({ title, icon, type, channel }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ audience:'parents', title:'', message:'' });

  const sendNotification = async () => {
    if(!form.title||!form.message) return toast.error('Fill all fields');
    try {
      let users = [];
      if(form.audience==='parents'){const{data}=await api.get('/users/parents');users=data.map(p=>p.userId)}
      else if(form.audience==='students'){const{data}=await api.get('/users/students');users=data.map(s=>s.userId)}
      else if(form.audience==='staff'){const{data}=await api.get('/users/teachers');users=data.map(t=>t.userId)}

      for(const u of users.filter(Boolean)){
        await api.post('/notifications',{userId:u._id||u,title:`[${channel}] ${form.title}`,message:form.message,type:'system'}).catch(()=>{});
      }
      toast.success(`${channel} notification sent to ${users.length} recipients`);
      setShowModal(false);
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <Card><div className="p-6 text-center"><div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3"><Smartphone className="w-7 h-7 text-blue-600"/></div><h2 className="text-lg font-bold">{title}</h2><p className="text-sm text-gray-500 mt-1">Send {channel} notifications to users</p><Button className="mt-4" icon={Send} onClick={()=>setShowModal(true)}>Send {channel} Notification</Button></div></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={`Send ${channel} Notification`}><div className="space-y-4"><Select label="Audience" value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} options={[{value:'parents',label:'Parents'},{value:'students',label:'Students'},{value:'staff',label:'Staff'}]}/><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><div><label className="label">Message</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></div><Button onClick={sendNotification} className="w-full" icon={Send}>Send Notification</Button></div></Modal>
    </>
  );
}

// Individual pages that use the shared component
export function AppNotifications() {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/extended/notification-history').then(r=>{setHistory(r.data.filter(h=>h.channel==='app'));setLoading(false)}).catch(()=>setLoading(false)); }, []);
  return (
    <div className="space-y-6"><Breadcrumb items={[{label:'Notifications'},{label:'App Notifications',active:true}]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><NotificationSender title="App Notifications" channel="App" type="app"/>
        <Card><div className="p-6"><h2 className="font-semibold mb-3">Recent App Notifications</h2>
          {loading?<p className="text-center py-4 text-gray-400">Loading...</p>:history.length===0?<p className="text-center py-4 text-gray-400">No app notifications sent yet</p>:
          <div className="space-y-2 max-h-80 overflow-y-auto">{history.map(h=>(<div key={h._id} className="p-3 bg-gray-50 rounded-lg"><p className="text-sm font-medium">{h.title}</p><p className="text-xs text-gray-500">{h.message?.substring(0,80)}</p><p className="text-xs text-gray-400 mt-1">{new Date(h.createdAt).toLocaleString()} — {h.recipientCount||0} recipients</p></div>))}</div>}
        </div></Card></div></div>);
}
export function WhatsAppNotifications() {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/extended/notification-history').then(r=>{setHistory(r.data.filter(h=>h.channel==='whatsapp'));setLoading(false)}).catch(()=>setLoading(false)); }, []);
  return (
    <div className="space-y-6"><Breadcrumb items={[{label:'Notifications'},{label:'WhatsApp',active:true}]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><NotificationSender title="WhatsApp Notifications" channel="WhatsApp" type="whatsapp"/>
        <Card><div className="p-6"><h2 className="font-semibold mb-3">Message History</h2>
          {loading?<p className="text-center py-4 text-gray-400">Loading...</p>:history.length===0?<p className="text-center py-4 text-gray-400">No WhatsApp messages sent yet</p>:
          <div className="space-y-2 max-h-80 overflow-y-auto">{history.map(h=>(<div key={h._id} className="p-3 bg-gray-50 rounded-lg"><p className="text-sm font-medium">{h.title}</p><p className="text-xs text-gray-500">{h.message?.substring(0,80)}</p><p className="text-xs text-gray-400 mt-1">{new Date(h.createdAt).toLocaleString()} — {h.recipientCount||0} recipients</p></div>))}</div>}
        </div></Card></div></div>);
}
export function TelegramNotifications() {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/extended/notification-history').then(r=>{setHistory(r.data.filter(h=>h.channel==='telegram'));setLoading(false)}).catch(()=>setLoading(false)); }, []);
  return (
    <div className="space-y-6"><Breadcrumb items={[{label:'Notifications'},{label:'Telegram',active:true}]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><NotificationSender title="Telegram Notifications" channel="Telegram" type="telegram"/>
        <Card><div className="p-6"><h2 className="font-semibold mb-3">Message History</h2>
          {loading?<p className="text-center py-4 text-gray-400">Loading...</p>:history.length===0?<p className="text-center py-4 text-gray-400">No Telegram messages sent yet</p>:
          <div className="space-y-2 max-h-80 overflow-y-auto">{history.map(h=>(<div key={h._id} className="p-3 bg-gray-50 rounded-lg"><p className="text-sm font-medium">{h.title}</p><p className="text-xs text-gray-500">{h.message?.substring(0,80)}</p><p className="text-xs text-gray-400 mt-1">{new Date(h.createdAt).toLocaleString()} — {h.recipientCount||0} recipients</p></div>))}</div>}
        </div></Card></div></div>);
}
export function EmailAlerts() {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/extended/notification-history').then(r=>{setHistory(r.data.filter(h=>h.channel==='email'));setLoading(false)}).catch(()=>setLoading(false)); }, []);
  return (
    <div className="space-y-6"><Breadcrumb items={[{label:'Notifications'},{label:'Email Alerts',active:true}]}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><NotificationSender title="Email Alerts" channel="Email" type="email"/>
        <Card><div className="p-6"><h2 className="font-semibold mb-3">Email History</h2>
          {loading?<p className="text-center py-4 text-gray-400">Loading...</p>:history.length===0?<p className="text-center py-4 text-gray-400">No emails sent yet</p>:
          <div className="space-y-2 max-h-80 overflow-y-auto">{history.map(h=>(<div key={h._id} className="p-3 bg-gray-50 rounded-lg"><p className="text-sm font-medium">{h.title}</p><p className="text-xs text-gray-500">{h.message?.substring(0,80)}</p><p className="text-xs text-gray-400 mt-1">{new Date(h.createdAt).toLocaleString()} — {h.recipientCount||0} recipients</p></div>))}</div>}
        </div></Card></div></div>);
}
