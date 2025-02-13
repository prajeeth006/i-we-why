import { TeamsNotification, sendTeamsNotification } from '@frontend/dev-kit';

const EXIT_CODE = process.env['CI_JOB_STATUS'] === 'success' ? 0 : 1;

if (EXIT_CODE === 0) {
    process.exit(0);
}

const PIPELINE_URL = process.env['CI_PIPELINE_URL'];
const COMMIT_SHA = process.env['CI_COMMIT_SHORT_SHA'];
const COMMIT_MESSAGE = process.env['CI_COMMIT_MESSAGE'];
const REPORTING_WEBHOOK_URL = process.env['TEAMS_FAILURE_REPORTING_URL'];

const teamsNotification: TeamsNotification = {
    title: `Affected Pipeline Failed`,
    subtitle: `An error occurred in the **Affected Pipeline** targeting the **main** branch.`,
    facts: [
        { name: 'Commit SHA', value: COMMIT_SHA },
        { name: 'Commit Message', value: COMMIT_MESSAGE },
    ],
    link: { text: 'See logs', url: PIPELINE_URL },
};

if (!REPORTING_WEBHOOK_URL) {
    throw new Error("Could not find environment variable process.env['TEAMS_FAILURE_REPORTING_URL']");
}

sendTeamsNotification(teamsNotification, REPORTING_WEBHOOK_URL).catch((err) => console.error(err));
