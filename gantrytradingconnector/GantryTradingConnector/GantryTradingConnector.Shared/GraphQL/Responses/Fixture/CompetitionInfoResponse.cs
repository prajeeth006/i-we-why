using System.Runtime.Serialization;
using GantryTradingConnector.Shared.Models;

namespace GantryTradingConnector.Shared.Contracts.Responses.Fixture
{
    
    public class CompetitionInfoResponse : BaseResponse
    {
        public CompetitionInfo Competitions { get; set; }
        public CompetitionInfo ExcludedCompetitions { get; set; }

        public CompetitionInfoResponse()
        {
            Competitions = new CompetitionInfo();
        }

    }

    [DataContract]
    public class CompetitionInfo
    {
        [DataMember]
        public List<CompetitionResponse> Competitions { get; set; }

        [DataMember]
        public PageInfoResponse PageInfo { get; set; }

        [DataMember]
        public int TotalCount { get; set; }

    }
}
