const config=require('config');
const mongoose = require('mongoose');
const tickets = require('./routes/tickets');
const users = require('./routes/users');
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

//We will check if the jwt private key is defined or not and if not defined we will exit the process
if(!config.get('jwtPrivateKey'))
{
	console.log(config.db)
	process.exit(1);  //1 to exit the app
}
const db = config.get('db');
mongoose.connect(db)
  .then(() => console.log(`Connected to ${db}...`))
  .catch(err => console.error(`Could not connect to ${db}...`));

app.use(express.json());
app.use('/api/tickets', tickets);
app.use('/api/users', users);
app.use('/api/bookings', bookings);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports=server;
