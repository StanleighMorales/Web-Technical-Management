import { api } from "./axios";
import type { TLoginUser } from "../types/types";
import { removeToken } from "../utils/token";

export const LoginUserApi = async (data: TLoginUser) => {
  try {
    const response = await api.post("/api/v1/auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errors = error.response.data.Errors;
      throw new Error(errors);
    } else {
      throw new Error(error.message);
    }
  }
};

export const logoutUserApi = async () => {
  const response = await api.post("/api/v1/auth/logout");
  removeToken();
  return response.data;
};
