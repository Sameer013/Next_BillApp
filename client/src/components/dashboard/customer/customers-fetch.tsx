'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CustomersPage(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars -- The 'page' state variable is defined but not used yet. This directive is to prevent linting errors until it is used. */
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async (): Promise<Customer[]> => {
      try {
        const response = await fetch(`${baseUrl}/getInfo`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Customer[] = await response.json() as Customer[];
        setCustomers(data);
        setError(null);
        return data;
      } catch (err: unknown) {
        setError((err as Error).message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    void fetchCustomers();
  }, []);

  const applyPagination = (rows: Customer[], page1: number, rowsPerPage1: number): Customer[] => {
    return rows.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1);
  };

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={customers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        // onPageChange={(newPage: React.SetStateAction<number>) => { return setPage(newPage); }}
      />
    </Stack>
  );
}
