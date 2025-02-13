import { get, Response } from 'request';
import * as log from 'fancy-log';

import { hostPackagesConfig, XML } from '../tools';
import { config } from '../config';
import * as gulp from 'gulp';
//import gulp = require('gulp');

const URL = require('url').URL;

/**
 * Validates that Vanilla NuGet packages updated just right now are the latest available on the feed.
 */
async function validateLatestVanilla() {
    return new Promise<void>((resolve, reject) => {
        log.info('Validating installed Vanilla NuGet packages to be the latest available.');
        const vanillaNuGetElm: any = Array.from<any>(hostPackagesConfig.content.documentElement.getElementsByTagName('package'))
            .find((e: any) => e.getAttribute('id').startsWith('Bwin.Vanilla'));

        const vanillaNuGetName = vanillaNuGetElm.getAttribute('id');
        const localVanillaVersion = vanillaNuGetElm.getAttribute('version').trim();
        log.info(`Found version ${localVanillaVersion} of locally installed Vanilla NuGet packages.`);

        const url = new URL(config.nugetFeed + '/Packages()');
        url.searchParams.set('$filter', `Id eq '${vanillaNuGetName}' and IsPrerelease eq true`);
        url.searchParams.set('$orderby', 'Published desc');
        url.searchParams.set('$top', '1');

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable cetificate validation
        get(url.toString(), (error: any, response: Response, body: any) => {
            if (error || !response || response.statusCode !== 200) {
                reject(`Failed to retrieve version of the latest Vanilla NuGet package from feed ${url} status ${response && response.statusCode} and error: ${error}`);
            }

            const nugetFeedXml = XML.parse(body.toString());
            const remoteVanillaVersion = nugetFeedXml.documentElement.getElementsByTagName('d:Version')[0].textContent.trim();
            log.info(`Found version ${remoteVanillaVersion} of remote Vanilla NuGet packages on feed ${config.nugetFeed}.`);

            if (localVanillaVersion !== remoteVanillaVersion) {
                reject(`Vanilla wasn't updated correctly because locally installed version of NuGet packages is ${localVanillaVersion} but the latest one is ${remoteVanillaVersion} at feed ${config.nugetFeed}.`);
            }

            resolve();
        });
    });
}

gulp.task('validate-latest-vanilla-packages', validateLatestVanilla);
