using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public class ProactiveValidationReporterTests : PartialConfigurationReporterTestsBase, IDisposable
{
    private Mock<IHistoryLog<ValidatedChangesetInfo>> validatedLog;
    private Mock<IPollingScheduler<ProactiveValidationJob>> scheduler;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        validatedLog = new Mock<IHistoryLog<ValidatedChangesetInfo>>();
        scheduler = new Mock<IPollingScheduler<ProactiveValidationJob>>();
        var urls = Mock.Of<IConfigurationServiceUrls>(u => u.ValidatableChangesets == new HttpUri("http://dynacon/validatable"));
        getTarget = s => new ProactiveValidationReporter(validatedLog.Object, scheduler.Object, urls);
    }

    public void Dispose()
        => scheduler.VerifyGet(s => s.NextPollTime, Times.AtMostOnce);

    [Fact]
    public void ShouldReturnReport_IfPollingEnabled()
    {
        var time = new UtcDateTime(2001, 2, 3);
        var validations = Enumerable.Range(1, 5).Select(i => new ValidatedChangesetInfo(new UtcDateTime(2000, 1, i), 100 + i, "Info")).ToList();
        scheduler.SetupGet(s => s.NextPollTime).Returns(time);
        validatedLog.Setup(l => l.GetItems()).Returns(validations);

        FillReport(); // Act

        var proactiveReport = (ProactiveValidationReport)Report.ProactiveValidation;
        proactiveReport.NextPollTime.Should().Be(time);
        proactiveReport.PastValidations.Should().Equal(validations);
        proactiveReport.Url.Should().Be(new Uri("http://dynacon/validatable"));
    }

    [Fact]
    public void ShouldReturnMessage_IfPollingDisabled()
    {
        FillReport(); // Act

        Report.ProactiveValidation.Should().Be(ProactiveValidationReporter.DisabledMessage);
        validatedLog.Verify(l => l.GetItems(), Times.Never);
    }
}
