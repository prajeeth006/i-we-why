import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class CricketCdsSitecoreContent {
    content: SportContentParameters = {
        contentParameters: {
            AdditionalInfo: '{0}',
            Cricket: 'CRICKET',
            FirstInningsLead: 'FIRST INNINGS LEAD',
            ManOfTheMatch: 'MAN OF THE MATCH',
            MatchBetting: 'MATCH BETTING',
            MoreMarkets: 'MORE MARKETS AVAILABLE ON BETSTATION',
            OnRequest: 'OTHERS ON REQUEST',
            OptionalInfo: 'OPTIONAL ADDITIONAL INFORMATION',
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
            TopFirstInningsRunScorer: 'TOP 1ST INNINGS RUNSCORER',
            TopRunScorer: 'TOP TEAM RUNSCORER',
            ToScore100in1stInning: 'PLAYER TO SCORE 1ST INNINGS 100',
            TotalSixes: 'TOTAL SIXES',
            ToWinTheToss: 'TO WIN THE TOSS',
            TwentyOneNumber: '21',
            Vs: 'V',
            DRAW: 'DRAW',
            SuperOver: 'MATCH BETTING',
            LeftStipulatedLine: 'ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION',
            BetStationPricesFluctuation: 'BetStation prices - subject to change',
            NewDesignTopRunScorerLimitODI: '4',
            NewDesignTopRunScorerLimitTest: '6',
            Abbreviations: 'odi,icc',
            CricketParameters:
                '[{\n    "Match Betting (incl. super over)": {\n        "MarketType": "2way",\n        "Happening": "Run",\n        "Period": "SuperOver",\n        "DecimalValue": "",\n        "Places": "",\n        "Position": "",\n        "FixtureParticipant": "",\n        "PeriodNumber":""\n    },\n    "Total Match Sixes": {\n        "MarketType": "Over/Under",\n        "Happening": "Six",\n        "Period": "FullTime",\n        "DecimalValue": "DECIMAL_VALUE",\n        "Places": "",\n        "Position": "",\n        "FixtureParticipant": "",\n        "PeriodNumber":""\n    },\n    "Top Home Batter": {\n        "MarketType": "TopScorer",\n        "Happening": "Run",\n        "Period": "FullTime",\n        "DecimalValue": "",\n        "Places": "1",\n        "Position": "First",\n        "FixtureParticipant": "HomeTeam",\n        "PeriodNumber":""\n    },\n    "Top Away Batter": {\n        "MarketType": "TopScorer",\n        "Happening": "Run",\n        "Period": "FullTime",\n        "DecimalValue": "",\n        "Places": "1",\n        "Position": "First",\n        "FixtureParticipant": "AwayTeam",\n        "PeriodNumber":""\n    },\n    "Test Match Betting": {\n        "MarketType": "3way",\n        "Happening": "Run",\n        "Period": "FullTime",\n        "DecimalValue": "",\n        "Places": "",\n        "Position": "",\n        "FixtureParticipant": "",\n        "PeriodNumber":""\n    },\n    "Test Match Top Home Batter": {\n        "MarketType": "TopScorer",\n        "Happening": "Run",\n        "Period": "Innings",\n        "DecimalValue": "",\n        "Places": "1",\n        "Position": "First",\n        "FixtureParticipant": "HomeTeam",\n        "PeriodNumber":"1"\n    },\n    "Test Match Top Away Batter": {\n        "MarketType": "TopScorer",\n        "Happening": "Run",\n        "Period": "Innings",\n        "DecimalValue": "",\n        "Places": "1",\n        "Position": "First",\n        "FixtureParticipant": "AwayTeam",\n        "PeriodNumber":"1"\n    }\n}]',
            TwoWay: '2way',
            ThreeWay: '3way',
            OptionTypes: '{\n    "Over" :  "Over",\n    "Under" : "Under"\n}',
            Participants: '{\n    "HomeTeam" : "HomeTeam",\n    "AwayTeam" : "AwayTeam"\n}',
        },
        cricketWhiteImage: {
            src: 'https://dev.coralracingclub.coral.co.uk/-/media/Vanilla,-d-,Mobile/Gantry/SportsLogos/CricketWhiteImage.png?rev=b0b156d0ce29407db1c8b8da7e866a39',
            alt: 'coral.co.uk_boxing_image',
            width: 124,
            height: 124,
        },
        cricketRedImage: {
            src: 'https://dev.coralracingclub.coral.co.uk/-/media/Vanilla,-d-,Mobile/Gantry/SportsLogos/CricketRedImage.png?rev=5b6670bfe2564377899558340d78dc54',
            alt: 'coral.co.uk_boxing_image',
            width: 124,
            height: 124,
        },
    };
}
