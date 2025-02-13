export class NonRunnersResult {
    todaysNonRunners: Array<NonRunnersEvent>;
}

export class NonRunnersEvent {
    eventId: string;
    meetingName: string;
    category: string;
    flags: Array<string>;
    nonRunners: Array<NonRunner>;
    typeFlagCode: string;
    eventDateTime?: Date;
}

export class NonRunner {
    name: string;
    number: number;
}

export class NonRunnersList {
    eventId: string;
    meetingName: string;
    category: string;
    flags: Array<string>;
    nonRunnerName: string;
    nonRunnerNumber: number;
    typeFlagCode: string;
    sortFlag?: number;
    eventDateTime?: Date;
}
