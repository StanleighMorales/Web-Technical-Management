import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const viewBorrowItem = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/lentItems`;

  const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (res.status === 401) {
    removeToken();
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.errors || "Failed to fetch");
  return data;
}

export const useViewBorrowItemCredentials = (id: string) => {
  return queryOptions({
    queryKey: ["lentItems", id],
    queryFn: () => viewBorrowItem(id)
  });
}
