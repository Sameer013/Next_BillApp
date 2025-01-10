'use client';

import React, { useMemo } from 'react';
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
import { NotePencil } from '@phosphor-icons/react/dist/ssr';

function noop() {}

export interface Customer {
  id: string;
  renter_id: string;
  curr_reading: string;
  prev_reading: string;
  units_consumed: string;
  previous_due: string;
  total_due: string;
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
  const [open, setOpen] = React.useState(false);

 const handleOpen = (id:string) => {setOpenModalId(id)};
 const handleClose = () => {setOpenModalId(null)};

 const baseUrl = 'http://localhost:5000';

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
                'Renter ID',
               'Current Reading',
               'Previous Reading',
               'Consumed',
               'Dues', 
               'Total Payable', 
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
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => handleSelectOne(row.id, event.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle2">{row.renter_id}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.curr_reading} KWh</TableCell>
                  <TableCell>{row.prev_reading} KWh</TableCell>
                  <TableCell>{row.units_consumed} Units</TableCell>
                  <TableCell>₹ {row.previous_due}.00</TableCell>
                  <TableCell>₹ {row.total_due}.00</TableCell>
                  <TableCell>
                  <Button onClick={() => handleOpen(row.renter_id)} color="inherit" >
                    <NotePencil size={32} color='black'/>
                  </Button>
                    <BillsModal
                      // icon={<NotePencil size={32} />}
                      mode="edit"
                      apiEndpoint={`${baseUrl}/api/getRenters`}
                      open={openModalId === row.renter_id}
                      setOpen={handleClose}
                      renterId={row.renter_id}
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
