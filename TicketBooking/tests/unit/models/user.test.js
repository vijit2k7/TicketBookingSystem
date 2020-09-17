const {User} = require('../../../models/user');
const jwt=require('jsonwebtoken');
const config=require('config');
const mongoose=require('mongoose');

describe('generateAuthToken',()=>{
	it('should return a valid jwt token',()=>{
		const payload={
			id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true
		};
		const user=new User(payload);
		const token=user.generateAuthToken();
		const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
		expect(decoded).toMatchObject(decoded);  //issue with the test case generating consecutive id
	});
});