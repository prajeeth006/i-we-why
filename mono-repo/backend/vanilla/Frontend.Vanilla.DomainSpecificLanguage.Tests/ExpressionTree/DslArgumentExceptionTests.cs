using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public sealed class DslArgumentExceptionTests
{
    [Fact]
    public void ShouldCreate()
    {
        var target = new DslArgumentException("Oups.");
        target.Message.Should().Be("Oups.");
    }
}
