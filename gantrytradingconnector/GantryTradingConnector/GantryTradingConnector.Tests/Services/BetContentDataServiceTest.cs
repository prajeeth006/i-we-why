using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.Services;
using GantryTradingConnector.Shared.Wrapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using System.Net;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.GraphQL.Providers;
using Microsoft.Extensions.Caching.Memory;
using Assert = NUnit.Framework.Assert;

namespace GantryTradingConnector.Tests.Services
{
    [TestFixture]
    class BetContentDataServiceTest
    {
       
        private Mock<ITradingHttpClient> _tradingHttpClientMock;
        private IOptions<TradingApiConfiguration> _tradingApiConfig;
        private IOptions<TradingContentApiConfiguration> _tcaConfig;
        private IOptions<BcpApiConfiguration> _bcpConfig;
        private BetContentDataService _betContentDataService;
        private Mock<ILogger<BetContentDataService>> _logger;
        private Mock<IBetContentProvider> _ibetContentProvider;
        private Mock<IMemoryCache> _memoryCache;
        private Mock<IOptions<DurationConfiguration>> _durationConfiguration;

        [SetUp]
        public void SetUp()
        {

            TradingApiConfiguration tradingApiConfiguration = new TradingApiConfiguration()
            {
                Endpoint="trading"
            };

            TradingContentApiConfiguration tradingContentApiConfiguration = new TradingContentApiConfiguration()
            {
                Endpoint = "tradingContent"
            };

            BcpApiConfiguration bcpApiConfiguration = new BcpApiConfiguration()
            {
                Endpoint = "bcpContent"
            };

            _tradingHttpClientMock = new Mock<ITradingHttpClient>();
            _tradingApiConfig =Options.Create(tradingApiConfiguration);
            _tcaConfig = Options.Create(tradingContentApiConfiguration);
            _bcpConfig = Options.Create(bcpApiConfiguration);
            _logger = new Mock<ILogger<BetContentDataService>>();
            _ibetContentProvider=new Mock<IBetContentProvider>();
            _memoryCache= new Mock<IMemoryCache>();
            _durationConfiguration=new Mock<IOptions<DurationConfiguration>>();
            _betContentDataService = new BetContentDataService(_tradingHttpClientMock.Object,
                _tradingApiConfig, _tcaConfig, _logger.Object, _ibetContentProvider.Object,_memoryCache.Object,_durationConfiguration.Object, _bcpConfig);
        }

        [Test]
        public void Should_All_Sport_Data_Not_Null()
        {

            HttpContent content = new StringContent("[{\"Id\":4}]");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = content }));

            var result = _betContentDataService.GetSportsDetails(string.Empty);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_All_Sport_Data_Empty()
        {
            HttpContent content = new StringContent("[]");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = content }));

            var result = _betContentDataService.GetSportsDetails(string.Empty);

            Assert.IsEmpty(result.Result.SportDetails);
        }


        [Test]
        public void Should_Not_Null_Fixture_V9_Response_Data()
        {
            HttpContent content = new StringContent("{\"Id\":\"2:4803202\"}");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = content }));

            var result = _betContentDataService.GetMarketDetailForVersionTwoFixture("2:4803202", null, null, null, null, false, null);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Null_Fixture_V9_Response_Data()
        {
            HttpContent content = new StringContent("");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = null }));

            var result = _betContentDataService.GetMarketDetailForVersionTwoFixture("2:4803202", null, null, null, null, false, null);

            Assert.IsNull(result.Result.FixtureV9Data);
        }

        [Test]
        public void Should_Option_Market_Slims_Details_Not_Null()
        {
            HttpContent content = new StringContent("[{\"Id\":\"4803202\"}]");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = content }));

            var result = _betContentDataService.GetMarketDetailForVersionOneFixture("4803202");

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Option_Market_Slims_Details_Empty()
        {
            HttpContent content = new StringContent("[]");

            _tradingHttpClientMock.Setup(x => x.GetRequestAsync(It.IsAny<string>())).Returns(Task.FromResult(new HttpResponseMessage() { StatusCode = HttpStatusCode.OK, Content = content }));

            var result = _betContentDataService.GetMarketDetailForVersionOneFixture("4803202");

            Assert.IsEmpty(result.Result.OptionMarketSlims);
        }
    }
}
