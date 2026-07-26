import { useState, useContext } from 'react';
import { Save, UserCircle } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      const data = await authService.updateProfile({ name: form.name, phone: form.phone, ...(form.password && { password: form.password }) });
      updateUser({ name: form.name, phone: form.phone });
      toast.success('Profile updated');
    } catch (err) { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">My Profile</h1><p className="text-gray-500 text-sm mt-1">Manage your account information</p></div>
      <Card>
        <CardHeader><div className="flex items-center gap-3"><UserCircle className="w-5 h-5 text-primary-600" /><h2 className="font-semibold">Personal Information</h2></div></CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div><p className="font-medium">{user?.name}</p><p className="text-sm text-gray-500 capitalize">{user?.role}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4"><Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input label="Email" value={form.email} disabled /></div>
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid grid-cols-2 gap-4"><Input label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep" /><Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></div>
          <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> Save Changes</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
