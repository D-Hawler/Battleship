# Battleship

npm init -y
npm install --save-dev jest

package.json:
"scripts": {
  "test": "jest"
}


npm install --save-dev babel-jest @babel/core @babel/preset-env

babel.config.js
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
