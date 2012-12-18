should = require 'should'
D = require '../src/index.js'

describe 'Decimal', -> describe '.Math (algebra)', ->
  describe '.add', ->
    it 'should have the correct signature', ->
      a = D(0)
      b = D(1)
      c = D(2)
      D.Math.add(a, b, c)

      a.eq(D(0)).should.not.be.true
      b.eq(D(1)).should.be.true
      c.eq(D(2)).should.be.true
      a.eq(D(3)).should.be.true

    it 'should provide correct answers', ->
      D(1).add(D(2)).eq(D(3)).should.be.true
      D(3).add(D(4)).eq(D(5)).should.not.be.true
      D('999999.999999').add(D('999999.999999')).eq(D("1999999.999998")).should.be.true

      huge_num1 = Array(200).join('1') + '.' + Array(200).join('1')
      huge_num2 = Array(200).join('2') + '.' + Array(200).join('2')
      D(huge_num1).add(D(huge_num1)).eq(D(huge_num2)).should.be.true
