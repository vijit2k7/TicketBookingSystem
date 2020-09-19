const Joi = require('joi');
const mongoose = require('mongoose');
const ticket=require('./ticket')

const Booking = mongoose.model('Booking', new mongoose.Schema({
  passFirstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  passLastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  passPhoneNumber: {
    type: String,
    required: true,
    maxlength: 10,
    minlength: 10
  },
  passEmail: {
    type: String,
    required: true
  },
  ticket: {
    type: ticket.ticketSchema,
    required: true
  },
  dateOfBooking:{
    type: Date,
    default: Date.now
  },
  seatType: {
      type: String,
      enum: ['AC','N/AC']
  }

}));
function validateBooking(booking) {
  const schema = {
    passFirstName: Joi.string().min(3).max(50).required(),
    passLastName: Joi.string().min(3).max(50).required(),
    seatNumber: Joi.number().min(1).max(40).required(),     // we dont put ticket object here instead we put the id so as to recognize the ticket
    passPhoneNumber: Joi.string().min(10).max(10).required(),
    passEmail:Joi.string().required().email(),  // to verify if the email is correct or not
    seatType: Joi.string().valid('AC','N/AC',"")
  };

  return Joi.validate(booking, schema);
}

module.exports.Booking=Booking;
module.exports.validate=validateBooking;