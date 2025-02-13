using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Syntactical;

public sealed class SyntaxParserTests
{
    private ISyntaxParser target;
    private Mock<IProviderAccessFactory> providerAccessFactory;

    public SyntaxParserTests()
    {
        providerAccessFactory = new Mock<IProviderAccessFactory>();
        target = new SyntaxParser(providerAccessFactory.Object);
    }

    [Fact]
    public void ShouldParseExpression()
    {
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Balance"),
            new KeywordToken(0, Keyword.Greater),
            new NumberLiteralToken(0, 100m),
            new KeywordToken(0, Keyword.And),
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.Equality),
            new StringLiteralToken(0, "Chuck Norris"),
        };
        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any())))
            .Returns(userBalance.WithWarnings());
        providerAccessFactory
            .Setup(f => f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single()).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        var (expr, warnings) = target.Parse(tokens);

        Verify<BinaryOperation>(
            expr,
            e1 =>
            {
                e1.Operator.Keyword.Should().Be(Keyword.And);
                Verify<BinaryOperation>(
                    e1.LeftOperand,
                    e2 =>
                    {
                        e2.Operator.Keyword.Should().Be(Keyword.Greater);
                        e2.LeftOperand.Should().BeSameAs(userBalance);
                        ExpectLiteral(e2.RightOperand, 100);
                    });
                Verify<BinaryOperation>(
                    e1.RightOperand,
                    e2 =>
                    {
                        e2.Operator.Keyword.Should().Be(Keyword.Equality);
                        e2.LeftOperand.Should().BeSameAs(cookiesGet);
                        ExpectLiteral(e2.RightOperand, "Chuck Norris");
                    });
            });
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfDifferentTypesBinaryOperation()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(1, Keyword.Equality),
            new NumberLiteralToken(0, 500m),
        };
        providerAccessFactory.Setup(f =>
                f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single(null)).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>();
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfIdentifierWithLeftExpression()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new IdentifierToken(5, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Balance"),
            new KeywordToken(0, Keyword.Greater),
            new NumberLiteralToken(0, 100m),
        };

        providerAccessFactory.Setup(f =>
                f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single(null)).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any(null))))
            .Returns(userBalance.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Particular one of parameters for function 'Cookies.Get' must be separated from next one by Comma ','.");
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfIdentifierTokensOrderError()
    {
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new KeywordToken(0, Keyword.Greater),
            new NumberLiteralToken(0, 100m),
        };

        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any(null))))
            .Returns(userBalance.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithInnerMessage("Identifier must be followed by Dot '.' and another Identifier to represent a provider property/function e.g. 'Foo.Bar'.");
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfNoClosingParentheses()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(1, "Cookies"),
            new KeywordToken(2, Keyword.Dot),
            new IdentifierToken(3, "Get"),
            new KeywordToken(4, Keyword.LeftParenthesis),
            new StringLiteralToken(5, "heroName"),
            new KeywordToken(6, Keyword.Equality),
            new StringLiteralToken(7, "Chuck Norris"),
        };

        providerAccessFactory.Setup(f =>
                f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single(null)).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Particular one of parameters for function 'Cookies.Get' must be separated from next one by comma ','.")
            .Where(e => e.Position == 5);
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfNoClosingRightSquareBracketForInOperation()
    {
        var tokens = new Token[]
        {
            new IdentifierToken(1, "User"),
            new KeywordToken(2, Keyword.Dot),
            new IdentifierToken(3, "LogiName"),
            new KeywordToken(4, Keyword.In),
            new KeywordToken(5, Keyword.LeftSquareBracket),
            new StringLiteralToken(6, "Chuck Norris"),
        };
        providerAccessFactory.SetupWithAnyArgs(f => f.Create(null, null, null)).Returns(Mock.Of<IExpressionTree>().WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Particular one of values for IN operator must be separated from next one by comma ','.")
            .Where(e => e.Position == 6);
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_OnUnaryOperationWithLeftExpression()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new StringLiteralToken(0, "bla"),
            new KeywordToken(4, Keyword.LowerCase),
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.Equality),
            new StringLiteralToken(0, "Chuck Norris"),
        };

        providerAccessFactory.Setup(f =>
                f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single(null)).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Found unexpected token LOWERCASE operator at position 4.");
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_IfLogicalBooleanOperatorsNotCorrect()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.Contains),
            new StringLiteralToken(0, "uck"),

            new KeywordToken(4, Keyword.And),

            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.StartsWith),
            new StringLiteralToken(0, "Chuck"),

            new KeywordToken(6, Keyword.Or),

            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.In),
            new KeywordToken(0, Keyword.LeftSquareBracket),
            new StringLiteralToken(0, "Chuck Norris, someone else"),
            new KeywordToken(0, Keyword.RightSquareBracket),
        };
        providerAccessFactory
            .Setup(f => f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single()).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Failed processing DSL token OR operator at position 6.")
            .WithInnerMessage("The OR operator at position 6 conflicts with previous AND operator at position 4. Use parentheses to make the expression unambiguous.");
    }

    [Fact]
    public void SyntaxParser_ShouldThrowParseException_OnBadOperatorType()
    {
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Balance"),
            new KeywordToken(3, Keyword.Contains),
            new NumberLiteralToken(0, 100m),
        };

        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any(null))))
            .Returns(userBalance.WithWarnings());

        // Act
        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>();
    }

    [Fact]
    public void SyntaxParser_ShouldReturnNoWarnings_IfValidOperation()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(1, Keyword.Dot),
            new IdentifierToken(2, "Get"),
            new KeywordToken(3, Keyword.LeftParenthesis),
            new StringLiteralToken(4, "heroName"),
            new KeywordToken(5, Keyword.RightParenthesis),
            new KeywordToken(6, Keyword.In),
            new KeywordToken(7, Keyword.LeftSquareBracket),
            new StringLiteralToken(8, "Chuck Norris, someone else"),
            new KeywordToken(9, Keyword.RightSquareBracket),
        };

        providerAccessFactory
            .Setup(f => f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single()).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        var (_, warnings) = target.Parse(tokens);

        warnings.Should().BeEmpty();
    }

    public static IEnumerable<object[]> MemberAccessTestCases => new[]
    {
        new object[] { 100, Keyword.Greater, Keyword.Greater },
        new object[] { 50, Keyword.Equality, Keyword.Equality },
        new object[] { 150, Keyword.Less, Keyword.Less },
        new object[] { 150, Keyword.LessOrEqual, Keyword.LessOrEqual },
    };

    [Theory, MemberData(nameof(MemberAccessTestCases))]
    internal void ShouldParseMemberAccess(int inputValue, Keyword operatorType, Keyword expectedOperator)
    {
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Balance"),
            new KeywordToken(0, operatorType),
            new NumberLiteralToken(0, (decimal)inputValue),
        };

        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any())))
            .Returns(userBalance.WithWarnings());

        // Act
        var (expr, warnings) = target.Parse(tokens);

        ((BinaryOperation)expr).Operator.Keyword.Should().Be(expectedOperator);
        ((Literal)((BinaryOperation)expr).RightOperand).GetValue<object>().Should().Be(inputValue);
        warnings.Should().BeEmpty();
    }

    public static IEnumerable<object[]> LiteralTestCases => new[]
    {
        new object[] { new KeywordToken(0, Keyword.True), true },
        new object[] { new KeywordToken(0, Keyword.False), false },
        new object[] { new StringLiteralToken(0, "bwin"), "bwin" },
        new object[] { new NumberLiteralToken(0, 6.66m), 6.66m },
    };

    [Theory, MemberData(nameof(LiteralTestCases))]
    internal void ShouldParseLiteral(Token token, object expectedValue)
    {
        var tokens = new Token[] { token };

        // Act
        var (expr, warnings) = target.Parse(tokens);

        ExpectLiteral(expr, expectedValue);
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldParseStringOperators_WithLogicalBooleanOperators()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.Contains),
            new StringLiteralToken(0, "uck"),

            new KeywordToken(0, Keyword.And),

            new KeywordToken(0, Keyword.LeftParenthesis),
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.StartsWith),
            new StringLiteralToken(0, "Chuck"),

            new KeywordToken(0, Keyword.Or),

            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.In),
            new KeywordToken(0, Keyword.LeftSquareBracket),
            new StringLiteralToken(0, "Chuck Norris, someone else"),
            new KeywordToken(0, Keyword.RightSquareBracket),
            new KeywordToken(0, Keyword.RightParenthesis),
        };
        providerAccessFactory
            .Setup(f => f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single()).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        var (expr, warnings) = target.Parse(tokens);

        Verify<BinaryOperation>(
            expr,
            e1 =>
            {
                e1.Operator.Keyword.Should().Be(Keyword.And);
                Verify<BinaryOperation>(
                    e1.LeftOperand,
                    e2 =>
                    {
                        e2.Operator.Keyword.Should().Be(Keyword.Contains);
                        e2.LeftOperand.Should().BeSameAs(cookiesGet);
                        ExpectLiteral(e2.RightOperand, "uck");
                    });
                Verify<BinaryOperation>(
                    e1.RightOperand,
                    e2 =>
                    {
                        e2.Operator.Keyword.Should().Be(Keyword.Or);
                        Verify<BinaryOperation>(
                            e2.LeftOperand,
                            el2 =>
                            {
                                el2.Operator.Keyword.Should().Be(Keyword.StartsWith);
                                el2.LeftOperand.Should().BeSameAs(cookiesGet);
                                ExpectLiteral(el2.RightOperand, "Chuck");
                            });

                        // ((Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Literal)((Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.CachedExpression)((Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.IExpressionTree[])((Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.IsInListCondition)((Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.CachedExpression)el1.RightOperand).List)[0]).Value
                        var inner = e2.RightOperand.Should().BeOfType<IsInListCondition>().Subject;
                        ((Literal)inner.List[0]).GetValue<object>().Should().Be("Chuck Norris, someone else");
                    });
            });
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void SyntaxParser_ShouldParseStringOperators_WithUnaryOperation()
    {
        var cookiesGet = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new KeywordToken(0, Keyword.LowerCase),
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Get"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "heroName"),
            new KeywordToken(0, Keyword.RightParenthesis),
            new KeywordToken(0, Keyword.Equality),
            new StringLiteralToken(0, "Chuck Norris"),
        };

        providerAccessFactory
            .Setup(f => f.Create("Cookies", "Get", It.Is<IEnumerable<IExpressionTree>>(p => ((Literal)p.Single()).GetValue<object>().Equals("heroName"))))
            .Returns(cookiesGet.WithWarnings());

        // Act
        var (_, warnings) = target.Parse(tokens);

        warnings.Should().BeEmpty();
    }

    [Fact]
    public void SyntaxParser_ShouldReturnWarnings_IfIdentifierProviderWarnings()
    {
        var userBalance = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Number);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Balance"),
            new KeywordToken(0, Keyword.Greater),
            new NumberLiteralToken(0, 100m),
        };

        providerAccessFactory.Setup(f => f.Create("User", "Balance", It.Is<IEnumerable<IExpressionTree>>(p => !p.Any())))
            .Returns(userBalance.WithWarnings("Warn 1", "Warn 2"));

        // Act
        var (_, warnings) = target.Parse(tokens);

        warnings.Should().Equal("Warn 1", "Warn 2");
    }

    [Fact]
    public void ShouldParseNegativeNumber()
    {
        var tokens = new Token[]
        {
            new KeywordToken(0, Keyword.Subtraction),
            new NumberLiteralToken(0, 66m),
        };

        // Act
        var (expr, warnings) = target.Parse(tokens);

        ExpectLiteral(expr, -66m);
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldParseNegativeNumberWithinCompositeExpression()
    {
        var tokens = new Token[]
        {
            new NumberLiteralToken(0, 1m),
            new KeywordToken(0, Keyword.Multiplication),
            new KeywordToken(0, Keyword.Subtraction),
            new NumberLiteralToken(0, 2m),
        };

        // Act
        var (expr, warnings) = target.Parse(tokens);

        Verify<BinaryOperation>(expr, e =>
        {
            e.Operator.Keyword.Should().Be(Keyword.Multiplication);
            ExpectLiteral(e.LeftOperand, 1);
            ExpectLiteral(e.RightOperand, -2);
        });
    }

    [Fact]
    public void ShouldParseStatementBlock()
    {
        var userLogout = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var cookiesSet1 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var cookiesSet2 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Set"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "Chuck Norris"),
            new KeywordToken(0, Keyword.RightParenthesis),

            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Logout"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new NumberLiteralToken(0, 123m),
            new KeywordToken(0, Keyword.RightParenthesis),

            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Set"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "Bruce Lee"),
            new KeywordToken(0, Keyword.RightParenthesis),
        };
        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Chuck Norris") })))
            .Returns(cookiesSet1.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Logout", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard(123m) })))
            .Returns(userLogout.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Bruce Lee") })))
            .Returns(cookiesSet2.WithWarnings());

        // Act
        var (expr, _) = target.Parse(tokens);

        Verify<StatementBlock>(expr, b1 =>
        {
            b1.Statements.Should().HaveCount(2);
            VerifySame(b1.Statements[0], cookiesSet1);
            Verify<StatementBlock>(b1.Statements[1], b2 =>
            {
                b2.Statements.Should().HaveCount(2);
                VerifySame(b2.Statements[0], userLogout);
                VerifySame(b2.Statements[1], cookiesSet2);
            });
        });
    }

    [Fact]
    public void ShouldThrow_IfNotVoidStatementInBlock()
    {
        var userLogout = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var userName = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.String);
        var tokens = new Token[]
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Logout"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new NumberLiteralToken(0, 123m),
            new KeywordToken(0, Keyword.RightParenthesis),

            new IdentifierToken(66, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Name"),
        };
        providerAccessFactory.Setup(f => f.Create("User", "Logout", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard(123m) })))
            .Returns(userLogout.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Name", ItIs.Empty<IEnumerable<IExpressionTree>>()))
            .Returns(userName.WithWarnings());

        Action act = () => target.Parse(tokens);

        act.Should().Throw<ParseException>()
            .WithMessage("Block of statements can contain only Void statements but there is a String expression.")
            .Which.Position.Should().Be(66);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldParseIfElseStatement(bool hasElse)
    {
        var cookiesSet1 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var cookiesSet2 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var userLogout = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var tokens = new List<Token>
        {
            new KeywordToken(0, Keyword.If),
            new NumberLiteralToken(0, 1m),
            new KeywordToken(0, Keyword.Less),
            new NumberLiteralToken(0, 2m),
            new KeywordToken(0, Keyword.Then),

            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Set"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "Chuck Norris"),
            new KeywordToken(0, Keyword.RightParenthesis),

            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Logout"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new NumberLiteralToken(0, 123m),
            new KeywordToken(0, Keyword.RightParenthesis),
        };

        if (hasElse)
            tokens.Add(
                new KeywordToken(0, Keyword.Else),
                new IdentifierToken(0, "Cookies"),
                new KeywordToken(0, Keyword.Dot),
                new IdentifierToken(0, "Set"),
                new KeywordToken(0, Keyword.LeftParenthesis),
                new StringLiteralToken(0, "Bruce Lee"),
                new KeywordToken(0, Keyword.RightParenthesis),
                new KeywordToken(0, Keyword.End));
        else
            tokens.Add(new KeywordToken(0, Keyword.End));

        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Chuck Norris") })))
            .Returns(cookiesSet1.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Bruce Lee") })))
            .Returns(cookiesSet2.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Logout", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard(123m) })))
            .Returns(userLogout.WithWarnings());

        // Act
        var (expr, _) = target.Parse(tokens);

        Verify<IfElseStatement>(expr, i =>
        {
            Verify<BinaryOperation>(i.Condition, o =>
            {
                o.Operator.Keyword.Should().Be(Keyword.Less);
                ExpectLiteral(o.LeftOperand, 1m);
                ExpectLiteral(o.RightOperand, 2m);
            });
            Verify<StatementBlock>(i.ThenStatement, b =>
            {
                b.Statements.Should().HaveCount(2);
                VerifySame(b.Statements[0], cookiesSet1);
                VerifySame(b.Statements[1], userLogout);
            });
            if (hasElse)
                VerifySame(i.ElseStatement, cookiesSet2);
            else
                i.ElseStatement.Should().BeNull();
        });
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldParseIfElseIfStatement(bool hasElse)
    {
        var cookiesSet1 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var cookiesSet2 = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var userLogout = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var tokens = new List<Token>
        {
            new KeywordToken(0, Keyword.If),
            new NumberLiteralToken(0, 1m),
            new KeywordToken(0, Keyword.Less),
            new NumberLiteralToken(0, 2m),

            new KeywordToken(0, Keyword.Then),
            new IdentifierToken(0, "Cookies"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Set"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new StringLiteralToken(0, "Chuck Norris"),
            new KeywordToken(0, Keyword.RightParenthesis),

            new KeywordToken(0, Keyword.ElseIf),
            new NumberLiteralToken(0, 3m),
            new KeywordToken(0, Keyword.Greater),
            new NumberLiteralToken(0, 4m),

            new KeywordToken(0, Keyword.Then),
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Logout"),
            new KeywordToken(0, Keyword.LeftParenthesis),
            new NumberLiteralToken(0, 123m),
            new KeywordToken(0, Keyword.RightParenthesis),
        };

        if (hasElse)
            tokens.Add(
                new KeywordToken(0, Keyword.Else),
                new IdentifierToken(0, "Cookies"),
                new KeywordToken(0, Keyword.Dot),
                new IdentifierToken(0, "Set"),
                new KeywordToken(0, Keyword.LeftParenthesis),
                new StringLiteralToken(0, "Bruce Lee"),
                new KeywordToken(0, Keyword.RightParenthesis),
                new KeywordToken(0, Keyword.End));
        else
            tokens.Add(new KeywordToken(0, Keyword.End));

        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Chuck Norris") })))
            .Returns(cookiesSet1.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("Cookies", "Set", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard("Bruce Lee") })))
            .Returns(cookiesSet2.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Logout", ItIs.SequenceEqual<IEnumerable<IExpressionTree>>(new[] { Literal.GetWildcard(123m) })))
            .Returns(userLogout.WithWarnings());

        // Act
        var (expr, _) = target.Parse(tokens);

        Verify<IfElseStatement>(expr, i =>
        {
            Verify<BinaryOperation>(i.Condition, o =>
            {
                o.Operator.Keyword.Should().Be(Keyword.Less);
                ExpectLiteral(o.LeftOperand, 1m);
                ExpectLiteral(o.RightOperand, 2m);
            });
            i.ThenStatement.Should().BeSameAs(cookiesSet1);
            Verify<IfElseStatement>(i.ElseStatement, j =>
            {
                Verify<BinaryOperation>(j.Condition, o =>
                {
                    o.Operator.Keyword.Should().Be(Keyword.Greater);
                    ExpectLiteral(o.LeftOperand, 3m);
                    ExpectLiteral(o.RightOperand, 4m);
                });
                j.ThenStatement.Should().BeSameAs(userLogout);

                if (hasElse)
                    VerifySame(j.ElseStatement, cookiesSet2);
                else
                    j.ElseStatement.Should().BeNull();
            });
        });
    }

    [Theory]
    [InlineData(DslType.Number)]
    [InlineData(DslType.String)]
    internal void ShouldParseTernaryConditionalOperation(DslType operandType)
    {
        var condition = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Boolean);
        var consequent = Mock.Of<IExpressionTree>(e => e.ResultType == operandType);
        var alternative = Mock.Of<IExpressionTree>(e => e.ResultType == operandType);
        var tokens = new List<Token>
        {
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "IsOK"),

            new KeywordToken(0, Keyword.QuestionMark),
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Consequent"),

            new KeywordToken(0, Keyword.Colon),
            new IdentifierToken(0, "User"),
            new KeywordToken(0, Keyword.Dot),
            new IdentifierToken(0, "Alternative"),
        };

        providerAccessFactory.Setup(f => f.Create("User", "IsOK", ItIs.Empty<IEnumerable<IExpressionTree>>())).Returns(condition.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Consequent", ItIs.Empty<IEnumerable<IExpressionTree>>())).Returns(consequent.WithWarnings());
        providerAccessFactory.Setup(f => f.Create("User", "Alternative", ItIs.Empty<IEnumerable<IExpressionTree>>())).Returns(alternative.WithWarnings());

        // Act
        var (expr, _) = target.Parse(tokens);

        Verify<TernaryConditionalOperation>(expr, o =>
        {
            VerifySame(o.Condition, condition);
            VerifySame(o.Consequent, consequent);
            VerifySame(o.Alternative, alternative);
        });
    }

    private static void Verify<TExpected>(IExpressionTree expr, Action<TExpected> expecations)
    {
        var expected = expr.Should().BeAssignableTo<TExpected>().Subject;
        expecations(expected);
    }

    private static void VerifySame(IExpressionTree actual, IExpressionTree expected)
        => actual.Should().BeSameAs(expected);

    private static void ExpectLiteral(IExpressionTree expr, object value)
        => Verify<Literal>(expr, l => l.GetValue<object>().Should().Be(value));
}
