using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.AssociatedAccounts;

public class AssociatedAccountTests
{
    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        const string json = @"{
                ""AssociatedAccount"": [
                    {
                        ""userName"": ""Nenad"",
                        ""foreignUserId"": ""bz_TESTPOS56846"",
                        ""loginDomainId"": 1,
                        ""loginDomainName"": ""bwin.com"",
                        ""sportsBookUserId"": 8305772
                    },
                    {
                        ""userName"": ""Hans"",
                        ""foreignUserId"": ""bz_TESTPOS52204"",
                        ""loginDomainId"": 2,
                        ""loginDomainName"": ""bwin.es"",
                        ""sportsBookUserId"": 8305777
                    }
                ]
            }";

        // Act
        var result = PosApiSerializationTester.Deserialize<AssociatedAccountsResponse>(json).GetData();

        result.Should().BeEquivalentOrderedTo(
            new AssociatedAccount("Nenad", "bz_TESTPOS56846", 1, "bwin.com", 8305772),
            new AssociatedAccount("Hans", "bz_TESTPOS52204", 2, "bwin.es", 8305777));
    }
}
