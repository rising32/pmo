export interface PriorityState {
  wp_id: number;
  user_id: number;
  week: number;
  priority_num: number;
  description: string;
  deliverable: string | null;
  detail: string | null;
  is_completed: number | null;
}
// 3 : Save the 50 K€ penalties 4 : Teach the 9 shift leads 5 : Prepare the sorter removal 6 : Implement the damage zone 7 : Test the sorter capacity
export const prioritiesFakeData: PriorityState[] = [
  {
    wp_id: 1,
    user_id: 1,
    week: 13,
    priority_num: 1,
    description: 'Implement the 12 KPI',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 2,
    user_id: 2,
    week: 13,
    priority_num: 2,
    description: 'Analyze the causes for each',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 3,
    user_id: 1,
    week: 13,
    priority_num: 3,
    description: 'Save the 50 K€ penalties',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 4,
    user_id: 1,
    week: 13,
    priority_num: 4,
    description: 'Teach the 9 shift leads',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 5,
    user_id: 3,
    week: 13,
    priority_num: 5,
    description: 'Prepare the sorter removal',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
];

export const prioritiesNotAchievedFakeData: PriorityState[] = [
  {
    wp_id: 1,
    user_id: 1,
    week: 12,
    priority_num: 25,
    description: 'Save the 50 K€ penalties',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 2,
    user_id: 2,
    week: 12,
    priority_num: 2,
    description: 'Teach the 9 shift leads',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 3,
    user_id: 1,
    week: 11,
    priority_num: 3,
    description: 'Solve the XL issue about SDT',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
  {
    wp_id: 4,
    user_id: 1,
    week: 10,
    priority_num: 4,
    description: 'Set up team lead perfectly',
    deliverable: null,
    detail: null,
    is_completed: null,
  },
];
export const prioritiesPastFakeData: PriorityState[] = [
  {
    wp_id: 1,
    user_id: 1,
    week: 13,
    priority_num: 1,
    description: 'Implement the 12 KPI',
    deliverable: null,
    detail: null,
    is_completed: 0,
  },
  {
    wp_id: 2,
    user_id: 2,
    week: 13,
    priority_num: 2,
    description: 'Analyze the causes for each',
    deliverable: null,
    detail: null,
    is_completed: 0,
  },
  {
    wp_id: 3,
    user_id: 1,
    week: 13,
    priority_num: 3,
    description: 'Save the 50 K€ penalties',
    deliverable: null,
    detail: null,
    is_completed: 1,
  },
  {
    wp_id: 4,
    user_id: 1,
    week: 13,
    priority_num: 4,
    description: 'Teach the 9 shift leads',
    deliverable: null,
    detail: null,
    is_completed: 1,
  },
  {
    wp_id: 5,
    user_id: 3,
    week: 13,
    priority_num: 5,
    description: 'Prepare the sorter removal',
    deliverable: null,
    detail: null,
    is_completed: 0,
  },
];
