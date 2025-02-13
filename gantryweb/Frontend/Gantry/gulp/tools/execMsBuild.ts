import * as path from 'path';
import * as fs from 'fs';

import { execSync } from './execSync';
import { config } from '../config';

export function execMsBuild(target: string) {
    const msBuildPath = path.join(locateDotNet(), 'msbuild.exe');
    const customTarget = target ? `/t:${target}` : ``;

    execSync(`"${msBuildPath}" /nologo /verbosity:minimal /filelogger /fileloggerparameters:LogFile=build.log;Verbosity=normal ${config.msBuildProjFile} ${customTarget}`);
}

function locateDotNet() {
    const dotNet64 = path.join(process.env['WINDIR'], 'Microsoft.NET/Framework64/v4.0.30319');
    if (fs.existsSync(dotNet64)) {
        return dotNet64;
    }

    const dotNet86 = path.join(process.env['WINDIR'], 'Microsoft.NET/Framework/v4.0.30319');
    if (fs.existsSync(dotNet86)) {
        return dotNet86;
    }

    throw '.NET v4.0 could not be found! Searched locations: ' + dotNet64 + ' and ' + dotNet86;
}
