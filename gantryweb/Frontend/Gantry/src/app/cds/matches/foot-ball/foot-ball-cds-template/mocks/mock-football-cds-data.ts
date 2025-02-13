import { OptionalMarket } from "../models/foot-ball-cds-template.model";

export class MockFootBallCdsData {
  finalResult: OptionalMarket = {
    "id": 61148888,
    "name": {
        "value": "Match Result",
        "sign": "NY5olg=="
    },
    "options": [
        {
            "id": 281303098,
            "status": "Visible",
            "name": {
                "value": "GANDHINAGAR FC",
                "sign": "2MJI6Q=="
            },
            "sourceName": {
                "value": "1"
            },
            "price": {
                "id": 851176907,
                "numerator": 27,
                "denominator": 4,
                "odds": 7.75,
                "americanOdds": 675
            },
        },
        {
            "id": 281303099,
            "status": "Visible",
            "name": {
                "value": "X",
                "sign": "JaqqrQ=="
            },
            "price": {
                "id": 851176913,
                "numerator": 78,
                "denominator": 100,
                "odds": 1.78,
                "americanOdds": -130
            },
        },
        {
            "id": 281303100,
            "status": "Visible",
            "name": {
                "value": "FC Legnago Salus SSD",
                "sign": "SymoFw=="
            },
            "sourceName": {
                "value": "2"
            },
            "price": {
                "id": 851176919,
                "numerator": 7,
                "denominator": 10,
                "odds": 1.7,
                "americanOdds": -145
            },
        }
    ],

}

  bothTeamsToScore: OptionalMarket = {
    "id": 60439248,
    "name": {
      "value": "Both teams to score",
      "sign": "GQYHHA=="
    },
    "options": [
      {
        "id": 278388749,
        "status": "visible",
        "name": {
          "value": "Yes",
          "sign": "sr0lNA=="
        },
        "price": {
          "id": 836824730,
          "numerator": 68,
          "denominator": 100,
          "odds": 1.68,
          "americanOdds": -145
        },
      },
      {
        "id": 278388750,
        "status": "visible",
        "name": {
          "value": "no ",
          "sign": "yiDavg=="
        },
        "price": {
          "id": 836824733,
          "numerator": 1,
          "denominator": 1,
          "odds": 2,
          "americanOdds": 100
        },
      }
    ],

  }

  matchResultBothTeamtoScore: OptionalMarket = {
    "id": 60439349,
    "name": {
      "value": "Match Result and Both Teams to Score",
      "sign": "5J3wiA=="
    },
    "options": [
      {
        "id": 278389191,
        "status": "visible",
        "name": {
          "value": "Fram Larvik to win and both teams to score",
          "sign": "2IZpmQ=="
        },
        "price": {
          "id": 836826080,
          "numerator": 27,
          "denominator": 4,
          "odds": 7.75,
          "americanOdds": 675
        },
      },
      {
        "id": 278389192,
        "status": "visible",
        "name": {
          "value": "Levanger to win and both teams to score",
          "sign": "ia7WDg=="
        },
        "price": {
          "id": 836826083,
          "numerator": 39,
          "denominator": 20,
          "odds": 2.95,
          "americanOdds": 195
        },
      },
      {
        "id": 278389193,
        "status": "visible",
        "name": {
          "value": "Fram Larvik to win and Levanger not to score",
          "sign": "yzPr3Q=="
        },
        "price": {
          "id": 836826086,
          "numerator": 15,
          "denominator": 2,
          "odds": 8.5,
          "americanOdds": 750
        },
      },
      {
        "id": 278389194,
        "status": "visible",
        "name": {
          "value": "Levanger to win and Fram Larvik not to score",
          "sign": "z81fkA=="
        },
        "price": {
          "id": 836826089,
          "numerator": 7,
          "denominator": 4,
          "odds": 2.75,
          "americanOdds": 175
        },
      },
      {
        "id": 278389195,
        "status": "visible",
        "name": {
          "value": "Both teams to score and the match to end in a draw",
          "sign": "6hZKCQ=="
        },
        "price": {
          "id": 836826092,
          "numerator": 4,
          "denominator": 1,
          "odds": 5,
          "americanOdds": 400
        },
      },
      {
        "id": 278389196,
        "status": "visible",
        "name": {
          "value": "Both teams not to score",
          "sign": "0OX5+Q=="
        },
        "price": {
          "id": 836826095,
          "numerator": 21,
          "denominator": 2,
          "odds": 11.5,
          "americanOdds": 1050
        },
      }
    ],
  }

