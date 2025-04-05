import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  const user = useSelector((state) => state.user.user);
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicLayout;
