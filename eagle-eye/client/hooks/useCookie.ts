import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCookie,
  deleteCookie,
  getCookie,
  updateCookie,
} from "../services/cookie.service";
import { toast } from "sonner";

export const useCreateCookie = (setOpen: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCookie,
    onSuccess: () => {
      toast.success("Cookie created successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cookies"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useGetCookie = (provider: string) => {
  return useQuery({
    queryKey: ["cookies"],
    queryFn: () => getCookie({ provider: provider }),
  });
};

export const useUpdateCookie = (setOpen: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCookie,
    onSuccess: () => {
      toast.success("Cookie updated successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cookies"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteCookie = (setOpen: (open: boolean) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCookie,
    onSuccess: () => {
      toast.success("Cookie deleted successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cookies"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
