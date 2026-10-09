import api from "./api";

export const userAuthService = {
  googleLogin: (credential) => api.post("/api/auth/google-login", credential),

  register: (data) => api.post("/api/auth/user-register", data),

  login: (data) => api.post("/api/auth/user-login", data),

  sendLoginOtp: (data) => api.post("/api/auth/send-login-otp", data),

  verifyLoginOtp: (data) => api.post("/api/auth/verify-login-otp", data),

  logout: () => api.post("/api/auth/user-logout"),

  getUser: () => api.get("/api/user/profile"),

  sendResetOtp: (data) => api.post("/api/auth/forgot-password/send-otp", data),

  verifyResetOtp: (data) =>
    api.post("/api/auth/forgot-password/verify-otp", data),

  resetPassword: (data) => api.post("/api/auth/forgot-password/reset", data),
};

export const adminAuthService = {
  adminLogin: (data) => api.post("/api/auth/admin/login", data),

  adminLogout: () => api.post("/api/auth/admin/logout"),

  getAdmin: () => api.get("/api/admin/get-admin"),

  sendResetOtp: (data) =>
    api.post("/api/auth/admin/forgot-password/send-otp", data),

  verifyResetOtp: (data) =>
    api.post("/api/auth/admin/forgot-password/verify-otp", data),

  resetPassword: (data) =>
    api.post("/api/auth/admin/forgot-password/reset-password", data),
};
