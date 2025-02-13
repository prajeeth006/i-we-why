using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class TemporaryBufferTests
{
    private TemporaryBuffer<string> target;

    public TemporaryBufferTests()
        => target = new TemporaryBuffer<string>(3);

    [Fact]
    public void ShouldBeEmptyByDefault()
        => target.Should().BeEmpty();

    [Fact]
    public void ShouldSupportAddingItems()
    {
        target.Add("a");
        target.Add("b");

        target.Should().Equal("a", "b");
    }

    [Fact]
    public void ShouldDropItems_IfOverSize()
    {
        target.Add("a");
        target.Add("b");
        target.Add("c");
        target.Add("d");

        target.Should().Equal("b", "c", "d");
    }
}
