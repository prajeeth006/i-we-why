import * as childProcess from 'child_process';

export function execSync(command: string, options?: { returnStdout?: boolean, cwd?: string }): string | Buffer {
    let result = childProcess.execSync(command, {
        stdio: options && options.returnStdout ? 'pipe' : 'inherit',
        cwd: options && options.cwd
    });
    return result ? result.toString().trim() : result;
}

export function execNuget(command: string) {
    const nuget = 'NuGet.exe';
    execSync(`${nuget} ${command}`);
}

export function spawn(command: string, args: string[] = []) {
    return childProcess.spawn('cmd', ['/s', '/c', command, ...args], {
        stdio: 'inherit',
    });
}

export function spawnNgCli(command: string, args: string[] = []) {
    return spawn(`yarn node --max_old_space_size=20479 .\\node_modules\\@angular\\cli\\bin\\ng ${command}`, args);
}
