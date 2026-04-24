import * as signalR from '@microsoft/signalr';

/**
 * SignalR Service for real-time notifications
 * Manages connection to the backend NotificationHub
 */
class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();

    /**
     * Initialize and start the SignalR connection
     */
    async connect(token: string): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('Already connected to SignalR hub');
            return;
        }

        // Strip the /api/v1 path suffix — the hub is mounted at the root, not under the API prefix
        const apiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278')
            .replace(/\/api\/v\d+\/?$/, '')
            .replace(/\/$/, '');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}/notificationHub`, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Handle reconnection
        this.connection.onreconnecting((error) => {
            console.warn('SignalR reconnecting...', error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log('SignalR reconnected:', connectionId);
        });

        this.connection.onclose((error) => {
            console.error('SignalR connection closed:', error);
        });

        try {
            await this.connection.start();
            console.log('SignalR connected successfully');
        } catch (error) {
            console.error('Error connecting to SignalR:', error);
            throw error;
        }
    }

    /**
     * Join admin/staff group to receive pending request notifications
     */
    async joinAdminStaffGroup(): Promise<void> {
        if (!this.connection) {
            throw new Error('SignalR connection not initialized');
        }

        try {
            await this.connection.invoke('JoinAdminStaffGroup');
            console.log('Joined admin_staff group');
        } catch (error) {
            console.error('Error joining admin_staff group:', error);
        }
    }

    /**
     * Leave admin/staff group
     */
    async leaveAdminStaffGroup(): Promise<void> {
        if (!this.connection) return;

        try {
            await this.connection.invoke('LeaveAdminStaffGroup');
            console.log('Left admin_staff group');
        } catch (error) {
            console.error('Error leaving admin_staff group:', error);
        }
    }

    /**
     * Join a user-specific group to receive targeted notifications
     */
    async joinUserGroup(userId: string): Promise<void> {
        if (!this.connection) {
            throw new Error('SignalR connection not initialized');
        }

        try {
            await this.connection.invoke('JoinUserGroup', userId);
            console.log(`Joined user group: user_${userId}`);
        } catch (error) {
            console.error('Error joining user group:', error);
        }
    }

    /**
     * Leave a user-specific group
     */
    async leaveUserGroup(userId: string): Promise<void> {
        if (!this.connection) return;

        try {
            await this.connection.invoke('LeaveUserGroup', userId);
            console.log(`Left user group: user_${userId}`);
        } catch (error) {
            console.error('Error leaving user group:', error);
        }
    }

    /**
     * Listen to a specific event
     */
    on(eventName: string, callback: (data: any) => void): void {
        if (!this.connection) {
            console.warn('SignalR connection not initialized yet');
            return;
        }

        // Store listener for cleanup
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName)!.add(callback);

        // Register with SignalR
        this.connection.on(eventName, callback);
    }

    /**
     * Remove a specific event listener
     */
    off(eventName: string, callback?: (data: any) => void): void {
        if (!this.connection) return;

        if (callback) {
            this.connection.off(eventName, callback);
            this.listeners.get(eventName)?.delete(callback);
        } else {
            this.connection.off(eventName);
            this.listeners.delete(eventName);
        }
    }

    /**
     * Disconnect from the hub
     */
    async disconnect(): Promise<void> {
        if (!this.connection) return;

        try {
            await this.connection.stop();
            this.listeners.clear();
            console.log('SignalR disconnected');
        } catch (error) {
            console.error('Error disconnecting from SignalR:', error);
        }
    }

    /**
     * Get connection state
     */
    getState(): signalR.HubConnectionState | null {
        return this.connection?.state || null;
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

// Export singleton instance
export const signalRService = new SignalRService();
