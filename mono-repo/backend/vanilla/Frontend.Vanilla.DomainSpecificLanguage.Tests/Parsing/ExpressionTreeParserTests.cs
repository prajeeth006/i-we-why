using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing;

public class ExpressionTreeParserTests
{
    private IExpressionTreeParser target;
    private Mock<ILexicalParser> lexicalParser;
    private Mock<ISyntaxParser> syntaxParser;
    private Mock<ILegacySyntaxConverter> legacyConverter;

    private RequiredString inputExpression;
    private Mock<IExpressionTree> expressionToReturn;

    public ExpressionTreeParserTests()
    {
        lexicalParser = new Mock<ILexicalParser>();
        syntaxParser = new Mock<ISyntaxParser>();
        legacyConverter = new Mock<ILegacySyntaxConverter>();
        target = new ExpressionTreeParser(lexicalParser.Object, syntaxParser.Object, legacyConverter.Object);

        inputExpression = "Test Expr";
        expressionToReturn = new Mock<IExpressionTree>();
        var tokens = new[] { new KeywordToken(0, Keyword.Dot), new KeywordToken(1, Keyword.Comma) };

        legacyConverter.Setup(c => c.Convert(It.Is<RequiredString>(s => s.Equals(inputExpression))))
            .Returns(new RequiredString("Converted Expr").WithWarnings("Legacy 1", "Legacy 2"));
        lexicalParser.Setup(p => p.Parse("Converted Expr")).Returns(tokens);
        syntaxParser.Setup(p => p.Parse(tokens)).Returns(expressionToReturn.Object.WithWarnings("Syntax 1", "Syntax 2"));
    }

    [Fact]
    public void ShouldSupportCommonTypes()
        => ExpressionTreeParser.SupportedResultTypes.Should().BeEquivalentTo(
            typeof(bool), typeof(decimal), typeof(string), typeof(VoidDslResult), typeof(object));

    public static readonly IEnumerable<object[]> TestedResultTypes =
        from d in Enum<DslType>.Values
        from t in new[] { typeof(object), d.ToClrType() }
        where !(t == typeof(object) && d == DslType.Void)
        select new[] { (object)t, (object)d };

    [Theory, MemberData(nameof(TestedResultTypes))]
    internal void ShouldParseSyntaxTree(Type resultType, DslType parsedType)
    {
        expressionToReturn.SetupGet(e => e.ResultType).Returns(parsedType);

        var (expression, warnings) = target.Parse(inputExpression, resultType); // Act

        expression.Should().BeSameAs(expressionToReturn.Object);
        warnings.Should().Equal("Legacy 1", "Legacy 2", "Syntax 1", "Syntax 2");
        legacyConverter.Verify(c => c.Convert(inputExpression));
    }

    [Fact]
    public void ShouldSupportVariousChars()
    {
        inputExpression = "!@#$%^&*()_+{}:\"|<>?-=[];'\\,./ABCabc012šßお汉 \t \r\n";
        ShouldParseSyntaxTree(typeof(string), DslType.String);
    }

    [Theory]
    [InlineData(typeof(DateTime))]
    [InlineData(typeof(IComparable))] // Assignable from decimal or string
    public void ShouldThrow_IfUnsupportedResultTypeRequested(Type unsupportedType)
        => new Action(() => target.Parse(inputExpression, unsupportedType))
            .Should().Throw<ArgumentException>()
            .Which.Message.Should().StartWith($"Requested result type {unsupportedType}")
            .And.ContainAll(ExpressionTreeParser.SupportedResultTypes.Except(typeof(VoidDslResult)).Append(typeof(void)).Select(t => t.ToString()));

    [Theory]
    [InlineData("\a")]
    [InlineData("\b")]
    [InlineData("​")] // Invisible char
    public void ShouldThrow_IfUnsupportedChars(string expression)
        => new Action(() => target.Parse(expression, typeof(DateTime)))
            .Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll("Expression can contain only", $"'{expression}'");

    internal enum FailedTestCase
    {
        LegacyConversion,
        LexicalParsing,
        SyntaxParsing,
    }

    [Theory]
    [InlineData(FailedTestCase.LegacyConversion, false)]
    [InlineData(FailedTestCase.LegacyConversion, true)]
    [InlineData(FailedTestCase.LexicalParsing, false)]
    [InlineData(FailedTestCase.LexicalParsing, true)]
    [InlineData(FailedTestCase.SyntaxParsing, true)]
    internal void ShouldThrow_IncludingAllDetails_IfParseException(FailedTestCase testCase, bool isParseEx)
    {
        var testEx = isParseEx ? new ParseException(3, "Oups") : new Exception("Oups");

        switch (testCase)
        {
            case FailedTestCase.LegacyConversion:
                legacyConverter.SetupWithAnyArgs(c => c.Convert(null)).Throws(testEx);

                break;
            case FailedTestCase.LexicalParsing:
                lexicalParser.SetupWithAnyArgs(p => p.Parse(null)).Throws(testEx);

                break;
            case FailedTestCase.SyntaxParsing:
                syntaxParser.SetupWithAnyArgs(p => p.Parse(null)).Throws(testEx);

                break;
        }

        Action act = () => target.Parse(inputExpression, typeof(string));

        var ex = act.Should().Throw().Which;
        ex.Message.Should().StartWith(isParseEx
            ? "Failed parsing DSL expression 'Test Expr' at position 3 containing 't Expr'. To understand"
            : "Failed parsing DSL expression 'Test Expr'. To understand");
        ex.InnerException.Should().BeSameAs(testEx);
    }

    [Theory]
    [InlineData(DslType.Number, typeof(string))]
    [InlineData(DslType.Void, typeof(object))]
    internal void ShouldThrow_IfIncompatibleResultType(DslType parsedType, Type requestedType)
    {
        expressionToReturn.SetupGet(e => e.ResultType).Returns(parsedType);

        Action act = () => target.Parse(inputExpression, requestedType);

        var ex = act.Should().Throw().Which;
        ex.Message.Should().StartWith("Failed parsing DSL expression");
        ex.InnerException.Message.Should().Be($"Expression is of type {parsedType} but incompatible {requestedType} was expected/requested.");
    }
}
