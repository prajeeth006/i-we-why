using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Badge;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Badge;

public class BadgeClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IBadgeConfiguration> badgeConfiguration;

    public BadgeClientConfigProviderTests()
    {
        badgeConfiguration = new Mock<IBadgeConfiguration>();
        Target = new BadgeClientConfigProvider(badgeConfiguration.Object);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnBadge");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnBadgeConfig()
    {
        badgeConfiguration.SetupGet(c => c.CssClass).Returns("badge-default");

        var config = await Target_GetConfigAsync();
        var expect = new Dictionary<string, string>();
        expect.Add("cssClass", "badge-default");

        config.Should().BeEquivalentTo(expect);
    }
}
