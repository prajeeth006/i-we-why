using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public class MultitenancyReporterTests : PartialConfigurationReporterTestsBase
{
    private Mock<ITenantManager> tenantManager;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        tenantManager = new Mock<ITenantManager>();
        getTarget = s => new MultitenancyReporter(tenantManager.Object);
    }

    [Fact]
    public void ShouldReportActiveTenants()
    {
        var expected = new Dictionary<TrimmedRequiredString, TenantReport>
        {
            ["bwin.com"] = new TenantReport
            {
                StartTime = TestTime.GetRandomUtc(),
                LastAccessTime = TestTime.GetRandomUtc(),
                TotalAccessCount = RandomGenerator.GetInt32(),
            },
            ["party.net"] = new TenantReport
            {
                StartTime = TestTime.GetRandomUtc(),
                LastAccessTime = TestTime.GetRandomUtc(),
                TotalAccessCount = RandomGenerator.GetInt32(),
            },
        };
        tenantManager.Setup(m => m.GetActiveTenants()).Returns(expected.ToDictionary(e => e.Key, e => Mock.Of<ITenant>(t =>
            t.StartTime == e.Value.StartTime
            && t.LastAccessTime == e.Value.LastAccessTime
            && t.AccessCount == e.Value.TotalAccessCount)));

        // Act
        FillReport();

        Report.Multitenancy.Should().BeEquivalentTo(expected);
    }
}
