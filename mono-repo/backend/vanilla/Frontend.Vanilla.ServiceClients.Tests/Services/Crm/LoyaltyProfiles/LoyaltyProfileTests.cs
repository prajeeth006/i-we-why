using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyProfiles;

public class LoyaltyProfileTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""category"": ""PRNOLTY"",
                ""points"":0.12,
                ""isOptInEnabled"": true,
                ""extraPoints"": 1.23,
                ""usedMarketPoints"": 2.34,
                ""expiredMarketPoints"": 3.45,
                ""cancelledPoints"": 4.56,
                ""otherDeductedPoints"": 5.67,
                ""monthlyPoints"": 8.91,
                ""pointsToRequalify"": 1.67,
                ""monthlyPointsSetDate"": ""/Date(1317978268000)/"",
                ""nextDowngradeTime"": ""/Date(1317978268000)/"",
                ""pointsToUpgrade"": 50.67,
                ""productwiseMarketPoints"": [
                    { ""productId"": ""sports"", ""gamePoints"": 10.00 },
                    { ""productId"": ""poker"", ""gamePoints"": 20.00 }
                ]
            }";

        // Act
        var target = PosApiSerializationTester.Deserialize<LoyaltyProfile>(json);

        target.Should().BeEquivalentTo(
            new LoyaltyProfile(
                category: "PRNOLTY",
                points: 0.12m,
                isOptInEnabled: true,
                extraPoints: 1.23m,
                usedMarketPoints: 2.34m,
                expiredMarketPoints: 3.45m,
                cancelledPoints: 4.56m,
                otherDeductedPoints: 5.67m,
                monthlyPoints: 8.91m,
                pointsToRequalify: 1.67m,
                pointsToUpgrade: 50.67m,
                nextDowngradeTime: new UtcDateTime(2011, 10, 07, 09, 04, 28),
                monthlyPointsSetDate: new UtcDateTime(2011, 10, 07, 09, 04, 28),
                productWiseMarketPoints: new[]
                {
                    new ProductWiseMarketPoints(productId: "sports", gamePoints: 10m),
                    new ProductWiseMarketPoints(productId: "poker", gamePoints: 20m),
                }));
    }
}
