using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System.Text;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class ChangesetReporterTests : PartialConfigurationReporterTestsBase
{
    private IConfigurationServiceUrls urls;
    private Mock<IHistoryLog<PastChangesetInfo>> pastChangesetsLog;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        urls = Mock.Of<IConfigurationServiceUrls>();
        pastChangesetsLog = new Mock<IHistoryLog<PastChangesetInfo>>();
        getTarget = s => new ChangesetReporter(urls, pastChangesetsLog.Object);
    }

    [Fact]
    public void ShouldFillChangesetsToReport()
    {
        Snapshot.DefaultValue = DefaultValue.Mock;
        pastChangesetsLog.DefaultValue = DefaultValue.Mock;

        FillReport(); // Act

        Report.Configuration.Active.Should().BeSameAs(Snapshot.Object.ActiveChangeset);
        Report.Configuration.Overridden.Should().BeSameAs(Snapshot.Object.OverriddenChangeset);
        Report.Configuration.Future.Should().BeSameAs(Snapshot.Object.FutureChangesets);
        Report.Configuration.Past.Should().BeSameAs(pastChangesetsLog.Object.GetItems());
        Report.Urls.Should().BeSameAs(urls);
        Report.CriticalErrors.Should().BeEmpty();
        Report.Warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldFillWarningsOfActiveChangeset()
    {
        Snapshot.SetupGet(s => s.ActiveChangeset.Warnings).Returns(new TrimmedRequiredString[] { "Warning 1", "Warning 2" });

        FillReport(); // Act

        Report.Warnings[ChangesetReporter.ActiveChangesetWarning].Should().BeSameAs(Snapshot.Object.ActiveChangeset.Warnings);
    }

    [Fact]
    public void ShouldReportError_IfLatestChangesetIsFailed()
    {
        Snapshot.SetupGet(s => s.LatestChangeset).Returns(Mock.Of<IFailedChangeset>());

        FillReport(); // Act

        Report.CriticalErrors.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, object>
            { { ChangesetReporter.InvalidLatestChangesetError, Snapshot.Object.LatestChangeset } });
    }
}
