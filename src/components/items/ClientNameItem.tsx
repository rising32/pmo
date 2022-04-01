import React from 'react';
import { CheckSvg } from '../../assets/svg';
import { ClientState } from '../../modules/client';
// import CheckIcon from './CheckIcon';

interface Props {
  client: ClientState;
  selectedClient: ClientState | null;
  onSelect: (client: ClientState) => void;
}
const ClientNameItem = ({ client, selectedClient, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full m-auto pb-1' onClick={() => onSelect(client)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>{selectedClient && selectedClient.client_id === client.client_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}</span>
      </div>
      <div className='pl-2 text-lg font-bold text-blue flex flex-1 truncate'>{client.client_name}</div>
    </div>
  );
};

export default ClientNameItem;
