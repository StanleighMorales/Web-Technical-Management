import Cookies from "js-cookie";

export const getToken = (): string | undefined => {
    const key = import.meta.env.VITE_ACCESS_TOKEN_KEY;
    return Cookies.get(key);
};
export const removeToken = () => {
    const key = import.meta.env.VITE_ACCESS_TOKEN_KEY;
    return Cookies.remove(key);
};
