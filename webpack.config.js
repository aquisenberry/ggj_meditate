var webpack = require("webpack");

/* eslint-disable no-undef */
var environment = process.env["NODE_ENV"] || "development";

module.exports = {
	entry: "./src/game",
	output: {
		path: __dirname + "/build",
		filename: "index.js"
	},
	module: {
		preLoaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader" }
		],
		loaders: [
			{ test: /\.json$/, loader: "json" },
			{
				test: /src\/images\/.*\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					"file?hash=sha512&digest=hex&name=images/[name].[ext]",
					"image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false"
				]
			},
			{
				test: /src\/sounds\/.*\.(mp3|ogg|wav)$/i,
				loader: "file?hash=sha512&digest=hex&name=sounds/[name].[ext]"
			},
			{
				test: /src\/index.html$/i,
				loader: "file?hash=sha512&digest=hex&name=[name].[ext]"
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__PRODUCTION__: environment === "production",
			__TEST__: environment === "test",
			__DEVELOPMENT__: environment === "development"
		})
	]
};
