import * as signalR from '@microsoft/signalr';

/**
 * SignalR Service — singleton managing the hub connection.
 *
 * Key guarantees:
 * - connect() is idempotent: calling it while already connected is a no-op.
 * - on() queues handlers registered before the connection is ready and
 *   replays them once connected, so callers never miss events due to timing.
 * - The singleton is never torn down on component unmount — it lives for the
 *   full browser session and is shared across all components.
 */
class SignalRService {
    private connection: signalR.HubConnection | null = null;

    // Handlers registered before the connection was ready — replayed on connect
    private pendingHandlers: Array<{ event: string; cb: (data: any) => void }> = [];

    async connect(token: string): Promise<void> {
        // Extract base URL from API URL (remove /api/v1 suffix)
        const apiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278')
            .replace(/\/api\/v\d+\/?$/, '')
            .replace(/\/$/, '');

        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}/notificationHub`, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.connection.onreconnecting((error) => {
            console.warn('[SignalR] Reconnecting...', error);
        });

        this.connection.onreconnected(() => {
            // Reconnected successfully
        });

        this.connection.onclose((error) => {
            if (error) console.error('[SignalR] Connection closed with error:', error);
        });

        try {
            await this.connection.start();
        } catch (error) {
            console.error('[SignalR] Connection failed:', error);
            throw error;
        }

        // Replay any handlers that were registered before the connection was ready
        for (const { event, cb } of this.pendingHandlers) {
            this.connection.on(event, cb);
        }
        this.pendingHandlers = [];
    }

    async joinAdminStaffGroup(): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }
        await this.connection.invoke('JoinAdminStaffGroup');
    }

    async leaveAdminStaffGroup(): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.invoke('LeaveAdminStaffGroup');
        } catch { /* ignore */ }
    }

    async joinUserGroup(userId: string): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }
        await this.connection.invoke('JoinUserGroup', userId);
    }

    async leaveUserGroup(userId: string): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.invoke('LeaveUserGroup', userId);
        } catch { /* ignore */ }
    }

    on(eventName: string, callback: (data: any) => void): void {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            // Connection already exists - register immediately
            this.connection.on(eventName, callback);
        } else if (this.connection) {
            // Connection exists but not connected yet - register anyway and queue as backup
            this.connection.on(eventName, callback);
            this.pendingHandlers.push({ event: eventName, cb: callback });
        } else {
            // No connection yet - queue for replay once connected
            this.pendingHandlers.push({ event: eventName, cb: callback });
        }
    }

    off(eventName: string, callback?: (data: any) => void): void {
        if (!this.connection) return;
        if (callback) {
            this.connection.off(eventName, callback);
            // Also remove from pending queue if it was never replayed
            this.pendingHandlers = this.pendingHandlers.filter(
                (h) => !(h.event === eventName && h.cb === callback)
            );
        } else {
            this.connection.off(eventName);
            this.pendingHandlers = this.pendingHandlers.filter((h) => h.event !== eventName);
        }
    }

    async disconnect(): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.stop();
            this.pendingHandlers = [];
        } catch (error) {
            console.error('[SignalR] Error disconnecting:', error);
        }
    }

    getState(): signalR.HubConnectionState | null {
        return this.connection?.state ?? null;
    }

    isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

export const signalRService = new SignalRService();
