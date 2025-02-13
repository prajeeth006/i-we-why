using System;
using FluentAssertions;
using Frontend.Vanilla.Core.DependencyInjection;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.DependencyInjection;

public class InjectedArgumentTests
{
    [Fact]
    public void ShouldCreateWithFunc()
    {
        var func = Mock.Of<Func<IServiceProvider, object>>();

        var target = new InjectedArgument(func); // Act

        target.GetValue.Should().BeSameAs(func);
    }

    [Fact]
    public void ShouldCreateWithStaticValue()
    {
        var target = new InjectedArgument("value"); // Act

        target.GetValue(null).Should().Be("value");
    }

    [Fact]
    public void ShouldCreateWithGenerics()
    {
        var target = new InjectedArgument<string>(); // Act

        var provider = Mock.Of<IServiceProvider>(p => p.GetService(typeof(string)) == (object)"result");
        target.GetValue(provider).Should().Be("result");
    }
}
