using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Delegator;

public class ProxyDelegatorTests
{
    [Fact]
    public void LambdaProxyDelegator_ShouldDelegateToLambda()
    {
        var func = Mock.Of<Func<string, object>>(f => f("member") == (object)"obj");
        var target = new LambdaProxyDelegator(func);

        // Act
        var result = target.ResolveTarget("member");

        result.Should().Be("obj");
    }

    [Fact]
    public void ProxyDelegatorBase_ShouldUpcastResult()
    {
        var targetMock = new Mock<ProxyDelegator<string>> { CallBase = true };
        IProxyDelegator target = targetMock.Object;
        targetMock.Setup(t => t.ResolveTarget("member")).Returns("obj");

        // Act
        var result = target.ResolveTarget("member");

        result.Should().Be("obj");
    }
}
