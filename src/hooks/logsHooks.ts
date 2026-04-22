import { useQuery } from "@tanstack/react-query";
import { activityLogsApi } from "../api/logs_api";


export const useActivityLogs = () => {
    return useQuery({
        queryKey: ["activity-logs"],
        queryFn: activityLogsApi,
    });
};