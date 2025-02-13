using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.MyBets.CustomerHasBets;

public sealed class CustomerHasBetsResponseTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        const string json = @"{""hasBets"": true }";

        var target = PosApiSerializationTester.Deserialize<CustomerHasBetsResponse>(json); // Act

        target.HasBets.Should().Be(true);
    }
}
