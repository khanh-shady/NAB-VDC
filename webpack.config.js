const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		app: './src/index.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			favicon: 'public/favicon.ico',
			title: 'Weather forecast',
			inject: 'body',
			template: 'public/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				include: path.join(__dirname, 'src/'),
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.css$/,
				include: path.join(__dirname, 'src/'),
				use: [MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: isProduction ? '[hash:base64:5]' : '[name]---[local]---[hash:base64:5]'
							}
						}
					}
				]
			}
		]
	},
	devtool: isProduction ? '' : 'eval-source-map',
	devServer: {
		after: function (app) {
			const https = require('https');
			const url = require('url');

			app.get('/api/location/search', function (req, res) {
				const queryObject = url.parse(req.url, true).query;

				https.get(`https://www.metaweather.com/api/location/search/?query=${queryObject.query}`, response => {
					response.pipe(res);
				});
			});

			app.get('/api/location/', function (req, res) {
				const queryObject = url.parse(req.url, true).query;

				https.get(`https://www.metaweather.com/api/location/${queryObject.id}/`, response => {
					response.pipe(res);
				});
			});

			app.get('/static/img/weather/*', function (req, res) {
				https.get(`https://www.metaweather.com/${req.url}`, response => {
					response.pipe(res);
				});
			});
		},
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	}
};
