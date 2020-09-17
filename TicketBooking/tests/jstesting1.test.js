/* globals describe, expect, it */
const lib =require('../jstesting1');

describe('fizzbuzz',()=>{

	it('testing for a positive number which is multiple of 3',()=>{
		expect(lib.fizzBuzz(3)).toBe('Fizz');
	});
	it('testing for a positive number which is multiple of 5',()=>{
		expect(lib.fizzBuzz(5)).toBe('Buzz');
	});
	it('testing for a positive number which is multiple of 15',()=>{
		expect(lib.fizzBuzz(15)).toBe('FizzBuzz');
	});
});