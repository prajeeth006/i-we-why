using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation;

public sealed class ValidationResultComparerTests
{
    private static readonly IEqualityComparer<ValidationResult> Target = new ValidationResultComparer();

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData("error msg")]
    public void ShouldBeEqualWithoutMembers(string message)
        => RunEqualityTest(true, new ValidationResult(message), new ValidationResult(message));

    [Fact]
    public void ShouldBeEqualWithMembers()
        => RunEqualityTest(
            true,
            new ValidationResult("msg", new[] { "Prop1", "Prop2" }),
            new ValidationResult("msg", new[] { "Prop1", "Prop2" }));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData("error msg")]
    public void ShouldDifferWithoutMembers(string message)
        => RunEqualityTest(false, new ValidationResult("different msg"), new ValidationResult(message));

    [Fact]
    public void ShouldDifferWithMembers()
        => RunEqualityTest(
            false,
            new ValidationResult("msg", new[] { "Prop1", "Prop2" }),
            new ValidationResult("msg", new[] { "Prop1", "OtherProp" }));

    private void RunEqualityTest(bool expected, ValidationResult result1, ValidationResult result2)
    {
        Target.Equals(result1, result2).Should().Be(expected);

        if (expected)
            Target.GetHashCode(result1).Should().Be(Target.GetHashCode(result2));
    }
}
