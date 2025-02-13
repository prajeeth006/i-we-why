import { SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models"
import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model"
import { FootBallDataContent, MarketResult } from "../models/football.model"


export class MockFootballData {
    gantryCommonContent : GantryCommonContent = {
        contentParameters: {}
    }

    eventId:'1950394'

    marketIds:'79731778,80744036,79731914,79732000'

    marketResult: MarketResult = {
        "eventName": "LIVERPOOL FC VS LEEDS UNITED",
        "homeTeamTitle": "LIVERPOOL FC",
        "awayTeamTitle": "LEEDS UNITED",
    }

    staticContent: FootBallDataContent = {
        "contentParameters": {
            "Away": "AWAY",
            "Competition": "COMPETITION",
            "Draw": "DRAW",
            "Home": "HOME",
            "LeadTitle": "FOOTBALL",
            "MoreMarkets": "MORE MARKETS AVAILABLE ON BETSTATION",
            "OnRequest": "OTHERS ON REQUEST",
            "SubTitle": "K/O TONIGHT XPM - LIVE ON HOTSTAR",
            "WinOnly": "WINONLY"
        }
    }

    matchResultSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1950394,
                "marketKey": 79731778,
                "selectionKey": 266010641,
                "selectionName": "DRAW",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
                "outcomeMeaningMajorCode": "D",
                "outcomeMeaningMinorCode": "D",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731778"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 8,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 7,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 13,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
    [
            1,
            {
                "eventKey": 1950394,
                "marketKey": 79731778,
                "selectionKey": 266010631,
                "selectionName": "LIVERPOOL FC",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 1,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731778"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 9,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 8,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 7,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
    [
            2,
            {
                "eventKey": 1950394,
                "marketKey": 79731778,
                "selectionKey": 266010635,
                "selectionName": "LEEDS UNITED",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 3,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731778"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 20,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 18,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ]
    ]);

    firstGoalScorerSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267875574,
                "selectionName": "JOE GELHARDT",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 5,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            1,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267869245,
                "selectionName": "MOHAMED SALAH",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            2,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267869307,
                "selectionName": "VIRGIL VAN DIJK",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            3,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267875570,
                "selectionName": "PATRICK BAMFORD",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 3,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            4,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267870661,
                "selectionName": "HARVEY ELLIOT",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 7,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            5,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267870507,
                "selectionName": "ROBERTO FIRMINO",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 6,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            6,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267875571,
                "selectionName": "DANIEL JAMES",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 4,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            7,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267869310,
                "selectionName": "TAKUMI MINAMINO",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 9,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 3,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            8,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267875560,
                "selectionName": "RAPHINHA",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            9,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267869350,
                "selectionName": "TYLER MORTON",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 5,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            10,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267869315,
                "selectionName": "DIOGO JOTA",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 4,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            11,
            {
                "eventKey": 1950394,
                "marketKey": 80744036,
                "selectionKey": 267875567,
                "selectionName": "KALVIN PHILLIPS",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                    "price": [
                        {
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.80744036"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ]
    ]);

    correctScoreSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011282,
                "selectionName": "LIVERPOOL FC 3-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 4,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 13,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 7,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 13,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0
            }
        ],
        [
            1,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011108,
                "selectionName": "LEEDS UNITED 1-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 31,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 80,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 70,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 66,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            2,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011155,
                "selectionName": "LIVERPOOL FC 5-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 12,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "5",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 16,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 18,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 20,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            3,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011115,
                "selectionName": "LEEDS UNITED 2-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 32,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            4,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011183,
                "selectionName": "LEEDS UNITED 2-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 33,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 55,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 50,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            5,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011254,
                "selectionName": "LEEDS UNITED 4-2",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 39,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            6,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011167,
                "selectionName": "LIVERPOOL FC 1-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 1,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 11,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            7,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011236,
                "selectionName": "LIVERPOOL FC 2-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 15,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 7,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 15,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            8,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011241,
                "selectionName": "LIVERPOOL FC 2-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 3,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 10,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 9,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 17,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            9,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011219,
                "selectionName": "LIVERPOOL FC 6-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 17,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "6",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 28,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            10,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011269,
                "selectionName": "LIVERPOOL FC 7-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 20,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "7",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 50,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 55,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            11,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011100,
                "selectionName": "DRAW 0-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 26,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            12,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011231,
                "selectionName": "LIVERPOOL FC 6-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 19,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "6",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            13,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011125,
                "selectionName": "LEEDS UNITED 5-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 41,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "5",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            14,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011312,
                "selectionName": "LIVERPOOL FC 4-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 10,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 90,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 80,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 90,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            15,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011142,
                "selectionName": "LEEDS UNITED 9-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 55,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "9",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            16,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011286,
                "selectionName": "LIVERPOOL FC 3-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 5,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 9,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 17,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 9,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            17,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011262,
                "selectionName": "LEEDS UNITED 6-2",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 48,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "6",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            18,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011118,
                "selectionName": "LEEDS UNITED 3-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 34,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            19,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011111,
                "selectionName": "LEEDS UNITED 5-4",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 45,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "5",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            20,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011280,
                "selectionName": "LIVERPOOL FC 7-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 22,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "7",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            21,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011146,
                "selectionName": "LIVERPOOL FC 9-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 25,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "9",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            22,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011212,
                "selectionName": "LEEDS UNITED 8-1",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 54,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "8",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            23,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011306,
                "selectionName": "LIVERPOOL FC 4-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 8,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 11,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            24,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011292,
                "selectionName": "LEEDS UNITED 4-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 40,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            25,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011298,
                "selectionName": "LIVERPOOL FC 8-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 23,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "8",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 90,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            26,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011104,
                "selectionName": "DRAW 4-4",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 30,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            27,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011192,
                "selectionName": "LEEDS UNITED 4-1",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 38,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            28,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011122,
                "selectionName": "LEEDS UNITED 4-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 37,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            29,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011203,
                "selectionName": "LEEDS UNITED 6-1",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 47,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "6",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            30,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011309,
                "selectionName": "LIVERPOOL FC 4-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 9,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 25,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 28,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            31,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011150,
                "selectionName": "LIVERPOOL FC 5-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 11,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "5",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 14,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            32,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011164,
                "selectionName": "LIVERPOOL FC 5-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 14,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "5",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            33,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011188,
                "selectionName": "LEEDS UNITED 3-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 35,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            34,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011129,
                "selectionName": "LEEDS UNITED 6-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 46,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "6",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            35,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011199,
                "selectionName": "LEEDS UNITED 5-1",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 42,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "5",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            36,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011301,
                "selectionName": "LIVERPOOL FC 8-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 24,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "8",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 150,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 200,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            37,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011250,
                "selectionName": "LEEDS UNITED 3-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 36,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 80,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 90,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            38,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011206,
                "selectionName": "LEEDS UNITED 7-1",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 51,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "7",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            39,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011293,
                "selectionName": "LEEDS UNITED 5-3",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 44,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "5",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            40,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011223,
                "selectionName": "LIVERPOOL FC 6-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 18,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "6",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 70,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 66,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 70,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            41,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011133,
                "selectionName": "LEEDS UNITED 7-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 50,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "7",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            42,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011304,
                "selectionName": "LIVERPOOL FC 4-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 7,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "4",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 8,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 17,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 9,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            43,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011172,
                "selectionName": "LIVERPOOL FC 5-4",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 15,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "5",
                "correctScoreAway": "4",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 250,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            44,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011275,
                "selectionName": "LIVERPOOL FC 7-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 21,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "7",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 60,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 66,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 60,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            45,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011159,
                "selectionName": "LIVERPOOL FC 5-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 13,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "5",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            46,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011246,
                "selectionName": "DRAW 2-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 28,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 28,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 25,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            47,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011288,
                "selectionName": "LIVERPOOL FC 3-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 6,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 25,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 25,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            48,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011290,
                "selectionName": "DRAW 3-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 29,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 80,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 70,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 66,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            49,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011178,
                "selectionName": "DRAW 1-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 27,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "1",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 18,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 16,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 14,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            50,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011137,
                "selectionName": "LEEDS UNITED 8-0",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 53,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "0",
                "correctScoreAway": "8",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            51,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011296,
                "selectionName": "LEEDS UNITED 6-3",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 49,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "3",
                "correctScoreAway": "6",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            52,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011217,
                "selectionName": "LIVERPOOL FC 6-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 16,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "6",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 25,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            53,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011257,
                "selectionName": "LEEDS UNITED 5-2",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 43,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "5",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ],
        [
            54,
            {
                "eventKey": 1950394,
                "marketKey": 79731914,
                "selectionKey": 266011266,
                "selectionName": "LEEDS UNITED 7-2",
                "selectionStatus": "Suspended",
                "displayStatus": "NotDisplayed",
                "displayOrder": 52,
                "outcomeMeaningMajorCode": "S",
                "outcomeMeaningMinorCode": "S",
                runnerNumber: 0,
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "2",
                "correctScoreAway": "7",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731914"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 300,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                }
            }
        ]
    ]);

    bothTeamsToScore: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 3839152,
                "marketKey": 101028717,
                "selectionKey": 326938062,
                "selectionName": "NO",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "-",
                "outcomeMeaningMinorCode": "-",
                "channels": [
                  "K",
                  "a",
                  "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                  "price": [
                    {
                      "numPrice": 8,
                      "denPrice": 5,
                      "selectionPriceType": "LP"
                    }
                  ]
                },
                "meta": {
                  "operation": "create",
                  "parents": "c.16:cl.97:t.442:e.3839152:m.101028717"
                },
                "hidePrice": false,
                runnerNumber: null
              }
        ],
    ]);

    matchResultAndBothTeamsToScore: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 3839152,
                "marketKey": 101028859,
                "selectionKey": 326939569,
                "selectionName": "ARSENAL",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                  "K",
                  "a",
                  "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                  "price": [
                    {
                      "numPrice": 4,
                      "denPrice": 12,
                      "selectionPriceType": "LP"
                    },
                    {
                      "numPrice": 1,
                      "denPrice": 12,
                      "selectionPriceType": "LP"
                    }
                  ]
                },
                "meta": {
                  "operation": "create",
                  "parents": "c.16:cl.97:t.442:e.3839152:m.101028859"
                },
                "hidePrice": false,
                runnerNumber:null
              }
        ],
    ]);

    totalGoalsInTheMatch: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 3839152,
                "marketKey": 101028647,
                "selectionKey": 326937975,
                "selectionName": "OVER",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "H",
                "outcomeMeaningMinorCode": "H",
                "channels": [
                  "K",
                  "a",
                  "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "prices": {
                  "price": [
                    {
                      "numPrice": 1,
                      "denPrice": 40,
                      "selectionPriceType": "LP"
                    }
                  ]
                },
                "meta": {
                  "operation": "create",
                  "parents": "c.16:cl.97:t.442:e.3839152:m.101028647"
                },
                "hidePrice": false,
                runnerNumber: null
              }
        ],
    ]);


    halfTimeFullTimeSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([

        [
            0,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011444,
                "selectionName": "LEEDS UNITED/LIVERPOOL FC",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "1",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 20,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 22,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            1,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011456,
                "selectionName": "LIVERPOOL FC/LIVERPOOL FC",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "1",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 2,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 8,
                            "denPrice": 15,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 4,
                            "denPrice": 7,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],

        [
            2,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011434,
                "selectionName": "LEEDS UNITED/DRAW",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "3",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 28,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            3,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011450,
                "selectionName": "LIVERPOOL FC/DRAW",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 3,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "4",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 28,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            4,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011451,
                "selectionName": "LIVERPOOL FC/LEEDS UNITED",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 4,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "5",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 100,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 125,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            5,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011420,
                "selectionName": "DRAW/DRAW",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 5,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "6",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 14,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 12,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 11,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            6,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011424,
                "selectionName": "DRAW/LEEDS UNITED",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 6,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "7",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 33,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            7,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011439,
                "selectionName": "LEEDS UNITED/LEEDS UNITED",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 9,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "8",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 50,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 45,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 40,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            8,
            {
                "eventKey": 1950394,
                "marketKey": 79732000,
                "selectionKey": 266011431,
                "selectionName": "DRAW/LIVERPOOL FC",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 7,
                "outcomeMeaningMajorCode": "HF",
                "outcomeMeaningMinorCode": "9",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79732000"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 16,
                            "denPrice": 5,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 3,
                            "denPrice": 1,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 16,
                            "denPrice": 5,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ]
    ]);

    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
        [
            [0,{
                "selections": this.matchResultSelections,
                "eventKey": 1950394,
                "marketKey": 79731778,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "MR",
                "marketName": "MATCH RESULT",
                "marketStatus": "Suspended",
                "displayOrder": -500,
                "displayStatus": "NotDisplayed",
                "marketSort": "MR",
                "marketTypeKey": "-",
                "isResulted": false,
                "isResultConfirmed": false,
                "isCashoutAvailable": true,
                "betMinStake": "0.01",
                "maxAccumulator": "25",
                "minAccumulator": "1",
                "marketFlags": "MFE,EXP",
                "hasRestrictedSet": "N",
                "isAntepost": false,
                "isPlaceOnlyAvailable": false,
                "isEachWayAvailable": "false",
                "isForecastMarket": "false",
                "isGpAvailable": false,
                "isHandicapMarket": false,
                "isIndexMarket": false,
                "isLpAvailable": true,
                "isMarketBIR": false,
                "isOverUnderMarket": false,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "37241",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394"
                },
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [1,{
                "selections": this.firstGoalScorerSelections,
                "eventKey": 1950394,
                "marketKey": 80744036,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "FS",
                "marketName": "FIRST GOALSCORER",
                "marketStatus": "Active",
                "displayOrder": 55,
                "displayStatus": "Displayed",
                "marketSort": "FS",
                "marketTypeKey": "-",
                "isResulted": false,
                "isResultConfirmed": false,
                "isCashoutAvailable": false,
                "betMinStake": "0.01",
                "maxAccumulator": "25",
                "minAccumulator": "1",
                "hasRestrictedSet": "N",
                "isAntepost": false,
                "isPlaceOnlyAvailable": false,
                "isEachWayAvailable": "false",
                "isForecastMarket": "false",
                "isGpAvailable": false,
                "isHandicapMarket": false,
                "isIndexMarket": false,
                "isLpAvailable": true,
                "isMarketBIR": false,
                "isOverUnderMarket": false,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "37226",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394"
                },
                "marketFlags": "MFE,EXP",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [2, {
                "selections": this.correctScoreSelections,
                "eventKey": 1950394,
                "marketKey": 79731914,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "CS",
                "marketName": "CORRECT SCORE",
                "marketStatus": "Suspended",
                "displayOrder": 9,
                "displayStatus": "NotDisplayed",
                "marketSort": "CS",
                "marketTypeKey": "-",
                "isResulted": false,
                "isResultConfirmed": false,
                "isCashoutAvailable": false,
                "betMinStake": "0.01",
                "maxAccumulator": "25",
                "minAccumulator": "1",
                "hasRestrictedSet": "N",
                "isAntepost": false,
                "isPlaceOnlyAvailable": false,
                "isEachWayAvailable": "false",
                "isForecastMarket": "false",
                "isGpAvailable": false,
                "isHandicapMarket": false,
                "isIndexMarket": false,
                "isLpAvailable": true,
                "isMarketBIR": false,
                "isOverUnderMarket": false,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "37222",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394"
                },
                "marketFlags": "MFE,EXP",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [3,{
                "selections": this.halfTimeFullTimeSelections,
                "eventKey": 1950394,
                "marketKey": 79732000,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "HF",
                "marketName": "HALF TIME / FULL TIME",
                "marketStatus": "Suspended",
                "displayOrder": 22,
                "displayStatus": "NotDisplayed",
                "marketSort": "HF",
                "marketTypeKey": "-",
                "isResulted": false,
                "isResultConfirmed": false,
                "isCashoutAvailable": false,
                "betMinStake": "0.01",
                "maxAccumulator": "25",
                "minAccumulator": "1",
                "hasRestrictedSet": "N",
                "isAntepost": false,
                "isPlaceOnlyAvailable": false,
                "isEachWayAvailable": "false",
                "isForecastMarket": "false",
                "isGpAvailable": false,
                "isHandicapMarket": false,
                "isIndexMarket": false,
                "isLpAvailable": true,
                "isMarketBIR": false,
                "isOverUnderMarket": false,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "37236",
                "channels": [
                    "K",
                    "R",
                    "a",
                    "b",
                    "c",
                    "d"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394"
                },
                "marketFlags": "MFE,EXP",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }]
        ]
    );

    event: SportBookEventStructured = {"eventKey":1950394,"eventName":"|Liverpool FC| |vs| |Leeds United|","eventStatus":"Suspended","displayStatus":"NotDisplayed","displayOrder":0,"hasBIRMarkets":"false","eventSort":"MTCH","eventDateTime":new Date,"isEventStarted":false,"isEventFinished":false,"isEventResulted":false,"isCashoutAvailable":true,"channels":["K","R","a","b","c","d"],"flags":["UK","IE","PVA","IVA","FE","FI","EP","GVA","FE","FI","EP"],"meta":{"operation":"create","parents":"c.16:cl.97:t.442"},raceStage: "", offTime: null, markets: this.markets}

    events: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>(
        [[0, this.event]]
    );

    sportBookResult: SportBookResult = {
        events: this.events
    }

}