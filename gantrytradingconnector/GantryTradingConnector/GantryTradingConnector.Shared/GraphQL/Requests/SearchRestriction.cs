using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public enum SearchRestriction
    {
        [EnumMember]
        None = 0,

        [EnumMember]
        BetBuilder = 1
    }
}
