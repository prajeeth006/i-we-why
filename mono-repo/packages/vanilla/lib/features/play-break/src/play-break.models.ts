export interface PlayBreak {
    playBreak: boolean;
    playBreakType: string;
    playBreakEndTime: string;
    gracePeriod: boolean;
    gracePeriodEndTime: string;
    playBreakOpted: boolean;
}

export interface PlayBreakAcknowledgeRequest {
    actionName: string;
    cstEventId: string;
    playBreakDuration: number;
    afterXMinutes: number;
}

export interface PlayBreakAcknowledge {
    responseCode: number | undefined;
    responseMessage: string | undefined;
}

export interface PlayBreakNotification {
    cstEventId: string;
    breakType?: PlayBreakType;
    isPlayBreakOpted?: string;
    selectedPlayBreakDuration?: number; // User selection in minutes
    selectedPlayBreakStart?: number; // User selection in minutes
    playBreakStartTime?: number; // In milliseconds
    graceEndTime?: number; // In minutes
    playBreakEndTime?: number; // In milliseconds
    playBreakInGC?: string; // Obsolete
}

export interface PlayBreakTimer {
    event: string;
    playBreakInGc?: boolean;
    endTime: Date;
}

export interface PlayBreakWorkflow {
    step: PlayBreakWorkflowStep;
    notification: PlayBreakNotification;
}

export enum PlayBreakWorkflowStep {
    DurationSelection = 'DurationSelection',
    StartSelection = 'StartSelection',
    Confirmation = 'Confirmation',
    SubmitBreakSelections = 'SubmitBreakSelections',
}

export enum PlayBreakType {
    PLAY_BREAK = 'PLAY_BREAK',
    LONG_SESSION_BREAK = 'LONG_SESSION_BREAK',
    LONG_SESSION_24H_BREAK = 'LONG_SESSION_24H_BREAK',
}

export enum PlayBreakAction {
    Later = 'NOT_NOW',
    Now = 'RIGHT_NOW',
    After = 'AFTER_X_MINS',
}
