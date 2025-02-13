const os = require('os');

function getHostname() {
    const interfaces = os.networkInterfaces();
    return Object.keys(interfaces)
        .map(i => interfaces[i])
        .reduce((acc, i) => {
            i.forEach(a => acc.push(a));
            return acc;
        }, [])
        .find(a => !a.internal && a.family === 'IPv4')
        .address
}

module.exports = function (config) {
    const reporters = [];
    reporters.push('progress');
    reporters.push('html');
    reporters.push('coverage-istanbul');
    reporters.push('junit');

    config.set({
        basePath: '',
        hostname: getHostname(),
        frameworks: ['jasmine', '@angular-devkit/build-angular', 'jasmine-matchers'],
        plugins: [
            require('karma-jasmine'),
            require('karma-jasmine-matchers'),
            require('karma-chrome-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-htmlfile-reporter'),
            require('karma-junit-reporter')
        ],
        files: [],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        reporters: reporters,
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../../_build/frontend-test-results/coverage/'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
            combineBrowserReports: true,
            'report-config': {
                // all options available at: https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html/index.js#L257-L261
                html: {
                  subdir: 'html'
                }
            }
        },
        htmlReporter: {
            outputFile: require('path').join(__dirname, '../../_build/frontend-test-results/Gantry.Tests.html'),
            // Optional
            pageTitle: 'Unit Test Results',
            subPageTitle: 'Promohub',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true,
            showOnlyFailed: false
          },
        junitReporter: {
            outputFile: require('path').join(__dirname, '../../_build/frontend-test-results/Gantry.Tests.xml'),
            suite: ''
          },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserDisconnectTimeout: 20000,
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 60000,
        browsers: ['Chrome', 'ChromeHeadless', 'NoSandboxHeadlessChrome'],
        customLaunchers: {
            NoSandboxHeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
                    '--headless',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--no-proxy-server',
                    '--disable-gpu',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    "--remote-debugging-port=9222",
                    "--user-data-dir=/tmp/chrome-test-profile",
                ],
                debug: true
            }
        },
        flags: [
            '--no-sandbox'
        ],
        singleRun: false,
    });
};
