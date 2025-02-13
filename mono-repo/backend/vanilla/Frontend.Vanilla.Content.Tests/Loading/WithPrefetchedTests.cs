using System;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading;

public class WithPrefetchedTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var expiration = TimeSpan.FromSeconds(666);

        var target = new WithPrefetched<string>("req", new[] { "pre1", "pre2" }, expiration); // Act

        target.Requested.Should().Be("req");
        target.Prefetched.Should().Equal("pre1", "pre2");
        target.RelativeExpiration.Should().Be(expiration);
    }

    [Fact]
    public void ShouldCreateWithEmptyPrefetched()
    {
        var target = new WithPrefetched<string>("req"); // Act

        target.Requested.Should().Be("req");
        target.Prefetched.Should().BeEmpty();
        target.RelativeExpiration.Should().Be(TimeSpan.Zero);
    }
}
