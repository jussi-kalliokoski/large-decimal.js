should = require 'should'
D = require '../src/index.js'

describe 'Decimal', ->
  describe '.cropZeroes', ->
    it 'should crop zeroes from the beginning of a string', ->
      D.cropZeroes('00123').should.equal '123'
      D.cropZeroes('0123.0001').should.equal '123.0001'
      D.cropZeroes('0.1').should.equal '0.1'
      D.cropZeroes('0').should.equal '0'
      D.cropZeroes('00000').should.equal '0'

    it 'should crop zeroes from the end of a string', ->
      D.cropZeroes('0.0').should.equal('0.0')
      D.cropZeroes('0.10').should.equal('0.1')
      D.cropZeroes('1.0').should.equal('1.0')

  describe '.padZeroes', ->
    it 'should pad a number with zeroes until at specified length', ->
      D.padZeroes(123, 5).should.equal '00123'
      D.padZeroes(123, 4).should.equal '0123'
      D.padZeroes(123, 3).should.equal '123'
      D.padZeroes(123, 2).should.equal '123'
      (-> D.padZeroes(123, 1)).should.throw()
      (-> D.padZeroes(123, 0)).should.throw()

  describe '.padDecimals', ->
    it 'should shift a string by a specified to be of a specified power of ten', ->
      D.padDecimals('123', 5).should.equal(12300)
      D.padDecimals('123', 4).should.equal(1230)
      D.padDecimals('123', 3).should.equal(123)
      D.padDecimals('123', 2).should.equal(12.3)
      D.padDecimals('123', 1).should.equal(1.23)
      D.padDecimals('123', 0).should.equal(0.123)

  describe '.fromString', ->
    it 'should create a new Decimal from a String', ->
      D.fromString('123').should.be.instanceOf D

    it 'should create a valid Decimal', ->
      D.fromString('0')._data.toString().should.equal '0'
      D.fromString('0')._point.should.equal 1

  describe '.fromNumber', ->
    it 'should create a new Decimal from a Number', ->
      D.fromNumber(123).should.be.instanceOf D

    it 'should create a valid Decimal', ->
      D.fromNumber(123)._data.toString().should.equal '123'
      D.fromNumber(123)._point.should.equal 1

  describe '[[constructor]]', ->
    it 'should create new Decimals from Strings', ->
      D('123').should.be.instanceOf D
      D('123')._data.toString().should.equal '123'
      D('123')._point.should.equal 1

    it 'should create new Decimals from Numbers', ->
      D(123).should.be.instanceOf D
      D(123)._data.toString().should.equal '123'
      D(123)._point.should.equal 1

    it 'should create a zeroed Decimal from Undefined', ->
      D().should.be.instanceOf D
      D(123)._data.toString().should.equal '123'
      D(123)._point.should.equal 1

    it 'should throw for invalid arguments', ->
      (-> D(true)).should.throw('Invalid arguments')
      (-> D({})).should.throw('Invalid arguments')
      (-> D([])).should.throw('Invalid arguments')
      (-> D(null)).should.throw('Invalid arguments')

  describe '#toString', ->
    it 'should return a correct String presentation', ->
      D().toString().should.equal '0'
      D(0).toString().should.equal '0'
      D('0.0000000000000000000000000000001').toString().should.equal '0.0000000000000000000000000000001'
      D('99999999999999999999999999999999999').toString().should.equal '99999999999999999999999999999999999'

  describe '#toNumber', ->
    it 'should return a correct Number presentation', ->
      D(0.259).toNumber().should.equal 0.259
      D(12494.259).toNumber().should.equal 12494.259

  describe '#setString', ->
    it 'should set valid values', ->
      D('0')._data.toString().should.equal '0'
      D('0')._point.should.equal 1

      D('1.0')._data.toString().should.equal '1'
      D('1.0')._point.should.equal 1

      D('123')._data.toString().should.equal '123'
      D('123')._point.should.equal 1

      D('123456.789123')._data.toString().should.equal '1,23456,78912,30000'
      D('123456.789123')._point.should.equal(2)

  describe '#setNumber', ->
    it 'should set valid values', ->
      D(123)._data.toString().should.equal '123'
      D(123)._point.should.equal 1

      D(123456.789123)._data.toString().should.equal('1,23456,78912,30000')
      D(123456.789123)._point.should.equal 2

  describe '#copy', ->
    it 'should create a fresh copy', ->
      a = D()
      b = a.copy()

      b.should.be.instanceOf(D)
      a.should.not.equal(b)
      a._data.should.not.equal(b._data)

    it 'should create a copy with equal data', ->
      a = D('129149124912.2149214912492149')
      b = a.copy()

      a._data.toString().should.equal(b._data.toString())
      a._point.should.equal(b._point)
      a.toString().should.equal(b.toString())

  describe '#neg', ->
    it 'should flip the sign', ->
      D('-999').neg().eq(D(999)).should.be.true
      D('999').neg().eq(D(-999)).should.be.true
      D('999').neg()._sign.should.be.true
      D('-999').neg()._sign.should.be.false

  describe '#negSelf', ->
    it 'should flip its own sign', ->
      a = D('-999')
      a.negSelf()
      a.eq(D(999)).should.be.true

      a = D('999')
      a.negSelf()
      a.eq(D(-999)).should.be.true

      a = D('999')
      a.negSelf()
      a._sign.should.be.true

      a = D('-999')
      a.negSelf()
      a._sign.should.be.false

  describe '#sign', ->
    it 'should return one with its sign', ->
      D(5).sign().eq(D(1)).should.be.true
      D(-5).sign().eq(D(-1)).should.be.true
      D(0).sign().eq(D(1)).should.be.true
      D('-0').sign().eq(D(-1)).should.be.true

  describe '#signSelf', ->
    it 'should set its data value to one', ->
      a = D(5)
      a.signSelf()
      a.eq(D(1)).should.be.true

      a = D(-5)
      a.signSelf()
      a.eq(D(-1)).should.be.true

      a = D(0)
      a.signSelf()
      a.eq(D(1)).should.be.true

      a = D('-0')
      a.signSelf()
      a.eq(D(-1)).should.be.true

  describe '#eq', ->
    it 'should determine whether two decimals are equal', ->
      a = D('129149124912.2149214912492149')
      a.eq(a.copy()).should.be.true
      a.eq(D('129149124912.2149214912492149')).should.be.true

      D().eq(D()).should.be.true

    it 'should determine if two decimals are not equal', ->
      D('0.00000000000000001').eq(D('0.0')).should.be.false
      D('12303').eq(D('0.12303')).should.be.false

  describe '#prepare', ->
    it 'should clean a Decimal of leading zeroes', ->
      a = D()
      a._point = 2
      a._data = [0, 0, 1]
      a.prepare()
      a._data.toString().should.equal '0,1'
      a._point.should.equal 1

    it 'should clean a Decimal of trailing zeroes', ->
      a = D()

      a._point = 1
      a._data = [0, 1, 0]
      a.prepare()
      a._data.toString().should.equal '0,1'
      a._point.should.equal 1

      a._data = [1, 0, 0]
      a.prepare()
      a._data.toString().should.equal('1')
      a._point.should.equal 1
