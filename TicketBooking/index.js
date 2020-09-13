const mongoose = require('mongoose');
const tickets = require('./routes/tickets');
const users = require('./routes/users');
const bookings = require('./routes/bookings');
//const rentals = require('./routes/rentals');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/ticketBooking')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/tickets', tickets);
app.use('/api/users', users);
app.use('/api/bookings', bookings);
//app.use('/api/rentals', rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
