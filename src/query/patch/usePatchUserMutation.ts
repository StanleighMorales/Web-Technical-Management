import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type PathUserCredentials = {
  username: string,
  email: string,
  phoneNumber: string,
  lastName: string,
  middleName: string,
  firstName: string,
  position: string
}

type PatchUserProps = {
  id: string;
  formData: PathUserCredentials
}

const PatchUser = async ({ id, formData }: PatchUserProps) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/users/admin-or-staff/profile`;

  const updatedUser = JSON.stringify(formData);
  const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: updatedUser
  });

  if (res.status === 401) {
    removeToken();
    return;
  }

  const data = await res.text()
  if (!res.ok) throw new Error(data)
  return data;

}
export const usePatchUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["admin-or-staff"],
    mutationFn: PatchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      queryClient.invalidateQueries({queryKey: ["users"]})
    }
  })
}
