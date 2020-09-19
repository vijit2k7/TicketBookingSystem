const config=require('config');
const jwt=require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
      },
      email: {
        type: String,
        unique: true,
        required: true
      },
      password:{
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255
      },
      phone: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10
      },
      isAdmin: {
        type: Boolean,
        default: false
  }

});
userSchema.methods.generateAuthToken=function(){   //Note can't use arrow function here as this obj wont refer to the user obj.
    const token= jwt.sign({id: this._id , isAdmin: this.isAdmin},config.get('jwtPrivateKey'));  //Encapsulating the mongoose auth token logic in the model.
    return token;
}
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().required(),     // we dont put genre here instead we put the id so as to recognize the genre
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(10).max(10).required(),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

module.exports.User=User;
module.exports.validate=validateUser;