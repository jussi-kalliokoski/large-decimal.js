function Decimal (arg) {
	switch (typeof arg) {
	case "undefined":
		if (this instanceof Decimal) {
			this.setNumber(0)
			return
		} else {
			return new Decimal()
		}
	case "string":
		return Decimal.fromString(arg)
	case "number":
		return Decimal.fromNumber(arg)
	default:
		if (arg instanceof Decimal) {
			return arg.copy()
		}
	}

	throw new TypeError("Invalid arguments")
}

Decimal.CHUNK_SIZE = 5
Decimal.Math = {}

Decimal.cropZeroes = function (str) {
	var p = str[0] === '-' ? '-' : ''
	var s = ~~!!p
	var l = str.length

	if (/^-?0+$/.test(str)) return p + '0'

	for (var i=s; i<str.length && str[i] === '0'; i++) {
		s += 1
		l -= 1
	}

	for (var i=str.length-1; i > 0 && str[i] === '0'; i--) {
		l -= 1
	}

	str = str.substr(s, l)

	if (str[0] === '.') str = '0' + str
	if (str[str.length - 1] === '.') str += '0'

	return p + str
}

Decimal.padZeroes = function (num, length) {
	var str = String(num)
	return Array(length - str.length + 1).join('0') + str
}

Decimal.padDecimals = function (str, length) {
	return parseInt(str, 10) * Math.pow(10, length - str.length)
}

Decimal.addMath = function (name, func) {
	Decimal.Math[name] = function (tgt) {
		func.apply(null, arguments)
		tgt.prepare()
	}

	Decimal.prototype[name] = function () {
		var dec = this.copy()
		dec[name + 'Self'].apply(dec, arguments)

		return dec
	}

	Decimal.prototype[name + 'Self'] = function () {
		for (var i=0; i<arguments.length; i++) {
			Decimal.Math[name](this, this, arguments[i])
		}
	}
}

Decimal.fromString = function (arg) {
	var dec = new Decimal()
	dec.setString(arg)

	return dec
}

Decimal.fromNumber = function (arg) {
	var dec = new Decimal()
	dec.setNumber(arg)

	return dec
}

Decimal.prototype.toString = function () {
	var s = this._sign ? '-' : ''

	for (var i=0; i<this._point; i++) {
		s += Decimal.padZeroes(this._data[i], Decimal.CHUNK_SIZE)
	}

	if (this._point === this._data.length) return Decimal.cropZeroes(s)

	s += '.'

	for (var i=this._point; i<this._data.length; i++) {
		s += Decimal.padZeroes(this._data[i], Decimal.CHUNK_SIZE)
	}

	return Decimal.cropZeroes(s)
}

Decimal.prototype.toNumber = function () {
	return parseFloat(this.toString(), 10)
}

Decimal.prototype.setString = function (str) {
	this._sign = str[0] === '-'

	if (this._sign) str = str.substr(1)

	var d = str.split('.')
	var data = this._data = []

	for (var i=0; i<d[0].length; i+=Decimal.CHUNK_SIZE) {
		var l = Decimal.CHUNK_SIZE
		if (d[0].length - i < l) l = d[0].length - i

		var s = d[0].substr(-i - Decimal.CHUNK_SIZE, l)
		data.unshift(parseInt(s, 10))
	}

	this._point = data.length

	if (d.length === 1) return

	for (var i=0; i<d[1].length; i+=Decimal.CHUNK_SIZE) {
		var s = d[1].substr(i, Decimal.CHUNK_SIZE)
		data.push(Decimal.padDecimals(s, Decimal.CHUNK_SIZE))
	}

	this.prepare()
}

Decimal.prototype.setNumber = function (num) {
	this.setString(String(num))
}

Decimal.prototype.copy = function (str) {
	var dec = new Decimal()
	dec._sign = this._sign
	dec._data = this._data.slice()
	dec._point = this._point

	return dec
}

Decimal.prototype.eq = function (dec) {
	return dec.toString() === this.toString()
}

Decimal.prototype.neg = function () {
	var dec = this.copy()
	dec.negSelf()
	return dec
}

Decimal.prototype.negSelf = function () {
	this._sign = !this._sign
}

Decimal.prototype.sign = function () {
	return Decimal(this._sign ? '-1' : '1')
}

Decimal.prototype.signSelf = function () {
	this._data = [1]
	this._point = 1
}

Decimal.prototype.prepare = function () {
	var data = this._data

	/* while last data is zero, drop it */
	while (this._point < data.length && !data[data.length - 1]) {
		data.pop()
	}

	/* while first data is zero, drop it and move point */
	while (this._point - 1 && !data[0]) {
		data.shift()
		this._point--
	}
}

module.exports = Decimal
