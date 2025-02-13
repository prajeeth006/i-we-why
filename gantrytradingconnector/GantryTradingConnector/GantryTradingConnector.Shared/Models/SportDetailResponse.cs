using System.Collections.Generic;

namespace GantryTradingConnector.Shared.Models
{
    public class SportDetailResponse:BaseResponse
    {
        public List<SportDetail> SportDetails { get; set; }

    }

    public class SportDetail
    {
        public int Id { get; set; }
        public SportsName Name { get; set; }
    }

    public class SportsName
    {
        public string StringId { get; set; }

        public string Language { get; set; }

        public string Value { get; set; }

        public string ValueShort { get; set; }
    }
}
