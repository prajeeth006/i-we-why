### Gantry RB-1.16 [Not released yet]

**[DTP-26707](https://jira.corp.entaingroup.com/browse/DTP-26707) - Outright Template - TV2 Sports**

##### SiteCore Changes:
/sitecore/content/Gantry/GantryWeb/Outrights/OutrightCDS
Football: [{
	"Promotion": {
		"MarketType": "Promotion/Relegation",
		"MarketSubType": "",
		"Position": "Promotion",
		"Places": ""
	},
	"Relegation": {
		"MarketType": "Promotion/Relegation",
		"MarketSubType": "",
		"Position": "Relegation",
		"Places": ""
	},
	"Tournament Winner": {
		"MarketType": "Outright",
		"MarketSubType": "Tournament",
		"Position": "First",
		"Places": "1"
	},
	"Cup Winner": {
		"MarketType": "Outright",
		"MarketSubType": "Cup",
		"Position": "First",
		"Places": "1"
	},
	"Top Goalscorer": {
		"MarketType": "TopScorer",
		"MarketSubType": "MostGoals",
		"Position": "First",
		"Places": "1"
	},
	"Team To Finish Top $": {
		"MarketType": "Outright",
		"MarketSubType": "Competition",
		"Position": "First",
		"Places": ""
	}
}]


**[DTP-27000](https://jira.corp.entaingroup.com/browse/DTP-27000) - Asset Preview, Preview API Calls from DisplayManager to GantryWeb Need to be changed from GET to POST Request**

##### SiteCore Changes:
/sitecore/content/Gantry/GantryConfig/Configuration
Keys:
IsPreviewPostMetod :False

**[DTP-18184](https://jira.corp.entaingroup.com/browse/DTP-18184) - 3 Sports Template Descoped From Tech-Trial: Golf 2ball and 3ball Coupon**

##### SiteCore Changes:
###### Created golf content configuration:
```
- /sitecore/content/Gantry/GantryWeb/Links/Golf
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/MultiEventTemplates/NonVirtual/Golf
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/SportsTemplates/NonVirtual/Golf
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/Coral/SportsTypes/Golf
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/Ladbrokes/SportsTypes/Golf
```
***

**[DTP-26650](https://jira.corp.entaingroup.com/browse/DTP-26650) - Formula 1 showing Undefined text for today and tomorrow dates**
##### SiteCore Changes:

###### Created and Updated the below content editor files:
```
- /sitecore/content/Gantry/GantryWeb/Formula1Content
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/TradingTemplates
- /sitecore/content/Gantry/GantryWeb/Links/AmericanFootball/TradingNflUrl
- /sitecore/content/Gantry/GantryWeb/Links/Boxing/TradingStandardTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Cricket/TradingStandardTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Darts/TradingTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Football/TradingFootballUrl
- /sitecore/content/Gantry/GantryWeb/Links/MOTOR_CARS/TradingStandardTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Rugby/TradingStandardTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Snooker/TradingStandardTemplate
- /sitecore/content/Gantry/GantryWeb/Links/Tennis/TradingTennisUrl
```

***

**[DTP-24425](https://jira.corp.entaingroup.com/browse/DTP-24425) - BWIN Sports Templates - Changes Related to Footer Text (Hardcoded Strings)**
##### SiteCore Changes:

###### Updated/Added the footer left section content of all sports

| Key | Value |
| ------ | ------ |
| LeftStipulatedLine | ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION |

***Created and Updated the below content editor files:***
```
- /sitecore/content/Gantry/GantryWeb/TennisContent/TennisCDS
- /sitecore/content/Gantry/GantryWeb/CricketContent/CricketCDS
- /sitecore/content/Gantry/GantryWeb/FootBallContent/FootballCDS
- /sitecore/content/Gantry/GantryWeb/BoxingContent/BoxingCDS
- /sitecore/content/Gantry/GantryWeb/RugbyContent/RugbyCDS
- /sitecore/content/Gantry/GantryWeb/SnookerContent/SnookerCDS
- /sitecore/content/Gantry/GantryWeb/DartContent/DartCDS
- /sitecore/content/Gantry/GantryWeb/Formula1Content/Formula1CDS
- /sitecore/content/Gantry/GantryWeb/NFLContent/NFLCDS
- /sitecore/content/Gantry/GantryWeb/FootBallContent/MultiMarket/Football
- /sitecore/content/Gantry/GantryWeb/FootBallContent/MultiMarket/FootballCDS
```

***

Dyncon added new CDS Formula1 Templat Id

```
"CdsFormula1": {
    "RaceWinner": "2091",
    "FastestLap": "216",
    "PodiumFinish": "3266",
    "PointsFinish": "24520"
}
```

***

**[DTP-22519](https://jira.corp.entaingroup.com/browse/DTP-22519) - DF SSE Endpoint Authentication**

##### Dyncon Changes:

> Gantry.DataFeedAuthentication

`Gantry.DataFeedAuthentication > AuthenticationKey`

Added api-keys as per [RET-1821](https://jira.corp.entaingroup.com/browse/RET-1821) for both environments and both labels/brands

***

**[DTP-18177](https://jira.corp.entaingroup.com/browse/DTP-18177) - 3 Sports Template Descoped From Tech-Trial: NFL Event Template**

##### SiteCore Changes:
```
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/TradingTemplates/American Football/MatchResult
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/Coral/SportsTypes/AmericanFootball
- /sitecore/content/Gantry/DisplayManager/DisplayLeftPanel/Ladbrokes/SportsTypes/AmericanFootball
- /sitecore/content/Gantry/GantryWeb/Links/AmericanFootball/TradingNflUrl
- /sitecore/content/Gantry/GantryWeb/NFLContent/NFL   -- add only key values listed below
```

| Key | Value |
| ------ | ------ |
| TotalPoints | TOTAL POINTS |

***

**[DTP-19956](https://jira.corp.entaingroup.com/browse/DTP-19956) - Lads/Coral - AVR Motor Racing - Create Preamble and Results Page**

##### Dyncon Changes:
###### Dyncon added new CDS Avr motor racing configurations

> Gantry.VirtualRaceSilkImages

Updates happened in below features
`Gantry.VirtualRaceSilkImages > MotorImageUrl`
`Gantry.VirtualRaceSilkImages > VirtualSilksMappingBasedOnMeetingNames`

coral.co.uk
```json
{
    "MotorImageUrl": "ROCKINGHAM"
}
```
ladbrokes.com
```json
{
    "MotorImageUrl": "ARLINGTON OVAL"
}
```

> Gantry.AvrPage

Updates happened in below features
`Gantry.AvrPage > MotorCountdownToOffTime`
`Gantry.AvrPage > MotorDelayTime`
`Gantry.AvrPage > MotorPreambleTime`
`Gantry.AvrPage > MotorResultTime`
`Gantry.AvrPage > MotorVideoTime`
`Gantry.AvrPage > AvrPageTimingsBasedOnControllerId`

```json
   MotorCountdownToOffTime: "98"
   MotorDelayTime: "0"
   MotorPreambleTime: "101"
   MotorResultTime: "10"
   MotorVideoTime: "74"
```

##### SiteCore Changes:

```
- /sitecore/content/Gantry/GantryWeb/AvrContent/AvrBackgroundImage_Motor
- /sitecore/media library/Vanilla.Mobile/Gantry/AVR/BackgroundImages/MotorRace
```

***

**[DTP-23441](https://jira.corp.entaingroup.com/browse/DTP-23441) - Consume CDS Service to Convert to Gantry POCO Object - Snooker**

###### Added template id in dynacon

> Gantry.

```
"CdsCricket": {
    "MatchBetting": "7817",
    "SuperOver": "17951",
    "TopHomeRunscorer": "2449",
    "TopAwayRunscorer": "2450",
    "TotalMatchSixes": "17984",
    "3WayMatchBetting": "11755",
    "ToScore100in1stInns": "37505"
},

"CdsSnooker": {
    "MatchBetting": "11893",
    "MatchBetting3Way": "7042",
    "CorrectScore": "5678",
    "MatchHandicap": "11718",
    "1StFrameWinner": "8015"
},

"CdsRugby": {
    "MatchBetting": "3153, 3191",
    "HandicapBetting": "3212, 7383",
    "1stHandicapBetting": "7380,7382",
    "HalfTimeFullTime": "12532,12531",
    "TotalMatchPoints": "5819,7259"
},
```

***
**[DTP-14038](https://jira.corp.entaingroup.com/browse/DTP-14038) - Consume CDS Service to Convert to Gantry POCO Object - Darts**

###### Added template ids in dynacon

> Gantry.

```
"CdsDarts": {
         "MatchBetting": "6367",
         "MatchBetting3Way": "7111",
         "MatchHandicap": "5034",
+        "LegHandicap": "11710",
         "Most180S": "6057",
         "SelectedCorrectScores": "33569"
     }
```

***
### Gantry RB-1.15 [Not released yet]

**[RET-5530](https://jira.corp.entaingroup.com/browse/RET-5530) - Regression : Brand logo is showing only half of the screen not full screen on Duo Mode**

***

**[DTP-25499](https://jira.corp.entaingroup.com/browse/DTP-25499) - Use Brand Logo Images with Respective Brand Color as Background to Show on Error**

##### Dyncon Changes:

> Gantry.ErrorPageConfig

`Gantry.ErrorPageConfig > BrandImagePathInElectron`

###### Update Brand Logo image paths
```
Value: file:///opt/rdisp-device-electron/resources/app.asar/dist/assets/Coral_logo.svg, Label: coral.co.uk, Environment: Any

Value: file:///opt/rdisp-device-electron/resources/app.asar/dist/assets/Ladbrokes_logo.svg, Label: ladbrokes.com, Environment: Any
```

***

**[DTP-17927](https://jira.corp.entaingroup.com/browse/DTP-17927) - [TT] [RET-3950] [CMS-GantryWeb] [INT] EVR US - Style Virtuals Silks**

##### Dyncon Changes:

> Gantry.AvrImages

`Gantry.AvrImages > VirtualSilksMappingBasedOnMeetingNames`
```
Coral:
{
    "EvrUsImageUrl": "ROUTE 66 PARK",
}
ladbrokes.com:
{
    "EvrUsImageUrl": "EMPIRE STATE PARK,STATESIDE SPEEDWAY",
}
```

> Gantry.VirtualRaceSilkImages

`Gantry.VirtualRaceSilkImages > EvrUsImageUrl`
```
coral.co.uk: https://silks.coral.co.uk/VR/images/EVR/USA/horses/<selectionNumber>.png
ladbrokes.com: https://silks.ladbrokes.com/VR/images/EVR/USA/horses/<selectionNumber>.png
```
***
