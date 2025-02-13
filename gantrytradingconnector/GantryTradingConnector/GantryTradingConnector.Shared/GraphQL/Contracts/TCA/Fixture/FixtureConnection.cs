using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class FixtureConnection:SearchConnection
    {
        public FixtureEdge[] Edges { get; set; }
    }
}
