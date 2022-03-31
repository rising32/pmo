import React from 'react';
import { ProjectState } from '../../modules/project';
import { TaskState } from '../../modules/task';
import CheckIcon from './CheckIcon';

interface Props {
  project: ProjectState;
  selectedProject: ProjectState | null;
  onSelect: (project: ProjectState) => void;
}
const ProjectModalItem = ({ project, selectedProject, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(project)}>
      {selectedProject !== null ? <CheckIcon checked={selectedProject.project_id === project.project_id} /> : <CheckIcon checked={false} />}
      <div className='pl-2 text-lg font-bold flex flex-1 truncate' style={{ color: project.client_id ? 'red' : 'black' }}>
        {project.project_name}
      </div>
    </div>
  );
};

export default ProjectModalItem;
