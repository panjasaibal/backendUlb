
require('dotenv').config();
const express = require('express');
var cors = require('cors');
const connectToMoongoose = require('./db');
const errorLogger = require('./middleware/errorLogger.middleware');

const app = express();

app.use(cors());

connectToMoongoose();

app.use(express.json());

app.use('/api/super', require('./routers/superAdmin.route'));
app.use('/api/admin', require('./routers/admin.router'));
app.use('/api/supervisor', require('./routers/superVisor.routes'));
app.use('/api/worker', require('./routers/workerkormi'));
app.use('/api/track', require('./routers/trackeRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World!');
  })

app.use(errorLogger);

app.listen(process.env.PORT, ()=>{
    console.log(` backend app listening on localhost:${process.env.PORT}`);
})

