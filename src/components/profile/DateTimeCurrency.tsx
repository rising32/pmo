import React from 'react';
import { useRecoilValue } from 'recoil';
import { AccountState, accountState } from '../../modules/user';
import BottomUpAnimatedView from '../../components/common/BottomUpAnimatedView';
import CheckBox from '../../components/common/CheckBox';
import {
  sendDateTimeCurrencyCreate,
  sendDateTimeCurrencyUpdate,
  sendGetDateTimeCurrency,
  sendUserProfileUpdate,
  signOut,
} from '../../lib/api';
import useRequest from '../../lib/hooks/useRequest';
import { toast } from 'react-toastify';
import Select, { SingleValue, components, DropdownIndicatorProps } from 'react-select';
import { CurrencyOption, currencyOption, DateFormatOption, dateFormatOptions } from '../../modules/setting';
import { dropDownThumbnail } from '../../assets/images';
import { DateTimeCurrencyType } from '../../modules/dateTimeCurrency';

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={dropDownThumbnail} className=' h-3 w-auto' />
    </components.DropdownIndicator>
  );
};

interface Props {
  isEditDateTimeCurrency: boolean;
  onClose: () => void;
}

const DateTimeCurrency = ({ isEditDateTimeCurrency, onClose }: Props) => {
  const account = useRecoilValue<AccountState | null>(accountState);
  const [loading, setLoading] = React.useState(false);
  const [dtcData, setDTCData] = React.useState({
    dtc_id: 0,
    user_id: account?.user.user_id,
    date_format: dateFormatOptions[0],
    time_format: '24',
    currency: currencyOption[0],
    decimal_seperator: 1,
  });

  const [_sendDateTimeCurrencyCreate, dateTimeCurrencyCreating, dateTimeCurrencyCreateRes, , resetSendDateTimeCurrencyCreate] =
    useRequest(sendDateTimeCurrencyCreate);
  const [_sendDateTimeCurrencyUpdate, dateTimeCurrencyUpdating, dateTimeCurrencyUpdateRes, , resetSendDateTimeCurrencyUpdate] =
    useRequest(sendDateTimeCurrencyUpdate);
  const [_sendGetDateTimeCurrency, dateTimeCurrencyLoading, dateTimeCurrencyRes, , resetSendDateTimeCurrency] =
    useRequest(sendGetDateTimeCurrency);

  React.useEffect(() => {
    const user_id = account?.user.user_id;
    user_id && _sendGetDateTimeCurrency(user_id);
  }, []);
  React.useEffect(() => {
    // console.log('dateTimeCurrencyRes = ', dateTimeCurrencyRes);
    if (dateTimeCurrencyRes && dateTimeCurrencyRes.user_id && account) {
      let date = dateFormatOptions[0],
        currency = currencyOption[0];
      dateFormatOptions.map(item => {
        if (dateTimeCurrencyRes.date_format === item.value) {
          date = item;
        }
      });
      currencyOption.map(item => {
        if (dateTimeCurrencyRes.currency === item.value) {
          currency = item;
        }
      });
      setDTCData({
        dtc_id: dateTimeCurrencyRes.dtc_id,
        user_id: dateTimeCurrencyRes.user_id,
        date_format: date,
        time_format: dateTimeCurrencyRes.time_format,
        currency: currency,
        decimal_seperator: dateTimeCurrencyRes.decimal_seperator,
      });
      setLoading(true);
    } else if (dateTimeCurrencyRes !== null) {
      setLoading(true);
    }
  }, [dateTimeCurrencyRes]);
  React.useEffect(() => {
    if (dateTimeCurrencyCreateRes && dateTimeCurrencyCreateRes.user_id && account) {
      toast.success('Date, Time, Currency created!');
      onClose();
    }
  }, [dateTimeCurrencyCreateRes]);
  React.useEffect(() => {
    if (dateTimeCurrencyUpdateRes && dateTimeCurrencyUpdateRes.user_id && account) {
      toast.success('Date, Time, Currency updated!');
      onClose();
    }
  }, [dateTimeCurrencyUpdateRes]);

  const onDateTimeCurrencySave = () => {
    if (account) {
      if (dtcData.dtc_id) {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: dtcData.dtc_id,
          user_id: account.user.user_id,
          date_format: dtcData.date_format.value,
          time_format: dtcData.time_format,
          currency: dtcData.currency.value,
          decimal_seperator: dtcData.decimal_seperator,
        };
        _sendDateTimeCurrencyUpdate(dateTimeCurrency);
      } else {
        const dateTimeCurrency: DateTimeCurrencyType = {
          dtc_id: 0,
          user_id: account.user.user_id,
          date_format: dtcData.date_format.value,
          time_format: dtcData.time_format,
          currency: dtcData.currency.value,
          decimal_seperator: dtcData.decimal_seperator,
        };
        _sendDateTimeCurrencyCreate(dateTimeCurrency);
      }
    }
  };
  const onSelectDateFormat = (newValue: SingleValue<DateFormatOption>) => {
    if (newValue) {
      changeState({ name: 'data_format', value: newValue });
    }
  };
  const onSelectCurrency = (newValue: SingleValue<CurrencyOption>) => {
    if (newValue) {
      console.log('-----', newValue);
      changeState({ name: 'currency', value: newValue });
    }
  };
  type ParamType = {
    name: string;
    value: any;
  };
  const changeState = ({ name, value }: ParamType) => {
    const oldDTC = dtcData;
    setDTCData({
      dtc_id: oldDTC.dtc_id,
      user_id: oldDTC.user_id,
      date_format: name === 'data_format' ? value : oldDTC.date_format,
      time_format: name === 'time_format' ? value : oldDTC.time_format,
      currency: name === 'currency' ? value : oldDTC.currency,
      decimal_seperator: name === 'decimal_seperator' ? value : oldDTC.decimal_seperator,
    });
  };

  if (!loading) {
    return <div />;
  }

  return (
    <BottomUpAnimatedView title='Account Setting' isOpen={isEditDateTimeCurrency} onClose={onClose} onSave={onDateTimeCurrencySave}>
      <div className='px-4 my-4 flex flex-row'>
        <div className='flex flex-1 justify-between flex-col'>
          <div className='text-base text-black font-normal'>DATE FORMAT</div>
          <Select
            defaultValue={dtcData.date_format}
            name='date-format'
            options={dateFormatOptions}
            // components={{ DropdownIndicator }}
            onChange={onSelectDateFormat}
          />
          <div className='text-base text-black font-normal'>CURRENCY</div>
          <Select
            defaultValue={dtcData.currency}
            name='date-format'
            options={currencyOption}
            // components={{ DropdownIndicator }}
            onChange={onSelectCurrency}
          />
        </div>
        <div className='flex flex-1 justify-center flex-col pl-2'>
          <div className='text-base text-black font-normal mb-4 truncate'>TIME FORMAT</div>
          <div className='my-2 px-2'>
            <CheckBox
              text='12-Hour'
              activeColor='#DD0000'
              isChecked={dtcData.time_format === '12'}
              unCheck={() => changeState({ name: 'time_format', value: '12' })}
            />
          </div>
          <div className='my-2 px-2'>
            <CheckBox
              text='24-Hour'
              activeColor='#DD0000'
              isChecked={dtcData.time_format === '24'}
              unCheck={() => changeState({ name: 'time_format', value: '24' })}
            />
          </div>
          <div className='text-base text-black font-normal mt-4 truncate'>DECIMAL SEPARATOR</div>
          <div className='my-2 px-2'>
            <CheckBox
              text='Point'
              activeColor='#0E97C3'
              isChecked={dtcData.decimal_seperator === 0}
              unCheck={() => changeState({ name: 'decimal_seperator', value: 0 })}
            />
          </div>
          <div className='my-2 px-2'>
            <CheckBox
              text='Comma'
              activeColor='#0E97C3'
              isChecked={dtcData.decimal_seperator === 1}
              unCheck={() => changeState({ name: 'decimal_seperator', value: 1 })}
            />
          </div>
        </div>
      </div>
    </BottomUpAnimatedView>
  );
};

export default DateTimeCurrency;
