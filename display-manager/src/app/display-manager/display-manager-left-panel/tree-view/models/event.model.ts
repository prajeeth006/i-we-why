export class Event {
  id: string;
  typeName?: string;
  name: string;
  markets?: Array<Market>;
  marketsWhichAreDropped?: string;
  typeId?: number;
  className?: string;
  categoryCode?: string;
  isStandardTemplatesLoaded?: boolean;
  isExpandable?: boolean;
  virtual?: boolean;
  startTime?: string;
  eventName?: string;
  tabName?: string;
  targetLink?: string;
  isMeetingPages?: boolean;
  meetingPageRelativePath?: string;
  eventSortCode?: string;
  omniaUrl?: string;
  version?: string;
  sportType?: string;
  sportId?: string;
  regionId?: string;
  competitionId?: string;
  fixtureId?: string;
  isBothVersionsForOutright?: boolean
  tradingLabelId?: string;
  first?: number;
  sortField?: string;
  sortType?: number;
  isLive?: boolean;
  fixtureType?: string;
  isInPlay?: boolean;
  contentMediaType?: string;
  multiEventfixtureType?: string;
  isPreAndInPlayRequired?: boolean;
  tradingPartitionId?: number;
  hasRegion?: boolean;
  language?: string;
  skipMarketFilter?: boolean;
  assetType?: string;
  racingAssetType?: string;
  assetTypeAliasName?: string;
  assetsPath?: string;
  isAutoExpand?: boolean;
  splitScreen?: SplitScreen;
  contentProvider?: string;
  isResulted?: boolean;
  isSettled?: boolean;
  isFixtureV2Enabled?: boolean;
  constructor({
    id,
    typeName,
    name,
    markets,
    marketsWhichAreDropped,
    typeId,
    className,
    categoryCode,
    isStandardTemplatesLoaded,
    isExpandable,
    virtual,
    startTime,
    eventName,
    tabName,
    targetLink,
    isMeetingPages,
    meetingPageRelativePath,
    eventSortCode,
    version,
    sportType,
    sportId,
    regionId,
    competitionId,
    fixtureId,
    isBothVersionsForOutright,
    tradingLabelId,
    first,
    sortField,
    sortType,
    isLive,
    fixtureType,
    isInPlay,
    contentMediaType,
    multiEventfixtureType,
    isPreAndInPlayRequired,
    tradingPartitionId,
    hasRegion,
    language,
    skipMarketFilter,
    assetType,
    assetTypeAliasName,
    assetsPath,
    isAutoExpand,
    splitScreen,
    contentProvider,
    isResulted,
    isSettled,
    isFixtureV2Enabled
  }: {
    id: string,
    typeName?: string,
    name: string,
    markets?: Array<Market>,
    marketsWhichAreDropped?: string,
    typeId?: number,
    className?: string,
    categoryCode?: string,
    isStandardTemplatesLoaded?: boolean,
    isExpandable?: boolean,
    virtual?: boolean,
    startTime?: string,
    eventName?: string,
    tabName?: string,
    targetLink?: string,
    isMeetingPages?: boolean,
    meetingPageRelativePath?: string,
    eventSortCode?: string,
    version?: string,
    sportType?: string,
    sportId?: string;
    regionId?: string;
    competitionId?: string;
    fixtureId?: string;
    isBothVersionsForOutright?: boolean,
    tradingLabelId?: string,
    first?: number,
    sortField?: string,
    sortType?: number,
    isLive?: boolean,
    fixtureType?: string,
    isInPlay?: boolean,
    contentMediaType?: string;
    multiEventfixtureType?: string;
    isPreAndInPlayRequired?: boolean;
    tradingPartitionId?: number;
    hasRegion?: boolean;
    language?: string;
    skipMarketFilter?: boolean;
    assetType?: string,
    assetTypeAliasName?: string,
    assetsPath?: string,
    isAutoExpand?: boolean;
    splitScreen?: SplitScreen;
    contentProvider?: string;
    isResulted?: boolean;
    isSettled?: boolean;
    isFixtureV2Enabled?: boolean
  }) {
    this.id = id;
    this.typeName = typeName;
    this.name = name;
    this.markets = markets;
    this.marketsWhichAreDropped = marketsWhichAreDropped;
    this.typeId = typeId;
    this.className = className;
    this.categoryCode = categoryCode;
    this.isStandardTemplatesLoaded = isStandardTemplatesLoaded;
    this.isExpandable = isExpandable;
    this.virtual = virtual;
    this.startTime = startTime;
    this.eventName = eventName;
    this.tabName = tabName;
    this.targetLink = targetLink;
    this.isMeetingPages = isMeetingPages;
    this.meetingPageRelativePath = meetingPageRelativePath;
    this.eventSortCode = eventSortCode;
    this.version = version;
    this.sportType = sportType;
    this.sportId = sportId;
    this.regionId = regionId;
    this.competitionId = competitionId;
    this.fixtureId = fixtureId;
    this.isBothVersionsForOutright = isBothVersionsForOutright;
    this.tradingLabelId = tradingLabelId;
    this.first = first;
    this.sortField = sortField;
    this.sortType = sortType;
    this.isLive = isLive;
    this.fixtureType = fixtureType;
    this.isInPlay = isInPlay;
    this.contentMediaType = contentMediaType;
    this.multiEventfixtureType = multiEventfixtureType;
    this.isPreAndInPlayRequired = isPreAndInPlayRequired;
    this.tradingPartitionId = tradingPartitionId;
    this.hasRegion = hasRegion;
    this.language = language;
    this.skipMarketFilter = skipMarketFilter;
    this.assetType = assetType;
    this.assetTypeAliasName = assetTypeAliasName;
    this.assetsPath = assetsPath;
    this.isAutoExpand = isAutoExpand;
    this.splitScreen = splitScreen;
    this.contentProvider = contentProvider;
    this.isResulted = isResulted;
    this.isSettled = isSettled;
    this.isFixtureV2Enabled = isFixtureV2Enabled;
  }
}

export class Market {

  constructor(public name: string,
    public id: string) {
  }
}

export class RacingEvents {
  constructor(public content: Array<Event>) { }
}
export class SplitScreen {
  splitScreenStartRange?: number;
  splitScreenEndRange?: number;
  splitScreenPageNo?: number;
  splitScreenTotalPages?: number;
  displayAssetNameOnScreenWhenDragged?: string;
}
