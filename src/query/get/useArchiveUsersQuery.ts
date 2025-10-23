import { queryOptions } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const ArchivesUsers = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = "/api/ArchiveUsers";

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Archives Data not found");
    }
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const useArchivesUsersQuery = () => {
  return queryOptions({
    queryKey: ["ArchiveUsers"],
    queryFn: ArchivesUsers,
  });
};
