using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting;

public sealed class DynaConHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IConfigurationReporter> reporter;
    private CancellationToken ct;

    public DynaConHealthCheckTests()
    {
        reporter = new Mock<IConfigurationReporter>();
        target = new DynaConHealthCheck(reporter.Object);
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Theory, BooleanData]
    public async Task ShouldFail_IfCriticalErrors(bool hasErrors)
    {
        var report = new ConfigurationReport();
        reporter.Setup(r => r.GetReportAsync(ct, It.IsAny<bool>())).ReturnsAsync(report);
        if (hasErrors) report.CriticalErrors.Add("Test", "Oups");

        // Act
        var result = await target.ExecuteAsync(ct);

        result.Error.Should().Be(hasErrors ? report.CriticalErrors : null);
        result.Details.Should().BeNull();
    }
}
