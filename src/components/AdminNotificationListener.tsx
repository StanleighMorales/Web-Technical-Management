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

interface ReservationExpiredNotification {
    type: 'reservation_expired';
    lentItemId: string;
    itemName: string;
    borrowerName: string;
    reservedFor: string;
    message: string;
    timestamp: string;
}

/**
 * Component that listens for admin/staff notifications via SignalR.
 * Mounted once in Home layout for Admin/Staff users only.
 */
const AdminNotificationListener = () => {
    const { subscribe, joinAdminStaffGroup, isReady } = useSignalR();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isReady) return;

        // Join admin/staff group to receive notifications
        joinAdminStaffGroup();

        // ── New pending request ────────────────────────────────────────────
        const unsubscribeNewRequest = subscribe(
            'ReceiveNewPendingRequest',
            (notification: NewPendingRequestNotification) => {
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
                                Scheduled pickup: {new Date(notification.reservedFor).toLocaleString()}
                            </small>
                        )}
                    </div>,
                    {
                        autoClose: 8000,
                        onClick: () => { window.location.href = '/home/pending-reservations'; },
                        style: {
                            background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)',
                            borderLeft: '5px solid #f97316',
                        },
                    }
                );

                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        // ── Reservation approved ───────────────────────────────────────────
        const unsubscribeApproval = subscribe(
            'ReceiveApprovalNotification',
            (notification: ApprovalNotification) => {
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
                            Reservation Approved
                        </div>
                        <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                            {notification.message}
                        </p>
                    </div>,
                    {
                        autoClose: 6000,
                        style: {
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            borderLeft: '5px solid #16a34a',
                        },
                    }
                );

                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        // ── Status change (Returned / Borrowed) ───────────────────────────
        const unsubscribeStatusChange = subscribe(
            'ReceiveStatusChangeNotification',
            (notification: StatusChangeNotification) => {
                if (notification.newStatus === 'Returned' || notification.newStatus === 'Borrowed') {
                    const emoji = notification.newStatus === 'Returned' ? '↩️' : '📦';
                    const color = notification.newStatus === 'Returned' ? '#2563eb' : '#f97316';

                    toast.info(
                        <div style={{ color: '#1f2937' }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color,
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '20px' }}>{emoji}</span>
                                Item {notification.newStatus}
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

                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
            }
        );

        // ── Reservation expired ────────────────────────────────────────────
        const unsubscribeExpired = subscribe(
            'ReceiveReservationExpired',
            (notification: ReservationExpiredNotification) => {
                toast.warning(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#b45309',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>⏰</span>
                            Reservation Expired
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>
                            <strong>{notification.borrowerName}</strong>'s reservation for{' '}
                            <strong>{notification.itemName}</strong> has expired — item is now available.
                        </p>
                        <small style={{ color: '#6b7280', fontSize: '12px' }}>
                            Was scheduled: {new Date(notification.reservedFor).toLocaleString()}
                        </small>
                    </div>,
                    {
                        autoClose: 10000,
                        onClick: () => { window.location.href = '/home/pending-reservations'; },
                        style: {
                            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                            borderLeft: '5px solid #f59e0b',
                        },
                    }
                );

                // Refresh both lists so the expired item disappears from the Reservations tab
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
            }
        );

        return () => {
            unsubscribeNewRequest();
            unsubscribeApproval();
            unsubscribeStatusChange();
            unsubscribeExpired();
        };
    }, [isReady, subscribe, joinAdminStaffGroup, queryClient]);

    return null;
};

export default AdminNotificationListener;
