import React, { useState, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { string } from 'yup';
import { nextThumbnail, previewThumbnail } from '../../assets/images';

function CustomCalender(): JSX.Element {
  const weekdayshort: string[] = moment.weekdaysShort();
  const [showCalendarTable, setShowCalendarTable] = useState(true);
  const [showMonthTable, setShowMonthTable] = useState(false);
  const [dateObject, setDateObject] = useState(moment());
  const [allmonths, setAllmonths] = useState(moment.months());
  const [showYearNav, setShowYearNav] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = () => {
    return dateObject.daysInMonth();
  };
  const year = useMemo(() => {
    return dateObject.format('Y');
  }, [dateObject]);
  const currentDay = () => {
    return dateObject.format('D');
  };
  const firstDayOfMonth = () => {
    const newDateObject = dateObject;
    const firstDay = moment(newDateObject).startOf('month').format('d'); // Day of week 0...1..5...6
    return firstDay;
  };
  const month = useMemo(() => {
    return dateObject.format('MMMM');
  }, [dateObject]);
  const showMonth = () => {
    setShowMonthTable(!showMonthTable);
    setShowCalendarTable(!showCalendarTable);
  };
  const setMonth = (month: string) => {
    const monthNo = allmonths.indexOf(month);
    let newDateObject = Object.assign({}, dateObject);
    newDateObject = moment(newDateObject).set('month', monthNo);
    setDateObject(newDateObject);
    setShowMonthTable(!showMonthTable);
    setShowCalendarTable(!showCalendarTable);
  };
  const MonthList = (monthList: string[]) => {
    const months: any = [];
    monthList.map(data => {
      months.push(
        <td
          key={data}
          className='flex w-1/3 items-center justify-center'
          onClick={() => {
            setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>,
      );
    });
    const rows: any[] = [];
    let cells: any[] = [];
    months.forEach((row: string, i: number) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    const monthlist = rows.map((d, i) => {
      return (
        <tr key={d + i} className='flex w-full'>
          {d}
        </tr>
      );
    });
    return (
      <table className='flex w-full flex-col py-2'>
        <thead className='flex items-center justify-center'>
          <tr>
            <th className=''>Select a Month</th>
          </tr>
        </thead>
        <tbody className='flex w-full flex-wrap'>{monthlist}</tbody>
      </table>
    );
  };
  const showYearEditor = () => {
    setShowYearNav(true);
    setShowCalendarTable(!showCalendarTable);
  };
  const onPrev = () => {
    const dataObjectValue = dateObject;
    if (showMonthTable) {
      setDateObject(dataObjectValue.subtract(1, 'year'));
    } else {
      setDateObject(dataObjectValue.subtract(1, 'month'));
    }
  };
  const onNext = () => {
    if (showMonthTable == true) {
      setDateObject(dateObject.add(1, 'year'));
    } else {
      setDateObject(dateObject.add(1, 'month'));
    }
  };
  const setYear = (year: string) => {
    let newDateObject = Object.assign({}, dateObject);
    newDateObject = moment(newDateObject).set('year', parseInt(year));
    setDateObject(newDateObject);
    setShowMonthTable(!showMonthTable);
    setShowYearNav(!showYearNav);
  };
  const onYearChange = (e: any) => {
    setYear(e.target.value);
  };
  const getDates = (startDate: string, stopDate: Moment) => {
    const dateArray = [];
    let currentDate = moment(startDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY'));
      currentDate = moment(currentDate).add(1, 'year');
    }
    return dateArray;
  };
  const YearTable = (year: string) => {
    const months: any[] = [];
    const nextten = moment().set('year', parseInt(year)).add(11, 'years');
    const tenyear = getDates(year, nextten);
    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className='flex w-full flex-1 items-center justify-center'
          onClick={() => {
            setYear(data);
          }}
        >
          <span>{data}</span>
        </td>,
      );
    });
    const rows: any[] = [];
    let cells: any[] = [];
    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    const yearlist = rows.map((d, i) => {
      return (
        <tr key={d + i} className='w-full flex flex-row'>
          {d}
        </tr>
      );
    });
    return (
      <table className='flex w-full flex-col items-center py-2'>
        <thead className='flex'>
          <tr>
            <th>Select a Year</th>
          </tr>
        </thead>
        <tbody className='flex flex-col w-full flex-nowrap'>{yearlist}</tbody>
      </table>
    );
  };
  const onDayClick = (d: number) => {
    setSelectedDay(d);
  };
  const daysinmonth = () => {
    const blanks = [];
    for (let i = 0; i < parseInt(firstDayOfMonth()); i++) {
      blanks.push(
        <td key={i + 'blank'} className='flex flex-1 items-center justify-center'>
          {''}
        </td>,
      );
    }
    const daysInMonthArray = [];
    for (let d = 1; d <= daysInMonth(); d++) {
      const isCurrentDay = d === parseInt(currentDay());
      // let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
      daysInMonthArray.push(
        <td key={d} className='flex flex-1 items-center justify-center'>
          <div
            onClick={() => {
              onDayClick(d);
            }}
            style={{
              color: isCurrentDay ? 'blue' : 'black',
              borderColor: isCurrentDay ? 'blue' : 'white',
              borderWidth: 1,
            }}
            className='w-7 h-7 rounded-full flex items-center justify-center'
          >
            {d}
          </div>
        </td>,
      );
    }
    let totalSlots = [...blanks, ...daysInMonthArray];
    if (totalSlots.length % 7 !== 0) {
      const otherblanks = [];
      for (let i = 0; i < 7 - parseInt(firstDayOfMonth()); i++) {
        otherblanks.push(
          <td key={7 - i + 'blank'} className='flex flex-1 items-center justify-center'>
            {''}
          </td>,
        );
      }
      totalSlots = [...totalSlots, ...otherblanks];
    }
    const rows: any[] = [];
    let cells: any[] = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // let insertRow = cells.slice();
        rows.push(cells);
      }
    });
    return (
      <>
        {rows.map((day, index) => (
          <tr key={day + index} className='flex flex-1 flex-row'>
            {day}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className='w-full flex flex-col items-center justify-between outline outline-1 outline-dark-gray'>
      <div className='flex flex-row items-center justify-between w-full bg-rouge-blue p-2'>
        <div className='flex items-center justify-center' onClick={() => onPrev()}>
          <img src={previewThumbnail} className='h-4 w-auto' />
        </div>
        {!showMonthTable && !showYearNav && (
          <span className='text-white text-xl font-bold' onClick={showMonth}>
            {month}
          </span>
        )}
        <span className='text-white text-xl font-bold' onClick={showYearEditor}>
          {year}
        </span>

        <div className='flex items-center justify-center' onClick={onNext}>
          <img src={nextThumbnail} className='h-4 w-auto' />
        </div>
      </div>
      <div className='flex w-full'>
        {showYearNav && YearTable(year)}
        {showMonthTable && MonthList(moment.months())}
      </div>

      {showCalendarTable && (
        <div className='w-full flex'>
          <table className='w-full flex flex-col'>
            <thead className='bg-main-back w-full'>
              <tr className='w-full flex flex-row'>
                {weekdayshort.map((day, index) => (
                  <th key={index} className='flex flex-1 items-center justify-center text-white font-normal'>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='flex flex-col'>{daysinmonth()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomCalender;
