using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Lexical;

public class SyntaxHintTests
{
    [Fact]
    public void AllHints_ShouldNotBeEmpty()
        => SyntaxHint.AllHints.Should().NotBeEmpty();

    [Fact]
    public void ShouldDescribeAllKeywords()
        => SyntaxHint.AllHints.SelectMany(h => h.Keywords).Distinct()
            .Should().BeEquivalentTo(Keyword.AllKeywords);
}
