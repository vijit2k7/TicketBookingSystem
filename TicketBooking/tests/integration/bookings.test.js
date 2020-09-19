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

 describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let booking;

    const exec = async () => {
      return await request(server)
        .post('/api/bookings')
        .set('x-auth-token', token)
        .send(booking);
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
	  booking={
		  	passFirstName: 'vijit',
		  	passLastName:'mishra',
		  	passPhoneNumber:'9013523717',
		  	passEmail:'vijit2k7@yahoo.in',
		  	ticket:{ seatNumber:1},
		  	seatType: 'AC'
		}; 
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if passenger First Name is less than 3 characters', async () => {
      booking.passFirstName = '12'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if passenger Last Name is less than 3 characters', async () => {
      booking.passLastName = '12'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if passenger First Name is more than 50 characters', async () => {
      booking.passFirstName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if passenger Last Name is more than 50 characters', async () => {
      booking.passLastName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if passenger Phone number is less than 10 characters', async () => {
      booking.passPhoneNumber = new Array(8).join('9');

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if passenger Phone number is more than 10 characters', async () => {
      booking.passPhoneNumber = new Array(12).join('9');

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if passenger Email is invalid', async () => {
      booking.passEmail = 'abcd'

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if seat number is less than 1', async () => {
      booking.ticket.seatNumber = 0

      const res = await exec();

      expect(res.status).toBe(400);
    });
    //
    it('should return 400 if seat number is more than 40', async () => {
      booking.ticket.seatNumber = 41

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it('should save the booking if it is valid', async () => {
      await exec();

      const booking = await Booking.find({ passFirstName: 'vijit' });

      expect(booking).not.toBeNull();
    });
  });
 describe('DEL /:id', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let booking;
    let id;

    const exec = async () => {
      return await request(server)
        .delete('/api/bookings/'+id)
        .set('x-auth-token', token)
        .send();
    }
//
    beforeEach(async () => {
      token = new User({isAdmin :true}).generateAuthToken();      
	  booking=new Booking({
		  	passFirstName: 'vijit',
		  	passLastName:'mishra',
		  	passPhoneNumber:'9013523717',
		  	passEmail:'vijit2k7@yahoo.in',
		  	ticket:{ seatNumber:1},
		  	seatType: 'AC'
		}); 
	  //First saving the newly created booking in the database
	  await booking.save();
  	  id=booking._id;
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; 
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });
    it('should return 404 if no booking with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the booking if input is valid', async () => {
      await exec();

      const bookingInDb = await Booking.findById(id);

      expect(bookingInDb).toBeNull();
    });
  });
 });