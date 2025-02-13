using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Facade;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Facade;

public class DelegateToAttributeTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var target = new DelegateToAttribute(typeof(IFoo), "Bar");

        target.ServiceType.Should().Be(typeof(IFoo));
        target.MethodOrPropertyName.Should().Be("Bar");
    }

    public interface IFoo { }

    [Theory]
    [InlineData("  Bar")]
    [InlineData("Bar  ")]
    [InlineData("  ")]
    [InlineData("")]
    [InlineData(null)]
    public void ShouldThrow_IfInvalidParameters(string memberName)
        => new Func<object>(() => new DelegateToAttribute(typeof(IFoo), memberName))
            .Should().Throw<ArgumentException>();
}
