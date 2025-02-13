import { GitbeakerRequestError } from '@gitbeaker/requester-utils';
import { CommitablePipelineStatus, Gitlab } from '@gitbeaker/rest';
import * as log4js from 'log4js';
import process from 'process';

import { Build, ChromaticEvent, Review, ReviewDecision } from './chromatic.types';

const gitlabProjectId = process.env['GITLAB_PROJECT_ID'] ?? '';
const gitlabHost = process.env['GITLAB_HOST'] ?? '';
const gitlabToken = process.env['GITLAB_PRIVATE_TOKEN'] ?? '';
if (!gitlabProjectId || gitlabProjectId === '') {
    throw new Error(`A gitlab project is required for communicating with the GitlabAPI Endpoint.`);
}
if (!gitlabHost || gitlabHost === '') {
    throw new Error(`A gitlab host is required for communicating with the GitlabAPI Endpoint.`);
}
if (!gitlabToken || gitlabToken === '') {
    throw new Error(`A gitlab token is required for communicating with the GitlabAPI Endpoint.`);
}
const GITLAB_PROJECT_ID = parseInt(gitlabProjectId, 10);
const gitlabApi = new Gitlab({ host: gitlabHost, token: gitlabToken });

export async function handleEvent(body: ChromaticEvent) {
    switch (body.event) {
        case 'build':
            await handleV2Build(body.build);
            return;
        case 'review':
            await handleV2Review(body.review);
            return;
        case 'review-decision':
            await handleV2ReviewDecision(body.reviewDecision);
            return;
    }
}

const GITLAB_STATUS_NAME = 'UI Tests';

function getStatus(build: Build): { state: CommitablePipelineStatus; description: string } {
    switch (build.status) {
        case 'DENIED':
            return { state: 'failed', description: `Build ${build.number} denied.` };
        case 'BROKEN':
            return { state: 'failed', description: `Build ${build.number} failed to render.` };
        case 'FAILED':
            return {
                state: 'failed',
                description: `Build ${build.number} has suffered a system error. Please try again.`,
            };
        case 'CANCELED':
            return { state: 'canceled', description: `Build ${build.number} has been canceled.` };
        case 'PENDING':
            return {
                state: 'pending',
                description: `Build ${build.number} has ${build.changeCount} changes that must be accepted`,
            };
        case 'ACCEPTED':
            return { state: 'success', description: `Build ${build.number} accepted.` };
        case 'PASSED':
            return { state: 'success', description: `Build ${build.number} passed unchanged.` };
        case 'IN_PROGRESS':
            return { state: 'running', description: `Build ${build.number} is in test progress.` };
        case 'PUBLISHED':
            return { state: 'running', description: `Build ${build.number} has published storybook.` };
        case 'PREPARED':
            return { state: 'running', description: `Build ${build.number} is preparing for testing.` };
    }
    return { state: 'failed', description: 'Unknown status' };
}

async function handleV2Build(build: Build) {
    const logger = log4js.getLogger();

    const gitlabStatus = getStatus(build);

    logger.info(`Build ${build.number} with status: ${build.status} (for Gitlab: ${gitlabStatus}) received`);
    logger.debug(`Gitlab infos: branch ${build.branch} (#${build.commit}) by ${build.commiterName}`);

    try {
        // Before handling status, we create comment if we get published (so it is always sent)
        if (build.status === 'PUBLISHED') {
            logger.debug(`Sending storybook url to gitlab`);
            await gitlabApi.Commits.createComment(
                GITLAB_PROJECT_ID,
                build.commit,
                `**Storybook URL:** ${build.storybookUrl} \n\n **Chromatic URL:** ${build.webUrl}`,
            );
        }

        /*
         * The following code is required due to following errors:
         * Cannot transition status via :enqueue from :pending (Reason(s): Status cannot transition via "enqueue")
         * Cannot transition status via :enqueue from :running (Reason(s): Status cannot transition via "enqueue")
         * Cannot transition status via :run from :running (Reason(s): Status cannot transition via "run")
         *
         * See: https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/app/models/ci/build.rb?ref_type=heads
         *
         * Gitlab only allows to transition between certain states. To update an existing state, you have to
         * set it to some state. We chose failed here as it ensures the pipeline is not getting green during the update.
         * */
        const statuses = await gitlabApi.Commits.allStatuses(GITLAB_PROJECT_ID, build.commit);
        const myStatuses = statuses.filter((x) => x.name === GITLAB_STATUS_NAME);
        if (myStatuses.length > 1) {
            logger.error(`Gitlab has more than one status for ${GITLAB_STATUS_NAME}. We do not proceed.`);
            return;
        }
        if (myStatuses.length > 0) {
            const myStatus = myStatuses[0];
            const pipelineStatus = myStatus.status;
            logger.debug(`Gitlab currently in status ${pipelineStatus}`);

            // Gitlab already more advanced
            if (
                (pipelineStatus === 'success' || pipelineStatus === 'failed' || pipelineStatus === 'canceled' || pipelineStatus === 'pending') &&
                // Chromatic is in preparation states (webhook out of order)
                (build.status === 'IN_PROGRESS' || build.status === 'PUBLISHED' || build.status === 'PREPARED')
            ) {
                logger.debug('Not sending event to gitlab, out of order');
                return;
            }

            // We reset gitlab status by setting to false
            logger.debug('Status reset by setting to failed');
            await gitlabApi.Commits.editStatus(GITLAB_PROJECT_ID, build.commit, 'failed', {
                description: 'Cancelled for status update',
                context: GITLAB_STATUS_NAME,
                targetUrl: build.webUrl,
            });
        }

        logger.debug(`Sending status update to ${gitlabStatus.state}`);
        await gitlabApi.Commits.editStatus(GITLAB_PROJECT_ID, build.commit, gitlabStatus.state, {
            description: gitlabStatus.description,
            context: GITLAB_STATUS_NAME,
            targetUrl: build.webUrl,
        });
    } catch (e: unknown) {
        logger.error(e);
        if (e != null && typeof e === 'object' && 'cause' in e) {
            const ge = e as GitbeakerRequestError;
            logger.error(ge.cause?.description ?? 'No error description');
        }
    }

    return;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleV2Review(_review: Review) {
    // Not handled for now
    return;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleV2ReviewDecision(_reviewDecision: ReviewDecision) {
    // Not handled for now
    return;
}
