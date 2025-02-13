using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Wrapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using GantryTradingConnector.Shared.GraphQL.Config;
using Microsoft.Extensions.Caching.Memory;
using System.Xml;
using System.Xml.Serialization;

namespace GantryTradingConnector.Shared.Services
{
    public class BetContentDataService : IBetContentDataService
    {
        private readonly ITradingHttpClient _tradingHttpClient;
        private readonly IOptions<TradingApiConfiguration> _tradingApiConfig;
        private readonly IOptions<TradingContentApiConfiguration> _tcaConfig;
        private readonly IOptions<BcpApiConfiguration> _bcpConfig;
        private readonly ILogger<BetContentDataService> _logger;
        private readonly IBetContentProvider _betContentProvider;
        private readonly IMemoryCache _cache;
        private readonly IOptions<DurationConfiguration> _durationConfiguration;
        public BetContentDataService(ITradingHttpClient tradingHttpClient, IOptions<TradingApiConfiguration> tradingApiConfig, IOptions<TradingContentApiConfiguration> tcaConfig, ILogger<BetContentDataService> logger, IBetContentProvider betContentProvider,IMemoryCache memoryCache,IOptions<DurationConfiguration> durationConfiguration, IOptions<BcpApiConfiguration> bcpConfig)
        {
            _tradingHttpClient = tradingHttpClient;
            _tradingApiConfig = tradingApiConfig;
            _tcaConfig = tcaConfig;
            _bcpConfig = bcpConfig;
            _logger = logger;
            _betContentProvider = betContentProvider;
            _cache= memoryCache;
            _durationConfiguration = durationConfiguration;
        }

        /// <summary>
        /// Get all Sports
        /// </summary>
        /// <param name="label">label</param>
        /// <returns>List of Sports</returns>
        public async Task<SportDetailResponse> GetSportsDetails(string? label)
        {
            SportDetailResponse sportResponse = new SportDetailResponse();

            _logger.LogInformation("Get Sports Data From Data source");

            StringBuilder requestUrl = new StringBuilder();

            requestUrl.Append($"{_tcaConfig.Value.Endpoint}api/masterdata/Sports");

            if (!String.IsNullOrEmpty(label))
            {
                requestUrl.Append($"?label={label}");
            }

            sportResponse.UrlTradingResponse = requestUrl.ToString();

            HttpResponseMessage result = await _tradingHttpClient.GetRequestAsync(requestUrl.ToString());

            if (result.IsSuccessStatusCode)
            {
                string objResponse = result.Content.ReadAsStringAsync().Result;

                sportResponse.SportDetails = JsonConvert.DeserializeObject<List<SportDetail>>(objResponse);

                sportResponse.Status = HttpStatusCode.OK;
            }
            else
            {
                sportResponse.Status = result.StatusCode;
            }

            _logger.LogInformation("Get Final Sports Data From Data source");

            return sportResponse;
        }

