#nullable enable

using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Visitor;

public class VisitorSettingsTests
{
    [Fact]
    public void ShouldCreateEmpty()
    {
        // Act
        var target = new VisitorSettings();

        target.CultureName.Should().BeNull();
        target.VisitCount.Should().Be(0);
        target.SessionStartTime.Should().Be(default);
        target.PreviousSessionStartTime.Should().Be(default);
    }

    [Fact]
    public void ShouldCreateWithGivenValues()
    {
        var cultureName = Guid.NewGuid().ToString();
        var visitCount = RandomGenerator.GetInt32();
        var sessionStartTime = TestTime.GetRandomUtc();
        var previousSessionStartTime = TestTime.GetRandomUtc();
        var lastSessionId = Guid.NewGuid().ToString();

        // Act
        var target = new VisitorSettings(cultureName, visitCount, sessionStartTime, previousSessionStartTime);

        target.CultureName.Should().Be(cultureName);
        target.VisitCount.Should().Be(visitCount);
        target.SessionStartTime.Should().Be(sessionStartTime);
        target.PreviousSessionStartTime.Should().Be(previousSessionStartTime);
    }

    [Fact]
    public void ShouldRecreateWithOriginalValues()
    {
        var original = new VisitorSettings(Guid.NewGuid().ToString(), RandomGenerator.GetInt32(), TestTime.GetRandomUtc(), TestTime.GetRandomUtc());

        // Act
        var target = original.With();

        target.Should().NotBeSameAs(original)
            .And.BeEquivalentTo(original);
    }

    [Fact]
    public void ShouldRecreateWithNewValues()
    {
        var original = new VisitorSettings(Guid.NewGuid().ToString(), RandomGenerator.GetInt32(), TestTime.GetRandomUtc(), TestTime.GetRandomUtc());

        var cultureName = Guid.NewGuid().ToString();
        var visitCount = RandomGenerator.GetInt32();
        var sessionStartTime = TestTime.GetRandomUtc();
        var previousSessionStartTime = TestTime.GetRandomUtc();
        var lastSessionId = Guid.NewGuid().ToString();

        // Act
        var target = original.With(cultureName, visitCount, sessionStartTime, previousSessionStartTime, lastSessionId);

        target.CultureName.Should().Be(cultureName);
        target.VisitCount.Should().Be(visitCount);
        target.SessionStartTime.Should().Be(sessionStartTime);
        target.PreviousSessionStartTime.Should().Be(previousSessionStartTime);
    }
}
