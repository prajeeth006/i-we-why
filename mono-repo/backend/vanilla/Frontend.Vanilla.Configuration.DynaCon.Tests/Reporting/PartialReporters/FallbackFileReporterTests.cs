using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class FallbackFileReporterTests : PartialConfigurationReporterTestsBase, IDisposable
{
    private Mock<IFallbackFile<FooData>> fallbackFile;
    private Mock<IFallbackReportHandler> reportHandler;
    private RootedPath testFile;
    private FileProperties testFileProps;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        fallbackFile = new Mock<IFallbackFile<FooData>>();
        reportHandler = new Mock<IFallbackReportHandler>();
        getTarget = s => new FallbackFileReporter<FooData>(fallbackFile.Object, reportHandler.Object);

        testFile = OperatingSystemRootedPath.GetRandom();
        testFileProps = TestFileSystemProperties.GetFile();
        reportHandler.SetupGet(h => h.DataDescription).Returns("foobar");
        fallbackFile.SetupGet(f => f.Handler.Path).Returns(testFile);
        fallbackFile.Setup(f => f.Handler.GetProperties()).Returns(testFileProps);
    }

    private static readonly string ErrorKey = string.Format(FallbackFileReportMessages.ErrorFormat, "foobar");

    public class FooData { }

    public void Dispose()
    {
        reportHandler.VerifyWithAnyArgs(h => h.SetReport(null, null), Times.Once);
        Report.Warnings.Should().BeEmpty();
    }

    [Fact]
    public async Task ShouldNotExecuteIfDisabled()
    {
        fallbackFile.SetupGet(f => f.Handler).Returns(() => null);

        await FillReportAsync(); // Act

        reportHandler.Verify(h => h.SetReport(Report, FallbackFileReportMessages.Disabled));
        Report.CriticalErrors.Should().BeEmpty();
    }

    [Fact]
    public async Task ShouldReportError_IfFallenBack()
    {
        reportHandler.Setup(h => h.IsFallenBack(Snapshot.Object)).Returns(true);

        await FillReportAsync(); // Act

        var key = string.Format(FallbackFileReportMessages.UsingFallbackFormat, "foobar");
        Report.CriticalErrors[key].Should().Be(true);
    }

    [Fact]
    public async Task ShouldGetReportWithAllDetails()
    {
        var testData = new FooData();
        fallbackFile.Setup(f => f.Handler.ReadAsync(Ct)).ReturnsAsync(testData);

        await FillReportAsync(); // Act

        VerifyReport(testData, testFileProps);
        Report.CriticalErrors.Should().BeEmpty();
    }

    [Fact]
    public async Task ShouldGetReport_IfFileReadError()
    {
        var ex = new Exception("File read error");
        fallbackFile.Setup(f => f.Handler.ReadAsync(Ct)).Throws(ex);

        await FillReportAsync(); // Act

        VerifyReport(content: null, testFileProps);
        Report.CriticalErrors.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, object> { { ErrorKey, ex } });
    }

    [Fact]
    public async Task ShouldGetReport_IfFailedFileAccess()
    {
        var ex = new Exception("File access error");
        await RunFileErrorTest( // Act
            fileProps: ex,
            verifyReportedError: e => e.Should().BeSameAs(ex));
    }

    private async Task RunFileErrorTest(object fileProps, Action<object> verifyReportedError)
    {
        fallbackFile.Setup(f => f.Handler.GetProperties()).ThrowsOrReturns(fileProps);

        await FillReportAsync(); // Act

        VerifyReport(content: null, props: null);
        Report.CriticalErrors.Should().ContainKeys(ErrorKey);
        verifyReportedError(Report.CriticalErrors.Values.Single());
        fallbackFile.VerifyWithAnyArgs(f => f.Handler.ReadAsync(default), Times.Never);
    }

    private void VerifyReport(object content, FileProperties props)
        => reportHandler.Invocations.Single(i => i.Method.Name == nameof(IFallbackReportHandler.SetReport)).Arguments.Should().BeEquivalentTo(
            Report,
            new FallbackFileReport
            {
                Path = testFile,
                Content = content,
                Properties = props,
            });
}

public class FallbackFileReportMessagesTests
{
    [Fact]
    public void ShouldContainPlaceholders()
    {
        FallbackFileReportMessages.ErrorFormat.Should().Contain("{0}");
        FallbackFileReportMessages.UsingFallbackFormat.Should().Contain("{0}");
    }
}
