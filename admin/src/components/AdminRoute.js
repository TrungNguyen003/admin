import RoleRoute from "./RoleRoute";

const AdminRoute = () => <RoleRoute allowedRoles={['admin']} />;
export default AdminRoute;
