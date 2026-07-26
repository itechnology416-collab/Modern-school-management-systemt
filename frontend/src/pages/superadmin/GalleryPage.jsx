import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Upload } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [images, setImages] = useState([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', imageUrl:'', category:'campus', description:'' });

  useEffect(() => { api.get('/campus/gallery').then(r=>{setImages(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/campus/gallery', form); toast.success('Image added'); setShowModal(false); const{data}=await api.get('/campus/gallery');setImages(data); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Website Gallery',active:true}]}/>
      <div className="flex justify-between"><div><h1 className="text-2xl font-bold flex items-center gap-2"><Image className="w-6 h-6"/>Website Gallery</h1><p className="text-gray-500 text-sm">Manage images for the school website gallery</p></div><Button icon={Plus} onClick={()=>setShowModal(true)}>Add Image</Button></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length===0&&!loading&&<p className="col-span-full text-center py-12 text-gray-400">No images in gallery</p>}
        {images.map(img=>(<Card key={img._id}><div className="relative group"><img src={img.imageUrl} alt={img.title} className="w-full h-48 object-cover rounded-t-xl" onError={e=>{e.target.src='https://via.placeholder.com/400x300?text=No+Image'}}/><button onClick={async()=>{await api.delete(`/campus/gallery/${img._id}`);setImages(images.filter(x=>x._id!==img._id));toast.success('Deleted')}} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button></div><div className="p-3"><p className="font-medium text-sm">{img.title}</p><Badge>{img.category}</Badge></div></Card>))}
      </div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="Add Gallery Image"><form onSubmit={handleSubmit} className="space-y-4"><Input label="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><Input label="Image URL" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} required placeholder="https://..."/><Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={[{value:'campus',label:'Campus'},{value:'events',label:'Events'},{value:'sports',label:'Sports'},{value:'classroom',label:'Classroom'},{value:'ceremony',label:'Ceremony'},{value:'other',label:'Other'}]}/><Input label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><Button type="submit" className="w-full">Add Image</Button></form></Modal>
    </div>
  );
}
