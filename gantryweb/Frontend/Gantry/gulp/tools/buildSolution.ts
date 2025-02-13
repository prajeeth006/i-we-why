import * as path from 'path';
import { execMsBuild } from './execMsBuild';

export function buildSolution() {
    const command = `Bwin.Vanilla.sln /p:Configuration="Release";Disable_CopyWebApplication="true";MvcBuildViews="false";OutDir="${path.resolve('Build/bin')}"`;

    execMsBuild(command);
}