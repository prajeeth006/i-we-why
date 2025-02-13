import { SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models"
import { FootBallDataContent, MarketResult } from "../models/football.model"


export class MockNFLData {

    eventId:'1997529'

    marketIds:'81322237,81322294,81322243,81322340,103632701'

    marketResult: MarketResult = {
        "eventName": "OHIO STATE @ UTAH",
        "homeTeamTitle": "OHIO STATE",
        "awayTeamTitle": "UTAH",
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
            "SubTitleLeft": "ADDITIONAL INFO",
            "SubTitleRight": "OPTIONAL ADDITIONAL INFO",
            "WinOnly": "WINONLY"
        }
    }

    multilineSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1997529,
                "marketKey": 81322237,
                "selectionKey": 269315492,
                "selectionName": "UTAH",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
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
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322237"
                },
                runnerNumber:0
            }
        ],
        [
            1,
            {
                "eventKey": 1997529,
                "marketKey": 81322237,
                "selectionKey": 269315491,
                "selectionName": "OHIO STATE",
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 30,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322237"
                },
                runnerNumber:0
            }
        ]
    ]);

    handicapSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1997529,
                "marketKey": 81322294,
                "selectionKey": 269315665,
                "selectionName": "UTAH",
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
                            "numPrice": 10,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322294"
                },
                runnerNumber:0
            }
        ],
        [
            1,
            {
                "eventKey": 1997529,
                "marketKey": 81322294,
                "selectionKey": 269315676,
                "selectionName": "OHIO STATE",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
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
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322294"
                },
                runnerNumber:0
            }
        ]
    ]);

    totalPointsSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1997529,
                "marketKey": 103632701,
                "selectionKey": 336881751,
                "selectionName": "Over",
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
                            "numPrice": 10,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322294"
                },
                runnerNumber:0
            }
        ],
        [
            1,
            {
                "eventKey": 1997529,
                "marketKey": 103632701,
                "selectionKey": 336882047,
                "selectionName": "Under",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322294"
                },
                runnerNumber:0
            }
        ]
    ]);

    winningMarginSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                "eventKey": 1997529,
                "marketKey": 81322243,
                "selectionKey": 269315524,
                "selectionName": "UTAH TO WIN BY 7-12",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 4,
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322243"
                },
                runnerNumber:0
            }
        ],
        [
            1,
            {
                "eventKey": 1997529,
                "marketKey": 81322243,
                "selectionKey": 269315522,
                "selectionName": "UTAH TO WIN BY 1-6",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 2,
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 4,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        },
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322243"
                },
                runnerNumber:0
            }
        ],
        [
            2,
            {
                "eventKey": 1997529,
                "marketKey": 81322243,
                "selectionKey": 269315523,
                "selectionName": "OHIO STATE TO WIN BY 7-12",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 3,
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322243"
                },
                runnerNumber:0
            }
        ],
        [
            3,
            {
                "eventKey": 1997529,
                "marketKey": 81322243,
                "selectionKey": 269315521,
                "selectionName": "OHIO STATE TO WIN BY 1-6",
                "selectionStatus": "Active",
                "displayStatus": "Displayed",
                "displayOrder": 1,
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
                "prices": {
                    "price": [
                        {
                            "numPrice": 1,
                            "denPrice": 50,
                            "selectionPriceType": "LP"
                        }
                    ]
                },
                "meta": {
                    "operation": "create",
                    "parents": "c.1:cl.2:t.4:e.1997529:m.81322243"
                },
                runnerNumber:0
            }
        ]
    ]);

    firstTouchdownScorerSelections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([

    [
        0,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315800,
            "selectionName": "MASTER TEAGUE",
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
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        1,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315767,
            "selectionName": "CJ STROUD",
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
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            "prices": {
                "price": [
                    {
                        "numPrice": 1,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            runnerNumber:0
        }
    ],
    [
        2,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317125,
            "selectionName": "TJ PLEDGER",
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
                        "numPrice": 10,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        3,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317101,
            "selectionName": "BRITAIN COVEY",
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
                        "numPrice": 7,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        4,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317126,
            "selectionName": "NEPHI SEWELL",
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
                        "numPrice": 11,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        5,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317124,
            "selectionName": "TAVION THOMAS",
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
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        6,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315776,
            "selectionName": "CHRIS OLAVE",
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
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        7,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315797,
            "selectionName": "KYLE MCCORD",
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
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        8,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317123,
            "selectionName": "CAMERON RISING",
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
                        "numPrice": 8,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        9,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315777,
            "selectionName": "QUINN EWERS",
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
                        "numPrice": 3,
                        "denPrice": 50,
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
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        10,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269315796,
            "selectionName": "GARRETT WILSON",
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
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ],
    [
        11,
        {
            "eventKey": 1997529,
            "marketKey": 81322340,
            "selectionKey": 269317127,
            "selectionName": "BRANT KUITHE",
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
                        "numPrice": 12,
                        "denPrice": 50,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            "meta": {
                "operation": "create",
                "parents": "c.1:cl.2:t.4:e.1997529:m.81322340"
            },
            runnerNumber:0
        }
    ]

    ]);

    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
        [
            [0,{
                "selections": this.multilineSelections,
                "eventKey": 1997529,
                "marketKey": 81322237,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "HH",
                "marketName": "MONEY LINE",
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
                "marketGroupID": "302",
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
                    "parents": "c.1:cl.2:t.4:e.1997529"
                },
                "marketFlags": "MFE,EXP",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [1,{
                "selections": this.handicapSelections,
                "eventKey": 1997529,
                "marketKey": 81322294,
                "marketMeaningMajorCode": "H",
                "marketMeaningMinorCode": "WH",
                "marketName": "SPREAD -1.5",
                "marketStatus": "Active",
                "displayOrder": 10,
                "displayStatus": "Displayed",
                "handicapValue": -1.5,
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
                "marketGroupID": "295",
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
                    "parents": "c.1:cl.2:t.4:e.1997529"
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
                "selections": this.winningMarginSelections,
                "eventKey": 1997529,
                "marketKey": 81322243,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "WM",
                "marketName": "WINNING MARGIN",
                "marketStatus": "Active",
                "displayOrder": 25,
                "displayStatus": "Displayed",
                "marketSort": "WM",
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
                "eachWayWithBet": "Y",
                "marketGroupID": "256",
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
                    "parents": "c.1:cl.2:t.4:e.1997529"
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
                "selections": this.firstTouchdownScorerSelections,
                "eventKey": 1997529,
                "marketKey": 81322340,
                "marketMeaningMajorCode": "-",
                "marketMeaningMinorCode": "FS",
                "marketName": "FIRST TD SCORER",
                "marketStatus": "Active",
                "displayOrder": 570,
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
                "marketGroupID": "258",
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
                    "parents": "c.1:cl.2:t.4:e.1997529"
                },
                "marketFlags": "MFE,EXP",
                eachWayFactorDen: "",
                eachWayFactorNum: "",
                eachWayPlaces: "",
                nCastDividend: null,
                nCastDividends: [],
                nCastDeleteDividend: undefined
            }],
            [4,{
                "selections": this.totalPointsSelections,
                "eventKey": 1997529,
                "marketKey": 103632701,
                "marketMeaningMajorCode": "L",
                "marketMeaningMinorCode": "HL",
                "marketName": "Total Match Points",
                "marketStatus": "Active",
                "displayOrder": 0,
                "handicapValue":2.5,
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
                "isHandicapMarket": true,
                "isIndexMarket": false,
                "isLpAvailable": true,
                "isMarketBIR": false,
                "isOverUnderMarket": false,
                "isSpAvailable": false,
                "isStandardFixedOddsMarket": false,
                "isTricastMarket": false,
                "eachWayWithBet": "N",
                "marketGroupID": "258",
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
                    "parents": "c.1:cl.2:t.4:e.1997529"
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

    event: SportBookEventStructured = {
        "markets": this.markets,
        "eventKey": 1997529,
        "eventName": "OHIO STATE @ UTAH",
        "eventStatus": "Active",
        "displayStatus": "Displayed",
        "displayOrder": 0,
        "hasBIRMarkets": "false",
        "eventSort": "MTCH",
        "eventDateTime": new Date(),
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
        "meta": {
            "operation": "create",
            "parents": "c.1:cl.2:t.4"
        },
        flags : [],
        raceStage: "",
        offTime: new Date()
    }

    events: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>(
        [[0, this.event]]
    );

    sportBookResult: SportBookResult = {
        events: this.events
    }

}