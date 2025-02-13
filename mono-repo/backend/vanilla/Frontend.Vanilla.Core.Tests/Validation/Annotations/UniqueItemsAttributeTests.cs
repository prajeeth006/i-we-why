using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public sealed class UniqueItemsAttributeTests
{
    private ValidationAttributeBase target = new UniqueItemsAttribute();

    public static IEnumerable<object[]> UniqueItemsTestCases()
    {
        yield return new object[]
        {
            new[] { 1, 2, 3 },
            null,
        };
        yield return new object[]
        {
            new[] { 1, 2, 3, 2 },
            "must contain unique items but there are duplicates: [2, 2]",
        };
        yield return new object[]
        {
            new[] { 1, 2, 3, 3, 4, 2 },
            $"must contain unique items but there are duplicates: 1) [2, 2]{Environment.NewLine}2) [3, 3]",
        };
    }

    [Theory]
    [MemberData(nameof(UniqueItemsTestCases))]
    public void ShouldDetectDuplicates(object items, string expectedReason)
        => target.GetInvalidReason(items).Should().Be(expectedReason);

    [Theory]
    [InlineData(new[] { "a", "b", "c" }, StringComparison.Ordinal, null)]
    [InlineData(new[] { "a", "A" }, StringComparison.Ordinal, null)]
    [InlineData(new[] { "a", "b", "c", "A", "c" },
        StringComparison.Ordinal,
        "must contain unique strings according to Ordinal comparison but there are duplicates: ['c', 'c']")]
    [InlineData(new[] { "a", "b", "A" },
        StringComparison.OrdinalIgnoreCase,
        "must contain unique strings according to OrdinalIgnoreCase comparison but there are duplicates: ['a', 'A']")]
    public void ShouldDetectStringDuplicates(IEnumerable<string> items, StringComparison comparison, string expectedMessage)
    {
        target = new UniqueItemsAttribute(comparison);
        target.GetInvalidReason(items).Should().Be(expectedMessage);
    }

    [Theory]
    [InlineData(new[] { 1, 2, 3 })]
    public void ShouldThrow_IfNotStrings_ButComparisonIsSpecified(object items)
    {
        target = new UniqueItemsAttribute(StringComparison.Ordinal);

        Action act = () => target.GetInvalidReason(items);

        act.Should().Throw().WithMessage(
            $"It doesn't make sense to put {typeof(UniqueItemsAttribute)}"
            + " with StringComparison.Ordinal on value System.Int32[] because its item is System.Int32 instead of expected System.String.");
    }
}
