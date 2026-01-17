import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileCameraCapture({ onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { updateUser } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    if (!ready) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const image = canvas.toDataURL("image/png");

    updateUser({ profileImage: image });
    close();
  };

  const close = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#000",
          padding: "16px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "420px",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onCanPlay={() => setReady(true)}
          style={{ width: "100%", borderRadius: "8px" }}
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-secondary w-50" onClick={close}>
            Cancel
          </button>

          <button
            className="btn btn-primary w-50"
            onClick={capture}
            disabled={!ready}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
