import React from 'react';
import { CheckSvg } from '../../assets/svg';
import { ProjectState } from '../../modules/project';

interface Props {
  project: ProjectState;
  selectedProject: ProjectState | null;
  onSelect: (project: ProjectState) => void;
}
const ProjectNameItem = ({ project, selectedProject, onSelect }: Props) => {
  return (
    <div className='flex flex-row items-center w-full mb-2' onClick={() => onSelect(project)}>
      <div className='w-6 h-6 bg-dark-gray rounded-full outline outline-1 outline-rouge-blue flex items-center justify-center'>
        <span>
          {selectedProject && selectedProject.project_id === project.project_id ? <CheckSvg stroke='red' strokeWidth={4} /> : null}
        </span>
      </div>
      <div className='pl-2 text-lg font-bold flex flex-1 truncate' style={{ color: project.client_id ? 'red' : 'black' }}>
        {project.project_name}
      </div>
    </div>
  );
};

export default ProjectNameItem;
