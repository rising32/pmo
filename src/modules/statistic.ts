export interface TableHeader {
  Header: string;
  accessor: string;
}

export const defaultHeaderColum: TableHeader[] = [
  {
    Header: 'Delta',
    accessor: 'dalta',
  },
  {
    Header: 'TOTAL',
    accessor: 'total',
  },
];
