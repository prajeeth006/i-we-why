import { Game } from 'src/app/common/cds-client/models/fixture-view.model';

export class MockNFLData {
  Totals: Game = {
    "id": 76693584,
    "name": {
        "value": "Totals",
        "sign": "3If05A=="
    },
    "results": [
        {
            "id": -2133918758,
            "odds": 2.04,
            "name": {
                "value": "Over 45",
                "sign": "A05EEw=="
            },
            "visibility": "Visible",
            "totalsPrefix": "Over",
            "numerator": 21,
            "denominator": 20,
            "americanOdds": 105
        },
        {
            "id": -2133918757,
            "odds": 1.71,
            "name": {
                "value": "Under 45",
                "sign": "xMFoXw=="
            },
            "visibility": "Visible",
            "totalsPrefix": "Under",
            "numerator": 7,
            "denominator": 10,
            "americanOdds": -140
        }
    ],
    "templateId": 104,
    "categoryId": 63,
    "resultOrder": "Default",
    "combo1": "NoEventCombo",
    "combo2": "Single",
    "visibility": "Visible",
    "balanced": 1,
    "attr": "45",
    "spread": 0.33,
    "category": "Gridable",
    "templateCategory": {
        "id": 63,
        "name": {
            "value": "Totals",
            "sign": "3If05A=="
        },
        "category": "Gridable"
    },
    "isMain": false,
    "grouping": {
        "gridGroups": [
            "uepttv0kt"
        ],
        "detailed": [],
    }
};

FirstHalfSpread : Game ={
  "id": 76693585,
  "name": {
      "value": "1st Half Spread",
      "sign": "BGNUdA=="
  },
  "results": [
      {
          "id": -2133918756,
          "odds": 1.91,
          "name": {
              "value": "Chicago Bears +1,5",
              "sign": "qrciag=="
          },
          "visibility": "Visible",
          "attr": "+1,5",
          "numerator": 10,
          "denominator": 11,
          "americanOdds": -110
      },
      {
          "id": -2133918755,
          "odds": 1.81,
          "name": {
              "value": "Las Vegas Aces -1,5",
              "sign": "MuR+bA=="
          },
          "visibility": "Visible",
          "attr": "-1,5",
          "numerator": 4,
          "denominator": 5,
          "americanOdds": -125
      }
  ],
  "templateId": 364,
  "categoryId": 738,
  "resultOrder": "Default",
  "combo1": "NoSportCombo",
  "combo2": "Single",
  "visibility": "Visible",
  "balanced": 1,
  "spread": 0.10,
  "category": "Gridable",
  "templateCategory": {
      "id": 738,
      "name": {
          "value": "Halftime Spread",
          "sign": "LruvGg=="
      },
      "category": "Gridable"
  },
  "isMain": false,
  "grouping": {
      "gridGroups": [
          "srox7vjhp"
      ],
      "detailed": [],

  }
};

}