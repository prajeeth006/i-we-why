using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class ListExtensionsTests
{
    [Fact]
    public void AsReadOnly_ShouldWrapGivenCollection()
    {
        var source = new[] { 1, 2, 3 };
        source.AsReadOnly().Should().Equal(source);
    }

    [Fact]
    public void ConvertAll_ShouldTransformItems()
        => new[] { 1, 2, 3 }
            .ConvertAll(x => x.ToString()) // Act
            .Should().Equal("1", "2", "3");

    [Fact]
    public void ConvertAllWithIndex_ShouldTransformItems()
        => new[] { "a", "b", "c" }
            .ConvertAll((x, i) => x + i) // Act
            .Should().Equal("a0", "b1", "c2");

    [Fact]
    public void Set_AsReadOnly_ShouldWrapGivenCollection()
    {
        var source = new HashSet<int> { 1, 2, 3 };
        source.AsReadOnly().Should().Equal(source);
    }
}
