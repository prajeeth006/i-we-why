import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { Fixtures } from 'src/app/common/cds-client/models/fixture.model';
export class MockGolfCdsData {
    staticContent: GantryCommonContent = {
        "contentParameters": {
            "Abandoned": "ABANDONED",
            "Away": "AWAY",
            "CoralPrice": "EARLY PRICE",
            "Draw": "DRAW",
            "Eighteen": "18",
            "EventTimeInfo": "{0}",
            "Home": "HOME",
            "LiveShow": "LIVE PRICE",
            "Odds": "ODDS",
            "PhotoFinish": "PHOTO FINISH",
            "Places": "PLACES",
            "RaceOff": "RACE OFF",
            "SeventeenNumber": "17",
            "StewardsEnquiry": "STEWARDS ENQUIRY",
            "Time": "TIME",
            "Today": "TODAY",
            "Tomorrow": "TOMORROW",
            "TwentyOneNumber": "21",
            "VirtualRacing": "VIRTUAL RACING",
            "WeekendCoupon": "FEATURED FOOTBALL",
            "WinningDistanceMaxDistancePerRace": "MAX DISTANCE PER RACES = JUMPS 30L (WALKOVER 12L) / FLAT 12L (WALKOVER 5L)",
            "WinOnly": "WIN ONLY",
            "Withdrawn": "WITHDRAWN",
            "ManualBottomStipLine": "PRICES ARE SUBJECT TO CHANGE AND SHOULD BE TREATED AS A GUIDE",
            "EachWay": "EACH-WAY",
            "LeftStipulatedLine": "ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION"
        }
    };

