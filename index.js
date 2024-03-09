
require('dotenv').config();
const express = require('express');
var cors = require('cors');
const connectToMoongoose = require('./db');

const app = express();

app.use(cors());

connectToMoongoose();

app.use(express.json());

app.use('/api/admin', require('./routers/admin'));
app.use('/api/worker', require('./routers/workerkormi'));
app.use('/api/track', require('./routers/trackeRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World!');
  })

app.listen(process.env.PORT, ()=>{
    console.log(` backend app listening on localhost:${process.env.PORT}`);
})

