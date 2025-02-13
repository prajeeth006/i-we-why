import * as gulp from 'gulp';
import * as globby from 'globby';
import * as log from 'fancy-log';
import * as path from 'path';

import { hostCsproj } from '../tools';
import { config } from '../config';

/**
 * Syncs actual content files on the file system with Host project file (.csproj)
 */
async function syncHostProjectFile() {
    log.info(`Syncing content files in ${hostCsproj.path}`);

    // Gather all content files
    const actualContentFiles = await getAllContentFiles(config.hostProjDir);
    let newContentFiles = actualContentFiles.slice();
    const itemGroupElms = hostCsproj.content.documentElement.getElementsByTagName('ItemGroup');

    // Go through all file elements in .csproj and remove non-existing ones
    for (const itemGroupElm of Array.from<any>(itemGroupElms)) {
        for (const contentElm of Array.from<any>(itemGroupElm.childNodes)) {
            if (contentElm.tagName == 'Content' || contentElm.tagName == 'None') {
                const referencedFile = path.join(config.hostProjDir, contentElm.getAttribute('Include'));
                const correspondingContentFile = actualContentFiles.find((f: string) => normalizePath(f) === normalizePath(referencedFile));
                const isDuplicateInCsproj = correspondingContentFile && newContentFiles.indexOf(correspondingContentFile) < 0;

                if (!correspondingContentFile || isDuplicateInCsproj) {
                    log.info('Removing ' + (isDuplicateInCsproj ? 'DUPLICATED ' : '') + 'reference to ' + referencedFile);
                    if (contentElm.nextSibling.nodeType == 3) { // If it is trailing whitespace -> remove it
                        itemGroupElm.removeChild(contentElm.nextSibling);
                    }
                    itemGroupElm.removeChild(contentElm);
                } else {
                    newContentFiles = newContentFiles.filter(f => f !== correspondingContentFile);
                }
            }
        }
    }

    // If there are new files, add them to .csproj
    if (newContentFiles.length) {
        const itemGroupElm = itemGroupElms[itemGroupElms.length - 1];

        for (const contentFile of newContentFiles) {
            log.info('Adding reference to ' + contentFile);
            const newElm = hostCsproj.content.createElement('Content');
            newElm.setAttribute('Include', path.relative(config.hostProjDir, contentFile));
            itemGroupElm.appendChild(hostCsproj.content.createTextNode('  '));
            itemGroupElm.appendChild(newElm);
            itemGroupElm.appendChild(hostCsproj.content.createTextNode('\r\n  '));
        }
    }

    hostCsproj.save();
    log.info('Syncing done');
}

async function getAllContentFiles(dir: string) {
    const patterns = [
        path.join(dir, '**'),
        '!**/*.cs',
        '!**/obj/**',
        '!**/bin/**',
        '!**/*.csproj',
        '!**/*.user',
        '!' + path.join(dir, 'Web.config'), // Skip only root web.config
    ];

    return globby(patterns, {
        expandDirectories: true
    });
}

function normalizePath(file: string) {
    return path.normalize(file.toLowerCase());
}

gulp.task('sync-host-csproj', syncHostProjectFile);
