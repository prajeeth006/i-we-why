using System;
using System.Globalization;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class CurrentLanguageResolverTests
{
    private ICurrentLanguageResolver target;
    private Mock<IAllowedLanguagesResolver> allowedLanguagesResolver;
    private Mock<IGlobalizationConfiguration> globalizationConfiguration;
    private LanguageInfo[] langs;

    public CurrentLanguageResolverTests()
    {
        globalizationConfiguration = new Mock<IGlobalizationConfiguration>();
        allowedLanguagesResolver = new Mock<IAllowedLanguagesResolver>();
        target = new CurrentLanguageResolver(allowedLanguagesResolver.Object, globalizationConfiguration.Object);

        langs = new[]
        {
            TestLanguageInfo.Get("en-US"),
            TestLanguageInfo.Get("de-AT"),
        };
        allowedLanguagesResolver.SetupGet(r => r.Languages).Returns(langs);
    }

    [Theory]
    [InlineData("en-US", 0)]
    [InlineData("de-AT", 1)]
    public void GetCurrent_ShouldFindAllowedLanguage(string currentCulture, int expectedIndex)
    {
        Thread.CurrentThread.CurrentCulture = new CultureInfo(currentCulture);

        // Act
        target.Language.Should().BeSameAs(langs[expectedIndex]);
    }

    [Theory]
    [InlineData("en")]
    [InlineData("en-GB")]
    [InlineData("fr-FR")]
    public void GetCurrent_ShouldThrowIfNotAllowedCulture(string currentCulture)
    {
        CultureInfo.CurrentCulture = new CultureInfo(currentCulture);

        Func<object> act = () => target.Language;

        act.Should().Throw<InvalidOperationException>().WithMessage(
            $"Current culture '{currentCulture}' is NOT within range of configured allowed cultures: en-US, de-AT."
            + " Most likely some consumer code set it therefore overwrote culture resolved by Vanilla or the resolution wasn't executed yet.");
    }
}
