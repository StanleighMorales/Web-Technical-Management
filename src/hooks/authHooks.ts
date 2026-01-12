import { useMutation } from "@tanstack/react-query";
import { LoginUserApi, logoutUserApi } from "../api/auth_api";

export const useLogin = () => {
  return useMutation({
    mutationFn: LoginUserApi,
    mutationKey: ["login"],
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUserApi,
    mutationKey: ["logout"],
  });
};
