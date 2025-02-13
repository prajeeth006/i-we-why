using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryCricketPageCountries
    {
        public Dictionary<string, string> Countries { get; }
    }

    public class GantryCricketPageCountries : IGantryCricketPageCountries
    {
        public Dictionary<string, string> Countries { get; set; }
    }

    public class Countries
    {
        public string name { get; set; }
        public string[]? matches { get; set; }

    }
}