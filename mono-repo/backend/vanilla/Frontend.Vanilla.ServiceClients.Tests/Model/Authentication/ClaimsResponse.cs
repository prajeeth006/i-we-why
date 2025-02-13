using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Model.Authentication;

public class ClaimsResponseTests
{
    [Fact]
    public void ClaimsValues_ShouldBeNotInitializedCorrectly()
    {
        var target = new ClaimsResponse();

        target.ClaimValues.Should().BeEmpty();
        target.ClaimValues.Add("test", "case-insensitive");
        target.ClaimValues["TEST"].Should().Be("case-insensitive");
    }

    [Fact]
    public void ShouldDeserializeCorrectly()
    {
        const string json = @"{
                ""ClaimValues"": [
                    { ""Key"": ""http://api.bwin.com/v3/user/currency"", ""Value"": ""EUR"" },
                    { ""Key"": ""http://api.bwin.com/v3/user/nationality"", ""Value"": ""Borg"" },
                ]
            }";

        var target = PosApiSerializationTester.Deserialize<ClaimsResponse>(json); // Act

        target.ClaimValues.Should().Equal(
            new Dictionary<string, string>
            {
                { "http://api.bwin.com/v3/user/currency", "EUR" },
                { "http://api.bwin.com/v3/user/nationality", "Borg" },
            });
    }
}
