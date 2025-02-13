using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Diagnostics;

public class DiagnosticInfoMetadataTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldCreateCorrectly(bool hasDescription)
    {
        var desc = hasDescription ? "Full <em>desc</em>" : null;

        // Act
        var target = new DiagnosticInfoMetadata("Foo", "path", "Foo short decc.", desc);

        target.Name.Should().Be("Foo");
        target.UrlPathSegment.Should().Be("path");
    }
}
