using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.RtmsConnection;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RtmsConnection;

public class RtmsConfigurationTests
{
    private RtmsConfiguration target;

    public RtmsConfigurationTests()
        => target = new RtmsConfiguration(
            true,
            new Uri("https://rtms.bwin.com/gateway"),
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(15),
            Mock.Of<IDslExpression<bool>>(),
            new Regex("bla"),
            new Dictionary<string, DisabledEvents>(),
            new List<string>() { "error" },
            new List<string>() { "balance_update" },
            true,
            new TimeSpan(2, 2, 2));

    [Fact]
    public void ShouldBeValid()
        => target.Should().BeValid();

    [Theory]
    [InlineData("00:00:10")]
    [InlineData("00:00:05")]
    [InlineData("00:00:02")]
    public void ShouldBeInvalidIfReconnectIntervalNotTwoTimesGreaterThanKeepAliveInterval(string reconnectInterval)
    {
        target.ReconnectInterval = TimeSpan.Parse(reconnectInterval);
        target.Should().BeInvalidWithError(
            nameof(target.ReconnectInterval),
            $"{nameof(target.ReconnectInterval)}='{reconnectInterval}' must be greater than 2 times {nameof(target.KeepAliveInterval)}='00:00:05'.");
    }
}
