export class SisData {
    coralRetailEventId: Array<number> | null | undefined;
    time: string | null | undefined;
    fileTypeFlag: number | null | undefined;
    name: string | null | undefined;
    meetingName: string | null | undefined;
    date: Date | null | undefined;
    category: string | null | undefined;
    country: string | null | undefined;
    sportcode: string | null | undefined;
    operation: string | null | undefined;
    selectionStatus: Array<SisSelectionStatus> | null | undefined;
    eventStatusCode: string | null | undefined;
    resultStatusCode: string | null | undefined;
    photoFinishSelections: Array<SisPhotoFinishSelection> | null | undefined;
}

export class SisSelectionStatus {
    referenceId: string | null | undefined;
    runnerNumber: string | null | undefined;
    status: string | null | undefined;
}

export class SisPhotoFinishSelection {
    runnerNumber: string | null | undefined;
    photoFinish: string | null | undefined;
}