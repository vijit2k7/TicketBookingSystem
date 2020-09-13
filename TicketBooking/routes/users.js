const Joi = require('joi');
const mongoose = require('mongoose');
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
  user = await user.save();

  res.send(_pick(user,['name','email','phone']));
});

module.exports = router;