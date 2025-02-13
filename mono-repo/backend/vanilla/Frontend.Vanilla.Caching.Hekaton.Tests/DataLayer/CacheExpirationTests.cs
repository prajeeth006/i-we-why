using System;
using FluentAssertions;
using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Caching.Hekaton.Tests.DataLayer;

public sealed class CacheExpirationTests
{
    [Fact]
    public void CreateAbsolute_ShouldCreateCorrectly()
    {
        var time = TestTime.GetRandomUtc();

        // Act
        var target = CacheExpiration.CreateAbsolute(time);

        target.AbsoluteExpiration.Should().Be(time);
        target.SlidingExpiration.Should().BeNull();
    }

    [Fact]
    public void CreateSliding_ShouldCreateCorrectly()
    {
        var timeSpan = TimeSpan.FromSeconds(RandomGenerator.GetInt32());

        // Act
        var target = CacheExpiration.CreateSliding(timeSpan);

        target.SlidingExpiration.Should().Be(timeSpan);
        target.AbsoluteExpiration.Should().BeNull();
    }
}
