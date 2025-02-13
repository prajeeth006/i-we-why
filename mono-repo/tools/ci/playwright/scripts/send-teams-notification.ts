import { TeamsNotification, sendTeamsNotification } from '@frontend/dev-kit';

if (process.env['CI_PIPELINE_SOURCE'] !== 'schedule') {
    process.exit(0);
}

const appHooksMap: Record<string, string> = {
    'sports-web-e2e': 'SPORTS_PLAYWRIGHT_TEAMS_URL',
};

const reportLink = `https://vanilla.vie.pages.bwinparty.corp/-/monorepo/-/jobs/${process.env['CI_JOB_ID']}/artifacts/playwright-report/index.html`;
const appName = process.env['APP'];
console.log(appName);

if (!appName) {
    throw new Error('Environment variable APP was not provided!');
}

const hookKey = appHooksMap[appName] ? appHooksMap[appName] : 'TEAMS_FAILURE_REPORTING_URL';
const webhookUrl = process.env[hookKey];

const teamsNotification: TeamsNotification = {
    title: `Playwright E2E Tests Finished`,
    subtitle: `The Playwright E2E tests for the **${appName}** app have finished.`,
    link: { text: 'See Report', url: reportLink },
};

sendTeamsNotification(teamsNotification, webhookUrl).catch((err) => console.error(err));
