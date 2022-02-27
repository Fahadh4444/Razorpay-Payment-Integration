const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();


//* MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



   
//* PORT
const port = process.env.PORT || 8000;

//* STARTING SERVER
app.listen(port, () => {
    console.log(`App is running at ${port}`);
});