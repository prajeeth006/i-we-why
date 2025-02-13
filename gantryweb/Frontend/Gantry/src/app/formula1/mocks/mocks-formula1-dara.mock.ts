import { NCastDividend, SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { Formula1DataContent } from "../model/formula1-content.model";

export class MockFormulaData {
    eventId: "2767106"

    marketIds:'86185866,86185867,86185869,86185870'

    mockDataContent: Formula1DataContent = {
        contentParameters: {
            "LeadTitle": "Formula 1",
            "LeftStipulatedLine": "OTHERS ON REQUEST",
            "RightStipulatedLine": "More Markets avaiable on BETSTATION",
            "WinOnly": "WIN ONLY",
            "RaceWinner": "RACE WINNER",
            "EW": "E/W",
            "BetNamesList": "FASTEST LAP|POINTS FINISH|PODIUM FINISH|RACE WINNER"
        }
    };

   racieWinnerSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
    [
        0,
        {
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300319,"selectionName":"|Carlos Sainz Jr.|",
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
                        "numPrice":10,
                        "denPrice":1,
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
            "eventKey": 2767106,
            "marketKey":86185866,"selectionKey":284254376,"selectionName":"|Max Verstappen|",
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
                        "numPrice":9,"denPrice":5,
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284254373,"selectionName":"|Lewis Hamilton|",
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
                        "numPrice":7,"denPrice":5,
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300892,"selectionName":"|Sergio Perez|",
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
                        "numPrice":40,"denPrice":1,
                        "selectionPriceType": "LP"
                    },
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300318,"selectionName":"|Charles Leclerc|",
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
                        "numPrice":7,"denPrice":1,
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300899,"selectionName":"|Fernando Alonso|",
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
                        "numPrice":66,"denPrice":1,
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300315,"selectionName":"|George Russell|",
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
                        "numPrice":8,"denPrice":1,
                        "selectionPriceType": "LP"
                    },
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
            "eventKey":2767106,"marketKey":86185866,"selectionKey":284300891,"selectionName":"|Lando Norris|",
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
                        "numPrice":25,"denPrice":1,
                        "selectionPriceType": "LP"
                    }
                ]
            },
            runnerNumber: 0,
            correctScoreAway:"",
            correctScoreHome:""
        }
    ],
   ]);

   fastestLapSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
    [
        0,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284302167,"selectionName":"|Fernando Alonso|",
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
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284301548,"selectionName":"|Charles Leclerc|",
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
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284302165,"selectionName":"|Lando Norris|",
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
        3,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284302166,"selectionName":"|Sergio Perez|",
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
        4,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284300923,"selectionName":"|Max Verstappen|",
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
        5,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284301543,"selectionName":"|George Russell|",
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
        6,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284301549,"selectionName":"|Carlos Sainz Jr.|",
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
        7,
        {
            "eventKey":2767106,"marketKey":86185867,"selectionKey":284300922,"selectionName":"|Lewis Hamilton|",
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
   ]);

   podiumFinishSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
    [
        0,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284306968,"selectionName":"|Max Verstappen|",
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
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284306970,"selectionName":"|Charles Leclerc|",
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
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284306969,"selectionName":"|George Russell|",
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
        3,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284308250,"selectionName":"|Fernando Alonso|",
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
        4,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284307609,"selectionName":"|Carlos Sainz Jr.|",
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
        5,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284307610,"selectionName":"|Lando Norris|",
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
        6,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284308249,"selectionName":"|Sergio Perez|",
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
        7,
        {
            "eventKey":2767106,"marketKey":86185869,"selectionKey":284303398,"selectionName":"|Lewis Hamilton|",
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
   ]);

   pointsFinishSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
    [
        0,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284308898,"selectionName":"|Max Verstappen|",
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
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284309557,"selectionName":"|Carlos Sainz Jr.|",
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
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284309558,"selectionName":"|Lando Norris|",
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
        3,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284309561,"selectionName":"|Sergio Perez|",
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
        4,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284308899,"selectionName":"|George Russell|",
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
        5,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284308904,"selectionName":"|Charles Leclerc|",
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
        6,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284310200,"selectionName":"|Fernando Alonso|",
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
        7,
        {
            "eventKey":2767106,"marketKey":86185870,"selectionKey":284308897,"selectionName":"|Lewis Hamilton|",
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
   ]);


   podiumFinishMarket : SportBookMarketStructured = {
       "eventKey": 2767106, "marketKey": 86185869,
       "marketMeaningMajorCode": "-", "marketMeaningMinorCode": "--",
       "marketName": "|PODIUM FINISH|", "marketStatus": "Active",
       "displayOrder": 0, "displayStatus": "Displayed", "marketSort": "--",
       "marketTypeKey": "-", "isResulted": false, "isResultConfirmed": false,
       "isCashoutAvailable": false, "betMinStake": "0.01", "maxAccumulator": "25",
       "minAccumulator": "1", "hasRestrictedSet": "N", "isAntepost": false,
       "isPlaceOnlyAvailable": false, "eachWayWithBet": "Y",
       "marketGroupID": "513084", "channels": ["K", "a", "b"],
       "meta": { "operation": "create", "parents": "c.24:cl.247:t.1464:e.2767106" },
       selections: this.podiumFinishSelection,
       marketFlags: "",
       isGpAvailable: false,
       isHandicapMarket: false,
       isIndexMarket: false,
       isLpAvailable: false,
       isMarketBIR: false,
       isOverUnderMarket: false,
       isSpAvailable: false,
       isStandardFixedOddsMarket: false,
       isTricastMarket: false,
       eachWayFactorDen: "",
       eachWayFactorNum: "",
       eachWayPlaces: "",
       nCastDividend: new NCastDividend,
       nCastDeleteDividend: new NCastDividend,
       nCastDividends: [],
       isEachWayAvailable: "",
       isForecastMarket: ""
   }

   pointFinishMarket: SportBookMarketStructured = {
    "eventKey":2767106,"marketKey":86185870,"marketMeaningMajorCode":"-","marketMeaningMinorCode":"--",
    "marketName":"|POINTS FINISH|","marketStatus":"Active","displayOrder":0,"displayStatus":"Displayed",
    "marketSort":"--","marketTypeKey":"-","isResulted":false,"isResultConfirmed":false,"isCashoutAvailable":false,
    "betMinStake":"0.01","maxAccumulator":"25","minAccumulator":"1","hasRestrictedSet":"N","isAntepost":false,
    "isPlaceOnlyAvailable":false,"eachWayWithBet":"Y","marketGroupID":"513084","channels":["K","a","b"],
    "meta":{"operation":"create","parents":"c.24:cl.247:t.1464:e.2767106"},
    selections: this.pointsFinishSelection,
    marketFlags: "",
    isGpAvailable: false,
    isHandicapMarket: false,
    isIndexMarket: false,
    isLpAvailable: false,
    isMarketBIR: false,
    isOverUnderMarket: false,
    isSpAvailable: false,
    isStandardFixedOddsMarket: false,
    isTricastMarket: false,
    eachWayFactorDen: "",
    eachWayFactorNum: "",
    eachWayPlaces: "",
    nCastDividend: new NCastDividend,
    nCastDeleteDividend: new NCastDividend,
    nCastDividends: [],
    isEachWayAvailable: "",
    isForecastMarket: ""
}

   fastestLapMarket: SportBookMarketStructured = {
       "eventKey": 2767106, "marketKey": 86185867, "marketMeaningMajorCode": "-",
       "marketMeaningMinorCode": "--", "marketName": "|FASTEST LAP|",
       "marketStatus": "Active", "displayOrder": 0, "displayStatus": "Displayed",
       "marketSort": "--", "marketTypeKey": "-", "isResulted": false, "isResultConfirmed": false,
       "isCashoutAvailable": false, "betMinStake": "0.01", "maxAccumulator": "25", "minAccumulator": "1",
       "hasRestrictedSet": "N", "isAntepost": false, "isPlaceOnlyAvailable": false,
       "isEachWayAvailable": "false", "isForecastMarket": "false", "eachWayWithBet": "Y",
       "marketGroupID": "513084", "channels": ["K", "a", "b"],
       "meta": { "operation": "create", "parents": "c.24:cl.247:t.1464:e.2767106" },
       selections: this.fastestLapSelection,
       marketFlags: "",
       isGpAvailable: false,
       isHandicapMarket: false,
       isIndexMarket: false,
       isLpAvailable: false,
       isMarketBIR: false,
       isOverUnderMarket: false,
       isSpAvailable: false,
       isStandardFixedOddsMarket: false,
       isTricastMarket: false,
       eachWayFactorDen: "",
       eachWayFactorNum: "",
       eachWayPlaces: "",
       nCastDividend: new NCastDividend,
       nCastDeleteDividend: new NCastDividend,
       nCastDividends: []
   }

   raceWinnerMarket: SportBookMarketStructured =    {
       "eventKey": 2767106, "marketKey": 86185866,
       "marketMeaningMajorCode": "-",
       "marketMeaningMinorCode": "--",
       "marketName": "|RACE WINNER|", "marketStatus": "Active", "displayOrder": 0,
       "displayStatus": "Displayed", "marketSort": "--", "marketTypeKey": "-",
       "isResulted": false, "isResultConfirmed": false,
       "isCashoutAvailable": false, "betMinStake": "0.01",
       "maxAccumulator": "25", "minAccumulator": "1",
       "hasRestrictedSet": "N",
       "isAntepost": false, "isPlaceOnlyAvailable": false,
       "isEachWayAvailable": "false", "isForecastMarket": "false",
       "isGpAvailable": false,
       "isHandicapMarket": false,
       "eachWayWithBet": "Y", "marketGroupID": "513084", "channels": ["K", "a", "b"],
       "meta": { "operation": "create", "parents": "c.24:cl.247:t.1464:e.2767106" },
       selections: this.racieWinnerSelection,
       marketFlags: "",
       isIndexMarket: false,
       isLpAvailable: false,
       isMarketBIR: false,
       isOverUnderMarket: false,
       isSpAvailable: false,
       isStandardFixedOddsMarket: false,
       isTricastMarket: false,
       eachWayFactorDen: "",
       eachWayFactorNum: "",
       eachWayPlaces: "",
       nCastDividend: new NCastDividend,
       nCastDeleteDividend: new NCastDividend,
       nCastDividends: []
   }

   markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>(
    [
        [0, this.raceWinnerMarket],
        [1, this.fastestLapMarket],
        [2, this.podiumFinishMarket],
        [3, this.pointFinishMarket]
    ]
   );


   event: SportBookEventStructured = {
       "eventKey": 2767106,
       "eventName": "Portuguese Grand Prix (Live)|",
       "typeName": "|World Championship|",
       "categoryName": "|Formula 1|",
       "eventStatus": "Active",
       "displayStatus": "Displayed",
       "displayOrder": 0,
       "hasBIRMarkets": "false",
       "eventSort": "MTCH",
       "eventDateTime": new Date,
       "isEventStarted": false,
       "isEventFinished": false,
       "isEventResulted": false,
       "isCashoutAvailable": false,
       "channels": ["K", "a", "b"],
       "meta": { "operation": "create", "parents": "c.24:cl.247:t.1464" },
       markets: this.markets,
       flags: [],
       raceStage: "",
       offTime: undefined
   }

   eventFormula: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>(
    [[0, this.event]]
    );

    sportBookResult: SportBookResult = {
        events: this.eventFormula
    };
}