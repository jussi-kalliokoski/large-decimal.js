var Decimal = require('./core')

Decimal.addMath('add', function (dst, a, b) {
	var ia = a._point
	var ib = b._point
	var decimals = Math.max(a._data.length - ia, b._data.length - ib)
	var data = []
	var sep = Math.pow(10, Decimal.CHUNK_SIZE)

	ia += decimals - 1
	ib += decimals - 1

	var remainder = 0
	for (; ia + 1 && ib + 1; ia--, ib--) {
		var n = (a._data[ia] || 0) + (b._data[ib] || 0) + remainder
		remainder = ~~(n / sep)
		n %= sep
		data.unshift(n)
	}

	if (remainder) {
		data.unshift(remainder)
	}

	dst._data = data
	dst._point = data.length - decimals
})
