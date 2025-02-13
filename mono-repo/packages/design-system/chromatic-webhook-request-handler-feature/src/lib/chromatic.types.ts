type Project = {
    name: string;
    accountName: string;
    accountAvatarUrl: string;
    webUrl: string;
};

type Author = {
    name: string;
    username: string;
    avatarUrl: string;
};

export type Build = {
    number: number;
    branch: string;
    commit: string;
    commiterName: string;
    status: string;
    result: string;
    storybookUrl: string;
    webUrl: string;
    changeCount: number;
    componentCount: number;
    specCount: number;
    project: Project;
};

export type Review = {
    number: number;
    title: string;
    status: 'OPEN' | 'MERGED' | 'CLOSED';
    baseRefName: string;
    headRefName: string;
    isCrossRepository: boolean;
    webUrl: string;
    author: Author;
};

export type ReviewDecision = {
    status: 'PENDING' | 'APPROVED';
    project: Project;
    review: Review;
    reviewer: Author;
};

type BuildUpdate = {
    version: number;
    event: 'build';
    build: Build;
};

type ReviewUpdate = {
    version: number;
    event: 'review';
    review: Review;
};

type ReviewDecisionUpdate = {
    version: number;
    event: 'review-decision';
    reviewDecision: ReviewDecision;
};

export type ChromaticEvent = BuildUpdate | ReviewUpdate | ReviewDecisionUpdate;
