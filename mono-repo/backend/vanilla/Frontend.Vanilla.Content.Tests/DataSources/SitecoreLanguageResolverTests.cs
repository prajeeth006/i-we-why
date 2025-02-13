using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.DataSources;

public sealed class SitecoreLanguageResolverTests
{
    [Theory]
    [InlineData("en-US", "en", "en")]
    [InlineData("fr-FR", "fr", "fr")]
    [InlineData("zh-CN", "zh", "zh")]
    public void ResolveLanguagesTest(string inputCulture, string expectedContentLang, string expectedUrlLang)
    {
        var culture = new CultureInfo(inputCulture);
        ISitecoreLanguageResolver target = new DefaultSitecoreLanguageResolver();

        // Act
        var langs = target.ResolveLanguages(culture);

        langs.ContentLanguage.Should().Be(expectedContentLang);
        langs.ContentDefaultLanguage.Should().BeNull();
        langs.UrlLanguage.Should().Be(expectedUrlLang);
    }
}
