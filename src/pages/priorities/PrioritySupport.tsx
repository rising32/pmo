import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { attachThumbnail, backThumbnail, downThumbnail, locationThumbnail, moreThumbnail } from '../../assets/images';
import AnimatedDropView from '../../components/common/AnimatedDropView';
import MainResponsive from '../../containers/main/MainResponsive';
import { getUserAll } from '../../lib/api';
import { useAuth } from '../../lib/context/AuthProvider';
import useRequest from '../../lib/hooks/useRequest';
import { UserState } from '../../modules/user';

function PrioritySupport(): JSX.Element {
  const [users, setUsers] = useState<UserState[]>([]);
  const [selectedUser, setSelecteduser] = useState<UserState | null>(null);
  const [value, setValue] = React.useState('');
  const [hasFocus, setFocus] = useState(false);
  const mailtoRef = useRef<HTMLInputElement>(null);

  const { account } = useAuth();
  const navigate = useNavigate();
  const [_getUserAll, , getUserAllRes] = useRequest(getUserAll);

  React.useEffect(() => {
    _getUserAll();
  }, []);
  React.useEffect(() => {
    if (getUserAllRes) {
      setUsers(getUserAllRes);
    }
  }, [getUserAllRes]);
  const handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };
  const filtered = !value ? users : users.filter(user => user.display_name.toLowerCase().includes(value.toLowerCase()));
  const onSelectUser = (user: UserState) => {
    setFocus(false);
    setValue(user.display_name);
  };

  return (
    <MainResponsive>
      <div className='w-full flex flex-1 flex-col bg-white rounded-md divide-y divide-solid divide-dark-gray'>
        <div className='w-full flex flex-row justify-between items-center px-4 py-6'>
          <div className='flex items-center'>
            <img src={backThumbnail} className='h-4 w-auto' onClick={() => navigate(-1)} />
            <span className='text-xl font-bold capitalize ml-2 truncate'>Nouveau messsage...</span>
          </div>
          <div className='flex flex-row items-center justify-between'>
            <img src={attachThumbnail} className='h-3 w-auto' />
            <img src={locationThumbnail} className='h-4 w-auto mx-3' />
            <img src={moreThumbnail} className='h-5 w-auto' />
          </div>
        </div>
        <div className='flex flex-row px-4 pt-8 pb-4 text-xl font-bold items-center'>
          <div className='pr-2'>De</div>
          <div className='flex flex-1 relative items-center'>
            <input
              ref={mailtoRef}
              type='text'
              value={value}
              onChange={handleSearchChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              className='flex flex-1 outline-none'
            />
          </div>
          <img src={downThumbnail} className='h-4 w-auto' onClick={() => setFocus(true)} />
        </div>
        <AnimatedDropView show={hasFocus}>
          <div className='p-4 border-2 border-dark-gray max-h-60 overflow-scroll'>
            {filtered.map(user => (
              <div key={user.user_id} className='truncate flex flex-row' onClick={() => onSelectUser(user)}>
                <div className='text-rouge-blue pr-2' onClick={() => onSelectUser(user)}>
                  {user.display_name}
                </div>
                <div className='text-blue' onClick={() => onSelectUser(user)}>
                  {user.email}
                </div>
              </div>
            ))}
          </div>
        </AnimatedDropView>
        <div className='flex flex-row px-4 pt-8 pb-4 text-xl font-bold items-center'>
          <div className='pr-2'>A</div>
          <div className='flex flex-1 relative items-center'></div>
          <img src={downThumbnail} className='h-4 w-auto' onClick={() => setFocus(true)} />
        </div>
        <div className='flex flex-row px-4 pt-4 pb-1 text-xl font-bold'>
          <div className='pr-2'>Object</div>
        </div>
        <div className='flex flex-row px-4 pt-4 pb-1 text-xl font-bold'>
          <div className='pr-2'>Rédigez votre message</div>
        </div>
      </div>
    </MainResponsive>
  );
}

export default PrioritySupport;
