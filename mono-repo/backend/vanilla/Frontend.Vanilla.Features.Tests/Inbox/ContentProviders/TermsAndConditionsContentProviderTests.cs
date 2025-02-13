using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.TermsAndConditions;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.ServiceClients.Services.Content;
using Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Inbox.ContentProviders;

public class TermsAndConditionsContentProviderTests
{
    private ITermsAndConditionsContentProvider target;
    private Mock<IContentService> contentService;
    private Mock<ITermsAndConditionsConfiguration> configuration;
    private Mock<IPosApiCommonService> posApiCommonService;
    private Mock<IPosApiContentService> posApiContentService;
    private TestLogger<TermsAndConditionsContentProvider> log;

    public TermsAndConditionsContentProviderTests()
    {
        contentService = new Mock<IContentService>();
        configuration = new Mock<ITermsAndConditionsConfiguration>();
        posApiCommonService = new Mock<IPosApiCommonService>();
        posApiContentService = new Mock<IPosApiContentService>();
        log = new TestLogger<TermsAndConditionsContentProvider>();

        target = new TermsAndConditionsContentProvider(contentService.Object, configuration.Object, posApiCommonService.Object, posApiContentService.Object, log);
        posApiCommonService.Setup(c => c.GetAllCountries()).Returns(new List<Country>()
        {
            new Country("AF", "Afghanistan"),
            new Country("AT", "Austria"),
            new Country("DE", "Germany"),
            new Country("FO ", "Falkland Islands"),
            new Country("FR", "France"),
        });
        var ids = new DocumentId[] { Guid.NewGuid().ToString() };
        contentService.Setup(c => c.Get<IPCContainer>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>())).Returns(Mock.Of<IPCContainer>(c => c.Items == ids));
        var viewTemplate = new Mock<IViewTemplate>();
        viewTemplate.Setup(c => c.Messages).Returns(new Dictionary<string, string>
        {
            { "ODDSBOOST_SPORT_NAME", "default sports" },
            { "ODDSBOOST_EVENT_NAME", "default event" },
            { "ODDSBOOST_LEAGUE_NAME", "default league" },
            { "RISKFREEBET_SPORT_NAME", "default risk sports" },
            { "RISKFREEBET_EVENT_NAME", "default risk event" },
            { "RISKFREEBET_LEAGUE_NAME", "default risk league" },
        }.AsContentParameters());
        contentService.Setup(c => c.Get<IViewTemplate>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>())).Returns(viewTemplate.Object);

        configuration.SetupGet(i => i.OddsBoostKeyValues).Returns(new Dictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata>()
        {
            { "#ODDSBOOST_SPORT_IDS#", new OddsBoostRiskFreeBetMetadata("#ODDSBOOST_SPORT_NAME#", "Sport") },
            { "#ODDSBOOST_EVENT_IDS#", new OddsBoostRiskFreeBetMetadata("#ODDSBOOST_EVENT_NAME#", "Fixture") },
            { "#ODDSBOOST_LEAGUE_IDS#", new OddsBoostRiskFreeBetMetadata("#ODDSBOOST_LEAGUE_NAME#", "League") },
        });
        configuration.SetupGet(i => i.RiskFreeBetKeyValues).Returns(new Dictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata>()
        {
            { "#RISKFREEBET_SPORT_IDS#", new OddsBoostRiskFreeBetMetadata("#RISKFREEBET_SPORT_NAME#", "Sport") },
            { "#RISKFREEBET_EVENT_IDS#", new OddsBoostRiskFreeBetMetadata("#RISKFREEBET_EVENT_NAME#", "Fixture") },
            { "#RISKFREEBET_LEAGUE_IDS#", new OddsBoostRiskFreeBetMetadata("#RISKFREEBET_LEAGUE_NAME#", "League") },
        });
        configuration.SetupGet(i => i.TncSectionByTemplateId).Returns(new Dictionary<string, string>()
        {
            { "casino", "casinoTemplate" },
        });
    }

    public static readonly IEnumerable<object[]> BratIncludedCountriesData = new[]
    {
        new object[] { "AF, DE,AT ", "Afghanistan, Austria, Germany" },
        new object[] { " AF ", "Afghanistan" },
        new object[] { "", "" },
        new object[] { null, "" },
    };

    [Theory, MemberData(nameof(BratIncludedCountriesData))]
    public void SetReplacementList_ShouldReplaceCountriesNames(string countriesCodes, string countryNames)
    {
        contentService.Setup(c => c.Get<IPCText>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>()))
            .Returns(Mock.Of<IPCText>(c => c.Text == "#BRAT_INCLUDED_COUNTRIES#"));
        var replaceableKeyValuePairs = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>("#BRAT_INCLUDED_COUNTRIES#", countriesCodes),
        };

        target.SetReplacementList(replaceableKeyValuePairs);

        var tncContent = target.GetTncContent("casino", null);

        tncContent.Trim().Should().Be(countryNames);
    }

    [Fact]
    public void SetReplacementList_ShouldReplaceOddsBoostNames()
    {
        contentService.Setup(c => c.Get<IPCText>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>()))
            .Returns(Mock.Of<IPCText>(c => c.Text == "#ODDSBOOST_SPORT_NAME#, #ODDSBOOST_LEAGUE_NAME#, #ODDSBOOST_EVENT_NAME#"));
        var replaceableKeyValuePairs = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>("#ODDSBOOST_LEAGUE_IDS#", ""),
            new KeyValuePair<string, string>("#ODDSBOOST_SPORT_IDS#", "14"),
            new KeyValuePair<string, string>("#ODDSBOOST_EVENT_NAME#", ""),
            new KeyValuePair<string, string>("#ODDSBOOST_SPORT_NAME#", "Football"),
        };

        target.SetReplacementList(replaceableKeyValuePairs);
        target.SetOddsBootsAndRiskFreeBetReplacement();

        var tncContent = target.GetTncContent("casino", null);

        tncContent.Trim().Should().Be("Football, default league, default event");
    }

    [Fact]
    public void SetReplacementList_ShouldReplaceRiskFreeBet()
    {
        contentService.Setup(c => c.Get<IPCText>(It.IsAny<DocumentId>(), It.IsAny<ContentLoadOptions>()))
            .Returns(Mock.Of<IPCText>(c => c.Text == "#RISKFREEBET_SPORT_NAME#, #RISKFREEBET_LEAGUE_NAME#, #RISKFREEBET_EVENT_NAME#"));
        posApiContentService.Setup(c => c.GetTranslationAsync(ExecutionMode.Sync, "Sport", "14")).ReturnsAsync(new Translation(14, "Football"));
        posApiContentService.Setup(c => c.GetTranslationAsync(ExecutionMode.Sync, "Fixture", "4")).ThrowsAsync(new Exception());
        var replaceableKeyValuePairs = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>("#RISKFREEBET_SPORT_IDS#", ""),
            new KeyValuePair<string, string>("#RISKFREEBET_SPORT_NAME#", "14"),
            new KeyValuePair<string, string>("#RISKFREEBET_EVENT_NAME#", "4"),
            new KeyValuePair<string, string>("#RISKFREEBET_LEAGUE_NAME#", ""),
        };

        target.SetReplacementList(replaceableKeyValuePairs);
        target.SetOddsBootsAndRiskFreeBetReplacement(true);

        var tncContent = target.GetTncContent("casino", null);

        tncContent.Trim().Should().Be("Football, default risk league, default risk event");
    }
}
