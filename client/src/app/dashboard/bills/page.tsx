import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import FetchTable from '@/components/dashboard/bill/fetch-bill';
// import { config } from '@/config';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';

// import { BillsFilters } from '@/components/dashboard/customer/customers-filters';
// import { CustomersTable } from '@/components/dashboard/customer/customers-table';
// import type { Customer } from '@/components/dashboard/customer/customers-table';
import { BillsFilters } from '@/components/dashboard/bill/bills-filters';
import { BillsTable } from '@/components/dashboard/bill/bills-table';
import type { Customer } from '@/components/dashboard/bill/bills-table';

export const metadata = { title: `Customers | Dashboard` } satisfies Metadata;

const customers = [
  {


    id: '1', //bill_id
    renter_id: '01', //renter_id
    cur_read: '1206',// skip
    prev_read: '1109', //Current Reading
    consumed: '103',
    dues: '0',
    total: '841',
  },
  
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Bills</Typography>

        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <BillsFilters />
      <BillsTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
    // <FetchTable />
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
