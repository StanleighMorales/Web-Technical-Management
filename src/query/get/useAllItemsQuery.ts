import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const allItems = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/items`;

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
  if (!res.ok) throw new Error("Failed to fetch item details");
  return data.data;
};
export const useAllItemsQuery = () => {
  return queryOptions({
    queryKey: ["Item"],
    queryFn: allItems,
  });
};
