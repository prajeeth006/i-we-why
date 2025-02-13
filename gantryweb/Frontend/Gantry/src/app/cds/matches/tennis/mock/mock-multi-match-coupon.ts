import { GantryCommonContent } from "../../../../common/models/gantry-commom-content.model";
import { HomeAway } from "../models/multi-match-model"

export class MockData {
    staticContent: GantryCommonContent = {
        "contentParameters": {
            "Abandoned": "ABANDONED",
            "Away": "AWAY",
            "CoralPrice": "EARLY PRICE",
            "Draw": "DRAW",
            "Eighteen": "18",
            "EventTimeInfo": "{0}",
            "Home": "HOME",
            "LiveShow": "LIVE PRICE",
            "Odds": "ODDS",
            "PhotoFinish": "PHOTO FINISH",
            "Places": "PLACES",
            "RaceOff": "RACE OFF",
            "SeventeenNumber": "17",
            "StewardsEnquiry": "STEWARDS ENQUIRY",
            "Time": "TIME",
            "Today": "TODAY",
            "Tomorrow": "TOMORROW",
            "TwentyOneNumber": "21",
            "VirtualRacing": "VIRTUAL RACING",
            "WeekendCoupon": "FEATURED FOOTBALL",
            "WinningDistanceMaxDistancePerRace": "MAX DISTANCE PER RACES = JUMPS 30L (WALKOVER 12L) / FLAT 12L (WALKOVER 5L)",
            "WinOnly": "WIN ONLY",
            "Withdrawn": "WITHDRAWN",
            "ManualBottomStipLine": "PRICES ARE SUBJECT TO CHANGE AND SHOULD BE TREATED AS A GUIDE",
            "EachWay": "EACH-WAY"
        }
    }


    homeAwayEventResponse: HomeAway[] = [
        {
            "eventDateTime": new Date("2023-08-03T10:49:00.000Z"),
            "homeSelection": {
                "price": "1/25",
                "selectionName": "D. RADANOVIC"
            },
            "awaySelection": {
                "price": "13/2",
                "selectionName": "T. LEMAITRE"
            }
        },
        {
            "eventDateTime": new Date("2023-08-03T10:00:00.000Z"),
            "homeSelection": {
                "price": "7/20",
                "selectionName": "S. NAHIMANA"
            },
            "awaySelection": {
                "price": "15/8",
                "selectionName": "F. STOLLAR"
            }
        }

    ]


    HomeAwaySelectionExpected: HomeAway[] = [

        {
            "eventDateTime": new Date("2023-08-03T10:00:00.000Z"),
            "homeSelection": {
                "price": "7/20",
                "selectionName": "S. NAHIMANA"
            },
            "awaySelection": {
                "price": "15/8",
                "selectionName": "F. STOLLAR"
            }
        },
        {
            "eventDateTime": new Date("2023-08-03T10:49:00.000Z"),
            "homeSelection": {
                "price": "1/25",
                "selectionName": "D. RADANOVIC"
            },
            "awaySelection": {
                "price": "13/2",
                "selectionName": "T. LEMAITRE"
            }
        }
    ]

    homeDrawAwayEvent: HomeAway[] = [

        {
            "eventDateTime": new Date("2023-08-03T10:00:00.000Z"),
            "homeSelection": {
                "price": "7/20",
                "selectionName": "S. NAHIMANA"
            },
            "awaySelection": {
                "price": "15/8",
                "selectionName": "F. STOLLAR"
            }
        },
        {
            "eventDateTime": new Date("2023-08-03T10:49:00.000Z"),
            "homeSelection": {
                "price": "1/25",
                "selectionName": "D. RADANOVIC"
            },
            "awaySelection": {
                "price": "13/2",
                "selectionName": "T. LEMAITRE"
            }
        }

    ]

}