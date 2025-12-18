import { useMutation } from "@tanstack/react-query";
import { LoginUserApi } from "../../api/auth_api";

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
