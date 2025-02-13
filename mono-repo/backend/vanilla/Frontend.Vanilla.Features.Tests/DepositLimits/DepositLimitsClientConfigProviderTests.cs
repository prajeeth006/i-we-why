using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.DepositLimits;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DepositLimits;

public class DepositLimitsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IDepositLimitsConfiguration> config;

    public DepositLimitsClientConfigProviderTests()
    {
        config = new Mock<IDepositLimitsConfiguration>();

        Target = new DepositLimitsClientConfigProvider(config.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnItems()
    {
        var result = new Dictionary<string, IReadOnlyDictionary<string, decimal>>()
        {
            {
                "daily", new Dictionary<string, decimal>()
                {
                    { "*.", 55 },
                }
            },
        };
        config.Setup(c => c.LowThresholds).Returns(result);

        var clientConfig = await Target_GetConfigAsync();

        clientConfig["lowThresholds"].Should().Be(result);
    }
}
