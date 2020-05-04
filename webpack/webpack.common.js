const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

module.exports = {
    entry: {
        model: path.join(__dirname, srcDir + 'model.ts'),
        core: path.join(__dirname, srcDir + 'core.ts'),
        onActivated: path.join(__dirname, srcDir + 'events/onActivated.ts'),
        onCreated: path.join(__dirname, srcDir + 'events/onCreated.ts'),
        onRemoved: path.join(__dirname, srcDir + 'events/onRemoved.ts'),
        onDetached: path.join(__dirname, srcDir + 'events/onDetached.ts'),
        onCommand: path.join(__dirname, srcDir + 'events/onCommand.ts'),
        index: path.join(__dirname, srcDir + 'index.ts')
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyPlugin([
            { from: '.', to: '../' }
        ],
            { context: 'public' }
        ),
    ]
};
