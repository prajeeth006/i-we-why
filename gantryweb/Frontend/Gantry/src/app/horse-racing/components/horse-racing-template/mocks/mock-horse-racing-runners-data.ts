import { MeetingResultContent, MeetingResultMap, ResultingContent } from "src/app/common/models/data-feed/meeting-results.model";
import { SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { RacingContentResult } from "src/app/horse-racing/models/data-feed/racing-content.model";
import { HorseRacingResultPage } from "src/app/horse-racing/models/horse-racing-template.model";
import { HorseRacingContent } from "src/app/horse-racing/models/horseracing-content.model";

export class MockHorseRacingRunnersData {

    sportBookResult: SportBookResult = {
        "events": new Map<number, SportBookEventStructured>([
            [
                1944555,
                {
                    "markets": new Map<number, SportBookMarketStructured>([
                        [
                            79482512,
                            {
                                "selections": new Map<number, SportBookSelection>([
                                    [
                                        265279201,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279201,
                                            "selectionName": "UNNAMED 2ND FAVOURITE",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 13,
                                            "outcomeMeaningMajorCode": "2",
                                            "outcomeMeaningMinorCode": "2",
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "runnerNumber": undefined,
                                            "prices": undefined
                                        }
                                    ],
                                    [
                                        265279208,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279208,
                                            "selectionName": "HEY FRANKIE",
                                            "selectionStatus": "Active",
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 4,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279206,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279206,
                                            "selectionName": "MILLY'S DAUGHTER",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 8,
                                            "runnerNumber": 8,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 16,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279212,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279212,
                                            "selectionName": "MOUSETRAP",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 9,
                                            "runnerNumber": 9,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
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
                                        265279200,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279200,
                                            "selectionName": "UNNAMED FAVOURITE",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 12,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "runnerNumber": undefined,
                                            "prices": undefined
                                        }
                                    ],
                                    [
                                        265279205,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279205,
                                            "selectionName": "LADY WILBERRY",
                                            "selectionStatus": "Active",
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 28,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279204,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279204,
                                            "selectionName": "FAIRY GEM",
                                            "selectionStatus": "Active",
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 6,
                                                        "denPrice": 5,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279209,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279209,
                                            "selectionName": "PEERLESS BEAUTY",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 10,
                                            "runnerNumber": 10,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 5,
                                                        "denPrice": 2,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279211,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279211,
                                            "selectionName": "KHALINA STAR",
                                            "selectionStatus": "Active",
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
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
                                        265279210,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279210,
                                            "selectionName": "WOODFORD BRIDGE",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 11,
                                            "runnerNumber": 11,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
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
                                        265279207,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279207,
                                            "selectionName": "MARINE JAG",
                                            "selectionStatus": "Active",
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 18,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279202,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279202,
                                            "selectionName": "GLENVIEW BEAUTY",
                                            "selectionStatus": "Active",
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
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
                                        265279203,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482512,
                                            "selectionKey": 265279203,
                                            "selectionName": "ANNIE WICKS",
                                            "selectionStatus": "Active",
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482512"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 28,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                ]),
                                "eventKey": 1944555,
                                "marketKey": 79482512,
                                "marketMeaningMajorCode": "-",
                                "marketMeaningMinorCode": "--",
                                "marketName": "WIN OR EACH WAY",
                                "marketStatus": "Active",
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
                                "isEachWayAvailable": "true",
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
                                "eachWayFactorDen": "5",
                                "eachWayFactorNum": "1",
                                "eachWayPlaces": "3",
                                "eachWayWithBet": "N",
                                "marketGroupID": "136943",
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
                                    "parents": "c.21:cl.223:t.1960:e.1944555"
                                },
                                nCastDividend: undefined,
                                nCastDividends: undefined,
                                nCastDeleteDividend: undefined
                            }
                        ],
                        [
                            79626888,
                            {
                                "selections": new Map<number, SportBookSelection>([
                                    [
                                        265685153,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79626888,
                                            "selectionKey": 265685153,
                                            "selectionName": "PEERLESS BEAUTY",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
                                            "runnerNumber": 10,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79626888"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 1,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                ]),
                                "eventKey": 1944555,
                                "marketKey": 79626888,
                                "marketMeaningMajorCode": "-",
                                "marketMeaningMinorCode": "--",
                                "marketName": "BETTING WITHOUT FAIRY GEM",
                                "marketStatus": "Active",
                                "displayOrder": 30,
                                "displayStatus": "Displayed",
                                "marketSort": "--",
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
                                "isEachWayAvailable": "true",
                                "isForecastMarket": "false",
                                "isGpAvailable": false,
                                "isHandicapMarket": false,
                                "isIndexMarket": false,
                                "isLpAvailable": true,
                                "isMarketBIR": false,
                                "isOverUnderMarket": false,
                                "isSpAvailable": false,
                                "isStandardFixedOddsMarket": true,
                                "isTricastMarket": false,
                                "eachWayWithBet": "Y",
                                "marketGroupID": "137301",
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
                                    "parents": "c.21:cl.223:t.1960:e.1944555"
                                },
                                "eachWayFactorDen": "3",
                                "eachWayFactorNum": "2",
                                "eachWayPlaces": "3",
                                marketFlags: "",
                                nCastDividend: undefined,
                                nCastDividends: undefined,
                                nCastDeleteDividend: undefined
                            }
                        ],
                        [
                            79482515,
                            {
                                "selections": new Map<number, SportBookSelection>([
                                    [
                                        265279238,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279238,
                                            "selectionName": "LADY WILBERRY",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 6,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279235,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279235,
                                            "selectionName": "ANNIE WICKS",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 1,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279242,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279242,
                                            "selectionName": "MARINE JAG",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 7,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279244,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279244,
                                            "selectionName": "PEERLESS BEAUTY",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
                                            "runnerNumber": 10,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 3,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279243,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279243,
                                            "selectionName": "Hey Frankie",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 4,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279237,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279237,
                                            "selectionName": "FAIRY GEM",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 2,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279240,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279240,
                                            "selectionName": "MOUSETRAP",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
                                            "runnerNumber": 9,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 2,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279245,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279245,
                                            "selectionName": "WOODFORD BRIDGE",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
                                            "runnerNumber": 11,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 4,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279236,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279236,
                                            "selectionName": "GLENVIEW BEAUTY",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                            "isResulted": false,
                                            "isResultConfirmed": false,
                                            "resultCode": "Unset",
                                            "isSettled": false,
                                            "suspensionReason": "-",
                                            "meta": {
                                                "operation": "create",
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 3,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279241,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279241,
                                            "selectionName": "KHALINA STAR",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 5,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    [
                                        265279239,
                                        {
                                            "eventKey": 1944555,
                                            "marketKey": 79482515,
                                            "selectionKey": 265279239,
                                            "selectionName": "MILLY'S DAUGHTER",
                                            "selectionStatus": "Active",
                                            "displayStatus": "Displayed",
                                            "displayOrder": 0,
                                            "runnerNumber": 8,
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
                                                "parents": "c.21:cl.223:t.1960:e.1944555:m.79482515"
                                            },
                                            "prices": {
                                                "price": [
                                                    {
                                                        "numPrice": 1,
                                                        "denPrice": 1,
                                                        "selectionPriceType": "LP"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                ]),
                                "eventKey": 1944555,
                                "marketKey": 79482515,
                                "marketMeaningMajorCode": "-",
                                "marketMeaningMinorCode": "--",
                                "marketName": "TOP 3 FINISH",
                                "marketStatus": "Active",
                                "displayOrder": 210,
                                "displayStatus": "Displayed",
                                "marketSort": "--",
                                "marketTypeKey": "-",
                                "isResulted": false,
                                "isResultConfirmed": false,
                                "isCashoutAvailable": false,
                                "betMinStake": "0.01",
                                "maxAccumulator": "25",
                                "minAccumulator": "1",
                                "marketFlags": "GR",
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
                                "isStandardFixedOddsMarket": true,
                                "isTricastMarket": false,
                                "eachWayWithBet": "N",
                                "marketGroupID": "724709",
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
                                    "parents": "c.21:cl.223:t.1960:e.1944555"
                                },
                                eachWayFactorDen: undefined,
                                eachWayFactorNum: undefined,
                                eachWayPlaces: undefined,
                                nCastDividend: undefined,
                                nCastDividends: undefined,
                                nCastDeleteDividend: undefined
                            }
                        ]
                    ]),
                    "eventKey": 1944555,
                    "eventName": "15:30 PLUMPTON",
                    "eventStatus": "Active",
                    "displayStatus": "Displayed",
                    "displayOrder": 0,
                    "hasBIRMarkets": "false",
                    "eventSort": "MTCH",
                    "eventDateTime": new Date("2022-12-31T15:30:00Z"),
                    "isEventStarted": false,
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
                    "meta": {
                        "operation": "create",
                        "parents": "c.21:cl.223:t.1960"
                    },
                    raceStage: "",
                    offTime: undefined
                }
            ]
        ])
    }

    racingContentResult: RacingContentResult = {
        "ladbrokesDigitalEventId": [
            2023946
        ],
        "ladbrokesRetailEventId": [
            1259990
        ],
        "coralDigitalEventId": [
            7328725
        ],
        "coralRetailEventId": [
            1944555
        ],
        "diomed": "This might go to HEY FRANKIE, who ran well in defeat on her debut at Taunton in October. Peerless Beauty is second choice.",
        "courseName": "PLUMPTON",
        "goingCode": "GS",
        "going": "Good To Soft",
        "obStartTime": "2021-12-13T15:30:00",
        "rpCourseId": 44,
        "courseGraphicsLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/w_plumptonh.jpg",
        "horses": [
            {
                "trainer": "Evan Williams",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/273924.png",
                "horseAge": 4,
                "jockey": "Adam Wedge",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/273924.png",
                "silk": "273924.png",
                "starRating": "2",
                "rpJockeyId": 86912,
                "daysSinceRun": "null",
                "rpHorseId": 3997627,
                "diomedComment": "Closely related to useful jumpers Annsam and Massannie; market may guide",
                "rpTrainerId": 13451,
                "form": [],
                "saddle": "1",
                "weightLbs": 152,
                "horseName": "Annie Wicks",
                "spotlight": "Seventh foal; closely related to useful jumpers Annsam and Massannie; dam 2m4f-3m1f chase winner; stable has poor bumper strike-rate in recent seasons but market support will make this newcomer of interest.",

                "owner": "Wayne Clifford & Ian Gosden",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                rating: undefined,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                formfigs: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Harry Fry",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/184484.png",
                "horseAge": 5,
                "jockey": "Sean Bowen",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/184484.png",
                "silk": "184484.png",
                "starRating": "3",
                "rpJockeyId": 93186,
                "daysSinceRun": "null",
                "rpHorseId": 3997622,
                "diomedComment": "Sister to smart jumper Angels Breath; stable has very good bumper record; appeals on paper",
                "rpTrainerId": 27170,
                "form": [],
                "saddle": "2",
                "weightLbs": 152,
                "horseName": "Fairy Gem",
                "spotlight": "Fifth foal; sister to smart jumper Angels Breath and bumper/useful hurdle winner Outofthisworld; dam unraced half-sister to smart 2m jumper Toubab; stable has very good strike-rate in bumpers (20%); looks the part on paper.",
                "owner": "Chasing Gold Racing Club",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "IRE",
                "nonRunner": false,
                rating: undefined,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                formfigs: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Neil Mulholland",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/56113.png",
                "horseAge": 4,
                "jockey": "Harry Reed",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/56113.png",
                "silk": "56113.png",
                "starRating": "3",
                "rpJockeyId": 93277,
                "daysSinceRun": "null",
                "rpHorseId": 3997620,
                "diomedComment": "Out of half-sister to very smart chaser Bury Parade; yard does quite well in bumpers",
                "rpTrainerId": 20451,
                "form": [],
                "saddle": "3",
                "weightLbs": 152,
                "horseName": "Glenview Beauty",
                "spotlight": "Second foal; dam placed in bumper/modest maiden hurdler, half-sister to very smart chaser Bury Parade; stable has very respectable 11% strike-rate in bumpers.",
                "owner": "The Affordable Partnership",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "IRE",
                "nonRunner": false,
                rating: undefined,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                formfigs: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Michael Scudamore",
                "rating": "109",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/217976c.png",
                "horseAge": 5,
                "jockey": "Richard Patrick",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/217976c.png",
                "silk": "217976c.png",
                "starRating": "5",
                "rpJockeyId": 93320,
                "daysSinceRun": "47",
                "rpHorseId": 3890926,
                "diomedComment": "Clear second on debut at Taunton; winner has held her own in two subsequent Listed races",
                "rpTrainerId": 20450,
                "form": [
                    {
                        "rpr": "93",
                        "weight": "11-0",
                        "raceid": 794735,
                        "weightLbs": 154,
                        "course": "Taunton",
                        "jockey": "Brendan Powell",
                        "date": "2021-10-27T16:15:00",
                        "topspeed": "18",
                        "outcome": "2/8 2¼L,Fire Lake[5/1]10-13",
                        "condition": "TAU 16GF Cl5NHFM,3K",
                        "position": "2",
                        "odds": "5/1",
                        "comment": "tracked leaders, led over 2f out, ridden and headed over 1f out, kept on but held inside final furlong",
                        "noOfRunners": "8",
                        "distanceToWinner": "2¼L",
                        "courseName": "Taunton",
                        "distance": "2m 104y",
                        "raceTitle": "Taunton Racecourse Business Club Mares' Open National Hunt Flat Race (Category 1 Elimination) (GBB)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "other": {
                            "horseName": "Fire Lake",
                            "weight": "10-13"
                        },
                        officialRating: undefined,
                        allowance: undefined
                    }
                ],
                "formfigs": "2",
                "saddle": "4",
                "weightLbs": 152,
                "horseName": "Hey Frankie",
                "spotlight": "Nicely clear of the third when second on debut at Taunton (good to firm) in October, and the winner of that race has held her own in two subsequent Listed events; high on the list.",
                "owner": "Mark Dunphy",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "IRE",
                "nonRunner": false,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Anthony Honeyball",
                "rating": "96",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/212523.png",
                "horseAge": 4,
                "jockey": "Rex Dingle",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/212523.png",
                "silk": "212523.png",
                "starRating": "3",
                "rpJockeyId": 95050,
                "daysSinceRun": "46",
                "rpHorseId": 3890925,
                "diomedComment": "Made underwhelming debut but her trainer usually does very well in bumpers",
                "rpTrainerId": 18639,
                "form": [
                    {
                        "rpr": "80",
                        "weight": "10-5",
                        "raceid": 794742,
                        "weightLbs": 145,
                        "course": "Ffos Las",
                        "jockey": "Ben Godfrey",
                        "date": "2021-10-28T17:20:00",
                        "outcome": "6/9 23L,Gamaret[4/1]11-4",
                        "condition": "FFO 16Sft Cl5MdNHF,2K",
                        "position": "6",
                        "odds": "4/1",
                        "comment": "led, headed but prominent after 2f, pushed along halfway, ridden over 3f out, weakened over 2f out",
                        "noOfRunners": "9",
                        "distanceToWinner": "23L",
                        "courseName": "Ffos Las",
                        "distance": "1m 7f 182y",
                        "raceTitle": "Read Davy Russell On starsportsbet.co.uk Open Maiden National Hunt Flat Race (Cat 3 Elim) (GBB)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "allowance": "5",
                        "other": {
                            "horseName": "Gamaret",
                            "weight": "11-4"
                        },
                        officialRating: undefined,
                        topspeed: undefined
                    }
                ],
                "formfigs": "6",
                "saddle": "5",
                "weightLbs": 152,
                "horseName": "Khalina Star",
                "spotlight": "Sister to smart hurdler Constantine Bay; made very underwhelming debut when well-held sixth at Ffos Las (soft) in October but her trainer usually does very well in bumpers, so a better run here would not surprise.",
                "owner": "Geegeez.co.uk PA",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Keiran Burke",
                "rating": "92",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/300916.png",
                "horseAge": 4,
                "jockey": "Tom Bellamy",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/300916.png",
                "silk": "300916.png",
                "starRating": "2",
                "rpJockeyId": 89945,
                "daysSinceRun": "258",
                "rpHorseId": 3400772,
                "diomedComment": "Not beaten far in two run-of-the-mill bumpers last season but improvement needed here",
                "rpTrainerId": 25857,
                "form": [
                    {
                        "rpr": "76",
                        "weight": "10-6",
                        "raceid": 779508,
                        "weightLbs": 146,
                        "course": "Fakenham",
                        "jockey": "Mitchell Bastyan",
                        "date": "2021-03-30T17:30:00",
                        "topspeed": "20",
                        "outcome": "5/7 11L,Heartbreaker[25/1]10-9",
                        "condition": "FAK 16Gd Cl4MdNHFM,3K",
                        "position": "5",
                        "odds": "25/1",
                        "comment": "chased leader, ridden and lost position 3f out, kept on from over 1f out, stayed on final 110yds",
                        "noOfRunners": "7",
                        "distanceToWinner": "11L",
                        "courseName": "Fakenham",
                        "distance": "2m 3y",
                        "raceTitle": "Fisher Electrical Contractor Mares' Maiden Open National Hunt Flat Race (GBB Race)",
                        "isHandicap": false,
                        "raceClass": "4",
                        "agesAllowed": "4-6yo",
                        "allowance": "3",
                        "other": {
                            "horseName": "Heartbreaker",
                            "weight": "10-9"
                        },
                        officialRating: undefined
                    },
                    {
                        "rpr": "70",
                        "weight": "10-1",
                        "raceid": 778046,
                        "weightLbs": 141,
                        "course": "Kempton",
                        "jockey": "Jonathan Burke",
                        "date": "2021-02-11T13:35:00",
                        "outcome": "8/12 8¼L,Chalgrove[16/1]11-4",
                        "condition": "KEM 16St/Slw Cl5NHF,2K",
                        "position": "8",
                        "odds": "16/1",
                        "comment": "held up in rear on outer, pushed along and outpaced over 3f out, some headway and hung right 2f out, soon no impression, ridden and beaten over 1f out",
                        "noOfRunners": "12",
                        "distanceToWinner": "8¼L",
                        "courseName": "Kempton",
                        "distance": "2m ",
                        "raceTitle": "Be Better Be Vbetter \"Newcomers\" Standard Open National Hunt Flat Race (GBB Race) (AW)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "other": {
                            "horseName": "Chalgrove",
                            "weight": "11-4"
                        },
                        officialRating: "",
                        topspeed: "",
                        allowance: ""
                    }
                ],
                "formfigs": "85-",
                "saddle": "6",
                "weightLbs": 152,
                "horseName": "Lady Wilberry",
                "spotlight": "Not beaten far in two run-of-the-mill bumpers last season but needs to take a step forward to pose a significant threat here.",
                "owner": "Balham Hill Racing",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Nick Gifford",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/274722.png",
                "horseAge": 4,
                "jockey": "James Davies",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/274722.png",
                "silk": "274722.png",
                "starRating": "3",
                "rpJockeyId": 79663,
                "daysSinceRun": "null",
                "rpHorseId": 3997626,
                "diomedComment": "Half-sister to a Listed-place French jumper; yard enjoys some bumper success",
                "rpTrainerId": 14006,
                "form": [],
                "saddle": "7",
                "weightLbs": 152,
                "horseName": "Marine Jag",
                "spotlight": "70,000euros 3yo; fourth foal; half-sister to a French Listed-placed hurdle/chase winner; dam unraced half-sister to a prolific French Flat winner; stable enjoys some bumper success; market may guide.",
                "owner": "Mrs L Bowtell & P Bowtell",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "FR",
                "nonRunner": false,
                rating: undefined,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                formfigs: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Oliver Sherwood",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/175384.png",
                "horseAge": 4,
                "jockey": "Jonathan Burke",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/175384.png",
                "silk": "175384.png",
                "starRating": "3",
                "rpJockeyId": 91759,
                "daysSinceRun": "null",
                "rpHorseId": 3997621,
                "diomedComment": "First foal from a Listed hurdle winner; stable has fairly good bumper strike-rate",
                "rpTrainerId": 188,
                "form": [],
                "saddle": "8",
                "weightLbs": 152,
                "horseName": "Milly's Daughter",
                "spotlight": "First foal; dam 2m Listed hurdle winner, closely related to bumper/useful jumps winner Jersey Bean; interesting newcomer from stable with fairly good bumper strike-rate.",
                "owner": "A Stewart & A Taylor",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                rating: undefined,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                formfigs: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                allowance: undefined,
                isWithdrawn: undefined
            },
            {
                "trainer": "Warren Greatrex",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/309213.png",
                "horseAge": 4,
                "jockey": "Gavin Sheehan",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/309213.png",
                "silk": "309213.png",
                "starRating": "3",
                "rpJockeyId": 88907,
                "daysSinceRun": "null",
                "rpHorseId": 3872927,
                "diomedComment": "Out of a very useful hurdler and represents stable with good bumper strike-rate",
                "rpTrainerId": 22011,
                "form": [],
                "saddle": "9",
                "weightLbs": 152,
                "horseName": "Mousetrap",
                "spotlight": "First foal; dam very useful hurdler, sister to bumper/jumps winner Tara Mist; trainer has good strike-rate in bumpers (14%) and this debutante looks a good candidate.",
                "owner": "Miss A Gibson Fleming&selwood Bloodstock",
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                rating: "",
                unAdjustedMasterRating: "",
                adjustedMasterRating: "",
                hasJockeyChanged: false,
                formfigs: "",
                courseDistanceWinner: "",
                officialRating: "",
                allowance: 0,
                isWithdrawn: false
            },
            {
                "trainer": "Fergal O'Brien",
                "rating": "112",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/308866.png",
                "horseAge": 5,
                "jockey": "Paddy Brennan",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/308866.png",
                "silk": "308866.png",
                "starRating": "4",
                "rpJockeyId": 76635,
                "daysSinceRun": "19",
                "rpHorseId": 3316994,
                "diomedComment": "Irish point winner; displayed clear promise on both starts under rules; major player",
                "rpTrainerId": 13986,
                "form": [
                    {
                        "rpr": "96",
                        "weight": "10-12",
                        "raceid": 796980,
                        "weightLbs": 152,
                        "course": "Wetherby",
                        "jockey": "Paddy Brennan",
                        "date": "2021-11-24T15:20:00",
                        "topspeed": "35",
                        "outcome": "2/10 ½L,Shighness[4/5F]10-12",
                        "condition": "WET 16Gd Cl5NHFM,3K",
                        "position": "2",
                        "odds": "4/5F",
                        "comment": "raced wide and chased leader, joined main group and close up with one circuit to go, raced wide back straight, led home turn, raced wide and increased tempo home straight, shaken up 2f out, ridden and ducked left inside final furlong, headed final strides",
                        "noOfRunners": "10",
                        "distanceToWinner": "½L",
                        "courseName": "Wetherby",
                        "distance": "2m ",
                        "raceTitle": "EBF Stallions Mares' Open National Hunt Flat Race (Category 1 Elimination) (GBB Race)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "other": {
                            "horseName": "Shighness",
                            "weight": "10-12"
                        },
                        officialRating: undefined,
                        allowance: undefined
                    },
                    {
                        "rpr": "96",
                        "weight": "10-9",
                        "raceid": 793611,
                        "weightLbs": 149,
                        "course": "Aintree",
                        "jockey": "Liam Harrison",
                        "date": "2021-10-24T17:20:00",
                        "topspeed": "57",
                        "outcome": "5/18 7¼L,Lady Excalibur[20/1]11-1",
                        "condition": "AIN 17Gd Cl4NHFM,4K",
                        "position": "5",
                        "odds": "20/1",
                        "comment": "raced wide, held up in rear, steady headway 3f out, ridden over 1f out, kept on but no impression final 110yds",
                        "noOfRunners": "18",
                        "distanceToWinner": "7¼L",
                        "courseName": "Aintree",
                        "distance": "2m 209y",
                        "raceTitle": "Jewson Southport, Bispham Road EBF Mares' Open National Hunt Flat Race (Cat 1 Elimination) (GBB)",
                        "isHandicap": false,
                        "raceClass": "4",
                        "agesAllowed": "4-6yo",
                        "allowance": "3",
                        "other": {
                            "horseName": "Lady Excalibur",
                            "weight": "11-1"
                        },
                        officialRating: undefined
                    }
                ],
                "formfigs": "52",
                "saddle": "10",
                "weightLbs": 152,
                "horseName": "Peerless Beauty",
                "spotlight": "Irish point winner who made promising rules debut when fifth of 18 at Aintree (good) in October; had to settle for second when odds-on at Wetherby (good) last month but still ran well there; leading contender.",
                "owner": "Smell The Flowers",
                "isBeatenFavourite": true,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                isWithdrawn: undefined,
                allowance: undefined
            },
            {
                "trainer": "Clare Hobson",
                "rating": "59",
                "weight": "10-12",
                "silkCoral": "https://silks-stg.coral.co.uk/RP/images/297314.png",
                "horseAge": 5,
                "jockey": "Tabitha Worsley",
                "silkLadbrokes": "https://silks-stg.ladbrokes.com/RP/images/297314.png",
                "silk": "297314.png",
                "starRating": "1",
                "rpJockeyId": 91902,
                "daysSinceRun": "383",
                "rpHorseId": 3269871,
                "diomedComment": "Well beaten at triple-digit odds on her two starts in autumn 2020",
                "rpTrainerId": 21291,
                "form": [
                    {
                        "rpr": "43",
                        "weight": "10-12",
                        "raceid": 770470,
                        "weightLbs": 152,
                        "course": "Wetherby",
                        "jockey": "James Davies",
                        "date": "2020-11-25T15:00:00",
                        "outcome": "8/9 50L,Miss Lamb[200/1]11-5",
                        "condition": "WET 16GS Cl5NHFM,3K",
                        "position": "8",
                        "odds": "200/1",
                        "comment": "led, disputed lead after 6f, ridden and weakened quickly over 4f out",
                        "noOfRunners": "9",
                        "distanceToWinner": "50L",
                        "courseName": "Wetherby",
                        "distance": "2m ",
                        "raceTitle": "EBF Stallions Mares' Standard Open National Hunt Flat Race (GBB Race) (Div I)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "other": {
                            "horseName": "Miss Lamb",
                            "weight": "11-5"
                        },
                        officialRating: undefined,
                        topspeed: undefined,
                        allowance: undefined
                    },
                    {
                        "rpr": "34",
                        "weight": "10-9",
                        "raceid": 768132,
                        "weightLbs": 149,
                        "course": "Uttoxeter",
                        "jockey": "Jeremiah McGrath",
                        "date": "2020-10-30T14:35:00",
                        "topspeed": "1",
                        "outcome": "10/14 69L,Can You Call[125/1]10-11",
                        "condition": "UTT 16Sft Cl5MdNHF,2K",
                        "position": "10",
                        "odds": "125/1",
                        "comment": "midfield, behind halfway",
                        "noOfRunners": "14",
                        "distanceToWinner": "69L",
                        "courseName": "Uttoxeter",
                        "distance": "1m 7f 168y",
                        "raceTitle": "Breeders' Cup On Sky Sports Racing Maiden Open National Hunt Flat Race (GBB Race)",
                        "isHandicap": false,
                        "raceClass": "5",
                        "agesAllowed": "4-6yo",
                        "other": {
                            "horseName": "Can You Call",
                            "weight": "10-11"
                        },
                        officialRating: "",
                        allowance: ""
                    }
                ],
                "formfigs": "08-",
                "saddle": "11",
                "weightLbs": 152,
                "horseName": "Woodford Bridge",
                "spotlight": "Well beaten at triple-digit odds on her two starts in autumn 2020 and makes no appeal on this reappearance outing.",
                "owner": "G Molen",
                "allowance": 5,
                "isBeatenFavourite": false,
                "isReservedRunner": false,
                "horseSuffix": "GB",
                "nonRunner": false,
                unAdjustedMasterRating: undefined,
                adjustedMasterRating: undefined,
                hasJockeyChanged: undefined,
                courseDistanceWinner: undefined,
                officialRating: undefined,
                isWithdrawn: undefined
            }
        ],
        "courseGraphicsCoral": "https://silks-stg.coral.co.uk/RP/images/w_plumptonh.jpg",
        "raceName": "Bet Goodwin 08000 421 321 Mares' Open National Hunt Flat Race (Category 1 Elimination) (GBB Race)",
        "yards": 3904,
        "distance": "2m 1f 164y",
        "newspapers": [
            {
                "selection": "Peerless Beauty",
                "name": "RP Ratings",
                "rpSelectionUid": 3316994,
                "tips": "6"
            },
            {
                "selection": "Fairy Gem",
                "name": "The Times",
                "rpSelectionUid": 3997622,
                "tips": "4"
            },
            {
                "selection": "Hey Frankie",
                "name": "SPOTLIGHT",
                "rpSelectionUid": 3890926,
                "tips": "2"
            },
            {
                "selection": "Fairy Gem",
                "name": "Daily Express",
                "rpSelectionUid": 3997622,
                "tips": undefined
            },
            {
                "selection": "Fairy Gem",
                "name": "Daily Mirror",
                "rpSelectionUid": 3997622,
                "tips": undefined
            },
            {
                "selection": "Fairy Gem",
                "name": "The Star",
                "rpSelectionUid": 3997622,
                "tips": undefined
            },
            {
                "selection": "Hey Frankie",
                "name": "The Guardian",
                "rpSelectionUid": 3890926,
                "tips": undefined
            },
            {
                "selection": "Peerless Beauty",
                "name": "POSTDATA",
                "rpSelectionUid": 3316994,
                "tips": undefined
            },
            {
                "selection": "Peerless Beauty",
                "name": "Telegraph",
                "rpSelectionUid": 3316994,
                "tips": undefined
            },
            {
                "selection": "Peerless Beauty",
                "name": "Daily Mail",
                "rpSelectionUid": 3316994,
                "tips": undefined
            },
            {
                "selection": "Peerless Beauty",
                "name": "The Sun",
                "rpSelectionUid": 3316994,
                "tips": undefined
            },
            {
                "selection": "Peerless Beauty",
                "name": "Daily Record",
                "rpSelectionUid": 3316994,
                "tips": undefined
            }
        ],
        "raceNo": 7,
        "verdict": "This might go to HEY FRANKIE, who ran well in defeat on her debut at Taunton in October. Peerless Beauty has also shown significant ability and is second choice but newcomers Fairy Gem, Mousetrap and Milly's Daughter all make appeal on paper.[Chris Wilson]",
        "time": "2021-12-13T15:30:00",
        "rpRaceId": 798264,
        "flatOrJump": "J",
        "raceType": "NH Flat",
        "tv": "SKY",
        "raceClass": 5,
        "agesAllowed": "4-6yo",
        "ageLimitation": "4-6yo",
        "openAgeRace": "false",
        "runnerCount": 11,
        "prize1": 2178.4,
        "prize2": 1003.6,
        "prize3": 501.6,
        "prize4": 251.2,
        "countryCode": "GB",
        "trends": [
            {
                "year": "2020",
                "weightLbs": "152",
                "trainer": "Anthony Honeyball",
                "jockey": "Aidan Coleman",
                "rpr": "102",
                "draw": "0",
                "age": "4",
                "sp": "7/4F",
                "winner": "Precious"
            }
        ],
        "graphics": "w_plumptonh.jpg",
        "fileTypeFlag": 0,
        "otherEventIds": {
            "LDP": [
                317340
            ],
            "CDR": undefined
        },
        results: undefined,
        isHandicap: undefined,
        trackFences: undefined,
        prize5: undefined,
        prize6: undefined,
        keystat: undefined,
        sisData: {
            "coralRetailEventId": null, "time": "", "fileTypeFlag": null, "name": "Kempton", "meetingName": null, "country": "India"
            , "category": "", "sportcode": null, "operation": null, "resultStatusCode": null,
            "photoFinishSelections": null, "date": null, "selectionStatus": [{ "referenceId": null, "runnerNumber": "14", "status": "G" },
            { "referenceId": null, "runnerNumber": "9", "status": "G" },
            { "referenceId": null, "runnerNumber": "6", "status": "W" }], "eventStatusCode": "O"
        },
        hasRacingContent: true
    };

    horseRacingContent: HorseRacingContent = {
        "racingPostImage": {
            "src": "https://scmedia.cms.test.env.works/$-$/62461d8ebe87448cab3fc58c48951c56.png",
            "alt": "RacingPost",
            "width": 545,
            "height": 68
        },
        "contentParameters": {
            "AntePostOptionalAdditionalInfo": "Ante Post Optional Additional Info",
            "AvailableUntil": "AVAILABLE UNTIL",
            "BestOddGuaranteed": "BEST ODDS GUARANTEED",
            "DeadHeat": "Dead-Heat",
            "EW": "E/W",
            "GOING": "GOING",
            "HorseRacing": "HORSE RACING",
            "HowFar": "HOW FAR?",
            "HowFarLeftSideText": "HORSE MUST WIN OR ALL BETS ARE LOSERS / RULE 4 MAY APPLY",
            "HowFarOptionalAdditionalInfo": "How Far Optional Additional Info",
            "HowFarWill": "HOW FAR WILL",
            "JC": "JC",
            "JF": "JF",
            "MatchBetsLeftSideText": "ONE HORSE MUST FINISH OTHERWISE BET VOID",
            "MatchBetsOptionalAdditionalInfo": " Match Bets Optional Additional Info",
            "Meeting": "MEETING",
            "MoneyBoostLeftSideText": "MAX BET £25. SINGLES ONLY. ONE PER CUSTOMER. BETS MUST BE PLACES OVER THE COUNTER TO QUALIFY.",
            "MoneyBoostSubtitleLeft": "RENDLESHAM HURDLE SPECIAL",
            "MoneyBoostSubtitleRight": "AVAILABLE UNTIL 11AM TODAY",
            "No": "NO",
            "PLACES": "PLACES",
            "RACE": "RACE",
            "RAN": "RAN",
            "RUN": "RUN",
            "Runner": "RUNNER",
            "SuspendsAt": "SUSPENDS AT",
            "TIP": "TIP",
            "TodaysMatchBets": "TODAY'S MATCH BETS",
            "TodaysNonRunnersUK": "TODAY'S NON RUNNERS UK",
            "Was2": "WAS 2",
            "WinBy": "WIN BY?",
            "WinOnly": "WIN ONLY",
            "Odds": "ODDS"
        }
    };
    eventResult: HorseRacingResultPage = {
        "racingContent": this.racingContentResult,
        "horseRacingContent": this.horseRacingContent,
        "runners": [
            {
                "horseRunnerNumber": "1",
                "horseName": "Bold Plan",
                "horseOdds": "1",
                "position": "1",
                "isDeadHeat": false,
                "favourite": "f",
                "price": "2",
                "jockeySilkImage": "https://silks-stg.coral.co.uk/RP/images/273924.png",
                "isFavourite": false
            },
            {

                "horseRunnerNumber": "2",
                "horseName": "Bold Plan",
                "horseOdds": "2",
                "position": "2",
                "isDeadHeat": false,
                "favourite": "f",
                "price": "1",
                "jockeySilkImage": "https://silks-stg.coral.co.uk/RP/images/274722.png",
                "isFavourite": false
            },
            {
                "horseRunnerNumber": "3",
                "horseName": "Bold Plan",
                "horseOdds": "3",
                "position": "3",
                "isDeadHeat": false,
                "favourite": "f",
                "price": "5",
                "jockeySilkImage": "https://silks-stg.coral.co.uk/RP/images/308866.png",
                "isFavourite": false
            }
        ],
        "deadHeatPositions": undefined,
        "raceStage": "",
        priceHeader: "",
        eventName: "Romford Results",
        "defaultMarket": undefined,
        "marketEachWayString": "EACH-WAY 1/4 1-2",
        "dividends": undefined,
        "totes": undefined,
        "raceOffTime": "OFF: 12:45:16",
        "eventTime": "17:08",
        "eachWays": "EACH-WAY 1/4 1-2",
        "eachWayResult": "EACH-WAY 1/4 1-2",
        "runnerCount": "5",
        "win": "20.40",
        "place": "5.10,1.50,3.20",
        "isResultAmended": false, 
        "addendumMessage":"", 
        "addendumColor":"white", 
        get placeList(): Array<string> {
            if (!this.place) {
                return [];
            }

            let placeList = this.place.split(",").filter((place: string) => place != "");

            return placeList;
        },
        "foreCast": "56.15",
        "triCast": "",
        "isStewardEnquiry": false,
        "isVoidRace": false,
        "placeDividends": [
            {
                "position": "1",
                "runnerNumber": "1",
                "dividend": "7.34"
            },
            {
                "position": "2",
                "runnerNumber": "2",
                "dividend": "9.34"
            },
            {
                "position": "3",
                "runnerNumber": "3",
                "dividend": "12.34"
            },
        ]
    };

    resultingContent: ResultingContent = {
        "eventId": 2058547,
        "typeId": "1001",
        "eventName": "Romford Results",
        "eventTime": "17:08",
        "runnerCount": 6,
        "raceOffTime": "OFF: 12:45:16",
        "isStewardEnquiry": false,
        "isVoidRace": false,
        "isAbandonedRace": false,
        "isPhotoFinish": false,
        "stewardsState": "",
        "typeFlagCode": "",
        "isMarketResulted": false,
        "resultMarket": {
            "sortedTricast": null,
            "marketKey": 50212475,
            "foreCast": "56.15",
            "triCast": "695.10",
            "exacta": "77.70",
            "trifecta": "77.10",
            "win": "20.40",
            "isMarketSettled": true,
            "stewardsState": "",
            "isAbandonedRace": false,
            "isPhotoFinish": false,
            "listOfSelections": [
                {
                    "selectionName": "Bold Plan N/R",
                    "selectionId": 137590143,
                    "position": "2",
                    "startingPrice": 6.0,
                    "runnerNumber": 1,
                    "startingPriceFraction": "7/1",
                    "isDeadHeat": true,
                    "favourite": "F",
                    "resultCode": "Place"
                },
                {
                    "selectionName": "Some Detail N/R",
                    "selectionId": 137590144,
                    "position": "3",
                    "startingPrice": 2.0,
                    "startingPriceFraction": "14/1",
                    "runnerNumber": 7,
                    "isDeadHeat": false,
                    "favourite": "F",
                    "resultCode": "Lose"
                },
                {
                    "selectionName": "Cheng Gong N/R",
                    "selectionId": 137590140,
                    "position": "1",
                    "startingPrice": 3.0,
                    "runnerNumber": 4,
                    "startingPriceFraction": "14/1",
                    "favourite": "F",
                    "isDeadHeat": false,
                    "resultCode": "Win"
                }
            ],
            "place": "5.10,1.50,3.20",
            get placeList(): Array<string> {
                if (!this.place) {
                    return [];
                }

                let placeList = this.place.split(",").filter((place: string) => place != "");

                return placeList;
            },
            "placePot": "456",
            "quadPot": "457",
            "eachWays": "EACH-WAY 1/4 1-2",
            "placeDividends": [
                {
                    "position": "1",
                    "runnerNumber": "1",
                    "dividend": "7.34"
                },
                {
                    "position": "2",
                    "runnerNumber": "2",
                    "dividend": "9.34"
                },
                {
                    "position": "3",
                    "runnerNumber": "3",
                    "dividend": "12.34"
                },
            ]
        },
        "category": 19,
        isResultAmended: false,
        isMarketSettled: false
    };

    meetingResultContent: MeetingResultContent = {
        resultingContent: this.resultingContent
    }

    types: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>();
    public eventResultMap = new MeetingResultMap();

    constructor() {
        this.eventResultMap.types.set(1, this.meetingResultContent);
    }

}