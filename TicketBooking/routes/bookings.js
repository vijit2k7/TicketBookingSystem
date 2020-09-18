const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Booking,validate}=require('../models/booking');
const {Ticket} = require('../models/ticket'); // To find the ticket by ticket id


router.get('/', async (req, res) => {
  const bookings = await Booking.find().sort('passFirstName');
  res.send(bookings);
});

router.post('/',auth,async (req, res) => {   //adding a middleware auth so that only authenticated users can do a booking.
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let ticket= await Ticket.findOne({seatNumber: req.body.seatNumber});
  if(ticket.status) return res.status(404).send('Ticket is already closed try for another seat.');

  let booking = new Booking({ 
    passFirstName: req.body.passFirstName,
    passLastName: req.body.passLastName,
    passEmail: req.body.passEmail,
    passPhoneNumber: req.body.passPhoneNumber,
    ticket: {
      seatNumber : ticket.seatNumber,
      status : ticket.status
    },
    dateOfBooking:req.body.dateOfBooking,
    seatType:req.body.seatType
   });
  ticket = await Ticket.update({"seatNumber":req.body.seatNumber}, {$set:{ "status": true } });
  console.log("ticket after update",ticket);
  booking = await booking.save();
  
  res.send(booking);
});

router.delete('/:id', [auth,admin],async (req, res) => {     //adding 2 middlewares auth and admin so as to authenticate and authorise admin users
  const booking = await Booking.findByIdAndRemove(req.params.id);

  if (!booking) return res.status(404).send('The booking with the given ID was not found.');
  const ticket = await Ticket.updateOne({"seatNumber":booking.ticket.seatNumber}, {$set:{ "status": false } });
  res.send(booking);
});

router.get('/:id', async (req, res) => {

  //to check if we are passing a valid object id
  if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');

  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).send('The booking with the given ID was not found.');

  res.send(booking);
});

module.exports=router;