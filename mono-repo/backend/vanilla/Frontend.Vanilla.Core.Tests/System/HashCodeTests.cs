using System;
using System.Linq;
using FluentAssertions;
using Xunit;
using HashCode = Frontend.Vanilla.Core.System.HashCode;

namespace Frontend.Vanilla.Core.Tests.System;

public class HashCodeTests
{
    [Fact]
    public void Combine_2Args_ShouldCalculateCorrectly()
    {
        var arg1 = 123;
        var arg2 = "bwin";

        var result = HashCode.Combine(arg1, arg2); // Act

        Verify(result, arg1, arg2);
    }

    [Fact]
    public void Combine_3Args_ShouldCalculateCorrectly()
    {
        var arg1 = 123;
        var arg2 = "bwin";
        var arg3 = DateTime.Now;

        var result = HashCode.Combine(arg1, arg2, arg3); // Act

        Verify(result, arg1, arg2, arg3);
    }

    [Fact]
    public void Combine_Items_ShouldCombineAllTogether()
    {
        var items = new[] { 111, 222 };

        var result = HashCode.Combine(items); // Act

        Verify(result, 111, 222);
    }

    [Fact]
    public void CombineIgnoreOrder_ShouldIgnoreOrder()
    {
        // Act
        var result1 = HashCode.CombineIgnoreOrder(1, 66);
        var result2 = HashCode.CombineIgnoreOrder(66, 1);

        Verify(result1, 1, 66);
        result2.Should().Be(result1);
    }

    [Fact]
    public void CombineIgnoreOrder_Items_ShouldIgnoreOrder()
    {
        // Act
        var result1 = HashCode.CombineIgnoreOrder(new[] { 1, 66, 9999 });
        var result2 = HashCode.CombineIgnoreOrder(new[] { 66, 1, 9999 });
        var result3 = HashCode.CombineIgnoreOrder(new[] { 9999, 1, 66 });

        Verify(result1, 1, 66, 9999);
        result2.Should().Be(result1);
        result3.Should().Be(result1);
    }

    private static void Verify(int result, params object[] combinedObjs)
    {
        var unexpectedValues = combinedObjs.Select(o => o.GetHashCode()).Append(0);
        unexpectedValues.Should().NotContain(result);
    }
}
