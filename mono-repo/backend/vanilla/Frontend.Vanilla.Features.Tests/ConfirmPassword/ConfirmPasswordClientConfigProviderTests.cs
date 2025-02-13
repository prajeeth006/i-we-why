using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ConfirmPassword;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ConfirmPassword;

public class ConfirmPasswordClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IConfirmPasswordConfiguration> confirmPasswordConfiguration;
    private Mock<IProductPlaceholderReplacer> productPlaceholderReplacer;

    public ConfirmPasswordClientConfigProviderTests()
    {
        confirmPasswordConfiguration = new Mock<IConfirmPasswordConfiguration>();
        productPlaceholderReplacer = new Mock<IProductPlaceholderReplacer>();
        productPlaceholderReplacer.Setup(o => o.ReplaceAsync(It.IsAny<ExecutionMode>(), It.IsAny<string>())).ReturnsAsync("m.bwin.com/mobileportal/confirm");
        Target = new ConfirmPasswordClientConfigProvider(confirmPasswordConfiguration.Object, productPlaceholderReplacer.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnConfirmPasswordConfig()
    {
        confirmPasswordConfiguration.Setup(c => c.IsEnabled).Returns(true);
        confirmPasswordConfiguration.SetupGet(n => n.RedirectUrl).Returns("{portal}/mobileportal/confirm");

        var config = await Target_GetConfigAsync();

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "isEnabled", true },
            { "redirectUrl", "m.bwin.com/mobileportal/confirm" },
        });
    }
}
