using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public enum SortTypes
    {
        [EnumMember]
        DESC = 0,

        [EnumMember]
        ASC = 1
    }
}
