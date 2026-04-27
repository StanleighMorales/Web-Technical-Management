import { useEffect, useState } from 'react';
import { signalRService } from '../services/signalrService';
import * as signalR from '@microsoft/signalr';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Debug component to show SignalR connection status.
 * Toggleable to avoid blocking UI elements.
 */
const SignalRStatus = () => {
    const [state, setState] = useState<signalR.HubConnectionState | null>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentState = signalRService.getState();
            setState(currentState);
            
            // Access the connection property via type assertion
            const connection = (signalRService as any).connection;
            if (connection) {
                setConnectionId(connection.connectionId || null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        switch (state) {
            case signalR.HubConnectionState.Connected:
                return 'bg-green-500';
            case signalR.HubConnectionState.Connecting:
            case signalR.HubConnectionState.Reconnecting:
                return 'bg-yellow-500';
            case signalR.HubConnectionState.Disconnected:
            case signalR.HubConnectionState.Disconnecting:
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (state) {
            case signalR.HubConnectionState.Connected:
                return 'Connected';
            case signalR.HubConnectionState.Connecting:
                return 'Connecting...';
            case signalR.HubConnectionState.Reconnecting:
                return 'Reconnecting...';
            case signalR.HubConnectionState.Disconnected:
                return 'Disconnected';
            case signalR.HubConnectionState.Disconnecting:
                return 'Disconnecting...';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-80 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <div>
                    <div className="font-semibold">SignalR: {getStatusText()}</div>
                    {connectionId && (
                        <div className="px-3 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                            ID: {connectionId.substring(0, 8)}...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignalRStatus;
