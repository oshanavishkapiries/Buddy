import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  getUserProfile,
  loginUser,
  registerUser,
  resetPassword,
  updateUserProfile,
} from "@/services/user.service";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      Cookies.set("authToken", response.data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
