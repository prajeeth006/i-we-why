using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.OfferStatuses;

public class OfferStatusResponseTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var json = @"{ ""status"": ""foo"" }";

        // Act
        var result = PosApiSerializationTester.Deserialize<OfferStatusResponse>(json);

        result.Status.Should().Be("foo");
    }
}
