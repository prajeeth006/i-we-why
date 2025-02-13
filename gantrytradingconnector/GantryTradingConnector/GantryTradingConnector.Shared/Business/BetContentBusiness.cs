using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using GantryTradingConnector.Shared.GraphQL.Config;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.Business
{
    public class BetContentBusiness : IBetContentBusiness
    {
        private readonly IBetContentDataService _betContentDataService;
        private readonly ILogger<BetContentBusiness> _logger;
        public BetContentBusiness(IBetContentDataService betContentDataService,IMemoryCache cache,IOptions<DurationConfiguration> tcaConfig,
            ILogger<BetContentBusiness> logger)
        {
            _betContentDataService = betContentDataService;
            _logger = logger;
        }

        #region Public Method
        /// <summary>
        /// Get Fixture V9 Response Details
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="optionMarketIds">OptionMarketIds</param>
        /// <param name="label">Label</param>
        /// <param name="country">Country name</param>
        /// <param name="language">Language</param>
        /// <param name="skipMarketFilter">Skip market filter</param>
        /// <param name="shopTier">Shop tier</param>
        /// <returns>Object of Fixture V9 Response</returns>
        public async Task<FixtureV9Response> GetMarketDetailForVersionTwoFixture(string id, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException($"{nameof(id)} is required!");
            }

            FixtureV9Response fixtureV9Response = await _betContentDataService.GetMarketDetailForVersionTwoFixture(id,
                    optionMarketIds, label, country, language, skipMarketFilter, shopTier);

            return fixtureV9Response;

        }

        /// <summary>
        /// Get Option Market slims details
        /// </summary>
        /// <param name="fixtureid">Fixture Id</param>
        /// <param name="templateId">Template Id</param>
        /// <returns>List of Option Market Slims Response</returns>
        public async Task<OptionMarketSlimsResponse> GetMarketDetailForVersionOneFixture(string fixtureid, string templateId = null)
        {
            OptionMarketSlimsResponse optionMarketSlimsResponse = await _betContentDataService.GetMarketDetailForVersionOneFixture(fixtureid);

            List<OptionMarketSlims> optionMarketSlims = new List<OptionMarketSlims>();

            if (optionMarketSlimsResponse.OptionMarketSlims != null &&
                optionMarketSlimsResponse.OptionMarketSlims.Any())
            {
                if (string.IsNullOrEmpty(templateId))
                {
                    optionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims.OrderBy(x => x.NameId).ToList();
                }
                else
                {
                    string[] templateIdData = templateId.Split("|");

                    optionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims.Where(x => templateIdData.Contains(x.TemplateId)).OrderBy(x => x.TemplateId).ToList();
                }
            }

            optionMarketSlimsResponse.OptionMarketSlims = optionMarketSlims;

            return optionMarketSlimsResponse;
        }

        /// <summary>
        /// Get Option Market slims details new
        /// </summary>
        /// <param name="fixtureid">Fixture Id</param>
        /// <param name="templateId">Template Id</param>
        /// <returns>List of Event Markes</returns>
        public async Task<Event> GetMarketDetailForVersionOneFixtureBCP(string fixtureid, string templateId = null)
        {
            Stopwatch gtcTimer = new Stopwatch();
            Stopwatch tcaTimer = new Stopwatch();

            gtcTimer.Start();
            tcaTimer.Start();
            Event bcpResponse = await _betContentDataService.GetMarketDetailForVersionOneFixtureNew(fixtureid);

            _logger.LogInformation(JsonConvert.SerializeObject(bcpResponse));
            tcaTimer.Stop();
            bcpResponse.TCALatency = tcaTimer.ElapsedMilliseconds;

            if (bcpResponse.Markets.Market.Any())
            {
                if (string.IsNullOrEmpty(templateId))
                {
                    bcpResponse.Markets.Market = bcpResponse.Markets.Market.OrderBy(x => x.Name).ToList();
                }
                else
                {
                    string[] templateIdData = templateId.Split("|");
                    bcpResponse.Markets.Market = bcpResponse.Markets.Market.Where(x => templateIdData.Contains(x.TemplateId.ToString()) == true).OrderBy(x => x.TemplateId).ToList();
                }
            }

            gtcTimer.Stop();
            bcpResponse.GTCLatency = gtcTimer.ElapsedMilliseconds;


            return bcpResponse;
        }

        /// <summary>
        /// Get all Sports
        /// </summary>
        /// <param name="label">Label</param>
        /// <returns>List of Sports</returns>
        public async Task<SportDetailResponse> GetSportsDetails(string? label)
        {
            var response = await _betContentDataService.GetSportsDetails(label);

            if (response.SportDetails != null && response.SportDetails.Any())
            {
                response.SportDetails = response.SportDetails.OrderBy(x => x.Name?.Value).ToList();
            }

            return response;
        }

        #endregion

        #region Private Method

        /// <summary>
        /// Get Trading partition regions
        /// </summary>
        /// <param name="masterRegions">Master regions</param>
        /// <param name="tradingPartition">Trading Partition</param>
        /// <returns>Trading Partition Master Regions Response</returns>
        private List<MasterRegion> GetTradingPartitionMasterRegions(List<MasterRegion> masterRegions, int tradingPartition)
        {
            List<MasterRegion> regions = new List<MasterRegion>();

            List<MasterRegion> firstRegions = masterRegions.Where(region => region.UsedInTradingPartition.IndexOf(Convert.ToString(tradingPartition)) > -1).Distinct().ToList();

            List<MasterRegion> secondRegions = masterRegions.Where(region1 => !((firstRegions.Select(region2 => region2.InternalId).ToList()).IndexOf(region1.InternalId) > -1)).ToList();

            if (firstRegions.Any())
            {
                regions.AddRange(firstRegions);
            }

            if (secondRegions.Any())
            {
                regions.AddRange(secondRegions);
            }

            return regions;
        }

        /// <summary>
        /// Get Include and Excluded Master Regions
        /// </summary>
        /// <param name="masterRegions">List of Master Regions</param>
        /// <param name="includeRegions">Include regions</param>
        /// <param name="excludeRegions">Exclude regions</param>
        /// <returns>List of Master Regions</returns>
        private List<MasterRegion> GetIncludeAndExcludeMasterRegions(List<MasterRegion> masterRegions, string? includeRegions, string? excludeRegions)
        {
            string pattern = "[.~#%&*{}/()<>?|\"\\\\-^[\\]]";

            if (!string.IsNullOrEmpty(includeRegions))
            {
                includeRegions = Regex.Replace(includeRegions, pattern, String.Empty);

                if (!string.IsNullOrEmpty(includeRegions))
                {
                    var includeElement = Convert.ToString(includeRegions.Trim()).ToLower().Split(',').ToList();

                    masterRegions = GetMatchingMasterRegions(masterRegions, includeElement, pattern, false);
                }
            }

            if (!string.IsNullOrEmpty(excludeRegions) && masterRegions.Any())
            {
                if (!string.IsNullOrEmpty(includeRegions))
                {
                    var includeElement = Convert.ToString(includeRegions.Trim()).ToLower().Split(',').ToList();

                    excludeRegions = Regex.Replace(excludeRegions, pattern, String.Empty);

                    var excludeElement = Convert.ToString(excludeRegions.Trim()).ToLower().Split(',').ToList();

                    var differenceElement = excludeElement.Except(includeElement).ToList();

                    masterRegions = GetMatchingMasterRegions(masterRegions, differenceElement, pattern, true);
                }
                else
                {
                    excludeRegions = Regex.Replace(excludeRegions, pattern, String.Empty);

                    var excludeElement = Convert.ToString(excludeRegions.Trim()).ToLower().Split(',').ToList();

                    masterRegions = GetMatchingMasterRegions(masterRegions, excludeElement, pattern, true);
                }
            }

            return masterRegions;
        }

        /// <summary>
        ///  Get matching regions list
        /// </summary>
        /// <param name="masterRegions">List of Master Regions</param>
        /// <param name="matchingRegionElement">Include Exclude matching regions</param>
        /// <param name="isExclude">Is Exclude</param>
        /// <returns>Filter regions List</returns>
        private List<MasterRegion> GetMatchingMasterRegions(List<MasterRegion> masterRegions, List<string> matchingRegionElement, string pattern, bool isExclude = false)
        {
            List<MasterRegion> newMasterRegions = new List<MasterRegion>();

            if (matchingRegionElement.Count == 0)
            {
                return masterRegions;
            }

            foreach (var region in matchingRegionElement)
            {
                if (!isExclude)
                {
                    var matchingRegions = masterRegions.Where(m =>
                        Regex.IsMatch(Regex.Replace(m.Name.Value, pattern, String.Empty).ToLower().Trim(), region.Trim(), RegexOptions.IgnoreCase)).ToList();

                    if (matchingRegions.Any())
                    {
                        newMasterRegions.AddRange(matchingRegions);

                        matchingRegions.ForEach(r => masterRegions.Remove(r));
                    }
                }
                else
                {
                    var excludeRegions = masterRegions.Where(m =>
                        Regex.IsMatch(Regex.Replace(m.Name.Value, pattern, String.Empty).ToLower().Trim(), region, RegexOptions.IgnoreCase)).ToList();

                    if (excludeRegions.Any())
                    {
                        excludeRegions.ForEach(r => masterRegions.Remove(r));
                    }

                    newMasterRegions = masterRegions;
                }
            }

            return newMasterRegions;
        }

        /// <summary>
        /// Get Include and Excluded Master Competitions
        /// </summary>
        /// <param name="masterCompetitions">List of Master Competitions</param>
        /// <param name="includeCompetitions">Include Competitions</param>
        /// <param name="excludeCompetitions">Exclude Competitions</param>
        /// <returns>List of Master Competitions</returns>
        private List<MasterCompetition> GetIncludeAndExcludeMasterCompetitions(List<MasterCompetition> masterCompetitions, string? includeCompetitions, string? excludeCompetitions)
        {
            string pattern = "[.~#%&*{}/()<>?|\"\\\\-^[\\]]";

            if (!string.IsNullOrEmpty(includeCompetitions))
            {
                includeCompetitions = Regex.Replace(includeCompetitions, pattern, String.Empty);

                if (!string.IsNullOrEmpty(includeCompetitions))
                {
                    var includeElement = Convert.ToString(includeCompetitions.Trim()).ToLower().Split(',').ToList();

                    masterCompetitions = GetMatchingMasterCompetitions(masterCompetitions, includeElement, pattern, false);
                }
            }

            if (!string.IsNullOrEmpty(excludeCompetitions) && masterCompetitions.Any())
            {
                if (!string.IsNullOrEmpty(includeCompetitions))
                {
                    var includeElement = Convert.ToString(includeCompetitions.Trim()).ToLower().Split(',').ToList();

                    excludeCompetitions = Regex.Replace(excludeCompetitions, pattern, String.Empty);

                    var excludeElement = Convert.ToString(excludeCompetitions.Trim()).ToLower().Split(',').ToList();

                    List<string> differenceElement = excludeElement.Except(includeElement).ToList();

                    masterCompetitions = GetMatchingMasterCompetitions(masterCompetitions, differenceElement, pattern, true);
                }
                else
                {
                    excludeCompetitions = Regex.Replace(excludeCompetitions, pattern, String.Empty);

                    List<string> excludeElement = Convert.ToString(excludeCompetitions.Trim()).ToLower().Split(',').ToList();

                    masterCompetitions = GetMatchingMasterCompetitions(masterCompetitions, excludeElement, pattern, true);
                }
            }

            return masterCompetitions;
        }

        /// <summary>
        ///  Get matching competitions list
        /// </summary>
        /// <param name="masterCompetitions">List of Master Region</param>
        /// <param name="matchingCompetitionElement">Include Exclude matching competition</param>
        /// <param name="isExclude">Is Exclude</param>
        /// <returns>Filter competition List</returns>
        private List<MasterCompetition> GetMatchingMasterCompetitions(List<MasterCompetition> masterCompetitions, List<string> matchingCompetitionElement, string pattern, bool isExclude = false)
        {
            List<MasterCompetition> newMasterCompetitions = new List<MasterCompetition>();

            if (matchingCompetitionElement.Count == 0)
            {
                return masterCompetitions;
            }

            foreach (var competition in matchingCompetitionElement)
            {
                if (!isExclude)
                {
                    var matchingCompetitions = masterCompetitions.Where(m =>
                        Regex.IsMatch(Regex.Replace(m.Name.Value, pattern, String.Empty).ToLower().Trim(), competition.Trim(), RegexOptions.IgnoreCase)).ToList();

                    if (matchingCompetitions.Any())
                    {
                        newMasterCompetitions.AddRange(matchingCompetitions);

                        matchingCompetitions.ForEach(r => masterCompetitions.Remove(r));
                    }
                }
                else
                {
                    var excludeCompetitions = masterCompetitions.Where(m =>
                        Regex.IsMatch(Regex.Replace(m.Name.Value, pattern, String.Empty).ToLower().Trim(), competition.Trim(), RegexOptions.IgnoreCase)).ToList();

                    if (excludeCompetitions.Any())
                    {
                        excludeCompetitions.ForEach(r => masterCompetitions.Remove(r));
                    }

                    newMasterCompetitions = masterCompetitions;
                }
            }

            return newMasterCompetitions;
        }
        #endregion
    }
}
