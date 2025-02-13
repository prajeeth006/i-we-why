using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Host.Features.SeoTracking;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Host.Tests.Features.SeoTracking;

public sealed class SeoTrackingConfigurationFactoryTests
{
    private SimpleConfigurationFactory<ISeoTrackingConfiguration, SeoTrackingConfigurationDto> target;
    private SeoTrackingConfigurationDto dto;

    public SeoTrackingConfigurationFactoryTests()
    {
        target = new SeoTrackingConfigurationFactory();
        dto = new SeoTrackingConfigurationDto
        {
            WmidCookieName = "wmid",
            LandingUrlCookieName = "landingurl",
            SearchEngineReferrerRegexes = new Dictionary<string, string>
            {
                { "Google", "google\\.com" },
                { "Yandex", "yandex\\.ru" },
            },
            Wmids = new Dictionary<string, string>
            {
                { "*", "111" },
                { "*|en-US", "222" },
                { "Google", "333" },
                { "Google|en-US", "444" },
                { "Yandex", "555" },
                { "Google|*|AT", "666" },
                { "Google|en-US|AT", "777" },
            },
        };
    }

    private void VerifyRegex(Regex regex, string expected)
    {
        regex.ToString().Should().Be(expected);
        regex.Options.Should().Be(RegexOptions.IgnoreCase | RegexOptions.Compiled);
    }

    private void RunAndExpectError(string invalidMember, string errorMessage)
    {
        var ex = Assert.Throws<InvalidConfigurationException>(() => target.Create(dto));

        ex.Errors.Count.Should().Be(1);
        ex.Errors[0].MemberNames.Should().BeEquivalentTo(invalidMember);
        ex.Errors[0].ErrorMessage.Should().Be(errorMessage);
    }

    [Fact]
    public void ShouldCreateConfig()
    {
        var config = target.Create(dto);

        config.WmidCookieName.Should().Be("wmid");
        config.LandingUrlCookieName.Should().Be("landingurl");
        config.ExcludeCurrentUrlRegex.Should().BeNull();
        config.ExcludeReferrerRegex.Should().BeNull();
        Enumerable.Select(config.SearchEngines, e => e.Name).Should().BeEquivalentTo("Google", "Yandex");
        VerifyRegex(config.SearchEngines[0].ReferrerRegex, "google\\.com");
        VerifyRegex(config.SearchEngines[1].ReferrerRegex, "yandex\\.ru");

        config.Wmids.Should().MatchItems(
            w => w.Wmid == "777" && w.SearchEngine == "Google" && w.CultureName == "en-US" && w.CountryCode == "AT",
            w => w.Wmid == "666" && w.SearchEngine == "Google" && w.CultureName == null && w.CountryCode == "AT",
            w => w.Wmid == "444" && w.SearchEngine == "Google" && w.CultureName == "en-US" && w.CountryCode == null,
            w => w.Wmid == "333" && w.SearchEngine == "Google" && w.CultureName == null && w.CountryCode == null,
            w => w.Wmid == "555" && w.SearchEngine == "Yandex" && w.CultureName == null && w.CountryCode == null,
            w => w.Wmid == "222" && w.SearchEngine == null && w.CultureName == "en-US" && w.CountryCode == null,
            w => w.Wmid == "111" && w.SearchEngine == null && w.CultureName == null && w.CountryCode == null);
    }

    public static readonly IEnumerable<string> ValidNames = new[] { "name", "UPPER", "under_scores", "dash-es" };
    public static readonly IEnumerable<string> InvalidNames = new[] { "", "  ", "white spaces", "chars?!" };

    [Theory, MemberValuesData(nameof(ValidNames))]
    public void WmidCookieName_ShouldSupportSimpleValues(string value)
    {
        dto.WmidCookieName = value;
        target.Create(dto).WmidCookieName.Should().Be(value);
    }

    [Theory, MemberValuesData(nameof(InvalidNames))]
    public void WmidCookieName_ShouldFailIfInvalid(string value)
    {
        dto.WmidCookieName = value;
        RunAndExpectError(nameof(dto.WmidCookieName),
            $"Invalid {nameof(dto.WmidCookieName)} = '{value}'. It must consist only of letters, numbers, underscores or dashes.");
    }

    [Theory, MemberValuesData(nameof(ValidNames))]
    public void LandingUrlCookieName_ShouldSupportSimpleValues(string value)
    {
        dto.LandingUrlCookieName = value;
        target.Create(dto).LandingUrlCookieName.Should().Be(value);
    }

    [Theory, MemberValuesData(nameof(InvalidNames))]
    public void LandingUrlCookieName_ShouldFailIfInvalid(string value)
    {
        dto.LandingUrlCookieName = value;
        RunAndExpectError(nameof(dto.LandingUrlCookieName),
            $"Invalid {nameof(dto.LandingUrlCookieName)} = '{value}'. It must consist only of letters, numbers, underscores or dashes.");
    }

    [Fact]
    public void ExcludeCurrentUrlRegex_ShouldAllowRegex()
    {
        dto.ExcludeCurrentUrlRegex = "\\?seo-tracking=0";
        VerifyRegex(target.Create(dto).ExcludeCurrentUrlRegex, "\\?seo-tracking=0");
    }

    [Theory, ValuesData("", "  ")]
    public void ExcludeCurrentUrlRegex_ShouldFailIfEmptyOrWhiteSpace(string value)
    {
        dto.ExcludeCurrentUrlRegex = value;
        RunAndExpectError(nameof(dto.ExcludeCurrentUrlRegex),
            $"Regular expression {nameof(dto.ExcludeCurrentUrlRegex)} can't be empty nor white-space to express your intentions explicitly.");
    }

