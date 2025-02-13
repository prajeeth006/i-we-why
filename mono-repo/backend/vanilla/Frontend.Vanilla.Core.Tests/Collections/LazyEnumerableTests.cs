using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class LazyEnumerableTests
{
    private IEnumerable<string> target;
    private Mock<Func<IEnumerable<string>>> factory;

    public LazyEnumerableTests()
    {
        factory = new Mock<Func<IEnumerable<string>>>();
        target = LazyEnumerable.Get(factory.Object);

        factory.Setup(f => f()).Returns(new[] { "a", "b" });
    }

    [Fact]
    public void ShouldNotEnumerateOnCreation()
        => factory.Verify(f => f(), Times.Never);

    [Fact]
    public void ShouldEnumerateItems()
        => target.Should().Equal("a", "b");
}
