using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions
{
    public class RegionConnection : SearchConnection
    {
        public RegionEdge[] Edges { get; set; }
    }
}
