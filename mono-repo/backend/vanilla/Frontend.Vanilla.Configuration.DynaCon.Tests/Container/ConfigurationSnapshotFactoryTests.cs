using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Container;

public sealed class ConfigurationSnapshotFactoryTests
{
    private IConfigurationSnapshotFactory target;
    private Mock<IHistoryLog<PastChangesetInfo>> pastChangesetsLog;
    private TestClock clock;

    public ConfigurationSnapshotFactoryTests()
    {
        pastChangesetsLog = new Mock<IHistoryLog<PastChangesetInfo>>();
        clock = new TestClock();
        target = new ConfigurationSnapshotFactory(pastChangesetsLog.Object, clock);
    }

    [Fact]
    public void ShouldSortOutChangesets()
    {
        var oldActive = Get<IValidChangeset>(validFrom: -2);
        var newActive = Get<IValidChangeset>(validFrom: -1);
        var oldFuture = Get<IValidChangeset>(validFrom: 5);
        var newFuture1 = Get<IValidChangeset>(validFrom: 6);
        var newFuture2 = Get<IFailedChangeset>(validFrom: 4);
        var past1 = Get<IValidChangeset>(validFrom: -4);
        var past2 = Get<IFailedChangeset>(validFrom: -6);
        var oldSnapshot = new ConfigurationSnapshot(oldActive, new[] { newActive, oldFuture });

        // Act
        var result = target.Recreate(oldSnapshot, newActive, new IChangeset[] { newFuture1, newFuture2, past1, past2 });

        result.Should().BeEquivalentTo(new ConfigurationSnapshot(newActive, new IChangeset[] { oldFuture, newFuture1, newFuture2 }));
        pastChangesetsLog.Invocations.Single().Arguments.Single().Should().BeEquivalentTo(new[]
        {
            new PastChangesetInfo(oldActive.Id, oldActive.ValidFrom, isValid: true),
            new PastChangesetInfo(past1.Id, past1.ValidFrom, isValid: true),
            new PastChangesetInfo(past2.Id, past2.ValidFrom, isValid: false),
        });
    }

    [Fact]
    public void ShouldKeep_IfNothingSpecified()
    {
        var oldSnapshot =
            new ConfigurationSnapshot(Get<IValidChangeset>(validFrom: -1), new[] { Get<IValidChangeset>(validFrom: 1), Get<IValidChangeset>(validFrom: 2) });

        // Act
        var result = target.Recreate(oldSnapshot);

        result.Should().BeEquivalentTo(oldSnapshot);
    }

    [Fact]
    public void ShouldThrow_IfActiveChangesetFromFuture()
    {
        var oldSnapshot = new ConfigurationSnapshot(Get<IValidChangeset>(-1));
        var invalidActive = Get<IValidChangeset>(validFrom: 10);

        Action act = () => target.Recreate(oldSnapshot, invalidActive);

        act.Should().Throw<Exception>().Which.Message.Should().ContainAll(
            nameof(oldSnapshot.ActiveChangeset), nameof(IChangeset.ValidFrom), invalidActive.Id, clock.UtcNow);
    }

    [Fact]
    public void ShouldThrow_IfOverridesExistAtThisPoint()
    {
        var active = Get<IValidChangeset>(validFrom: -1);
        var oldSnapshot = new ConfigurationSnapshot(active, overriddenChangeset: Mock.Of<IValidChangeset>(c => c.Id == active.Id));

        Action act = () => target.Recreate(oldSnapshot);

        act.Should().Throw<Exception>().Which.Message.Should().Contain(nameof(oldSnapshot.OverriddenChangeset));
    }

    private TChangeset Get<TChangeset>(int validFrom = 0)
        where TChangeset : class, IChangeset
        => Mock.Of<TChangeset>(c => c.Id == RandomGenerator.GetInt32() && c.ValidFrom == clock.UtcNow.AddHours(validFrom));
}
