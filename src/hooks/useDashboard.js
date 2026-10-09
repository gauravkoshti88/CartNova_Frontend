import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDashboard } from "../redux/thunks/dashboardThunk";

export default function useDashboard() {
  const dispatch = useDispatch();

  const {
    stats,
    recentOrders,
    recentCustomers,
    salesOverview,
    loading,
    error,
    message,
  } = useSelector((state) => state.dashboard);

  const fetchDashboard = useCallback(() => {
    return dispatch(getDashboard());
  }, [dispatch]);

  return {
    stats,
    recentOrders,
    recentCustomers,
    salesOverview,

    loading,
    error,
    message,

    fetchDashboard,
  };
}
