const webpack = require('webpack');
const path = require('path');

const config = {
	entry: { app: './src/js/app.js', index: './src/js/index.js' },
	output: {
		path: path.resolve(__dirname, 'public/js'),
		filename: '[name].js',
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
