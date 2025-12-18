import { useMutation } from "@tanstack/react-query";
import { logoutUserApi } from "../../api/auth_api";

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUserApi,
    mutationKey: ["logout"],
  });
};
