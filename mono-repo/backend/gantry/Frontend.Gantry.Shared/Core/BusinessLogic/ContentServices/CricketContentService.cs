using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface ICricketContentService
    {
        IList<Countries> getCricketCountries();
    }
    public class CricketContentService : ICricketContentService
    {
        private readonly IGantryCricketPageCountries _cricketCountries;

        public CricketContentService(IGantryCricketPageCountries cricketCountries)
        {
            _cricketCountries = cricketCountries;
        }

        public IList<Countries> getCricketCountries()
        {
            IList<Countries> countries = new List<Countries>();

            var dynaconCountries = _cricketCountries.Countries;

            foreach (KeyValuePair<string, string> dCountry in dynaconCountries)
            {
                countries.Add(new Countries()
                {
                    name = dCountry.Key,
                    matches = dCountry.Value?.Split(',').Select(m => m.Trim()).ToArray()
                });
            }

            return countries;
        }
    }
}