using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.EdsGroup;

public class EdsGroupOptInTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var json = @"{ ""optinStatus"": true }";

        // Act
        var result = PosApiSerializationTester.Deserialize<EdsGroupOptInResponse>(json);

        result.OptinStatus.Should().BeTrue();
    }
}
