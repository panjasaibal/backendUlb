

const express = require('express');
var cors = require('cors');
const connectToMoongoose = require('./db');

const PORT = 5000;
const app = express();

app.use(cors());

connectToMoongoose();

app.use(express.json());

app.use('/api/admin', require('./routers/admin'));
app.use('/api/worker', require('./routers/workerkormi'));

app.get('/', (req, res) => {
    res.send('Hello World!');
  })

app.listen(PORT, ()=>{
    console.log(` backend app listening on localhost:${PORT}`);
})

