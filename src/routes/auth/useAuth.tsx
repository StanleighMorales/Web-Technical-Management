import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/token";

const getAccessTokenKey = () => import.meta.env.VITE_ACCESS_TOKEN_KEY;

const getRefreshAccessToken = async (): Promise<string | null> => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = "/auth/refresh-token";

    if (!BASE_URL) {
      console.error("Refresh token URL not found");
      return null;
    }

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(data?.message || "Failed to refresh token");
      return null;
    }

    return data.data ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const useAuth = () => {
  const key = getAccessTokenKey();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(() => getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));

  useEffect(() => {
    const refresh = async () => {
      // Token already present — nothing to do
      if (token) {
        setLoading(false);
        return;
      }

      // No token in cookie — try a silent refresh using the HttpOnly refresh-token cookie
      const newToken = await getRefreshAccessToken();

      if (!newToken) {
        // Refresh token is also gone or expired — user must log in again
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      Cookies.set(key, newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      setLoading(false);
    };

    refresh();
  }, [token, key]);

  return { token, isAuthenticated, loading };
};
