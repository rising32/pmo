import React from 'react';
import RedDocumentIcon from '../common/RedDocumentIcon';
import { ProjectTypeState } from '../../modules/project';

interface Props {
  selectedProjectType: ProjectTypeState | null;
  projectTypeItem: ProjectTypeState;
  onSelect: (projectTypeItem: ProjectTypeState) => void;
}
const ProjectType = ({ selectedProjectType, projectTypeItem, onSelect }: Props) => {
  return (
    <div className='flex flex-row' onClick={() => onSelect(projectTypeItem)}>
      <RedDocumentIcon isChecked={projectTypeItem.project_type === selectedProjectType?.project_type} />
      <div
        className={`text-xl font-bold ${
          projectTypeItem.project_type === selectedProjectType?.project_type ? 'text-rouge-blue rounded-full' : 'text-white'
        }`}
      >
        {projectTypeItem.project_label}
      </div>
    </div>
  );
};

export default ProjectType;
