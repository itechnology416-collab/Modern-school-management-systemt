import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Users, UserCog, GraduationCap, Users2, BookOpen,
  ClipboardCheck, FileText, CalendarDays, MessageSquare, BarChart3,
  CreditCard, Settings, LogOut, ChevronLeft, ChevronRight,
  School, UserPlus, Upload, FileSpreadsheet, Printer, Wallet,
  Receipt, Landmark, TrendingDown, Package, ScrollText,
  Award, Megaphone, Smartphone, Mail, BellRing, Send,
  Bus, Fingerprint, Globe, Shield, DollarSign, Clock,
  UserCheck, FileQuestion, BookMarked, Briefcase, Camera, Mic,
  ShoppingCart, Wrench, PieChart, ListChecks, Download,
  TrendingUp, Monitor,
  Library, Building, Image, FileCheck, ArrowLeftRight, Hash, BarChartHorizontal, AlertCircle,
  QrCode, Heart, ArrowUp,
} from 'lucide-react';

const superAdminNav = [
  { heading: 'MAIN NAVIGATION' },
  { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard' },

  { heading: 'Admission Management' },
  { to: '/superadmin/admission/admit', icon: UserPlus, label: 'Admit Student' },
  { to: '/superadmin/admission/bulk', icon: Upload, label: 'Admit Bulk Student' },
  { to: '/superadmin/admission/requests', icon: FileSpreadsheet, label: 'Admission Requests' },
  { to: '/superadmin/admission/inquiries', icon: FileQuestion, label: 'Admission Inquiries' },
  { to: '/superadmin/admission/print-forms', icon: Printer, label: 'Print Admission Forms' },

  { heading: 'Student Management' },
  { to: '/superadmin/students/info', icon: GraduationCap, label: 'Student Information' },
  { to: '/superadmin/students/promotion', icon: TrendingDown, label: 'Student Promotion' },
  { to: '/superadmin/students/birthday', icon: BookMarked, label: 'Student Birthday' },
  { to: '/superadmin/students/transfer', icon: Bus, label: 'Student Transfer' },

  { heading: 'Parent Accounts' },
  { to: '/superadmin/parents/accounts', icon: Users2, label: 'Manage Accounts' },
  { to: '/superadmin/parents/requests', icon: FileSpreadsheet, label: 'Account Requests' },
  { to: '/superadmin/parents/reports', icon: BarChart3, label: 'Parent Reports' },

  { heading: 'Staff Management' },
  { to: '/superadmin/staff/manage', icon: UserCog, label: 'Manage Staff' },
  { to: '/superadmin/staff/attendance', icon: ClipboardCheck, label: 'Staff Attendance' },

  { heading: 'ID Card Printing' },
  { to: '/superadmin/id-cards/student', icon: Printer, label: 'Print Student Cards' },
  { to: '/superadmin/id-cards/staff', icon: Printer, label: 'Print Staff Cards' },
  { to: '/superadmin/id-cards/settings', icon: Settings, label: 'ID Card Settings' },

  { to: '/superadmin/accountants', icon: Wallet, label: 'Accountants' },
  { to: '/superadmin/complaints', icon: Megaphone, label: 'Parent Complaints' },
  { to: '/superadmin/messages', icon: MessageSquare, label: 'Public Messages' },

  { heading: 'Classes & Sections' },
  { to: '/superadmin/classes/manage', icon: BookOpen, label: 'Manage Classes' },
  { to: '/superadmin/classes/sections', icon: ListChecks, label: 'Manage Sections' },

  { to: '/superadmin/subjects', icon: FileText, label: 'Manage Subjects' },

  { heading: 'Manage Attendance' },
  { to: '/superadmin/attendance/student', icon: ClipboardCheck, label: 'Student Attendance' },
  { to: '/superadmin/attendance/voice', icon: Mic, label: 'Voice Attendance' },
  { to: '/superadmin/attendance/barcode', icon: Camera, label: 'Barcode Attendance' },
  { to: '/superadmin/attendance/biometric', icon: Fingerprint, label: 'Biometric Attendance' },
  { to: '/superadmin/attendance/report', icon: BarChart3, label: 'Attendance Report' },
  { to: '/superadmin/attendance/barcode-accounts', icon: QrCode, label: 'Barcode Accounts' },

  { to: '/superadmin/online-classes', icon: Monitor, label: 'Online Classes' },

  { to: '/superadmin/notices', icon: Megaphone, label: 'Notice Board' },
  { to: '/superadmin/diary', icon: BookOpen, label: 'Daily Diary' },

  { heading: 'Wallet & Credits' },
  { to: '/superadmin/wallets', icon: Wallet, label: 'Parent Wallets' },

  { heading: 'Timetable Management' },
  { to: '/superadmin/timetable/add', icon: CalendarDays, label: 'Add Timetable' },
  { to: '/superadmin/timetable/manage', icon: Wrench, label: 'Manage Timetable' },

  { heading: 'Fee & Accounting' },
  { to: '/superadmin/fees/generate', icon: Receipt, label: 'Generate Fees' },
  { to: '/superadmin/fees/payment', icon: CreditCard, label: 'Fee Payment' },
  { to: '/superadmin/fees/accounting', icon: Landmark, label: 'Accounting' },
  { to: '/superadmin/fees/types', icon: ListChecks, label: 'Fee Types' },
  { to: '/superadmin/fees/increment', icon: TrendingUp, label: 'Fee Increment' },
  { to: '/superadmin/fees/decrement', icon: TrendingDown, label: 'Fee Decrement' },
  { to: '/superadmin/fees/discount', icon: DollarSign, label: 'Discount Student' },
  { to: '/superadmin/fees/balance-sheet', icon: BarChart3, label: 'Balance Sheet' },
  { to: '/superadmin/fees/deleted', icon: ScrollText, label: 'Deleted Fees' },

  { heading: 'Expense Management' },
  { to: '/superadmin/expenses/manage', icon: Receipt, label: 'Add/Manage Expense' },
  { to: '/superadmin/expenses/categories', icon: ListChecks, label: 'Expense Categories' },

  { heading: 'Salary & Loan' },
  { to: '/superadmin/salary/generate', icon: DollarSign, label: 'Generate Salary' },
  { to: '/superadmin/salary/manage', icon: Wrench, label: 'Manage Salaries' },
  { to: '/superadmin/salary/loans', icon: Landmark, label: 'Loan Management' },
  { to: '/superadmin/salary/settings', icon: Settings, label: 'Salary Settings' },

  { heading: 'Reporting Area' },
  { to: '/superadmin/reports/fees', icon: BarChart3, label: 'Fee Reports' },
  { to: '/superadmin/reports/income', icon: PieChart, label: 'Income & Expense' },
  { to: '/superadmin/reports/attendance', icon: ClipboardCheck, label: 'Attendance Report' },
  { to: '/superadmin/reports/students', icon: GraduationCap, label: 'Student Reports' },

  { heading: 'Stock & Inventory' },
  { to: '/superadmin/stock/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { to: '/superadmin/stock/products', icon: Package, label: 'Products & Stock' },

  { heading: 'Exam / Test Management' },
  { to: '/superadmin/exams/term-list', icon: ScrollText, label: 'Exam Term List' },
  { to: '/superadmin/exams/marks', icon: FileSpreadsheet, label: 'Marks Entry' },
  { to: '/superadmin/exams/tabulation', icon: PieChart, label: 'Tabulation Sheet' },
  { to: '/superadmin/exams/grades', icon: Award, label: 'Assign Grade' },
  { to: '/superadmin/exams/admit-cards', icon: Printer, label: 'Print Admit Cards' },
  { to: '/superadmin/exams/mark-sheets', icon: FileText, label: 'Print Mark Sheets' },

  { heading: 'Certifications' },
  { to: '/superadmin/certificates/print', icon: Award, label: 'Certificate Printing' },
  { to: '/superadmin/certificates/templates', icon: FileText, label: 'Templates' },

  { heading: 'SMS & Notifications' },
  { to: '/superadmin/notifications/sms', icon: Smartphone, label: 'SMS Management' },
  { to: '/superadmin/notifications/app', icon: BellRing, label: 'App Notifications' },
  { to: '/superadmin/notifications/whatsapp', icon: Send, label: 'WhatsApp' },
  { to: '/superadmin/notifications/telegram', icon: Send, label: 'Telegram' },
  { to: '/superadmin/notifications/email', icon: Mail, label: 'Email Alerts' },
  { to: '/superadmin/notifications/history', icon: Clock, label: 'SMS / Notification History' },

  { heading: 'Library & Campus' },
  { to: '/superadmin/library', icon: Library, label: 'Library Management' },
  { to: '/superadmin/hostel', icon: Building, label: 'Hostel Management' },
  { to: '/superadmin/events', icon: CalendarDays, label: 'Event Calendar' },
  { to: '/superadmin/alumni', icon: Users2, label: 'Alumni Management' },
  { to: '/superadmin/gallery', icon: Image, label: 'Website Gallery' },

  { heading: 'Workflow & Organization' },
  { to: '/superadmin/conferences', icon: Users, label: 'Parent Conferences' },
  { to: '/superadmin/approvals', icon: FileCheck, label: 'Approval Workflows' },
  { to: '/superadmin/substitutions', icon: ArrowLeftRight, label: 'Teacher Substitution' },
  { to: '/superadmin/tests', icon: ClipboardList, label: 'Test Management' },
  { to: '/superadmin/timetable/conflicts', icon: AlertCircle, label: 'Conflict Detection' },

  { heading: 'Tools' },
  { to: '/superadmin/students/roll-numbers', icon: Hash, label: 'Auto Roll Numbers' },
  { to: '/superadmin/students/medical', icon: Heart, label: 'Medical Records' },
  { to: '/superadmin/students/promotion-rules', icon: ArrowUp, label: 'Promotion Rules' },
  { to: '/superadmin/fees/vouchers', icon: Printer, label: 'Fee Vouchers' },
  { to: '/superadmin/fees/settlement', icon: FileText, label: 'Accounts Settlement' },
  { to: '/superadmin/analytics', icon: BarChartHorizontal, label: 'Advanced Analytics' },

  { heading: 'Settings' },
  { to: '/superadmin/transport', icon: Bus, label: 'Transport' },
  { to: '/superadmin/biometric', icon: Fingerprint, label: 'Biometric Devices' },
  { to: '/superadmin/website', icon: Globe, label: 'Website' },
  { to: '/superadmin/roles', icon: Shield, label: 'Admin Roles' },
  { to: '/superadmin/settings/general', icon: Settings, label: 'Settings' },
];

// --- Tooltip for collapsed icon mode ---
function Tooltip({ text, show }) {
  if (!show || !text) return null;
  return (
    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[100] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
        {text}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

export default function SuperAdminSidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col shadow-xl overflow-hidden ${collapsed ? 'w-[72px]' : 'w-72'}`}
      style={{ backgroundColor: '#1a2744' }}
    >
      {/* ── Profile / Logo ── */}
      <div className={`flex items-center gap-3 px-4 h-[70px] border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-blue-600/20">
          {user?.name?.charAt(0)?.toUpperCase() || 'S'}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-tight">{user?.name || 'Super Admin'}</p>
            <p className="text-blue-300 text-[11px]">Super Admin</p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-0.5"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {superAdminNav.map((item, idx) => {
          // Section headings
          if (item.heading) {
            if (collapsed) {
              // Thin separator line between sections
              return <div key={idx} className="my-3 mx-2 border-t border-white/5" />;
            }
            return (
              <p key={idx} className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.12em] px-3 pt-4 pb-1.5 select-none">
                {item.heading}
              </p>
            );
          }

          const isActive = location.pathname === item.to
            || (item.to !== '/superadmin' && location.pathname.startsWith(item.to));

          return (
            <div key={item.to} className="relative group">
              <NavLink
                to={item.to}
                onMouseEnter={() => collapsed && setHoveredIdx(idx)}
                onMouseLeave={() => collapsed && setHoveredIdx(null)}
                className={`
                  flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${collapsed ? 'justify-center px-0 py-3 w-full' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-900/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                {/* Active left-border accent (expanded mode) */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
                )}

                {/* Active dot indicator (collapsed mode) */}
                {isActive && collapsed && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}

                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>

              {/* Hover tooltip in collapsed mode */}
              {collapsed && (
                <Tooltip text={item.label} show={hoveredIdx === idx} />
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="border-t border-white/10 p-2 flex-shrink-0">
        <button
          onClick={logout}
          className={`flex items-center gap-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${collapsed ? 'justify-center w-full py-3 px-0' : 'w-full px-3 py-2.5'}`}
          title="Log Out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-[88px] w-7 h-7 bg-blue-600 hover:bg-blue-500 border-[2.5px] border-white/30 rounded-full flex items-center justify-center shadow-xl transition-all z-50 hover:scale-110 active:scale-95"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-white" />
        )}
      </button>

      {/* Custom scrollbar styles for the dark sidebar (injected once) */}
      <style>{`
        aside nav::-webkit-scrollbar { width: 4px; }
        aside nav::-webkit-scrollbar-track { background: transparent; }
        aside nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
        aside nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </aside>
  );
}
