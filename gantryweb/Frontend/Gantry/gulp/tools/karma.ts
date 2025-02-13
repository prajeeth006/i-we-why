// import * as path from 'path';
import { Server } from 'karma';

// import { config } from '../config';

export interface KarmaOptions {
    watch?: boolean;
    headless?: boolean;
}

class Karma {
    start(_configFile: string, options?: KarmaOptions): Promise<void> {
        options = options || {};

        // let browsers = ['Chrome'];
        // if (options.headless) {
        //     browsers = ['ChromeHeadless'];
        // }

        // let resolve: Function, reject: Function;
        // const promise = new Promise<void>((res, rej) => {
        //     resolve = res;
        //     reject = rej;
        // });

        let server = new Server();
        // let server = new Server({
        //     configFile: path.join(config.baseDir, configFile),
        //     singleRun: !options.watch,
        //     autoWatch: options.watch,
        //     browsers
        // }, (exitCode: number) => {
        //     if (exitCode !== 0) {
        //         reject(new Error('Test run was not successful'));
        //     } else {
        //         resolve();
        //     }
        // });

        server.start();

        return null;//promise;
    }
}

export const karma = new Karma();
