using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.ActivityPopup;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ActivityPopup;

public class ActivityPopupClientConfigProviderTests : ClientConfigProviderTestsBase
{
    [Fact]
    public async Task GetClientConfiguration_ReturnsConfig()
    {
        var activityPopupConfiguration = new Mock<IActivityPopupConfiguration>();
        activityPopupConfiguration.SetupGet(o => o.Timeout).Returns(new TimeSpan(0, 20, 0));
        var clientContentService = new Mock<IVanillaClientContentService>();

        Target = new ActivityPopupClientConfigProvider(activityPopupConfiguration.Object, clientContentService.Object);

        var clientConfiguration = await Target_GetConfigAsync(); // Act

        Target.Name.Should().Be("vnActivityPopup");
        clientConfiguration.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "timeout", 1200000.0 },
            { "resources", null },
        });
    }
}
