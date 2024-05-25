import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && (currentUser.isAdmin || currentUser.isMod) ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}