'use strict'

const expect = require('chai').expect
const ConvertHandler = require('../controllers/convertHandler.js')

module.exports = function (app) {
  let convertHandler = new ConvertHandler()
  app.route('/api/convert').get(function (req, res) {
    var input = req.query.input
    var initNum = convertHandler.getNum(input)
    var initUnit = convertHandler.getUnit(input)
    var returnNum = convertHandler.convert(initNum, initUnit)
    var returnUnit = convertHandler.getReturnUnit(initUnit)
    var string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    )

    if (initUnit == 'invalid unit' && initNum == 'invalid number')
      return res.json('invalid number and unit')
    else if (initUnit == 'invalid unit') return res.json('invalid unit')
    else if (initNum == 'invalid number') return res.json('invalid number')

    var response = {
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string,
    }
    return res.json(response)
  })
}
