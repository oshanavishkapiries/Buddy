export interface RegisterUserData {
  email: string;
  password: string;
  reset_password_Q: string;
  reset_password_A: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  email?: string;
  reset_password_Q?: string;
  reset_password_A?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  email: string;
  reset_password_Q: string;
  reset_password_A: string;
  newPassword: string;
}
