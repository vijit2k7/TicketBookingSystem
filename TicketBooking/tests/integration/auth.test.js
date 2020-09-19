const {User} = require('../../models/user');
const {Booking} = require('../../models/booking');
const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await Booking.remove({});
    server.close(); 
  });

  let token; 

  const exec = () => {
    return request(server)
      .post('/api/bookings')
      .set('x-auth-token', token)
      .send({
        passFirstName: 'vijit',
        passLastName:'mishra',
        passPhoneNumber:'9013523717',
        passEmail:'vijit2k7@yahoo.in',
        ticket:{ seatNumber:1},
        seatType: 'AC'
    });
  }

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});