const request =require('supertest'); // to send request to the test db
const {Booking} = require('../../models/booking');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const {Ticket} = require('../../models/ticket');

let server;

describe('api/bookings',()=>{

	beforeEach(()=>{server = require('../../index'); });   //jest will call this function before each test of the test suite
	afterEach(async ()=>{
		server.close();
		await Booking.remove({});
	});

	  describe('GET /', () => {
	    it('should return all bookings', async () => {
	      const bookings = [
	        { passFirstName: 'fname1',passLastName:'lname1',passPhoneNumber:'ph1',passEmail:'email1'},
	        { passFirstName: 'fname2',passLastName:'lname2',passPhoneNumber:'ph2',passEmail:'email2'}
	      ];
	      
	      await Booking.collection.insertMany(bookings);
//
	      const res = await request(server).get('/api/bookings');
	      
	      expect(res.status).toBe(200);
	      expect(res.body.length).toBe(2);
	      expect(res.body.some(g => g.passFirstName === 'fname1')).toBeTruthy();
	      expect(res.body.some(g => g.passFirstName === 'fname2')).toBeTruthy();
	    });
	  });

//
  describe('GET /:id', () => {
    it('should return a booking if valid id is passed', async () => {

      //const ticket=new Ticket({seatNumber:1});
      const booking = new Booking(
      { 
      	passFirstName: 'fname1',
      	passLastName:'lname1',
      	passPhoneNumber:'1234567890',
      	passEmail:'email1',
      	ticket:{ seatNumber:1}
      });
      await booking.save();
//
      const res = await request(server).get('/api/bookings/' + booking._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('passFirstName', booking.passFirstName);
      expect(res.body).toHaveProperty('passLastName', booking.passLastName);
      expect(res.body).toHaveProperty('passPhoneNumber', booking.passPhoneNumber);
      expect(res.body).toHaveProperty('passEmail', booking.passEmail); 
      //expect(res.body).toHaveProperty('ticket', booking.ticket);    
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/bookings/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/bookings/' + id);

      expect(res.status).toBe(404);
    });
  });
 

 });