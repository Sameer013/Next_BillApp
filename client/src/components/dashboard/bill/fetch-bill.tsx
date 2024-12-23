'use client';

import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { BillsFilters } from '@/components/dashboard/bill/bills-filters';
import { BillsTable } from '@/components/dashboard/bill/bills-table';
import type { Customer } from '@/components/dashboard/bill/bills-table';
import { CircularProgress } from '@mui/material';

export default function FetchTable(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const url = 'http://localhost:5000/api/getInfo' 
  const page = 0;
  const rowsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);


  const handleOpen = async () => {
    setOpen(true);
    // await fetchRenterIds();
  };

  const handleClose = () => setOpen(false);

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Bills</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleOpen} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <BillsFilters />
      <BillsTable
        count={customers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
