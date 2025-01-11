'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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

const baseUrl = process.env.API_URL ||'http://localhost:5000';

interface Renter {
  bill_id: string,
  renter_id: string,
  month: number,
  year: number,
  prev_reading: number,
  curr_reading: number,
  units_consumed: number,
  units_rate: number,
  electricity_cost: number,
  water_bill: number,
  total_due: number,
  previous_due: number,
  is_paid: boolean,
  payment_date: string,
}


interface BillsModalProps {
  mode: 'create' | 'edit' | 'delete' | '';
  apiEndpoint?: string;
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Receive state setter
  renterId?: string;
  onComplete? : () => void;
}

export default function BillsModal({ mode, apiEndpoint, open, setOpen, renterId, onComplete }: BillsModalProps): React.JSX.Element {
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renterIds, setRenterIds] = useState<Renter[]>([]);
  const [renterIdState, setRenterIdState] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); 
  const [year, setYear] = useState(new Date().getFullYear()); 
  const [prevReading, setPrevReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const [dues, setDues] = useState('');
  const [prevDue, setPrevDue] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [billsId, setBillsId] = useState('');
  useEffect(() => {

    if(open){
      if (mode === 'create' && !renterId) {
        void fetchRenterIds(); 
      }  
      // handlePrevDue();
      
      if (mode === 'edit' && renterId){
        void fetchRenterData(renterId);
      }
      
    }
   if(renterIdState){ handlePrevDue(); }
 }, [open, mode, renterId, renterIdState]);

  // useEffect(() => {
  //   if (open) {
  //     setTotalAmount((Number(currentReading) - Number(prevReading)) + 120 + Number(dues));
  //   }
  // }, [open, prevReading, currentReading, dues]);
      
  // const resetState = () => {
  //   setRenterIdState('');
  //   setMonth(new Date().getMonth() + 1);
  //   setYear(new Date().getFullYear());
  //   setPrevReading('');
  //   setCurrentReading('');
  //   setDues('');
  //   setTotalAmount(0);
  //   setLoading(false); // Reset loading
  // };

  

  const fetchRenterIds = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/getRenterId`); // Fetch renter IDs
      if (!response.ok) throw new Error('Failed to fetch renter IDs');
      
      const data = await response.json();
      // console.log('Renter IDs:', data);
      setRenterIds(data as Renter[]);
      // setPrevDue(String(renterIds.find(renter => renter.renter_id === renterIdState)?.previous_due || '0'))
    } catch (error) {
      console.error('Error fetching renter IDs:', error);
    }
  };

  const fetchRenterData = async (id: string) => {
  setLoading(true);
    try { 
      const response = await fetch(`${baseUrl}/api/getRenter/${id}`);
      if (!response.ok) throw new Error('Failed to fetch renter data');
      const data = await response.json();
      setRenterIds(data as Renter[]);

      console.log(`Renter data for id-> ${id}:`,data);
      
      let row = data[0];
      setRenterIdState(row.renter_id);
      setBillsId(row.bill_id);
      console.log(row);
      setMonth(row.month);
      setYear(row.year);
      setPrevReading(row.prev_reading);
      setCurrentReading(row.curr_reading);
      setDues(row.previous_due);
      setTotalAmount(row.total_due);
      
    } catch (error) {
      console.error('Error fetching renter data:', error);
    }
    finally{
      setLoading(false);
    }
  };


  const handleClose = () => { setOpen(false); };


  const handleSubmit = async (id:string) => {
    
    const payload = {
      renter_id: renterIdState,
      month,
      year,
      prev_reading: prevReading,
      curr_reading: currentReading,
      
      previous_due: Number(dues) + Number(prevDue) || 0,
  
    };

    console.log('Payload:', payload);

    try {
      const method = mode === 'create' ? 'POST' : 'PUT';
      const url = mode === 'create' ? `${apiEndpoint}/insertRenter` : `${apiEndpoint}/updateRenter/${id}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save bill data');
      console.log('Success:', await response.json());

      onComplete?.();
      console.log("onComplete called!");
      handleClose();
    } catch (error) {
      console.error('Error saving bill data:', error);
    }
  };

  // const totalAmount = (Number(currentReading) - Number(prevReading)) + 120 + Number(dues);
  const ruppeSymbol = '₹';

  const handlePrevDue = () => {
    if (mode === 'create' && renterIdState) {
      const renter = renterIds.find(renter => renter.renter_id === renterIdState);
      if (renter) {
        setPrevReading(String(renter.prev_reading));
        setMonth(renter.month);
        setYear(renter.year);
        setPrevDue(String(renter.previous_due));
      }
    }
  
  };
  



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
                {/* <InputLabel id="dropdown-label">Select Renter</InputLabel> */}
                <TextField
                select
                label={mode === 'create' ? "Select Renter" : "Edit Renter"}
                value={renterIdState}
                onChange={(e) => {
                  setRenterIdState(e.target.value);
                }}
                disabled={mode === 'edit'} // Disable in edit mode
                >
                
                {renterIds.map((row) => (
                  <MenuItem key={row.renter_id} value={row.renter_id}>
                  0{row.renter_id} {/* Added 0 for aesthetics */}
                  </MenuItem>
                ))}
                
                </TextField>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Month"
                variant="outlined"
                type="number"
                value={month}
                onChange={(e) => {setMonth(Number(e.target.value))}}
              />
              <TextField
                fullWidth
                label="Year"
                variant="outlined"
                type="number"
                value={year}
                onChange={(e) => { setYear(Number(e.target.value)) }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Current Reading"
                variant="outlined"
                value={currentReading}
                onChange={(e) => {setCurrentReading(e.target.value)}}
              />
              <TextField
                fullWidth
                label="Prev Reading"
                variant="outlined"
                value={prevReading}
                onChange={(e) => {setPrevReading(e.target.value)}}
              />
            </Box>
            {mode === 'create' && (
              <TextField
                fullWidth
                label={`Previous Dues (${ruppeSymbol})`}
                variant="outlined"
                type="number"
                value={prevDue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setDues(value);
                  }
                }}
              />
              )}
            <TextField
              fullWidth
              label={`Dues (${ruppeSymbol})`}
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
            {mode === 'edit' ? (<TextField
              fullWidth
              label="Total Amount"
              variant="outlined"
              value={`${ruppeSymbol}${totalAmount.toFixed(2)}`}
              InputProps={{ readOnly: true }}
              

            />): null}
            {/* <TextField
              fullWidth
              label="Total Amount"
              variant="outlined"
              value={`${ruppeSymbol}${totalAmount.toFixed(2)}`}
              InputProps={{ readOnly: true }}
              

            /> */}
            <Button variant="contained" color="primary" onClick={() => handleSubmit(billsId)}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}
