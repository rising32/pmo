import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { agendaThumbnail, menuThumbnail, searchThumbnail } from '../../assets/images';
import AgendaCalendar from '../../components/priority/AgendaCalendar';
import MainResponsive from '../../containers/main/MainResponsive';
import { accountState, AccountState } from '../../modules/user';
import { Camera, CameraType } from 'react-camera-pro';

function DeliverablesPicture(): JSX.Element {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const camera = useRef<CameraType>(null);

  return (
    <MainResponsive>
      <div className='w-full flex flex-col justify-between items-center bg-white rounded-md py-3 px-4'>
        <div className='w-full h-52'>
          <Camera
            ref={camera}
            aspectRatio='cover'
            facingMode='environment'
            numberOfCamerasCallback={setNumberOfCameras}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.',
            }}
          />
        </div>
        {image && <img src={image} alt='Image preview' />}
        <button
          onClick={() => {
            if (camera.current) {
              const photo = camera.current.takePhoto();
              console.log(photo);
              setImage(photo);
            }
          }}
        >
          Capture
        </button>
        <button
          hidden={numberOfCameras <= 1}
          onClick={() => {
            if (camera.current) {
              const result = camera.current.switchCamera();
              console.log(result);
            }
          }}
        />
      </div>
    </MainResponsive>
  );
}

export default DeliverablesPicture;
