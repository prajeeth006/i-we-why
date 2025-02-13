export interface Version {
    version: string;
    semver: string;
    revision: number | null;
    isBeta: boolean;
}

export function parseVersion(version: string) {
    let parts = version.split('.');
    const isBeta = parts[2].indexOf('-beta') != -1;
    const patchParts = parts[2].split('-beta');
    parts[2] = patchParts[0];
    const revision = isBeta ? parseInt(patchParts[1]) : null;

    let semver = parts.join('.');

    if (isBeta) {
        semver += '-beta' + revision;
    }

    return { version, semver, revision, isBeta };
}
