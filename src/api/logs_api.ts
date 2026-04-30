import { api } from "./axios";


export const activityLogsApi = async () => {
    const response = await api.get("/activity-logs");
    return response.data;
};

export const borrowLogsApi = async () => {
    const response = await api.get("/activity-logs/borrow-logs");
    return response.data;
};

export const activityLogByIdApi = async (id: string) => {
    const response = await api.get(`/activity-logs/${id}`);
    return response.data;
};