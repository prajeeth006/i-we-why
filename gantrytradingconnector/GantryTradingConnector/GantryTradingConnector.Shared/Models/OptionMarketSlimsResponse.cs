using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models
{
    public class OptionMarketSlimsResponse:BaseResponse
    {
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public List<OptionMarketSlims> OptionMarketSlims { get; set; }
    }

    public class OptionMarketSlims
    {
        public string Id { get; set; }
        public CutOffDate CutOffDate { get; set; }
        public string TemplateId { get; set; }
        public string State { get; set; }
        public string PayoutStatus { get; set; }
        public string NameId { get; set; }
        public List<OptionsMarket> Options { get; set; }
        public string FixtureId { get; set; }
        public string FixtureGroupId { get; set; }
        public string LeagueId { get; set; }
        public string ParentLeagueId { get; set; }  
    }

    public class CutOffDate
    {
        public string DateTime { get; set; }
        public string OffsetMinutes { get; set; }
    }

    public class OptionsMarket
    {
        public string Id { get; set; }
        public string FixtureId { get; set; }
        public string MarketId { get; set; }
        public string NameId { get; set; }
        public string TemplateId { get; set; }
    }
}
