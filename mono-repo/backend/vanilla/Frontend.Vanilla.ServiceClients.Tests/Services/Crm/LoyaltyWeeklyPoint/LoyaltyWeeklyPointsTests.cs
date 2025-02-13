using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyWeeklyPoint;

public class LoyaltyWeeklyPointsTests
{
    [Theory]
    [InlineData(@"{ ""details"": null, ""points"": 9.8 }")]
    [InlineData(@"{ ""points"": 9.8 }")]
    public void ShouldBeDeserializedCorrectly(string json)
    {
        var target = PosApiSerializationTester.Deserialize<LoyaltyWeeklyPoints>(json).GetData();

        target.Should().NotBeNull();
        target.Points.Should().Be(9.8m);
    }
}
