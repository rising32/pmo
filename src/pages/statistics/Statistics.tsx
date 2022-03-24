import React, { useState, useMemo } from 'react';
import { Column } from 'react-table';
import Table from '../../components/common/Table';

function Statistics(): JSX.Element {
  const [isWeek, setIsWeek] = useState(true);
  const [statusValue, setStatusValue] = useState(0);
  const [isWeekTableLoading, setIsWeekTableLoading] = useState(false);

  const weekColumns: Array<Column<any>> = useMemo(
    () => [
      {
        Header: 'WEEKS',
        accessor: 'week',
      },
      {
        Header: 'Available',
        accessor: 'available',
      },
      {
        Header: 'Delta',
        accessor: 'dalta',
      },
      {
        Header: 'TOTAL',
        accessor: 'total',
      },
      {
        Header: 'ATU M25',
        accessor: 'atum25',
      },
      {
        Header: 'AMZ MHG9',
        accessor: 'amzmhg9',
      },
      {
        Header: 'AMZ XDEY',
        accessor: 'amzxdey',
      },
      {
        Header: 'AMZ ZDEJ',
        accessor: 'amzzdej',
      },
      {
        Header: 'IKEA',
        accessor: 'ikea',
      },
      {
        Header: 'COTA',
        accessor: 'cota',
      },
    ],
    [],
  );
  const weekData: Array<any> = useMemo(
    () => [
      {
        week: 'Σ',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
        amzzdej: '5',
        ikea: '5',
        cota: '5',
      },
      {
        week: '1',
        available: '5',
      },
      {
        week: '2',
        available: '5',
        dalta: '5',
      },
      {
        week: '3',
        available: '5',
        dalta: '5',
        total: '5',
      },
      {
        week: '4',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
      },
      {
        week: '5',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
      },
      {
        week: '6',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
      },
    ],
    [],
  );
  const monthColumns: Array<Column<any>> = useMemo(
    () => [
      {
        Header: 'MONTHS',
        accessor: 'month',
      },
      {
        Header: 'Available',
        accessor: 'available',
      },
      {
        Header: 'Delta',
        accessor: 'dalta',
      },
      {
        Header: 'TOTAL',
        accessor: 'total',
      },
      {
        Header: 'ATU M25',
        accessor: 'atum25',
      },
      {
        Header: 'AMZ MHG9',
        accessor: 'amzmhg9',
      },
      {
        Header: 'AMZ XDEY',
        accessor: 'amzxdey',
      },
      {
        Header: 'AMZ ZDEJ',
        accessor: 'amzzdej',
      },
      {
        Header: 'IKEA',
        accessor: 'ikea',
      },
      {
        Header: 'COTA',
        accessor: 'cota',
      },
    ],
    [],
  );
  const monthData: Array<any> = useMemo(
    () => [
      {
        month: 'Σ',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
        amzzdej: '5',
        ikea: '5',
        cota: '5',
      },
      {
        month: 'J',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
        amzzdej: '5',
        ikea: '5',
        cota: '5',
      },
      {
        month: 'F',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
        amzzdej: '5',
      },
      {
        month: 'M',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
        amzmhg9: '5',
        amzxdey: '5',
      },
      {
        month: 'A',
        available: '5',
        dalta: '5',
        total: '5',
        atum25: '5',
      },
      {
        month: 'M',
        available: '5',
        dalta: '5',
        total: '5',
      },
      {
        month: 'J',
        available: '5',
        dalta: '5',
      },
    ],
    [],
  );

  return (
    <div className='items-center flex flex-col flex-1 px-4 pt-4 pb-32'>
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
            <div className='text-rouge-blue' onClick={() => setIsWeek(false)}>
              Month
            </div>
          )}
        </div>
      </div>
      <div className='my-3'>
        <span className='text-white'>{isWeek ? 'My Production' : 'My forecast'}</span>
      </div>
      <div className='mx-4 outline outline-1 outline-white shadow-xl w-full'>
        {isWeek ? <Table columns={weekColumns} data={weekData} /> : <Table columns={monthColumns} data={monthData} />}
      </div>
    </div>
  );
}

export default Statistics;
