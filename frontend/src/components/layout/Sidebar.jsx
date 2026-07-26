import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Users, UserCog, GraduationCap, Users2, BookOpen, School, Building2,
  ClipboardCheck, BookMarked, FileText, CalendarDays, MessageSquare, BarChart3,
  CreditCard, Bot, Settings, LogOut, ChevronLeft, ChevronRight, Bell,
  Megaphone, PencilRuler, ClipboardList, PieChart, Upload, UserCircle,
  Mic, Camera, Fingerprint, Menu, X,
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: GraduationCap, label: 'Students' },
  { to: '/admin/teachers', icon: UserCog, label: 'Teachers' },
  { to: '/admin/parents', icon: Users2, label: 'Parents' },
  { to: '/admin/classes', icon: Building2, label: 'Classes' },
  { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/admin/timetable', icon: CalendarDays, label: 'Timetable' },
  { to: '/admin/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/admin/attendance/voice', icon: Mic, label: 'Voice Attendance', indent: true },
  { to: '/admin/attendance/barcode', icon: Camera, label: 'Barcode Attendance', indent: true },
  { to: '/admin/attendance/biometric', icon: Fingerprint, label: 'Biometric', indent: true },
  { to: '/admin/attendance/report', icon: BarChart3, label: 'Attendance Report', indent: true },
  { to: '/admin/fees', icon: CreditCard, label: 'Fees' },
  { to: '/admin/reports', icon: PieChart, label: 'Reports' },
  { to: '/admin/bulk-import', icon: Upload, label: 'Bulk Import' },
  { to: '/admin/notifications', icon: Megaphone, label: 'Notifications' },
  { to: '/admin/ai', icon: Bot, label: 'AI Assistant' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const teacherLinks = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/teacher/homework', icon: BookMarked, label: 'Homework' },
  { to: '/teacher/grade-homework', icon: PencilRuler, label: 'Grade Work' },
  { to: '/teacher/materials', icon: FileText, label: 'Materials' },
  { to: '/teacher/timetable', icon: CalendarDays, label: 'Timetable' },
  { to: '/teacher/exams', icon: School, label: 'Exams' },
  { to: '/teacher/publish-results', icon: ClipboardList, label: 'Results' },
  { to: '/teacher/quiz-generator', icon: Bot, label: 'Quiz Gen' },
  { to: '/teacher/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/teacher/ai', icon: Bot, label: 'AI Assistant' },
];

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/student/homework', icon: BookMarked, label: 'Homework' },
  { to: '/student/materials', icon: FileText, label: 'Materials' },
  { to: '/student/fees', icon: CreditCard, label: 'Fees' },
  { to: '/student/exams', icon: School, label: 'Exams' },
  { to: '/student/quiz', icon: PencilRuler, label: 'Quiz' },
  { to: '/student/timetable', icon: CalendarDays, label: 'Timetable' },
  { to: '/student/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/student/ai', icon: Bot, label: 'AI Helper' },
  { to: '/student/profile', icon: Settings, label: 'Profile' },
];

const parentLinks = [
  { to: '/parent', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/parent/children', icon: Users, label: 'My Children' },
  { to: '/parent/notices', icon: Megaphone, label: 'Notice Board' },
  { to: '/parent/chat', icon: MessageSquare, label: 'Messages' },
  { to: '/parent/ai', icon: Bot, label: 'AI Assistant' },
];

const getLinks = (role) => {
  switch (role) {
    case 'admin': return adminLinks;
    case 'teacher': return teacherLinks;
    case 'student': return studentLinks;
    case 'parent': return parentLinks;
    default: return [];
  }
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = getLinks(role);

  const isActive = (to) => {
    if (to === `/${role}`) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {/* Mobile overlay */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={()=>setMobileOpen(false)} />}
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 flex flex-col print:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center gap-3 px-4 h-16 border-b ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-gray-800 truncate">EduManage</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${link.indent ? 'ml-4' : ''} ${
              isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3">
        <button onClick={logout} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button onClick={onToggle} className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
        {collapsed ? <ChevronRight className="w-3 h-3 text-gray-500" /> : <ChevronLeft className="w-3 h-3 text-gray-500" />}
      </button>
    </aside>
    </>
  );
}
