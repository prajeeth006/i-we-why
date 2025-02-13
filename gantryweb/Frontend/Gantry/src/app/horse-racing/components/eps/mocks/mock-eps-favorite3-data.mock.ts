import { NCastDividend, SportBookMarketStructured, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { EpsResult, SportBookEPSEventStructured } from "../services/data-feed/eps-models";

export class EpsFavorite3ServiceMocksData {


    selections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,{
                "eventKey": 4141591,
                "marketKey": 108564278,
                "selectionKey": 356153859,
                "selectionName": "|Mether N/R|",
                "selectionStatus": "Suspended",
                "displayStatus": "Displayed",
                "displayOrder": 7,
                "runnerNumber": 7,
                "outcomeMeaningMajorCode": "-",
                "outcomeMeaningMinorCode": "-",
                "channels": [
                  "K",
                  "R",
                  "a",
                  "b",
                  "c",
                  "d"
                ],
                "isResulted": true,
                "isResultConfirmed": true,
                "resultCode": "Void",
                "isSettled": true,
                "suspensionReason": "-",
                "meta": {
                  "operation": "create",
                  "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
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
                correctScoreAway:"",
                correctScoreHome:""
              }
        ],
        [1, {
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153860,
            "selectionName": "|Unnamed Favourite|",
            "selectionStatus": "Active",
            "displayStatus": "Displayed",
            "displayOrder": 8,
            "outcomeMeaningMajorCode": "1",
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
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
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
        }],
        [
            2, {
                "eventKey": 4141591,
                "marketKey": 108564278,
                "selectionKey": 356153857,
                "selectionName": "|Wakai Umi|",
                "selectionStatus": "Suspended",
                "displayStatus": "Displayed",
                "displayOrder": 3,
                "runnerNumber": 3,
                "outcomeMeaningMajorCode": "-",
                "outcomeMeaningMinorCode": "-",
                "channels": [
                  "K",
                  "R",
                  "a",
                  "b",
                  "c",
                  "d"
                ],
                "isResulted": true,
                "isResultConfirmed": true,
                "resultCode": "Unset",
                "isSettled": true,
                "suspensionReason": "-",
                "meta": {
                  "operation": "create",
                  "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
                },
                "prices": {
                  "price": [
                    {
                      "numPrice": 7,
                      "denPrice": 4,
                      "selectionPriceType": "SP"
                    },
                    {
                      "numPrice": 7,
                      "denPrice": 4,
                      "selectionPriceType": "LP"
                    },
                    {
                      "numPrice": 13,
                      "denPrice": 8,
                      "selectionPriceType": "LP"
                    }
                  ]
                }
              }
        ],
        [3,{
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153862,
            "selectionName": "|Drunk In Love|",
            "selectionStatus": "Suspended",
            "displayStatus": "Displayed",
            "displayOrder": 1,
            "runnerNumber": 1,
            "outcomeMeaningMajorCode": "-",
            "outcomeMeaningMinorCode": "-",
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
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
            },
            "prices": {
              "price": [
                {
                  "numPrice": 7,
                  "denPrice": 4,
                  "selectionPriceType": "SP"
                },
                {
                  "numPrice": 9,
                  "denPrice": 2,
                  "selectionPriceType": "LP"
                },
                {
                  "numPrice": 4,
                  "denPrice": 1,
                  "selectionPriceType": "LP"
                }
              ]
            }
          }
        ],
        [4, {
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153856,
            "selectionName": "|Laranjal|",
            "selectionStatus": "Suspended",
            "displayStatus": "Displayed",
            "displayOrder": 5,
            "runnerNumber": 5,
            "outcomeMeaningMajorCode": "-",
            "outcomeMeaningMinorCode": "-",
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
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
            },
            "prices": {
              "price": [
                {
                  "numPrice": 22,
                  "denPrice": 1,
                  "selectionPriceType": "SP"
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
          }],
          [5, {
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153864,
            "selectionName": "|Distillate|",
            "selectionStatus": "Suspended",
            "displayStatus": "Displayed",
            "displayOrder": 2,
            "runnerNumber": 2,
            "outcomeMeaningMajorCode": "-",
            "outcomeMeaningMinorCode": "-",
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
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
            },
            "prices": {
              "price": [
                {
                  "numPrice": 7,
                  "denPrice": 4,
                  "selectionPriceType": "SP"
                },
                {
                  "numPrice": 7,
                  "denPrice": 2,
                  "selectionPriceType": "LP"
                },
                {
                  "numPrice": 10,
                  "denPrice": 3,
                  "selectionPriceType": "LP"
                }
              ]
            }
          }],
          [6, {
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153861,
            "selectionName": "|All In The Hips|",
            "selectionStatus": "Suspended",
            "displayStatus": "Displayed",
            "displayOrder": 6,
            "runnerNumber": 6,
            "outcomeMeaningMajorCode": "-",
            "outcomeMeaningMinorCode": "-",
            "channels": [
              "K",
              "R",
              "a",
              "b",
              "c",
              "d"
            ],
            "isResulted": true,
            "isResultConfirmed": true,
            "resultCode": "Unset",
            "isSettled": true,
            "suspensionReason": "-",
            "meta": {
              "operation": "create",
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
            },
            "prices": {
              "price": [
                {
                  "numPrice": 10,
                  "denPrice": 3,
                  "selectionPriceType": "SP"
                },
                {
                  "numPrice": 10,
                  "denPrice": 3,
                  "selectionPriceType": "LP"
                },
                {
                  "numPrice": 7,
                  "denPrice": 2,
                  "selectionPriceType": "LP"
                }
              ]
            }
          }],
          [7, {
            "eventKey": 4141591,
            "marketKey": 108564278,
            "selectionKey": 356153863,
            "selectionName": "|Hilltop's Bear|",
            "selectionStatus": "Suspended",
            "displayStatus": "Displayed",
            "displayOrder": 4,
            "runnerNumber": 4,
            "outcomeMeaningMajorCode": "-",
            "outcomeMeaningMinorCode": "-",
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
              "parents": "c.21:cl.223:t.1920:e.4141591:m.108564278"
            },
            "prices": {
              "price": [
                {
                  "numPrice": 10,
                  "denPrice": 1,
                  "selectionPriceType": "SP"
                },
                {
                  "numPrice": 10,
                  "denPrice": 1,
                  "selectionPriceType": "LP"
                },
                {
                  "numPrice": 9,
                  "denPrice": 1,
                  "selectionPriceType": "LP"
                }
              ]
            }
          }]
    ]);


    winOrEachway: SportBookMarketStructured = {
        selections: this.selections,
        "eventKey": 4141591,
        "marketKey": 108564278,
        "marketMeaningMajorCode": "-",
        "marketMeaningMinorCode": "--",
        "marketName": "|Win or Each Way|",
        "marketStatus": "Suspended",
        "displayOrder": 0,
        "displayStatus": "Displayed",
        "marketSort": "--",
        "marketTypeKey": "-",
        "isResulted": false,
        "isResultConfirmed": false,
        "isCashoutAvailable": false,
        "betMinStake": "0.01",
        "maxAccumulator": "25",
        "minAccumulator": "1",
        "marketFlags": "LX",
        "hasRestrictedSet": "N",
        "isAntepost": false,
        "isPlaceOnlyAvailable": false,
        "isEachWayAvailable": "false",
        "isForecastMarket": "true",
        "isGpAvailable": true,
        "isHandicapMarket": false,
        "isIndexMarket": false,
        "isLpAvailable": true,
        "isMarketBIR": false,
        "isOverUnderMarket": false,
        "isSpAvailable": true,
        "isStandardFixedOddsMarket": true,
        "isTricastMarket": false,
        "eachWayFactorDen": "4",
        "eachWayFactorNum": "1",
        "eachWayPlaces": "2",
        "eachWayWithBet": "N",
        "marketGroupID": "136903",
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
            "parents": "c.21:cl.223:t.1920:e.4141591"
        },
        "nCastDividends": [
        ],
        nCastDividend: new NCastDividend,
        nCastDeleteDividend: undefined
    }

    market1: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
        [
            [0, this.winOrEachway]
        ]
    );



    event2 : SportBookEPSEventStructured = {
        "eventKey": 4141591,
        "eventName": "|14:05 Down Royal|",
        "typeName": "Down Royal",
        "typeKey": "1920",
        "categoryName": "|Horse Racing|",
        "eventStatus": "Suspended",
        "displayStatus": "Displayed",
        "displayOrder": 845,
        "hasBIRMarkets": "false",
        "eventSort": "MTCH",
        "eventDateTime": new Date("2022-09-26T13:05:00Z"),
        "typeFlagCode": "QL,IE,AVA,",
        "isEventStarted": true,
        "isEventFinished": false,
        "isEventResulted": false,
        "isCashoutAvailable": false,
        "channels": [
            "K",
            "R",
            "a",
            "b",
            "c",
            "d"
        ],
        "flags": [
            "BL"
        ],
        "runnerCount": 6,
        "meta": {
            "operation": "create",
            "parents": "c.21:cl.223:t.1920"
        },
        "raceStage": "W[Weighed in]",
        "offTime": new Date("2022-09-26 14:05:06"),
        markets: this.market1,
        resultingContent: null
    }

    epsEvent: Map<number, SportBookEPSEventStructured> = new Map<number, SportBookEPSEventStructured>(
        [[0, this.event2]]
    );

    sportBookResult: EpsResult = {
        events: this.epsEvent
    };
    
    

}