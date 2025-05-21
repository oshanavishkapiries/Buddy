import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCookie,
  deleteCookie,
  getCookie,
  getCookiesProvider,
  updateCookie,
} from "../services/cookie.service";
import { toast } from "sonner";

export const useCreateCookie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCookie,
    onSuccess: (_, variables) => {
      toast.success("Cookie created successfully");
      queryClient.invalidateQueries({
        queryKey: ["cookies", variables.provider],
      });
      queryClient.invalidateQueries({ queryKey: ["cookies-provider"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useGetCookie = (provider: string) => {
  return useQuery({
    queryKey: ["cookies", provider],
    queryFn: () => getCookie({ provider: provider }),
  });
};

export const useUpdateCookie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCookie,
    onSuccess: (_, variables) => {
      toast.success("Cookie updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["cookies", variables.provider],
      });
      queryClient.invalidateQueries({ queryKey: ["cookies-provider"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteCookie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCookie,
    onSuccess: (_, variables) => {
      toast.success("Cookie deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["cookies", variables.provider],
      });
      queryClient.invalidateQueries({ queryKey: ["cookies-provider"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useGetCookiesProvider = () => {
  return useQuery({
    queryKey: ["cookies-provider"],
    queryFn: getCookiesProvider,
  });
};
