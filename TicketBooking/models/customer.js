const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold:{
    type: Boolean,
    default: false
  },
  phone:{
    type: String,
    required: true,
    maxlength: 10,
    minlength: 10
  }
}));
function validateGenre(customer) {
  const schema = {
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

module.exports.Customer=Customer;
module.exports.validate=validateGenre;