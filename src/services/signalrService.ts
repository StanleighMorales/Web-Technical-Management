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
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('[SignalR] Already connected, connectionId:', this.connection.connectionId);
            return;
        }

        // Strip /api/v1 suffix — hub is at root
        const apiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278')
            .replace(/\/api\/v\d+\/?$/, '')
            .replace(/\/$/, '');

        console.log(`[SignalR] Connecting to ${apiUrl}/notificationHub with token:`, token ? 'present' : 'missing');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}/notificationHub`, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information) // Changed from Warning to Information for better debugging
            .build();

        this.connection.onreconnecting((error) => {
            console.warn('[SignalR] Reconnecting...', error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log('[SignalR] Reconnected:', connectionId);
        });

        this.connection.onclose((error) => {
            if (error) console.error('[SignalR] Connection closed with error:', error);
            else console.log('[SignalR] Connection closed cleanly');
        });

        try {
            await this.connection.start();
            console.log('[SignalR] Connected successfully, connectionId:', this.connection.connectionId);
        } catch (error) {
            console.error('[SignalR] Failed to connect:', error);
            throw error;
        }

        // Replay any handlers that were registered before the connection was ready
        for (const { event, cb } of this.pendingHandlers) {
            console.log(`[SignalR] Replaying pending handler for "${event}"`);
            this.connection.on(event, cb);
        }
        this.pendingHandlers = [];
    }

    async joinAdminStaffGroup(): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.warn('[SignalR] Cannot join admin_staff — not connected');
            return;
        }
        await this.connection.invoke('JoinAdminStaffGroup');
        console.log('[SignalR] Joined admin_staff group');
    }

    async leaveAdminStaffGroup(): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.invoke('LeaveAdminStaffGroup');
        } catch { /* ignore */ }
    }

    async joinUserGroup(userId: string): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.warn('[SignalR] Cannot join user group — not connected');
            return;
        }
        await this.connection.invoke('JoinUserGroup', userId);
        console.log(`[SignalR] Joined user group: user_${userId}`);
    }

    async leaveUserGroup(userId: string): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.invoke('LeaveUserGroup', userId);
        } catch { /* ignore */ }
    }

    on(eventName: string, callback: (data: any) => void): void {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            this.connection.on(eventName, callback);
            console.log(`[SignalR] Registered handler for "${eventName}"`);
        } else {
            // Queue for replay once connected
            this.pendingHandlers.push({ event: eventName, cb: callback });
            console.log(`[SignalR] Queued handler for "${eventName}" (not yet connected)`);
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
            console.log('[SignalR] Disconnected');
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
