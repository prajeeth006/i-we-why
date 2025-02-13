using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Patterns;

public class LambdaFactoryTests
{
    [Fact]
    public void ShouldCallFunc()
    {
        var func = new Mock<Func<string>>();
        var target = new LambdaFactory<string>(func.Object);
        func.Setup(f => f()).Returns("value");

        var result = target.Create(); // Act

        result.Should().Be("value");
        func.Verify(f => f(), Times.Once);
    }
}
