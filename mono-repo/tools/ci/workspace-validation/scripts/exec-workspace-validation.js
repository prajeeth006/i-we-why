const { exec } = require('child_process');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

const NX_BINARY = 'node_modules/nx/bin/nx.js';

function hasError(stdout) {
    return !stdout.includes('validate-workspace-report.');
}

function writeError(reportsOutput, error) {
    const REPORT_PATH = `${reportsOutput}/validate-workspace-report.${Date.now()}.json`;
    const result = { created: Date.now(), status: 'error', message: error };

    if (!existsSync(reportsOutput)) {
        mkdirSync(reportsOutput, { recursive: true });
    }
    writeFileSync(REPORT_PATH, JSON.stringify(result), { flag: 'a+' });

    console.log(`Report generated at ${REPORT_PATH}`);
}

function execValidation(reportsOutput) {
    exec(
        `node --max-old-space-size=8192 node_modules/nx/bin/nx.js g @frontend/migration-kit:validate-workspace --reportsOutput=${reportsOutput} --runAll`,
        (error, stdout, stderr) => {
            console.log(stdout);

            if (hasError(stdout)) {
                writeError(reportsOutput, stdout);
            }
        },
    );
}

function runWorkspaceValidationForRepo(reportsOutput) {
    reportsOutput = reportsOutput.replace('\\', '/');

    if (!existsSync(NX_BINARY)) {
        writeError(reportsOutput, 'Nx is not yet installed on that repository');
    }

    execValidation(reportsOutput);
}
const OUTPUT_PATH = process.argv[2];
runWorkspaceValidationForRepo(OUTPUT_PATH);
