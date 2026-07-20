import { useEffect, useRef, useState } from "react";
import logoVideo from "../assets/logovideo.mp4";

const VideoIntro = () => {
  const videoRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only play once per browser session
    if (sessionStorage.getItem("introPlayed")) {
      setDone(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const startFade = () => {
      // Fade out over 800ms
      setOpacity(0);
      setTimeout(() => {
        sessionStorage.setItem("introPlayed", "true");
        setDone(true);
      }, 850);
    };

    video.addEventListener("ended", startFade);

    // Fallback: if video doesn't end within 8s, force fade
    const fallback = setTimeout(startFade, 8000);

    return () => {
      video.removeEventListener("ended", startFade);
      clearTimeout(fallback);
    };
  }, []);

  if (done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0C0C0D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transition: "opacity 850ms cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <style>{`
        .htc-intro-video::-webkit-media-controls { display: none !important; }
        .htc-intro-video::-webkit-media-controls-enclosure { display: none !important; }
        .htc-intro-video::-webkit-media-controls-panel { display: none !important; }
      `}</style>
      <video
        ref={videoRef}
        src={logoVideo}
        autoPlay
        muted
        playsInline
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        className="htc-intro-video"
        style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
      />
    </div>
  );
};

export default VideoIntro;
