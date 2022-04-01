import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { agendaThumbnail, menuThumbnail, searchThumbnail } from '../../assets/images';
import AgendaCalendar from '../../components/priority/AgendaCalendar';
import MainResponsive from '../../containers/main/MainResponsive';
import { accountState, AccountState } from '../../modules/user';
import { Camera, CameraType } from 'react-camera-pro';
import { useUserMedia } from '../../lib/hooks/useUserMedia';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' },
};
function DeliverablesPicture(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useUserMedia();

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }

  return (
    <MainResponsive>
      <div className='w-full flex flex-col justify-between items-center bg-white rounded-md py-3 px-4'>
        <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
      </div>
    </MainResponsive>
  );
}

export default DeliverablesPicture;
