import React from 'react';
import { rightArrowThumbnail } from '../../assets/images';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import { sendCreateClient, sendGetMyClients, sendRegisterMyClient, sendUpdateByClient } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import { ClientState } from '../../modules/client';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';

const ManageClients = () => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [created, setCreated] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ClientState | null>(null);
  const [dataList, getDataList] = React.useState<ClientState[]>([] as ClientState[]);
  const [name, setName] = React.useState<string | undefined>('');
  const [title, setTitle] = React.useState('Create Client');
  const { account } = useAuth();

  const [_sendCreateClient, creatingClient, createClientRes, , resetSendCreateClient] = useRequest(sendCreateClient);
  const [_sendRegisterMyClient, registeringMyClient, registerMyClientRes, , resetSendRegisterMyClient] = useRequest(sendRegisterMyClient);
  const [_sendGetMyClients, gettingMyClient, getMyClientsRes, , resetSendGetMyClients] = useRequest(sendGetMyClients);
  const [_sendUpdateByClient, updatingClient, updateMyClientsRes, , resetSendUpdateByClient] = useRequest(sendUpdateByClient);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetMyClients(user_id);
  }, []);
  React.useEffect(() => {
    if (getMyClientsRes) {
      getDataList(getMyClientsRes.clients);
    }
  }, [getMyClientsRes]);
  React.useEffect(() => {
    if (createClientRes) {
      const user_id = account?.user.user_id;
      const client_id = createClientRes.client_id;
      const is_active = createClientRes.is_active;
      _sendRegisterMyClient(user_id, client_id, is_active);
    }
  }, [createClientRes]);
  React.useEffect(() => {
    setIsEdit(false);
    if (registerMyClientRes) {
      const updateClient: ClientState = {
        client_id: registerMyClientRes.client_id,
        client_name: name || '',
        is_active: 1,
        client_address: null,
        client_detail: null,
      };
      const newDataList = dataList;
      newDataList.unshift(updateClient);
      getDataList(newDataList);
      toast.success('client created successfully');
    }
  }, [registerMyClientRes]);
  React.useEffect(() => {
    setIsEdit(false);
    if (updateMyClientsRes && name) {
      const updateClient: ClientState = {
        client_id: updateMyClientsRes.client_id,
        client_name: updateMyClientsRes.client_name,
        is_active: updateMyClientsRes.is_active,
        client_address: updateMyClientsRes.client_address,
        client_detail: updateMyClientsRes.client_detail,
      };
      const newDataList = dataList.map(item => {
        if (item.client_id === updateClient.client_id) {
          return updateClient;
        } else {
          return item;
        }
      });
      getDataList(newDataList);
      toast.success('client updated successfully');
    }
  }, [updateMyClientsRes]);

  const onCreateUpdateClient = () => {
    if (!name) {
      toast.error('client name is not null!');
      return;
    }
    if (created) {
      const client_name = name;
      const is_active = true;
      _sendCreateClient(client_name, is_active);
    } else if (selectedItem) {
      const updateClient: ClientState = {
        client_id: selectedItem?.client_id,
        client_name: name,
        is_active: selectedItem?.is_active,
        client_address: selectedItem?.client_address,
        client_detail: selectedItem?.client_detail,
      };
      _sendUpdateByClient(updateClient);
    }
  };
  const onCreateAndEdit = (client: ClientState | null) => {
    setSelectedItem(client);
    setTitle(client ? 'Edit Client' : 'Create Client');
    setCreated(client ? false : true);
    setName(client?.client_name || '');
    setIsEdit(true);
  };
  const handleClientNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  return (
    <MainResponsive>
      <div
        className='flex flex-row items-center w-full justify-between py-6 px-4 bg-light-gray'
        // onClick={() => user?.member.isAdmin && navigate('/account/company-profile')}
      >
        <div />
        <div className='text-lg text-black font-bold'>Manager Clients</div>
        <div className='text-sm text-blue font-normal' onClick={() => onCreateAndEdit(null)}>
          Create
        </div>
      </div>
      <div className='flex flex-1 flex-col w-full h-full relative'>
        <div className='flex flex-1 flex-col w-full p-1 bg-white'>
          <div className='flex flex-row px-4 pb-2 items-center'>
            <div className='text-base text-black font-bold mt-4'>CLIENTS</div>
          </div>
          {dataList.map((client, index) => (
            <div
              key={index}
              className='flex flex-row p-4 mb-2 items-center justify-between bg-light-gray'
              onClick={() => onCreateAndEdit(client)}
            >
              <div className='text-sm text-black font-normal pr-3 flex-1'>{client.client_name}</div>
              <div className='flex-row flex items-center'>
                <div className='text-sm text-black font-normal pr-3'>Active</div>
                <img src={rightArrowThumbnail} className='h-4 w-auto' />
              </div>
            </div>
          ))}
        </div>
        <BottomUpAnimatedView
          title={title}
          actionTitle={title === 'Edit Client' ? 'Save' : 'Create'}
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          onSave={onCreateUpdateClient}
        >
          <div className='px-4 my-4'>
            <div className='text-base text-black font-normal px-2'>NAME</div>
            <div className='flex flex-row mb-2 rounded-md items-center bg-light-gray relative'>
              <input
                className='w-full p-2 text-left text-black bg-transparent'
                placeholder='Enter New Client Name'
                value={name}
                onChange={handleClientNameChange}
              />
            </div>
          </div>
        </BottomUpAnimatedView>
      </div>
    </MainResponsive>
  );
};

export default ManageClients;
