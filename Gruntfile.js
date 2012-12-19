module.exports = function (grunt) {

var config = {
	SOURCE : ['src/*.js'],

	lint: {
		main: '<config:SOURCE>',
	},

	jshint: {
		options: {
			asi: true,
			boss: true,
			onecase: true,
		},

		globals: {
			Decimal: true,
		},
	},
}

grunt.initConfig(config)

grunt.registerTask('default', 'lint')

}
