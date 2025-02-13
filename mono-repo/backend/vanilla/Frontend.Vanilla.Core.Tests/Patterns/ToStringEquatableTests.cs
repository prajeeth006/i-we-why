using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Patterns;

public sealed class ToStringEquatableTests
{
    [Theory]
    [InlineData("Test", ComparisonResult.Equal)]
    [InlineData("teST", ComparisonResult.Less)]
    [InlineData("Other", ComparisonResult.Greater)]
    [InlineData("ZZZ", ComparisonResult.Less)]
    [InlineData("", ComparisonResult.Greater)]
    internal void EqualsAndCompareTo_ShouldCalculateCorrectly(string other, ComparisonResult expected)
    {
        var s1 = new SimpleEquatable { ToStringValue = "Test" };
        var s2 = new SimpleEquatable { ToStringValue = other };

        EqualityTest.Run(expected, s1, s2);
    }

    [Theory]
    [InlineData("Test", ComparisonResult.Equal)]
    [InlineData("teST", ComparisonResult.Equal)]
    internal void EqualsAndCompareTo_ShouldCalculateCorrectly_IfCaseInsensitive(string other, ComparisonResult expected)
    {
        var s1 = new CaseInsensitiveEquatable { Value = "Test" };
        var s2 = new CaseInsensitiveEquatable { Value = other };

        EqualityTest.Run(expected, s1, s2);
    }

    [Fact]
    public void Equals_ShouldReturnFalse_IfOtherValues()
        => EqualityTest.RunWithOtherValues(new SimpleEquatable());

    [Fact]
    public void CompareTo_ShouldThrow_IfOtherType()
    {
        var target = new SimpleEquatable();
        Action act = () => target.CompareTo("lol");
        act.Should().Throw().WithMessage("Unable to cast object of type 'System.String' to type 'SimpleEquatable'.");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void CompareTo_ShouldAllowNull(bool runTypedTest)
    {
        var target = new SimpleEquatable();

        // Act
        var result = runTypedTest
            ? target.CompareTo(null)
            : target.CompareTo((object)null);

        result.Should().BeGreaterThan(0);
    }

    [Fact]
    public void Comparison_ShouldBeSetCorrectly()
    {
        // Create instance in order to execute static constructor
        new SimpleEquatable();
        new CaseInsensitiveEquatable();

        SimpleEquatable.Comparison.Should().Be(StringComparison.Ordinal);
        CaseInsensitiveEquatable.Comparison.Should().Be(StringComparison.OrdinalIgnoreCase);
    }

    private class SimpleEquatable : ToStringEquatable<SimpleEquatable>
    {
        public string ToStringValue { get; set; } = "Test";
        public override string ToString() => ToStringValue;
    }

    private class CaseInsensitiveEquatable : ToStringEquatable<CaseInsensitiveEquatable>
    {
        static CaseInsensitiveEquatable()
            => Comparison = StringComparison.OrdinalIgnoreCase;

        public string Value { get; set; }
        public override string ToString() => Value;
    }
}
