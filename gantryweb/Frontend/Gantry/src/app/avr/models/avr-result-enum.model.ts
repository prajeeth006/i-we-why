export enum AvrTagsEnum {
    EachWay = "EACH-WAY",
    EachWayTerms = "EACHWAYTERMS",
    EventTime = "EVENTTIME",
    EachWayFraction = "EACHWAYFRACTION",
    Forecast = "FORECAST",
    Tricast = "TRICAST",
    Distance = "DISTANCE",
    CourseName = "COURSENAME",
    NumEachWay = "NUMEACHWAY",
    NumEachWayDisplay = "NUMEACHWAYDISPLAY",
    RunnerCount = "RUNNERCOUNT"
}

export enum AvrMessageTypeEnum {
    Result = "RESULT",
    Off = "OFF",
    ViewerEventCard = "VIEWEREVENTCARD",
    NoMoreBets = "NOMOREBETS"
}

export enum AvrMarketEnum {
    Win = "WIN",
    Trap = "TRAP"
}

export const AvrEventTypeEnum = {
    HorseRace: "0",
    DogRace: "1",
    MotorRace: "3"
}