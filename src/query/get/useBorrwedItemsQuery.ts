import { queryOptions } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const BorrowItems = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/lentItems`;

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken}`,
    }
  });
  if (!res.ok) throw new Error("Failed to fetch item details");
  return res.json();
};

export const useBorrowedItemsQuery = () => {
  return queryOptions({
    queryKey: ["borrowed-items"],
    queryFn: BorrowItems,
  });
};