    GolfEventData: Fixtures =
        {
            "fixtures": [
                {

                    "games": [
                        {
                            "id": 61211408,
                            "name": {
                                "value": "1st round 2-balls",
                                "sign": "wFjm7A=="
                            },
                            "results": [
                                {
                                    "id": -2108701851,
                                    "odds": 21.41,
                                    "name": {
                                        "value": "Ian Poulter (ENG)",
                                        "sign": "6pgDsQ=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 20,
                                    "denominator": 1,
                                    "americanOdds": 2000
                                },
                                {
                                    "id": -2108701850,
                                    "odds": 12.0,
                                    "name": {
                                        "value": "Owen",
                                        "sign": "kBcO9A=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 11,
                                    "denominator": 1,
                                    "americanOdds": 1100
                                },
                                {
                                    "id": -2108701840,
                                    "odds": 13.0,
                                    "name": {
                                        "value": "Draw",
                                        "sign": "TgkmQQ=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 12,
                                    "denominator": 1,
                                    "americanOdds": 1200
                                }
                            ],
                            "templateId": 2230,
                            "categoryId": 74,
                            "resultOrder": "Default",
                            "combo1": "NoEventCombo",
                            "combo2": "Single",
                            "visibility": "Visible",
                            "category": "Gridable",
                            "templateCategory": {
                                "id": 74,
                                "name": {
                                    "value": "2/3 balls",
                                    "sign": "qU/YUQ=="
                                },
                                "category": "Gridable"
                            },
                            "isMain": false,
                            "grouping": {
                                "gridGroups": [
                                    "v6kp8b7z9"
                                ],
                                "detailed": [
                                    {
                                        "displayType": "Regular",
                                        "marketGroupId": "0b348e20-a5ec-4292-881e-db510dbed54a",
                                        "marketGroupItemId": "5294ccda-fe28-43cd-b127-ea6678b885c3"
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "40184158",
                    "name": {
                        "value": "Ian Poulter (ENG) - Greg Owen (ENG)",
                        "sign": "pep5kw=="
                    },
                    "sourceId": 40184158,
                    "source": "V1",
                    "fixtureType": "Standard",
                    "context": "v1|en|40184158",
                    "addons": {
                        "participantDividend": {}
                    },
                    "stage": "PreMatch",
                    "liveType": "NotSet",
                    "liveAlert": false,
                    "startDate": "2023-10-30T14:00:00Z",
                    "cutOffDate": "2023-10-30T14:00:00Z",
                    "sport": {
                        "type": "Sport",
                        "id": 13,
                        "name": {
                            "value": "Golf",
                            "sign": "9RyppA=="
                        }
                    },
                    "competition": {
                        "parentLeagueId": 8417,
                        "statistics": false,
                        "sportId": 13,
                        "compoundId": "1:8417",
                        "type": "Competition",
                        "id": 8417,
                        "parentId": 6,
                        "name": {
                            "value": "British Open Championship",
                            "sign": "TitcAQ=="
                        }
                    },
                    "region": {
                        "code": "WRL",
                        "sportId": 13,
                        "type": "Region",
                        "id": 6,
                        "parentId": 13,
                        "name": {
                            "value": "World",
                            "sign": "pJ/1hw=="
                        }
                    },
                    "viewType": "European",
                    "isOpenForBetting": true,
                    "isVirtual": false,
                    "taggedLocations": [],
                    "totalMarketsCount": 1,
                    "conferences": [],
                    "marketGroups": {
                        "outrightMarketGroupIds": [],
                        "specialMarketGroupIds": [],
                        "type": "MarketGroups",
                        "id": 0
                    }
                },
                {

                    "games": [
                        {
                            "id": 61211553,
                            "name": {
                                "value": "2nd round 2-balls",
                                "sign": "fXBA6w=="
                            },
                            "results": [
                                {
                                    "id": -2108701443,
                                    "odds": 12.0,
                                    "name": {
                                        "value": "Irew Magee (FRA)",
                                        "sign": "dEh7LQ=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 11,
                                    "denominator": 1,
                                    "americanOdds": 1100
                                },
                                {
                                    "id": -2108701442,
                                    "odds": 13.0,
                                    "name": {
                                        "value": "Slattery",
                                        "sign": "CHPFVg=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 12,
                                    "denominator": 1,
                                    "americanOdds": 1200
                                },
                                {
                                    "id": -2108701441,
                                    "odds": 15.0,
                                    "name": {
                                        "value": "Draw",
                                        "sign": "CLJ2HA=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 14,
                                    "denominator": 1,
                                    "americanOdds": 1400
                                }
                            ],
                            "templateId": 1773,
                            "categoryId": 74,
                            "resultOrder": "Default",
                            "combo1": "NoEventCombo",
                            "combo2": "Single",
                            "visibility": "Visible",
                            "category": "Gridable",
                            "templateCategory": {
                                "id": 74,
                                "name": {
                                    "value": "2/3 balls",
                                    "sign": "podAsQ=="
                                },
                                "category": "Gridable"
                            },
                            "isMain": false,
                            "grouping": {
                                "gridGroups": [
                                    "v6kp8b7z9"
                                ],
                                "detailed": [
                                    {
                                        "displayType": "Regular",
                                        "marketGroupId": "0b348e20-a5ec-4292-881e-db510dbed54a",
                                        "marketGroupItemId": "39ce287e-e647-4c71-97e2-a17554b992c3"
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "40184293",
                    "name": {
                        "value": "Andrew Magee (FRA) - Lee Slattery (ENG)",
                        "sign": "KekErw=="
                    },
                    "sourceId": 40184293,
                    "source": "V1",
                    "fixtureType": "Standard",
                    "context": "v1|en|40184293",
                    "addons": {
                        "participantDividend": {}
                    },
                    "stage": "PreMatch",
                    "liveType": "NotSet",
                    "liveAlert": false,
                    "startDate": "2023-10-30T15:00:00Z",
                    "cutOffDate": "2023-10-30T15:00:00Z",
                    "sport": {
                        "type": "Sport",
                        "id": 13,
                        "name": {
                            "value": "Golf",
                            "sign": "9RyppA=="
                        }
                    },
                    "competition": {
                        "parentLeagueId": 8417,
                        "statistics": false,
                        "sportId": 13,
                        "compoundId": "1:8417",
                        "type": "Competition",
                        "id": 8417,
                        "parentId": 6,
                        "name": {
                            "value": "British Open Championship",
                            "sign": "TitcAQ=="
                        }
                    },
                    "region": {
                        "code": "WRL",
                        "sportId": 13,
                        "type": "Region",
                        "id": 6,
                        "parentId": 13,
                        "name": {
                            "value": "World",
                            "sign": "pJ/1hw=="
                        }
                    },
                    "viewType": "European",
                    "isOpenForBetting": true,
                    "isVirtual": false,
                    "taggedLocations": [],
                    "totalMarketsCount": 1,
                    "conferences": [],
                    "marketGroups": {
                        "outrightMarketGroupIds": [],
                        "specialMarketGroupIds": [],
                        "type": "MarketGroups",
                        "id": 0
                    }
                },
                {

                    "games": [
                        {
                            "id": 61316750,
                            "name": {
                                "value": "3rd round 2-balls",
                                "sign": "6f4NMw=="
                            },
                            "results": [
                                {
                                    "id": -2108422128,
                                    "odds": 14.5,
                                    "name": {
                                        "value": "Adam Scott (AUS)",
                                        "sign": "0ieW6g=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 13,
                                    "denominator": 1,
                                    "americanOdds": 1350
                                },
                                {
                                    "id": -2108422127,
                                    "odds": 11.2,
                                    "name": {
                                        "value": "Wall",
                                        "sign": "zhDYxg=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 10,
                                    "denominator": 1,
                                    "americanOdds": 1000
                                },
                                {
                                    "id": -2108422109,
                                    "odds": 12.53,
                                    "name": {
                                        "value": "Draw",
                                        "sign": "lc8rlQ=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 12,
                                    "denominator": 1,
                                    "americanOdds": 1150
                                }
                            ],
                            "templateId": 494,
                            "categoryId": 74,
                            "resultOrder": "Default",
                            "combo1": "NoEventCombo",
                            "combo2": "Single",
                            "visibility": "Visible",
                            "category": "Gridable",
                            "templateCategory": {
                                "id": 74,
                                "name": {
                                    "value": "2/3 balls",
                                    "sign": "IAG6cA=="
                                },
                                "category": "Gridable"
                            },
                            "isMain": false,
                            "grouping": {
                                "gridGroups": [
                                    "v6kp8b7z9"
                                ],
                                "detailed": [
                                    {
                                        "displayType": "Regular",
                                        "marketGroupId": "0b348e20-a5ec-4292-881e-db510dbed54a",
                                        "marketGroupItemId": "09abd97b-541f-4c92-ba25-bce233a84db2"
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "40279039",
                    "name": {
                        "value": "Adam Scott (AUS) - Anthony Wall (ENG)",
                        "sign": "lAwmlA=="
                    },
                    "sourceId": 40279039,
                    "source": "V1",
                    "fixtureType": "Standard",
                    "context": "v1|en|40279039",
                    "addons": {
                        "participantDividend": {}
                    },
                    "stage": "PreMatch",
                    "liveType": "NotSet",
                    "liveAlert": false,
                    "startDate": "2023-10-31T07:56:00Z",
                    "cutOffDate": "2023-10-31T06:53:00Z",
                    "sport": {
                        "type": "Sport",
                        "id": 13,
                        "name": {
                            "value": "Golf",
                            "sign": "9RyppA=="
                        }
                    },
                    "competition": {
                        "parentLeagueId": 8417,
                        "statistics": false,
                        "sportId": 13,
                        "compoundId": "1:8417",
                        "type": "Competition",
                        "id": 8417,
                        "parentId": 6,
                        "name": {
                            "value": "British Open Championship",
                            "sign": "TitcAQ=="
                        }
                    },
                    "region": {
                        "code": "WRL",
                        "sportId": 13,
                        "type": "Region",
                        "id": 6,
                        "parentId": 13,
                        "name": {
                            "value": "World",
                            "sign": "pJ/1hw=="
                        }
                    },
                    "viewType": "European",
                    "isOpenForBetting": true,
                    "isVirtual": false,
                    "taggedLocations": [],
                    "totalMarketsCount": 1,
                    "conferences": [],
                    "marketGroups": {
                        "outrightMarketGroupIds": [],
                        "specialMarketGroupIds": [],
                        "type": "MarketGroups",
                        "id": 0
                    }
                },
                {

                    "games": [
                        {
                            "id": 61316785,
                            "name": {
                                "value": "4th round 2-balls",
                                "sign": "NTPvWA=="
                            },
                            "results": [
                                {
                                    "id": -2108422039,
                                    "odds": 12.5,
                                    "name": {
                                        "value": "Bryant",
                                        "sign": "Tlog7A=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 11,
                                    "denominator": 1,
                                    "americanOdds": 1150
                                },
                                {
                                    "id": -2108422038,
                                    "odds": 18.4,
                                    "name": {
                                        "value": "Jones",
                                        "sign": "20Lcuw=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 17,
                                    "denominator": 1,
                                    "americanOdds": 1750
                                },
                                {
                                    "id": -2108422037,
                                    "odds": 11.2,
                                    "name": {
                                        "value": "Draw",
                                        "sign": "MbkIPQ=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 10,
                                    "denominator": 1,
                                    "americanOdds": 1000
                                }
                            ],
                            "templateId": 508,
                            "categoryId": 74,
                            "resultOrder": "Default",
                            "combo1": "NoEventCombo",
                            "combo2": "Single",
                            "visibility": "Visible",
                            "category": "Gridable",
                            "templateCategory": {
                                "id": 74,
                                "name": {
                                    "value": "2/3 balls",
                                    "sign": "jQfYeg=="
                                },
                                "category": "Gridable"
                            },
                            "isMain": false,
                            "grouping": {
                                "gridGroups": [
                                    "v6kp8b7z9"
                                ],
                                "detailed": [
                                    {
                                        "displayType": "Regular",
                                        "marketGroupId": "0b348e20-a5ec-4292-881e-db510dbed54a",
                                        "marketGroupItemId": "5344a6f4-5c5a-4909-b8fc-6148099f0a5a"
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "40279069",
                    "name": {
                        "value": "Bart Bryant (USA) - Brendan Jones (AUS)",
                        "sign": "au2IDg=="
                    },
                    "sourceId": 40279069,
                    "source": "V1",
                    "fixtureType": "Standard",
                    "context": "v1|en|40279069",
                    "addons": {
                        "participantDividend": {}
                    },
                    "stage": "PreMatch",
                    "liveType": "NotSet",
                    "liveAlert": false,
                    "startDate": "2023-10-31T11:57:00Z",
                    "cutOffDate": "2023-10-31T08:55:00Z",
                    "sport": {
                        "type": "Sport",
                        "id": 13,
                        "name": {
                            "value": "Golf",
                            "sign": "9RyppA=="
                        }
                    },
                    "competition": {
                        "parentLeagueId": 8417,
                        "statistics": false,
                        "sportId": 13,
                        "compoundId": "1:8417",
                        "type": "Competition",
                        "id": 8417,
                        "parentId": 6,
                        "name": {
                            "value": "British Open Championship",
                            "sign": "TitcAQ=="
                        }
                    },
                    "region": {
                        "code": "WRL",
                        "sportId": 13,
                        "type": "Region",
                        "id": 6,
                        "parentId": 13,
                        "name": {
                            "value": "World",
                            "sign": "pJ/1hw=="
                        }
                    },
                    "viewType": "European",
                    "isOpenForBetting": true,
                    "isVirtual": false,
                    "taggedLocations": [],
                    "totalMarketsCount": 1,
                    "conferences": [],
                    "marketGroups": {
                        "outrightMarketGroupIds": [],
                        "specialMarketGroupIds": [],
                        "type": "MarketGroups",
                        "id": 0
                    }
                },
                {

                    "games": [
                        {
                            "id": 61316813,
                            "name": {
                                "value": "1st round 3-balls",
                                "sign": "G9iVIQ=="
                            },
                            "results": [
                                {
                                    "id": -2108421963,
                                    "odds": 12.6,
                                    "name": {
                                        "value": "Magee",
                                        "sign": "tiqF0w=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 12,
                                    "denominator": 1,
                                    "americanOdds": 1150
                                },
                                {
                                    "id": -2108421962,
                                    "odds": 17.32,
                                    "name": {
                                        "value": "Marshall",
                                        "sign": "1Mi9Hg=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 16,
                                    "denominator": 1,
                                    "americanOdds": 1650
                                },
                                {
                                    "id": -2108421961,
                                    "odds": 16.5,
                                    "name": {
                                        "value": "Angel Cabrera (ARG)",
                                        "sign": "BYc61A=="
                                    },
                                    "visibility": "Visible",
                                    "numerator": 15,
                                    "denominator": 1,
                                    "americanOdds": 1550
                                }
                            ],
                            "templateId": 1336,
                            "categoryId": 74,
                            "resultOrder": "Default",
                            "combo1": "NoEventCombo",
                            "combo2": "Single",
                            "visibility": "Visible",
                            "category": "Gridable",
                            "templateCategory": {
                                "id": 74,
                                "name": {
                                    "value": "2/3 balls",
                                    "sign": "iix6/g=="
                                },
                                "category": "Gridable"
                            },
                            "isMain": false,
                            "grouping": {
                                "gridGroups": [
                                    "tzv2bc7xj"
                                ],
                                "detailed": [
                                    {
                                        "displayType": "Regular",
                                        "marketGroupId": "0b348e20-a5ec-4292-881e-db510dbed54a",
                                        "marketGroupItemId": "4e1959bf-9720-4d92-b4fa-e8121bcf72dd"
                                    }
                                ]
                            }
                        }
                    ],
                    "id": "40279090",
                    "name": {
                        "value": "Andrew Magee (FRA) - Andrew Marshall (ENG)",
                        "sign": "EpAb7g=="
                    },
                    "sourceId": 40279090,
                    "source": "V1",
                    "fixtureType": "Standard",
                    "context": "v1|en|40279090",
                    "addons": {
                        "participantDividend": {}
                    },
                    "stage": "PreMatch",
                    "liveType": "NotSet",
                    "liveAlert": false,
                    "startDate": "2023-10-31T10:57:00Z",
                    "cutOffDate": "2023-10-31T08:55:00Z",
                    "sport": {
                        "type": "Sport",
                        "id": 13,
                        "name": {
                            "value": "Golf",
                            "sign": "9RyppA=="
                        }
                    },
                    "competition": {
                        "parentLeagueId": 8417,
                        "statistics": false,
                        "sportId": 13,
                        "compoundId": "1:8417",
                        "type": "Competition",
                        "id": 8417,
                        "parentId": 6,
                        "name": {
                            "value": "British Open Championship",
                            "sign": "TitcAQ=="
                        }
                    },
                    "region": {
                        "code": "WRL",
                        "sportId": 13,
                        "type": "Region",
                        "id": 6,
                        "parentId": 13,
                        "name": {
                            "value": "World",
                            "sign": "pJ/1hw=="
                        }
                    },
                    "viewType": "European",
                    "isOpenForBetting": true,
                    "isVirtual": false,
                    "taggedLocations": [],
                    "totalMarketsCount": 1,
                    "conferences": [],
                    "marketGroups": {
                        "outrightMarketGroupIds": [],
                        "specialMarketGroupIds": [],
                        "type": "MarketGroups",
                        "id": 0
                    }
                }
            ],
            "totalCount": 5,
            "totalSports": 1,
            "totalRegions": 1,
            "totalCompetitions": 1
        }


}