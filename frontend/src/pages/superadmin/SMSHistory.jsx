import { useState, useEffect } from 'react';
import { Send, Smartphone, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function SMSHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/extended/notification-history').then(r=>{setHistory(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const columns = [
    { key:'channel', label:'Channel', render:r=><Badge variant={r.channel==='sms'?'primary':r.channel==='whatsapp'?'success':r.channel==='email'?'info':'warning'}>{r.channel}</Badge> },
    { key:'title', label:'Title', render:r=><span className="font-medium">{r.title}</span> },
    { key:'message', label:'Message', render:r=><span className="text-sm text-gray-600">{r.message?.substring(0,60)}{r.message?.length>60?'...':''}</span> },
    { key:'recipientCount', label:'Recipients', render:r=>r.recipientCount||0 },
    { key:'status', label:'Status', render:r=><Badge variant={r.status==='sent'?'success':r.status==='failed'?'danger':'warning'}>{r.status}</Badge> },
    { key:'createdAt', label:'Sent At', render:r=>new Date(r.createdAt).toLocaleString() },
    { key:'sender', label:'Sender', render:r=>r.sentBy?.name||'-' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'SMS & Notifications'},{label:'History',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Smartphone className="w-6 h-6"/>SMS / Notification History</h1><p className="text-gray-500 text-sm">View all sent SMS, WhatsApp, and email notifications</p></div>
      <Card><Table columns={columns} data={history} loading={loading} emptyMessage="No notifications sent yet"/></Card>
    </div>
  );
}
