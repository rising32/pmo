import React, { useState, useMemo } from 'react';
import { Column } from 'react-table';
import Table from '../../components/common/Table';
import { sendMonthProduct, sendWeekProduct } from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { TableHeader } from '../../modules/statistic';
import { WeekWorkDay } from '../../modules/project';
import MainResponsive from '../../containers/main/MainResponsive';
import { useAuth } from '../../lib/context/AuthProvider';

function Statistics(): JSX.Element {
  const [isWeek, setIsWeek] = useState(true);
  const [statusValue, setStatusValue] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [weekTableHeader, setWeekTableHeader] = useState<TableHeader[]>([]);
  const [weekTableData, setWeekTableData] = useState<any[]>([]);
  const [monthTableHeader, setMonthTableHeader] = useState<TableHeader[]>([]);
  const [monthTableData, setMonthTableData] = useState<any[]>([]);

  const [_sendWeekProduct, sendingWeekProduct, sendWeekProductRes, sendWeekProductErr, resetSendWeekProduct] = useRequest(sendWeekProduct);
  const [_sendMonthProduct, sendingMonthProduct, sendMonthProductRes, sendMonthProductErr, resetSendMonthProduct] =
    useRequest(sendMonthProduct);

  const { account } = useAuth();
  React.useEffect(() => {
    if (weekTableData.length === 0) {
      setLoaded(false);

      const user_id = account?.user.user_id;
      user_id && _sendWeekProduct(user_id);
    }
  }, []);
  React.useEffect(() => {
    if (sendWeekProductRes && sendWeekProductRes.data.length > 0) {
      const newHeader = weekTableHeader;
      const newData = weekTableData;
      sendWeekProductRes.data.map(item => {
        if (item.client_id === -1) {
          const WeekWeekHeader: TableHeader = {
            Header: 'WEEKS',
            accessor: 'week',
          };
          const WeekAvailableHeader: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          const WeekDeltaColumn: TableHeader = {
            Header: 'Delta',
            accessor: 'delta',
          };
          const WeekTotalColumn: TableHeader = {
            Header: 'TOTAL',
            accessor: 'total',
          };
          newHeader.push(WeekWeekHeader);
          newHeader.push(WeekAvailableHeader);
          newHeader.push(WeekDeltaColumn);
          newHeader.push(WeekTotalColumn);
        } else {
          const HeaderItem: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          newHeader.push(HeaderItem);
        }
      });
      setWeekTableHeader(newHeader);
      const ItemsSum: any = {};
      sendWeekProductRes.data.map(item => {
        const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
        let sumValue = 0;
        item.realWorkdays.length > 0 &&
          item.realWorkdays.map((cell: WeekWorkDay) => {
            sumValue += cell.work_days;
          });
        ItemsSum[`${dataKey}`] = sumValue;
      });
      let total = 0;
      let delta = 0;
      for (const [key, value] of Object.entries(ItemsSum)) {
        if (key !== 'available') {
          total += value as number;
        }
      }
      delta = ItemsSum['available'] - total;
      for (let i = 0; i <= 52; i++) {
        const tableDataItem: any = {};
        sendWeekProductRes.data.map(item => {
          if (item.realWorkdays.length > 0) {
            const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
            tableDataItem[`${dataKey}`] = i === 0 ? ItemsSum[`${dataKey}`] : item.realWorkdays[i - 1].work_days;
          }
          tableDataItem['week'] = i === 0 ? 'Σ' : i;
        });
        let totaItem = 0;
        let deltaItem = 0;
        for (const [key, value] of Object.entries(tableDataItem)) {
          if (key !== 'available' && key !== 'week') {
            totaItem += value as number;
          }
        }
        deltaItem = tableDataItem['available'] - totaItem;

        if (i === 0) {
          tableDataItem['delta'] = delta;
          tableDataItem['total'] = total;
        } else {
          tableDataItem['delta'] = deltaItem;
          tableDataItem['total'] = totaItem;
        }

        newData.push(tableDataItem);
      }
      setWeekTableData(newData);
      setLoaded(true);
    }
  }, [sendWeekProductRes]);
  React.useEffect(() => {
    if (sendMonthProductRes && sendMonthProductRes.data.length > 0) {
      const newHeader = monthTableHeader;
      const newData = monthTableData;
      sendMonthProductRes.data.map(item => {
        if (item.client_id === -1) {
          const MonthWeekHeader: TableHeader = {
            Header: 'MONTHS',
            accessor: 'month',
          };
          const WeekAvailableHeader: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          const WeekDeltaColumn: TableHeader = {
            Header: 'Delta',
            accessor: 'delta',
          };
          const WeekTotalColumn: TableHeader = {
            Header: 'TOTAL',
            accessor: 'total',
          };
          newHeader.push(MonthWeekHeader);
          newHeader.push(WeekAvailableHeader);
          newHeader.push(WeekDeltaColumn);
          newHeader.push(WeekTotalColumn);
        } else {
          const HeaderItem: TableHeader = {
            Header: item.client_name,
            accessor: item.client_name.toLowerCase().replace(/\s+/g, ''),
          };
          newHeader.push(HeaderItem);
        }
      });
      setMonthTableHeader(newHeader);
      const ItemsSum: any = {};
      sendMonthProductRes.data.map(item => {
        const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
        let sumValue = 0;
        item.realWorkdays.length > 0 &&
          item.realWorkdays.map(cell => {
            sumValue += cell.work_days;
          });
        ItemsSum[`${dataKey}`] = sumValue;
      });
      let total = 0;
      let delta = 0;
      for (const [key, value] of Object.entries(ItemsSum)) {
        if (key !== 'available') {
          total += value as number;
        }
      }
      delta = ItemsSum['available'] - total;
      const MonthLabel = ['Σ', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      for (let i = 0; i <= 12; i++) {
        const tableDataItem: any = {};
        sendMonthProductRes.data.map(item => {
          if (item.realWorkdays.length > 0) {
            const dataKey = item.client_name.toLowerCase().replace(/\s+/g, '');
            tableDataItem[`${dataKey}`] = i === 0 ? ItemsSum[`${dataKey}`] : item.realWorkdays[i - 1].work_days;
          }
          tableDataItem['month'] = MonthLabel[i];
        });
        let totaItem = 0;
        let deltaItem = 0;
        for (const [key, value] of Object.entries(tableDataItem)) {
          if (key !== 'available' && key !== 'month') {
            totaItem += value as number;
          }
        }
        deltaItem = tableDataItem['available'] - totaItem;

        if (i === 0) {
          tableDataItem['delta'] = delta;
          tableDataItem['total'] = total;
        } else {
          tableDataItem['delta'] = deltaItem;
          tableDataItem['total'] = totaItem;
        }

        newData.push(tableDataItem);
      }
      setMonthTableData(newData);
      setLoaded(true);
    }
  }, [sendMonthProductRes]);
  const onMothTable = () => {
    if (monthTableData.length === 0) {
      setLoaded(false);

      const user_id = account?.user.user_id;
      user_id && _sendMonthProduct(user_id);
    }
    setIsWeek(false);
  };
  const weekColumns: Array<Column<any>> = useMemo(() => weekTableHeader, [weekTableHeader]);
  const weekData: Array<any> = useMemo(() => weekTableData, [weekTableData]);
  const monthColumns: Array<Column<any>> = useMemo(() => monthTableHeader, [monthTableHeader]);
  const monthData: Array<any> = useMemo(() => monthTableData, [monthTableData]);

  return (
    <MainResponsive>
      <div className='flex flex-row bg-white w-full py-2 relative'>
        <div className='absolute top-0 left-0 bg-dark-gray h-full transition-all' style={{ width: `${statusValue}%` }} />
        <div className='absolute left-8 z-20'>
          {!isWeek && (
            <div className='text-rouge-blue' onClick={() => setIsWeek(true)}>
              Week
            </div>
          )}
        </div>
        <div className='flex flex-1 items-center justify-center z-10' onClick={() => setStatusValue(70)}>
          <span className='font-bold'>Weely Status 0%</span>
        </div>
        <div className='absolute right-8 z-20'>
          {isWeek && (
            <div className='text-rouge-blue' onClick={onMothTable}>
              Month
            </div>
          )}
        </div>
      </div>
      <div className='my-3'>
        <span className='text-white'>{isWeek ? 'My Production' : 'My forecast'}</span>
      </div>
      {loaded && (
        <div className='mx-4 outline outline-1 outline-white shadow-xl w-full'>
          {isWeek ? <Table columns={weekColumns} data={weekData} /> : <Table columns={monthColumns} data={monthData} />}
        </div>
      )}
    </MainResponsive>
  );
}

export default Statistics;
