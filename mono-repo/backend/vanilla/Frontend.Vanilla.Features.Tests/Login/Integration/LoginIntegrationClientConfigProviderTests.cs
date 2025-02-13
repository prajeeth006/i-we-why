using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Login.Integration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login.Integration;

public class LoginIntegrationClientConfigProviderTests
{
    private IClientConfigProvider configurationProvider;
    private Mock<ILoginIntegrationConfiguration> configurationMock;

    public LoginIntegrationClientConfigProviderTests()
    {
        configurationMock = new Mock<ILoginIntegrationConfiguration>();
        configurationProvider = new LoginIntegrationClientConfigProvider(configurationMock.Object);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        configurationProvider.Name.Should().Be("vnLoginIntegration");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldBeEnabled()
    {
        configurationMock.SetupGet(o => o.Type).Returns("test");
        configurationMock.SetupGet(o => o.Options).Returns(new LoginIntegrationOptions("bar", "dafaf", "logout", null, "relay", "standalone", 2));

        dynamic config = await configurationProvider.GetClientConfigAsync(TestContext.Current.CancellationToken);

        ((string)config.Type).Should().Be("test");
        ((int)config.Options.Version).Should().Be(2);
    }
}
