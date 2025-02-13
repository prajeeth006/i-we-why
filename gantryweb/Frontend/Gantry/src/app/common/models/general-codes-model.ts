export enum EventStatusCode {
    Abandoned = "A",
    DelayedStart = "D",
    On = "O",
    StandBy = "S",
    Void = "Void",
}

export enum ResultStatusCode {
    OffMessage = "O",
    MayBeEnq = "Q",
    Objection = "R",
    StewardsEnq = "S",
    EnqWinnerOk = "U",
    ResultStands = "V",
    WeighedIn = "W",
    ResultComplete = "Y",
    AmendedResult = "Z"
}

export enum SelectionStatusCode {
    GoesAsExpected = "G",
    JockeyChange = "J",
    NonRunner = "N",
    Withdrawn = "W",
    VacantTrap = "V",
    ReserveRunner = "R"
}

export enum EventStatus {
    Suspended = "SUSPENDED",
    Active = "ACTIVE"
}

export enum MarketStatus {
    Suspended = "SUSPENDED",
    Active = "ACTIVE"
}

export enum SelectionStatus {
    Suspended = "SUSPENDED",
    Active = "ACTIVE"
}

export enum DisplayStatus {
    NotDisplayed = "NOTDISPLAYED",
    Displayed = "DISPLAYED",
}

export enum SelectionNameLength {
    TWELVE = 12,
    THIRTEEN = 13,
    Seventeen = 17,
    Eighteen = 18
}

export enum ToteDividend {
    DividendValue = '0.00'
}

export enum PriceType {
    startPrice = "SP",
    nonRunner = "N/R",
    evs = "EVS",
    forecast = 'FC',
    tricast = 'TC'
}

export enum SelectionSuspended {
    selectionAndPrice = ""//SUSP
}
export enum Addendum {
    raceAbandoned = 'RaceAbandoned',
    voidRace = 'VoidRace',
    stewardsEnquiry = 'StewardsEnquiry',
    resultStands = 'ResultStands',
    amendedResult = 'AmendedResult',
    photo = 'Photo',
    ResultComplete = 'ResultComplete'
}
export enum StewardType {
    stewardsState_S = 'S',
    stewardsState_R = 'R',
    stewardsState_V = 'V',
    stewardsState_Z = 'Z',
}
export enum EventStatusType {
    void = 'V',
    photo = 'P'
}
export enum StewardsStatus {
    raceAbandoned = 'RACE ABANDONED',
    voidRace = 'VOID RACE',
    stewardsEnquiry = "STEWARDS' ENQUIRY",
    resultStands = 'RESULT STANDS',
    amendedResult = 'AMENDED RESULT',
    photo = 'PHOTO',
    ResultComplete = 'RESULT COMPLETE',
    Abandoned = "ABANDONED",
    result = "RESULT"
}

export class EventAndMeetingTypes {
    eventType?: string;
    meetingName?: string;
    eventName?: string;
}

export enum Draw {
    drawNameValue = 'X',
}

export enum sourceName {
    home = '1',
    away = '2'
}
