import { join } from 'path';

import { XmlFile } from './file';
import { config } from '../config';

export const hostCsproj = new XmlFile(join(config.hostProjDir, 'Bwin.MobilePromo.Host.csproj'));
export const hostPackagesConfig = new XmlFile(join(config.hostProjDir, 'packages.config'));
