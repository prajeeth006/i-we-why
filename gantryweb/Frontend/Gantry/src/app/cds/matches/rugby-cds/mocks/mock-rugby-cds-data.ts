import { Game } from 'src/app/common/cds-client/models/fixture-view.model';

export class MockRugbyCdsData {
    matchBetting: Game = {
        "id": 77069462,
        "name": {
            "value": "3Way - result",
            "sign": "98xocA=="
        },
        "results": [
            {
                "id": -2132941278,
                "odds": 13.7,
                "name": {
                    "value": "Australia - TestQA1",
                    "sign": "8QKk/w=="
                },
                "sourceName": {
                    "value": "1",
                    "sign": "FtIeRQ=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 1,
                "americanOdds": 1250
            },
            {
                "id": -2132941277,
                "odds": 6.7,
                "name": {
                    "value": "X",
                    "sign": "qcDW9g=="
                },
                "sourceName": {
                    "value": "X",
                    "sign": "qcDW9g=="
                },
                "visibility": "Visible",
                "numerator": 23,
                "denominator": 4,
                "americanOdds": 575
            },
            {
                "id": -2132941276,
                "odds": 8.1,
                "name": {
                    "value": "England",
                    "sign": "akqqNA=="
                },
                "sourceName": {
                    "value": "2",
                    "sign": "pDQjew=="
                },
                "visibility": "Visible",
                "numerator": 7,
                "denominator": 1,
                "americanOdds": 700
            }
        ],
        "templateId": 3153,
        "categoryId": 143,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Gridable",
        "templateCategory": {
            "id": 143,
            "name": {
                "value": "3Way - result",
                "sign": "98xocA=="
            },
            "category": "Gridable"
        },
        "isMain": true,
        "grouping": {
            "gridGroups": [
                "yreruvkg1"
            ],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "de113154-75ae-4d9d-b7bf-496bd763cd9e",
                    "marketGroupItemId": "b7be2b14-b6b2-44e3-aa85-9860fa13b652"
                }
            ]
        }
    };

    handicapBetting: Game = {
        "id": 77069465,
        "name": {
            "value": "Handicap",
            "sign": "MBg3cg=="
        },
        "results": [
            {
                "id": -2132941268,
                "odds": 7.4,
                "name": {
                    "value": "Australia -1,5",
                    "sign": "+zV59A=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 2,
                "americanOdds": 650
            },
            {
                "id": -2132941267,
                "odds": 8.3,
                "name": {
                    "value": "England +1,5",
                    "sign": "DTkPfg=="
                },
                "visibility": "Visible",
                "numerator": 15,
                "denominator": 2,
                "americanOdds": 725
            }
        ],
        "templateId": 3212,
        "categoryId": 150,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "balanced": 1,
        "spread": 0.9,
        "category": "Gridable",
        "templateCategory": {
            "id": 150,
            "name": {
                "value": "2Way Handicap",
                "sign": "QjCLVw=="
            },
            "category": "Gridable"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [
                "ydsfyoh85"
            ],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "de113154-75ae-4d9d-b7bf-496bd763cd9e",
                    "marketGroupItemId": "dc0e6b73-8f75-418c-8598-2f8a6a3251fc"
                }
            ]
        }
    };

    totalPointsBetting: Game = {

        "id": 77069463,
        "name": {
            "value": "Totals",
            "sign": "0ayQ9g=="
        },
        "results": [
            {
                "id": -2132941275,
                "odds": 15.2,
                "name": {
                    "value": "Over 54,5",
                    "sign": "XTfbAw=="
                },
                "visibility": "Visible",
                "numerator": 14,
                "denominator": 1,
                "americanOdds": 1400
            },
            {
                "id": -2132941274,
                "odds": 3.8,
                "name": {
                    "value": "Under 54,5",
                    "sign": "Be638g=="
                },
                "visibility": "Visible",
                "numerator": 14,
                "denominator": 5,
                "americanOdds": 280
            }
        ],
        "templateId": 5819,
        "categoryId": 707,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "balanced": 1,
        "spread": 11.4,
        "category": "Gridable",
        "templateCategory": {
            "id": 707,
            "name": {
                "value": "Totals",
                "sign": "0ayQ9g=="
            },
            "category": "Gridable"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [
                "5oetx9tcj"
            ],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "de113154-75ae-4d9d-b7bf-496bd763cd9e",
                    "marketGroupItemId": "01992abf-8a4f-425d-bc7a-182d4c4a3ac9"
                },
                {
                    "displayType": "Regular",
                    "marketGroupId": "3fc60094-2a7d-4bc7-9a5a-98f1732250ef",
                    "marketGroupItemId": "27e2eb61-1678-4e35-8f5e-8193f622221f"
                }
            ]
        }
    };

    firstHalfHandicapBetting: Game = {
        "id": 77069466,
        "name": {
            "value": "1st Half Handicap",
            "sign": "YUYNQA=="
        },
        "results": [
            {
                "id": -2132941266,
                "odds": 6.2,
                "name": {
                    "value": "Australia -4,5",
                    "sign": "ADFzig=="
                },
                "visibility": "Visible",
                "numerator": 21,
                "denominator": 4,
                "americanOdds": 525
            },
            {
                "id": -2132941265,
                "odds": 9.0,
                "name": {
                    "value": "England +4,5",
                    "sign": "3AGvew=="
                },
                "visibility": "Visible",
                "numerator": 8,
                "denominator": 1,
                "americanOdds": 800
            }
        ],
        "templateId": 7380,
        "categoryId": 716,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 716,
            "name": {
                "value": "2Way H/time Handicap",
                "sign": "E1CMVQ=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "4a3fe773-bae8-447b-9d88-efe050dbba09",
                    "marketGroupItemId": "8b44fbdc-ff56-4ab1-b754-efcf5c2bd309"
                }
            ]
        }
    };

    halfTimeFullTimeBetting: Game = {
        "id": 77069464,
        "name": {
            "value": "Halftime/Fulltime",
            "sign": "NbEdgA=="
        },
        "results": [
            {
                "id": -2132941273,
                "odds": 4.6,
                "name": {
                    "value": "Australia - TestQA1 / Australia - TestQA1",
                    "sign": "ycMrEw=="
                },
                "visibility": "Visible",
                "numerator": 18,
                "denominator": 5,
                "americanOdds": 360
            },
            {
                "id": -2132941272,
                "odds": 8.9,
                "name": {
                    "value": "Australia - TestQA1 / England",
                    "sign": "9rqAYw=="
                },
                "visibility": "Visible",
                "numerator": 8,
                "denominator": 1,
                "americanOdds": 800
            },
            {
                "id": -2132941271,
                "odds": 3.6,
                "name": {
                    "value": "England / Australia - TestQA1",
                    "sign": "X6q15g=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 5,
                "americanOdds": 260
            },
            {
                "id": -2132941270,
                "odds": 7.3,
                "name": {
                    "value": "England / England",
                    "sign": "OVVgvg=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 2,
                "americanOdds": 625
            },
            {
                "id": -2132941269,
                "odds": 8.2,
                "name": {
                    "value": "Any other outcome",
                    "sign": "HdXR/w=="
                },
                "visibility": "Visible",
                "numerator": 7,
                "denominator": 1,
                "americanOdds": 725
            }
        ],
        "templateId": 12532,
        "categoryId": 366,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 366,
            "name": {
                "value": "Halftime/Fulltime",
                "sign": "NbEdgA=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "de113154-75ae-4d9d-b7bf-496bd763cd9e",
                    "marketGroupItemId": "2b3733f8-0778-4d0a-ac0f-2881f66c2972"
                },
                {
                    "displayType": "Regular",
                    "marketGroupId": "4a3fe773-bae8-447b-9d88-efe050dbba09",
                    "marketGroupItemId": "4d75ba3b-726e-4676-8d08-5f541978d6ad"
                }
            ]
        }
    };

}