import { api } from "./axios";


export const activityLogsApi = async () => {
    const response = await api.get("/activity-logs");
    return response.data;
};