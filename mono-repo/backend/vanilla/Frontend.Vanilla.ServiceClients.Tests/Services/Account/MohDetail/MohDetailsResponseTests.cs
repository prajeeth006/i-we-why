using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.MohDetail;

public class MohDetailsResponseTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<MohDetailsResponse>(@"{
                ""comments"": ""some co"",
                ""countryCode"": ""GB"",
                ""exclDays"": 12,
                ""mohPrimaryReasonCode"": 1,
                ""mohPrimaryRiskBandCode"": 5,
                ""mohPrimaryProductCode"": 4,
                ""mohPrimaryToolCode"": 3,
                ""mohScore"": 35,
                ""processed"": ""true"",
                ""vipUser"": ""false""
            }");

        target.Should().BeEquivalentTo(
            new MohDetailsResponse(
                "some co",
                "GB",
                12,
                1,
                5,
                4,
                3,
                35,
                "true",
                "false"));
    }
}
