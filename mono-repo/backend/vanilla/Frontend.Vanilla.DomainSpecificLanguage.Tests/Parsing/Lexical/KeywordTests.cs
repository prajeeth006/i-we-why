using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Lexical;

public sealed class KeywordTests
{
    [Fact]
    public void AllKeywords_ShouldBeUniqueAndSorted()
    {
        Keyword.AllKeywords.Should().NotBeEmpty();
        Keyword.AllKeywords.Select(k => k.Value.Value.Length).Should().BeInDescendingOrder();
        Keyword.AllKeywords.Select(k => k.Value.Value).Should().OnlyHaveUniqueItems();
    }

    public static IEnumerable<object[]> TestCases => Keyword.AllKeywords.Select(k => new[] { k });

    [Theory, MemberData(nameof(TestCases))]
    internal void AllKeywords_ShouldContainValueInName(Keyword keyword)
        => keyword.Name.Value.Should().Contain(keyword.Value);

    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        var target = Keyword.If;

        target.Value.Should().Be("IF");
        target.Name.Should().Be("IF keyword");
        target.ToString().Should().Be(target.Name);
    }
}
