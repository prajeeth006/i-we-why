#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization;

public sealed class LanguageInfoTests
{
    private LanguageInfo GetTarget(
        string? culture = "de-AT",
        string? nativeName = "DE Name",
        string? routeValue = "rv-de",
        string? sitecoreContentLanguage = "sc DE",
        string? sitecoreContentDefaultLanguage = null,
        string? htmlLangAttribute = "html DE",
        string? angularLocale = "ang DE")
    {
        var cultureObj = culture != null ? new CultureInfo(culture) : null;

        return new LanguageInfo(cultureObj!, nativeName!, routeValue!, sitecoreContentLanguage!, sitecoreContentDefaultLanguage, htmlLangAttribute!, angularLocale!);
    }

    [Theory, ValuesData(null, "sc def DE")]
    public void ShouldCreateCorrectly(string? sitecoreContentDefaultLanguage)
    {
        // Act
        var target = GetTarget(sitecoreContentDefaultLanguage: sitecoreContentDefaultLanguage);

        target.Culture.Should().Be(new CultureInfo("de-AT"));
        target.Culture.IsReadOnly.Should().BeTrue();
        target.NativeName.Should().Be("DE Name");
        target.RouteValue.Should().Be("rv-de");
        target.SitecoreContentLanguage.Should().Be("sc DE");
        (target.SitecoreContentDefaultLanguage?.Value).Should().Be(sitecoreContentDefaultLanguage);
        target.HtmlLangAttribute.Should().Be("html DE");
        target.AngularLocale.Should().Be("ang DE");
        target.ToString().Should().Be("de-AT");
    }

    public static readonly IEnumerable<string?> InvalidStrs = new[] { null, "", "  ", " not-trimmed-start", "not-trimemd-end " };

    [Fact]
    public void Culture_ShouldThrow_IfNull()
        => RunFailedTest(() => GetTarget(culture: null), nameof(LanguageInfo.Culture));

    [Theory, ValuesData("български", "中文", "American English")]
    public void NativeName_ShouldSupportCrazyValues(string value)
    {
        // Act
        var target = GetTarget(nativeName: value);

        target.NativeName.Should().Be(value);
    }

    public static readonly IEnumerable<string?> InvalidNativeNames = InvalidStrs.Append("Subsequent   spaces");

    [Theory, MemberValuesData(nameof(InvalidNativeNames))]
    public void NativeName_ShouldThrow_IfInvalid(string? value)
        => RunFailedTest(() => GetTarget(nativeName: value), nameof(LanguageInfo.NativeName));

    [Theory, ValuesData("e", "es-419-omg")]
    public void RouteValue_ShouldSupportCrazyValues(string value)
    {
        // Act
        var target = GetTarget(routeValue: value);

        target.RouteValue.Should().Be(value);
    }

    public static readonly IEnumerable<string?> InvalidRouteValues = InvalidStrs.Append("UPPER", "special?!chars", "some space s");

    [Theory, MemberValuesData(nameof(InvalidRouteValues))]
    public void RouteValue_ShouldThrow_IfInvalid(string? value)
        => RunFailedTest(() => GetTarget(routeValue: value), nameof(LanguageInfo.RouteValue));

    [Theory, MemberValuesData(nameof(InvalidStrs))]
    public void SitecoreContentLanguage_ShouldThrow_IfInvalid(string? value)
        => RunFailedTest(() => GetTarget(sitecoreContentLanguage: value), nameof(LanguageInfo.SitecoreContentLanguage));

    public static readonly IEnumerable<string> InvalidSitecoreContentDefaultLanguages = InvalidStrs.WhereNotNull();

    [Theory, MemberValuesData(nameof(InvalidSitecoreContentDefaultLanguages))]
    public void SitecoreContentDefaultLanguage_ShouldThrow_IfInvalid(string value)
        => RunFailedTest(() => GetTarget(sitecoreContentDefaultLanguage: value), nameof(LanguageInfo.SitecoreContentDefaultLanguage));

    [Theory, MemberValuesData(nameof(InvalidStrs))]
    public void HtmlLangAttribute_ShouldThrow_IfInvalid(string? value)
        => RunFailedTest(() => GetTarget(htmlLangAttribute: value), nameof(LanguageInfo.HtmlLangAttribute));

    [Theory, MemberValuesData(nameof(InvalidStrs))]
    public void AngularLocale_ShouldThrow_IfInvalid(string? value)
        => RunFailedTest(() => GetTarget(angularLocale: value), nameof(LanguageInfo.AngularLocale));

    private void RunFailedTest(Action act, string expectedProperty)
        => act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(expectedProperty.ToCamelCase());
}
