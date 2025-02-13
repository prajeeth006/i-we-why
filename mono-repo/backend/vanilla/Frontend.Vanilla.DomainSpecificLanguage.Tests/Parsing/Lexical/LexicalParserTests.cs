using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Lexical;

public class LexicalParserTests
{
    private static readonly ILexicalParser Target = new LexicalParser();

    [Fact]
    public void ShouldParseComplexExpression()
        => ParseAndExpect(
            "(User.IsKnown AND User.Balance > 1.23) OR Request.Culture IN ['EN', 'DE']",
            new KeywordToken(0, Keyword.LeftParenthesis),
            new IdentifierToken(1, "User"),
            new KeywordToken(5, Keyword.Dot),
            new IdentifierToken(6, "IsKnown"),
            new KeywordToken(14, Keyword.And),
            new IdentifierToken(18, "User"),
            new KeywordToken(22, Keyword.Dot),
            new IdentifierToken(23, "Balance"),
            new KeywordToken(31, Keyword.Greater),
            new NumberLiteralToken(33, 1.23m),
            new KeywordToken(37, Keyword.RightParenthesis),
            new KeywordToken(39, Keyword.Or),
            new IdentifierToken(42, "Request"),
            new KeywordToken(49, Keyword.Dot),
            new IdentifierToken(50, "Culture"),
            new KeywordToken(58, Keyword.In),
            new KeywordToken(61, Keyword.LeftSquareBracket),
            new StringLiteralToken(62, "EN"),
            new KeywordToken(66, Keyword.Comma),
            new StringLiteralToken(68, "DE"),
            new KeywordToken(72, Keyword.RightSquareBracket));

    [Fact]
    public void ShouldParseComplexAction()
        => ParseAndExpect(
            "IF User.Level > 100 THEN Request.Redirect('/chucknorris') ELSE Request.Redirect('/regular') END",
            new KeywordToken(0, Keyword.If),
            new IdentifierToken(3, "User"),
            new KeywordToken(7, Keyword.Dot),
            new IdentifierToken(8, "Level"),
            new KeywordToken(14, Keyword.Greater),
            new NumberLiteralToken(16, 100m),
            new KeywordToken(20, Keyword.Then),
            new IdentifierToken(25, "Request"),
            new KeywordToken(32, Keyword.Dot),
            new IdentifierToken(33, "Redirect"),
            new KeywordToken(41, Keyword.LeftParenthesis),
            new StringLiteralToken(42, "/chucknorris"),
            new KeywordToken(56, Keyword.RightParenthesis),
            new KeywordToken(58, Keyword.Else),
            new IdentifierToken(63, "Request"),
            new KeywordToken(70, Keyword.Dot),
            new IdentifierToken(71, "Redirect"),
            new KeywordToken(79, Keyword.LeftParenthesis),
            new StringLiteralToken(80, "/regular"),
            new KeywordToken(90, Keyword.RightParenthesis),
            new KeywordToken(92, Keyword.End));

    [Fact]
    public void ShouldThrow_IfUnknownToken()
        => ParseAndExpectError("#!@", "Unrecognized token detected.");

    [Theory]
    [InlineData("  User .", "User")]
    [InlineData("  Users.", "Users")] // Punctuation can follow immediately
    [InlineData("  U12r .", "U12r")]
    [InlineData("  Us_r .", "Us_r")]
    public void Identifier_ShouldParse(string input, string expectedIdentifier)
        => ParseAndExpect(
            input,
            new IdentifierToken(2, expectedIdentifier),
            new KeywordToken(7, Keyword.Dot));

    [Theory]
    [InlineData(@"  ""Chuck 'Norris""  .", "Chuck 'Norris")]
    [InlineData(@"  'Chuck ""Norris'  .", @"Chuck ""Norris")]
    public void StringLiteral_ShouldParse(string input, string expectedValue)
        => ParseAndExpect(
            input,
            new StringLiteralToken(2, expectedValue),
            new KeywordToken(19, Keyword.Dot));

    [Theory]
    [InlineData("'Hello\" world", "single")]
    [InlineData("\"Hello' world", "double")]
    public void StringLiteral_ShouldThrowIfUnclosed(string input, string quoteDesc)
        => ParseAndExpectError(input, $"Unclosed string literal opened by {quoteDesc} quote. It must be closed by the same one.");

    [Theory]
    [InlineData("  123", 123)]
    [InlineData("  1.23", 1.23)]
    public void NumberLiteral_ShouldParse(string input, double expected)
        => ParseAndExpect(
            input,
            new NumberLiteralToken(2, (decimal)expected));

    [Fact]
    public void NumberLiteral_ShouldAllowSeparatedDot()
        => ParseAndExpect(
            "  123  .",
            new NumberLiteralToken(2, 123),
            new KeywordToken(7, Keyword.Dot));

    [Theory]
    [InlineData("12.", "Number ends with a dot but it's missing decimal part.")]
    [InlineData("12.34.", "Numbers can contain only one dot to separate decimal part.")]
    [InlineData("12AB", "Numbers must be separated by a space from an identifier. Also identifiers can't start with a digit.")]
    [InlineData("12_AB", "Numbers must be separated by a space from an identifier. Also identifiers can't start with a digit.")]
    public void NumberLiteral_ShouldThrow_IfInvalid(string input, string expectedError)
        => ParseAndExpectError(input, expectedError);

