using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ScreenTime;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ScreenTime;

public class ScreenTimeClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IScreenTimeConfiguration> screenTimConfiguration;

    public ScreenTimeClientConfigProviderTests()
    {
        screenTimConfiguration = new Mock<IScreenTimeConfiguration>();

        Target = new ScreenTimeClientConfigProvider(screenTimConfiguration.Object);

        screenTimConfiguration.SetupGet(c => c.MinimumScreenTime).Returns(TimeSpan.FromSeconds(5));
        screenTimConfiguration.SetupGet(c => c.MinimumUpdateInterval).Returns(TimeSpan.FromSeconds(7));
        screenTimConfiguration.SetupGet(c => c.IdleTimeout).Returns(TimeSpan.FromSeconds(10));
    }

    [Fact]
    public async Task GetClientConfigTests()
    {
        var config = await Target_GetConfigAsync();

        config["minimumScreenTime"].Should().Be(5000);
        config["minimumUpdateInterval"].Should().Be(7000);
        config["idleTimeout"].Should().Be(10000);
    }
}
