import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { agendaThumbnail, menuThumbnail, searchThumbnail } from '../../assets/images';
import AgendaCalendar from '../../components/priority/AgendaCalendar';
import { accountState, AccountState } from '../../modules/user';

interface GroupItemViewProps {
  className?: string;
  children: React.ReactNode;
}

function GroupItemView({ className, children }: GroupItemViewProps): JSX.Element {
  const wholeClassName = 'bg-card-gray shadow-xl w-full ' + className;

  return <div className={wholeClassName}>{children}</div>;
}

export default GroupItemView;
