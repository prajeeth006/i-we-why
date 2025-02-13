using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public sealed class RequiredStringComparerTests
{
    [Theory]
    [InlineData("Bwin", "Bwin", ComparisonResult.Equal)]
    [InlineData("BWIN", "bwin", ComparisonResult.Equal)]
    [InlineData("Bwin", "other", ComparisonResult.Less)]
    [InlineData("Bwin", null, ComparisonResult.Greater)]
    [InlineData(null, null, ComparisonResult.Equal)]
    internal void ShouldCalculateEqualityIgnoringCase(string first, string second, ComparisonResult expected)
    {
        var target = RequiredStringComparer.OrdinalIgnoreCase;
        var firstStr = first != null ? (RequiredString)first : null;
        var secondStr = second != null ? (RequiredString)second : null;

        // IEqualityComparer.Equals
        target.Equals(firstStr, secondStr).Should().Be(expected == ComparisonResult.Equal);
        target.Equals(secondStr, firstStr).Should().Be(expected == ComparisonResult.Equal);

        // IEqualityComparer.GetHashCode
        if (expected == ComparisonResult.Equal && firstStr != null && secondStr != null)
        {
            var firstHash = target.GetHashCode(firstStr);
            var secondHash = target.GetHashCode(secondStr);
            firstHash.Should().Be(secondHash);
        }

        // IComparer.Compare
        target.Compare(firstStr, secondStr).Should().BeComparedAs(expected);
        target.Compare(secondStr, firstStr).Should().BeComparedAs(expected.Reverse());
    }
}
