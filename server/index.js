const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const routes = require('./routes/billsRoute');



app.use(cors());
app.use('/api',routes)

app.get("/getInfo", (req, res) => {
    const customers = [
        {
            id: '1',
            renter_id: '01',
            cur_read: '1206',
            prev_read: '1109',
            consumed: '103',

            dues: '0',
            total: '841',
          },
          {
            id: '2', 
            renter_id: '04', 
            cur_read: '123059',
            prev_read: '123109', 
            consumed: '149',
            dues: '540',
            total: '1032',
          }
    ];

    res.json(customers);
});





app.listen(port,()=>{
    console.log(`Server Listening on port ${port}...`)
})