using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims;

public class ClaimsCacheTimeTests
{
    [Fact]
    public void ShouldReturnUserDataCacheTime()
    {
        var config = new ServiceClientsConfigurationBuilder
        {
            AccessId = "xxx",
            UserDataCacheTime = new TimeSpan(666),
        }.Build();
        IClaimsCacheTime target = new ClaimsCacheTime(config);

        target.Value.Should().Be(new TimeSpan(666)); // Act
        target.AnonymousClaimCacheTime.Should().Be(new TimeSpan(666)); // Act
    }
}
