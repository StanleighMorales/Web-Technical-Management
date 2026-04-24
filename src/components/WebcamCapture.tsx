import { useRef, useState, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (file: File | null) => void;
  capturedPreview: string | null;
}

interface CameraDevice {
  deviceId: string;
  label: string;
}

async function captureFrame(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement
): Promise<File> {
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  const ctx = canvasEl.getContext("2d")!;
  ctx.drawImage(videoEl, 0, 0);

  return new Promise((resolve, reject) => {
    canvasEl.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob returned null"));
          return;
        }
        resolve(new File([blob], "guest-photo.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
}

export const WebcamCapture = ({ onCapture, capturedPreview }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");

  // Assign stream to video element whenever it changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Stop stream on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  const startStream = async (deviceId?: string): Promise<MediaStream | null> => {
    setCamError(null);
    const videoConstraints: MediaTrackConstraints = deviceId
      ? { deviceId: { exact: deviceId } }
      : { facingMode: "user" }; // no deviceId = browser default camera

    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
      setStream(s);

      // After permission is granted labels become available — enumerate now
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Camera ${i + 1}` }));
      setCameras(videoDevices);

      // Track which camera is active
      const activeId = s.getVideoTracks()[0]?.getSettings().deviceId ?? "";
      setSelectedCameraId(activeId);

      return s;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setCamError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setCamError("No camera found on this device.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setCamError(
            "Camera is already in use by another application (e.g. OBS, Teams, Zoom). " +
            "Close that app or choose a different camera."
          );
        } else if (err.name === "OverconstrainedError") {
          setCamError("Selected camera is no longer available. Please choose another.");
        } else {
          setCamError(`Camera unavailable: ${err.message}`);
        }
      } else {
        setCamError("Camera unavailable.");
      }
      return null;
    }
  };

  // Auto-open the default camera when the component mounts
  useEffect(() => {
    startStream(); // no deviceId → browser picks the default
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch camera while stream is active
  const handleCameraChange = async (deviceId: string) => {
    setSelectedCameraId(deviceId);
    if (stream) {
      const newStream = await startStream(deviceId);
      if (newStream) {
        stream.getTracks().forEach((t) => t.stop());
      } else {
        // Revert to the currently active device on failure
        const activeId = stream.getVideoTracks()[0]?.getSettings().deviceId ?? "";
        setSelectedCameraId(activeId);
      }
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setCaptureError(null);
    try {
      const file = await captureFrame(videoRef.current, canvasRef.current);
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      onCapture(file);
    } catch {
      setCaptureError("Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = async () => {
    onCapture(null);
    setCaptureError(null);
    await startStream(selectedCameraId || undefined);
  };

  // ── Captured preview ──────────────────────────────────────────────────────
  if (capturedPreview) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-gray-700">Photo captured</p>
        <img
          src={capturedPreview}
          alt="Captured guest photo"
          className="w-64 h-48 object-cover rounded-lg shadow-md border border-gray-200"
        />
        <button
          type="button"
          onClick={handleRetake}
          className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Retake
        </button>
      </div>
    );
  }

  // ── Live viewfinder ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-600 text-center">
        Capture a photo of the guest for identification. A photo is required before proceeding.
      </p>

      {/* Camera selector — only shown once the stream is live and multiple cameras exist */}
      {stream && cameras.length > 1 && (
        <div className="w-full max-w-xs">
          <label htmlFor="camera-select" className="block text-xs font-medium text-gray-600 mb-1">
            Switch Camera
          </label>
          <select
            id="camera-select"
            value={selectedCameraId}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {cameras.map((cam) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Camera error */}
      {camError && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {camError}
          <button
            type="button"
            onClick={() => { setCamError(null); startStream(); }}
            className="ml-2 underline text-red-700 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Capture error */}
      {captureError && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {captureError}
        </div>
      )}

      {/* Loading state while camera is starting */}
      {!stream && !camError && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Starting camera…
        </div>
      )}

      {/* Video preview */}
      {stream && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 object-cover rounded-lg shadow-md border border-gray-200 bg-black"
          />
        </div>
      )}

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {stream && (
        <button
          type="button"
          onClick={handleCapture}
          disabled={isCapturing}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? "Capturing…" : "Capture Photo"}
        </button>
      )}
    </div>
  );
};
