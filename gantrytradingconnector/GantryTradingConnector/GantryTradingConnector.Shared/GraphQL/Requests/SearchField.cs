using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public enum SearchField
    {
        [EnumMember]
        NAME = 1,

        [EnumMember]
        SPORT_NAME = 2,

        [EnumMember]
        REGION_NAME = 3,

        [EnumMember]
        COMPETITION_NAME = 4,

        [EnumMember]
        MEETING_NAME = 5,

        [EnumMember]
        PARTICIPANT = 6
    }
}
