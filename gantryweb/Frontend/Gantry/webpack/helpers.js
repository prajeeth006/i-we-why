const path = require('path');

// Helper functions
const ROOT = path.resolve(__dirname, '../../');

function hasProcessFlag(flag) {
    return process.argv.join('').indexOf(flag) > -1;
}

function isDevServer() {
    return hasProcessFlag('serve');
}

function isProd() {
    return hasProcessFlag('prod')
}

const root = path.join.bind(path, ROOT);

exports.root = root;
exports.isDevServer = isDevServer;
exports.isProd = isProd;
