using System;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class Fixture
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string CompetitionName { get; set; }

        public int? CompetitionId { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime StartDate { get; set; }

        public int? MeetingId { get; set; }

        public int SportId { get; set; }

        public int? RegionId { get; set; }

        public string RegionName { get; set; }

        public string MeetingName { get; set; }

        public string SportName { get; set; }

        public bool IsInPlay { get; set; }

        public bool IsPlannedInPlay { get; set; }

        public string FixtureType { get; set; }

        public int? TradingPartitionId { get; set; }
    }
}
