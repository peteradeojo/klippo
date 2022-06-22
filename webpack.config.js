const webpack = require('webpack');
const path = require('path');

const config = {
	entry: './src/js/app.js',
	output: {
		path: path.resolve(__dirname, 'public/js'),
		filename: 'app.js',
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
};

module.exports = config;
