'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { NotePencil } from '@phosphor-icons/react';

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

export default function BillsModal(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [renterId, setRenterId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [prevReading, setPrevReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [dues, setDues] = useState('');
  interface Renter {
    renter_id: string;
    q_no: string;
    name: string;
  }

  const [renterIds, setRenterIds] = useState<Renter[]>([]);

  const handleOpen = async () => {
    setOpen(true);
    await fetchRenterIds();
  };

  const handleClose = () => setOpen(false);


  const fetchRenterIds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getRenterId');
      if (!response.ok) throw new Error('Failed to fetch renter IDs');
      const data = await response.json();
      setRenterIds(data as Renter[]);
    } catch (error) {
      console.error('Error fetching renter IDs:', error);
    }
  };

  const handleSubmit = () => {
    const totalAmount = (Number(currentReading) - Number(prevReading)) + 120 + Number(dues);
    console.log('Renter ID:', renterId);
    console.log('Month:', month);
    console.log('Year:', year);
    console.log('Prev Reading:', prevReading);
    console.log('Current Reading:', currentReading);
    console.log('Dues:', dues);
    console.log('Total Amount:', totalAmount);
    handleClose();
  };

  const totalAmount = (Number(currentReading) - Number(prevReading)) + 120 + Number(dues);

  return (
    <div>
      <Button onClick={handleOpen} color="inherit" startIcon={<NotePencil size={32} />} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Modify the bill for the selected renter
          </Typography>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="dropdown-label">Select Renter</InputLabel>
              <Select
                labelId="dropdown-label"
                value={renterId}
                onChange={(e) => setRenterId(e.target.value)}
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
            <Box sx= {{display: 'flex', gap:2}}
            >

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
              value={`₹${  totalAmount.toFixed(2)}`}
              InputProps={{ readOnly: true }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
