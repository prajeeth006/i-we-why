using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting;

public sealed class ConfigurationReporterTests : IDisposable
{
    private IConfigurationReporter target;
    private Mock<IConfigurationContainer> container;
    private Mock<IInitialChangesetLoader> initialChangesetLoaderMock;
    private Mock<IPartialConfigurationReporter> partialReporter1;
    private Mock<IPartialConfigurationReporter> partialReporter2;
    private Mock<IPartialConfigurationReporter> partialReporter3;

    private IConfigurationSnapshot snapshot;
    private CancellationToken ct;

    public ConfigurationReporterTests()
    {
        container = new Mock<IConfigurationContainer>();
        initialChangesetLoaderMock = new Mock<IInitialChangesetLoader>();
        partialReporter1 = new Mock<IPartialConfigurationReporter>();
        partialReporter2 = new Mock<IPartialConfigurationReporter>();
        partialReporter3 = new Mock<IPartialConfigurationReporter>();
        target = new ConfigurationReporter(
            container.Object,
            initialChangesetLoaderMock.Object,
            new[] { partialReporter1.Object, partialReporter2.Object, partialReporter3.Object });

        snapshot = Mock.Of<IConfigurationSnapshot>();
        ct = TestCancellationToken.Get();
        container.Setup(c => c.GetSnapshot()).Returns(snapshot);
    }

    public void Dispose()
        => container.Verify(c => c.GetSnapshot(), Times.Once); // Because it can change in the meantime

    [Fact]
    public async Task ShouldCallAllPartialReporters()
    {
        // Act
        var report = await target.GetReportAsync(ct);

        partialReporter1.Verify(r => r.FillAsync(report, snapshot, ct));
        partialReporter2.Verify(r => r.FillAsync(report, snapshot, ct));
        partialReporter3.Verify(r => r.FillAsync(report, snapshot, ct));
        report.CriticalErrors.Should().BeEmpty();
    }

    [Theory, BooleanData]
    public async Task ShouldContinueIfOneSomeReportersFail(bool failMultiple)
    {
        var ex1 = new Exception("Reporter error 1");
        var ex2 = new Exception("Reporter error 1");
        partialReporter1.SetupWithAnyArgs(r => r.FillAsync(null, null, TestContext.Current.CancellationToken)).Throws(ex1);
        if (failMultiple) partialReporter2.SetupWithAnyArgs(r => r.FillAsync(null, null, TestContext.Current.CancellationToken)).Throws(ex2);

        // Act
        var report = await target.GetReportAsync(ct);

        var reportedObj = report.CriticalErrors[ConfigurationReporter.ReportBuildingFailedMessage];
        if (failMultiple)
            reportedObj.Should().BeAssignableTo<IReadOnlyList<Exception>>().Which.Should().Equal(ex1, ex2);
        else
            reportedObj.Should().BeSameAs(ex1);

        partialReporter2.Verify(r => r.FillAsync(report, snapshot, ct));
        partialReporter3.Verify(r => r.FillAsync(report, snapshot, ct));
    }
}
