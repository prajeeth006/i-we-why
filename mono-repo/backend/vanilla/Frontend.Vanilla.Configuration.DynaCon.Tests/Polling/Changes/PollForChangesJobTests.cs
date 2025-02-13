using System;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.Changes;

public sealed class PollForChangesJobTests
{
    private IScheduledJob target;
    private Mock<IConfigurationContainer> container;
    private IConfigurationSnapshot containerSnapshot;
    private Mock<IConfigurationRestService> restService;
    private Mock<IChangesProcessor> processor;
    private VariationContextHierarchy ctxHierarchy;
    private TestLogger<PollForChangesJob> log;

    private ConfigurationResponse[] changes;
    private IConfigurationSnapshot initialSnapshot;
    private IConfigurationSnapshot processedSnapshot;

    public PollForChangesJobTests()
    {
        container = new Mock<IConfigurationContainer> { DefaultValue = DefaultValue.Mock };
        restService = new Mock<IConfigurationRestService>();
        processor = new Mock<IChangesProcessor>();
        ctxHierarchy = TestCtxHierarchy.Get();
        log = new TestLogger<PollForChangesJob>();
        target = new PollForChangesJob(container.Object, restService.Object, processor.Object, ctxHierarchy.AsCurrent(), log);

        initialSnapshot = Mock.Of<IConfigurationSnapshot>(s => s.LatestChangeset.Id == 111L);
        processedSnapshot = Mock.Of<IConfigurationSnapshot>();
        changes = new[] { TestConfigDto.Create(222), TestConfigDto.Create(333) };

        // Setup container to preserve snapshot
        container.Setup(s => s.GetSnapshot()).Returns(() => containerSnapshot);
        container.SetupWithAnyArgs(c => c.SetSnapshot(null)).Callback<SetSnapshotDelegate>(f => containerSnapshot = f(containerSnapshot));
        containerSnapshot = initialSnapshot;

        // Setup of the execution
        restService.Setup(s => s.GetConfigurationChanges(initialSnapshot.LatestChangeset.Id)).Returns(() => changes);
        processor.Setup(p => p.Process(containerSnapshot, changes, ctxHierarchy)).Returns(processedSnapshot);
    }

    [Fact]
    public void GetInterval_ShouldComeFromSettings()
    {
        var settings = TestSettings.Get(s => s.ChangesPollingInterval = TimeSpan.FromSeconds(66));
        target.GetInterval(settings).Should().Be(TimeSpan.FromSeconds(66));
    }

    [Fact]
    public void Execute_ShouldProcessAllChanges()
    {
        // Act
        target.Execute();

        containerSnapshot.Should().BeSameAs(processedSnapshot);
        log.Logged.Single().Verify(
            LogLevel.Information,
            ("fromChangesetId", 111),
            ("changes", "222, 333"));
        container.VerifyWithAnyArgs(c => c.SetSnapshot(null), Times.Once());
    }

    [Fact]
    public void Execute_ShouldNotProcess_IfNoDataDownloaded()
    {
        changes = Array.Empty<ConfigurationResponse>();

        // Act
        target.Execute();

        containerSnapshot.Should().BeSameAs(initialSnapshot);
        processor.VerifyWithAnyArgs(p => p.Process(null, null, null), Times.Never);
        container.VerifyWithAnyArgs(c => c.SetSnapshot(null), Times.Never);
    }
}
