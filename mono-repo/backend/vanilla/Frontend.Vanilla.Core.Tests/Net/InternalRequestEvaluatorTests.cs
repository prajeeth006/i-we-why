using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public sealed class InternalRequestEvaluatorTests
{
    [Fact]
    public void ShouldBeExternal()
    {
        IInternalRequestEvaluator target = new NegativeInternalRequestEvaluator();
        target.IsInternal().Should().BeFalse(); // Act
    }
}
