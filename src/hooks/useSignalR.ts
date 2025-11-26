import { useEffect, useCallback, useState } from 'react';
import { signalRService } from '../services/signalrService';
import { getToken } from '../utils/token';

/**
 * React hook for SignalR real-time notifications
 * Automatically connects/disconnects based on authentication
 */
export const useSignalR = () => {
    const token = getToken();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!token) return;

        // Connect to SignalR hub
        signalRService
            .connect(token)
            .then(() => {
                setIsReady(true);
            })
            .catch((error) => {
                console.error('Failed to connect to SignalR:', error);
            });

        // Cleanup on unmount
        return () => {
            setIsReady(false);
            signalRService.disconnect();
        };
    }, [token]);

    /**
     * Subscribe to a SignalR event
     * Returns an unsubscribe function
     */
    const subscribe = useCallback(
        (eventName: string, callback: (data: any) => void) => {
            if (!isReady) {
                console.warn('SignalR not ready yet, subscription will be delayed');
                // Wait for connection to be ready
                const checkInterval = setInterval(() => {
                    if (signalRService.isConnected()) {
                        clearInterval(checkInterval);
                        signalRService.on(eventName, callback);
                    }
                }, 100);

                return () => {
                    clearInterval(checkInterval);
                    signalRService.off(eventName, callback);
                };
            }

            signalRService.on(eventName, callback);

            // Return unsubscribe function
            return () => signalRService.off(eventName, callback);
        },
        [isReady]
    );

    /**
     * Join admin/staff group
     */
    const joinAdminStaffGroup = useCallback(async () => {
        await signalRService.joinAdminStaffGroup();
    }, []);

    /**
     * Leave admin/staff group
     */
    const leaveAdminStaffGroup = useCallback(async () => {
        await signalRService.leaveAdminStaffGroup();
    }, []);

    /**
     * Join user-specific group
     */
    const joinUserGroup = useCallback(async (userId: string) => {
        await signalRService.joinUserGroup(userId);
    }, []);

    /**
     * Leave user-specific group
     */
    const leaveUserGroup = useCallback(async (userId: string) => {
        await signalRService.leaveUserGroup(userId);
    }, []);

    return {
        subscribe,
        joinAdminStaffGroup,
        leaveAdminStaffGroup,
        joinUserGroup,
        leaveUserGroup,
        isConnected: signalRService.isConnected(),
        isReady,
    };
};
