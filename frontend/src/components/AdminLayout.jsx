import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Outlet />
    </div>
  );
}

export default AdminLayout;
