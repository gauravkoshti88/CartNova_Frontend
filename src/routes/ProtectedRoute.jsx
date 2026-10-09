import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "../components/States";

/* ============================================================
   ADMIN PROTECTED ROUTE
============================================================ */

export function AdminProtectedRoute() {
  const { loading, initialized, isAuthenticated } = useSelector(
    (state) => state.adminAuth,
  );

  if (!initialized || loading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

/* ============================================================
   ADMIN PUBLIC ROUTE
============================================================ */

export function AdminPublicRoute() {
  const { initialized, loading, isAuthenticated } = useSelector(
    (state) => state.adminAuth,
  );

  if (!initialized || loading) {
    return <Loader fullPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

/* ============================================================
   USER PROTECTED ROUTE
============================================================ */

export function UserProtectedRoute() {
  const location = useLocation();

  const { isAuthenticated, loading, initialized } = useSelector(
    (state) => state.userAuth,
  );

  if (!initialized || loading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
