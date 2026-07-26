import { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Breadcrumb from '../../components/common/Breadcrumb';
import api from '../../services/api';

export function FeeReports() {
  const [fees, setFees] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(()=>{api.get('/fees').then(r=>{setFees(r.data);setLoading(false)}).catch(()=>setLoading(false))},[]);
  const total=fees.reduce((s,f)=>s+f.totalAmount,0),collected=fees.reduce((s,f)=>s+f.paidAmount,0);
  const exportCsv=()=>{const r=[['Student','Fee','Total','Paid','Pending','Status'].join(',')];fees.forEach(f=>r.push([f.studentId?.userId?.name,f.feeName,f.totalAmount,f.paidAmount,f.totalAmount-f.paidAmount,f.status].join(',')));const b=new Blob([r.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='fee_report.csv';a.click()};
  return (<div className="space-y-6"><Breadcrumb items={[{label:'Reports'},{label:'Fee Reports',active:true}]}/>
    <div className="flex justify-between"><div><h1 className="text-2xl font-bold">Fee Defaulter Report</h1><p className="text-gray-500 text-sm">View fee collection status</p></div><button onClick={exportCsv} className="px-4 py-2 bg-gray-100 rounded-lg text-sm"><Download className="w-4 h-4 inline mr-1"/>Export</button></div>
    <div className="grid grid-cols-4 gap-4"><div className="bg-blue-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-blue-700">₹{total.toLocaleString()}</p><p className="text-xs">Total</p></div><div className="bg-green-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-green-700">₹{collected.toLocaleString()}</p><p className="text-xs">Collected</p></div><div className="bg-red-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-red-700">₹{(total-collected).toLocaleString()}</p><p className="text-xs">Pending</p></div><div className="bg-purple-50 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-purple-700">{fees.filter(f=>f.status!=='paid').length}</p><p className="text-xs">Defaulters</p></div></div>
    <Card><Table columns={[{key:'student',label:'Student',render:r=>r.studentId?.userId?.name},{key:'feeName',label:'Fee'},{key:'amount',label:'Amount',render:r=><span>₹{r.paidAmount}/₹{r.totalAmount}</span>},{key:'status',label:'Status',render:r=><Badge variant={r.status==='paid'?'success':'danger'}>{r.status}</Badge>}]} data={fees.filter(f=>f.status!=='paid').slice(0,50)} loading={loading}/></Card>
  </div>);
}

export function IncomeExpenseReport() {
  return (<div className="space-y-6"><Breadcrumb items={[{label:'Reports'},{label:'Income & Expense',active:true}]}/><h1 className="text-2xl font-bold">Income & Expense Report</h1><div className="grid grid-cols-3 gap-4"><Card><div className="p-6 text-center"><TrendingUp className="w-8 h-8 text-green-500 mx-auto"/><p className="text-2xl font-bold text-green-600 mt-2">₹0</p><p className="text-sm text-gray-500">Income This Month</p></div></Card><Card><div className="p-6 text-center"><TrendingDown className="w-8 h-8 text-red-500 mx-auto"/><p className="text-2xl font-bold text-red-600 mt-2">₹0</p><p className="text-sm text-gray-500">Expense This Month</p></div></Card><Card><div className="p-6 text-center"><IndianRupee className="w-8 h-8 text-blue-500 mx-auto"/><p className="text-2xl font-bold text-blue-600 mt-2">₹0</p><p className="text-sm text-gray-500">Net Profit</p></div></Card></div><Card><div className="p-6"><h2 className="font-semibold mb-4">Detailed Income & Expense Summary</h2><p className="text-gray-400 text-center py-8">Add income and expense records to see the report</p></div></Card></div>);
}

export function AttendanceReportsSA() {
  return (<div className="space-y-6"><Breadcrumb items={[{label:'Reports'},{label:'Attendance',active:true}]}/><h1 className="text-2xl font-bold">Attendance Reports</h1><div className="grid grid-cols-3 gap-4"><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-green-600">0</p><p className="text-sm">Present Today</p></div></Card><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-red-600">0</p><p className="text-sm">Absent Today</p></div></Card><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-blue-600">0%</p><p className="text-sm">Attendance Rate</p></div></Card></div><Card><div className="p-6"><h2 className="font-semibold">Staff Attendance Summary</h2><p className="text-gray-400 text-center py-8">Mark attendance to see the report</p></div></Card></div>);
}

export function StudentReportsSA() {
  return (<div className="space-y-6"><Breadcrumb items={[{label:'Reports'},{label:'Student Reports',active:true}]}/><h1 className="text-2xl font-bold">Student Information Reports</h1><div className="grid grid-cols-3 gap-4"><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-blue-600">0</p><p className="text-sm">Total Students</p></div></Card><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-green-600">0</p><p className="text-sm">Active Students</p></div></Card><Card><div className="p-6 text-center"><p className="text-2xl font-bold text-purple-600">0</p><p className="text-sm">By Class</p></div></Card></div><Card><div className="p-6"><h2 className="font-semibold">Admission Date Report</h2><p className="text-gray-400 text-center py-8">Add students to see the report</p></div></Card></div>);
}
