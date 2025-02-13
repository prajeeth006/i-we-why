import { TeamsNotification, sendTeamsNotification } from '@frontend/dev-kit';

const EXIT_CODE = process.env['CI_JOB_STATUS'] === 'success' ? 0 : 1;

if (EXIT_CODE === 0) {
    process.exit(0);
}

const PIPELINE_URL = process.env['CI_PIPELINE_URL'];
const REPORTING_WEBHOOK_URL = process.env['TEAMS_FAILURE_REPORTING_URL'];

const teamsNotification: TeamsNotification = {
    title: `Quality Pipeline Failed`,
    subtitle: `An error occurred in the **Quality Pipeline** targeting the **main** branch.`,
    link: { text: 'See logs', url: PIPELINE_URL },
};

sendTeamsNotification(teamsNotification, REPORTING_WEBHOOK_URL).catch((err) => console.error(err));
