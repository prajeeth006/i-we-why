using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.MohDetail;

public class MohDetailsTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<MohDetailsResponse>(@"{
                ""mohPrimaryRiskBandCode"": 5
            }");

        target.MohPrimaryRiskBandCode.Should().Be(5);
    }
}
