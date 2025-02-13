using System;
using System.IO;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.File;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Primitives;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides.File;

public class FileOverridesStorageTests
{
    private IOverridesStorage target;
    private TenantSettings tenantSettings;
    private Mock<IFileSystem> fileSystem;
    private Exception testEx;

    public FileOverridesStorageTests()
    {
        tenantSettings = TestSettings.GetTenant(localOverridesFile: OperatingSystemRootedPath.GetRandom());
        fileSystem = new Mock<IFileSystem>();
        target = new FileOverridesStorage(tenantSettings, fileSystem.Object);
        testEx = new Exception("Oups");
    }

    [Fact]
    public void CurrentContextId_ShouldBePerTenant()
        => target.CurrentContextId.Value.Should().Contain(tenantSettings.Name);

    [Theory]
    [InlineData("{ Test: 123 }", "{ Test: 123 }")]
    [InlineData("", "{}")]
    [InlineData("  ", "{}")]
    [InlineData("{}", "{}")]
    public void GetAll_ShouldReadJson(string fileContent, string expectedJson)
    {
        fileSystem.Setup(s => s.ReadFileText(tenantSettings.LocalOverridesFile)).Returns(fileContent);

        // Act
        var result = target.Get();

        result.Should().BeJson(expectedJson);
    }

    [Fact]
    public void GetAll_ShouldReturnEmpty_IfFileNotExist()
    {
        fileSystem.Setup(s => s.ReadFileText(tenantSettings.LocalOverridesFile)).Throws<FileNotFoundException>();

        // Act
        target.Get().Should().BeEmpty();
    }

    [Fact]
    public void GetAll_ShouldThrow_IfFileError()
    {
        fileSystem.Setup(s => s.ReadFileText(tenantSettings.LocalOverridesFile)).Throws(testEx);
        ExpectThrow(() => target.Get());
    }

    private void ExpectThrow(Action act)
        => act.Should().Throw()
            .Where(e => e.InnerException == testEx)
            .Which.Message.Should().Contain(tenantSettings.LocalOverridesFile);

    [Theory]
    [InlineData("gibberish")]
    [InlineData("null")]
    [InlineData("[]")]
    [InlineData("123")]
    [InlineData("'str'")]
    public void GetAll_ShouldThrow_IfInvalidJson(string fileContent)
    {
        fileSystem.Setup(s => s.ReadFileText(tenantSettings.LocalOverridesFile)).Returns(fileContent);

        Action act = () => target.Get();

        act.Should().Throw()
            .Where(e => e.InnerException is JsonReaderException)
            .Which.Message.Should().ContainAll(tenantSettings.LocalOverridesFile, fileContent);
    }

    [Fact]
    public void SetAll_ShouldWriteFormattedJson()
    {
        fileSystem.Setup(s => s.WatchFile(tenantSettings.LocalOverridesFile)).Returns(Mock.Of<IChangeToken>());
        var watcher = target.WatchChanges();

        // Act
        target.Set(JObject.Parse("{ Test: 123 }"));

        fileSystem.Verify(s => s.WriteFile(tenantSettings.LocalOverridesFile, $"{{{Environment.NewLine}  \"Test\": 123{Environment.NewLine}}}"));
        watcher.HasChanged.Should().BeTrue();
    }

    [Fact]
    public void SetAll_ShouldThrow_IfFailed()
    {
        fileSystem.SetupWithAnyArgs(f => f.WriteFile(null, null)).Throws(testEx);
        ExpectThrow(() => target.Set(new JObject()));
    }

    [Fact]
    public void WatchChanges_ShouldWatchFile()
    {
        var fileCTS = new CancellationTokenSource();
        fileSystem.Setup(s => s.WatchFile(tenantSettings.LocalOverridesFile)).Returns(fileCTS.GetChangeToken());

        // Act
        var token = target.WatchChanges();

        token.HasChanged.Should().BeFalse();
        fileCTS.Cancel();
        token.HasChanged.Should().BeTrue();
    }

    [Fact]
    public void Constructor_ShouldThrow_IfNoOverridesFile()
    {
        tenantSettings = TestSettings.GetTenant();

        Func<object> act = () => new FileOverridesStorage(tenantSettings, fileSystem.Object);

        act.Should().Throw<VanillaBugException>();
    }
}
