import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import Card, { CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { api.get('/chat').then(({ data }) => setConversations(data)).catch(() => {}); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectChat = async (conv) => {
    setActiveChat(conv);
    try { const { data } = await api.get(`/chat/${conv.otherUser._id}`); setMessages(data); } catch {}
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    try {
      const { data } = await api.post('/chat', { receiverId: activeChat.otherUser._id, content: input });
      setMessages(prev => [...prev, data]);
      setInput('');
    } catch { toast.error('Failed to send'); }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation list */}
      <div className="w-80 bg-white rounded-xl border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100"><h2 className="font-semibold">Messages</h2></div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button key={conv.chatRoom} onClick={() => selectChat(conv)} className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeChat?.chatRoom === conv.chatRoom ? 'bg-primary-50' : ''}`}>
              <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">{conv.otherUser?.name?.charAt(0)}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium">{conv.otherUser?.name}</p><p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p></div>{conv.unreadCount > 0 && <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">{activeChat.otherUser?.name?.charAt(0)}</div><div><p className="font-medium text-sm">{activeChat.otherUser?.name}</p><p className="text-xs text-gray-500 capitalize">{activeChat.otherUser?.role}</p></div></div></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.senderId === user._id || msg.senderId?._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-xl ${msg.senderId === user._id || msg.senderId?._id === user._id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}><p className="text-sm">{msg.content}</p><p className="text-[10px] opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p></div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2"><Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." /><Button onClick={sendMessage}><Send className="w-4 h-4" /></Button></div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center"><div className="text-center"><MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">Select a conversation to start chatting</p></div></div>
        )}
      </div>
    </div>
  );
};

export default Chat;
