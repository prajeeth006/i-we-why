import { SportContentParameters } from '../../../../../common/models/sport-content/sport-content-parameters.model';

export class FootBallDataContent extends SportContentParameters {}

export class FootballContent {
    content: FootBallDataContent;
}

export enum SelectionName {
    NO = 'NO',
}

export enum Participants {
    HomeTeam = 'HomeTeam',
    AwayTeam = 'AwayTeam',
    BothTeamtoScore = 'to win and both teams to score',
}

export enum SelectionsStatus {
    Suspended = 'Suspended',
}
