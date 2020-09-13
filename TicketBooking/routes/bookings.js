const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Booking,validate}=require('../models/booking');
const {Ticket} = require('../models/ticket'); // To find the ticket by ticket id


router.get('/', async (req, res) => {
  const bookings = await Booking.find().sort('passFirstName');
  res.send(bookings);
});

router.post('/', async (req, res) => {
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

module.exports=router;