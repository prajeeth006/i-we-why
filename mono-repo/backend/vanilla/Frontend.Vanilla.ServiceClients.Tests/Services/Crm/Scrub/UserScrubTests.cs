using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.Scrub;

public class UserScrubTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{ ""playerScrubbed"": true, ""productList"": [""casino"", ""sports""] }";

        var target = PosApiSerializationTester.Deserialize<UserScrub>(json); // Act

        target.PlayerScrubbed.Should().Be(true);
        target.ProductList.Should().BeEquivalentTo("casino", "sports");
    }
}
