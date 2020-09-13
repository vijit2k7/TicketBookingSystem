const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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

  user = new User({ 
  		name: req.body.name, 
  		email: req.body.email, 
  		password: req.body.password,
  		phone: req.body.phone
  	});
  user = await user.save();

  res.send(user);
});

module.exports = router;