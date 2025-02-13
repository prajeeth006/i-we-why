using System.Collections.Generic;

namespace GantryTradingConnector.Shared.Models
{
    public class FixtureV9Response : BaseResponse
    {
        public FixtureV9Data  FixtureV9Data { get; set; }
    }

    public class FixtureV9Data
    {
        public string Id { get; set; }
        public List<FixtureTag> Tags { get; set; }
        public PropertyBagDividends PropertyBag { get; set; }
        public Dictionary<string, string> Name { get; set; }
        public string StartDate { get; set; }
        public string CutOffDate { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public Dictionary<string, FixtureParticipant> Participants { get; set; }
        public Dictionary<string, FixtureParticipantOptions> ParticipantOptions { get; set; }
        public Dictionary<string, OptionMarkets> OptionMarkets { get; set; }
        public Dictionary<string, FixtureOptions> Options { get; set; }
        public ExternalMapping ExternalMappings { get; set; }
        public string GameState { get; set; }
        public bool IsInPlay { get; set; }
        public bool IsOpenForBetting { get; set; }
        public bool IsPlannedInPlay { get; set; }
        public bool IsVirtual { get; set; }
        public string FixtureVisibilityStatus { get; set; }
        public string FixtureTradingStatus { get; set; }
        public string TradingVisibility { get; set; }
    }

    public class FixtureTag
    {
        public string Type { get; set; }
        public int Value { get; set; }
        public Dictionary<string, string> Name { get; set; }
        public Dictionary<string, string> PorpertyBag { get; set; }
    }

    public class FixtureParticipant
    {
        public string Id { get; set; }
        public string ParticipantId { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public Dictionary<string, string> PropertyBag { get; set; }
        public Dictionary<string, string> Name { get; set; }
    }
    public class FixtureParticipantOptions
    {
        public string Id { get; set; }
        public string MarketId { get; set; }
        public string FixtureParticipantId { get; set; }
        public string PriceType { get; set; }
        public string ParticipantPriceStatus { get; set; }
        public string MarketType { get; set; }
        public string MarketStatus { get; set; }
        public string TradingMarketVisibility { get; set; }
        public string TradingPriceVisibility { get; set; }

    }

    public class ExternalMapping
    {
        public string Inspired { get; set; }
    }

    public class FixtureOptions
    {
        public string Id { get; set; }
        public Dictionary<string, string> Name { get; set; }
        public string Status { get; set; }
        public string ResultStatus { get; set; }
        public double Probability { get; set; }
        public object PropertyBag { get; set; }
        public string MarketId { get; set; }
        public int SortOrder { get; set; }
        public bool IsDisplayed { get; set; }
        public bool IsOpenForBetting { get; set; }
    }

    public class OptionMarkets
    {
        public string Id { get; set; }
        public List<FixtureParameter> Parameters { get; set; }
        public PropertyBagOption PropertyBag { get; set; }
        public Dictionary<string, string> Name { get; set; }
        public string Status { get; set; }
        public bool IsDisplayed { get; set; }
        public bool IsOpenForBetting { get; set; }
        public bool IsSettled { get; set; }
        public string Specials { get; set; }
        public bool IsEachWayAvailable { get; set; }
        public bool IsEachWayEnabled { get; set; }

    }
   
    public class PropertyBagOption
    {
        public double DeadHeatDivisor { get; set; }
    }
  
    public class FixtureParameter
    {
        public string Key { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class PropertyBagDividends
    {
        public bool IsResulted { get; set; }
        public bool IsEarlyCashoutDisabled { get; set; }
        public object[] RacingDividends { get; set; }
    }
}
