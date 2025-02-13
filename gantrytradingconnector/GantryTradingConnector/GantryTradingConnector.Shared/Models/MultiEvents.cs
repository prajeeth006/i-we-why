namespace GantryTradingConnector.Shared.Models
{
    public class MultiEventParams
    {
        public int SportId { get; set; }
        public int RegionId { get; set; }
        public int CompetitionId { get; set; }
    }

    public class MultiEventRequest
    {
        public IList<MultiEventParams> MultiEventParams { get; set; }

        public int Version { get; set; }

        public string Markets { get; set; }
        public string TemplateIds { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int? LabelId { get; set; }

        public int? First { get; set; } = 10000;
        public bool? IsInPlay { get; set; }
        public string? FixtureType { get; set; }

        public MultiEventRequest()
        {
            MultiEventParams = new List<MultiEventParams>();
            Markets = "";
            TemplateIds = "";
        }
    }
}
