import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Upload } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductsStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', sku:'', category:'stationery', quantity:0, price:0, costPrice:0, minStockLevel:5, description:'' });

  useEffect(() => { loadProducts(); }, []);
  const loadProducts = async () => { try{const{data}=await api.get('/stock/products');setProducts(data)}catch{}finally{setLoading(false)} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editing){ await api.put(`/stock/products/${editing._id}`, form); toast.success('Updated'); }
      else { await api.post('/stock/products', form); toast.success('Product added'); }
      setShowModal(false); resetForm(); loadProducts();
    } catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ name:'', sku:'', category:'stationery', quantity:0, price:0, costPrice:0, minStockLevel:5, description:'' }); setEditing(null); };

  const columns = [
    { key:'sku', label:'SKU', render:r=><span className="font-mono text-xs">{r.sku||'-'}</span> },
    { key:'name', label:'Product', render:r=><span className="font-medium">{r.name}</span> },
    { key:'category', label:'Category', render:r=><Badge>{r.category}</Badge> },
    { key:'quantity', label:'Stock', render:r=><span className={r.quantity<=r.minStockLevel?'text-red-600 font-bold':'text-green-600'}>{r.quantity}</span> },
    { key:'price', label:'Price', render:r=>`₹${r.price}` },
    { key:'actions', label:'Actions', render:r=>(<div className="flex gap-1"><Button size="sm" variant="ghost" onClick={()=>{setEditing(r);setForm({name:r.name,sku:r.sku,category:r.category,quantity:r.quantity,price:r.price,costPrice:r.costPrice,minStockLevel:r.minStockLevel,description:r.description});setShowModal(true)}}><Edit className="w-3 h-3"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={async()=>{if(confirm('Delete?')){await api.delete(`/stock/products/${r._id}`);loadProducts()}}}><Trash2 className="w-3 h-3"/></Button></div>) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Stock'},{label:'Products',active:true}]} />
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Products & Stock</h1><p className="text-gray-500 text-sm">Manage inventory and stock levels</p></div><Button icon={Plus} onClick={()=>{resetForm();setShowModal(true)}}>Add Product</Button></div>
      <div className="grid grid-cols-3 gap-4"><div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-700">{products.length}</p><p className="text-xs">Total Products</p></div><div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-700">{products.reduce((s,p)=>s+p.quantity,0)}</p><p className="text-xs">Total Stock</p></div><div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-red-700">{products.filter(p=>p.quantity<=p.minStockLevel).length}</p><p className="text-xs">Low Stock</p></div></div>
      <Card><Table columns={columns} data={products} loading={loading}/></Card>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Product':'Add Product'}><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Input label="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value.toUpperCase()})}/></div><Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={[{value:'stationery',label:'Stationery'},{value:'uniform',label:'Uniform'},{value:'books',label:'Books'},{value:'electronics',label:'Electronics'},{value:'sports',label:'Sports'},{value:'other',label:'Other'}]}/><div className="grid grid-cols-3 gap-4"><Input label="Quantity" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/><Input label="Price (₹)" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><Input label="Cost Price" type="number" value={form.costPrice} onChange={e=>setForm({...form,costPrice:e.target.value})}/></div><Input label="Min Stock Level" type="number" value={form.minStockLevel} onChange={e=>setForm({...form,minStockLevel:e.target.value})}/><div className="flex gap-3"><Button type="submit">{editing?'Update':'Add'} Product</Button><Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button></div></form></Modal>
    </div>
  );
}
