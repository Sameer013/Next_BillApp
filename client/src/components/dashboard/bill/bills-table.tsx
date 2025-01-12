'use client';

import * as React from 'react';
import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelection } from '@/hooks/use-selection';
import BillsModal from './bills-modal';
import { NotePencil,Trash } from '@phosphor-icons/react/dist/ssr';


export interface Renter {
  id: string;
  renter_id: string;
  curr_reading: string;
  prev_reading: string;
  units_consumed: string;
  previous_due: string;
  total_due: string;
  bill_id: string;
  is_paid: boolean;
}

interface BillsTableProps {
  count?: number;
  page?: number;
  rows?: Renter[];
  rowsPerPage?: number;
  apiEndPoint?: string;
  onComplete?: () => void;
}

export function BillsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  apiEndPoint,
  onComplete,
}: BillsTableProps): React.JSX.Element {
  const rowIds = useMemo(() => rows.map((customer) => customer.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.checked ? selectAll() : deselectAll();
  };
  
  const handleSelectOne = (id: string, checked: boolean) => {
    checked ? selectOne(id) : deselectOne(id);
  };
  
  const [openModalId, setOpenModalId] = React.useState<string | null>(null);
  // const [open, setOpen] = React.useState(false);
  const noop = () => {};
  const handleOpen = (id:string) => {setOpenModalId(id)};
  const handleClose = () => {setOpenModalId(null)};
 
  const getMonthName = (monthNumber: number) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    // console.log(months[monthNumber - 1]);
    return months[monthNumber - 1];
  }

 function applyPagination(rows: Renter[], page: number, rowsPerPage: number): Renter[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {[
                'S.No',
                'Renter ID',
               'Current Reading',
               'Previous Reading',
               'Consumed',
               'Dues', 
               'Month Year',
               'Total Payable',
               'Status', 
               'Action'
              ].map(
                (header) => (
                  <TableCell key={header}>{header}</TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.bill_id);

              return (
                <TableRow hover key={row.bill_id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {handleSelectOne(row.bill_id, event.target.checked)}}
                    />
                  </TableCell>
                  <TableCell>{row.bill_id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle2">0{row.renter_id}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.curr_reading} KWh</TableCell>
                  <TableCell>{row.prev_reading} KWh</TableCell>
                  <TableCell>{row.units_consumed} Units</TableCell>
                  <TableCell>₹ {row.previous_due}.00</TableCell>
                  <TableCell>{ `${getMonthName(row.month) } ${  row.year}`}</TableCell>
                  <TableCell>₹ {row.total_due}.00</TableCell>
                  <TableCell sx={{ color: row.is_paid ? 'green' : 'red', fontWeight: 'bold', width: '6rem', textAlign: 'center' }}>
                    {row.is_paid ? 'Paid' : 'Not Paid'}
                  </TableCell>
                  <TableCell>
                  <Button onClick={() =>  { handleOpen(row.bill_id)}} color="inherit" >
                    <NotePencil size={28} color='black'/>
                  </Button>
                  {/* <Button onClick={() =>  { handleOpen(row.bill_id)}} color="inherit" >
                  <Trash size={28} color='red' />
                  </Button> */}

                    <BillsModal
                      mode="edit"
                      apiEndpoint={apiEndPoint}
                      open={openModalId === row.bill_id}
                      setOpen={handleClose}
                      renterId={row.bill_id}
                      onComplete={onComplete}
                      
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
