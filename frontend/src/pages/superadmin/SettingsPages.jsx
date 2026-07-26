import { useState } from 'react';
import { Save, Bus, Globe, Shield, Settings, Fingerprint } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

// Transport Page
export function TransportSettings() {
  const [routes, setRoutes] = useState([{routeName:'Route A',vehicleNumber:'KA-01-1234',driverName:'John',driverPhone:'9876543210',fee:500}]);
  const [form, setForm] = useState({routeName:'',vehicleNumber:'',driverName:'',driverPhone:'',fee:0});
  const addRoute = () => { if(!form.routeName)return toast.error('Enter route name'); setRoutes([...routes,form]); setForm({routeName:'',vehicleNumber:'',driverName:'',driverPhone:'',fee:0}); toast.success('Route added'); };
  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Transport',active:true}]}/>
      <div><h1 className="text-2xl font-bold">Transport Management</h1><p className="text-gray-500 text-sm">Manage school bus routes and vehicles</p></div>
      <Card><div className="p-6 space-y-4"><h2 className="font-semibold">Add Route</h2><div className="grid grid-cols-2 gap-4"><Input label="Route Name" value={form.routeName} onChange={e=>setForm({...form,routeName:e.target.value})}/><Input label="Vehicle Number" value={form.vehicleNumber} onChange={e=>setForm({...form,vehicleNumber:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Input label="Driver Name" value={form.driverName} onChange={e=>setForm({...form,driverName:e.target.value})}/><Input label="Driver Phone" value={form.driverPhone} onChange={e=>setForm({...form,driverPhone:e.target.value})}/></div><Input label="Monthly Fee (₹)" type="number" value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})}/><Button icon={Bus} onClick={addRoute}>Add Route</Button></div></Card>
      {routes.length>0&&<Card><div className="p-6"><h2 className="font-semibold mb-3">Transport Routes</h2><div className="space-y-2">{routes.map((r,i)=>(<div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{r.routeName}</p><p className="text-xs text-gray-500">{r.vehicleNumber} | {r.driverName}</p></div><div className="text-right"><p className="font-bold">₹{r.fee}/mo</p><p className="text-xs text-gray-500">{r.driverPhone}</p></div></div>))}</div></div></Card>}
    </div>
  );
}

// Website Settings
export function WebsiteSettings() {
  const [settings, setSettings] = useState({siteName:'Demo School',tagline:'Excellence in Education',primaryColor:'#1a2744',showAdmissions:true,showGallery:true,showNotices:true});
  return (
    <div className="space-y-6 max-w-xl">
      <Breadcrumb items={[{label:'Website',active:true}]}/>
      <div><h1 className="text-2xl font-bold">Website Management</h1><p className="text-gray-500 text-sm">Configure school website settings</p></div>
      <Card><div className="p-6 space-y-4"><Input label="Site Name" value={settings.siteName} onChange={e=>setSettings({...settings,siteName:e.target.value})}/><Input label="Tagline" value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/><div><label className="label">Primary Color</label><input type="color" value={settings.primaryColor} onChange={e=>setSettings({...settings,primaryColor:e.target.value})} className="w-full h-10 rounded-lg border cursor-pointer"/></div><div className="space-y-2"><label className="flex items-center gap-2"><input type="checkbox" checked={settings.showAdmissions} onChange={e=>setSettings({...settings,showAdmissions:e.target.checked})}/><span className="text-sm">Show Admissions Open</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={settings.showGallery} onChange={e=>setSettings({...settings,showGallery:e.target.checked})}/><span className="text-sm">Show Gallery</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={settings.showNotices} onChange={e=>setSettings({...settings,showNotices:e.target.checked})}/><span className="text-sm">Show Notice Board</span></label></div><Button icon={Save} onClick={()=>toast.success('Settings saved!')}>Save Settings</Button></div></Card>
    </div>
  );
}

// Admin Roles
export function AdminRoles() {
  const [roles] = useState([{name:'Super Admin',permissions:'All'},{name:'Admin',permissions:'Manage Students, Teachers, Classes'},{name:'Accountant',permissions:'Fees, Expenses, Reports'},{name:'Receptionist',permissions:'Admissions, Inquiries, ID Cards'}]);
  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Admin Roles',active:true}]}/>
      <div><h1 className="text-2xl font-bold">Admin Role Management</h1><p className="text-gray-500 text-sm">Manage administrator roles and permissions</p></div>
      <Card><div className="divide-y">{roles.map((r,i)=>(<div key={i} className="p-4 flex justify-between items-center"><div><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.permissions}</p></div><Button size="sm" variant="ghost">Edit</Button></div>))}</div></Card>
    </div>
  );
}

// General Settings
export function GeneralSettings() {
  const [settings, setSettings] = useState({schoolName:'Demo School',academicYear:'2024-2025',language:'en',timezone:'UTC+5:30',currency:'INR',sessionStart:'April'});
  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'Settings',active:true}]}/>
      <div><h1 className="text-2xl font-bold">General Settings</h1><p className="text-gray-500 text-sm">Configure school-wide settings</p></div>
      <Card><div className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="School Name" value={settings.schoolName} onChange={e=>setSettings({...settings,schoolName:e.target.value})}/><Input label="Academic Year" value={settings.academicYear} onChange={e=>setSettings({...settings,academicYear:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Select label="Language" value={settings.language} onChange={e=>setSettings({...settings,language:e.target.value})} options={[{value:'en',label:'English'},{value:'hi',label:'Hindi'},{value:'ar',label:'Arabic'}]}/><Input label="Timezone" value={settings.timezone} onChange={e=>setSettings({...settings,timezone:e.target.value})}/></div><div className="grid grid-cols-2 gap-4"><Input label="Currency" value={settings.currency} onChange={e=>setSettings({...settings,currency:e.target.value})}/><Input label="Session Start" value={settings.sessionStart} onChange={e=>setSettings({...settings,sessionStart:e.target.value})}/></div><Button icon={Save} onClick={()=>toast.success('Settings saved!')}>Save Settings</Button></div></Card>
    </div>
  );
}
