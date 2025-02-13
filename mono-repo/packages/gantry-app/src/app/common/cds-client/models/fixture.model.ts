export class Fixtures {
    fixtures: Fixture[];
    totalCount: number;
    totalSports: number;
    totalRegions: number;
    totalCompetitions: number;
}

export class Fixture {
    hybridFixtureData?: HybridFixture[];
    optionMarkets: any[] = [];
    games: Game[];
    participants?: Participant[];
    id: string;
    name: Name;
    sourceId: number;
    source: string;
    fixtureType: string;
    context: string;
    addons: Addons;
    stage: string;
    groupId?: number;
    liveType: string;
    liveAlert: boolean;
    scoreboard?: Scoreboard;
    startDate: string;
    cutOffDate: string;
    sport: Sport;
    competition: Competition;
    region: Region;
    viewType: string;
    isOpenForBetting: boolean;
    isVirtual: boolean;
    taggedLocations: any[];
    totalMarketsCount: number;
    conferences: any[];
    marketGroups: MarketGroups;
    priceBoostCount?: number;
    linkedTv1EventIds?: any[];
    tournament?: Tournament;
    fixtureGroup?: any;
    contexts?: any[];
    playerStats?: any[];
}
export class Tournament {
    type: string;
    id: number;
    parentId: number;
    name: Name;
}
export class Name {
    value: string;
    sign: string;
    home?: string;
    away?: string;
}

export class Game {
    id: number;
    name: Name;
    results: Result[];
    templateId: number;
    categoryId: number;
    resultOrder: string;
    combo1: string;
    combo2: string;
    visibility: string;
    category: string;
    templateCategory: TemplateCategory;
    isMain: boolean;
    grouping: Grouping;
    isMatchBetting?: boolean;
    isSetBetting?: boolean;
    isHomeTopRunscorer?: boolean;
    isAwayTopRunscorer?: boolean;
    isTotalSixes?: boolean;
    isTopScore100?: boolean;
    isTestMatchBetting?: boolean;
    isSuperOverBetting?: boolean;
    player1?: Player1;
    matchSetBettingId?: number;
    isFrameBetting?: boolean;
    isTotalFrames?: boolean;
    isMatchHandicap?: boolean;
    isFirstMatchHandicap?: boolean;
    isHalfFullBetting?: boolean;
    balanced?: number;
    attr?: string;
    spread?: number;
    isBetBuilder?: boolean;
}
export class Result {
    id: number;
    odds: number;
    name: Name;
    visibility: string;
    numerator: number;
    denominator: number;
    americanOdds: number;
    sourceName?: Name;
    playerId?: number;
    totalsPrefix?: string;
    attr?: string;
}

export class TemplateCategory {
    id: number;
    name: Name;
    category: string;
    dynamicCategories?: any[];
}

export class Grouping {
    gridGroups: string[];
    detailed: Detailed[];
}

export class Detailed {
    displayType: string;
    marketGroupId: string;
    marketGroupItemId?: string;
    group?: number;
    index?: number;
    subIndex?: number;

    orderType?: string;
}

export class Participant {
    id?: number;
    participantId: number;
    name: Name4;
    image?: Image;
    options: any[];
    properties?: Properties;
    source?: string;
    status?: string;
}

export class Properties {
    team?: number;
    type: string;
}

export class Name4 {
    value: string;
    sign: string;
    short?: string;
    shortSign?: string;
}

export class Image {
    jersey?: string;
    rotateJersey: boolean;
    isParticipantProfile: boolean;
}

export class Addons {
    isResulted?: boolean;
    participantDividend: ParticipantDividend;
    betBuilderProvider?: string;
}

export class ParticipantDividend {}

export class Scoreboard {
    runs: number;
    balls: number;
    overs: number;
    wickets: number;
    statistics: any;
    sportId: number;
    period: string;
    periodId: number;
    points: any[];
    turn: string;
    started: boolean;
}

export class Sport {
    type: string;
    isEsport?: boolean;
    id: number;
    name: Name6;
}

export class Name6 {
    value: string;
    sign: string;
}

export class Competition {
    parentLeagueId?: number;
    statistics: boolean;
    sportId: number;
    compoundId: string;
    type: string;
    id: number;
    parentId: number;
    name: Name;
}

export class Region {
    code: string;
    sportId: number;
    type: string;
    id: number;
    parentId: number;
    name: Name;
}

export class MarketGroups {
    outrightMarketGroupIds: any[];
    specialMarketGroupIds: any[];
    type: string;
    id: number;
}
export class Player1 {
    short: string;
    value: string;
    sign: string;
}
export class HybridFixture {
    fixtureId?: string;
    competitionId?: string;
    regionId?: number;
    status?: string;
}

export class EventDateTime {
    eventDateTime: Date;
}
