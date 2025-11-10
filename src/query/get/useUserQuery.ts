import { getToken, removeToken } from "../../utils/token";
import { queryOptions } from "@tanstack/react-query";

const fetchUserData = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/auth/me`;

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (res.status === 401) {
    removeToken();
    return;
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "User not found");
  }
  return data.data;
};

export const useUserQuery = () => {
  return queryOptions({
    queryKey: ["me"],
    queryFn: fetchUserData,
  });
};
