using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Proxy;
using Frontend.Vanilla.DomainSpecificLanguage;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Proxy;

public class CompiledProxyRuleTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var condition = Mock.Of<IDslExpression<bool>>();
        var id = new DocumentId("/target-id");

        var target = new CompiledProxyRule(condition, id); // Act

        target.Condition.Should().BeSameAs(condition);
        target.TargetId.Should().BeSameAs(id);
    }

    [Fact]
    public void ShouldAllowNulls()
    {
        var target = new CompiledProxyRule(null, null); // Act

        target.Condition.Should().BeNull();
        target.TargetId.Should().BeNull();
    }
}
