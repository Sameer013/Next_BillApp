const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const routes = require('./routes/billsRoute');

app.use(cors());
app.use('/api',routes)

app.listen(port,()=>{
    console.log(`Server Listening on port ${port}...`)
})