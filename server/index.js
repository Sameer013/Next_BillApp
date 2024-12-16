const express = require('express');
const cors = require('cors');
const app = express();

const port = 5000;
app.use(cors());

// app.get("/getInfo",(req,res)=>{
//     res.send("Hello Sameer!!");
// })

app.get("/getInfo", (req, res) => {
    const customers = [
        {
            id: "USR-010",
            name: "Alcides Antonio",
            avatar: "/assets/avatar-10.png",
            email: "alcides.antonio@devias.io",
            phone: "908-691-3242",
            address: {
                city: "Madrid",
                country: "Spain",
                state: "Comunidad de Madrid",
                street: "4158 Hedge Street"
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "USR-009",
            name: "Marcus Finn",
            avatar: "/assets/avatar-9.png",
            email: "marcus.finn@devias.io",
            phone: "415-907-2647",
            address: {
                city: "Carson City",
                country: "USA",
                state: "Nevada",
                street: "2188 Armbrester Drive"
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "USR-008",
            name: "Jie Yan",
            avatar: "/assets/avatar-8.png",
            email: "jie.yan.song@devias.io",
            phone: "770-635-2682",
            address: {
                city: "North Canton",
                country: "USA",
                state: "Ohio",
                street: "4894 Lakeland Park Drive"
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "USR-007",
            name: "Nasimiyu Danai",
            avatar: "/assets/avatar-7.png",
            email: "nasimiyu.danai@devias.io",
            phone: "801-301-7894",
            address: {
                city: "Salt Lake City",
                country: "USA",
                state: "Utah",
                street: "368 Lamberts Branch Road"
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "USR-006",
            name: "Iulia Albu",
            avatar: "/assets/avatar-6.png",
            email: "iulia.albu@devias.io",
            phone: "313-812-8947",
            address: {
                city: "Murray",
                country: "USA",
                state: "Utah",
                street: "3934 Wildrose Lane"
            },
            createdAt: new Date().toISOString(),
        }
    ];

    res.json(customers);
});


app.listen(port,()=>{
    console.log(`Server Listening on port ${port}...`)
})