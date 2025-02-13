using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public sealed class LocalOverridesReporterTests : PartialConfigurationReporterTestsBase, IDisposable
{
    private Mock<IFileSystem> fileSystem;
    private Mock<IConfigurationOverridesService> overridesService;

    private JObject testOverrides;
    private RootedPath testFile;
    private FileProperties testFileProps;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        fileSystem = new Mock<IFileSystem>();
        overridesService = new Mock<IConfigurationOverridesService>();
        getTarget = s => new LocalOverridesReporter(s, s.TenantBlueprint, fileSystem.Object, overridesService.Object);

        testOverrides = JObject.Parse("{ Override: 1 }");
        testFile = OperatingSystemRootedPath.GetRandom();
        testFileProps = TestFileSystemProperties.GetFile();

        Settings.LocalOverridesMode = LocalOverridesMode.File;
        Settings.LocalOverridesFile = testFile;

        overridesService.Setup(s => s.GetJson()).Returns(testOverrides);
        fileSystem.Setup(s => s.GetFileProperties(new RootedPath(Settings.LocalOverridesFile))).Returns(testFileProps);
        fileSystem.Setup(s => s.ReadFileTextAsync(testFile, Ct)).ReturnsAsync("File content");
    }

    public void Dispose()
        => Report.Warnings.Should().BeEmpty();

    [Fact]
    public async Task Disabled_ShouldReportNothing()
    {
        Settings.LocalOverridesMode = LocalOverridesMode.Disabled;

        await FillReportAsync(); // Act

        Report.LocalOverrides.Should().BeEquivalentTo(new LocalOverridesReport
        {
            Mode = LocalOverridesMode.Disabled,
        });
        Report.CriticalErrors.Should().BeEmpty();
        overridesService.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task File_ShouldReportFileDetails()
    {
        await FillReportAsync(); // Act

        Report.LocalOverrides.Should().BeEquivalentTo(new LocalFileOverridesReport
        {
            Mode = LocalOverridesMode.File,
            OverridesJson = testOverrides,
            Path = testFile,
            Properties = testFileProps,
            Content = "File content",
        });
        Report.CriticalErrors.Should().BeEmpty();
    }

    [Fact]
    public async Task File_ShouldReportEmpty_IfFileDoesNotExist()
    {
        fileSystem.Setup(s => s.GetFileProperties(new RootedPath(Settings.LocalOverridesFile))).Returns(() => null);

        await FillReportAsync(); // Act

        Report.LocalOverrides.Should().BeEquivalentTo(new LocalFileOverridesReport
        {
            Mode = LocalOverridesMode.File,
            OverridesJson = testOverrides,
            Path = testFile,
        });
        Report.CriticalErrors.Should().BeEmpty();
        fileSystem.VerifyWithAnyArgs(s => s.ReadFileTextAsync(default(RootedPath), TestContext.Current.CancellationToken), Times.Never);
    }

    public enum FailedFileTestCase
    {
        /// <summary>
        /// GetProperties
        /// </summary>
        GetProperties,

        /// <summary>
        /// ReadContent
        /// </summary>
        ReadContent,
    }

    [Theory, EnumData(typeof(FailedFileTestCase))]
    public async Task File_ShouldReportFileDetails_IfFileError(FailedFileTestCase testCase)
    {
        var ex = new Exception("Oups");
        if (testCase == FailedFileTestCase.GetProperties)
            fileSystem.Setup(s => s.GetFileProperties(new RootedPath(Settings.LocalOverridesFile))).Throws(ex);
        else
            fileSystem.Setup(s => s.ReadFileTextAsync(testFile, Ct)).Throws(ex);

        await FillReportAsync(); // Act

        Report.LocalOverrides.Should().BeEquivalentTo(new LocalFileOverridesReport
        {
            Mode = LocalOverridesMode.File,
            OverridesJson = testOverrides,
            Path = testFile,
            Properties = testCase == FailedFileTestCase.ReadContent ? testFileProps : null,
        });
        Report.CriticalErrors.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, object> { { LocalOverridesReporter.FileError, ex } });
    }

    [Fact]
    public async Task Session_ShouldReportCurrentOverrides()
    {
        Settings.LocalOverridesMode = LocalOverridesMode.Session;

        await FillReportAsync(); // Act

        Report.LocalOverrides.Should().BeEquivalentTo(new LocalOverridesReport
        {
            Mode = LocalOverridesMode.Session,
            OverridesJson = testOverrides,
        });
        Report.CriticalErrors.Should().BeEmpty();
    }
}
