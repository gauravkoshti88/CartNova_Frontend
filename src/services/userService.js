import api from "./api";

export const userService = {
  // UPDATE PROFILE
  updateProfile: (formData) => {
    return api.put("/api/user/update-profile", formData);
  },
};
