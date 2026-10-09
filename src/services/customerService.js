import api from "./api";

export const customerService = {
  getAllCustomers: (params = {}) => {
    return api.get("/api/admin/customers", {
      params,
    });
  },

  getCustomerById: (id) => {
    return api.get(`/api/admin/customers/${id}`);
  },

  updateCustomer: (id, data) => {
    return api.put(`/api/admin/customers/${id}`, data);
  },

  deleteCustomer: (id) => {
    return api.delete(`/api/admin/customers/${id}`);
  },

  blockCustomer: (id, data = {}) => {
    return api.patch(`/api/admin/customers/${id}/block`, data);
  },

  unblockCustomer: (id) => {
    return api.patch(`/api/admin/customers/${id}/unblock`);
  },
};
