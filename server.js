const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');
const connectDB = require('./config/db.js');

const app = express();
connectDB();

//MIDDLEWARES
app.use(express.json()); //body-parser
app.use(cookieParser()); //cookie-parser
app.use(
  cors({
    origin: config.get('clientURL'),
  })
); //cross-origin resource sharing

//ROUTES
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/category'));
app.use('/api', require('./routes/product'));
app.use('/api', require('./routes/order'));
app.use('/api', require('./routes/payment'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log('Server running....'));
