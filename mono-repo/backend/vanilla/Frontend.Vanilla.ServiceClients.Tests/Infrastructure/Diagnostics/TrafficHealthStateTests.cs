using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Diagnostics;

public class TrafficHealthStateTests
{
    private ITrafficHealthState target;
    private Mock<IMemoryCache> cache;
    private HealthCheckResult state;

    public TrafficHealthStateTests()
    {
        var config = new ServiceClientsConfigurationBuilder
        {
            AccessId = "xxx",
            HealthInfoExpiration = new TimeSpan(666),
        };
        cache = new Mock<IMemoryCache>();
        state = HealthCheckResult.CreateSuccess("test");
        target = new TrafficHealthState(cache.Object, config.Build());
    }

    [Fact]
    public void Get_ShouldReturnNull_ByDefault()
        => target.Get().Should().BeNull();

    [Fact]
    public void Get_ShouldReturnState_IfCached()
    {
        object stateToReturn = state;
        cache.Setup(c => c.TryGetValue(It.IsAny<string>(), out stateToReturn)).Returns(true);

        var result = target.Get(); // Act

        result.Should().BeSameAs(state); // Act
    }

    [Fact]
    public void Set_ShouldSetToCache()
    {
        var entry = new Mock<ICacheEntry>();
        cache.Setup(c => c.CreateEntry(It.IsAny<string>())).Returns(entry.Object);

        // Act
        target.Set(state);

        entry.VerifySet(e => e.AbsoluteExpirationRelativeToNow = new TimeSpan(666));
        entry.Verify(e => e.Dispose());
    }
}
