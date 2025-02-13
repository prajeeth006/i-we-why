import { Game } from 'src/app/common/cds-client/models/fixture-view.model';

export class MockCricketCdsData {
    matchBetting: Game = {
        "id": 76726797,
        "name": {
            "value": "2Way - Who will win? (Dead heat rules apply)",
            "sign": "0aXsoA=="
        },
        "results": [
            {
                "id": -2133836421,
                "odds": 5.6,
                "name": {
                    "value": "Durham",
                    "sign": "lvN6NA=="
                },
                "sourceName": {
                    "value": "1",
                    "sign": "Y9bOXA=="
                },
                "visibility": "Visible",
                "numerator": 9,
                "denominator": 2,
                "americanOdds": 450
            },
            {
                "id": -2133836420,
                "odds": 4.5,
                "name": {
                    "value": "Essex",
                    "sign": "rFarug=="
                },
                "sourceName": {
                    "value": "2",
                    "sign": "kvtV5Q=="
                },
                "visibility": "Visible",
                "numerator": 7,
                "denominator": 2,
                "americanOdds": 350
            }
        ],
        "templateId": 7817,
        "categoryId": 102,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Gridable",
        "templateCategory": {
            "id": 102,
            "name": {
                "value": "2Way - Who will win?",
                "sign": "6dxPAw=="
            },
            "category": "Gridable"
        },
        "isMain": true,
        "grouping": {
            "gridGroups": [
                "6m055au47"
            ],
            "detailed": [
                {
                    "displayType": "Regular",
                    "marketGroupId": "7259184f-e175-44cb-b143-ab9f3f00b74e",
                    "marketGroupItemId": "03b5b99e-3bf3-4d5a-8014-34168483a8c2"
                }
            ]
        }
    };

    homeTopRunScorer: Game = {
        "id": 76726795,
        "name": {
            "value": "Top Home Team batsman",
            "sign": "m/YE6Q=="
        },
        "results": [
            {
                "id": -2133836430,
                "odds": 2.3,
                "name": {
                    "value": "Kohli",
                    "sign": "cNuaZw=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 10,
                "americanOdds": 130
            },
            {
                "id": -2133836429,
                "odds": 4.6,
                "name": {
                    "value": "Rohith",
                    "sign": "ZHRfCw=="
                },
                "visibility": "Visible",
                "numerator": 18,
                "denominator": 5,
                "americanOdds": 360
            },
            {
                "id": -2133836428,
                "odds": 6.7,
                "name": {
                    "value": "Dhoni",
                    "sign": "2QVZuQ=="
                },
                "visibility": "Visible",
                "numerator": 23,
                "denominator": 4,
                "americanOdds": 575
            },
            {
                "id": -2133836427,
                "odds": 3.2,
                "name": {
                    "value": "Hardik",
                    "sign": "dqjKNQ=="
                },
                "visibility": "Visible",
                "numerator": 11,
                "denominator": 5,
                "americanOdds": 220
            }
        ],
        "templateId": 2449,
        "categoryId": 108,
        "resultOrder": "Odds",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 108,
            "name": {
                "value": "Which batsman will score the most runs?",
                "sign": "prIayQ=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [
                {

                    "displayType": "Regular",
                    "marketGroupId": "ccd84774-d23e-4949-aa6e-0c606e6e1ca4",
                    "marketGroupItemId": "d9b08b7b-09a5-4791-b3bb-ad2d3422f3f1"
                },
                {

                    "displayType": "Regular",
                    "marketGroupId": "e779e96a-ca23-4401-9851-8e584a2febe7",
                    "marketGroupItemId": "b290495a-b993-4074-8f5c-febabc22bf82"
                }
            ]
        }
    };

    awayTopRunScorer: Game = {
        "id": 76726796,
        "name": {
            "value": "Who will be the top away batsman?",
            "sign": "FAP1uA=="
        },
        "results": [
            {
                "id": -2133836426,
                "odds": 4.3,
                "name": {
                    "value": "MAHMUDULLAH",
                    "sign": "Ya8zhg=="
                },
                "visibility": "Visible",
                "numerator": 10,
                "denominator": 3,
                "americanOdds": 333
            },
            {
                "id": -2133836425,
                "odds": 4.5,
                "name": {
                    "value": "SHAKIB AI HASAN",
                    "sign": "m9JFzQ=="
                },
                "visibility": "Visible",
                "numerator": 7,
                "denominator": 2,
                "americanOdds": 350
            },
            {
                "id": -2133836424,
                "odds": 6.7,
                "name": {
                    "value": "MUSHFIQUR RAHIM",
                    "sign": "CjNKMw=="
                },
                "visibility": "Visible",
                "numerator": 23,
                "denominator": 4,
                "americanOdds": 575
            },
            {
                "id": -2133836423,
                "odds": 8.7,
                "name": {
                    "value": "TAMIM IQBAL",
                    "sign": "oQ3GQA=="
                },
                "visibility": "Visible",
                "numerator": 15,
                "denominator": 2,
                "americanOdds": 775
            },
            {
                "id": -2133836422,
                "odds": 3.4,
                "name": {
                    "value": "MEHIDY HASAN",
                    "sign": "6j1luw=="
                },
                "visibility": "Visible",
                "numerator": 12,
                "denominator": 5,
                "americanOdds": 240
            }
        ],
        "templateId": 2450,
        "categoryId": 108,
        "resultOrder": "Odds",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 108,
            "name": {
                "value": "Which batsman will score the most runs?",
                "sign": "1qsQJw=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [
                {

                    "displayType": "Regular",
                    "marketGroupId": "ccd84774-d23e-4949-aa6e-0c606e6e1ca4",
                    "marketGroupItemId": "8592bc4e-c724-4705-b360-f05675a44fb0"
                },
                {

                    "displayType": "Regular",
                    "marketGroupId": "e779e96a-ca23-4401-9851-8e584a2febe7",
                    "marketGroupItemId": "762f8808-e3ca-4d99-b572-496ce5a0100c"
                }
            ]
        }
    };

    totalSixes: Game = {
        "id": 76726798,
        "name": {
            "value": "Total match sixes",
            "sign": "EVI8dw=="
        },
        "results": [
            {
                "id": -2133836419,
                "odds": 2.3,
                "name": {
                    "value": "Over 5,6",
                    "sign": "Q//GHQ=="
                },
                "visibility": "Visible",
                "numerator": 13,
                "denominator": 10,
                "americanOdds": 130
            },
            {
                "id": -2133836418,
                "odds": 4.7,
                "name": {
                    "value": "Under 5,6",
                    "sign": "VphHbw=="
                },
                "visibility": "Visible",
                "numerator": 15,
                "denominator": 4,
                "americanOdds": 375
            }
        ],
        "templateId": 17984,
        "categoryId": 169,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "attr": "5,6",
        "category": "Other",
        "templateCategory": {
            "id": 169,
            "name": {
                "value": "Run Totals",
                "sign": "bIv6nA=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [
                {

                    "displayType": "OverUnder",
                    "marketGroupId": "7259184f-e175-44cb-b143-ab9f3f00b74e",
                    "marketGroupItemId": "5e641342-b9fa-462a-82fa-ca2f731e6874"
                }
            ]
        }
    };

}