export interface DateFormatOption {
  readonly value: string;
  readonly label: string;
}

export const dateFormatOptions: readonly DateFormatOption[] = [
  { value: '0', label: 'YYYY-MM-DD' },
  { value: '1', label: 'D/MM/YYYY' },
  { value: '2', label: 'YYYYMMDD' },
];

export interface CurrencyOption {
  readonly value: number;
  readonly label: string;
}

export const currencyOption: readonly CurrencyOption[] = [
  { value: 0, label: 'Euro (€)' },
  { value: 1, label: 'Dollar ($)' },
];

export interface WeekFormatOption {
  readonly value: string;
  readonly label: string;
}

export const weekFormatOptions: readonly WeekFormatOption[] = [
  { value: '0', label: 'Monday' },
  { value: '1', label: 'Tuesday' },
  { value: '2', label: 'Wednesday' },
  { value: '3', label: 'Thursday' },
  { value: '4', label: 'Friday' },
  { value: '5', label: 'Saturday' },
  { value: '6', label: 'Sunday' },
];
export interface UserSelectOption {
  readonly value: number;
  readonly label: string;
  readonly email: string;
}
export interface EmailSelectOption {
  readonly value: number;
  readonly label: string;
  readonly name: string;
}

export interface TableDataState {
  week?: string;
  month?: string;
  available?: string;
  dalta?: string;
  total?: string;
  atum25?: string;
  amzmhg9?: string;
  amzxdey?: string;
  amzzdej?: string;
  ikea?: string;
  cota?: string;
}
