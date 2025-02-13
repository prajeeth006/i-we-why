namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    public class MarketIndex
    {
        public MarketIndex()
        {

        }

        public long Id { get; set; }
        public bool Promoted { get; set; }
        public string AmbassadorKey { get; set; }
        public string FixtureId { get; set; }
        public int? EventId { get; set; }
        public string ThemedTab { get; set; }
        public bool VisibleOnBetBuilderTab { get; set; }
    }
}
