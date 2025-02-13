using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.OfflinePage;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.OfflinePage;

public class OfflinePageClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IOfflinePageConfiguration> offlinePageConfiguration;

    public OfflinePageClientConfigProviderTests()
    {
        offlinePageConfiguration = new Mock<IOfflinePageConfiguration>();

        offlinePageConfiguration.SetupGet(o => o.PollInterval).Returns(new TimeSpan(0, 0, 35));
        Target = new OfflinePageClientConfigProvider(offlinePageConfiguration.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnOfflinePageConfig()
    {
        var config = await Target_GetConfigAsync();

        config["pollInterval"].Should().Be(35000);
    }
}
