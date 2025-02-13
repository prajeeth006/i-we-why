export interface Fixtures {
  fixtures: Fixture[]
  totalCount: number
  totalSports: number
  totalRegions: number
  totalCompetitions: number
}

export interface Fixture {
  optionMarkets?: any[]
  games: Game[]
  participants?: Participant[]
  id: string
  name: Name
  sourceId: number
  source: string
  fixtureType: string
  context: string
  addons: Addons
  stage: string
  groupId?: number
  liveType: string
  liveAlert: boolean
  scoreboard?: Scoreboard
  startDate: string
  cutOffDate: string
  sport: Sport
  competition: Competition
  region: Region
  viewType: string
  isOpenForBetting: boolean
  isVirtual: boolean
  taggedLocations: any[]
  totalMarketsCount: number
  conferences: any[]
  marketGroups: MarketGroups
  priceBoostCount?: number
  linkedTv1EventIds?: any[]
  tournament?: Tournament
}
export interface Tournament {
    type: string
    id: number
    parentId: number
    name: Name
}
export interface Name {
    value: string
    sign: string
}

export interface Game {
  id: number
  name: Name
  results: Result[]
  templateId: number
  categoryId: number
  resultOrder: string
  combo1: string
  combo2: string
  visibility: string
  category: string
  templateCategory: TemplateCategory
  isMain: boolean
  grouping: Grouping
}

export interface Name {
  value: string
  sign: string
}

export interface Result {
  id: number
  odds: number
  name: Name
  visibility: string
  numerator: number
  denominator: number
  americanOdds: number
  sourceName?: Name
}



export interface TemplateCategory {
  id: number
  name: Name
  category: string
}



export interface Grouping {
  gridGroups: string[]
  detailed: Detailed[]
}

export interface Detailed {
  displayType: string
  marketGroupId: string
  marketGroupItemId: string
}

export interface Participant {
  participantId: number
  name: Name
  image: Image
  options: any[]
}


export interface Image {
  jersey: string
  rotateJersey: boolean
  isParticipantProfile: boolean
}



export interface Addons {
  participantDividend: ParticipantDividend
}

export interface ParticipantDividend { }

export interface Scoreboard {
  runs: number
  balls: number
  overs: number
  wickets: number
  statistics: any
  sportId: number
  period: string
  periodId: number
  points: any[]
  turn: string
  started: boolean
}




export interface Sport {
  type: string
  id: number
  name: Name6
}

export interface Name6 {
  value: string
  sign: string
}

export interface Competition {
  parentLeagueId: number
  statistics: boolean
  sportId: number
  compoundId: string
  type: string
  id: number
  parentId: number
  name: Name
}


export interface Region {
  code: string
  sportId: number
  type: string
  id: number
  parentId: number
  name: Name
}



export interface MarketGroups {
  outrightMarketGroupIds: any[]
  specialMarketGroupIds: any[]
  type: string
  id: number
}
