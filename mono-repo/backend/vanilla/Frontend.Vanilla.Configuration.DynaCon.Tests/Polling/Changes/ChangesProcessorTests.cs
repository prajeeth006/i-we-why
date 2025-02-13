using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.Changes;

public sealed class ChangesProcessorTests
{
    private IChangesProcessor target;
    private Mock<IChangesetDeserializer> deserializer;
    private Mock<IActivateChangesetScheduler> activationScheduler;
    private Mock<IConfigurationSnapshotFactory> snapshotFactory;
    private Mock<IHistoryLog<PastChangesetInfo>> pastChangesetsLog;
    private TestClock clock;

    private Mock<IConfigurationSnapshot> oldSnapshot;
    private IConfigurationSnapshot newSnapshot;
    private VariationHierarchyResponse ctxHierarchy;
    private IValidChangeset ActiveChangeset => oldSnapshot.Object.ActiveChangeset;

    public ChangesProcessorTests()
    {
        deserializer = new Mock<IChangesetDeserializer>();
        activationScheduler = new Mock<IActivateChangesetScheduler>();
        snapshotFactory = new Mock<IConfigurationSnapshotFactory>();
        pastChangesetsLog = new Mock<IHistoryLog<PastChangesetInfo>>();
        clock = new TestClock();
        target = new ChangesProcessor(deserializer.Object, activationScheduler.Object, snapshotFactory.Object, pastChangesetsLog.Object, clock);

        newSnapshot = Mock.Of<IConfigurationSnapshot>();
        oldSnapshot = new Mock<IConfigurationSnapshot>();
        ctxHierarchy = TestCtxHierarchy.Get();

        oldSnapshot.SetupGet(s => s.ActiveChangeset.Id).Returns(123);
        oldSnapshot.SetupGet(s => s.ActiveChangeset.ValidFrom).Returns(clock.UtcNow - TimeSpan.FromHours(8));
        oldSnapshot.SetupGet(s => s.FutureChangesets).Returns(Array.Empty<IChangeset>());
        pastChangesetsLog.Setup(l => l.GetItems()).Returns(Array.Empty<PastChangesetInfo>());
    }

    [Fact]
    public void ShouldAddNextChangesets()
    {
        var (changeset1, dto1) = MockChangeset(1, ActiveChangeset.ValidFrom - TimeSpan.FromDays(2)); // Validity before active changeset => deserialized, not activated
        var (changeset2, dto2) = MockChangeset(2, ActiveChangeset.ValidFrom + TimeSpan.FromDays(3));
        snapshotFactory.Setup(s => s.Recreate(oldSnapshot.Object, ActiveChangeset, new[] { changeset1, changeset2 })).Returns(newSnapshot);

        // Act
        var result = target.Process(oldSnapshot.Object, new[] { dto1, dto2 }, ctxHierarchy);

        result.Should().BeSameAs(newSnapshot);
        activationScheduler.Verify(s => s.ScheduleActivation(changeset2));
        activationScheduler.VerifyWithAnyArgs(s => s.ScheduleActivation(null), Times.Once());
    }

    [Fact]
    public void ShouldWrapDeserializationErrorToFailedChangeset()
    {
        var dto = TestConfigDto.Create(1);
        var failed = Mock.Of<IFailedChangeset>(c => c.Errors == new[] { new Exception() });
        var error = new ChangesetDeserializationException("Deserialization failed", failed);
        deserializer.Setup(d => d.Deserialize(dto, ctxHierarchy, ConfigurationSource.Service)).Throws(error);
        snapshotFactory.Setup(s => s.Recreate(oldSnapshot.Object, ActiveChangeset, ItIs.Equivalent<IEnumerable<IChangeset>>(new[] { failed }))).Returns(newSnapshot);

        // Act
        var result = target.Process(oldSnapshot.Object, new[] { dto }, ctxHierarchy);

        result.Should().BeSameAs(newSnapshot);
        activationScheduler.VerifyWithAnyArgs(s => s.ScheduleActivation(null), Times.Never);
    }

    [Fact]
    public void ShouldNotDeserialize_IfOutdated_OrInFuture_OrInPast_OrAlreadyActive()
    {
        var existingFuture = Mock.Of<IValidChangeset>(c => c.Id == 124 && c.ValidFrom == clock.UtcNow + TimeSpan.FromDays(1));
        var existingPast = new PastChangesetInfo(125, clock.UtcNow - TimeSpan.FromDays(-1), true);
        oldSnapshot.SetupGet(s => s.FutureChangesets).Returns(new IChangeset[] { existingFuture });
        pastChangesetsLog.Setup(s => s.GetItems()).Returns(new[] { existingPast });
        var changes = new[]
        {
            TestConfigDto.Create(ActiveChangeset.Id, clock.UtcNow + TimeSpan.FromDays(2)), // Duplicate of active
            TestConfigDto.Create(existingFuture.Id, clock.UtcNow + TimeSpan.FromDays(4)), // Duplicate of future
            TestConfigDto.Create(existingPast.Id, ActiveChangeset.ValidFrom + TimeSpan.FromDays(3)), // Duplicate of past
        };

        // Act
        var result = target.Process(oldSnapshot.Object, changes, ctxHierarchy);

        result.Should().BeSameAs(oldSnapshot.Object);
        deserializer.VerifyWithAnyArgs(d => d.Deserialize(null, null, default), Times.Never);
        snapshotFactory.VerifyWithAnyArgs(s => s.Recreate(null, null, null), Times.Never);
        activationScheduler.VerifyWithAnyArgs(s => s.ScheduleActivation(null), Times.Never);
    }

    [Fact]
    public void ShouldDiscoverChangesetSupposedToBeAlreadyActiveAndFilterNextAccordingly()
    {
        var (newActive, dto1) = MockChangeset(1, ActiveChangeset.ValidFrom.AddHours(2));
        var (discovered1, dto2) = MockChangeset(2, ActiveChangeset.ValidFrom.AddHours(1)); // Should not be activated b/c newActive is closer to now
        var (discovered2, dto3) = MockChangeset(3, ActiveChangeset.ValidFrom + TimeSpan.FromDays(2));
        snapshotFactory.Setup(s => s.Recreate(oldSnapshot.Object, newActive, new[] { discovered1, discovered2 })).Returns(newSnapshot);

        // Act
        var result = target.Process(oldSnapshot.Object, new[] { dto1, dto2, dto3 }, ctxHierarchy);

        result.Should().BeSameAs(newSnapshot);
        activationScheduler.Verify(s => s.ScheduleActivation(discovered2));
        activationScheduler.VerifyWithAnyArgs(s => s.ScheduleActivation(null), Times.Once);
    }

    private (IValidChangeset, ConfigurationResponse) MockChangeset(long id, UtcDateTime validFrom)
    {
        var dto = TestConfigDto.Create(id, validFrom);
        var changeset = Mock.Of<IValidChangeset>(c => c.Id == id && c.ValidFrom == validFrom);
        deserializer.Setup(d => d.Deserialize(dto, ctxHierarchy, ConfigurationSource.Service)).Returns(changeset);

        return (changeset, dto);
    }
}
