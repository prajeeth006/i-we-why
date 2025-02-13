import { SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models"
import { SnookerDataContent, SnookerMarketResult } from "../models/snooker.model"

export class MockSnookerData {

    eventId: '2721740'

    marketIds: '84579915,84580308,84581858,84581334,84581717'

    marketResult: SnookerMarketResult = {
        "eventName": "BARRY HAWKINS vs NEIL ROBERTSON",
        "homeTeamTitle": "BARRY HAWKINS",
        "awayTeamTitle": "NEIL ROBERTSON",
        "additionalInfo": "ADDITIONAL INFORMATION",
        "optionalInfo": "OPTIONAL ADDITIONAL INFORMATION",
    }

    staticContent: SnookerDataContent = {
        "contentParameters": {
            "AdditionalInfo": "ADDITIONAL INFORMATION",
            "Away": "AWAY",
            "BestOf": "BEST OF",
            "Draw": "DRAW",
            "Frames": "FRAMES",
            "Handicap": "HANDICAP",
            "Home": "HOME",
            "MoreMarkets": "MORE MARKETS AVAILABLE ON BETSTATION",
            "OnRequest": "OTHERS ON REQUEST",
            "OptionalInfo": "OPTIONAL ADDITIONAL INFORMATION",
            "Title": "SNOOKER",
            "ToWinTheFirstFrame": "TO WIN THE FIRST FRAME",
            "TotalFrames": "TOTAL FRAMES",
            "Vs": "vs"
        }
    }

    matchResultSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2721740,
                "marketKey": 84579915,
                "selectionKey": 278622520,
                "selectionName": "BARRY HAWKINS",
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
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84579915"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway: "",
                correctScoreHome: ""
            }
        ],
        [
            1,
            {
                "eventKey": 2721740,
                "marketKey": 84579915,
                "selectionKey": 278622521,
                "selectionName": "NEIL ROBERTSON",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
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
                "meta": {
                    "operation": "create",
                    "parents": "c.16:cl.97:t.442:e.1950394:m.79731778"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
                correctScoreAway: "",
                correctScoreHome: ""
            }
        ]

    ]);

    correctScoreSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278624273,
                "selectionName": "BARRY HAWKINS 10-0",
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
                "correctScoreHome": "10",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 2,
                            "denPrice": 12,
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
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278625096,
                "selectionName": "NEIL ROBERTSON 10-2",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "10",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 8,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 7,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
            }
        ],
        [
            2,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278625097,
                "selectionName": "NEIL ROBERTSON 10-3",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "10",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 7,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 8,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
            }
        ],
        [
            3,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278625077,
                "selectionName": "NEIL ROBERTSON 10-1",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "10",
                "correctScoreAway": "1",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 6,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
            }
        ],
        [
            4,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278624974,
                "selectionName": "NEIL ROBERTSON 10-0",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "isResulted": false,
                "isResultConfirmed": false,
                "resultCode": "Unset",
                "isSettled": false,
                "correctScoreHome": "10",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 5,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0,
            }
        ],
        [
            5,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278624273,
                "selectionName": "BARRY HAWKINS 10-0",
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
                "correctScoreHome": "10",
                "correctScoreAway": "0",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0

            }
        ],
        [
            6,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278624849,
                "selectionName": "BARRY HAWKINS 10-2",
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
                "correctScoreHome": "10",
                "correctScoreAway": "2",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 4,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 3,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0

            }
        ],
        [
            7,
            {
                "eventKey": 2721740,
                "marketKey": 84580308,
                "selectionKey": 278624866,
                "selectionName": "BARRY HAWKINS 10-3",
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
                "correctScoreHome": "10",
                "correctScoreAway": "3",
                "suspensionReason": "-",
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84580308"
                },
                "prices": {
                    "price": [
                        {
                            "numPrice": 3,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 4,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                runnerNumber: 0

            }
        ]

    ]);

    handicapSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2721740,
                "marketKey": 84581334,
                "selectionKey": 278626873,
                "selectionName": "NEIL ROBERTSON -1.5",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
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
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581334"
                },
                runnerNumber: 0
            }
        ],
        [
            1,
            {
                "eventKey": 2721740,
                "marketKey": 84581334,
                "selectionKey": 278626872,
                "selectionName": "BARRY HAWKINS +1.5",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
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
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581334"
                },
                runnerNumber: 0
            }
        ]
    ]);

    totalFramesSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2721740,
                "marketKey": 84581858,
                "selectionKey": 278631565,
                "selectionName": "Over",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "HL",
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
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581858"
                },
                runnerNumber: 0
            }
        ],
        [
            1,
            {
                "eventKey": 2721740,
                "marketKey": 84581858,
                "selectionKey": 278631570,
                "selectionName": "Under",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
                "outcomeMeaningMajorCode": "HL",
                "outcomeMeaningMinorCode": "L",
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
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581858"
                },
                runnerNumber: 0
            }
        ]
    ]);

    firstFrameSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2721740,
                "marketKey": 84581717,
                "selectionKey": 278631133,
                "selectionName": "BARRY HAWKINS",
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
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581717"
                },
                runnerNumber: 0
            }
        ],
        [
            1,
            {
                "eventKey": 2721740,
                "marketKey": 84581717,
                "selectionKey": 278631134,
                "selectionName": "NEIL ROBERTSON",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 0,
                "outcomeMeaningMajorCode": "A",
                "outcomeMeaningMinorCode": "A",
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
                            "numPrice": 2,
                            "denPrice": 12,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740:m.84581717"
                },
                runnerNumber: 0
            }
        ]
    ]);

    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
        [
            [0,{
                "selections": this.matchResultSelections,
                "eventKey": 2721740,
                "marketKey": 84579915,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "HH",
                "marketName": "MATCH BETTING",
                "marketStatus": "Active",
                "displayOrder": 0,
                "displayStatus": "Displayed",
                "marketSort": "HH",
                "marketTypeKey": "-",
                "isResulted": false,
                "isResultConfirmed": false,
                "isCashoutAvailable": false,
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
                "isOverUnderMarket": true,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "351771",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740"
                },
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined

            }],
            [1,{
                "selections": this.correctScoreSelections,
                "eventKey": 2721740,
                "marketKey": 84580308,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "CS",
                "marketName": "CORRECT SCORE",
                "marketStatus": "Active",
                "displayOrder": 380,
                "displayStatus": "Displayed",
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
                "marketGroupID": "351809",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740"
                },
                "marketFlags": "",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [2,{
                "selections": this.handicapSelections,
                "eventKey": 2721740,
                "marketKey": 84581334,
                "marketMeaningMajorCode": "H",
                "marketMeaningMinorCode": "WH",
                "marketName": "MATCH HANDICAP",
                "marketStatus": "Active",
                "displayOrder": 360,
                "displayStatus": "Displayed",
                "handicapValue": 4.5,
                "marketSort": "WH",
                "marketTypeKey": "H",
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
                "marketGroupID": "351807",
                "channels": [
                    "K",
                    "a",
                    "b"
                ],
                "meta": {
                    "operation": "create",
                    "parents": "c.32:cl.261:t.16272:e.2721740"
                },
                "marketFlags": "",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [3,{
                "selections": this.totalFramesSelections,
                "eventKey": 2721740,
                "marketKey": 84581858,
                "marketMeaningMajorCode": "L",
                "marketMeaningMinorCode": "HL",
                "marketName": "TOTAL FRAMES OVER/UNDER",
                "marketStatus": "Active",
                "displayOrder": 490,
                "displayStatus": "Displayed",
                "marketSort": "HL",
                "marketTypeKey": "L",
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
                "isOverUnderMarket": true,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "351820",
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
                    "parents": "c.32:cl.261:t.16272:e.2721740"
                },
                "marketFlags": "",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],

            [4,{
                "selections": this.firstFrameSelections,
                "eventKey": 2721740,
                "marketKey": 84581717,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "HH",
                "marketName": "1ST FRAME WINNER",
                "marketStatus": "Active",
                "displayOrder": 1100,
                "displayStatus": "Displayed",
                "marketSort": "HH",
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
                "isOverUnderMarket": true,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "351881",
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
                    "parents": "c.32:cl.261:t.16272:e.2721740"
                },
                "marketFlags": "",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }]
        ]
    );

    event: SportBookEventStructured = {"eventKey":2721740,"eventName":"|Barry Hawkins| |vs| |Neil Robertson|","eventStatus":"Active","displayStatus":"Displayed","displayOrder":0,"hasBIRMarkets":"false","eventSort":"MTCH","eventDateTime":new Date,"isEventStarted":false,"isEventFinished":false,"isEventResulted":false,"isCashoutAvailable":true,"channels":["K","a","b"],"flags":[],"meta":{"operation":"create","parents":"c.32:cl.261:t.16272"},raceStage: "", offTime: null, markets: this.markets}

    events: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>(
        [[0, this.event]]
    );

    sportBookResult: SportBookResult = {
        events: this.events
    }
}