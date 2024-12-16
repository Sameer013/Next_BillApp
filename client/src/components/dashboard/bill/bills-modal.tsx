'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
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
}

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

export default function BillsModal(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  return (
    <div>
      <Button onClick={handleOpen} color="inherit"  startIcon={<NotePencil size={32}/>}/>
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
           Hello this is Modal
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
