using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class PollingForChangesReporterTests : PartialConfigurationReporterTestsBase, IDisposable
{
    private Mock<IConfigurationServiceUrls> urlBuilder;
    private Mock<IPollingScheduler<PollForChangesJob>> scheduler;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        urlBuilder = new Mock<IConfigurationServiceUrls>();
        scheduler = new Mock<IPollingScheduler<PollForChangesJob>>();
        getTarget = s => new PollingForChangesReporter(urlBuilder.Object, scheduler.Object);
    }

    public void Dispose()
        => scheduler.VerifyGet(s => s.NextPollTime, Times.AtMostOnce);

    [Fact]
    public void ShouldReportNextPollRequest()
    {
        var testTime = new UtcDateTime(2001, 2, 3);
        scheduler.SetupGet(s => s.NextPollTime).Returns(testTime);
        Snapshot.SetupGet(s => s.LatestChangeset.Id).Returns(666);
        urlBuilder.Setup(b => b.ConfigurationChanges(666)).Returns(new HttpUri("http://dynacon/changes/666"));

        FillReport(); // Act

        var pollReport = Report.PollingForChanges.Should().BeOfType<PollingForChangesReport>().Which;
        pollReport.NextPollTime = testTime;
        pollReport.Url.Should().Be(new Uri("http://dynacon/changes/666"));
        pollReport.FromChangesetId.Should().Be(666);
    }

    [Fact]
    public void ShouldNotReportAnything_IfPollingDisabled()
    {
        FillReport(); // Act
        Report.PollingForChanges.Should().Be(PollingForChangesReporter.DisabledMessage);
    }
}
