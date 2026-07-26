import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, IndianRupee, ArrowDown, ArrowUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WalletManagement() {
  const [wallets, setWallets] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [form, setForm] = useState({ parentId:'', initialDeposit:0 });
  const [depositForm, setDepositForm] = useState({ amount:0, description:'', paymentMethod:'cash' });

  useEffect(() => {
    Promise.all([api.get('/features/wallets'), api.get('/users/parents')]).then(([w,p])=>{setWallets(w.data);setParents(p.data);setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await api.post('/features/wallets', form); toast.success('Wallet created'); setShowModal(false); const{data}=await api.get('/features/wallets');setWallets(data); } catch { toast.error('Failed'); }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try { await api.post(`/features/wallets/${selectedWallet._id}/deposit`, depositForm); toast.success('Deposit added'); setDepositModal(false); const{data}=await api.get('/features/wallets');setWallets(data); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key:'parent', label:'Parent', render:r=>r.parentId?.name||'-' },
    { key:'students', label:'Students', render:r=>r.studentIds?.length||0 },
    { key:'balance', label:'Balance', render:r=><span className="font-bold text-green-600">₹{r.balance?.toLocaleString()}</span> },
    { key:'transactions', label:'Transactions', render:r=>r.transactions?.length||0 },
    { key:'actions', label:'Actions', render:r=><div className="flex gap-1"><Button size="sm" variant="ghost" className="text-green-600" onClick={()=>{setSelectedWallet(r);setDepositForm({amount:0,description:'',paymentMethod:'cash'});setDepositModal(true)}}><ArrowDown className="w-3 h-3"/> Deposit</Button></div> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Wallet Management',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><WalletIcon className="w-6 h-6"/>Parent Wallet / Family Credit</h1><p className="text-gray-500 text-sm">Manage prepaid wallets and family credit accounts</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Create Wallet</Button></div>
      <div className="grid grid-cols-3 gap-4"><div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-700">₹{wallets.reduce((s,w)=>s+w.balance,0).toLocaleString()}</p><p className="text-xs">Total Balance</p></div><div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-700">{wallets.length}</p><p className="text-xs">Active Wallets</p></div><div className="bg-purple-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-700">{wallets.reduce((s,w)=>s+(w.studentIds?.length||0),0)}</p><p className="text-xs">Linked Students</p></div></div>
      <Card><Table columns={columns} data={wallets} loading={loading} emptyMessage="No wallets yet"/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Create Wallet"><form onSubmit={handleCreate} className="space-y-4"><Select label="Parent" value={form.parentId} onChange={e=>setForm({...form,parentId:e.target.value})} options={parents.map(p=>({value:p.userId?._id,label:p.userId?.name}))} required/><Input label="Initial Deposit (₹)" type="number" value={form.initialDeposit} onChange={e=>setForm({...form,initialDeposit:e.target.value})}/><Button type="submit" className="w-full">Create Wallet</Button></form></Modal>
      <Modal isOpen={depositModal} onClose={()=>setDepositModal(false)} title={`Deposit to ${selectedWallet?.parentId?.name}`}><form onSubmit={handleDeposit} className="space-y-4"><Input label="Amount (₹)" type="number" value={depositForm.amount} onChange={e=>setDepositForm({...depositForm,amount:e.target.value})} required/><Input label="Description" value={depositForm.description} onChange={e=>setDepositForm({...depositForm,description:e.target.value})}/><Select label="Payment Method" value={depositForm.paymentMethod} onChange={e=>setDepositForm({...depositForm,paymentMethod:e.target.value})} options={[{value:'cash',label:'Cash'},{value:'card',label:'Card'},{value:'online',label:'Online'},{value:'cheque',label:'Cheque'}]}/><Button type="submit" className="w-full">Deposit</Button></form></Modal>
    </div>
  );
}
