using System;
using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.Contracts.Responses.Fixture
{
    [DataContract]
    public class FixtureResponse : Entity<string>
    {
        [DataMember]
        public DateTime EndDate { get; set; }

        [DataMember]
        public DateTime StartDate { get; set; }

        [DataMember]
        public bool IsInPlay { get; set; }

        [DataMember]
        public CompetitionResponse Competition { get; set; }

        [DataMember]
        public MeetingResponse Meeting { get; set; }

        [DataMember]
        public RegionResponse Region { get; set; }

        [DataMember]
        public SportResponse Sport { get; set; }

        [DataMember]
        public long[] BetBuilderMarkets { get; set; }

        [DataMember]
        public bool IsBetbuilder { get; set; }

        [DataMember]
        public int? EventId { get; set; }
        [DataMember]
        public string? FixtureType { get; set; }

        [DataMember]
        public int? TradingPartitionId { get; set; }
        
    }

    public class FixtureWithoutRegionResponse : Entity<string>
    {
        [DataMember]
        public DateTime EndDate { get; set; }

        [DataMember]
        public DateTime StartDate { get; set; }

        [DataMember]
        public bool IsInPlay { get; set; }

        [DataMember]
        public CompetitionResponse Competition { get; set; }

        [DataMember]
        public MeetingResponse Meeting { get; set; }

        [DataMember]
        public SportResponse Sport { get; set; }

        [DataMember]
        public long[] BetBuilderMarkets { get; set; }

        [DataMember]
        public bool IsBetbuilder { get; set; }

        [DataMember]
        public int? EventId { get; set; }
        
        [DataMember]
        public string? FixtureType { get; set; }

        [DataMember]
        public int? TradingPartitionId { get; set; }

    }
}
