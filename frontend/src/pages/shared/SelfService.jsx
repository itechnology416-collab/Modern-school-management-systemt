import { useState, useEffect } from 'react';
import { UserCog, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SelfServicePortal() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'' });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) { setForm({ name:user.name||'', email:user.email||'', phone:user.phone||'', address:user.address||'' }); }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try { const { data } = await api.get('/auth/me'); setProfile(data); } catch {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try { await api.put('/auth/profile', form); toast.success('Profile updated!'); loadUser(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumb items={[{label:'Profile & Settings',active:true}]}/>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><UserCog className="w-6 h-6"/>Self-Service Portal</h1><p className="text-gray-500 text-sm">Update your personal profile, password, and preferences</p></div>
      <Card><form onSubmit={handleUpdate} className="p-6 space-y-4"><h2 className="font-semibold">Personal Information</h2><div className="grid grid-cols-2 gap-4"><Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Input label="Email" value={form.email} disabled/></div><Input label="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Input label="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><Button type="submit" className="w-full"><Save className="w-4 h-4"/> Save Changes</Button></form></Card>
      {(user?.role==='student'||user?.role==='parent') && <Card><div className="p-6"><h2 className="font-semibold mb-4">Account Details</h2><div className="space-y-2 text-sm"><div className="flex justify-between py-2 border-b"><span>Role</span><span className="font-medium capitalize">{user.role}</span></div><div className="flex justify-between py-2 border-b"><span>School</span><span className="font-medium">{profile?.schoolId?.name||'N/A'}</span></div>{user.role==='student'&&<><div className="flex justify-between py-2 border-b"><span>Class</span><span className="font-medium">{profile?.classId?`${profile.classId.name} ${profile.classId.section}`:'N/A'}</span></div><div className="flex justify-between py-2 border-b"><span>Roll No</span><span className="font-medium">{profile?.rollNo||'N/A'}</span></div></>}{user.role==='parent'&&<div className="flex justify-between py-2 border-b"><span>Children</span><span className="font-medium">{profile?.children?.length||0}</span></div>}</div></div></Card>}
    </div>
  );
}
