const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema= new mongoose.Schema({
  customer:{
    type: new mongoose.Schema({
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
    }),
    required:true
  },
  movie:{
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
      },

      dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
      }
    }),
    required:true
  },
  rentalAmount:{
    type: Number,
    min : 0
  },
  dateOut:{
    type: Date,
    required:true,
    default: Date.now
  },
  dateReturned:{
    type: Date
  }
})


const Rental = mongoose.model('Rental',rentalSchema);
function validateRental(customer) {
  const schema = {                                    // A totally different schema validation using customer id and movie id
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };

  return Joi.validate(customer, schema);
}

module.exports.Rental=Rental;
module.exports.validate=validateRental;