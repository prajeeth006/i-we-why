import { NCastDividend, SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { CricketDataContent } from "../models/cricket-content.model";
import { CricketCountriesContent } from "../models/cricket-countries.model";

export class CricketSportBookMockDataT1 {
  
  matchBettingAwayS: SportBookSelection = {
      "eventKey": 1927460,
      "marketKey": 79653042,
      "selectionKey": 265771608,
      "selectionName": "BANGLADESH",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "A",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.16407:e.1927460:e.79653042"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }
  matchBettingHomeS: SportBookSelection = {
      "eventKey": 1927460,
      "marketKey": 79653042,
      "selectionKey": 265771605,
      "selectionName": "INDIA",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "H",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.16407:e.1927460:m.79653042"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  topTeamRunScorerAwayS1:SportBookSelection = {
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336903977,
    "selectionName": "TAMIM IQBAL",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null,
  }
  topTeamRunScorerAwayS2:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336903947,
    "selectionName": "MAHMUDULLAH",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null,
  }
  topTeamRunScorerAwayS3:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336904002,
    "selectionName": "MEHIDY HASAN",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null,
  }
  topTeamRunScorerAwayS4:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336903972,
    "selectionName": "MUSHFIQUR RAHIM",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topTeamRunScorerAwayS5:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336903955,
    "selectionName": "SHAKIB AI HASAN",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topTeamRunScorerAwayS6:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336904015,
    "selectionName": "LITTON DAS",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topTeamRunScorerAwayS7:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633743,
    "selectionKey": 336904026,
    "selectionName": "MUSFAFIZUR RAHMAN",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633743"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }

  topTeamRunScorerHomeS1:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336887074,
    "selectionName": "VIRAT KOHLI",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topTeamRunScorerHomeS2:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336903671,
    "selectionName": "JASPRIT BUMRAH",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topTeamRunScorerHomeS3:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336887632,
    "selectionName": "HARDIK PANDYA",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topTeamRunScorerHomeS4:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336887591,
    "selectionName": "ROHIT SHARMA",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topTeamRunScorerHomeS5:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336887600,
    "selectionName": "RISHABH PANT",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topTeamRunScorerHomeS6:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336903822,
    "selectionName": "KL RAHUL",
    "selectionStatus": "Suspended",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": false,
    "hidePrice": true,
    runnerNumber: null
  }
  topTeamRunScorerHomeS7:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103633726,
    "selectionKey": 336888065,
    "selectionName": "DINESH KARTHIK",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103633726"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }

  totalSixesHomeS1:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103726032,
    "selectionKey": 337239162,
    "selectionName": "OVER",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "L",
    "outcomeMeaningMinorCode": "L",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 20,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103726032"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  totalSixesAwayS1:SportBookSelection ={
    "eventKey": 1927460,
    "marketKey": 103726032,
    "selectionKey": 337239729,
    "selectionName": "UNDER",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "H",
    "outcomeMeaningMinorCode": "H",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.16407:e.1927460:m.103726032"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }

  matchBettingM: SportBookMarketStructured ={
      selections: new Map<number, SportBookSelection>([[0, this.matchBettingAwayS],[1, this.matchBettingHomeS]]),
      "eventKey": 1927460,
      "marketKey": 79653042,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "MR",
      "marketName": "MATCH BETTING",
      "marketStatus": "Active",
      "displayOrder": 0,
      "displayStatus": "Displayed",
      "isGpAvailable": false,
      "isHandicapMarket": false,
      "isIndexMarket": false,
      "isLpAvailable": true,
      "isMarketBIR": false,
      "isOverUnderMarket": false,
      "isSpAvailable": false,
      "isStandardFixedOddsMarket": true,
      "channels": [
          "a",
          "R",
          "b",
          "c",
          "d",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
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
  
  topTeamRunScorerAwayM: SportBookMarketStructured ={
      selections:  new Map<number, SportBookSelection>([[0, this.topTeamRunScorerAwayS1],[1, this.topTeamRunScorerAwayS2],[2, this.topTeamRunScorerAwayS3],[3, this.topTeamRunScorerAwayS4],[4, this.topTeamRunScorerAwayS5],[5, this.topTeamRunScorerAwayS6],[6, this.topTeamRunScorerAwayS7]]),
      "eventKey": 1927460,
      "marketKey": 103633743,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "BANGLADESH TOP RUNSCORER",
      "marketStatus": "Active",
      "displayOrder": 500,
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
      "isGpAvailable":false,
      "isHandicapMarket":false,
      "isIndexMarket":false,
      "isLpAvailable": true,
      "isMarketBIR":false,
      "isOverUnderMarket":false,
      "isSpAvailable":false,
      "isStandardFixedOddsMarket": true,
      "isTricastMarket":false,
      "eachWayWithBet": "Y",
      "marketGroupID": "488058",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  topTeamRunScorerHomeM: SportBookMarketStructured ={
      selections:  new Map<number, SportBookSelection>([[0, this.topTeamRunScorerHomeS1],[1, this.topTeamRunScorerHomeS2],[2, this.topTeamRunScorerHomeS3],[3, this.topTeamRunScorerHomeS4],[4, this.topTeamRunScorerHomeS5],[5, this.topTeamRunScorerHomeS6],[6, this.topTeamRunScorerHomeS7]]),
      "eventKey": 1927460,
      "marketKey": 103633726,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "INDIA TOP RUNSCORER",
      "marketStatus": "Active",
      "displayOrder": 70,
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
      "marketGroupID": "423779",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  totalSixesM: SportBookMarketStructured = {
      selections:  new Map<number, SportBookSelection>([[0, this.totalSixesAwayS1],[1, this.totalSixesHomeS1]]),
      "eventKey": 1927460,
      "marketKey": 103726032,
      "marketMeaningMajorCode": "L",
      "marketMeaningMinorCode": "HL",
      "marketName": "TOTAL SIXES",
      "marketStatus": "Active",
      "displayOrder": 600,
      "displayStatus": "Displayed",
      "handicapValue": 11.5,
      "marketSort": "HL",
      "marketTypeKey": "L",
      "isResulted": false,
      "isResultConfirmed": false,
      "isCashoutAvailable": false,
      "betMinStake": "0.01",
      "maxAccumulator": "25",
      "minAccumulator": "1",
      "hasRestrictedSet": "N",
      "isAntepost": false,
      "isPlaceOnlyAvailable": false,
      "isGpAvailable": false,
      "isHandicapMarket": true,
      "isIndexMarket": false,
      "isLpAvailable": true,
      "isMarketBIR": false,
      "isOverUnderMarket": true,
      "isSpAvailable": false,
      "isStandardFixedOddsMarket": false,
      "isTricastMarket": false,
      "eachWayWithBet": "N",
      "marketGroupID": "423793",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  cricketE1:SportBookEventStructured = {
      markets : new Map<number, SportBookMarketStructured>(
          [
              [0, this.matchBettingM],
              [1, this.topTeamRunScorerAwayM],
              [2, this.topTeamRunScorerHomeM],
              [3, this.totalSixesM],
          ]
      ),
      "eventKey": 1927460,
      "eventName": "INDIA V BANGLADESH",
      "typeName": "ONE DAY INTERNATIONALS",
      "categoryName": "CRICKET",
      "eventStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "eventSort": "MTCH",
      "eventDateTime": new Date,
      "isEventStarted": false,
      "isEventFinished": false,
      "isEventResulted": false,
      "channels": [
          "a",
          "R",
          "b",
          "c",
          "d",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407"
      },
      hasBIRMarkets: null,
      flags: null,
      isCashoutAvailable: null,
      offTime: null,
      raceStage: null,
      eventTimePlusTypeName: null,
      runnerCount: null,
      typeFlagCode: null,
      typeKey: null
  }

  sportBookResult: SportBookResult = {
      events : new Map<number, SportBookEventStructured>(
        [[0, this.cricketE1]]
    )
  }
}

export class CricketSportBookMockDataT2 {
  matchBettingAwayS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884267,
      "selectionName": "ENGLAND",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "A",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  matchBettingHomeS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884167,
      "selectionName": "INDIA",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "H",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  matchBettingDrawS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884242,
      "selectionName": "DRAW",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "D",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  topFirstInningsRunScorerHomeS1: SportBookSelection ={
      "eventKey": 2791293,
      "marketKey": 103725274,
      "selectionKey": 337235120,
      "selectionName": "VIRAT KOHLI",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 11,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  topFirstInningsRunScorerHomeS2: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235160,
    "selectionName": "JASPRIT BUMRAH",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS3: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235222,
    "selectionName": "MS DHONI",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS4: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235221,
    "selectionName": "RAVINDRA JADEJA",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS5: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235175,
    "selectionName": "DINESH KARTHIK",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS6: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235124,
    "selectionName": "RISHABH PANT",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS7: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235123,
    "selectionName": "ROHIT SHARMA",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS8: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235129,
    "selectionName": "HARDIK PANDYA",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerHomeS9: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725274,
    "selectionKey": 337235208,
    "selectionName": "KL RAHUL",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725274"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }

  topFirstInningsRunScorerAwayS1: SportBookSelection ={
      "eventKey": 2791293,
      "marketKey": 103725289,
      "selectionKey": 337235632,
      "selectionName": "BEN STOKES",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 11,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  topFirstInningsRunScorerAwayS2: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235651,
    "selectionName": "MOEEN ALI",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS3: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235693,
    "selectionName": "CHRIS WOAKES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
    ],
    "isResulted": false,
    "isResultConfirmed": false,
    "resultCode": "Unset",
    "isSettled": false,
    "suspensionReason": "-",
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "prices": {
        "price": [
            {
                "numPrice": 6,
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS4: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235692,
    "selectionName": "JOFRA ARCHER",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS5: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235652,
    "selectionName": "JAMIE OVERTON",
    "selectionStatus": "Suspended",
    "displayStatus": "NotDisplayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": true,
    "hidePrice": true,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS6: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235647,
    "selectionName": "JOS BUTTLER",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS7: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235648,
    "selectionName": "MATTHEW POTTS",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS8: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103725289,
    "selectionKey": 337235635,
    "selectionName": "JOE ROOT",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 11,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  topFirstInningsRunScorerAwayS9: SportBookSelection ={
        "eventKey": 2791293,
        "marketKey": 103725289,
        "selectionKey": 337235646,
        "selectionName": "JONNY BAIRSTOW",
        "selectionStatus": "Active",
        "displayStatus": "Displayed",
        "displayOrder": 0,
        "outcomeMeaningMajorCode": "-",
        "outcomeMeaningMinorCode": "-",
        "channels": [
            "K",
            "a",
            "b"
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
                    "denPrice": 11,
                    "selectionPriceType": "LP"
                }
            ]
        },
        "meta": {
            "operation": "create",
            "parents": "c.10:cl.58:t.114496:e.2791293:m.103725289"
        },
        "hideEntry": false,
        "hidePrice": false,
        runnerNumber : null
    }

  matchBettingM: SportBookMarketStructured ={
      selections: new Map<number, SportBookSelection>([[0, this.matchBettingAwayS],[1, this.matchBettingHomeS],[2, this.matchBettingDrawS]]),
      "eventKey": 1927460,
      "marketKey": 79653042,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "MR",
      "marketName": "MATCH BETTING",
      "marketStatus": "Active",
      "displayOrder": 0,
      "displayStatus": "Displayed",
      "isGpAvailable": false,
      "isHandicapMarket": false,
      "isIndexMarket": false,
      "isLpAvailable": true,
      "isMarketBIR": false,
      "isOverUnderMarket": false,
      "isSpAvailable": false,
      "isStandardFixedOddsMarket": true,
      "channels": [
          "a",
          "R",
          "b",
          "c",
          "d",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
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

  topFirstInningsRunScorerHomeM: SportBookMarketStructured ={
      selections: new Map<number, SportBookSelection>([[0, this.topFirstInningsRunScorerHomeS1],[1, this.topFirstInningsRunScorerHomeS2],[2, this.topFirstInningsRunScorerHomeS3],[3, this.topFirstInningsRunScorerHomeS4],[4, this.topFirstInningsRunScorerHomeS5],[5, this.topFirstInningsRunScorerHomeS6],[6, this.topFirstInningsRunScorerHomeS7],[7, this.topFirstInningsRunScorerHomeS8]]),
      "eventKey": 2791293,
      "marketKey": 103725274,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "IND TOP 1ST INNINGS RUNSCORER",
      "marketStatus": "Active",
      "displayOrder": 70,
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
      "marketGroupID": "3017362",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined

  }

  topFirstInningsRunScorerAwayM: SportBookMarketStructured = {
      selections: new Map<number, SportBookSelection>([[0, this.topFirstInningsRunScorerAwayS1],[1, this.topFirstInningsRunScorerAwayS2],[2, this.topFirstInningsRunScorerAwayS3],[3, this.topFirstInningsRunScorerAwayS4],[4, this.topFirstInningsRunScorerAwayS5],[5, this.topFirstInningsRunScorerAwayS6],[6, this.topFirstInningsRunScorerAwayS7],[7, this.topFirstInningsRunScorerAwayS8],[8,this.topFirstInningsRunScorerAwayS9]]),
      "eventKey": 2791293,
      "marketKey": 103725289,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "ENGLAND TOP 1ST INNINGS RUNSCORER",
      "marketStatus": "Active",
      "displayOrder": 500,
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
      "isGpAvailable":false,
      "isHandicapMarket":false,
      "isIndexMarket":false,
      "isLpAvailable": true,
      "isMarketBIR":false,
      "isOverUnderMarket":false,
      "isSpAvailable":false,
      "isStandardFixedOddsMarket": true,
      "isTricastMarket":false,
      "eachWayWithBet": "Y",
      "marketGroupID": "3017393",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  cricketE1:SportBookEventStructured = {
      markets : new Map<number, SportBookMarketStructured>(
          [
              [0, this.matchBettingM],
              [1, this.topFirstInningsRunScorerHomeM],
              [2, this.topFirstInningsRunScorerAwayM],
          ]
      ),
      "eventKey": 2791293,
      "eventName": "INDIA V ENGLAND",
      "typeName": "TEST MATCHES",
      "categoryName": "CRICKET",
      "eventStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "eventSort": "MTCH",
      "eventDateTime": new Date,
      "isEventStarted": false,
      "isEventFinished": false,
      "isEventResulted": false,
      "channels": [
          "a",
          "b",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496"
      },
      hasBIRMarkets: null,
      flags: null,
      isCashoutAvailable: null,
      offTime: null,
      raceStage: null,
      eventTimePlusTypeName: null,
      runnerCount: null,
      typeFlagCode: null,
      typeKey: null
  }

  sportBookResult: SportBookResult = {
      events : new Map<number, SportBookEventStructured>(
        [[0, this.cricketE1]]
    )
  }
  
}

export class CricketSportBookMockDataT3 {
  matchBettingAwayS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884267,
      "selectionName": "ENGLAND",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "A",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  matchBettingHomeS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884167,
      "selectionName": "INDIA",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "H",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }

  matchBettingDrawS: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 86899412,
      "selectionKey": 286884242,
      "selectionName": "DRAW",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "MR",
      "outcomeMeaningMinorCode": "D",
      "channels": [
          "a",
          "b",
          "K"
      ],
      "isResulted": false,
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
          "parents": "c.10:cl.58:t.114496:e.2791293:e.86899412"
      },
      "hideEntry": false,
      "hidePrice": false,
      isResultConfirmed: null,
      isSettled: null,
      resultCode: null,
      runnerNumber: null,
      suspensionReason: null
  }
  
  matchBettingM: SportBookMarketStructured ={
      selections: new Map<number, SportBookSelection>([[0, this.matchBettingAwayS],[1, this.matchBettingHomeS],[2, this.matchBettingDrawS]]),
      "eventKey": 1927460,
      "marketKey": 79653042,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "MR",
      "marketName": "MATCH BETTING",
      "marketStatus": "Active",
      "displayOrder": 0,
      "displayStatus": "Displayed",
      "isGpAvailable": false,
      "isHandicapMarket": false,
      "isIndexMarket": false,
      "isLpAvailable": true,
      "isMarketBIR": false,
      "isOverUnderMarket": false,
      "isSpAvailable": false,
      "isStandardFixedOddsMarket": true,
      "channels": [
          "a",
          "R",
          "b",
          "c",
          "d",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.16407:e.1927460"
      },
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

  toWinTheTossHome: SportBookSelection ={
      "eventKey": 2791293,
      "marketKey": 103733395,
      "selectionKey": 337269897,
      "selectionName": "INDIA",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 11,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103733395"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  toWinTheTossAway: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 103733395,
      "selectionKey": 337269910,
      "selectionName": "ENGLAND",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 11,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103733395"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  
  toWinTheTossM: SportBookMarketStructured ={
    selections: new Map<number, SportBookSelection>([[0, this.toWinTheTossHome],[1, this.toWinTheTossAway]]),
    "eventKey": 2791293,
    "marketKey": 103733395,
    "marketMeaningMajorCode": "-",
    "marketMeaningMinorCode": "--",
    "marketName": "TO WIN THE TOSS",
    "marketStatus": "Active",
    "displayOrder": 90,
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
    "marketGroupID": "3017361",
    "channels": [
        "K",
        "a",
        "b"
    ],
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293"
    },
    marketFlags: "",
    isEachWayAvailable: "",
    isForecastMarket: "",
    eachWayFactorDen: "",
    eachWayFactorNum: "",
    eachWayPlaces: "",
    nCastDividend: new NCastDividend,
    nCastDividends: [],
    nCastDeleteDividend: undefined
}


  playerToScore100M1S1: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 103735085,
      "selectionKey": 337276168,
      "selectionName": "NO",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 13,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103735085"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  playerToScore100M1S2: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 103735085,
      "selectionKey": 337276169,
      "selectionName": "YES",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 13,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103735085"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  playerToScore100M1: SportBookMarketStructured = {
      selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M1S1],[1, this.playerToScore100M1S2]]),
      "eventKey": 2791293,
      "marketKey": 103735085,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - JOE ROOT",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  playerToScore100M2S1: SportBookSelection = {
      "eventKey": 2791293,
      "marketKey": 103734428,
      "selectionKey": 337275552,
      "selectionName": "YES",
      "selectionStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "outcomeMeaningMajorCode": "-",
      "outcomeMeaningMinorCode": "-",
      "channels": [
          "K",
          "a",
          "b"
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
                  "denPrice": 3,
                  "selectionPriceType": "LP"
              }
          ]
      },
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293:m.103734428"
      },
      "hideEntry": false,
      "hidePrice": false,
      runnerNumber: null
  }
  playerToScore100M2S2: SportBookSelection = {
    "eventKey": 2791293,
    "marketKey": 103734428,
    "selectionKey": 337275557,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
    ],
    "isResulted": false,
    "isResultConfirmed": false,
    "resultCode": "Unset",
    "isSettled": false,
    "suspensionReason": "-",
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734428"
    },
    "prices": {
        "price": [
            {
                "numPrice": 2,
                "denPrice": 3,
                "selectionPriceType": "LP"
            }
        ]
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M2: SportBookMarketStructured = {
    selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M2S1],[1, this.playerToScore100M2S2]]),
    "eventKey": 2791293,
      "marketKey": 103734428,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - VIRAT KOHLI",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }
  
  playerToScore100M3S1: SportBookSelection = {
    "eventKey": 2791293,
    "marketKey": 103734481,
    "selectionKey": 337275626,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734481"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M3S2: SportBookSelection = {
    "eventKey": 2791293,
    "marketKey": 103734481,
    "selectionKey": 337275570,
    "selectionName": "YES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 3,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734481"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }

  playerToScore100M3: SportBookMarketStructured = {
    selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M3S1],[1, this.playerToScore100M3S2]]),
    "eventKey": 2791293,
      "marketKey": 103734481,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - ROHIT SHARMA",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  playerToScore100M4S1: SportBookSelection = {
    "eventKey": 2791293,
    "marketKey": 103734530,
    "selectionKey": 337275938,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734530"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M4S2: SportBookSelection = {
    "eventKey": 2791293,
    "marketKey": 103734530,
    "selectionKey": 337275937,
    "selectionName": "YES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734530"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }

  playerToScore100M4: SportBookMarketStructured ={
    selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M4S1],[1, this.playerToScore100M4S2]]),
    "eventKey": 2791293,
      "marketKey": 103734530,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - RISHABH PANT",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }


  playerToScore100M5S1: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103734869,
    "selectionKey": 337276000,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734869"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M5S2: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103734869,
    "selectionKey": 337275963,
    "selectionName": "YES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103734869"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M5: SportBookMarketStructured = {
      selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M5S1],[1, this.playerToScore100M5S2]]),
      "eventKey": 2791293,
      "marketKey": 103734869,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - HARDIK PANDYA",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  playerToScore100M6S1: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103735062,
    "selectionKey": 337276043,
    "selectionName": "YES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103735062"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M6S2: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103735062,
    "selectionKey": 337276068,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
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
                "denPrice": 13,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103735062"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M6: SportBookMarketStructured = {
      selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M6S1],[1, this.playerToScore100M6S2]]),
      "eventKey": 2791293,
      "marketKey": 103735062,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - BEN STOKES",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }


  playerToScore100M7S1: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103735132,
    "selectionKey": 337276224,
    "selectionName": "NO",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
    ],
    "isResulted": false,
    "isResultConfirmed": false,
    "resultCode": "Unset",
    "isSettled": false,
    "suspensionReason": "-",
    "prices": {
        "price": [
            {
                "numPrice": 13,
                "denPrice": 14,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103735132"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M7S2: SportBookSelection ={
    "eventKey": 2791293,
    "marketKey": 103735132,
    "selectionKey": 337276581,
    "selectionName": "YES",
    "selectionStatus": "Active",
    "displayStatus": "Displayed",
    "displayOrder": 0,
    "outcomeMeaningMajorCode": "-",
    "outcomeMeaningMinorCode": "-",
    "channels": [
        "K",
        "a",
        "b"
    ],
    "isResulted": false,
    "isResultConfirmed": false,
    "resultCode": "Unset",
    "isSettled": false,
    "suspensionReason": "-",
    "prices": {
        "price": [
            {
                "numPrice": 14,
                "denPrice": 15,
                "selectionPriceType": "LP"
            }
        ]
    },
    "meta": {
        "operation": "create",
        "parents": "c.10:cl.58:t.114496:e.2791293:m.103735132"
    },
    "hideEntry": false,
    "hidePrice": false,
    runnerNumber: null
  }
  playerToScore100M7: SportBookMarketStructured = {
      selections: new Map<number, SportBookSelection>([[0, this.playerToScore100M7S1],[1, this.playerToScore100M7S2]]),
      "eventKey": 2791293,
      "marketKey": 103735132,
      "marketMeaningMajorCode": "-",
      "marketMeaningMinorCode": "--",
      "marketName": "TO SCORE 100 IN 1ST INNS - JONNY BAIRSTOW",
      "marketStatus": "Active",
      "displayOrder": 620,
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
      "marketGroupID": "3017378",
      "channels": [
          "K",
          "a",
          "b"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496:e.2791293"
      },
      marketFlags: "",
      isEachWayAvailable: "",
      isForecastMarket: "",
      eachWayFactorDen: "",
      eachWayFactorNum: "",
      eachWayPlaces: "",
      nCastDividend: new NCastDividend,
      nCastDividends: [],
      nCastDeleteDividend: undefined
  }

  cricketE1:SportBookEventStructured = {
      markets : new Map<number, SportBookMarketStructured>(
          [
              [0, this.matchBettingM],
              [1, this.toWinTheTossM],
              [2, this.playerToScore100M1],
              [3, this.playerToScore100M2],
              [4, this.playerToScore100M3],
              [5, this.playerToScore100M4],
              [6, this.playerToScore100M5],
              [7, this.playerToScore100M6],
              [8, this.playerToScore100M7],
          ]
      ),
      "eventKey": 2791293,
      "eventName": "INDIA V ENGLAND",
      "typeName": "TEST MATCHES",
      "categoryName": "CRICKET",
      "eventStatus": "Active",
      "displayStatus": "Displayed",
      "displayOrder": 0,
      "eventSort": "MTCH",
      "eventDateTime": new Date,
      "isEventStarted": false,
      "isEventFinished": false,
      "isEventResulted": false,
      "channels": [
          "a",
          "b",
          "K"
      ],
      "meta": {
          "operation": "create",
          "parents": "c.10:cl.58:t.114496"
      },
      hasBIRMarkets: null,
      flags: null,
      isCashoutAvailable: null,
      offTime: null,
      raceStage: null,
      eventTimePlusTypeName: null,
      runnerCount: null,
      typeFlagCode: null,
      typeKey: null
  }

  sportBookResult: SportBookResult = {
      events : new Map<number, SportBookEventStructured>(
        [[0, this.cricketE1]]
    )
  }
}


export class CricketContentMockData {
    eventKey: string = "1927460"
    marketKey: string = "103633743"
    cricketContentMockData: CricketDataContent = {
        "contentParameters": {
        "AdditionalInfo": "{0}",
        "Cricket": "CRICKET",
        "FirstInningsLead": "FIRST INNINGS LEAD",
        "ManOfTheMatch": "MAN OF THE MATCH",
        "MatchBetting": "MATCH BETTING",
        "MoreMarkets": "MORE MARKETS AVAILABLE ON BETSTATION",
        "OnRequest": "OTHERS ON REQUEST",
        "OptionalInfo": "OPTIONAL ADDITIONAL INFORMATION",
        "Today": "TODAY",
        "Tomorrow": "TOMORROW",
        "TopFirstInningsRunScorer": "TOP 1ST INNINGS RUNSCORER",
        "TopRunScorer": "TOP TEAM RUNSCORER",
        "ToScore100in1stInning": "PLAYER TO SCORE 1ST INNINGS 100",
        "TotalSixes": "TOTAL SIXES",
        "ToWinTheToss": "TO WIN THE TOSS",
        "Vs": "V"
        }
    };

    cricketCountriesMockData: Array<CricketCountriesContent> = [
        {
        "name": "England",
        "matches": [
            "ENG"
        ]
        },
        {
        "name": "Australia",
        "matches": [
            "AUS"
        ]
        },
        {
        "name": "New Zealand",
        "matches": [
            "NZ"
        ]
        },
        {
        "name": "South Africa",
        "matches": [
            "SA"
        ]
        },
        {
        "name": "Pakistan",
        "matches": [
            "PAK"
        ]
        },
        {
        "name": "Sri Lanka",
        "matches": [
            "SL"
        ]
        },
        {
        "name": "Bangladesh",
        "matches": [
            "BAN"
        ]
        },
        {
        "name": "India",
        "matches": [
            "IND"
        ]
        },
        {
        "name": "West Indies",
        "matches": [
            "WI"
        ]
        },
        {
        "name": "Ireland",
        "matches": [
            "IRE"
        ]
        },
        {
        "name": "Zimbabwe",
        "matches": [
            "ZIM"
        ]
        },
        {
        "name": "Afghanistan",
        "matches": [
            "AFG"
        ]
        },
        {
        "name": "Netherlands",
        "matches": [
            "NED"
        ]
        },
        {
        "name": "Kenya",
        "matches": [
            "KEN"
        ]
        },
        {
        "name": "Scotland",
        "matches": [
            "SCO"
        ]
        },
        {
        "name": "United Arab Emirates",
        "matches": [
            "UAE"
        ]
        },
        {
        "name": "Namibia",
        "matches": [
            "NAM"
        ]
        },
        {
        "name": "Oman",
        "matches": [
            "OMA"
        ]
        },
        {
        "name": "USA",
        "matches": [
            "USA"
        ]
        },
        {
        "name": "Nepal",
        "matches": [
            "NEP"
        ]
        },
        {
        "name": "Papua New Guinea",
        "matches": [
            "PNG"
        ]
        },
        {
        "name": "Bermuda",
        "matches": [
            "BER"
        ]
        },
        {
        "name": "Hong Kong",
        "matches": [
            "HK"
        ]
        }
    ]
}