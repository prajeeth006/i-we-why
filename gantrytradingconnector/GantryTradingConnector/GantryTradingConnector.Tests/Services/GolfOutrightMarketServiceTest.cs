using GantryTradingConnector.Shared.Models.MarketModels;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket;
using NUnit.Framework;
using GantryTradingConnector.Shared.Services.MarketService;
using Microsoft.Extensions.Logging;
using Moq;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace GantryTradingConnector.Tests.Services
{
    [TestFixture]
    class GolfOutrightMarketServiceTest
    {
        private IGolfOutrightMarketService _golfOutrightMarketService;
        private Mock<ILogger<MarketContentService>> _logger;

        [SetUp]
        public void SetUp()
        {
            _logger = new Mock<ILogger<MarketContentService>>();
            _golfOutrightMarketService = new GolfOutrightMarketService(_logger.Object);
        }

        [Test]
        public void Should_Work_For_TV2_GolfOutright_CDS()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "19035381",
                Version = "v2",
                IsBCPApiEnabled = false,
                TradingTemplates = new List<TradingTemplate>()
                {
                    new TradingTemplate()
                    {
                        Id = new Guid(),
                        TemplateIds = "",
                        MarketNames = "MarketName:Match Result|MarketNameReg:^Match Result$|MatchExactProperties:3|MarketType:3Way|Happening:Goal|Period:RegularTime||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:1.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:2.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:3.5||MarketName:Both Teams To Score|MarketNameReg:^Both Teams To Score$|MatchExactProperties:3|MarketType:BTTS|Happening:Goal|Period:RegularTime||MarketName:Match Odds & Both Teams To Score|MarketNameReg:^Match Odds & Both Teams To Score$|MatchExactProperties:3|MarketType:ThreeWayAndBTTS|Happening:Goal|Period:RegularTime"
                    }
                },
                isGolfOutrightMarket = true,
                skipMarketFilter =false,
                language="en"
            };
            MarketResponse marketResponse = new MarketResponse
            {
                TradingTemplates = marketRequest.TradingTemplates.Select(x => new TradingTemplateMarkets(x)).ToList()
            };

            Dictionary<string, FixtureParticipantOptions> participantOptions= new Dictionary<string, FixtureParticipantOptions>();

            participantOptions.Add("40961753", new FixtureParticipantOptions()
            {
                Id = "40961753",
                MarketId = "6805079"
            });

            var result = _golfOutrightMarketService.GetGolfOutrightMarkets(participantOptions,marketResponse);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 1);
            else
            {
                Assert.IsNotNull(result?.Result?.TradingTemplates);
            }
        }

        [Test]
        public void Should_Work_For_TV2_GolfOutright_CDS_withMultipleMarketIds()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "19035381",
                Version = "v2",
                IsBCPApiEnabled = false,
                TradingTemplates = new List<TradingTemplate>()
                {
                    new TradingTemplate()
                    {
                        Id = new Guid(),
                        TemplateIds = "",
                        MarketNames = "MarketName:Match Result|MarketNameReg:^Match Result$|MatchExactProperties:3|MarketType:3Way|Happening:Goal|Period:RegularTime||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:1.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:2.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:3.5||MarketName:Both Teams To Score|MarketNameReg:^Both Teams To Score$|MatchExactProperties:3|MarketType:BTTS|Happening:Goal|Period:RegularTime||MarketName:Match Odds & Both Teams To Score|MarketNameReg:^Match Odds & Both Teams To Score$|MatchExactProperties:3|MarketType:ThreeWayAndBTTS|Happening:Goal|Period:RegularTime"
                    }
                },
                isGolfOutrightMarket = true,
                skipMarketFilter = false,
                language = "en"
            };
            MarketResponse marketResponse = new MarketResponse
            {
                TradingTemplates = marketRequest.TradingTemplates.Select(x => new TradingTemplateMarkets(x)).ToList()
            };

            Dictionary<string, FixtureParticipantOptions> participantOptions = new Dictionary<string, FixtureParticipantOptions>();

            participantOptions.Add("40961753", new FixtureParticipantOptions()
            {
                Id = "40961753",
                MarketId = "6805079"
            });
            participantOptions.Add("40961754", new FixtureParticipantOptions()
            {
                Id = "40961753",
                MarketId = "6805078"
            });

            var result = _golfOutrightMarketService.GetGolfOutrightMarkets(participantOptions, marketResponse);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 2);
            else
            {
                Assert.IsNotNull(result?.Result?.TradingTemplates);
            }
        }

        [Test]
        public void Should_Work_For_TV2_GolfOutright_CDS_NullCheck()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "19035381",
                Version = "v2",
                IsBCPApiEnabled = false,
                TradingTemplates = new List<TradingTemplate>()
                {
                    new TradingTemplate()
                    {
                        Id = new Guid(),
                        TemplateIds = "",
                        MarketNames = "MarketName:Match Result|MarketNameReg:^Match Result$|MatchExactProperties:3|MarketType:3Way|Happening:Goal|Period:RegularTime||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:1.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:2.5||MarketName:Over/Under Total Goals|MarketNameReg:!!^Over/Under Total Goals [1-3](.\\d+){0,1}$|MatchExactProperties:4|MarketType:Over/Under|Happening:Goal|Period:RegularTime|DecimalValue:3.5||MarketName:Both Teams To Score|MarketNameReg:^Both Teams To Score$|MatchExactProperties:3|MarketType:BTTS|Happening:Goal|Period:RegularTime||MarketName:Match Odds & Both Teams To Score|MarketNameReg:^Match Odds & Both Teams To Score$|MatchExactProperties:3|MarketType:ThreeWayAndBTTS|Happening:Goal|Period:RegularTime"
                    }
                },
                isGolfOutrightMarket = true,
                skipMarketFilter = false,
                language = "en"
            };
            MarketResponse marketResponse = new MarketResponse
            {
                TradingTemplates =null
            };

            Dictionary<string, FixtureParticipantOptions> participantOptions = new Dictionary<string, FixtureParticipantOptions>();

            participantOptions.Add("40961753", new FixtureParticipantOptions()
            {
                Id = "40961753",
                MarketId = "6805079"
            });

            var result = _golfOutrightMarketService.GetGolfOutrightMarkets(participantOptions, marketResponse);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 1);
            else
            {
                Assert.IsNull(result?.Result?.TradingTemplates);
            }
        }
    }
}
