using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.CurrentSession;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.CurrentSession;

public class CurrentSessionClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<ILoginExpirationProvider> loginExpirationProvider;

    public CurrentSessionClientConfigProviderTests()
    {
        loginExpirationProvider = new Mock<ILoginExpirationProvider>();

        Target = new CurrentSessionClientConfigProvider(loginExpirationProvider.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnConfig()
    {
        loginExpirationProvider.Setup(c => c.GetRemainingTimeAndLoginDurationInMillisecondsAsync(It.IsAny<CancellationToken>())).ReturnsAsync((5L, 6L));

        var config = await Target_GetConfigAsync(); // Act

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "remainingLoginTime", 5L },
            { "loginDuration", 6L },
        });
    }
}
