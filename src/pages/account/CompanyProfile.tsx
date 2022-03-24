import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  dateTimeCurrencyThumbnail,
  organizationThumbnail,
  personGrayThumbnail,
  rightArrowThumbnail,
  teamMemberThumbnail,
  workSettingThumbnail,
} from '../../assets/images';

const CompanyProfile = () => {
  const navigate = useNavigate();
  return (
    <div className='items-center flex flex-col flex-1 p-4'>
      <div className='flex flex-row w-full h-12 px-4 items-center justify-between bg-light-gray'>
        <div className='text-sm text-rouge-blue font-normal'></div>
        <div className='text-lg text-rouge-blue font-bold'>Your account</div>
        <div className='text-sm text-rouge-blue font-normal'></div>
      </div>
      <div className='bg-white w-full mt-4'>
        <div className='w-full py-4'>
          <div className='text-lg text-black font-bold px-12 flex flex-row items-center justify-between'>
            <div className='text-lg text-black font-bold'>PROFILE</div>
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <img src={personGrayThumbnail} alt='Person' className='h-4 w-auto pr-4' />
            <div className='text-base text-black font-bold flex-1'>Loubeyre</div>
            <div className='text-base text-link font-normal flex-1'>jf.loubeyre@gmail.com</div>
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <img src={workSettingThumbnail} className='h-4 w-auto pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>Work Setting</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <div className='h-4 w-8 pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>Sign Out</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
        </div>
        <div className='w-full py-4'>
          <div className='text-lg text-black font-bold px-12 flex flex-row items-center justify-between'>
            <div className='text-lg text-black font-bold'>SETTINGS</div>
            {/* <img src={crayon} className='h-4 w-auto' /> */}
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <img src={dateTimeCurrencyThumbnail} className='h-4 w-auto pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>Date, time and currency</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <img src={organizationThumbnail} className='h-4 w-auto pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>Organization</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
          <div className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'>
            <div className='h-4 w-8 pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>Terms & Privacy</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
        </div>
        <div className='w-full py-4'>
          <div className='text-lg text-black font-bold px-12 flex flex-row items-center justify-between'>
            <div className='text-lg text-black font-bold'>MANAGE</div>
            {/* <img src={crayon} className='h-4 w-auto' /> */}
          </div>
          <div
            className='flex flex-row mx-1 my-2 px-4 py-2 rounded-md items-center justify-between bg-light-gray'
            onClick={() => navigate('/account/manage-team')}
          >
            <img src={teamMemberThumbnail} className='h-4 w-auto pr-4' />
            <div className='text-base text-black font-normal pr-3 flex-1'>2 Team member</div>
            <div className='flex-row flex items-center'>
              <img src={rightArrowThumbnail} className='h-4 w-auto' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
