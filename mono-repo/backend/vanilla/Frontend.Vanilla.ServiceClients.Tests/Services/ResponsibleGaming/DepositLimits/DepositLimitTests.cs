using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.DepositLimits;

public sealed class DepositLimitTests
{
    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        const string json = @"{
                ""limits"": [
                    {
                      ""currentLimit"": 200,
                      ""type"": ""DAILY"",
                      ""limitSet"": true
                    },
                    {
                        ""currentLimit"": 500,
                        ""type"": ""WEEKLY"",
                        ""limitSet"": true
                    },
                    {
                        ""currentLimit"": null,
                        ""type"": ""MONTHLY"",
                        ""limitSet"": false
                    }]}";

        // Act
        var result = PosApiSerializationTester.Deserialize<DepositLimitResponse>(json).GetData();
        result.Should().BeEquivalentOrderedTo(
            new DepositLimit(200, "DAILY", true),
            new DepositLimit(500, "WEEKLY", true),
            new DepositLimit(null, "MONTHLY", false));
    }
}
