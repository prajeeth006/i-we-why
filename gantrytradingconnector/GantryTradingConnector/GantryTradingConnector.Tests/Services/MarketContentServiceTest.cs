using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using GantryTradingConnector.Shared.Services.MarketService;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using GantryTradingConnector.Shared.Models.MarketModels;
using GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace GantryTradingConnector.Tests.Services
{
    [TestFixture]
    class MarketContentServiceTest
    {

        private Mock<IBetContentDataService> _betContentDataService;
        private Mock<IBetContentBusiness> _betContentBusiness;
        private Mock<ILogger<MarketContentService>> _logger;
        private IMarketContentService _marketContentService;
        private Mock<IGolfOutrightMarketService> _golfOutrightMarketService;
        


        [SetUp]
        public void SetUp()
        {
            _logger = new Mock<ILogger<MarketContentService>>();
            _betContentBusiness = new Mock<IBetContentBusiness>();
            _betContentDataService = new Mock<IBetContentDataService>();
            _golfOutrightMarketService = new Mock<IGolfOutrightMarketService>();
            _marketContentService = new MarketContentService(_betContentDataService.Object, _betContentBusiness.Object, _logger.Object,_golfOutrightMarketService.Object);
        }

        [Test]
        public void Should_Work_For_TV1_BCP()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "15441754",
                Version = "v1",
                IsBCPApiEnabled = true,
                TradingTemplates = new List<TradingTemplate>()
                {
                    new TradingTemplate()
                    {
                        Id = new Guid(),
                        TemplateIds = "7817|17951|2449|2450|17984|30744",
                        MarketNames = "MarketName:Match Betting|MarketNameReg:^Match Betting$|MarketNameParameters:FormattedName.Visible|MarketGroup:MatchBetting||MarketName:Match Betting|MarketNameReg:^Match Betting$|MarketNameParameters:FormattedName.Visible|MarketGroup:MatchBetting||MarketName:Team A Top Runscorer|MarketNameReg:^Team A Top Runscorer$|MarketNameParameters:FormattedName.Visible||MarketName:Team B Top Runscorer|MarketNameReg:^Team B Top Runscorer$||MarketName:Total Sixes|MarketNameReg:^Total Sixes$|MarketNameParameters:FormattedName.Visible,Options.Visible.FormattedName|MarketGroup:TotalSixes||MarketName:Total Sixes|MarketNameReg:^Total Sixes$|MarketNameParameters:FormattedName.Visible,Options.Visible.FormattedName|MarketGroup:TotalSixes"
                    }
                }
            };


            _betContentDataService.Setup(x => x.GetMarketDetailForVersionOneFixtureNew(marketRequest.FixtureId)).Returns(Task.FromResult(new Event()
            {
                Markets = new Markets()
                {
                    Market = new List<Market>()
                    {
                        new Market()
                        {
                            Id = 12345,
                            FormattedName = "FName",
                            TemplateId = 7817,
                            AggregatedVisibility = "Visible",
                        }
                    }
                }
            }));


            var result = _marketContentService.GetMarkets(marketRequest);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 1);
            else
            {
                Assert.IsNotNull(result?.Result?.TradingTemplates);
            }
        }


        [Test]
        public void Should_Work_For_TV1_CDS()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "15441754",
                Version = "v1",
                IsBCPApiEnabled = false,
                TradingTemplates = new List<TradingTemplate>()
                {
                    new TradingTemplate()
                    {
                        Id = new Guid(),
                        TemplateIds = "7817|17951|2449|2450|17984|30744",
                        MarketNames = "MarketName:Match Betting|MarketNameReg:^Match Betting$|MarketNameParameters:FormattedName.Visible|MarketGroup:MatchBetting||MarketName:Match Betting|MarketNameReg:^Match Betting$|MarketNameParameters:FormattedName.Visible|MarketGroup:MatchBetting||MarketName:Team A Top Runscorer|MarketNameReg:^Team A Top Runscorer$|MarketNameParameters:FormattedName.Visible||MarketName:Team B Top Runscorer|MarketNameReg:^Team B Top Runscorer$||MarketName:Total Sixes|MarketNameReg:^Total Sixes$|MarketNameParameters:FormattedName.Visible,Options.Visible.FormattedName|MarketGroup:TotalSixes||MarketName:Total Sixes|MarketNameReg:^Total Sixes$|MarketNameParameters:FormattedName.Visible,Options.Visible.FormattedName|MarketGroup:TotalSixes"
                    }
                }
            };


            _betContentDataService.Setup(x => x.GetMarketDetailForVersionOneFixture(marketRequest.FixtureId)).Returns(Task.FromResult(new OptionMarketSlimsResponse()
            {
                OptionMarketSlims = new List<OptionMarketSlims>()
                {
                    new OptionMarketSlims()
                    {
                        FixtureId = "15441754",
                        TemplateId = "7817",
                        Id = "12345",
                    }
                }
            }));


            var result = _marketContentService.GetMarkets(marketRequest);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 1);
            else
            {
                Assert.IsNotNull(result?.Result?.TradingTemplates);
            }
        }



        [Test]
        public void Should_Work_For_TV2_CDS()
        {
            MarketRequest marketRequest = new MarketRequest()
            {
                FixtureId = "15441754",
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
                }
            };


            Dictionary<string, OptionMarkets> optionMarkets = new Dictionary<string, OptionMarkets>();

            optionMarkets.Add("12345",new OptionMarkets()
            {
                Id = "12345",
                Parameters = new List<FixtureParameter>()
                {
                    new FixtureParameter()
                    {
                        Key = "MarketType",
                        Type = "string",
                        Value = "3Way"
                    },
                    new FixtureParameter()
                    {
                        Key = "Happening",
                        Type = "string",
                        Value = "Goal"
                    },
                    new FixtureParameter()
                    {
                        Key = "Period",
                        Type = "string",
                        Value = "RegularTime"
                    }
                }
            } );

            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:15441754", It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<bool?>(), It.IsAny<int?>())).Returns(Task.FromResult(new FixtureV9Response()
            {
                FixtureV9Data = new FixtureV9Data()
                {
                    OptionMarkets = optionMarkets
                }
            }));


            var result = _marketContentService.GetMarkets(marketRequest);

            if (result?.Result?.TradingTemplates != null)
                Assert.AreEqual(result?.Result?.TradingTemplates[0].RacingMarkets?.Count, 1);
            else
            {
                Assert.IsNotNull(result?.Result?.TradingTemplates);
            }
        }
    }
}
