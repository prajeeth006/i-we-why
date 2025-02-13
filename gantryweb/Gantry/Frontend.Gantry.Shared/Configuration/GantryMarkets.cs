using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{

    public interface IGantryMarkets
    {
        public Dictionary<string, Dictionary<string,  string>> MarketsNames { get;  }
    }

    public class GantryMarkets : IGantryMarkets
    {
        public Dictionary<string, Dictionary<string, string>> MarketsNames { get; set; }
    }



    public class Markets
    {
        public  string sport { get; set; }
        public  IList<MarketName> markets { get; set; }
    }

    public class MarketName
    {
        public  string name { get; set; }
        public  string[]? matches { get; set; }

    }
}