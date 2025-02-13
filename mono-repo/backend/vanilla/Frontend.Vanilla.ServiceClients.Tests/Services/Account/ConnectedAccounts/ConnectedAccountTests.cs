using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.ConnectedAccounts;

public class ConnectedAccountTests
{
    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        const string json = @"{
                ""unregisteredBrands"": [
                    {
                        ""key"": ""Nenad"",
                        ""value"": ""true""
                    },
                    {
                        ""key"": ""Hans"",
                        ""value"": ""false""
                    }
                ]
            }";

        // Act
        var result = PosApiSerializationTester.Deserialize<ConnectedAccountsResponse>(json).GetData();

        result.Should().BeEquivalentOrderedTo(
            new ConnectedAccount("Nenad", "true"),
            new ConnectedAccount("Hans", "false"));
    }
}
