using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Caching.Hekaton.Tests.DataLayer;

public sealed class CacheExpirationCalculatorTests
{
    private ICacheExpirationCalculator target;
    private Mock<IHekatonConfiguration> config;
    private TestClock clock;
    private TestLogger<CacheExpirationCalculator> log;

    public CacheExpirationCalculatorTests()
    {
        config = new Mock<IHekatonConfiguration>();
        config.SetupGet(c => c.MinExpirationTime).Returns(TimeSpan.FromSeconds(10));
        config.SetupGet(c => c.MaxExpirationTime).Returns(TimeSpan.FromSeconds(60));
        clock = new TestClock();
        log = new TestLogger<CacheExpirationCalculator>();
        target = new CacheExpirationCalculator(config.Object, clock, log);
    }

    [Fact]
    public void ShouldCreateAbsolute_WithoutWarnings()
    {
        var options = new DistributedCacheEntryOptions { AbsoluteExpiration = clock.UtcNow.AddSeconds(20).ValueWithOffset };

        // Act
        var result = target.Calculate(options, "kkk");

        result.AbsoluteExpiration.Should().Be(clock.UtcNow.AddSeconds(20));
        log.VerifyNothingLogged();
    }

    public static IEnumerable<object[]> WarningTestData => new[]
    {
        new object[] { 5, nameof(HekatonConfiguration.MinExpirationTime).ToCamelCase(), 10 },
        new object[] { 70, nameof(HekatonConfiguration.MaxExpirationTime).ToCamelCase(), 60 },
    };

    [Theory, MemberData(nameof(WarningTestData))]
    public void ShouldCreateAbsolute_WithWarnings(int expirationSeconds, string loggedKey, int loggedSeconds)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpiration = clock.UtcNow.AddSeconds(expirationSeconds).ValueWithOffset,
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(22),
            SlidingExpiration = TimeSpan.FromSeconds(33),
        };

        // Act
        var result = target.Calculate(options, "kkk");

        result.AbsoluteExpiration.Should().Be(clock.UtcNow.AddSeconds(expirationSeconds));
        log.Logged.Should().HaveCount(3);
        log.Logged[0].Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("relExpiration", TimeSpan.FromSeconds(expirationSeconds)),
            (loggedKey, TimeSpan.FromSeconds(loggedSeconds)));
        log.Logged[1].Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("uselessProperty", nameof(options.AbsoluteExpirationRelativeToNow)),
            ("uselessValue", TimeSpan.FromSeconds(22)),
            ("activeProperty", nameof(options.AbsoluteExpiration)));
        log.Logged[2].Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("uselessProperty", nameof(options.SlidingExpiration)),
            ("uselessValue", TimeSpan.FromSeconds(33)),
            ("activeProperty", nameof(options.AbsoluteExpiration)));
    }

    [Fact]
    public void ShouldCreateAbsolutRelativeToNowe_WithoutWarnings()
    {
        var options = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(20) };

        // Act
        var result = target.Calculate(options, "kkk");

        result.AbsoluteExpiration.Should().Be(clock.UtcNow.AddSeconds(20));
        log.VerifyNothingLogged();
    }

    [Theory, MemberData(nameof(WarningTestData))]
    public void ShouldCreateAbsoluteRelativeToNow_WithWarnings(int expirationSeconds, string loggedKey, int loggedSeconds)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(expirationSeconds),
            SlidingExpiration = TimeSpan.FromSeconds(33),
        };

        // Act
        var result = target.Calculate(options, "kkk");

        result.AbsoluteExpiration.Should().Be(clock.UtcNow.AddSeconds(expirationSeconds));
        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("relExpiration", TimeSpan.FromSeconds(expirationSeconds)),
            (loggedKey, TimeSpan.FromSeconds(loggedSeconds)));
        log.Logged[1].Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("uselessProperty", nameof(options.SlidingExpiration)),
            ("uselessValue", TimeSpan.FromSeconds(33)),
            ("activeProperty", nameof(options.AbsoluteExpirationRelativeToNow)));
    }

    [Fact]
    public void ShouldCreateSliding_WithoutWarnings()
    {
        var options = new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromSeconds(20) };

        // Act
        var result = target.Calculate(options, "kkk");

        result.SlidingExpiration.Should().Be(TimeSpan.FromSeconds(20));
        log.VerifyNothingLogged();
    }

    [Theory, MemberData(nameof(WarningTestData))]
    public void ShouldCreateSliding_WithWarnings(int expirationSeconds, string loggedKey, int loggedSeconds)
    {
        var options = new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromSeconds(expirationSeconds) };

        // Act
        var result = target.Calculate(options, "kkk");

        result.SlidingExpiration.Should().Be(TimeSpan.FromSeconds(expirationSeconds));
        log.Logged.Single().Verify(LogLevel.Warning,
            ("key", "kkk"),
            ("relExpiration", TimeSpan.FromSeconds(expirationSeconds)),
            (loggedKey, TimeSpan.FromSeconds(loggedSeconds)));
    }
}
