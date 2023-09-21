import { Navigate, Outlet } from "react-router-dom";

const PrivateRouterAdmin = () => {
  const UserLocal = JSON.parse(localStorage.getItem("flagUser") || "null");

  return UserLocal.roles === 1 ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouterAdmin;
