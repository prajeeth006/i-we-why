import { HorseRacingContent } from "src/app/horse-racing/models/horseracing-content.model";
import { RunningOnTotalsContent } from "../models/running-on-totals.model";

export class RunningOnTotalsServiceMocks {
    runningOnTotalsResults: RunningOnTotalsContent = {
        typeDetails: [
            {
                rpCourseName: "SEDGEFIELD",
                racesFinished: 7,
                rpCourseId: "5720220306",
                distanceToWinner: 31.5,
                openBetTypeIds: ["2208"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "TAUNTON",
                "racesFinished": 7,
                "rpCourseId": "7320220303",
                "distanceToWinner": 34.85,
                "openBetTypeIds": ["1976"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "CATTERICK", "racesFinished": 7, "rpCourseId": "1020220309", "distanceToWinner": 29.05, "openBetTypeIds": ["1907"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "CHEPSTOW", "racesFinished": 8, "rpCourseId": "1220220226", "distanceToWinner": 85.8, "openBetTypeIds": ["1909"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "CARLISLE", "racesFinished": 4, "rpCourseId": "820220310", "distanceToWinner": 28.2, "openBetTypeIds": ["1905"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "TAUNTON",
                "racesFinished": 7,
                "rpCourseId": "7320220303",
                "distanceToWinner": 34.85,
                "openBetTypeIds": ["1976"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "TAUNTON",
                "racesFinished": 7,
                "rpCourseId": "7320220303",
                "distanceToWinner": 34.85,
                "openBetTypeIds": ["1976"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            },
            {
                "rpCourseName": "TAUNTON",
                "racesFinished": 7,
                "rpCourseId": "7320220303",
                "distanceToWinner": 34.85,
                "openBetTypeIds": ["1976"],
                date: "123456",
                eventIds: new Map<string, Array<number>>(),
                isResulted: false,
                rpTrackId: "000",
                rpTrackName: "abc",
                selectionName: "SelectionName"
            }
        ],
        horseRacingContent: new HorseRacingContent(),
        distanceAfterRace: "",
        pageNumber: 0,
        totalPages: 0,
        paginationText: "",
        startIndex: 0,
        endIndex: 0,
        currentPageNumber: 0,
        pageSize: 0
        

    }
}