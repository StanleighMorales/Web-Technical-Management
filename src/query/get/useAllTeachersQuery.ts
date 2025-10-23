import { queryOptions } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const AllTeachers = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const END_POINT = "/api/v1/users";

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Error fetching teachers");
  return data.data;
};

export const useAllTeachersQuery = () => {
  return queryOptions({
    queryKey: ["teachers"],
    queryFn: AllTeachers,
  });
};
