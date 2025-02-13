using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.LoyaltyProfiles;

public class BasicLoyaltyProfileTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""category"":""B"",
                ""points"":0.12,
                ""isOptInEnabled"":true
            }";

        // Act
        IPosApiResponse<BasicLoyaltyProfile> dto = PosApiSerializationTester.Deserialize<BasicLoyaltyProfile>(json);
        var response = dto.GetData();

        response.Should().BeEquivalentTo(
            new BasicLoyaltyProfile(
                category: "B",
                points: 0.12M,
                isOptInEnabled: true));
    }
}
