'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  border: 'none',
  borderRadius: '10px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
  p: 4,
  color: '#333',
};

const baseUrl = 'http://localhost:5000';

interface Renter {
  renter_id: string;
  q_no: string;
  name: string;
}

interface BillsModalProps {
  mode: 'create' | 'edit' | 'delete' | '';
  apiEndpoint: string;
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Receive state setter
  renterId?: string;
}

export default function BillsModal({ mode, apiEndpoint, open, setOpen, renterId }: BillsModalProps): React.JSX.Element {
  // const [open, setOpen] = useState(false);
  const [renterIds, setRenterIds] = useState<Renter[]>([]);
  const [renterIdState, setRenterIdState] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [prevReading, setPrevReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [dues, setDues] = useState('');

  useEffect(() => {

  //   if (mode === 'edit' && renterId) {
  //     fetchRenterData(renterId);
  //   }
  //   else if(mode === 'create') {
  //   fetchRenterIds();
  // }
  console.log('open:', open);
  if(open){
    
    void fetchRenterIds();
    if (mode === 'edit' && renterId){
      void fetchRenterData(renterId);
    }
    
  }
    
  }, [open, mode, renterId]);

  const fetchRenterIds = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/getRenterId`); // Fetch renter IDs
      if (!response.ok) throw new Error('Failed to fetch renter IDs');
      const data = await response.json();
      console.log('Renter IDs:', data);
      setRenterIds(data as Renter[]);
    } catch (error) {
      console.error('Error fetching renter IDs:', error);
    }
  };

  const fetchRenterData = async (id: string) => {
    try { 
      const response = await fetch(`${baseUrl}/api/getRenter/${id}`);
      if (!response.ok) throw new Error('Failed to fetch renter data');
      const data = await response.json();
      console.log(`Renter data for id ${id}:${data}`);
      setRenterIdState(data.renter_id);
      setMonth(data.month);
      setYear(data.year);
      setPrevReading(data.prevReading);
      setCurrentReading(data.currentReading);
      setDues(data.dues);
    } catch (error) {
      console.error('Error fetching renter data:', error);
    }
  };

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (id:string) => {
    const payload = {
      renter_id: renterIdState,
      month,
      year,
      prevReading,
      currentReading,
      dues,
      totalAmount: (Number(currentReading) - Number(prevReading)) + 120 + Number(dues),
    };

    try {
      const method = mode === 'create' ? 'POST' : 'PUT';
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save bill data');
      console.log('Success:', await response.json());
      handleClose();
    } catch (error) {
      console.error('Error saving bill data:', error);
    }
  };

  const totalAmount = (Number(currentReading) - Number(prevReading)) + 120 + Number(dues);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {mode === 'create' ? 'Create Bill' : 'Edit Bill'}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {mode === 'create' ? 'Enter new bill details' : 'Modify the bill details'}
          </Typography>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="dropdown-label">Select Renter</InputLabel>
              <Select
                labelId="dropdown-label"
                value={renterIdState}
                onChange={(e) => setRenterIdState(e.target.value)}
                disabled={mode === 'edit'} // Disable in edit mode
              >
                {renterIds.map((row) => (
                  <MenuItem key={row.renter_id} value={row.renter_id}>
                    {row.q_no}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Month"
                variant="outlined"
                type="number"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
              <TextField
                fullWidth
                label="Year"
                variant="outlined"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Current Reading"
                variant="outlined"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
              />
              <TextField
                fullWidth
                label="Prev Reading"
                variant="outlined"
                value={prevReading}
                onChange={(e) => setPrevReading(e.target.value)}
              />
            </Box>
            <TextField
              fullWidth
              label="Dues"
              variant="outlined"
              type="number"
              value={dues}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setDues(value);
                }
              }}
            />
            <TextField
              fullWidth
              label="Total Amount"
              variant="outlined"
              value={`₹${totalAmount.toFixed(2)}`}
              InputProps={{ readOnly: true }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}
