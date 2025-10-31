import { getToken } from "../../utils/token";
import { queryOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
