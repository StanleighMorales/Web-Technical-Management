import { queryOptions } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const AllStudents = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/users`;

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Error fetching students");
  return data.data;
};

export const useAllStudentsQuery = () => {
  return queryOptions({
    queryKey: ["students"],
    queryFn: AllStudents,
  });
};
