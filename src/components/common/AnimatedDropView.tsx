import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { controlThumbnail, documentThumbnail, minusThumbnail, plusThumbnail } from '../../assets/images';
import ReactModal from 'react-modal';
import { accountState, AccountState, UserState } from '../../modules/user';
import useRequest from '../../lib/hooks/useRequest';
import { getUserAll, getUserTasks, ResponseUCTP, sendGetMyClients, sendMyProject, sendUCTP } from '../../lib/api';
import ClientItem from '../../components/task/ClientItem';
import TaskCalender from '../../components/task/TaskCalender';
import { ClientState } from '../../modules/client';
import { PriorityTaskState, TaskState } from '../../modules/task';
import TaskModalItem from '../../components/task/TaskModalItem';
import UserItem from '../../components/task/UserItem';
import CustomCalender from '../../components/common/CustomCalender';
import { Moment } from 'moment';
import { ProjectState } from '../../modules/project';
import ProjectModalItem from '../../components/task/ProjectModalItem';
import TaskItem from '../../components/task/TaskItem';
import { getWeek } from 'date-fns';
import MainResponsive from '../../containers/main/MainResponsive';
import GroupItemView from '../../containers/main/GroupItemView';
import { useSpring, animated } from 'react-spring';
import useResizeObserver from 'use-resize-observer';

interface MainResponsiveProps {
  show: boolean;
  children: React.ReactNode;
}

function AnimatedDropView({ show, children }: MainResponsiveProps): JSX.Element {
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const props = useSpring({
    height: show ? height : 0,
  });

  return (
    <animated.div
      style={{
        ...props,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div ref={ref}>{children}</div>
    </animated.div>
  );
}

export default AnimatedDropView;
