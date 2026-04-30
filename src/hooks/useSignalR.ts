import { useCallback } from 'react';
import { signalRService } from '../services/signalrService';
import { getToken } from '../utils/token';

/**
 * Thin hook over the SignalRService singleton.
 *
 * connect() is called by AdminNotificationListener directly after registering
 * all handlers, so the service can replay any queued handlers immediately.
 * This hook just exposes the service methods as stable callbacks.
 */
export const useSignalR = () => {
    const token = getToken();

    const connect = useCallback(async () => {
        if (!token) {
            console.warn('[useSignalR] No token — skipping connect');
            return;
        }
        await signalRService.connect(token);
    }, [token]);

    const subscribe = useCallback(
        (eventName: string, callback: (data: any) => void): (() => void) => {
            signalRService.on(eventName, callback);
            return () => signalRService.off(eventName, callback);
        },
        []
    );

    const joinAdminStaffGroup = useCallback(async () => {
        await signalRService.joinAdminStaffGroup();
    }, []);

    const joinUserGroup = useCallback(async (userId: string) => {
        await signalRService.joinUserGroup(userId);
    }, []);

    const leaveAdminStaffGroup = useCallback(async () => {
        await signalRService.leaveAdminStaffGroup();
    }, []);

    const leaveUserGroup = useCallback(async (userId: string) => {
        await signalRService.leaveUserGroup(userId);
    }, []);

    return {
        connect,
        subscribe,
        joinAdminStaffGroup,
        leaveAdminStaffGroup,
        joinUserGroup,
        leaveUserGroup,
        isConnected: signalRService.isConnected(),
    };
};
