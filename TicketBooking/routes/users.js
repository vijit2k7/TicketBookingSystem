const config=require('config');
const jwt=require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User,validate}=require('../models/user');

router.get('/',async (req,res)=>{
  const customers = await User.find().sort('name');
  res.send(customers);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findOne ({"email":req.body.email},function(err,obj) 
  { 
  	console.log("user object after find one",obj);
  	if(obj) return res.status(400).send('The user is already registered'); 
  });

  user = new User(_.pick(req.body,['name','email','password','phone']));
  const salt=await bcrypt.genSalt(10);    //Creating an encrypted salt
  user.password=await bcrypt.hash(user.password,salt);   //hashing the password using the salt

  user = await user.save();

  //We need to send the authorisation jwt token in the headers
  const token=jwt.sign({id: user._id},config.get('jwtPrivateKey'));

  res.header('x-auth-token',token).send(_.pick(user,['name','email','phone']));
});

module.exports = router;