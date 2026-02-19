import { api } from "./axios";
import type { TLoginUser } from "../types/types";
import { removeToken } from "../utils/token";

export const LoginUserApi = async (data: TLoginUser) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const logoutUserApi = async () => {
  const response = await api.post("/auth/logout");
  if (response) {
    removeToken();
  }
  return response.data;
};
