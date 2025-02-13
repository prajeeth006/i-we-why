import { NCastDividend, SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { DartDataContent } from "../models/dart-data-content.model";

export class MockDartNoDrawData {
    eventId: "2733604"

    marketIds:'84979881,84980284,84980479,84981600'

    dartMockDataContent: DartDataContent = {
        contentParameters: {
            "LeadTitle": "Darts",
            "AdditionalInfo": "Additional Info",
            "OptionalInfo": "OPTIONAL ADDITIONAL INFO",
            "OnRequest": "OTHERS ON REQUEST",
            "MoreMarkets": "More Markets avaiable on BETSTATION"
        }
    };

    corectScoreSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2733604,
                "marketKey": 84980479,
                "selectionKey":279919384,"selectionName":"|Beau Anderson 6-7|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            1,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279918813,"selectionName":"|Ken Mather 6-6|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            2,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279918761,"selectionName":"|Ken Mather 6-5|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            3,
            {
                "eventKey": 2733604,
                "marketKey": 84980479,
                "selectionKey":279919038,"selectionName":"|Beau Anderson 6-3|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            4,
            {
                "eventKey": 2733604,
                "marketKey": 84980479,
                "selectionKey":279917039,"selectionName":"|Ken Mather 6-1|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            5,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279918501,"selectionName":"|Ken Mather 6-4|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            6,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279917418,"selectionName":"|Beau Anderson 6-0|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            7,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279917359,"selectionName":"|Ken Mather 6-3|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            8,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279919131,"selectionName":"|Beau Anderson 6-5|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            9,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279917331,"selectionName":"|Ken Mather 6-2|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            10,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279916566,"selectionName":"|Ken Mather 6-0|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            11,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279919148,"selectionName":"|Beau Anderson 6-6|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            12,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279917979,"selectionName":"|Beau Anderson 6-2|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            13,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279917432,"selectionName":"|Beau Anderson 6-1|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            14,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279919130,"selectionName":"|Beau Anderson 6-4|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ],
        [
            15,
            {
                "eventKey":2733604,
                "marketKey": 84980479,
                "selectionKey":279919021,"selectionName":"|Ken Mather 6-7|",
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
                    "parents": "c.16:cl.97:t.442:e.1950394:m.84980479"
                },
                runnerNumber: 0,
                correctScoreAway:"",
                correctScoreHome:""
            }
        ]
    ]);

    correctScoreBetting: SportBookMarketStructured = {
        "eventKey": 2733604,
        "marketKey": 84980479,
        "marketMeaningMajorCode": "-",
        "marketMeaningMinorCode": "--",
        "marketName": "Correct Score",
        "marketStatus": "Active",
        "displayOrder": 10,
        "displayStatus": "Displayed",
        "isGpAvailable": false,
        "isHandicapMarket": false,
        "isIndexMarket": false,
        "isLpAvailable": true,
        "isMarketBIR": false,
        "isOverUnderMarket": false,
        "isSpAvailable": false,
        "isStandardFixedOddsMarket": true,
        "channels": ["a", "R", "b", "c", "d", "K"],
        "meta": { "operation": "create", "parents": "c.9:cl.56:t.147:e.2733604" },
        selections: this.corectScoreSelection,
        marketSort: "",
        marketTypeKey: "",
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: "",
        maxAccumulator: "",
        minAccumulator: "",
        marketFlags: "",
        hasRestrictedSet: "",
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: "",
        isForecastMarket: "",
        isTricastMarket: false,
        eachWayFactorDen: "",
        eachWayFactorNum: "",
        eachWayPlaces: "",
        eachWayWithBet: "",
        marketGroupID: "",
        nCastDividend: new NCastDividend,
        nCastDividends: [],
        nCastDeleteDividend: undefined
    }

    selectionsMstMarket: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2733604,
                "marketKey": 84981600,
                "selectionKey": 279919401,
                "selectionName": "Ken Mather",
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
            1,
            {
                "eventKey":2733604,
                "marketKey":84981600,
                "selectionKey": 279919418,
                "selectionName": "Beau Anderson",
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
        ],
        [
            2,
            {
                "eventKey": 2733604,
                "marketKey": 84981600,
                "selectionKey": 279919418,
                "selectionName": "Beau Anderson",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 3,
                "outcomeMeaningMajorCode": "L",
                "outcomeMeaningMinorCode": "L",
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
                correctScoreAway: "",
                correctScoreHome: ""
            }
        ]
    ]);

    mostOneEighitiesBetting:SportBookMarketStructured = {
        eventKey: 2733604,
        marketKey: 84981600,
        marketMeaningMajorCode: "-",
        marketMeaningMinorCode: "MR",
        marketName: "Most 180s",
        marketStatus: "Active",
        displayOrder: 0,
        displayStatus: "Displayed",
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ["a", "R", "b", "c", "d", "K"],
        meta: {
            "operation": "create",
            "parents": "c.9:cl.56:t.147:e.2733604",
        },
        selections: this.selectionsMstMarket,
        marketSort: "",
        marketTypeKey: "",
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: "",
        maxAccumulator: "",
        minAccumulator: "",
        marketFlags: "",
        hasRestrictedSet: "",
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: "",
        isForecastMarket: "",
        isTricastMarket: false,
        eachWayFactorDen: "",
        eachWayFactorNum: "",
        eachWayPlaces: "",
        eachWayWithBet: "",
        marketGroupID: "",
        nCastDividend: new NCastDividend,
        nCastDividends: [],
        nCastDeleteDividend: undefined
    }

    selectionsHandicapMarket: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 2733604,
                "marketKey": 84980284,
                "selectionKey":279913933,"selectionName":"|Ken Mather|",
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
            1,
            {
                "eventKey":2733604,
                "marketKey":84980284,
                "selectionKey":279914177,"selectionName":"|Beau Anderson|",
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

    handicapBettingMarket:SportBookMarketStructured = {
        eventKey: 2733604,
        marketKey: 84980284,
        marketMeaningMajorCode: "-",
        marketMeaningMinorCode: "MR",
        marketName: "Match Handicap",
        marketStatus: "Active",
        displayOrder: 0,
        displayStatus: "Displayed",
        isGpAvailable: false,
        isHandicapMarket: true,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ["a", "R", "b", "c", "d", "K"],
        meta: {
            "operation": "create",
            "parents": "c.9:cl.56:t.147:e.2733604",
        },
        selections: this.selectionsHandicapMarket,
        marketSort: "",
        marketTypeKey: "",
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: "",
        maxAccumulator: "",
        minAccumulator: "",
        marketFlags: "",
        hasRestrictedSet: "",
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: "",
        isForecastMarket: "",
        isTricastMarket: false,
        eachWayFactorDen: "",
        eachWayFactorNum: "",
        eachWayPlaces: "",
        eachWayWithBet: "",
        marketGroupID: "",
        nCastDividend: new NCastDividend,
        nCastDividends: [],
        nCastDeleteDividend: undefined,
        handicapValue: 1.5
    }

    selectionsMatchMarket: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        // [
        //     0,
        //     {
        //         "eventKey": 2733604,
        //         "marketKey": 84979881,
        //         "selectionKey": 279913327,
        //         "selectionName": "DRAW",
        //         "selectionStatus": "Active",
        //         "displayStatus": "Displayed",
        //         "displayOrder": 2,
        //         "outcomeMeaningMajorCode": "D",
        //         "outcomeMeaningMinorCode": "D",
        //         "channels": [
        //             "K",
        //             "R",
        //             "a",
        //             "b",
        //             "c",
        //             "d"
        //         ],
        //         "isResulted": false,
        //         "isResultConfirmed": false,
        //         "resultCode": "Unset",
        //         "isSettled": false,
        //         "suspensionReason": "-",
        //         "meta": {
        //             "operation": "create",
        //             "parents": "c.16:cl.97:t.442:e.1950394:m.79731778"
        //         },
        //         "prices": {
        //             "price": [
        //                 {
        //                     "numPrice": 8,
        //                     "denPrice": 1,
        //                     "selectionPriceType": "LP"
        //                 },
        //                 {
        //                     "numPrice": 7,
        //                     "denPrice": 1,
        //                     "selectionPriceType": "LP"
        //                 },
        //                 {
        //                     "numPrice": 13,
        //                     "denPrice": 2,
        //                     "selectionPriceType": "LP"
        //                 }
        //             ]
        //         },
        //         runnerNumber: 0,
        //         correctScoreAway:"",
        //         correctScoreHome:""
        //     }
        // ],
    [
            0,
            {
                "eventKey": 2733604,
                "marketKey": 84979881,
                "selectionKey": 279912224,
                "selectionName": "Ken Mather",
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
            1,
            {
                "eventKey":2733604,
                "marketKey":84979881,
                "selectionKey": 279912225,
                "selectionName": "Beau Anderson",
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

    matchBettingMarket: SportBookMarketStructured = {
        eventKey: 2733604,
        marketKey: 84979881,
        marketMeaningMajorCode: "-",
        marketMeaningMinorCode: "MR",
        marketName: "Match Betting",
        marketStatus: "Active",
        displayOrder: 0,
        displayStatus: "Displayed",
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ["a", "R", "b", "c", "d", "K"],
        meta: {
            "operation": "create",
            "parents": "c.9:cl.56:t.147:e.2733604",
        },
        selections: this.selectionsMatchMarket,
        marketSort: "",
        marketTypeKey: "",
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: "",
        maxAccumulator: "",
        minAccumulator: "",
        marketFlags: "",
        hasRestrictedSet: "",
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: "",
        isForecastMarket: "",
        isTricastMarket: false,
        eachWayFactorDen: "",
        eachWayFactorNum: "",
        eachWayPlaces: "",
        eachWayWithBet: "",
        marketGroupID: "",
        nCastDividend: new NCastDividend,
        nCastDividends: [],
        nCastDeleteDividend: undefined
    }

    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
        [
            [0, this.matchBettingMarket],
            [1, this.handicapBettingMarket],
            [2, this.mostOneEighitiesBetting],
            [3, this.correctScoreBetting]
        ]
    );

    event: SportBookEventStructured = {
        eventKey: 2733604,
        eventName: "KEN MATHER v BEAU ANDERSON",
        eventStatus: "Active",
        displayStatus: "Displayed",
        displayOrder: 0,
        hasBIRMarkets: "",
        eventSort: "",
        eventDateTime: new Date,
        isEventStarted: false,
        isEventFinished: false,
        isEventResulted: false,
        isCashoutAvailable: false,
        channels: ['a', 'R', 'b', 'c', 'd', 'K'],
        flags: [],
        meta: { operation: 'create', parents: 'c.10:cl.58:t.16407' },
        raceStage: "",
        offTime: null,
        markets: this.markets
    }

    eventDart: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>(
        [[0, this.event]]
    );

    sportBookResult: SportBookResult = {
        events: this.eventDart
    };

}