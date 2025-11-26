import { useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Notification types from backend
 */
interface NewPendingRequestNotification {
    type: 'new_pending_request';
    lentItemId: string;
    itemName: string;
    borrowerName: string;
    reservedFor?: string;
    message: string;
    timestamp: string;
}

interface ApprovalNotification {
    type: 'approval';
    lentItemId: string;
    itemName: string;
    borrowerName: string;
    message: string;
    timestamp: string;
}

interface StatusChangeNotification {
    type: 'status_change';
    lentItemId: string;
    itemName: string;
    oldStatus: string;
    newStatus: string;
    message: string;
    timestamp: string;
}

/**
 * Component that listens for admin/staff notifications
 * Should be mounted when user is Admin or Staff
 */
const AdminNotificationListener = () => {
    const { subscribe, joinAdminStaffGroup, isReady } = useSignalR();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isReady) return;

        // Join admin/staff group to receive notifications
        joinAdminStaffGroup();

        // Listen for new pending requests
        const unsubscribeNewRequest = subscribe(
            'ReceiveNewPendingRequest',
            (notification: NewPendingRequestNotification) => {
                console.log('New pending request:', notification);

                // Show toast notification with orange theme
                toast.info(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#f97316',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>🔔</span>
                            New Pending Request
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>
                            {notification.message}
                        </p>
                        {notification.reservedFor && (
                            <small style={{ color: '#6b7280', fontSize: '12px' }}>
                                Reserved for: {new Date(notification.reservedFor).toLocaleString()}
                            </small>
                        )}
                    </div>,
                    {
                        autoClose: 8000,
                        onClick: () => {
                            window.location.href = '/home/pending-reservations';
                        },
                        style: {
                            background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)',
                            borderLeft: '5px solid #f97316',
                        },
                    }
                );

                // Invalidate queries to refresh the pending requests list
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
            }
        );

        // Listen for approval notifications (admin might want to see these too)
        const unsubscribeApproval = subscribe(
            'ReceiveApprovalNotification',
            (notification: ApprovalNotification) => {
                console.log('Approval notification:', notification);

                // Show toast for admins with orange theme
                toast.success(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#16a34a',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>✅</span>
                            Request Approved
                        </div>
                        <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                            {notification.message}
                        </p>
                    </div>,
                    {
                        autoClose: 6000,
                        style: {
                            background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)',
                            borderLeft: '5px solid #16a34a',
                        },
                    }
                );

                // Refresh data
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        // Listen for status changes
        const unsubscribeStatusChange = subscribe(
            'ReceiveStatusChangeNotification',
            (notification: StatusChangeNotification) => {
                console.log('Status change:', notification);

                // Show toast for important status changes
                if (notification.newStatus === 'Returned' || notification.newStatus === 'Borrowed') {
                    const emoji = notification.newStatus === 'Returned' ? '↩️' : '📦';
                    const color = notification.newStatus === 'Returned' ? '#2563eb' : '#f97316';

                    toast.info(
                        <div style={{ color: '#1f2937' }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: color,
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '20px' }}>{emoji}</span>
                                Status Changed
                            </div>
                            <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                                {notification.message}
                            </p>
                        </div>,
                        {
                            autoClose: 6000,
                            style: {
                                background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)',
                                borderLeft: `5px solid ${color}`,
                            },
                        }
                    );
                }

                // Refresh data
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeNewRequest();
            unsubscribeApproval();
            unsubscribeStatusChange();
        };
    }, [isReady, subscribe, joinAdminStaffGroup, queryClient]);

    // This is a listener component, it doesn't render anything
    return null;
};

export default AdminNotificationListener;
