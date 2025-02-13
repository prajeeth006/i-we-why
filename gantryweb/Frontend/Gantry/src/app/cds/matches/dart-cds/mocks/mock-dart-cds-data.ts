import { Game } from 'src/app/common/cds-client/models/fixture-view.model';

export class MockDartCdsData {
    matchBetting: Game = {
        "id": 61315653,
        "name": {
            "value": "2Way - Who will win?",
            "sign": "xNejeQ=="
        },
        "results": [{
                "id": -2108425069,
                "odds": 15.00,
                "name": {
                    "value": "Turner",
                    "sign": "Xstehw=="
                },
                "sourceName": {
                    "value": "1",
                    "sign": "69HIEQ=="
                },
                "visibility": "Visible",
                "numerator": 14,
                "denominator": 1,
                "americanOdds": 1400
            },
            {
                "id": -2108425068,
                "odds": 16.00,
                "name": {
                    "value": "Lewis",
                    "sign": "PBAyjQ=="
                },
                "sourceName": {
                    "value": "2",
                    "sign": "GvxTqA=="
                },
                "visibility": "Visible",
                "numerator": 15,
                "denominator": 1,
                "americanOdds": 1500
            }
        ],
        "templateId": 6367,
        "categoryId": 160,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Gridable",
        "templateCategory": {
            "id": 160,
            "name": {
                "value": "2Way - Who will win?",
                "sign": "xNejeQ=="
            },
            "category": "Gridable"
        },
        "isMain": true,
        "grouping": {
            "gridGroups": [
                "0cc4atga9"
            ],
            "detailed": [{
                "displayType": "Regular",
                "marketGroupId": "0345d714-e945-47f3-8d85-0103b12d22d3",
                "marketGroupItemId": "74eba74b-d8a3-42a6-99a2-f1b812e315ac"
            }]
        }
    };

    matchHandicap: Game = {
        "id": 965067506,
        "name": {
            "value": "Match Handicap",
            "sign": "1Nr2GA=="
        },
        "results": [
            {
                "id": -1475036271,
                "odds": 1.15,
                "name": {
                    "value": "Asjad Iqbal (PAK) +4,5",
                    "sign": "sGVC4w=="
                },
                "visibility": "Visible",
                "numerator": 3,
                "denominator": 20,
                "americanOdds": -650
            },
            {
                "id": -1475036270,
                "odds": 4.75,
                "name": {
                    "value": "Thepchaiya Un-nooh (THA) -4,5",
                    "sign": "K0xQCg=="
                },
                "visibility": "Visible",
                "numerator": 15,
                "denominator": 4,
                "americanOdds": 375
            }
        ],
        "templateId": 5034,
        "categoryId": 381,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "balanced": 1,
        "attr": "+4,5",
        "spread": 3.6,
        "category": "Gridable",
        "templateCategory": {
            "id": 381,
            "name": {
                "value": "Handicap (two way)",
                "sign": "GgVwjg=="
            },
            "category": "Gridable"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [
                "s7r13kq48"
            ],
            "detailed": [
                {
                    "subIndex": 0,
                    "displayType": "Spread",
                    "marketGroupId": "2ba6299d-bc85-4c21-a60a-b4bf1a59bdc5",
                    "marketGroupItemId": "0e77bf3c-4b71-4fd0-be0a-1b6f80cfb7f9"
                }
            ]
        }
    };

    legHandicap: Game = {
				"id": 61369265,
				"name": {
					"value": "Leg Handicap",
					"sign": "OvVxiA=="
				},
				"results": [{
						"id": -2108279847,
						"odds": 11.00,
						"name": {
							"value": "Dick Van Dijk (NED) -3,5",
							"sign": "EfOwMw=="
						},
						"visibility": "Visible",
						"numerator": 10,
						"denominator": 1,
						"americanOdds": 1000
					},
					{
						"id": -2108279846,
						"odds": 12.00,
						"name": {
							"value": "Mario Robbe (NED) +3,5",
							"sign": "J7bW7w=="
						},
						"visibility": "Visible",
						"numerator": 11,
						"denominator": 1,
						"americanOdds": 1100
					}
				],
				"templateId": 11710,
				"categoryId": 286,
				"resultOrder": "Default",
				"combo1": "NoEventCombo",
				"combo2": "Single",
				"visibility": "Visible",
				"balanced": 1,
				"spread": 1.00,
				"category": "Gridable",
				"templateCategory": {
					"id": 286,
					"name": {
						"value": "Leg Handicap",
						"sign": "OvVxiA=="
					},
					"category": "Gridable"
				},
				"isMain": false,
				"grouping": {
					"gridGroups": [
						"hd93yvc09"
					],
					"detailed": [{
							"subIndex": 0,
							"displayType": "Regular",
							"marketGroupId": "0345d714-e945-47f3-8d85-0103b12d22d3",
							"marketGroupItemId": "6396056d-7533-429b-9511-632c977c56c5"
						},
						{
							"subIndex": 0,
							"displayType": "Regular",
							"marketGroupId": "fd890863-f774-49c9-bf29-c346542bda39",
							"marketGroupItemId": "4d67c2e8-7aa7-436b-b0f8-8557ec526f05"
						}
					]
				}
			}

