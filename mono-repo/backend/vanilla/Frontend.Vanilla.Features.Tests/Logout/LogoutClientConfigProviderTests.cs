using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Logout;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logout;

public class LogoutClientConfigProviderTests
{
    private LambdaClientConfigProvider target;
    private Mock<ILogoutConfiguration> logoutConfiguration;

    public LogoutClientConfigProviderTests()
    {
        logoutConfiguration = new Mock<ILogoutConfiguration>();
        target = new LogoutClientConfigProvider(logoutConfiguration.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnLogoutConfig()
    {
        logoutConfiguration.SetupGet(c => c.LogoutMessage).Returns("test");

        dynamic config = await target.GetClientConfigAsync(CancellationToken.None); // Act

        ((object)config.LogoutMessage).Should().Be("test");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnEmptyString_IfNoResult()
    {
        dynamic config = await target.GetClientConfigAsync(CancellationToken.None); // Act

        ((object)config.LogoutMessage).Should().Be(string.Empty);
    }
}
