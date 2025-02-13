const os = require('os');

function getHostname() {
    const interfaces = os.networkInterfaces();
    return Object.keys(interfaces)
        .map((i) => interfaces[i])
        .reduce((acc, i) => {
            i.forEach((a) => acc.push(a));
            return acc;
        }, [])
        .find((a) => !a.internal && a.family === 'IPv4').address;
}

module.exports = function (config) {
    config.set({
        basePath: '',
        hostname: getHostname(),
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-junit-reporter'),
            require('karma-spec-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        files: [],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        coverageReporter: {
            dir: require('path').join(__dirname, '../../dist/test/packages/gantry-app/coverage'),
            reporters: [
                { type: 'html', subdir: 'gantry-app-html' },
                { type: 'cobertura', subdir: '.', file: 'gantry-app-cobertura.xml' },
            ],
            fixWebpackSourcePaths: true,
        },
        junitReporter: {
            outputDir: require('path').join(__dirname, '../../../dist/test/packages/gantry-app/junit'),
            outputFile: 'gantry-app.xml',
            suite: '',
            useBrowserName: false,
        },
        specReporter: {
            lateReport: true,
            maxLogLines: 5,
            suppressSkipped: true, // do not print information about skipped tests
            suppressPassed: true,
        },
        reporters: ['spec', 'progress', 'coverage', 'junit'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: true,
        browsers: ['HeadlessNoSandbox'],
        customLaunchers: {
            HeadlessNoSandbox: {
                base: `${process.env['CHROMIUM_BIN'] ? 'Chromium' : 'Chrome'}Headless`,
                flags: ['--no-sandbox'],
            },
        },
    });
};