    frameBetting: Game = {
        "id": 61315659,
        "name": {
            "value": "Correct Score (Best of 7 legs)",
            "sign": "kIYkig=="
        },
        "results": [{
                "id": -2108425052,
                "odds": 9.00,
                "name": {
                    "value": "4:0",
                    "sign": "OSHEdw=="
                },
                "visibility": "Visible",
                "numerator": 8,
                "denominator": 1,
                "americanOdds": 800
            },
            {
                "id": -2108425051,
                "odds": 8.00,
                "name": {
                    "value": "4:1",
                    "sign": "95Eh1w=="
                },
                "visibility": "Visible",
                "numerator": 7,
                "denominator": 1,
                "americanOdds": 700
            },
            {
                "id": -2108425050,
                "odds": 7.00,
                "name": {
                    "value": "4:2",
                    "sign": "5EZ+7Q=="
                },
                "visibility": "Visible",
                "numerator": 6,
                "denominator": 1,
                "americanOdds": 600
            },
            {
                "id": -2108425049,
                "odds": 6.00,
                "name": {
                    "value": "4:3",
                    "sign": "KvabTQ=="
                },
                "visibility": "Visible",
                "numerator": 5,
                "denominator": 1,
                "americanOdds": 500
            },
            {
                "id": -2108425048,
                "odds": 5.00,
                "name": {
                    "value": "0:4",
                    "sign": "m11plw=="
                },
                "visibility": "Visible",
                "numerator": 4,
                "denominator": 1,
                "americanOdds": 400
            },
            {
                "id": -2108425047,
                "odds": 4.00,
                "name": {
                    "value": "1:4",
                    "sign": "9LdJQQ=="
                },
                "visibility": "Visible",
                "numerator": 3,
                "denominator": 1,
                "americanOdds": 300
            },
            {
                "id": -2108425046,
                "odds": 21.00,
                "name": {
                    "value": "2:4",
                    "sign": "BI9Z4A=="
                },
                "visibility": "Visible",
                "numerator": 20,
                "denominator": 1,
                "americanOdds": 2000
            },
            {
                "id": -2108425045,
                "odds": 31.00,
                "name": {
                    "value": "3:4",
                    "sign": "a2V5Ng=="
                },
                "visibility": "Visible",
                "numerator": 30,
                "denominator": 1,
                "americanOdds": 3000
            }
        ],
        "templateId": 33569,
        "categoryId": 843,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 843,
            "name": {
                "value": "Correct score",
                "sign": "EYv22g=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [{
                "displayType": "Regular",
                "marketGroupId": "e4cb99ca-ef83-4de9-b76b-63a853c601a1",
                "marketGroupItemId": "ba53c6c8-8eaa-488b-9fe2-2a6499630380"
            }]
        }
    };
    
    totalFrameBetting: Game = {
        "id": 61315658,
        "name": {
            "value": "How many 180´s will be score in the match?",
            "sign": "dwuN+g=="
        },
        "results": [{
                "id": -2108425054,
                "odds": 6.00,
                "name": {
                    "value": "Over 4,5",
                    "sign": "k5NqdQ=="
                },
                "visibility": "Visible",
                "numerator": 5,
                "denominator": 1,
                "americanOdds": 500
            },
            {
                "id": -2108425053,
                "odds": 5.00,
                "name": {
                    "value": "Under 4,5",
                    "sign": "mM/Acg=="
                },
                "visibility": "Visible",
                "numerator": 4,
                "denominator": 1,
                "americanOdds": 400
            }
        ],
        "templateId": 6057,
        "categoryId": 133,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "balanced": 1,
        "spread": 1.00,
        "category": "Gridable",
        "templateCategory": {
            "id": 133,
            "name": {
                "value": "Misc",
                "sign": "yIvKEw=="
            },
            "category": "Gridable"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [
                "2jf153e5u"
            ],
            "detailed": [{
                    "subIndex": 0,
                    "displayType": "OverUnder",
                    "marketGroupId": "0345d714-e945-47f3-8d85-0103b12d22d3",
                    "marketGroupItemId": "89f0c7d3-c65b-46ac-a084-f0bbc74c3321"
                },
                {
                    "subIndex": 0,
                    "displayType": "OverUnder",
                    "marketGroupId": "d416d0b9-9a45-4a7c-84e4-c8004643caa0",
                    "marketGroupItemId": "4e4c47cb-9bef-431b-a931-b391b421fbb2"
                }
            ]
        }
    };

    matchBetting3Way: Game = {
        "id": 61369264,
        "name": {
            "value": "3Way - result EN",
            "sign": "5ArJCg=="
        },
        "results": [{
                "id": -2108279850,
                "odds": 2.00,
                "name": {
                    "value": "Van Dijk ",
                    "sign": "jSZPCw=="
                },
                "visibility": "Visible",
                "numerator": 1,
                "denominator": 1,
                "americanOdds": 100
            },
            {
                "id": -2108279849,
                "odds": 3.00,
                "name": {
                    "value": "Draw",
                    "sign": "aYIQ5Q=="
                },
                "visibility": "Visible",
                "numerator": 2,
                "denominator": 1,
                "americanOdds": 200
            },
            {
                "id": -2108279848,
                "odds": 2.00,
                "name": {
                    "value": "Robbe",
                    "sign": "J4lk7w=="
                },
                "visibility": "Visible",
                "numerator": 1,
                "denominator": 1,
                "americanOdds": 100
            }
        ],
        "templateId": 7111,
        "categoryId": 440,
        "resultOrder": "Default",
        "combo1": "NoEventCombo",
        "combo2": "Single",
        "visibility": "Visible",
        "category": "Other",
        "templateCategory": {
            "id": 440,
            "name": {
                "value": "3Way - result EN",
                "sign": "5ArJCg=="
            },
            "category": "Other"
        },
        "isMain": false,
        "grouping": {
            "gridGroups": [],
            "detailed": [{
                "displayType": "Regular",
                "marketGroupId": "0345d714-e945-47f3-8d85-0103b12d22d3",
                "marketGroupItemId": "cbd02989-4a99-4c32-9728-8164fe3ff60c"
            }]
        }
    };

}