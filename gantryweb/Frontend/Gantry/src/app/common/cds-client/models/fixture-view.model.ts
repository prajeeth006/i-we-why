export interface FixtureView {
  fixture: Fixture
  splitFixtures: any[]
  groupingVersion: string
}

export interface Fixture {
  optionMarkets: any[]
  games: Game[]
  participants: Participant[]
  id: string
  name: Name
  sourceId: number
  source: string
  fixtureType: string
  context: string
  addons?: Addons
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
  tournament?: Tournament
  viewType: string
  isOpenForBetting: boolean
  isVirtual: boolean
  taggedLocations: any[]
  totalMarketsCount: number
  conferences: any[]
  marketGroups: MarketGroups
  priceBoostCount: number
  linkedTv1EventIds: any[]
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
  grouping?: Grouping
  balanced?: number
  spread?: number
  attr?: string
  description?: string
  isMatchBetting?: boolean
  isTestMatchBetting?: boolean
  isSuperOverBetting?: boolean
  isSetBetting?: boolean
  isHomeTopRunscorer?: boolean
  isAwayTopRunscorer?: boolean
  isTotalSixes?: boolean
  isTopScore100?: boolean
  player1?: Player1
  isTotalFrames?: boolean
  isMatchHandicap?: boolean
  isFrameBetting?: boolean
  isFirstMatchHandicap?: boolean
  isHalfFullBetting?: boolean
}

export interface Name {
  value: string
  sign: string
  home?: string
  away?: string
}

export interface Player1 {
  short: string
  value: string
  sign: string
}

export interface Result {
  id: number
  odds: number
  name: Name
  sourceName?: Name
  visibility: string
  numerator?: number
  denominator?: number
  americanOdds?: number
  attr?: string
  totalsPrefix?: string
  playerId?: number
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
  group?: number
  index?: number
  displayType: string
  marketGroupId: string
  marketGroupItemId: string
  subIndex?: number
}

export interface Participant {
  participantId: number
  name: Name4
  image?: Image
  options: any[]
}

export interface Name4 {
  value: string
  sign: string
  short: string
  shortSign: string
}

export interface Image {
  jersey: string
  rotateJersey: boolean
  isParticipantProfile: boolean
}



export interface Addons {
  betRadar: number
  statistics: boolean
  videoStream: VideoStream
  participantDividend: ParticipantDividend
  surface: string
}

export interface VideoStream {
  provider: string
  status: string
  providerStreamId: string
}

export interface ParticipantDividend { }

export interface Scoreboard {
  sportId: number
  period: string
  periodId: number
  sets: string[][]
  setsValues: SetsValues
  points: string[]
  turn: string
  started: boolean
}

export interface SetsValues {
  player1: string[]
  player2: string[]
}

export interface Sport {
  type: string
  id: number
  name: Name
}



export interface Competition {
  parentLeagueId: number
  parentTournamentId?: number
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



export interface Tournament {
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
