const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'production',
	externals: {
		// global app config object
		config: JSON.stringify({
			apiUrl: 'http://localhost:3000' // or any final URL
		})
	}
});
