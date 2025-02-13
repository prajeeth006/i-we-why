const https = require('node:https');
const fs = require('node:fs');

const proxyConfig = (nxDefaultConfig) => ({
    ...nxDefaultConfig,
    httpsAgent: new https.Agent({
        ca: fs.readFileSync('./tools/ci/certificate/ATVA0WIPKI001-Full.pem'),
    }),
});

module.exports = {
    nxCloudProxyConfig: proxyConfig,
    fileServerProxyConfig: proxyConfig,
};
