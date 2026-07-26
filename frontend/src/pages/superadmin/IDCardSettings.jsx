import { useState } from 'react';
import { Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input, { Select } from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

export default function IDCardSettings() {
  const [settings, setSettings] = useState({ schoolName:'DEMO SCHOOL', logoUrl:'', cardColor:'#1a2744', textColor:'#ffffff', showBarcode:true, showPhoto:false, cardSize:'standard', includeAddress:false });

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumb items={[{label:'ID Cards'},{label:'Settings',active:true}]} />
      <div><h1 className="text-2xl font-bold">ID Card Settings</h1><p className="text-gray-500 text-sm">Configure ID card layout and design</p></div>
      <Card><div className="p-6 space-y-4">
        <Input label="School Name on Card" value={settings.schoolName} onChange={e=>setSettings({...settings,schoolName:e.target.value})}/>
        <Input label="Logo URL" value={settings.logoUrl} onChange={e=>setSettings({...settings,logoUrl:e.target.value})} placeholder="https://..."/>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Card Color</label><input type="color" value={settings.cardColor} onChange={e=>setSettings({...settings,cardColor:e.target.value})} className="w-full h-10 rounded-lg border cursor-pointer"/></div>
          <div><label className="label">Text Color</label><input type="color" value={settings.textColor} onChange={e=>setSettings({...settings,textColor:e.target.value})} className="w-full h-10 rounded-lg border cursor-pointer"/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Card Size" value={settings.cardSize} onChange={e=>setSettings({...settings,cardSize:e.target.value})} options={[{value:'standard',label:'Standard (CR80)'},{value:'large',label:'Large'}]}/>
          <Select label="Include" value="" onChange={()=>{}} options={[{value:'',label:'Select options'}]}/>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.showBarcode} onChange={e=>setSettings({...settings,showBarcode:e.target.checked})}/><span className="text-sm">Show Barcode</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.showPhoto} onChange={e=>setSettings({...settings,showPhoto:e.target.checked})}/><span className="text-sm">Show Photo</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.includeAddress} onChange={e=>setSettings({...settings,includeAddress:e.target.checked})}/><span className="text-sm">Include Address</span></label>
        </div>
        <Button icon={Save} onClick={()=>toast.success('Settings saved!')}>Save Settings</Button>
      </div></Card>
    </div>
  );
}
