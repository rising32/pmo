import { useState, useEffect } from 'react';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' },
};
export function useUserMedia() {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
        setMediaStream(stream);
      } catch (err) {
        // Removed for brevity
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      };
    }
  }, [mediaStream]);

  return mediaStream;
}
