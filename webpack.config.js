const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		index: './public/src/index.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public/dist/js'),
	},
	module: {
		rules: [
			{
				test: /\.scss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.ts?$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
