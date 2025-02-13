import { execSync } from './execSync';

export function execNuget(command: string) {
    const nuget = 'NuGet.exe';

    execSync(`${nuget} ${command}`);
}
