import { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export default function PublicMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/chat/conversations').then(r=>{setMessages(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Public Messages',active:true}]} />
      <div><h1 className="text-2xl font-bold">Public Messages</h1><p className="text-gray-500 text-sm">View all communication across the school</p></div>
      <Card><div className="divide-y">
        {messages.length===0&&<div className="p-8 text-center text-gray-400"><MessageSquare className="w-10 h-10 mx-auto mb-2"/>No messages yet</div>}
        {messages.map(msg=>(<div key={msg.chatRoom} className="p-4 hover:bg-gray-50"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-blue-600"/></div><div className="flex-1"><p className="font-medium text-sm">{msg.otherUser?.name}</p><p className="text-xs text-gray-500">{msg.lastMessage?.content?.substring(0,100)}</p></div><span className="text-xs text-gray-400">{new Date(msg.lastMessage?.createdAt).toLocaleString()}</span></div></div>))}
      </div></Card>
    </div>
  );
}
