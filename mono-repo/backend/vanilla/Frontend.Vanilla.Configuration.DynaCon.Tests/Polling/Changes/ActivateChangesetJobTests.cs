using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.Changes;

public sealed class ActivateChangesetJobTests
{
    private IActivateChangesetJob target;
    private Mock<IValidChangeset> changeset;
    private Mock<IConfigurationContainer> container;
    private Mock<IConfigurationSnapshotFactory> snapshotFactory;
    private TestLogger<ActivateChangesetJob> log;

    private Mock<IConfigurationSnapshot> oldSnapshot;
    private IConfigurationSnapshot newSnapshot;

    public ActivateChangesetJobTests()
    {
        changeset = new Mock<IValidChangeset>();
        container = new Mock<IConfigurationContainer>();
        snapshotFactory = new Mock<IConfigurationSnapshotFactory>();
        log = new TestLogger<ActivateChangesetJob>();
        target = new ActivateChangesetJob(changeset.Object, container.Object, snapshotFactory.Object, log);

        oldSnapshot = new Mock<IConfigurationSnapshot> { DefaultValue = DefaultValue.Mock };
        newSnapshot = null;
        oldSnapshot.SetupGet(s => s.ActiveChangeset.Id).Returns(123);
        oldSnapshot.SetupGet(s => s.ActiveChangeset.ValidFrom).Returns(new UtcDateTime(2000, 1, 1));
        changeset.SetupGet(c => c.Id).Returns(456);
        changeset.SetupGet(c => c.ValidFrom).Returns(oldSnapshot.Object.ActiveChangeset.ValidFrom + TimeSpan.FromDays(4));
        container.SetupWithAnyArgs(c => c.SetSnapshot(null)).Callback<SetSnapshotDelegate>(f => newSnapshot = f(oldSnapshot.Object));
    }

    [Fact]
    public void ShouldActivateChangeset()
    {
        var next = Mock.Of<IChangeset>(c => c.Id == 222 && c.ValidFrom == oldSnapshot.Object.ActiveChangeset.ValidFrom + TimeSpan.FromDays(10));
        var clonedSnapshot = Mock.Of<IConfigurationSnapshot>();
        oldSnapshot.SetupGet(s => s.FutureChangesets).Returns(new[] { next, changeset.Object });
        snapshotFactory.Setup(f => f.Recreate(oldSnapshot.Object, changeset.Object, null)).Returns(clonedSnapshot);

        // Act
        target.Execute();

        newSnapshot.Should().BeSameAs(clonedSnapshot);
    }

    [Fact]
    public void ShouldFailIfChangesetNotInNextOnes()
    {
        // Act
        target.Execute();

        newSnapshot.Should().BeNull();
        VerifyFailedActivationLogged("Changeset is no longer scheduled as the next one.");
    }

    [Fact]
    public void ShouldFailIfChangesetAlreadyActivated()
    {
        oldSnapshot.SetupGet(s => s.ActiveChangeset.Id).Returns(changeset.Object.Id);
        oldSnapshot.SetupGet(s => s.FutureChangesets).Returns(new[] { changeset.Object });

        // Act
        target.Execute();

        newSnapshot.Should().BeNull();
        VerifyFailedActivationLogged("Changeset is already activated.");
    }

    [Fact]
    public void ShouldFailIfChangesetOutdated()
    {
        changeset.SetupGet(c => c.ValidFrom).Returns(oldSnapshot.Object.ActiveChangeset.ValidFrom + TimeSpan.FromDays(-2));
        oldSnapshot.SetupGet(s => s.FutureChangesets).Returns(new[] { changeset.Object });

        // Act
        target.Execute();

        newSnapshot.Should().BeNull();
        VerifyFailedActivationLogged("There is already newer changeset (123) activated.");
    }

    private void VerifyFailedActivationLogged(string innerMessage)
        => log.Logged.Single().Verify(LogLevel.Error, ex => ex.Message == innerMessage, data: ("id", 456));
}