  TotalScore1: OptionalMarket = {
    "id": 60439537,
    "name": {
      "value": "Total Goals",
      "sign": "ok/ILw=="
    },
    "options": [
      {
        "id": 278390994,
        "status": "visible",
        "name": {
          "value": "Over 1,5",
          "sign": "HRZVYQ=="
        },
        "price": {
          "id": 836831525,
          "numerator": 19,
          "denominator": 100,
          "odds": 1.19,
          "americanOdds": -550
        },

      },
      {
        "id": 278390995,
        "status": "visible",
        "name": {
          "value": "Under 1,5",
          "sign": "42zBSQ=="
        },
        "price": {
          "id": 836831528,
          "numerator": 3,
          "denominator": 1,
          "odds": 4,
          "americanOdds": 300
        },

      }
    ],

  }

  totalScore2: OptionalMarket = {
    "id": 60439538,
    "name": {
      "value": "Total Goals",
      "sign": "YWJcnA=="
    },
    "options": [
      {
        "id": 278390996,
        "status": "visible",
        "name": {
          "value": "Over 2,5",
          "sign": "FPou0w=="
        },
        "price": {
          "id": 836831531,
          "numerator": 3,
          "denominator": 5,
          "odds": 1.6,
          "americanOdds": -165
        },
      },
      {
        "id": 278390997,
        "status": "visible",
        "name": {
          "value": "Under 2,5",
          "sign": "HL5cIA=="
        },
        "price": {
          "id": 836831534,
          "numerator": 11,
          "denominator": 10,
          "odds": 2.1,
          "americanOdds": 110
        },
      }
    ],
  }
  totlaScore3: OptionalMarket = {
    "id": 60439539,
    "name": {
      "value": "Total Goals",
      "sign": "IHnQ8g=="
    },
    "options": [
      {
        "id": 278390998,
        "status": "visible",
        "name": {
          "value": "Over 3,5",
          "sign": "LFzXCw=="
        },
        "price": {
          "id": 836831537,
          "numerator": 29,
          "denominator": 20,
          "odds": 2.45,
          "americanOdds": 145
        },
      },
      {
        "id": 278390999,
        "status": "visible",
        "name": {
          "value": "Under 3,5",
          "sign": "dvL4sQ=="
        },
        "price": {
          "id": 836831540,
          "numerator": 4,
          "denominator": 9,
          "odds": 1.44,
          "americanOdds": -225
        },
      }
    ],
  }
  goalScorer: OptionalMarket = {
    "id": 60579284,
    "name": {
      "value": "1st Goalscorer",
      "sign": "QTBDcQ=="
    },
    "options": [
      {
        "id": 278952384,
        "status": "visible",
        "name": {
          "value": "Aboud Omar",
          "sign": "wBBw7g=="
        },
        "price": {
          "id": 839634068,
          odds: 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952385,
        "status": "visible",
        "name": {
          "value": "Agade, Collins",
          "sign": "OUJF+g=="
        },
        "price": {
          "id": 839634069,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952386,
        "status": "visible",
        "name": {
          "value": "Ayub Masika",
          "sign": "JLTxYQ=="
        },
        "price": {
          "id": 839634070,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952387,
        "status": "visible",
        "name": {
          "value": "Juma, Lawrence",
          "sign": "rzQvPw=="
        },
        "price": {
          "id": 839634071,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130

        },
      },
      {
        "id": 278952388,
        "status": "visible",
        "name": {
          "value": "Kahata, Francis",
          "sign": "/0tV8w=="
        },
        "price": {
          "id": 839634072,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952389,
        "status": "visible",
        "name": {
          "value": "Matasi, Patrick",
          "sign": "lOGOHA=="
        },
        "price": {
          "id": 839634073,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952390,
        "status": "visible",
        "name": {
          "value": "Miheso, Clifton",
          "sign": "Hh/YeQ=="
        },
        "price": {
          "id": 839634074,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952391,
        "status": "visible",
        "name": {
          "value": "Muguna, Kenneth",
          "sign": "gJd+VQ=="
        },
        "price": {
          "id": 839634075,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952392,
        "status": "visible",
        "name": {
          "value": "Ochieng, Bernard",
          "sign": "xiYp4A=="
        },
        "price": {
          "id": 839634076,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952393,
        "status": "visible",
        "name": {
          "value": "Ochieng, Ovella",
          "sign": "zjrGmQ=="
        },
        "price": {
          "id": 839634077,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952394,
        "status": "visible",
        "name": {
          "value": "Okumu, Joseph",
          "sign": "5ToQrQ=="
        },
        "price": {
          "id": 839634078,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952395,
        "status": "visible",
        "name": {
          "value": "Omolo, Johanna",
          "sign": "H1diaw=="
        },
        "price": {
          "id": 839634079,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952396,
        "status": "visible",
        "name": {
          "value": "Omurwa, Johnstone",
          "sign": "M2pSEQ=="
        },
        "price": {
          "id": 839634080,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952397,
        "status": "visible",
        "name": {
          "value": "Otieno, Brian",
          "sign": "VvvEQw=="
        },
        "price": {
          "id": 839634081,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      },
      {
        "id": 278952398,
        "status": "visible",
        "name": {
          "value": "No Goalscorer",
          "sign": "t6FRUg=="
        },
        "price": {
          "id": 839634082,
          "odds": 1,
          "numerator": 78,
          "denominator": 100,
          "americanOdds": -130
        },
      }
    ],
  }
  correctScore: OptionalMarket = {
    "id": 60442011,
    "name": {
      "value": "Correct Score",
      "sign": "szKGjA=="
    },
    "options": [
      {
        "id": 278399137,
        "status": "visible",
        "name": {
          "value": "0:0",
          "sign": "hxH6ZQ=="
        },
        "price": {
          "id": 836883823,
          "numerator": 19,
          "denominator": 1,
          "odds": 20,
          "americanOdds": 1900
        },
      },
      {
        "id": 278399138,
        "status": "visible",
        "name": {
          "value": "1:0",
          "sign": "Gf1uxw=="
        },
        "price": {
          "id": 836883826,
          "numerator": 23,
          "denominator": 2,
          "odds": 12.5,
          "americanOdds": 1150
        },
      },
      {
        "id": 278399139,
        "status": "visible",
        "name": {
          "value": "1:1",
          "sign": "102LZw=="
        },
        "price": {
          "id": 836883829,
          "numerator": 25,
          "denominator": 4,
          "odds": 7.25,
          "americanOdds": 625
        },
      },
      {
        "id": 278399140,
        "status": "visible",
        "name": {
          "value": "0:1",
          "sign": "q6x3LA=="
        },
        "price": {
          "id": 836883832,
          "numerator": 6,
          "denominator": 1,
          "odds": 7,
          "americanOdds": 600
        },
      },
      {
        "id": 278399141,
        "status": "visible",
        "name": {
          "value": "2:0",
          "sign": "C8gWjw=="
        },
        "price": {
          "id": 836883835,
          "numerator": 19,
          "denominator": 1,
          "odds": 20,
          "americanOdds": 1900
        },
      },
      {
        "id": 278399142,
        "status": "visible",
        "name": {
          "value": "2:1",
          "sign": "NH5HWw=="
        },
        "price": {
          "id": 836883838,
          "numerator": 23,
          "denominator": 2,
          "odds": 12.5,
          "americanOdds": 1150
        },
      },
      {
        "id": 278399143,
        "status": "visible",
        "name": {
          "value": "2:2",
          "sign": "1q+sFQ=="
        },
        "price": {
          "id": 836883841,
          "numerator": 11,
          "denominator": 1,
          "odds": 12,
          "americanOdds": 1100
        },
      },
      {
        "id": 278399144,
        "status": "visible",
        "name": {
          "value": "1:2",
          "sign": "QYd1VA=="
        },
        "price": {
          "id": 836883844,
          "numerator": 6,
          "denominator": 1,
          "odds": 7,
          "americanOdds": 600
        },
      },
      {
        "id": 278399145,
        "status": "visible",
        "name": {
          "value": "0:2",
          "sign": "Lm1Vgg=="
        },
        "price": {
          "id": 836883847,
          "numerator": 13,
          "denominator": 2,
          "odds": 7.5,
          "americanOdds": 650
        },
      },
      {
        "id": 278399146,
        "status": "visible",
        "name": {
          "value": "3:0",
          "sign": "8jRLzQ=="
        },
        "price": {
          "id": 836883850,
          "numerator": 35,
          "denominator": 1,
          "odds": 36,
          "americanOdds": 3500
        },
      },
      {
        "id": 278399147,
        "status": "visible",
        "name": {
          "value": "3:1",
          "sign": "PISubQ=="
        },
        "price": {
          "id": 836883853,
          "numerator": 25,
          "denominator": 1,
          "odds": 26,
          "americanOdds": 2500
        },
      },
      {
        "id": 278399148,
        "status": "visible",
        "name": {
          "value": "3:2",
          "sign": "zV6Zvg=="
        },
        "price": {
          "id": 836883856,
          "numerator": 25,
          "denominator": 1,
          "odds": 26,
          "americanOdds": 2500
        },
      },
      {
        "id": 278399149,
        "status": "visible",
        "name": {
          "value": "3:3",
          "sign": "A+58Hg=="
        },
        "price": {
          "id": 836883859,
          "numerator": 30,
          "denominator": 1,
          "odds": 31,
          "americanOdds": 3000
        },
      },
      {
        "id": 278399150,
        "status": "visible",
        "name": {
          "value": "2:3",
          "sign": "nQLovA=="
        },
        "price": {
          "id": 836883862,
          "numerator": 15,
          "denominator": 1,
          "odds": 16,
          "americanOdds": 1500
        },
      },
      {
        "id": 278399151,
        "status": "visible",
        "name": {
          "value": "1:3",
          "sign": "nDxMaQ=="
        },
        "price": {
          "id": 836883865,
          "numerator": 9,
          "denominator": 1,
          "odds": 10,
          "americanOdds": 900
        },
      },
      {
        "id": 278399152,
        "status": "visible",
        "name": {
          "value": "0:3",
          "sign": "b/tTOA=="
        },
        "price": {
          "id": 836883868,
          "numerator": 19,
          "denominator": 2,
          "odds": 10.5,
          "americanOdds": 950
        },
      },
      {
        "id": 278399153,
        "status": "visible",
        "name": {
          "value": "4:0",
          "sign": "UYKxcQ=="
        },
        "price": {
          "id": 836883871,
          "numerator": 66,
          "denominator": 1,
          "odds": 67,
          "americanOdds": 6600
        },
      },
      {
        "id": 278399154,
        "status": "visible",
        "name": {
          "value": "4:1",
          "sign": "bjTgpQ=="
        },
        "price": {
          "id": 836883874,
          "numerator": 45,
          "denominator": 1,
          "odds": 46,
          "americanOdds": 4500
        },
      },
      {
        "id": 278399155,
        "status": "visible",
        "name": {
          "value": "4:2",
          "sign": "jOUL6w=="
        },
        "price": {
          "id": 836883877,
          "numerator": 45,
          "denominator": 1,
          "odds": 46,
          "americanOdds": 4500
        },
      },
      {
        "id": 278399156,
        "status": "visible",
        "name": {
          "value": "4:3",
          "sign": "UV4y1g=="
        },
        "price": {
          "id": 836883880,
          "numerator": 60,
          "denominator": 1,
          "odds": 61,
          "americanOdds": 6000
        },
      },
      {
        "id": 278399157,
        "status": "visible",
        "name": {
          "value": "4:4",
          "sign": "qku0nw=="
        },
        "price": {
          "id": 836883883,
          "numerator": 80,
          "denominator": 1,
          "odds": 81,
          "americanOdds": 8000
        },
      },
      {
        "id": 278399158,
        "status": "visible",
        "name": {
          "value": "3:4",
          "sign": "htutOQ=="
        },
        "price": {
          "id": 836883886,
          "numerator": 40,
          "denominator": 1,
          "odds": 41,
          "americanOdds": 4000
        },
      },
      {
        "id": 278399159,
        "status": "visible",
        "name": {
          "value": "2:4",
          "sign": "6TGN7w=="
        },
        "price": {
          "id": 836883889,
          "numerator": 22,
          "denominator": 1,
          "odds": 23,
          "americanOdds": 2200
        },
      },
      {
        "id": 278399160,
        "status": "visible",
        "name": {
          "value": "1:4",
          "sign": "fhlUrg=="
        },
        "price": {
          "id": 836883892,
          "numerator": 15,
          "denominator": 1,
          "odds": 16,
          "americanOdds": 1500
        },
      },
      {
        "id": 278399161,
        "status": "visible",
        "name": {
          "value": "0:4",
          "sign": "EfN0eA=="
        },
        "price": {
          "id": 836883895,
          "numerator": 15,
          "denominator": 1,
          "odds": 16,
          "americanOdds": 1500
        },
      },
      {
        "id": 278399162,
        "status": "visible",
        "name": {
          "value": "Any other score",
          "sign": "Jbr28w=="
        },
        "price": {
          "id": 836883898,
          "numerator": 19,
          "denominator": 2,
          "odds": 10.5,
          "americanOdds": 950
        },
      }
    ],

  }

}



