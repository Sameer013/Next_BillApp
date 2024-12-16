'use client';

import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';
import BillsModal from './bills-modal';


function noop(): void {
  // do nothing
}

export interface Customer {
  id:string;
  renter_id: string;
  cur_read: string;
  prev_read: string;
  consumed: string;
  dues: string;
  total: string;

  // id: string;
  // renter_id: '01', //renter_id
  // cur_read: '1206',// skip
  // prev_read: '1109', //Current Reading
  // consumed: '103',
  // dues: '0',
  // total: '841',
}

interface BillsTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function BillsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: BillsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

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
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Renter ID</TableCell>
              <TableCell>Current Reading</TableCell>
              <TableCell>Previous Reading</TableCell>
              <TableCell>Consumed</TableCell>
              <TableCell>Dues</TableCell>
              <TableCell>Total Payable</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      {/* <Avatar src={row.avatar} /> */}
                      <Typography variant="subtitle2">{row.renter_id}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.cur_read} KWh</TableCell>
                  <TableCell>{row.prev_read} KWh</TableCell>
                  <TableCell>{row.consumed} Units</TableCell>
                  <TableCell>₹ {row.dues}.00</TableCell>
                  <TableCell>₹ {row.total}.00</TableCell>
                  <TableCell>
                    <BillsModal/>
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
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
