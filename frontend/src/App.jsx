import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Loader from './components/common/Loader';
import DashboardLayout from './components/layout/DashboardLayout';
import SuperAdminLayout from './components/layout/SuperAdminLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageParents from './pages/admin/ManageParents';
import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';
import SchoolSettings from './pages/admin/SchoolSettings';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminFees from './pages/admin/AdminFees';
import AdminReports from './pages/admin/AdminReports';
import AdminTimetable from './pages/admin/AdminTimetable';
import BulkStudentImport from './pages/admin/BulkStudentImport';
import NotificationComposer from './pages/admin/NotificationComposer';
import VoiceAttendance from './pages/admin/VoiceAttendance';
import BarcodeAttendance from './pages/admin/BarcodeAttendance';
import BiometricAttendance from './pages/admin/BiometricAttendance';
import AttendanceReport from './pages/admin/AttendanceReport';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import MarkAttendance from './pages/teacher/MarkAttendance';
import ManageHomework from './pages/teacher/ManageHomework';
import StudyMaterials from './pages/teacher/StudyMaterials';
import ManageExams from './pages/teacher/ManageExams';
import TimetableView from './pages/teacher/TimetableView';
import GradeHomework from './pages/teacher/GradeHomework';
import PublishResults from './pages/teacher/PublishResults';
import QuizGenerator from './pages/teacher/QuizGenerator';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentHomework from './pages/student/Homework';
import StudentMaterials from './pages/student/StudyMaterials';
import StudentFees from './pages/student/Fees';
import StudentExams from './pages/student/Exams';
import StudentTimetable from './pages/student/Timetable';
import AIHelper from './pages/student/AIHelper';
import QuizPage from './pages/student/QuizPage';

// Parent pages
import ParentDashboard from './pages/parent/Dashboard';
import ChildrenOverview from './pages/parent/ChildrenOverview';
import ChildAttendance from './pages/parent/ChildAttendance';
import ChildFees from './pages/parent/ChildFees';
import ChildHomework from './pages/parent/ChildHomework';
import ChildResults from './pages/parent/ChildResults';
import NoticeBoard from './pages/parent/NoticeBoard';

// Shared pages
import Chat from './pages/shared/Chat';
import Profile from './pages/shared/Profile';
import AIChatPage from './pages/shared/AIChatPage';
import SelfService from './pages/shared/SelfService';

// Super Admin pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import AdmitStudent from './pages/superadmin/AdmitStudent';
import AdmitBulkStudent from './pages/superadmin/AdmitBulkStudent';
import AdmissionRequests from './pages/superadmin/AdmissionRequests';
import AdmissionInquiries from './pages/superadmin/AdmissionInquiries';
import PrintAdmissionForms from './pages/superadmin/PrintAdmissionForms';
import StudentInfo from './pages/superadmin/StudentInfo';
import StudentPromotion from './pages/superadmin/StudentPromotion';
import StudentBirthday from './pages/superadmin/StudentBirthday';
import StudentTransfer from './pages/superadmin/StudentTransfer';
import ParentAccounts from './pages/superadmin/ParentAccounts';
import ParentAccountRequests from './pages/superadmin/ParentAccountRequests';
import ParentReportsSA from './pages/superadmin/ParentReports';
import StaffManage from './pages/superadmin/StaffManage';
import StaffAttendanceSA from './pages/superadmin/StaffAttendanceSA';
import PrintStudentCards from './pages/superadmin/PrintStudentCards';
import PrintStaffCards from './pages/superadmin/PrintStaffCards';
import IDCardSettings from './pages/superadmin/IDCardSettings';
import Accountants from './pages/superadmin/Accountants';
import ParentComplaints from './pages/superadmin/ParentComplaints';
import PublicMessages from './pages/superadmin/PublicMessages';
import ManageSections from './pages/superadmin/ManageSections';
import ManageExpenses from './pages/superadmin/ManageExpenses';
import ExpenseCategories from './pages/superadmin/ExpenseCategories';
import GenerateSalary from './pages/superadmin/GenerateSalary';
import ManageSalaries from './pages/superadmin/ManageSalaries';
import LoanManagement from './pages/superadmin/LoanManagement';
import SalarySettings from './pages/superadmin/SalarySettings';
import PointOfSale from './pages/superadmin/PointOfSale';
import ProductsStock from './pages/superadmin/ProductsStock';
import ExamTermList from './pages/superadmin/ExamTermList';
import MarksEntry from './pages/superadmin/MarksEntry';
import TabulationSheet from './pages/superadmin/TabulationSheet';
import AssignGrade from './pages/superadmin/AssignGrade';
import AdmitCards from './pages/superadmin/AdmitCards';
import CertificatePrinting from './pages/superadmin/CertificatePrinting';
import CertificateTemplates from './pages/superadmin/CertificateTemplates';
import SMSManagement from './pages/superadmin/SMSManagement';
import { AppNotifications, WhatsAppNotifications, TelegramNotifications, EmailAlerts } from './pages/superadmin/NotificationPages';
import { TransportSettings, WebsiteSettings, AdminRoles, GeneralSettings } from './pages/superadmin/SettingsPages';
import { FeeReports, IncomeExpenseReport, AttendanceReportsSA, StudentReportsSA } from './pages/superadmin/ReportPages';
import OnlineClasses from './pages/superadmin/OnlineClasses';
import NoticeBoardPage from './pages/superadmin/NoticeBoardPage';
import DailyDiary from './pages/superadmin/DailyDiary';
import WalletManagement from './pages/superadmin/WalletManagement';
import DeletedFees from './pages/superadmin/DeletedFees';
import DiscountStudent from './pages/superadmin/DiscountStudent';
import FeeAdjustment from './pages/superadmin/FeeAdjustment';
import BalanceSheet from './pages/superadmin/BalanceSheet';
import SMSHistory from './pages/superadmin/SMSHistory';
import MarkSheets from './pages/superadmin/MarkSheets';
import LibraryManagement from './pages/superadmin/LibraryManagement';
import HostelManagement from './pages/superadmin/HostelManagement';
import EventCalendar from './pages/superadmin/EventCalendar';
import AlumniManagement from './pages/superadmin/AlumniManagement';
import ConferencePage from './pages/superadmin/ConferencePage';
import TestManagement from './pages/superadmin/TestManagement';
import GalleryPage from './pages/superadmin/GalleryPage';
import ApprovalPage from './pages/superadmin/ApprovalPage';
import SubstitutionPage from './pages/superadmin/SubstitutionPage';
import AccountSettlement from './pages/superadmin/AccountSettlement';
import TimetableConflicts from './pages/superadmin/TimetableConflicts';
import AutoRollNumber from './pages/superadmin/AutoRollNumber';
import AdvancedAnalytics from './pages/superadmin/AdvancedAnalytics';
import FeeVoucher from './pages/superadmin/FeeVoucher';
import BarcodeAccounts from './pages/superadmin/BarcodeAccounts';
import MedicalRecords from './pages/superadmin/MedicalRecords';
import PromotionRules from './pages/superadmin/PromotionRules';

