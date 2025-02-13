using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.RememberMe;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RememberMe;

public class RememberMeClientConfigProviderTests
{
    private LambdaClientConfigProvider target;
    private RememberMeConfiguration config;
    private Mock<INativeApplicationDslProvider> nativeApplicationDslProvider;

    public RememberMeClientConfigProviderTests()
    {
        config = new RememberMeConfiguration
        {
            IsEnabled = true,
            ApiHost = new HttpUri("http://bwin.com"),
            SkipRetryPaths = ["/api/balance"],
        };
        nativeApplicationDslProvider = new Mock<INativeApplicationDslProvider>();
        target = new RememberMeClientConfigProvider(config, nativeApplicationDslProvider.Object);
    }

    [Fact]
    public async Task ShouldReturnConfigCorrectly()
    {
        await RunEnabledTest();
    }

    [Fact]
    public async Task ShouldReturnEnabled_IfNativeWrapper()
    {
        nativeApplicationDslProvider.Setup(p => p.IsNative()).Returns(true);
        nativeApplicationDslProvider.Setup(p => p.IsNativeWrapper()).Returns(true);
        await RunEnabledTest();
    }

    [Fact]
    public async Task ShouldReturnDisabled_IfConfigDisabled()
    {
        config.IsEnabled = false;
        await RunDisabledTest();
    }

    [Fact]
    public async Task ShouldReturnDisabled_IfNative_ButNotNativeWrapper()
    {
        nativeApplicationDslProvider.Setup(p => p.IsNative()).Returns(true);
        nativeApplicationDslProvider.Setup(p => p.IsNativeWrapper()).Returns(false);
        await RunDisabledTest();
    }

    private async Task RunEnabledTest()
    {
        var result = await target.GetClientConfigAsync(default); // Act

        result.Should().BeEquivalentTo(new
        {
            IsEnabled = true,
            ApiHost = new HttpUri("http://bwin.com"),
            SkipRetryPaths = new[] { "/api/balance" },
        });
    }

    private async Task RunDisabledTest()
    {
        var result = await target.GetClientConfigAsync(default); // Act

        result.Should().BeEquivalentTo(new { IsEnabled = false });
    }
}
