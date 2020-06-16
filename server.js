const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();
connectDB();

//MIDDLEWARES
app.use(express.json()); //body-parser
app.use(cookieParser()); //cookie-parser
app.use(cors()); //cross-origin resource sharing

//ROUTES

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log('Server running....'));
