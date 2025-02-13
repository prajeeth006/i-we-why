using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

public class StaticContentRegionResolverTests
{
    private IContentRegionResolver target;

    public StaticContentRegionResolverTests()
    {
        target = new StaticContentRegionResolver();
    }

    [Fact]
    public void GetCurrentLanguageCode_ShouldReturnCultureTwoLetterCode()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("de-AT"));
        target.GetCurrentLanguageCode().Should().Be("de");
    }

    [Fact]
    public void GetUserCountryCode_ShouldReturnRegionTwoLetterCode()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("de-AT"));
        target.GetUserCountryCode().Should().Be("AT");
    }
}
