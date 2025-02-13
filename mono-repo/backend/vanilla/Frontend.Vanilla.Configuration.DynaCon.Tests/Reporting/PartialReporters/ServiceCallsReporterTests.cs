using System;
using System.Collections.Generic;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class ServiceCallsReporterTests : PartialConfigurationReporterTestsBase
{
    private Mock<IHistoryLog<RestServiceCallInfo>> restServiceLog;
    private TestClock clock;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        restServiceLog = new Mock<IHistoryLog<RestServiceCallInfo>>();
        clock = new TestClock();
        getTarget = s => new ServiceCallsReporter(restServiceLog.Object, clock);
    }

    [Theory, BooleanData]
    public void ShouldReportServiceCalls(bool isEmpty)
    {
        var calls = isEmpty
            ? Array.Empty<RestServiceCallInfo>()
            : new[]
            {
                GetCallMinutesFromNow(-10),
                GetCallMinutesFromNow(-6),
                GetCallMinutesFromNow(-75, hasError: true), // Should not be reported b/c not within error count nor warning timespan
                GetCallMinutesFromNow(-8),
            };
        restServiceLog.Setup(l => l.GetItems()).Returns(calls);

        FillReport(); // Act

        Report.ServiceCalls.Should().Equal(calls);
        Report.CriticalErrors.Should().BeEmpty();
        Report.Warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldReportError_IfLatestServiceCallWasFailed()
    {
        var calls = new[]
        {
            GetCallMinutesFromNow(-100),
            GetCallMinutesFromNow(-70, hasError: true),
            GetCallMinutesFromNow(-150),
            GetCallMinutesFromNow(-120, hasError: true),
        };
        restServiceLog.Setup(l => l.GetItems()).Returns(calls);

        FillReport(); // Act

        Report.CriticalErrors.Should().ContainKey(ServiceCallsReporter.ServiceAccessError)
            .WhoseValue.Should().BeAssignableTo<IReadOnlyList<RestServiceCallInfo>>()
            .Which.Should().Equal(calls[1], calls[3]);
        Report.Warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldReportWarning_IfRecentlyFailedRequests()
    {
        var calls = new[]
        {
            GetCallMinutesFromNow(-10, hasError: true),
            GetCallMinutesFromNow(-20),
            GetCallMinutesFromNow(-15, hasError: true),
            GetCallMinutesFromNow(-75, hasError: true), // Too old
            GetCallMinutesFromNow(-6), // Newest 3 are ok -> no error
            GetCallMinutesFromNow(-5),
            GetCallMinutesFromNow(-4),
        };
        restServiceLog.Setup(l => l.GetItems()).Returns(calls);

        FillReport(); // Act

        Report.CriticalErrors.Should().BeEmpty();
        Report.Warnings.Should().ContainKey(ServiceCallsReporter.ServiceAccessWarning)
            .WhoseValue.Should().BeAssignableTo<IReadOnlyList<RestServiceCallInfo>>()
            .Which.Should().Equal(calls[0], calls[2]);
    }

    private RestServiceCallInfo GetCallMinutesFromNow(int minutesFromNow, bool hasError = false)
    {
        var url = new HttpUri("http://dynacon/" + Guid.NewGuid());
        var time = clock.UtcNow.AddMinutes(minutesFromNow);
        var error = hasError ? new Exception() : null;

        return new RestServiceCallInfo(url, HttpMethod.Get, time, TimeSpan.FromMilliseconds(7), null, null, error);
    }
}
