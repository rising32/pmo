import React, { useState, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { nextThumbnail, previewThumbnail } from '../../assets/images';

interface Props {
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
}
type State = {
  showCalendarTable: boolean;
  showMonthTable: boolean;
  dateObject: Moment;
  allmonths: string[];
  showYearNav: boolean;
  selectedDay: number | null;
  today: Moment;
};
class CustomCalender extends React.Component<Props, State> {
  weekdayshort = moment.weekdaysShort();
  state: State = {
    showCalendarTable: true,
    showMonthTable: false,
    dateObject: moment(),
    allmonths: moment.months(),
    showYearNav: false,
    selectedDay: null,
    today: moment(),
  };

  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format('Y');
  };
  currentDay = () => {
    return this.state.dateObject.format('D');
  };
  firstDayOfMonth = () => {
    const dateObject = this.state.dateObject;
    const firstDay = moment(dateObject).startOf('month').format('d');
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format('MMMM');
  };
  showMonth = () => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable,
    });
  };
  setMonth = (month: string) => {
    const monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('month', monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable,
    });
  };

  MonthList = (props: { data: string[] }) => {
    const months: any[] = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className='flex flex-1 items-center justify-center'
          onClick={() => {
            this.setMonth(data);
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
    const monthlist = rows.map((d, i) => {
      return (
        <tr key={d + i} className='flex flex-row'>
          {d}
        </tr>
      );
    });

    return (
      <table className='flex flex-1'>
        <tbody className='flex flex-col w-full py-2'>{monthlist}</tbody>
      </table>
    );
  };
  showYearEditor = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showYearNav: prevState.showMonthTable ? false : true,
        showCalendarTable: false,
      };
    });
  };
  onPrev = () => {
    if (this.state.showMonthTable == true) {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, 'year'),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, 'month'),
      });
    }
  };
  onNext = () => {
    if (this.state.showMonthTable == true) {
      this.setState({
        dateObject: this.state.dateObject.add(1, 'year'),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.add(1, 'month'),
      });
    }
  };
  setYear = (year: string) => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('year', parseInt(year));
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearNav: !this.state.showYearNav,
    });
  };
  getDates(startDate: string, stopDate: Moment) {
    const dateArray = [];
    let currentDate = moment(startDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY'));
      currentDate = moment(currentDate).add(1, 'year');
    }
    return dateArray;
  }
  YearTable = (props: any) => {
    const months: any[] = [];
    const nextten = moment().set('year', parseInt(props)).add(11, 'years');

    const tenyear = this.getDates(props, nextten);

    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className='flex flex-1 items-center justify-center'
          onClick={e => {
            this.setYear(data);
          }}
        >
          <span className='text-base font-bold'>{data}</span>
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
        <tr key={d + i} className='flex flex-row'>
          {d}
        </tr>
      );
    });

    return (
      <table className='flex flex-1'>
        <tbody className='flex flex-col w-full py-2'>{yearlist}</tbody>
      </table>
    );
  };
  onDayClick = (d: number) => {
    this.setState(
      {
        selectedDay: d,
      },
      () => {
        const dateObject = Object.assign({}, this.state.dateObject);
        this.props.onSelect(moment(dateObject).set('date', d).toDate());
      },
    );
  };

  render() {
    const weekdayshortname = this.weekdayshort.map((day, index) => {
      return (
        <th key={day + index} className='flex flex-1 py-2 text-white font-normal items-center justify-center'>
          {day}
        </th>
      );
    });
    const blanks = [];
    for (let i = 0; i < parseInt(this.firstDayOfMonth()); i++) {
      blanks.push(
        <td key={i + 'blank'} className='flex flex-1 items-center justify-center'>
          {''}
        </td>,
      );
    }
    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      const dateObject = Object.assign({}, this.state.dateObject);
      const currentDay = moment(dateObject).set('date', d).isSame(this.state.today);
      const selected = moment(dateObject).set('date', d).isSame(this.props.selectedDate);
      daysInMonth.push(
        <td key={d} className='flex flex-1 items-center justify-center'>
          <div
            onClick={() => {
              this.onDayClick(d);
            }}
            className='w-6 h-6 rounded-full flex items-center justify-center text-base'
            style={{
              borderColor: currentDay ? 'blue' : 'white',
              borderWidth: currentDay ? 1 : 0,
              background: selected ? '#C4C4C4' : 'white',
            }}
          >
            {d}
          </div>
        </td>,
      );
    }
    let totalSlots = [...blanks, ...daysInMonth];
    if (totalSlots.length % 7 !== 0) {
      const otherblanks = [];
      for (let i = 0; i < 8 - (totalSlots.length % 7); i++) {
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
        rows.push(cells);
      }
    });
    const daysinmonth = rows.map((d, i) => {
      return (
        <tr key={d + i} className='flex flex-row items-center justify-between'>
          {d}
        </tr>
      );
    });
    return (
      <div className='w-full flex flex-col items-center justify-between outline outline-1 outline-dark-gray'>
        <div className='flex flex-row items-center justify-between w-full bg-rouge-blue p-2'>
          <div className='flex items-center justify-center' onClick={() => this.onPrev()}>
            <img src={previewThumbnail} className='h-4 w-auto' />
          </div>
          {!this.state.showMonthTable && !this.state.showYearNav && (
            <span className='text-white text-xl font-bold' onClick={() => this.showMonth()}>
              {this.month()}
            </span>
          )}
          <span className='text-white text-xl font-bold' onClick={() => this.showYearEditor()}>
            {this.year()}
          </span>

          <div className='flex items-center justify-center' onClick={() => this.onNext()}>
            <img src={nextThumbnail} className='h-4 w-auto' />
          </div>
        </div>
        <div className='flex w-full'>
          {this.state.showYearNav && <this.YearTable props={this.year()} />}
          {this.state.showMonthTable && <this.MonthList data={moment.months()} />}
        </div>

        {this.state.showCalendarTable && (
          <div className='w-full flex'>
            <table className='w-full flex flex-col'>
              <thead className='bg-main-back w-full'>
                <tr className='flex flex-row items-center justify-between'>{weekdayshortname}</tr>
              </thead>
              <tbody className='flex flex-col py-2 bg-white'>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default CustomCalender;
