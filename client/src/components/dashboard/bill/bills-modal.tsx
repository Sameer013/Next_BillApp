
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Necessary to handle dynamic data assignment from API responses */
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';
import { Checkbox } from '@mui/material';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const out = getStreamSomehow();
// const err = getStreamSomehow();
// const Console = new console.Console(out, err);


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
};


interface BillsModalProps {
  mode: 'create' | 'edit' | 'delete' | '';
  apiEndpoint?: string;
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Receive state setter
  renterId?: string;
  onComplete? : () => void;
}

export default function BillsModal({ mode, apiEndpoint, open, setOpen, renterId, onComplete }: BillsModalProps): React.JSX.Element {
  
  
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
  const [isPaid, setIsPaid] = useState(false);
  useEffect(() => {

    if(open){
      if (mode === 'create' && !renterId) {
        void fetchRenterIds(); 
      }  
      if (mode === 'edit' && renterId){
        void fetchRenterData(renterId);
      }
      
    }
    
   if(renterIdState){ handlePrevDue(); }
 }, [open, mode, renterId, renterIdState]);
  

  const fetchRenterIds = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/getRenterId`); // Fetch renter IDs
      if (!response.ok) throw new Error('Failed to fetch renter IDs');
      
      const data:Renter[] = await response.json();
      // console.log('Renter IDs:', data);
      setRenterIds(data);
    } catch (error) {
      console.error('Error fetching renter IDs:', error);
    }
  };

  const fetchRenterData = async (id: string) => {
  
    try { 
      const response = await fetch(`${baseUrl}/api/getRenter/${id}`);
      if (!response.ok) throw new Error('Failed to fetch renter data');
      const data: Renter[] = await response.json();
      setRenterIds(data);

      // Console.log(`Renter data for id-> ${id}:`,data);
      
      const row = data[0];
      setRenterIdState(row.renter_id);
      setBillsId(row.bill_id);
      // Console.log(row);
      setMonth(row.month);
      setYear(row.year);
      setPrevReading(String(row.prev_reading));
      setCurrentReading(String(row.curr_reading));
      setDues(String(row.previous_due));
      setTotalAmount(row.total_due);
      setIsPaid(row.is_paid);
      
    } catch (error) {
      console.error('Error fetching renter data:', error);
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
      is_paid: isPaid,
  
    };


    try {
      const method = mode === 'create' ? 'POST' : 'PUT';
      const url = mode === 'create' ? `${apiEndpoint}/insertRenter` : `${apiEndpoint}/updateRenter/${id}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save bill data');
      // Console.log('Success:', await response.json());
      

      // console.log('Inside handleSubmit');
      // console.log(payload)
      onComplete?.(); // Call onComplete if provided
      handleClose();
    } catch (error) {
      // Console.error('Error saving bill data:', error);
    }
  };

  const ruppeSymbol = '₹';

  const handlePrevDue = () => {
    if (mode === 'create' && renterIdState) {
      const renter = renterIds.find(renter => renter.renter_id === renterIdState);
      if (renter) {
        setPrevReading(String(renter.prev_reading));
        setPrevDue(String(renter.previous_due));
      }
    }
  
  };

  const handleDelete = async () => {
    //  console.log(process.env.NEXT_PUBLIC_API_URL);
      // MySwal.fire({
      //   title: "Are you sure?",
      //   text: "You won't be able to revert this!",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#3085d6",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Yes, delete it!",
      //   customClass:{
      //     popup: 'swal2-high-zindex',
      //   }
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     MySwal.fire({
      //       title: "Deleted!",
      //       text: "Your file has been deleted.",
      //       icon: "success"
      //     })
      //     .catch((error) =>{
      //         console.error('Error deleting bill data:', error)});
      //   }
      // }).catch((error) => {console.error('Error deleting bill data:', error);});

  
    // try {
    //   const response = await fetch(`${apiEndpoint}/deleteRenter/${id}`, { method: 'DELETE' });
    //   if (!response.ok) throw new Error('Failed to delete bill data');
    //   console.log('Success:', await response.json());
    //   onComplete?.();
    //   handleClose();
    // } catch (error) {
    //   console.error('Error deleting bill data:', error);
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
            {mode === 'edit' ? (<><TextField
              fullWidth
              label="Total Amount"
              variant="outlined"
              value={`${ruppeSymbol}${totalAmount.toFixed(2)}`}
              InputProps={{ readOnly: true }}
              

            />
            <Typography variant="body2" sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
             Payment Status 
            <Checkbox 
            checked={isPaid} 
            onChange={()=> {setIsPaid(!isPaid)} } 
            sx={{ color: isPaid ? 'green' : 'red',
                  textAlign: 'center'
                  
                  }} />
            <Typography variant="inherit"
            sx={{ color: isPaid ? 'green' : 'red',
                  width: '6rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease', 
                  animation: `${isPaid ? 'fadeIn' : 'fadeOut'} 0.3s ease-in-out`, 

            }}>
              {isPaid ? 'PAID' : 'UNPAID'}
                
            </Typography> 
            </Typography>
            </>
            ) : null}

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'space-between' }}>
            {mode === 'edit'? (<Button variant="contained" color="secondary" onClick={() => handleDelete()}>
              Delete
            </Button>) : null}
            
           
            <Button variant="contained" color="primary" sx={{ ml: 'auto'}} onClick={() => handleSubmit(billsId)}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}


