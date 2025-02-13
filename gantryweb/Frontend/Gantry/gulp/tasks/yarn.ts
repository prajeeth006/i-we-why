import { spawn } from '../tools';

export function yarnCheck() {
    return spawn('yarn check');
}

export function yarnInstall() {
    return spawn('yarn install --pure-lockfile');
}
