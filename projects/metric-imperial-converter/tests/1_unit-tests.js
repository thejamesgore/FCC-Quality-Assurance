const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      let input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      let input = '3.123gal'
      assert.equal(convertHandler.getNum(input), 3.123);
      done();
    });
    
    test('Fractional Input', function(done) {
      let input = '123/12gal'
      assert.equal(convertHandler.getNum(input), 10.25);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      let input = '1.5/0.75gal'
      assert.equal(convertHandler.getNum(input), 2, 0.1);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      let input = '1.5/0.75/12gal'
      assert.equal(convertHandler.getNum(input), "invalid number");
      done();
    });
    
    test('No Numerical Input', function(done) {
      let input = 'mi'
      assert.equal(convertHandler.getNum(input), 1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      let input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      let expected = ['gal','L','mi','km','lbs','kg','gal','L','mi','km','lbs','kg']
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getUnit(23 + ele), expected[i]);
        
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      let input = 'unknown'
      assert.equal(convertHandler.getUnit(input), 'invalid unit');
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      let input = ['mi', 'km', 'gal', 'L', 'lbs', 'kg'];
      let result = ['km', 'mi', 'L', 'gal', 'kg', 'lbs'];
      input.forEach((val, i) => assert.equal(convertHandler.getReturnUnit(val), result[i]));
      done();
      });
      
    });
    
  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      let input = ['mi', 'km', 'gal', 'l', 'lbs', 'kg'];
      let result = ['miles', 'kilometers', 'gallons', 'liters', 'pounds', 'kilograms'];
      input.forEach((val, i) => assert.equal(convertHandler.spellOutUnit(val), result[i]));
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      let input = [5, 'gal'];
      let expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); 
      done();
    });
    
    test('L to Gal', function(done) {
      let input = [5, 'L'];
      let expected = 1.32086;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();
      
    });
    
    test('Mi to Km', function(done) {
      let input = [1, 'mi'];
      let expected = 1.60934;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();
    
    });
    
    test('Km to Mi', function(done) {
      let input = [2, 'km'];
      let expected = 1.24274;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();

    });
    
    test('Lbs to Kg', function(done) {
      let input = [3, 'lbs'];
      let expected = 1.36077;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();
      //done();
    });
    
    test('Kg to Lbs', function(done) {
      let input = [4, 'kg'];
      let expected = 8.81849;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();
      //done();
    });
    
  });

}); 