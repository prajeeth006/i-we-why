import * as childProcess from 'child_process';

export function execSync(command: string, options?: { returnStdout?: boolean, cwd?: string }): string|Buffer {
    let result = childProcess.execSync(command, {
        stdio: options && options.returnStdout ? 'pipe' : 'inherit',
        cwd: options && options.cwd
    });
    return result ? result.toString().trim() : result;
}
