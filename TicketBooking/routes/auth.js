const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User}=require('../models/user');

router.get('/',async (req,res)=>{
  const customers = await User.find().sort('name');
  res.send(customers);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user =await User.findOne ({"email":req.body.email})
  if(!user) return res.status(400).send('Invalid email or password!'); 

  const validPassword=await bcrypt.compare(req.body.password,user.password);
  console.log("valid password is",validPassword)
  if(!validPassword) return res.status(400).send('Invalid email or password!');

  res.send(true);


});

function validate(user) {
  const schema = {
    email: Joi.string().required(),     // we dont put genre here instead we put the id so as to recognize the genre
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;