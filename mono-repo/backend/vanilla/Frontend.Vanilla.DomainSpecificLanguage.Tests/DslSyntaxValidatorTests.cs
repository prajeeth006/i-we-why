using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests;

public sealed class DslSyntaxValidatorTests
{
    private IDslSyntaxValidator target;
    private Mock<IExpressionTreeParser> parser;

    public DslSyntaxValidatorTests()
    {
        parser = new Mock<IExpressionTreeParser>();
        target = new DslSyntaxValidator(parser.Object);
    }

    public class Foo { }

    [Fact]
    public void ShouldSucceed_IfParsed()
    {
        parser.Setup(p => p.Parse("expr", typeof(Foo))).Returns(Mock.Of<IExpressionTree>().WithWarnings("Warn 1", "Warn 2"));

        // Act
        var result = target.Validate("expr", typeof(Foo));

        result.ErrorMessage.Should().BeNull();
        result.Warnings.Should().Equal("Warn 1", "Warn 2");
    }

    [Fact]
    public void ShouldReturnParsingDetails_IfParsingFails()
    {
        parser.Setup(p => p.Parse("expr", typeof(Foo))).Throws(new Exception("Oh", new Exception("shit")));

        // Act
        var result = target.Validate("expr", typeof(Foo));

        result.ErrorMessage.Should().Be($"Oh{Environment.NewLine}--> shit");
        result.Warnings.Should().BeEmpty();
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public void Result_ShouldCreateCorrectly(bool hasError, bool hasWarnings)
    {
        var errorMsg = hasError ? (TrimmedRequiredString)"Oups" : null;
        var warnings = hasWarnings ? new TrimmedRequiredString[] { "Warning 1", "Warning 2" } : null;

        // Act
        var result = new DslSyntaxResult(errorMsg, warnings);

        result.ErrorMessage.Should().Be(errorMsg);
        result.Warnings.Should().Equal(warnings ?? TrimmedStrs.Empty);
    }
}
