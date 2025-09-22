import AdminDiagnosticsPanel from '@/components/admin/AdminDiagnosticsPanel';
import { PermissionsDebug } from '@/components/debug/PermissionsDebug';

const AdminDiagnosticsPage = () => {
  return (
    <div className="space-y-6">
      <AdminDiagnosticsPanel />
      <PermissionsDebug />
    </div>
  );
};

export default AdminDiagnosticsPage;