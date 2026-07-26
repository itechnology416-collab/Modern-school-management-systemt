import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, CreditCard, Trash2, IndianRupee, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/stock/products').then(r=>{setProducts(r.data);setLoading(false)}).catch(()=>setLoading(false)); }, []);

  const addToCart = (product) => {
    const existing = cart.find(i=>i.productId===product._id);
    if(existing) setCart(cart.map(i=>i.productId===product._id?{...i,quantity:i.quantity+1,total:i.price*(i.quantity+1)}:i));
    else setCart([...cart,{productId:product._id,productName:product.name,quantity:1,price:product.price,total:product.price}]);
  };

  const removeFromCart = (idx) => setCart(cart.filter((_,i)=>i!==idx));
  const updateQty = (idx, delta) => {
    const updated = [...cart];
    updated[idx].quantity = Math.max(1,updated[idx].quantity+delta);
    updated[idx].total = updated[idx].price*updated[idx].quantity;
    setCart(updated);
  };

  const total = cart.reduce((s,i)=>s+i.total,0);

  const handleCheckout = async () => {
    if(cart.length===0) return toast.error('Cart is empty');
    try { await api.post('/stock/sales',{items:cart,totalAmount:total,paymentMethod,customerName}); toast.success('Sale completed!'); setCart([]); setCustomerName(''); } catch { toast.error('Failed'); }
  };

  const filtered = products.filter(p=>p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{label:'Stock'},{label:'Point of Sale',active:true}]} />
      <div><h1 className="text-2xl font-bold">Point of Sale</h1><p className="text-gray-500 text-sm">Sell products and manage transactions</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Card><div className="p-4 border-b"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 max-h-[500px] overflow-y-auto">{filtered.map(p=>(<button key={p._id} onClick={()=>addToCart(p)} className="p-3 border rounded-xl text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.category}</p><p className="text-sm font-bold text-blue-600 mt-1">₹{p.price}</p><p className="text-[10px] text-gray-400">Stock: {p.quantity}</p></button>))}</div></Card></div>
        <Card><div className="p-4"><h2 className="font-semibold mb-3 flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Cart ({cart.length})</h2>
          {cart.length===0?<p className="text-gray-400 text-center py-8 text-sm">Cart is empty</p>:<div className="space-y-2 max-h-60 overflow-y-auto">{cart.map((item,idx)=>(<div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.productName}</p><p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p></div><div className="flex items-center gap-1"><button onClick={()=>updateQty(idx,-1)} className="p-1 rounded hover:bg-gray-200"><Minus className="w-3 h-3"/></button><span className="w-6 text-center text-sm">{item.quantity}</span><button onClick={()=>updateQty(idx,1)} className="p-1 rounded hover:bg-gray-200"><Plus className="w-3 h-3"/></button><button onClick={()=>removeFromCart(idx)} className="p-1 text-red-400 hover:bg-red-50 rounded ml-1"><Trash2 className="w-3 h-3"/></button></div></div>))}</div>
          <div className="border-t mt-4 pt-4"><p className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{total.toLocaleString()}</span></p><Input label="Customer Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Optional" className="mt-2"/><div className="mt-2"><label className="label">Payment</label><select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="cash">Cash</option><option value="card">Card</option><option value="online">Online</option></select></div><Button className="w-full mt-4" size="lg" onClick={handleCheckout} icon={CreditCard}>Complete Sale</Button></div>
        </div></Card>
      </div>
    </div>
  );
}
