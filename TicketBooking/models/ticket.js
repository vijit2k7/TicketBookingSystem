const Joi = require('joi');
const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 40
  },
  status:{
    type: Boolean,
    default: false
  }
});
const Ticket = mongoose.model('Ticket', ticketSchema);
function validateTicket(ticket) {
  const schema = {
    seatNumber: Joi.number().min(1).max(40).required()
  };

  return Joi.validate(ticket, schema);
}


module.exports.Ticket=Ticket;
module.exports.validate=validateTicket;
module.exports.ticketSchema=ticketSchema;