// Protected route wrapper
function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    const routes = { superadmin: '/superadmin', admin: '/admin', teacher: '/teacher', student: '/student', parent: '/parent' };
    return <Navigate to={routes[role] || '/login'} />;
  }
  return children || <Outlet />;
}

// Public route - redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) {
    const routes = { superadmin: '/superadmin', admin: '/admin', teacher: '/teacher', student: '/student', parent: '/parent' };
    return <Navigate to={routes[role] || '/'} />;
  }
  return children;
}

// Root redirect based on role
function RootRedirect() {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  const routes = { superadmin: '/superadmin', admin: '/admin', teacher: '/teacher', student: '/student', parent: '/parent' };
  return <Navigate to={routes[role] || '/login'} />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Super Admin Routes */}
      <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminLayout /></ProtectedRoute>}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="admission/admit" element={<AdmitStudent />} />
        <Route path="admission/bulk" element={<AdmitBulkStudent />} />
        <Route path="admission/requests" element={<AdmissionRequests />} />
        <Route path="admission/inquiries" element={<AdmissionInquiries />} />
        <Route path="admission/print-forms" element={<PrintAdmissionForms />} />
        <Route path="students/info" element={<StudentInfo />} />
        <Route path="students/promotion" element={<StudentPromotion />} />
        <Route path="students/birthday" element={<StudentBirthday />} />
        <Route path="students/transfer" element={<StudentTransfer />} />
        <Route path="parents/accounts" element={<ParentAccounts />} />
        <Route path="parents/requests" element={<ParentAccountRequests />} />
        <Route path="parents/reports" element={<ParentReportsSA />} />
        <Route path="staff/manage" element={<StaffManage />} />
        <Route path="staff/attendance" element={<StaffAttendanceSA />} />
        <Route path="id-cards/student" element={<PrintStudentCards />} />
        <Route path="id-cards/staff" element={<PrintStaffCards />} />
        <Route path="id-cards/settings" element={<IDCardSettings />} />
        <Route path="accountants" element={<Accountants />} />
        <Route path="complaints" element={<ParentComplaints />} />
        <Route path="messages" element={<PublicMessages />} />
        <Route path="classes/manage" element={<ManageClasses />} />
        <Route path="classes/sections" element={<ManageSections />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="attendance/student" element={<AdminAttendance />} />
        <Route path="attendance/voice" element={<VoiceAttendance />} />
        <Route path="attendance/barcode" element={<BarcodeAttendance />} />
        <Route path="attendance/biometric" element={<BiometricAttendance />} />
        <Route path="attendance/report" element={<AttendanceReport />} />
        <Route path="online-classes" element={<OnlineClasses />} />
        <Route path="timetable/add" element={<AdminTimetable />} />
        <Route path="timetable/manage" element={<AdminTimetable />} />
        <Route path="fees/generate" element={<AdminFees />} />
        <Route path="fees/payment" element={<AdminFees />} />
        <Route path="fees/accounting" element={<Accountants />} />
        <Route path="fees/types" element={<AdminFees />} />
        <Route path="fees/increment" element={<FeeAdjustment />} />
        <Route path="fees/decrement" element={<FeeAdjustment />} />
        <Route path="fees/discount" element={<DiscountStudent />} />
        <Route path="expenses/manage" element={<ManageExpenses />} />
        <Route path="expenses/categories" element={<ExpenseCategories />} />
        <Route path="salary/generate" element={<GenerateSalary />} />
        <Route path="salary/manage" element={<ManageSalaries />} />
        <Route path="salary/loans" element={<LoanManagement />} />
        <Route path="salary/settings" element={<SalarySettings />} />
        <Route path="reports/fees" element={<FeeReports />} />
        <Route path="reports/income" element={<IncomeExpenseReport />} />
        <Route path="reports/attendance" element={<AttendanceReportsSA />} />
        <Route path="reports/students" element={<StudentReportsSA />} />
        <Route path="stock/pos" element={<PointOfSale />} />
        <Route path="stock/products" element={<ProductsStock />} />
        <Route path="exams/term-list" element={<ExamTermList />} />
        <Route path="exams/marks" element={<MarksEntry />} />
        <Route path="exams/tabulation" element={<TabulationSheet />} />
        <Route path="exams/grades" element={<AssignGrade />} />
        <Route path="exams/admit-cards" element={<AdmitCards />} />
        <Route path="certificates/print" element={<CertificatePrinting />} />
        <Route path="certificates/templates" element={<CertificateTemplates />} />
        <Route path="notifications/sms" element={<SMSManagement />} />
        <Route path="notifications/app" element={<AppNotifications />} />
        <Route path="notifications/whatsapp" element={<WhatsAppNotifications />} />
        <Route path="notifications/telegram" element={<TelegramNotifications />} />
        <Route path="notifications/email" element={<EmailAlerts />} />
        <Route path="transport" element={<TransportSettings />} />
        <Route path="biometric" element={<BiometricAttendance />} />
        <Route path="website" element={<WebsiteSettings />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="settings/general" element={<GeneralSettings />} />
        <Route path="notices" element={<NoticeBoardPage />} />
        <Route path="diary" element={<DailyDiary />} />
        <Route path="wallets" element={<WalletManagement />} />
        <Route path="fees/deleted" element={<DeletedFees />} />
        <Route path="fees/balance-sheet" element={<BalanceSheet />} />
        <Route path="notifications/history" element={<SMSHistory />} />
        <Route path="exams/mark-sheets" element={<MarkSheets />} />
        <Route path="library" element={<LibraryManagement />} />
        <Route path="hostel" element={<HostelManagement />} />
        <Route path="events" element={<EventCalendar />} />
        <Route path="alumni" element={<AlumniManagement />} />
        <Route path="conferences" element={<ConferencePage />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="approvals" element={<ApprovalPage />} />
        <Route path="substitutions" element={<SubstitutionPage />} />
        <Route path="fees/settlement" element={<AccountSettlement />} />
        <Route path="timetable/conflicts" element={<TimetableConflicts />} />
        <Route path="students/roll-numbers" element={<AutoRollNumber />} />
        <Route path="analytics" element={<AdvancedAnalytics />} />
        <Route path="fees/vouchers" element={<FeeVoucher />} />
        <Route path="attendance/barcode-accounts" element={<BarcodeAccounts />} />
        <Route path="students/medical" element={<MedicalRecords />} />
        <Route path="students/promotion-rules" element={<PromotionRules />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin','superadmin']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="parents" element={<ManageParents />} />
        <Route path="classes" element={<ManageClasses />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="settings" element={<SchoolSettings />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="bulk-import" element={<BulkStudentImport />} />
        <Route path="notifications" element={<NotificationComposer />} />
        <Route path="attendance/voice" element={<VoiceAttendance />} />
        <Route path="attendance/barcode" element={<BarcodeAttendance />} />
        <Route path="attendance/biometric" element={<BiometricAttendance />} />
        <Route path="attendance/report" element={<AttendanceReport />} />
        <Route path="chat" element={<Chat />} />
        <Route path="ai" element={<AIChatPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<MarkAttendance />} />
        <Route path="homework" element={<ManageHomework />} />
        <Route path="grade-homework" element={<GradeHomework />} />
        <Route path="materials" element={<StudyMaterials />} />
        <Route path="exams" element={<ManageExams />} />
        <Route path="publish-results" element={<PublishResults />} />
        <Route path="quiz-generator" element={<QuizGenerator />} />
        <Route path="timetable" element={<TimetableView />} />
        <Route path="chat" element={<Chat />} />
        <Route path="ai" element={<AIChatPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<SelfService />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="homework" element={<StudentHomework />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="ai" element={<AIHelper />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Parent Routes */}
      <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ChildrenOverview />} />
        <Route path="attendance/:childId" element={<ChildAttendance />} />
        <Route path="fees/:childId" element={<ChildFees />} />
        <Route path="homework/:childId" element={<ChildHomework />} />
        <Route path="results/:childId" element={<ChildResults />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="ai" element={<AIChatPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Root */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
