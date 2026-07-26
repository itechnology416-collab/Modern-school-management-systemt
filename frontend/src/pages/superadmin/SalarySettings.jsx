import { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

export default function SalarySettings() {
  const [settings, setSettings] = useState({ autoGenerate:true, generateDay:'25', defaultAllowance:0, pfRate:12, taxRate:0, currency:'INR', overtimeRate:100 });

  return (
    <div className="space-y-6 max-w-xl">
      <Breadcrumb items={[{label:'Salary'},{label:'Settings',active:true}]} />
      <div><h1 className="text-2xl font-bold">Salary Settings</h1><p className="text-gray-500 text-sm">Configure salary generation rules</p></div>
      <Card><div className="p-6 space-y-4">
        <label className="flex items-center gap-2"><input type="checkbox" checked={settings.autoGenerate} onChange={e=>setSettings({...settings,autoGenerate:e.target.checked})}/><span className="text-sm font-medium">Auto-generate salaries monthly</span></label>
        <Input label="Generate on Day" type="number" value={settings.generateDay} onChange={e=>setSettings({...settings,generateDay:e.target.value})}/>
        <div className="grid grid-cols-2 gap-4"><Input label="Default Allowance" type="number" value={settings.defaultAllowance} onChange={e=>setSettings({...settings,defaultAllowance:e.target.value})}/><Input label="PF Rate (%)" type="number" value={settings.pfRate} onChange={e=>setSettings({...settings,pfRate:e.target.value})}/></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Tax Rate (%)" type="number" value={settings.taxRate} onChange={e=>setSettings({...settings,taxRate:e.target.value})}/><Input label="Overtime Rate (₹/hr)" type="number" value={settings.overtimeRate} onChange={e=>setSettings({...settings,overtimeRate:e.target.value})}/></div>
        <Select label="Currency" value={settings.currency} onChange={e=>setSettings({...settings,currency:e.target.value})} options={[{value:'INR',label:'INR (₹)'},{value:'USD',label:'USD ($)'},{value:'GBP',label:'GBP (£)'}]}/>
        <Button icon={Save} onClick={()=>toast.success('Settings saved!')}>Save Settings</Button>
      </div></Card>
    </div>
  );
}
