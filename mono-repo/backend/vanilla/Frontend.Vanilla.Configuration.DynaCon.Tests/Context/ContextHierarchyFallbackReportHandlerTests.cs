using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public class ContextHierarchyFallbackReportHandlerTests
{
    private IFallbackReportHandler target;
    private Mock<ICurrentContextHierarchy> currentctxHierarchy;

    public ContextHierarchyFallbackReportHandlerTests()
    {
        currentctxHierarchy = new Mock<ICurrentContextHierarchy>();
        target = new ContextHierarchyFallbackReportHandler(currentctxHierarchy.Object);
    }

    [Fact]
    public void DataDescription_ShouldBeValid()
        => target.DataDescription.Should().NotBeNull();

    [Theory]
    [InlineData(ConfigurationSource.Service, false)]
    [InlineData(ConfigurationSource.FallbackFile, true)]
    internal void IsFallenBack_ShouldReturnBaseOnSource(ConfigurationSource source, bool expected)
    {
        currentctxHierarchy.SetupGet(h => h.Value).Returns(TestCtxHierarchy.Get(source));

        // Act
        target.IsFallenBack(null).Should().Be(expected);
    }

    [Fact]
    public void SetReport_ShouldSetContextHierarchyReport()
    {
        var report = new ConfigurationReport();

        // Act
        target.SetReport(report, "Foo");

        report.ContextHierarchyFallbackFile.Should().Be("Foo");
    }
}
