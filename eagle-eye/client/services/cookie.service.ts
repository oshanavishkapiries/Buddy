import { CreateCookieRequest, DeleteCookieRequest, GetCookieRequest, UpdateCookieRequest } from "@/types/cookie-api-type";
import axiosClient from "./axios.client";

export const createCookie = async (data: CreateCookieRequest) => {
  const response = await axiosClient.post("/api/cookies/create", data);
  return response.data;
};

export const updateCookie = async (data: UpdateCookieRequest) => {
  const response = await axiosClient.put("/api/cookies/update", data);
  return response.data;
};

export const getCookie = async (data: GetCookieRequest) => {
  const response = await axiosClient.get("/api/cookies/get", { params: data });
  return response.data;
};

export const deleteCookie = async (data: DeleteCookieRequest) => {
  const response = await axiosClient.delete("/api/cookies/delete", { params: data });
  return response.data;
};
