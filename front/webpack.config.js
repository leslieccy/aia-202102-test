var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
		mode: 'development',
		resolve: {
			extensions: ['.js', '.jsx']
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					loader: 'babel-loader',
					options: {
						presets: ['@babel/react']
					}
				}
			]
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
					'@': path.resolve(__dirname, 'src/'),
			}
		},
		plugins: [new HtmlWebpackPlugin({
			template: './src/index.html',
			baseUrl: '/'
		})],
		devServer: {
			historyApiFallback: true
		},
		externals: {
			// global app config object
			config: JSON.stringify({
				apiUrl: 'http://localhost:3000'
			})
		}
}
