using System.Text;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public sealed class StringBuilderExtensionsTests
{
    [Theory]
    [InlineData(0, 3)]
    [InlineData(3, 3)]
    [InlineData(4, 9)]
    [InlineData(10, -1)]
    public void IndexOf_Test(int startIndex, int expected)
    {
        var sb = new StringBuilder("ee ab cd ab xy");
        sb.IndexOf("ab", startIndex).Should().Be(expected);
    }
}
