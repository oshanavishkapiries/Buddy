import {
  ChangePasswordData,
  LoginUserData,
  RegisterUserData,
  ResetPasswordData,
  UpdateProfileData,
} from "@/types/user-api-type";
import axiosClient from "./axios.client";

export const registerUser = async (userData: RegisterUserData) => {
  const response = await axiosClient.post("/api/users/register", userData);
  return response.data;
};

export const loginUser = async (userData: LoginUserData) => {
  const response = await axiosClient.post("/api/users/login", userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosClient.get("/api/users/profile");
  return response.data;
};

export const updateUserProfile = async (profileData: UpdateProfileData) => {
  const response = await axiosClient.put("/api/users/profile", profileData);
  return response.data;
};

export const changePassword = async (passwordData: ChangePasswordData) => {
  const response = await axiosClient.put(
    "/api/users/change-password",
    passwordData
  );
  return response.data;
};

export const resetPassword = async (resetData: ResetPasswordData) => {
  const response = await axiosClient.post(
    "/api/users/reset-password",
    resetData
  );
  return response.data;
};
