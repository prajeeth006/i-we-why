using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Syntactical;

public class ParsingContextTests
{
    [Fact]
    public void ConstructorTest()
    {
        var currentToken = new NumberLiteralToken(1, 123);
        var parsedExpressionOnLeft = Mock.Of<IExpressionTree>();
        var remainingTokensOnRight = new LinkedList<Token>();
        var previousOperator = new KeywordToken(2, Keyword.Greater);
        var allWarnings = new List<TrimmedRequiredString>();
        var localVariables = new Dictionary<TrimmedRequiredString, DslType>();

        // Act
        var target = new ParsingContext(currentToken, parsedExpressionOnLeft, remainingTokensOnRight, previousOperator, allWarnings, localVariables);

        target.CurrentToken.Should().BeSameAs(currentToken);
        target.ParsedExpressionOnLeft.Should().BeSameAs(parsedExpressionOnLeft);
        target.RemainingTokensOnRight.Should().BeSameAs(remainingTokensOnRight);
        target.PreviousOperator.Should().BeSameAs(previousOperator);
        target.AllWarnings.Should().BeSameAs(allWarnings);
        target.LocalVariables.Should().BeSameAs(localVariables);
    }
}
