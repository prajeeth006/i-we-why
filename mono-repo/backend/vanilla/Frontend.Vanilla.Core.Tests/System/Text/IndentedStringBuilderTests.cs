using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public class IndentedStringBuilderTests
{
    private readonly IndentedStringBuilder target = new ();

    [Fact]
    public void ShouldBeEmptyByDefault()
        => target.ToString().Should().BeEmpty();

    [Fact]
    public void ShouldIndentAppendedLines()
    {
        // Act
        var retVals = new[]
        {
            target.AppendLine("1"),
            target.Indent(),
            target.AppendLine(),
            target.AppendLine("2"),
            target.Indent(),
            target.AppendLine("3"),
            target.Unindent(),
            target.AppendLine("4"),
        };

        target.ToString().Should().Be($"1{Environment.NewLine}{Environment.NewLine}    2{Environment.NewLine}        3{Environment.NewLine}    4{Environment.NewLine}");
        retVals.Each(v => v.Should().BeSameAs(target));
    }

    [Fact]
    public void ShouldAppendAlreadyIndentedLines()
    {
        target.AppendLine("1").Indent();

        // Act
        var retVal = target.AppendLines($"    2{Environment.NewLine}3{Environment.NewLine}");

        target.ToString().Should().Be($"1{Environment.NewLine}        2{Environment.NewLine}    3{Environment.NewLine}");
        retVal.Should().BeSameAs(target);
    }
}
