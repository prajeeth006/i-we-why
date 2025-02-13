using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Lexical;

public sealed class TokenTests
{
    private class TestToken : Token
    {
        public TestToken(int position)
            : base(position) { }

        public override string ToString() => throw new NotImplementedException();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(66)]
    public void Position_ShouldSupportZero(int position)
    {
        var target = new TestToken(position);

        target.Position.Should().Be(position);
    }

    [Fact]
    public void Position_ShouldThrow_IfNegative()
        => new Func<object>(() => new TestToken(-1))
            .Should().Throw<ArgumentOutOfRangeException>();

    [Fact]
    public void KeywordToken_ShouldCreateCorrectly()
    {
        var target = new KeywordToken(66, Keyword.True);

        target.Position.Should().Be(66);
        target.Keyword.Should().BeSameAs(Keyword.True);
        target.ToString().Should().Be("TRUE literal at position 66");
    }

    [Fact]
    internal void StringLiteralToken_ShouldCreateCorrectly()
    {
        var target = new StringLiteralToken(66, "bwin");
        target.Position.Should().Be(66);
        target.Value.Should().Be("bwin");
        target.ToString().Should().Be("String literal 'bwin' at position 66");
    }

    [Fact]
    internal void NumberLiteralToken_ShouldCreateCorrectly()
    {
        var target = new NumberLiteralToken(66, 1.23m);
        target.Position.Should().Be(66);
        target.Value.Should().Be(1.23m);
        target.ToString().Should().Be("Number literal 1.23 at position 66");
    }

    [Fact]
    internal void IdentifierToken_ShouldCreateCorrectly()
    {
        var target = new IdentifierToken(66, "User");
        target.Position.Should().Be(66);
        target.Value.Should().Be(new Identifier("User"));
        target.ToString().Should().Be("Identifier 'User' at position 66");
    }
}
