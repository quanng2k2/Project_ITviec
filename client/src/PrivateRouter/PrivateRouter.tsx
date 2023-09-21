import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const UserLocal = JSON.parse(localStorage.getItem("flagUser") || "null");

  return UserLocal.roles === 0 ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouter;
