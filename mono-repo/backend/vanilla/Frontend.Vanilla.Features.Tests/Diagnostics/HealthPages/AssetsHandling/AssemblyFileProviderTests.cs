#nullable enable

using System;
using System.IO;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.AssetsHandling;

public sealed class AssemblyFileProviderTests
{
    private static readonly IAssemblyFileProvider Target = new AssemblyFileProvider();
    private static readonly Assembly ThisAssembly = typeof(AssemblyFileProviderTests).Assembly;

    private static Stream? Act(string path)
        => Target.GetFileStream(ThisAssembly, new RelativePath(path));

    [Theory]
    [InlineData("Diagnostics/HealthPages/AssetsHandling/TestFile.txt")]
    [InlineData("Diagnostics\\HealthPages\\AssetsHandling\\TestFile.txt")] // Should support back-slashes
    [InlineData("DIAGNOSTICS/HealthPages/AssetsHandling/TESTfile.txt")] // Should be case-insensitive
    public void ShouldReturnFileContents(string path)
    {
        var stream = Act(path);

        stream!.ReadAllBytes().DecodeToString().Should().Be("Hello BWIN :-)");
    }

    [Fact]
    public void ShouldReturnNull_IfFileDoesNotExist()
    {
        var stream = Act("NotFound.txt");

        stream.Should().BeNull();
    }

    [Fact]
    public void ShouldThrow_IfMultipleFilesMatched()
    {
        const string conflictPath = "Diagnostics/HealthPages/AssetsHandling\\conflict-file.txt";

        Action act = () => Act(conflictPath);

        act.Should().Throw().Which.Message.Should().ContainAll(
            $"'{conflictPath}'",
            ThisAssembly,
            "'Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.AssetsHandling.Conflict_file.txt'",
            "'Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.AssetsHandling.Conflict-File.txt'");
    }
}