        /// <summary>
        /// Get Fixture V9 Response Details
        /// </summary>
        /// <param name="fixtureId">fixture Id</param>
        /// <param name="optionMarketIds">OptionMarketIds</param>
        /// <param name="label">Label</param>
        /// <param name="country">Country name</param>
        /// <param name="language">Language</param>
        /// <param name="skipMarketFilter">Skip market filter</param>
        /// <param name="shopTier">Shop tier</param>
        /// <returns>Object of Fixture V9 Response</returns>
        public async Task<FixtureV9Response> GetMarketDetailForVersionTwoFixture(string fixtureId, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null)
        {
            FixtureV9Response betContentResponse = new FixtureV9Response();
            try
            {
                StringBuilder requestUrl = new StringBuilder();

                requestUrl.Append($"{_tcaConfig.Value.Endpoint}api/betcontent/FixtureV9/{fixtureId}");
                if (!string.IsNullOrEmpty(language))
                {
                    requestUrl.Append($"?language={language}");
                }

                if (skipMarketFilter.HasValue)
                {
                    requestUrl.Append($"?skipMarketFilter={skipMarketFilter}");
                }

                betContentResponse.UrlTradingResponse = requestUrl.ToString();
                ;
                HttpResponseMessage result = await _tradingHttpClient.GetRequestAsync(requestUrl.ToString());

                if (result.IsSuccessStatusCode)
                {
                    string objResponse = result.Content.ReadAsStringAsync().Result;

                    betContentResponse.FixtureV9Data = JsonConvert.DeserializeObject<FixtureV9Data>(objResponse);

                    betContentResponse.Status = HttpStatusCode.OK;
                }
                else
                {
                    betContentResponse.Status = result.StatusCode;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while fetching market details form GetMarketDetail for VersionTwoFixture api: {ex.Message}");
            }

            return betContentResponse;
        }

        /// <summary>
        /// Get Option Market slims details
        /// </summary>
        /// <param name="fixtureId">Fixture Id</param>
        /// <returns>List of Option Market Slims Response</returns>
        public async Task<OptionMarketSlimsResponse> GetMarketDetailForVersionOneFixture(string fixtureId)
        {
            OptionMarketSlimsResponse optionMarketSlimsResponse = new OptionMarketSlimsResponse();
            try
            {
                string applicationUrl = _tradingApiConfig.Value.Endpoint;

                StringBuilder requestUrl = new StringBuilder();

                requestUrl.Append($"{applicationUrl}betcontent/v1/OptionMarketSlims?fixtureId={fixtureId}");

                optionMarketSlimsResponse.UrlTradingResponse = requestUrl.ToString();

                HttpResponseMessage result = await _tradingHttpClient.GetRequestAsync(requestUrl.ToString());

                if (result.IsSuccessStatusCode)
                {
                    string objResponse = result.Content.ReadAsStringAsync().Result;

                    optionMarketSlimsResponse.OptionMarketSlims =
                        JsonConvert.DeserializeObject<List<OptionMarketSlims>>(objResponse);

                    optionMarketSlimsResponse.Status = HttpStatusCode.OK;
                }
                else
                {
                    optionMarketSlimsResponse.Status = result.StatusCode;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while fetching market details form GetMarketDetail for VersionOneFixture api: {ex.Message}");
            }

            return optionMarketSlimsResponse;
        }

        /// <summary>
        /// Get Option Market slims details
        /// </summary>
        /// <param name="fixtureId">Fixture Id</param>
        /// <returns>List of Event Markets</returns>
        public async Task<Event> GetMarketDetailForVersionOneFixtureNew(string fixtureId)
        {
            Event bcpResponseEvents = new Event();
            Event bcpResponse = new Event();
            string bcpApiUrl = _bcpConfig.Value.Endpoint;
            StringBuilder requestUrl = new StringBuilder();
            requestUrl.Append($"{bcpApiUrl}Service.svc/EventWithAllMarkets?id={fixtureId}");

            HttpResponseMessage result = await _tradingHttpClient.GetRequestAsync(requestUrl.ToString());

            if (result.IsSuccessStatusCode)
            {
                string objResponse = result.Content.ReadAsStringAsync().Result;

                try
                {
                    XmlDocument doc = new XmlDocument();
                    XmlReaderSettings settings = new XmlReaderSettings();
                    settings.DtdProcessing = DtdProcessing.Prohibit;
                    settings.XmlResolver = null;
                    XmlSerializer serializer = new XmlSerializer(typeof(Event));
                    using (TextReader reader = new StringReader(objResponse))
                    {
                        bcpResponse = (Event)serializer.Deserialize(reader);
                    }

                    if (bcpResponse != null)
                    {
                        bcpResponseEvents = bcpResponse;
                        bcpResponse.UrlTradingResponse = requestUrl.ToString();
                        bcpResponse.Status = HttpStatusCode.OK;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while fetching market details form BCP api: {ex.Message}");
                }

            }
            else
            {
                bcpResponseEvents.Status = result.StatusCode;
            }

            return bcpResponseEvents;
        }
    }
}
