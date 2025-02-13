import { StatusBadge } from './storybook-status-badges.interface';

/*
 * @internal
 * @WhatItDoes: it returns the status badge object and jira link for jira badge
 */
export const generateStatusBadges = (jiraTicketNum: string, badges: StatusBadge[]): { type: [{ name: string; url: string } | string] } => {
    let jiraUrl = `javascript:(function(){window.open('https://jira.corp.entaingroup.com/browse/${jiraTicketNum}');})()`;
    let status: { type: [{ name: string; url: string } | string] } = {
        type: [{ name: 'jira', url: jiraUrl }],
    };
    if (badges.length > 0) {
        badges.forEach((badge) => {
            status.type.push(badge);
        });
    }
    return status;
};
