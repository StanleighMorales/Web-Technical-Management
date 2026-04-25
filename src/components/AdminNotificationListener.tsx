import { useEffect, useState } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import ReservationDueSoonDialog, {
    type ReservationDueSoonNotification,
} from './ReservationDueSoonDialog';

// ── Notification payload types ────────────────────────────────────────────────

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

interface ReservationDueSoonSignalRNotification {
    type: 'reservation_due_soon';
    lentItemId: string;
    itemName: string;
    borrowerName: string;
    borrowerRole?: string;
    guestImageUrl?: string | null;
    frontStudentIdPictureUrl?: string | null;
    reservedFor: string;
    message: string;
    timestamp: string;
}

// ── Audio alert — three ascending beeps via Web Audio API ────────────────────
function playAlertSound() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const beep = (t: number, freq: number, dur: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
            osc.start(t);
            osc.stop(t + dur);
        };
        beep(ctx.currentTime, 880, 0.18);
        beep(ctx.currentTime + 0.22, 1046, 0.18);
        beep(ctx.currentTime + 0.44, 1318, 0.28);
    } catch { /* ignore */ }
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Mounts once in the Home layout for Admin/Staff users.
 *
 * Initialization order (critical):
 *   1. Register all SignalR event handlers via subscribe() — queued in the
 *      service's pendingHandlers list before the connection exists.
 *   2. Call connect() — starts the connection and replays queued handlers.
 *   3. Call joinAdminStaffGroup() — join the group so events start flowing.
 */
const AdminNotificationListener = () => {
    const { connect, subscribe, joinAdminStaffGroup } = useSignalR();
    const queryClient = useQueryClient();
    const [dueSoonAlerts, setDueSoonAlerts] = useState<ReservationDueSoonNotification[]>([]);

    const pushDueSoonAlert = (n: ReservationDueSoonNotification) => {
        playAlertSound();
        setDueSoonAlerts((prev) => {
            if (prev.some((a) => a.lentItemId === n.lentItemId)) return prev;
            return [...prev, n];
        });
    };

    useEffect(() => {
        // Step 1: Register all handlers BEFORE connecting so none are missed
        const unsubNewRequest = subscribe('ReceiveNewPendingRequest',
            (n: NewPendingRequestNotification) => {
                toast.info(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#f97316', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🔔</span> New Pending Request
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>{n.message}</p>
                        {n.reservedFor && (
                            <small style={{ color: '#6b7280', fontSize: '12px' }}>
                                Scheduled pickup: {new Date(n.reservedFor).toLocaleString()}
                            </small>
                        )}
                    </div>,
                    { autoClose: 8000, onClick: () => { window.location.href = '/home/pending-reservations'; }, style: { background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)', borderLeft: '5px solid #f97316' } }
                );
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        const unsubApproval = subscribe('ReceiveApprovalNotification',
            (n: ApprovalNotification) => {
                toast.success(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>✅</span> Reservation Approved
                        </div>
                        <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>{n.message}</p>
                    </div>,
                    { autoClose: 6000, style: { background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderLeft: '5px solid #16a34a' } }
                );
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        const unsubStatusChange = subscribe('ReceiveStatusChangeNotification',
            (n: StatusChangeNotification) => {
                if (n.newStatus === 'Returned' || n.newStatus === 'Borrowed') {
                    const emoji = n.newStatus === 'Returned' ? '↩️' : '📦';
                    const color = n.newStatus === 'Returned' ? '#2563eb' : '#f97316';
                    toast.info(
                        <div style={{ color: '#1f2937' }}>
                            <div style={{ fontSize: '16px', fontWeight: '700', color, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{emoji}</span> Item {n.newStatus}
                            </div>
                            <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>{n.message}</p>
                        </div>,
                        { autoClose: 6000, style: { background: 'linear-gradient(135deg, #fff5ed 0%, #ffedd5 100%)', borderLeft: `5px solid ${color}` } }
                    );
                }
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
            }
        );

        const unsubExpired = subscribe('ReceiveReservationExpired',
            (n: ReservationExpiredNotification) => {
                toast.warning(
                    <div style={{ color: '#1f2937' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#b45309', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>⏰</span> Reservation Expired
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>
                            <strong>{n.borrowerName}</strong>'s reservation for <strong>{n.itemName}</strong> has expired.
                        </p>
                        <small style={{ color: '#6b7280', fontSize: '12px' }}>Was scheduled: {new Date(n.reservedFor).toLocaleString()}</small>
                    </div>,
                    { autoClose: 10000, onClick: () => { window.location.href = '/home/pending-reservations'; }, style: { background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', borderLeft: '5px solid #f59e0b' } }
                );
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
            }
        );

        const unsubDueSoon = subscribe('ReceiveReservationDueSoon',
            (n: ReservationDueSoonSignalRNotification) => {
                pushDueSoonAlert({
                    lentItemId:               n.lentItemId,
                    itemName:                 n.itemName,
                    borrowerName:             n.borrowerName,
                    borrowerRole:             n.borrowerRole,
                    guestImageUrl:            n.guestImageUrl,
                    frontStudentIdPictureUrl: n.frontStudentIdPictureUrl,
                    reservedFor:              n.reservedFor,
                    message:                  n.message,
                });
            }
        );

        // Step 2: Connect → Step 3: Join group
        connect()
            .then(() => joinAdminStaffGroup())
            .catch((err) => console.error('[SignalR] Setup failed:', err));

        return () => {
            unsubNewRequest();
            unsubApproval();
            unsubStatusChange();
            unsubExpired();
            unsubDueSoon();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ReservationDueSoonDialog
            notifications={dueSoonAlerts}
            onDismiss={(id) => setDueSoonAlerts((prev) => prev.filter((a) => a.lentItemId !== id))}
            onDismissAll={() => setDueSoonAlerts([])}
        />
    );
};

export default AdminNotificationListener;
