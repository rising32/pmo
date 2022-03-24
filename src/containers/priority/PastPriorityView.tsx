import React from 'react';
import PastPriorityItem from '../../components/priority/PastPriorityItem';
import { PriorityState } from '../../modules/weekPriority';

interface Props {
  priorities: PriorityState[];
  selectedWeek: number | null;
}
const PastPriorityView = ({ priorities, selectedWeek }: Props) => {
  const [dataList, setDataList] = React.useState<PriorityState[]>([]);
  React.useEffect(() => {
    if (selectedWeek) {
      const newList: PriorityState[] = [];
      priorities.map(item => {
        if (item.week < selectedWeek) {
          newList.push(item);
        }
      });
      setDataList(newList);
    } else {
      setDataList(priorities);
    }
  }, [priorities, selectedWeek]);

  return (
    <>
      {dataList.length > 0 ? (
        dataList.map((item, index) => <PastPriorityItem key={index} priority={item} />)
      ) : (
        <div className='text-white text-base'>There is no past not achieved priorities</div>
      )}
    </>
  );
};

export default PastPriorityView;
