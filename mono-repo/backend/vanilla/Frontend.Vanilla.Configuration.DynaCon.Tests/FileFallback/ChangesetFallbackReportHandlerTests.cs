using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public class ChangesetFallbackReportHandlerTests
{
    private IFallbackReportHandler target;

    public ChangesetFallbackReportHandlerTests()
        => target = new ChangesetFallbackReportHandler();

    [Fact]
    public void DataDescription_ShouldBeValid()
        => target.DataDescription.Should().NotBeNull();

    [Theory]
    [InlineData(ConfigurationSource.FallbackFile, true)]
    [InlineData(ConfigurationSource.Service, false)]
    [InlineData(ConfigurationSource.LocalOverrides, false)]
    internal void IsFallenBack_ShouldReturnBaseOnSource(ConfigurationSource source, bool expected)
    {
        var snapshot = Mock.Of<IConfigurationSnapshot>(s => s.ActiveChangeset.Source == source);

        // Act
        target.IsFallenBack(snapshot).Should().Be(expected);
    }

    [Fact]
    public void SetReport_ShouldSetChangesetReport()
    {
        var report = new ConfigurationReport();

        // Act
        target.SetReport(report, "Foo");

        report.ChangesetFallbackFile.Should().Be("Foo");
    }
}
