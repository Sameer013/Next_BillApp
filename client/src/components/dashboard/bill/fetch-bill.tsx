/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import BillsModal from './bills-modal';
// import BillsModal from './bills-modal';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FetchTable(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const url = 'http://localhost:5000/api/getInfo' 
  const page = 0;
  const rowsPerPage = 25;

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data...');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);


  const handleOpen = () => {setOpen(true)};

  

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }


  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Bills</Typography>
        </Stack>
        <Button
          startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={handleOpen}
        >
          Add
        </Button>
      <Button onClick={fetchData}>Refresh</Button>
        
      </Stack>
      {/* <BillsFilters /> */}
      <BillsTable
        count={customers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        apiEndPoint={baseUrl}
        onComplete={fetchData} // This onComplete is first being passed to BillsTable and then to BillsModal so we getting the callback from modal -> table -> main component
      />
      <BillsModal
        mode="create" // Specify mode as 'create'
        apiEndpoint={baseUrl}
        open={open} 
        setOpen={setOpen}
        onComplete = {fetchData} 
       
      />

      
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);}
