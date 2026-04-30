import { useQuery } from "@tanstack/react-query";
import { activityLogsApi, activityLogByIdApi, borrowLogsApi } from "../api/logs_api";


export const useActivityLogs = () => {
    return useQuery({
        queryKey: ["activity-logs"],
        queryFn: activityLogsApi,
    });
};

export const useBorrowLogs = () => {
    return useQuery({
        queryKey: ["borrow-logs"],
        queryFn: borrowLogsApi,
    });
};

export const useActivityLogById = (id: string) => {
    return useQuery({
        queryKey: ["activity-logs", id],
        queryFn: () => activityLogByIdApi(id),
        enabled: !!id,
    });
};
