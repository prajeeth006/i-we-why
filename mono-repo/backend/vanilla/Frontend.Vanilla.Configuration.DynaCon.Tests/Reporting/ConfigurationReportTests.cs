using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting;

public class ConfigurationReportTests
{
    [Theory]
    [InlineData(10, 10)]
    [InlineData(25, 4)]
    public void TenantReport_AverageAccessCountPerMinute_ShouldBeCalculatedCorrectly(int lastAccessMin, int expected)
    {
        var report = new TenantReport
        {
            StartTime = new UtcDateTime(2000, 1, 1, 0),
            LastAccessTime = new UtcDateTime(2000, 1, 1, 0, lastAccessMin, 10),
            TotalAccessCount = 100,
        };
        report.AverageAccessCountPerMinute.Should().Be(expected);
    }
}
