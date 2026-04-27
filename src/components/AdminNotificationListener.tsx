import { useEffect, useState } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { showToast } from './AppToast';
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
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
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
                // Play alert sound for new pending requests
                playAlertSound();
                
                showToast.info(
                    '🔔 New Pending Request',
                    n.reservedFor
                        ? `${n.message} — Pickup: ${new Date(n.reservedFor).toLocaleString()}`
                        : n.message,
                    {
                        autoClose: 10000,
                        onClick: () => { window.location.href = '/home/pending-reservations'; },
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    },
                );
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        const unsubApproval = subscribe('ReceiveApprovalNotification',
            (n: ApprovalNotification) => {
                showToast.success('Reservation Approved', n.message, { autoClose: 6000 });
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
            }
        );

        const unsubStatusChange = subscribe('ReceiveStatusChangeNotification',
            (n: StatusChangeNotification) => {
                // Only show notification for "Borrowed" status changes
                // "Returned" notifications are redundant since the user action already shows a success toast
                if (n.newStatus === 'Borrowed') {
                    showToast.info(`Item ${n.newStatus}`, n.message, { autoClose: 6000 });
                }
                queryClient.invalidateQueries({ queryKey: ['lentItems'] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
            }
        );

        const unsubExpired = subscribe('ReceiveReservationExpired',
            (n: ReservationExpiredNotification) => {
                showToast.warning(
                    'Reservation Expired',
                    `${n.borrowerName}'s reservation for ${n.itemName} has expired. Was scheduled: ${new Date(n.reservedFor).toLocaleString()}`,
                    {
                        autoClose: 10000,
                        onClick: () => { window.location.href = '/home/pending-reservations'; },
                    },
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
