import React from 'react';
import { ClientState } from '../../lib/api/auth';
import CheckIcon from './CheckIcon';

interface Props {
  client: ClientState;
  selectedClient: ClientState | null;
  onSelect: (client: ClientState) => void;
}
const ClientItem = ({ client, selectedClient, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(client)}>
      {selectedClient !== null ? <CheckIcon checked={selectedClient.client_id === client.client_id} /> : <CheckIcon checked={false} />}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate'>{client.client_name}</div>
    </div>
  );
};

export default ClientItem;
