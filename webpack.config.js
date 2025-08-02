const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // <-- Add this line

module.exports = {
  entry: {
    "background/background": './background/background.js',
    "content/content": './content/content.js',
    "popup/popup": './src/App.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" }, // This copies manifest.json!
        { from: "popup/popup.css", to: "popup.css" }    // This copies popup CSS if you have it
        // Add more if you want to copy images, icons, etc. e.g. { from: "icons/", to: "icons/" }
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
