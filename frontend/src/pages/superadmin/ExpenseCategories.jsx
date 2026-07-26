import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

const defaultCategories = ['Salary','Utilities','Maintenance','Supplies','Transport','Events','Miscellaneous'];

export default function ExpenseCategories() {
  const [categories, setCategories] = useState(defaultCategories);
  const [showModal, setShowModal] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  const addCategory = () => { if(!newCat.trim()) return; setCategories([...categories,newCat.trim()]); setNewCat(''); setShowModal(false); toast.success('Category added'); };
  const removeCategory = (idx) => { setCategories(categories.filter((_,i)=>i!==idx)); toast.success('Removed'); };
  const updateCategory = () => { const updated = [...categories]; updated[editing] = editVal; setCategories(updated); setEditing(null); toast.success('Updated'); };

  return (
    <div className="space-y-6 max-w-lg">
      <Breadcrumb items={[{label:'Expenses'},{label:'Categories',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Expense Categories</h1><p className="text-gray-500 text-sm">Manage expense categories</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Category</Button></div>
      <Card><div className="divide-y">
        {categories.map((cat,i)=>(<div key={i} className="flex items-center justify-between p-3">
          {editing===i?<div className="flex gap-2 flex-1"><input value={editVal} onChange={e=>setEditVal(e.target.value)} className="flex-1 px-3 py-1 border rounded text-sm"/><Button size="sm" onClick={updateCategory}>Save</Button></div>:<span className="text-sm font-medium">{cat}</span>}
          <div className="flex gap-1">{editing!==i&&<><Button size="sm" variant="ghost" onClick={()=>{setEditing(i);setEditVal(cat)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>removeCategory(i)}><Trash2 className="w-3 h-3"/></Button></>}</div>
        </div>))}
      </div></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Category" size="sm"><div className="space-y-4"><Input label="Category Name" value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="e.g. Office Supplies"/><Button onClick={addCategory} className="w-full">Add Category</Button></div></Modal>
    </div>
  );
}
