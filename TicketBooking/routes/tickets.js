const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Ticket,validate}=require('../models/ticket');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
  const tickets = await Ticket.find().sort('seatNumber');
  res.send(tickets);
});

router.post('/', [auth,admin],async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let ticket = await Ticket.findOne({seatNumber:req.body.seatNumber});   //Checking if we are not entering a duplicate seat number as seat number is unique.
  if (ticket) return res.status(400).send('Ticket already present');


  ticket = new Ticket({ seatNumber: req.body.seatNumber,status: req.body.status });
  ticket = await ticket.save();
  
  res.send(ticket);
});

//Only admin will have the access
router.post('/all', [auth,admin],async (req, res) => {
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  let ticket;
  for (let i =1;i<41;i++)
  {
      ticket = await Ticket.findOne({seatNumber:i});
      if(!ticket)
      {
        ticket = new Ticket({ seatNumber: i});
        ticket = await ticket.save();
      }
  }
  
  res.send(ticket);
});

//To reset all tickets to false
router.post('/reset', [auth,admin],async (req, res) => {
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  const ticket = await Ticket.updateMany({}, {$set:{ "status": false } });
  console.log("ticket after update",ticket);
  if (!ticket) return res.status(404).send('Resetting all the tickets failed!');
  
  res.send('All the tickets were reset successfully!!');
});

router.get('/:status', async (req,res) => {

  //console.log("type of req params is",typeof req.params.status);
  // if(typeof req.params.status == 'boolean') return res.status(400).send('Invalid request params');

  const tickets = await Ticket.find({status: req.params.status}).sort('seatNumber');
  res.send(tickets);

});
//Only admin will have the access
router.put('/:seatNumber',[auth,admin], async (req, res) => {
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  const ticket = await Ticket.updateOne({"seatNumber":req.params.seatNumber}, {$set:{ "status": req.body.status } });
  console.log("ticket after update",ticket);
  if (!ticket) return res.status(404).send('The ticket with the given Seat Number was not found.');
  
  res.send(ticket);
});




module.exports = router;