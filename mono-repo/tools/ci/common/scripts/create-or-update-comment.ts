import { getGitLabApiClient } from '@frontend/gitlab-data-access';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

// Define the configuration for the argument parser
const options = {
    projectId: { type: 'string', short: 'P' },
    mergeRequestIid: { type: 'string', short: 'm' },
    notePrefix: { type: 'string', short: 'n' },
    noteBodyPath: { type: 'string', short: 'b' },
    showDetails: { type: 'boolean', short: 'd', default: false },
} as const;

// Parse the command-line arguments
const args = parseArgs({ options });

const { mergeRequestIid, noteBodyPath, notePrefix, projectId, showDetails } = args.values;

// Check if all required arguments are provided
if (!projectId || !mergeRequestIid || !notePrefix || !noteBodyPath) {
    console.error('Usage: -P <project_id> -m <merge_request_iid> -p <note_prefix> -b <note_body>');
    process.exit(1);
}

function escapeString(input: string) {
    return input.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/"/g, '\\"');
}

function convertFileToEscapedString(filePath: string) {
    try {
        const data = readFileSync(filePath, 'utf8');
        return data
            .split('\n')
            .map((line) => escapeString(line))
            .join('\n');
    } catch (err) {
        console.error(`Error reading or processing file: ${err}`);
        return null;
    }
}

async function main() {
    const gitLabApiClient = getGitLabApiClient(projectId!);
    const noteBody = convertFileToEscapedString(noteBodyPath!);
    const prefix = `# ${notePrefix}`;
    let fullNoteBody = '';
    if (showDetails) {
        fullNoteBody = `${prefix}\n\n${noteBody}`;
    } else {
        fullNoteBody = `${prefix}\n<details><summary>Details</summary>\n${noteBody}</details>`;
    }
    const existingNote = await gitLabApiClient.findMergeRequestNoteId({ mergeRequestIid: mergeRequestIid!, prefix });
    if (existingNote) {
        await gitLabApiClient.updateMergeRequestNote({ mergeRequestIid: mergeRequestIid!, body: fullNoteBody, noteId: existingNote.id });
    } else {
        await gitLabApiClient.createMergeRequestNote({ mergeRequestIid: mergeRequestIid!, body: fullNoteBody });
    }
}

(async () => {
    await main();
})();
