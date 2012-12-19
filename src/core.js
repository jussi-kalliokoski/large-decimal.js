/**
 * A Decimal class for managing arbitrary-sized numbers.
 *
 * @class
 *
 * @arg {String,Number,Decimal} !arg The default value of the new Decimal.
*/
function Decimal (num) {
	switch (typeof num) {
	case "undefined":
		if (this instanceof Decimal) {
			this.setNumber(0)
			return
		} else {
			return new Decimal()
		}
	case "string":
		return Decimal.fromString(num)
	case "number":
		return Decimal.fromNumber(num)
	default:
		if (num instanceof Decimal) {
			return num.copy()
		}
	}

	throw new TypeError("Invalid arguments")
}

Decimal.CHUNK_SIZE = 5
Decimal.Math = {}

/**
 * Collects leading and trailing zeroes off a string to make it a valid number.
 *
 * @name cropZeroes
 * @method Decimal
 * @static
 *
 * @arg {String} str The string to crop.
 *
 * @return {String} A valid number in a String.
*/
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

/**
 * Pads a Number with zeroes up to a specified length.
 *
 * @name padZeroes
 * @method Decimal
 * @static
 *
 * @arg {Number} num The number to pad.
 * @arg {Number} length The length to pad the number to.
 *
 * @return {String} The padded string.
*/
Decimal.padZeroes = function (num, length) {
	var str = String(num)
	return Array(length - str.length + 1).join('0') + str
}

/**
 * Shifts a number from a String to fit a slot of a specified size.
 *
 * @name padDecimals
 * @method Decimal
 * @static
 *
 * @arg {String} str The number.
 * @arg {Number} length The slot size to pad for.
 *
 * @return {Number} The padded number.
*/
Decimal.padDecimals = function (str, length) {
	return parseInt(str, 10) * Math.pow(10, length - str.length)
}

/**
 * Adds a Math library function to the Decimal class, automatically providing Decimal#name and Decimal#nameSelf methods to the prototype.
 *
 * @name addMath
 * @method Decimal
 * @static
 *
 * @arg {String} name The name of the Math function.
 * @arg {Function} func The Math function (Decimal target, Decimal a, Decimal b)
*/
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

/**
 * Creates a Decimal from a String.
 *
 * @name fromString
 * @method Decimal
 * @static
 *
 * @arg {String} arg The String to create the Decimal from.
 *
 * @return {Decimal} A new Decimal.
*/
Decimal.fromString = function (arg) {
	var dec = new Decimal()
	dec.setString(arg)

	return dec
}


/**
 * Creates a Decimal from a Number.
 *
 * @name fromNumber
 * @method Decimal
 * @static
 *
 * @arg {Number} arg The Number to create the Decimal from.
 *
 * @return {Decimal} A new Decimal.
*/
Decimal.fromNumber = function (arg) {
	var dec = new Decimal()
	dec.setNumber(arg)

	return dec
}

/**
 * Provides a String representation of a Decimal.
 *
 * @name toString
 * @method Decimal
 *
 * @return {String} The String representation of the Decimal.
*/
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

/**
 * Provides a Number representation of a Decimal.
 *
 * @name toNumber
 * @method Decimal
 *
 * @return {Number} The Number representation of the Decimal.
*/
Decimal.prototype.toNumber = function () {
	return parseFloat(this.toString(), 10)
}

/**
 * Sets the Decimal's value from a String.
 *
 * @name setString
 * @method Decimal
 *
 * @arg {String} str A String representation of a Decimal.
*/
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

/**
 * Sets the Decimal's value from a Number.
 *
 * @name setNumber
 * @method Decimal
 *
 * @arg {Number} num A Number representation of a Decimal.
*/
Decimal.prototype.setNumber = function (num) {
	this.setString(String(num))
}

/**
 * Creates a copy of the Decimal.
 *
 * @name copy
 * @method Decimal
 *
 * @return {Decimal} A fresh copy of the Decimal.
*/
Decimal.prototype.copy = function () {
	var dec = new Decimal()
	dec._sign = this._sign
	dec._data = this._data.slice()
	dec._point = this._point

	return dec
}

/**
 * Checks whether the Decimal represents the same number as another Decimal.
 *
 * @name eq
 * @method Decimal
 *
 * @arg {Decimal} dec The Decimal to compare with.
 *
 * @return {Boolean} Boolean for whether the two Decimals were equal.
*/
Decimal.prototype.eq = function (dec) {
	return dec.toString() === this.toString()
}

/**
 * Creates a negation of the Decimal.
 *
 * @name neg
 * @method Decimal
 *
 * @return {Decimal} A negated copy of the decimal.
*/
Decimal.prototype.neg = function () {
	var dec = this.copy()
	dec.negSelf()
	return dec
}

/**
 * Flips the sign of the Decimal.
 *
 * @name negSelf
 * @method Decimal
*/
Decimal.prototype.negSelf = function () {
	this._sign = !this._sign
}

/**
 * Creates a copy of the Decimal, preserving only the sign.
 *
 * @name sign
 * @method Decimal
 *
 * @return {Decimal} A new Decimal with the Decimal's sign, but "1" as value.
*/
Decimal.prototype.sign = function () {
	return Decimal(this._sign ? '-1' : '1')
}

/**
 * Sets the value of the Decimal to one, preserving sign.
 *
 * @name signSelf
 * @method Decimal
*/
Decimal.prototype.signSelf = function () {
	this._data = [1]
	this._point = 1
}

/**
 * Clears unnecessary information from the Decimal's data, such as leading/trailing zeroes.
 *
 * @name prepare
 * @method Decimal
*/
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