    [Fact]
    public void ExcludeCurrentUrlRegex_ShouldFailIfInvalidRegex()
    {
        dto.ExcludeCurrentUrlRegex = "(";
        RunAndExpectError(nameof(dto.ExcludeCurrentUrlRegex),
            $"Value '(' used in {nameof(dto.ExcludeCurrentUrlRegex)} is not valid regular expression because: Invalid pattern '(' at offset 1. Not enough )'s.");
    }

    [Fact]
    public void ExcludeReferrerRegex_ShouldAllowRegex()
    {
        dto.ExcludeReferrerRegex = "mail";
        VerifyRegex(target.Create(dto).ExcludeReferrerRegex, "mail");
    }

    [Theory, ValuesData("", "  ")]
    public void ExcludeReferrerRegex_ShouldFailIfEmptyOrWhiteSpace(string value)
    {
        dto.ExcludeReferrerRegex = value;
        RunAndExpectError(nameof(dto.ExcludeReferrerRegex),
            $"Regular expression {nameof(dto.ExcludeReferrerRegex)} can't be empty nor white-space to express your intentions explicitly.");
    }

    [Fact]
    public void ExcludeReferrerRegex_ShouldFailIfInvalidRegex()
    {
        dto.ExcludeReferrerRegex = "(";
        RunAndExpectError(nameof(dto.ExcludeReferrerRegex),
            $"Value '(' used in {nameof(dto.ExcludeReferrerRegex)} is not valid regular expression because: Invalid pattern '(' at offset 1. Not enough )'s.");
    }

    [Theory, MemberValuesData(nameof(InvalidNames))]
    public void SearchEngines_ShoulFailIfInvalidName(string value)
    {
        dto.SearchEngineReferrerRegexes.Add(value, "test");
        RunAndExpectError(nameof(dto.SearchEngineReferrerRegexes),
            $"Invalid key in {nameof(dto.SearchEngineReferrerRegexes)} = '{value}'. It must consist only of letters, numbers, underscores or dashes.");
    }

    [Theory, ValuesData("", "  ")]
    public void SearchEngines_ShouldFailIfEmptyOrWhiteSpaceRegex(string value)
    {
        dto.SearchEngineReferrerRegexes.Add("Baidu", value);
        RunAndExpectError(nameof(dto.SearchEngineReferrerRegexes),
            $"Regular expression {nameof(dto.SearchEngineReferrerRegexes)}['Baidu'] can't be empty nor white-space to express your intentions explicitly.");
    }

    [Fact]
    public void SearchEngines_ShouldFailIfInvalidRegex()
    {
        dto.SearchEngineReferrerRegexes.Add("Baidu", "(");
        RunAndExpectError(nameof(dto.SearchEngineReferrerRegexes),
            $"Value '(' used in {nameof(dto.SearchEngineReferrerRegexes)}['Baidu'] is not valid regular expression because: Invalid pattern '(' at offset 1. Not enough )'s.");
    }

    [Fact]
    public void Wmids_ShouldSupportEmpty()
    {
        dto.Wmids.Clear();
        target.Create(dto).Wmids.Should().BeEmpty();
    }

    [Theory, ValuesData(null, "", "  ")]
    public void Wmids_ShoudlFailIfNullOrWhiteSpaceValue(string value)
    {
        dto.Wmids["Google|en-US"] = value;
        RunAndExpectError(nameof(dto.Wmids), $"{nameof(dto.Wmids)}['Google|en-US'] can't be null nor white-space.");
    }

    public static readonly IEnumerable<string> InvalidWmidKeys =
        EnumerableExtensions.Append(InvalidNames, "Google|", "Google|  ", "Google|some space", "Google|*| ", "Google|*|ABC");

    [Theory, MemberValuesData(nameof(InvalidWmidKeys))]
    public void Wmids_ShouldFailIfInvalidKey(string key)
    {
        dto.Wmids.Add(key, "000");
        RunAndExpectError(nameof(dto.Wmids),
            $"Invalid key in entry [{key}, 000] in {nameof(dto.Wmids)}. Valid examples: 'Google', 'Google|en-US', 'Google|en-US|AT', '*|en-US', '*|en-US|AT', '*'.");
    }

    [Fact]
    public void Wmids_ShouldFailedIfMissingSearchEngine()
    {
        dto.Wmids.Add("Baidu|zh-CN", "000");
        RunAndExpectError(nameof(dto.Wmids),
            $"Search engine 'Baidu' of entry [Baidu|zh-CN, 000] in {nameof(dto.Wmids)} doesn't correspond to any of {nameof(dto.SearchEngineReferrerRegexes)}.");
    }

    [Fact]
    public void Wmids_ShouldFailedIfInvalidCulture()
    {
        dto.Wmids.Add("Google|lol-WTF", "000");
        RunAndExpectError(nameof(dto.Wmids), $"Culture 'lol-WTF' of entry [Google|lol-WTF, 000] in {nameof(dto.Wmids)} is not a supported .NET culture.");
    }

    [Theory, ValuesData("Google|*|RU", "Google|RU")]
    public void Wmids_ShouldRecognizeCountryPattern(string key)
    {
        dto.Wmids.Clear();
        dto.Wmids.Add(key, "000");

        var config = target.Create(dto);

        var rule = config.Wmids.First();
        rule.SearchEngine.Should().Be("Google");
        rule.CultureName.Should().BeNull();
        rule.CountryCode.Should().Be("RU");
    }
}
