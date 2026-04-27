import { useState } from 'react';
import { showToast } from './AppToast';

/**
 * Debug button to manually test SignalR notifications.
 * This simulates receiving a notification without needing to create an actual reservation.
 * Remove this in production.
 */
const SignalRTestButton = () => {
    const [loading, setLoading] = useState(false);

    const testNotification = async () => {
        setLoading(true);
        try {
            // Simulate a notification payload
            const mockNotification = {
                type: 'new_pending_request',
                lentItemId: '00000000-0000-0000-0000-000000000000',
                itemName: 'Test Item',
                borrowerName: 'Test Student',
                reservedFor: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                message: 'New request from Test Student for \'Test Item\'',
                timestamp: new Date().toISOString()
            };

            console.log('[SignalRTestButton] Simulating notification:', mockNotification);

            // Show the toast notification
            showToast.info(
                '🔔 New Pending Request (TEST)',
                `${mockNotification.message} — Pickup: ${new Date(mockNotification.reservedFor).toLocaleString()}`,
                {
                    autoClose: 10000,
                    onClick: () => { window.location.href = '/home/pending-reservations'; },
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            // Play alert sound
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
            } catch (err) {
                console.error('[SignalRTestButton] Failed to play sound:', err);
            }

            showToast.success('Test Complete', 'If you saw a notification and heard beeps, the system is working!');
        } catch (error) {
            console.error('[SignalRTestButton] Test failed:', error);
            showToast.error('Test Failed', 'Check console for details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={testNotification}
            disabled={loading}
            className="fixed bottom-20 right-4 z-80 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Testing...' : '🔔 Test Notification'}
        </button>
    );
};

export default SignalRTestButton;