    public static IEnumerable<object[]> KeywordInlineDatas => new[]
    {
        new object[] { ".", Keyword.Dot },
        new object[] { ",", Keyword.Comma },
        new object[] { "(", Keyword.LeftParenthesis },
        new object[] { ")", Keyword.RightParenthesis },
        new object[] { "[", Keyword.LeftSquareBracket },
        new object[] { "]", Keyword.RightSquareBracket },
        new object[] { "=", Keyword.Equality },
        new object[] { "<>", Keyword.Inequality },
        new object[] { "<", Keyword.Less },
        new object[] { "<=", Keyword.LessOrEqual },
        new object[] { ">", Keyword.Greater },
        new object[] { ">=", Keyword.GreaterOrEqual },
        new object[] { "TRUE", Keyword.True },
        new object[] { "FALSE", Keyword.False },
        new object[] { "AND", Keyword.And },
        new object[] { "OR", Keyword.Or },
        new object[] { "NOT", Keyword.Not },
        new object[] { "IN", Keyword.In },
        new object[] { "MATCHES", Keyword.Matches },
        new object[] { "CONTAINS", Keyword.Contains },
        new object[] { "STARTS-WITH", Keyword.StartsWith },
        new object[] { "ENDS-WITH", Keyword.EndsWith },
        new object[] { "LOWERCASE", Keyword.LowerCase },
        new object[] { "UPPERCASE", Keyword.UpperCase },
        new object[] { "NUMBER", Keyword.Number },
        new object[] { "STRING", Keyword.String },
        new object[] { "TRIM", Keyword.Trim },
        new object[] { "+", Keyword.Addition },
        new object[] { "-", Keyword.Subtraction },
        new object[] { "*", Keyword.Multiplication },
        new object[] { "/", Keyword.Division },
        new object[] { "%", Keyword.Modulo },
        new object[] { "ROUND", Keyword.Round },
        new object[] { "CEIL", Keyword.Ceil },
        new object[] { "FLOOR", Keyword.Floor },
        new object[] { "IF", Keyword.If },
        new object[] { "THEN", Keyword.Then },
        new object[] { "ELSE", Keyword.Else },
        new object[] { "ELSE-IF", Keyword.ElseIf },
        new object[] { "END", Keyword.End },
        new object[] { "?", Keyword.QuestionMark },
        new object[] { ":", Keyword.Colon },
        new object[] { ":=", Keyword.VariableAssignment },
        new object[] { "LENGTH", Keyword.Length },
        new object[] { "INDEX-OF", Keyword.IndexOf },
        new object[] { "LAST-INDEX-OF", Keyword.LastIndexOf },
        new object[] { "SUBSTRING-FROM", Keyword.SubstringFrom },
        new object[] { "TAKE", Keyword.Take },
        new object[] { "URL-ENCODE", Keyword.UrlEncode },
        new object[] { "URL-DECODE", Keyword.UrlDecode },
    };

    [Theory, MemberData(nameof(KeywordInlineDatas))]
    internal void Keyword_ShouldParse(string input, Keyword expectedKeyword)
        => ParseAndExpect(
            "'Hello' " + input + " 'world'",
            new StringLiteralToken(0, "Hello"),
            new KeywordToken(8, expectedKeyword),
            new StringLiteralToken(8 + input.Length + 1, "world"));

    [Fact]
    public void Keyword_ShouldTestAllKeywords()
        => KeywordInlineDatas.Select(tc => tc[1]).Should().BeEquivalentTo(Keyword.AllKeywords);

    [Fact]
    public void ShouldDistinquishBetweenVariableAssignmentAndColonWithEquality()
        => ParseAndExpect(
            " := : =",
            new KeywordToken(1, Keyword.VariableAssignment),
            new KeywordToken(4, Keyword.Colon),
            new KeywordToken(6, Keyword.Equality));

    [Theory]
    [InlineData("ANDwtf")]
    [InlineData("AND123")]
    [InlineData("AND__")]
    public void ConstantToken_ShouldThrowIfTextualContantFollowedByIdentifier(string input)
        => ParseAndExpectError(input, "Keyword 'AND' is immediately followed by unexpected identifier.");

    [Fact]
    public void Keyword_ShouldParseIfPunctuationFollowedByIdentifier()
        => ParseAndExpect(
            "(User",
            new KeywordToken(0, Keyword.LeftParenthesis),
            new IdentifierToken(1, "User"));

    [Fact]
    public void Keyword_ShouldParseIfTextualConstantFollowedByPunctuation()
        => ParseAndExpect(
            "AND(",
            new KeywordToken(0, Keyword.And),
            new KeywordToken(3, Keyword.LeftParenthesis));

    private void ParseAndExpect(string input, params Token[] expectedTokens)
    {
        var tokens = Target.Parse(input);
        tokens.Should().Equal(expectedTokens);
    }

    private void ParseAndExpectError(string input, string expectedMessage)
    {
        input = "   " + input; // Add some whitespace to verify positon

        Func<IEnumerable> act = () => Target.Parse(input);

        act.Enumerating().Should().Throw<ParseException>()
            .WithMessage(expectedMessage)
            .And.Position.Should().Be(3);
    }
}
