using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.AbuserInformation;

public class MohDetailsTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<BonusAbuserInformationResponse>(@"{
                ""valueSegmentId"": 1,
                ""sportsBettingFactor"": 2.3,
                ""isBonusAbuser"": true
            }");

        target.IsBonusAbuser.Should().BeTrue();
    }
}
