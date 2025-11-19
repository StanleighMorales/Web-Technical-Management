import { useMutation } from '@tanstack/react-query';
import { removeToken } from './../../utils/token/index';

const LogoutUser = async () => {
    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const VERSION = "v1";
        const END_POINT = `/api/${VERSION}/auth/logout`;

        const res = await fetch(`${BASE_URL}${END_POINT}`, {
            method: "POST",
            credentials: "include"
        });

        if (res.status === 401) {
            removeToken();
            return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Logout User Failed");

        removeToken();
        return data.message;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};


export const usePostLogoutUserMutation = () => {
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: LogoutUser
    });
}
