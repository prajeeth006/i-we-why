using System;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Container;

public sealed class ConfigurationContainerTests
{
    private ConfigurationContainer target;

    public ConfigurationContainerTests()
        => target = new ConfigurationContainer();

    [Fact]
    public void ShouldSetAndGetSnapshot()
    {
        var snapshot = new ConfigurationSnapshot(Mock.Of<IValidChangeset>());
        target.SetSnapshot(s =>
        {
            s.Should().BeNull();

            return snapshot;
        });
        target.GetSnapshot().Should().BeSameAs(snapshot);
    }

    [Fact]
    public void ShouldThrowIfSnapshotNotSet()
        => new Action(() => target.GetSnapshot())
            .Should().Throw<InvalidOperationException>().WithMessage("Configuration snapshot hasn't been initialized yet.");

    [Fact]
    public void ShouldNotAllowNullSnapshot()
        => new Action(() => target.SetSnapshot(s => null))
            .Should().Throw<InvalidOperationException>().WithMessage("Configuration snapshot can't be set to null.");

    [Fact]
    public void ShouldLockDuringSet()
    {
        var wasLocked = false;
        target.Lock.IsHeldByCurrentThread.Should().BeFalse();

        // Act
        target.SetSnapshot(s =>
        {
            wasLocked = target.Lock.IsHeldByCurrentThread;

            return new ConfigurationSnapshot(Mock.Of<IValidChangeset>());
        });

        wasLocked.Should().BeTrue();
        target.Lock.IsHeldByCurrentThread.Should().BeFalse();
    }
}
