using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class EditorOverridesTests
{
    [Theory]
    [InlineData(false, false, null)]
    [InlineData(true, false, null)]
    [InlineData(false, true, null)]
    [InlineData(true, true, null)]
    [InlineData(false, true, "2001-02-03")]
    [InlineData(true, true, "2001-02-03")]
    public void ShouldCreateCorrectly(bool noCache, bool usePreview, string previewDateStr)
    {
        var previewDate = previewDateStr != null ? (UtcDateTime?)new UtcDateTime(DateTime.Parse(previewDateStr).ToUniversalTime()) : null;

        var target = new EditorOverrides(noCache, usePreview, previewDate); // Act

        target.NoCache.Should().Be(noCache);
        target.UsePreview.Should().Be(usePreview);
        target.PreviewDate.Should().Be(previewDate);
    }

    [Theory, BooleanData]
    public void ShouldThrow_IfPreviewDateWithoutUsePreview(bool noCache)
    {
        var previewDate = new UtcDateTime(2000, 1, 2);

        Func<object> act = () => new EditorOverrides(noCache, false, previewDate); // Act

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be("previewDate");
    }
}
