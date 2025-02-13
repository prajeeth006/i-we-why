import { FixtureView } from '../../../../common/cds-client/models/fixture-view.model';
import { Formula1ContentParams } from '../models/formula1-cds-content.model';
import { Markets } from '../../../../common/models/gantrymarkets.model';

export class MockFormula1CdsData {
    fixtureViewData: FixtureView = {
        "fixture": {
            "optionMarkets": [],
            "games": [
                {
                    "id": 76911761,
                    "name": {
                        "value": "Top 3 bet",
                        "sign": "eVH8Wg=="
                    },
                    "results": [
                        {
                            "id": -2133367865,
                            "odds": 12.00,
                            "name": {
                                "value": "Alonso",
                                "sign": "qqyqPw=="
                            },
                            "visibility": "Visible",
                            "numerator": 11,
                            "denominator": 1,
                            "americanOdds": 1100,
                            "playerId": 2554133
                        },
                        {
                            "id": -2133367864,
                            "odds": 13.00,
                            "name": {
                                "value": "J. Wilson (Jaguar)",
                                "sign": "puX0jw=="
                            },
                            "visibility": "Visible",
                            "numerator": 12,
                            "denominator": 1,
                            "americanOdds": 1200,
                            "playerId": 2554032
                        }
                    ],
                    "templateId": 3266,
                    "categoryId": 1267,
                    "resultOrder": "Odds",
                    "combo1": "NoSportCombo",
                    "combo2": "Single",
                    "visibility": "Visible",
                    "category": "Other",
                    "templateCategory": {
                        "id": 1267,
                        "name": {
                            "value": "Top 3",
                            "sign": "5UUJAw=="
                        },
                        "category": "Other"
                    },
                    "isMain": false,
                    "grouping": {
                        "gridGroups": [],
                        "detailed": [
                            {
                                "group": 1,
                                "index": 0,
                                "displayType": "Regular",
                                "marketGroupId": "49e21c23-f873-4873-a399-115f74b8f662",
                                "marketGroupItemId": "927d2a85-5562-4040-93f1-79b2a1bd0c26"
                            }
                        ]
                    }
                },
                {
                    "id": 76911762,
                    "name": {
                        "value": "Which driver will clock the fastest lap time in the race?",
                        "sign": "sLEcJw=="
                    },
                    "results": [
                        {
                            "id": -2133367863,
                            "odds": 14.00,
                            "name": {
                                "value": "Alonso",
                                "sign": "KtAY9A=="
                            },
                            "visibility": "Visible",
                            "numerator": 13,
                            "denominator": 1,
                            "americanOdds": 1300,
                            "playerId": 2554133
                        },
                        {
                            "id": -2133367862,
                            "odds": 15.00,
                            "name": {
                                "value": "J. Wilson (Jaguar)",
                                "sign": "ykfwxg=="
                            },
                            "visibility": "Visible",
                            "numerator": 14,
                            "denominator": 1,
                            "americanOdds": 1400,
                            "playerId": 2554032
                        }
                    ],
                    "templateId": 216,
                    "categoryId": 1059,
                    "resultOrder": "Odds",
                    "combo1": "NoSportCombo",
                    "combo2": "Single",
                    "visibility": "Visible",
                    "category": "Other",
                    "templateCategory": {
                        "id": 1059,
                        "name": {
                            "value": "Fastest lap",
                            "sign": "tv/Npw=="
                        },
                        "category": "Other"
                    },
                    "isMain": false,
                    "grouping": {
                        "gridGroups": [],
                        "detailed": [
                            {
                                "group": 0,
                                "index": 1,
                                "displayType": "Regular",
                                "marketGroupId": "2d435013-45f1-4f94-acc1-53a52f9d6d12",
                                "marketGroupItemId": "78ef3f7a-42f2-4aa8-b4da-2ffa81d36f0b"
                            }
                        ],
                    }
                },
                {
                    "id": 76911763,
                    "name": {
                        "value": "Race winner",
                        "sign": "yTRALA=="
                    },
                    "results": [
                        {
                            "id": -2133367861,
                            "odds": 16.00,
                            "name": {
                                "value": "Alonso",
                                "sign": "qhlI2g=="
                            },
                            "sourceName": {
                                "value": "Fernando Alonso (ESP/Ferrari)",
                                "sign": "YrDAww=="
                            },
                            "visibility": "Visible",
                            "numerator": 15,
                            "denominator": 1,
                            "americanOdds": 1500,
                            "playerId": 2554133
                        },
                        {
                            "id": -2133367860,
                            "odds": 17.00,
                            "name": {
                                "value": "J. Wilson (Jaguar)",
                                "sign": "fqH9HQ=="
                            },
                            "sourceName": {
                                "value": "J. Wilson (Jaguar)",
                                "sign": "fqH9HQ=="
                            },
                            "visibility": "Visible",
                            "numerator": 16,
                            "denominator": 1,
                            "americanOdds": 1600,
                            "playerId": 2554032
                        }
                    ],
                    "templateId": 2091,
                    "categoryId": 38,
                    "resultOrder": "Odds",
                    "combo1": "NoSportCombo",
                    "combo2": "Single",
                    "visibility": "Visible",
                    "category": "Other",
                    "templateCategory": {
                        "id": 38,
                        "name": {
                            "value": "winner",
                            "sign": "I9Fhug=="
                        },
                        "category": "Other"
                    },
                    "isMain": true,
                    "grouping": {
                        "gridGroups": [],
                        "detailed": [
                            {
                                "group": 0,
                                "index": 0,
                                "displayType": "Regular",
                                "marketGroupId": "2d435013-45f1-4f94-acc1-53a52f9d6d12",
                                "marketGroupItemId": "450217dc-f216-44ec-a057-1a2b126e30d3"
                            }
                        ],
                    }
                },
                {
                    "id": 76911764,
                    "name": {
                        "value": "Top-10 bet (driver)",
                        "sign": "dgPXQA=="
                    },
                    "results": [
                        {
                            "id": -2133367859,
                            "odds": 18.00,
                            "name": {
                                "value": "Alonso",
                                "sign": "KkO5qA=="
                            },
                            "visibility": "Visible",
                            "numerator": 17,
                            "denominator": 1,
                            "americanOdds": 1700,
                            "playerId": 2554133
                        },
                        {
                            "id": -2133367858,
                            "odds": 19.00,
                            "name": {
                                "value": "J. Wilson (Jaguar)",
                                "sign": "EgP5VA=="
                            },
                            "visibility": "Visible",
                            "numerator": 18,
                            "denominator": 1,
                            "americanOdds": 1800,
                            "playerId": 2554032
                        }
                    ],
                    "templateId": 24520,
                    "categoryId": 247,
                    "resultOrder": "Odds",
                    "combo1": "NoSportCombo",
                    "combo2": "Single",
                    "visibility": "Visible",
                    "category": "Other",
                    "templateCategory": {
                        "id": 247,
                        "name": {
                            "value": "Top 10",
                            "sign": "0VUHXQ=="
                        },
                        "category": "Other"
                    },
                    "isMain": false,
                    "grouping": {
                        "gridGroups": [],
                        "detailed": [
                            {
                                "group": 1,
                                "index": 5,
                                "displayType": "Regular",
                                "marketGroupId": "49e21c23-f873-4873-a399-115f74b8f662",
                                "marketGroupItemId": "b9f24473-b337-47fc-a047-2acf4c9f1e01"
                            }
                        ],
                    }
                }
            ],
            "participants": [
                {
                    "participantId": 2554133,
                    "name": {
                        "value": "Fernando Alonso (ESP/Ferrari)",
                        "sign": "KgX5Sw==",
                        "short": "Alonso",
                        "shortSign": "lwJuRg=="
                    },
                    "options": []
                },
                {
                    "participantId": 2554032,
                    "name": {
                        "value": "J. Wilson (Jaguar)",
                        "sign": "Jt0Vtg==",
                        "short": "J. Wilson (Jaguar)",
                        "shortSign": "Jt0Vtg=="
                    },
                    "options": []
                }
            ],
            "id": "11090045",
            "name": {
                "value": "Fernando Alonso (ESP/Ferrari) - J. Wilson (Jaguar)",
                "sign": "UUfEFg=="
            },
            "sourceId": 11090045,
            "source": "V1",
            "fixtureType": "Standard",
            "context": "v1|en|11090045",
            "stage": "PreMatch",
            "liveType": "NotSet",
            "liveAlert": true,
            "startDate": "2023-09-28T18:00:00Z",
            "cutOffDate": "2023-09-28T18:00:00Z",
            "sport": {
                "type": "Sport",
                "id": 6,
                "name": {
                    "value": "Formula 1",
                    "sign": "aVvN3g=="
                }
            },
            "competition": {
                "parentLeagueId": 7886,
                "statistics": false,
                "sportId": 6,
                "compoundId": "1:7886",
                "type": "Competition",
                "id": 7886,
                "parentId": 6,
                "name": {
                    "value": "GP Great Britain",
                    "sign": "Sn32qg=="
                }
            },
            "region": {
                "code": "WRL",
                "sportId": 6,
                "type": "Region",
                "id": 6,
                "parentId": 6,
                "name": {
                    "value": "World",
                    "sign": "pJ/1hw=="
                }
            },
            "viewType": "European",
            "isOpenForBetting": true,
            "isVirtual": false,
            "taggedLocations": [],
            "totalMarketsCount": 4,
            "conferences": [],
            "marketGroups": {
                "outrightMarketGroupIds": [],
                "specialMarketGroupIds": [],
                "type": "MarketGroups",
                "id": 0
            },
            "priceBoostCount": 0,
            "linkedTv1EventIds": []
        },
        "splitFixtures": [],
        "groupingVersion": "mg_DUJvx14WtsvuJ2QZfASfDSDCGyI="
    }

    formula1Content: Formula1ContentParams = {
        "contentParameters": {
            "BetNamesList": "FASTEST LAP|POINTS|PODIUM|RACE",
            "EW": "E/W",
            "LeadTitle": "FORMULA 1",
            "LeftStipulatedLine": "OTHERS ON REQUEST",
            "RaceWinner": "RACE",
            "RightStipulatedLine": "MORE MARKETS AVAILABLE ON BETSTATION",
            "TwentyOneNumber": "21",
            "WinOnly": "WIN ONLY"
        }
    }

    markets:Markets[] = [
        {
            "sport": "CdsFormula1",
            "markets": [
                {
                    "name": "RaceWinner",
                    "matches": [
                        "2091"
                    ]
                },
                {
                    "name": "FastestLap",
                    "matches": [
                        "216"
                    ]
                },
                {
                    "name": "PodiumFinish",
                    "matches": [
                        "3266"
                    ]
                },
                {
                    "name": "PointsFinish",
                    "matches": [
                        "24520"
                    ]
                }
            ]
        }
    ]

}
