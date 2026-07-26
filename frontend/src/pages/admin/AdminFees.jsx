import { useState, useEffect } from 'react';
import { Plus, Download, Search, IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Select } from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = { paid: 'success', pending: 'warning', partial: 'info', overdue: 'danger' };

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [filter, setFilter] = useState({ status: '', classId: '' });
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [collectModal, setCollectModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', paymentMethod: 'cash', transactionId: '', remark: '' });
  const [bulkForm, setBulkForm] = useState({ classId: '', feeType: 'tuition', feeName: '', totalAmount: '', dueDate: '', academicYear: '', term: '' });

  useEffect(() => {
    api.get('/classes').then(({ data }) => setClasses(data)).catch(() => {});
    fetchFees();
  }, [filter]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.classId) params.classId = filter.classId;
      const { data } = await api.get('/fees', { params });
      setFees(data);
    } catch { toast.error('Failed to load fees'); } finally { setLoading(false); setPage(1); }
  };

  const handleCollect = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/fees/${selectedFee._id}/collect`, { amount: Number(paymentForm.amount), paymentMethod: paymentForm.paymentMethod, transactionId: paymentForm.transactionId, remark: paymentForm.remark });
      toast.success('Payment recorded');
      setCollectModal(false);
      fetchFees();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees/bulk', { ...bulkForm, totalAmount: Number(bulkForm.totalAmount) });
      toast.success('Fee created');
      setModalOpen(false);
      fetchFees();
    } catch (err) { toast.error('Failed to create fee'); }
  };

  const handleConcession = async (e) => {
    e.preventDefault();
    try {
      const concession = Number(concessionForm.amount);
      await api.put(`/fees/${selectedFee._id}`, {
        concessionAmount: concession,
        totalAmount: selectedFee.totalAmount - concession,
      });
      toast.success('Concession applied');
      setConcessionModal(false);
      fetchFees();
    } catch (err) { toast.error('Failed to apply concession'); }
  };

  const summary = {
    total: fees.reduce((s, f) => s + f.totalAmount, 0),
    collected: fees.reduce((s, f) => s + f.paidAmount, 0),
    pending: fees.reduce((s, f) => s + (f.totalAmount - f.paidAmount), 0),
    paidCount: fees.filter(f => f.status === 'paid').length,
  };

  const paginated = fees.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'student', label: 'Student', render: (r) => r.studentId?.userId?.name || 'N/A' },
    { key: 'feeName', label: 'Fee' },
    { key: 'feeType', label: 'Type', render: (r) => <span className="capitalize">{r.feeType}</span> },
    { key: 'amount', label: 'Amount', render: (r) => <span>₹{r.paidAmount} / ₹{r.totalAmount}</span> },
    { key: 'dueDate', label: 'Due Date', render: (r) => new Date(r.dueDate).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusColors[r.status]}>{r.status}</Badge> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-1">
        {r.status !== 'paid' && <Button size="sm" variant="ghost" onClick={() => { setSelectedFee(r); setPaymentForm({ amount: r.totalAmount - r.paidAmount, paymentMethod: 'cash', transactionId: '', remark: '' }); setCollectModal(true); }}>Collect</Button>}
        {r.status !== 'paid' && <Button size="sm" variant="ghost" className="text-orange-600" onClick={() => { setSelectedFee(r); setConcessionForm({ amount: '', remark: '' }); setConcessionModal(true); }}>Concession</Button>}
      </div>
    )},
  ];

  // Concession state
  const [concessionModal, setConcessionModal] = useState(false);
  const [concessionForm, setConcessionForm] = useState({ amount: '', remark: '' });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fees', active: true }]} />
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Fee Management</h1><p className="text-gray-500 text-sm mt-1">Manage all fee records and collections</p></div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Create Fee</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Fees', value: `₹${summary.total.toLocaleString()}`, icon: IndianRupee, color: 'bg-blue-50 text-blue-700' },
          { label: 'Collected', value: `₹${summary.collected.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
          { label: 'Pending', value: `₹${summary.pending.toLocaleString()}`, icon: AlertCircle, color: 'bg-red-50 text-red-700' },
          { label: 'Paid Count', value: `${summary.paidCount}/${fees.length}`, color: 'bg-purple-50 text-purple-700' },
        ].map(s => <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}><p className="text-xs font-medium opacity-70">{s.label}</p><p className="text-xl font-bold mt-1">{s.value}</p></div>)}
      </div>

      <div className="flex gap-4">
        <Select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} options={[{ value: '', label: 'All Status' }, { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }, { value: 'partial', label: 'Partial' }]} className="w-40" />
        <Select value={filter.classId} onChange={(e) => setFilter({ ...filter, classId: e.target.value })} options={[{ value: '', label: 'All Classes' }, ...classes.map(c => ({ value: c._id, label: `${c.name} ${c.section}` }))]} className="w-40" />
      </div>

      <Card><CardBody><Table columns={columns} data={paginated} loading={loading} emptyMessage="No fee records" /><Pagination currentPage={page} totalPages={Math.ceil(fees.length / pageSize)} totalItems={fees.length} pageSize={pageSize} onPageChange={setPage} /></CardBody></Card>

      {/* Collect Payment Modal */}
      <Modal isOpen={collectModal} onClose={() => setCollectModal(false)} title="Collect Payment">
        <form onSubmit={handleCollect} className="space-y-4">
          <p className="text-sm text-gray-600"><strong>{selectedFee?.studentId?.userId?.name}</strong> — {selectedFee?.feeName}</p>
          <p className="text-sm">Due: ₹{selectedFee?.totalAmount} | Paid: ₹{selectedFee?.paidAmount} | <strong>Pending: ₹{(selectedFee?.totalAmount || 0) - (selectedFee?.paidAmount || 0)}</strong></p>
          <Input label="Amount" type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} required />
          <Select label="Payment Method" value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })} options={[{ value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }, { value: 'online', label: 'Online' }, { value: 'cheque', label: 'Cheque' }]} />
          <Input label="Transaction ID" value={paymentForm.transactionId} onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
          <Input label="Remark" value={paymentForm.remark} onChange={(e) => setPaymentForm({ ...paymentForm, remark: e.target.value })} />
          <div className="flex gap-3"><Button type="submit">Record Payment</Button><Button variant="secondary" type="button" onClick={() => setCollectModal(false)}>Cancel</Button></div>
        </form>
      </Modal>

      {/* Create Fee Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Fee">
        <form onSubmit={handleBulkCreate} className="space-y-4">
          <Input label="Fee Name" value={bulkForm.feeName} onChange={(e) => setBulkForm({ ...bulkForm, feeName: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Fee Type" value={bulkForm.feeType} onChange={(e) => setBulkForm({ ...bulkForm, feeType: e.target.value })} options={['tuition','exam','library','sports','transport','hostel','other'].map(t => ({ value: t, label: t.charAt(0).toUpperCase()+t.slice(1) }))} />
            <Input label="Amount (₹)" type="number" value={bulkForm.totalAmount} onChange={(e) => setBulkForm({ ...bulkForm, totalAmount: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class" value={bulkForm.classId} onChange={(e) => setBulkForm({ ...bulkForm, classId: e.target.value })} options={classes.map(c => ({ value: c._id, label: `${c.name} ${c.section}` }))} />
            <Input label="Due Date" type="date" value={bulkForm.dueDate} onChange={(e) => setBulkForm({ ...bulkForm, dueDate: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Academic Year" value={bulkForm.academicYear} onChange={(e) => setBulkForm({ ...bulkForm, academicYear: e.target.value })} placeholder="2024-2025" />
            <Select label="Term" value={bulkForm.term} onChange={(e) => setBulkForm({ ...bulkForm, term: e.target.value })} options={[{ value: '', label: 'Select' }, { value: 'term-1', label: 'Term 1' }, { value: 'term-2', label: 'Term 2' }, { value: 'term-3', label: 'Term 3' }, { value: 'annual', label: 'Annual' }]} />
          </div>
          <div className="flex gap-3"><Button type="submit">Create Fee</Button><Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button></div>
        </form>
      </Modal>

      {/* Concession Modal */}
      <Modal isOpen={concessionModal} onClose={() => setConcessionModal(false)} title="Apply Concession" size="sm">
        <form onSubmit={handleConcession} className="space-y-4">
          <p className="text-sm text-gray-600"><strong>{selectedFee?.studentId?.userId?.name}</strong> — {selectedFee?.feeName}</p>
          <p className="text-sm">Total: ₹{selectedFee?.totalAmount} | Concession Applied: ₹{selectedFee?.concessionAmount || 0}</p>
          <Input label="Concession Amount (₹)" type="number" value={concessionForm.amount} onChange={(e) => setConcessionForm({ ...concessionForm, amount: e.target.value })} required min={0} max={selectedFee?.totalAmount - (selectedFee?.paidAmount || 0)} />
          <Input label="Remark" value={concessionForm.remark} onChange={(e) => setConcessionForm({ ...concessionForm, remark: e.target.value })} />
          <div className="flex gap-3"><Button type="submit">Apply Concession</Button><Button variant="secondary" type="button" onClick={() => setConcessionModal(false)}>Cancel</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFees;
