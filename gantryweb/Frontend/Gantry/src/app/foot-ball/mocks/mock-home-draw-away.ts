import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model";
import { HomeDrawAway } from "../components/home-draw-away/models/home-draw-away.model";

export class Mock1 {
    staticContent: GantryCommonContent = {
        "contentParameters": {
            "Abandoned": "ABANDONED",
            "Away": "AWAY",
            "CoralPrice": "EARLY PRICE",
            "Draw": "DRAW",
            "EachWay": "EACH-WAY",
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
            "Withdrawn": "WITHDRAWN"
        }
    }

    HomeDrawAwaySelectionResponse : HomeDrawAway[] = [
        {
            "eventName": "ALHAMA CF (WOMEN) VS ATLETICO MADRID (WOMEN)",
            "eventTime": "",
            "eventDateTime":  new Date("2023-05-23T19:00:00Z"),
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "ATLETICO MADRID (WOMEN)",
                "price": "2/7",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "4",
                "hidePrice": false,
                "selectionName":"",

            },
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "ALHAMA CF (WOMEN)",
                "price": "15/2",
                "hidePrice": false
            }
        },
        {
            "eventName": "ABC FC RN VS TOMBENSE FC MG",
            "eventTime": "",
            "eventDateTime": new Date("2023-05-23T18:00:00Z"),
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "TOMBENSE FC MG",
                "price": "2",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "21/10",
                "hidePrice": false, 
                "selectionName":"",
            },
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "ABC FC RN",
                "price": "23/20",
                "hidePrice": false
            }
        },
       
        {
            "eventName": "AL-FAISALY FC VS AL-AIN FC",
            "eventTime": "",
            "eventDateTime": new Date ("2023-05-23T18:00:00Z"),
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "AL-FAISALY FC",
                "price": "19/20",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "11/5",
                "hidePrice": false,
                "selectionName":"",
            },
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "AL-AIN FC",
                "price": "5/2",
                "hidePrice": false
            }
        },

    ]

    HomeDrawAwaySelectionExpected : HomeDrawAway[] =[
        
    {
        "eventName": "ABC FC RN VS TOMBENSE FC MG",
        "eventTime": "",
        "eventDateTime": new Date  ("2023-05-23T18:00:00Z"),
        "awaySelection": {
            "hideEntry": false,
            "selectionName": "TOMBENSE FC MG",
            "price": "2",
            "hidePrice": false
        },
        "drawSelection": {
            "hideEntry": false,
            "price": "21/10",
            "hidePrice": false,
            "selectionName":"",
        },
        "homeSelection": {
            "hideEntry": false,
            "selectionName": "ABC FC RN",
            "price": "23/20",
            "hidePrice": false
        }
    },
    {
        "eventName": "AL-FAISALY FC VS AL-AIN FC",
        "eventTime": "",
        "eventDateTime": new Date ("2023-05-23T18:00:00Z"),
        "homeSelection": {
            "hideEntry": false,
            "selectionName": "AL-FAISALY FC",
            "price": "19/20",
            "hidePrice": false
        },
        "drawSelection": {
            "hideEntry": false,
            "price": "11/5",
            "hidePrice": false,
             "selectionName":"",
        },
        "awaySelection": {
            "hideEntry": false,
            "selectionName": "AL-AIN FC",
            "price": "5/2",
            "hidePrice": false
        }
    },
    {
        "eventName": "ALHAMA CF (WOMEN) VS ATLETICO MADRID (WOMEN)",
        "eventTime": "",
        "eventDateTime":new Date ("2023-05-23T19:00:00Z"),
        "awaySelection": {
            "hideEntry": false,
            "selectionName": "ATLETICO MADRID (WOMEN)",
            "price": "2/7",
            "hidePrice": false
        },
        "drawSelection": {
            "hideEntry": false,
            "price": "4",
            "hidePrice": false,
            "selectionName":"",
        },
        "homeSelection": {
            "hideEntry": false,
            "selectionName": "ALHAMA CF (WOMEN)",
            "price": "15/2",
            "hidePrice": false
        }
    },]

    homeDrawAwayEvent: HomeDrawAway[] = [

        {
            "eventName": "FA EURO - NEW YORK MAGIC (WOMEN) VS MANHATTAN SC (WOMEN)",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T00:30:00Z"),
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "FA EURO - NEW YORK MAGIC (WOMEN)",
                "price": "8/5",
                "hidePrice": true
            },
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "MANHATTAN SC (WOMEN)",
                "price": "23/20",
                "hidePrice": true
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "11/4",
                "hidePrice": true,
                "selectionName": "",
            }
        },
        {
            "eventName": "DEPORTIVO CAMIONEROS (RESERVES) VS CA ESTUDIANTES (RESERVES)",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T13:00:00Z"),
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "DEPORTIVO CAMIONEROS (RESERVES)",
                "price": "5/4",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "6/4",
                "hidePrice": false,
                "selectionName": "",
            },
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "CA ESTUDIANTES (RESERVES)",
                "price": "13/5",
                "hidePrice": false
            }
        },
        {
            "eventName": "KEDAH DARUL AMAN VS PERAK FC",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T13:00:00Z"),
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "PERAK FC",
                "price": "50",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "14",
                "hidePrice": false,
                "selectionName": "",
            },
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "KEDAH DARUL AMAN",
                "price": "1/40",
                "hidePrice": false
            }
        },
        {
            "eventName": "RIOSTRENSE EC RJ VS MESQUITA RJ",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T13:00:00Z"),
            "drawSelection": {
                "hideEntry": false,
                "price": "29/10",
                "hidePrice": false,
                "selectionName": "",
            },
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "MESQUITA RJ",
                "price": "1/2",
                "hidePrice": false
            },
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "RIOSTRENSE EC RJ",
                "price": "9/2",
                "hidePrice": false
            }
        },
        {
            "eventName": "CSM RESITA VS CSM DEVA",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T14:30:00Z"),
            "drawSelection": {
                "hideEntry": true,
                "price": "7/2",
                "hidePrice": true,
                "selectionName": "",
            },
            "homeSelection": {
                "hideEntry": true,
                "selectionName": "CSM RESITA",
                "price": "2/5",
                "hidePrice": true
            },
            "awaySelection": {
                "hideEntry": true,
                "selectionName": "CSM DEVA",
                "price": "19/4",
                "hidePrice": true
            }
        },
        {
            "eventName": "CHELGHOUM LAID (U21) VS ES SETIF (U21)",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T15:00:00Z"),
            "awaySelection": {
                "hideEntry": false,
                "selectionName": "ES SETIF (U21)",
                "price": "2/5",
                "hidePrice": false
            },
            "homeSelection": {
                "hideEntry": false,
                "selectionName": "CHELGHOUM LAID (U21)",
                "price": "5",
                "hidePrice": false
            },
            "drawSelection": {
                "hideEntry": false,
                "price": "16/5",
                "hidePrice": false,
                "selectionName": "",
            }
        },
        {
            "eventName": "CS CONSTANTINE (U21) VS RC ARBA (U21)",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T15:00:00Z"),
            "awaySelection": {
                "hideEntry": true,
                "selectionName": "RC ARBA (U21)",
                "price": "18",
                "hidePrice": true
            },
            "drawSelection": {
                "hideEntry": true,
                "price": "9",
                "hidePrice": true,
                "selectionName": "",
            },
            "homeSelection": {
                "hideEntry": true,
                "selectionName": "CS CONSTANTINE (U21)",
                "price": "1/12",
                "hidePrice": true
            }
        },
        {
            "eventName": "DEPORTES IQUIQUE (WOMEN) VS DEPORTES ANTOFAGASTA (WOMEN)",
            "eventTime": "",
            "eventDateTime": new Date("2023-06-07T15:00:00Z"),
            "awaySelection": {
                "hideEntry": true,
                "selectionName": "DEPORTES ANTOFAGASTA (WOMEN)",
                "price": "1",
                "hidePrice": true
            },
            "drawSelection": {
                "hideEntry": true,
                "price": "3",
                "hidePrice": true,
                "selectionName": "",
            },
            "homeSelection": {
                "hideEntry": true,
                "selectionName": "DEPORTES IQUIQUE (WOMEN)",
                "price": "17/10",
                "hidePrice": true
            }
        }
    ]
    
}


