import { useState } from 'react';
import { Bot, Send, Sparkles, FileText, Bell, Calendar } from 'lucide-react';
import Card, { CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI Assistant. I can help you with:\n• Answering school-related questions\n• Generating quizzes and notices\n• Writing report card comments\n• Planning school events\n• And much more!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: input, context: messages.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch { toast.error('AI service unavailable'); } finally { setLoading(false); }
  };

  const quickActions = [
    { label: 'Generate Quiz', icon: Sparkles, action: () => { setInput('Generate a quiz about '); } },
    { label: 'Write Notice', icon: Bell, action: () => { setInput('Write a school notice about '); } },
    { label: 'Report Comment', icon: FileText, action: () => { setInput('Write a report card comment for '); } },
    { label: 'Plan Event', icon: Calendar, action: () => { setInput('Plan a school event for '); } },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center"><Bot className="w-6 h-6 text-indigo-600" /></div><div><h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1><p className="text-gray-500 text-sm">Your intelligent school management companion</p></div></div>

      <div className="flex gap-2 flex-wrap">
        {quickActions.map(action => (
          <button key={action.label} onClick={action.action} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors">
            <action.icon className="w-4 h-4" /> {action.label}
          </button>
        ))}
      </div>

      <Card><CardBody>
        <div className="h-96 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="flex gap-1 justify-start px-4 py-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" /></div>}
        </div>
        <div className="flex gap-2"><Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask anything..." /><Button onClick={handleSend} loading={loading}><Send className="w-4 h-4" /></Button></div>
      </CardBody></Card>
    </div>
  );
};

export default AIChatPage;
