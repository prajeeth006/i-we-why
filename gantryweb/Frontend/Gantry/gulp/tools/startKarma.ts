// import * as path from 'path';
import { Server } from 'karma';

// import { config } from '../config';

export function startKarma(_cb: (err?: any) => void, _configFile: string, _watch: boolean) {
    let server = new Server();
    // let server = new Server({
    //     configFile: path.join(config.baseDir, `${configFile}`),
    //     singleRun: !watch,
    //     autoWatch: watch,
    // }, (exitCode: number) => {
    //     if (exitCode !== 0) {
    //         cb(new Error('Test run was not successful'));
    //     } else {
    //         cb();
    //     }
    // });

    server.start();
}
