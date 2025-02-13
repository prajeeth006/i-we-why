using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class DuplicateFindingExtensionsTests
{
    [Fact]
    public void FindDuplicatesBy_ShouldReturnAllDuplicates()
    {
        var values = new[] { (1, "a"), (2, "A"), (3, "a"), (4, "b"), (5, "c"), (6, "b"), (7, "d") };

        var duplicates = values.FindDuplicatesBy(s => s.Item2).ToList(); // Act

        duplicates.Count.Should().Be(2);
        duplicates[0].Key.Should().Be("a");
        duplicates[0].Should().Equal((1, "a"), (3, "a"));
        duplicates[1].Key.Should().Be("b");
        duplicates[1].Should().Equal((4, "b"), (6, "b"));
    }

    [Fact]
    public void FindDuplicatesBy_ShouldUseComparer()
    {
        var values = new[] { (1, "a"), (2, "A"), (3, "a"), (4, "b"), (5, "c") };

        var duplicates = values.FindDuplicatesBy(s => s.Item2, StringComparer.OrdinalIgnoreCase).ToList(); // Act

        duplicates.Count.Should().Be(1);
        duplicates[0].Key.Should().Be("a");
        duplicates[0].Should().Equal((1, "a"), (2, "A"), (3, "a"));
    }

    [Fact]
    public void FindDuplicatesBy_ShouldReturnEmpty_IfNoDuplicates()
    {
        var values = new[] { (1, "a"), (2, "b") };

        var duplicates = values.FindDuplicatesBy(s => s.Item2); // Act

        duplicates.Should().BeEmpty();
    }

    [Fact]
    public void TryFindDuplicateBy_ShouldReturnFirstDuplicate()
    {
        var values = new[] { (1, "a"), (2, "A"), (3, "a"), (4, "b"), (5, "c"), (6, "b"), (7, "d") };

        var hasDuplicate = values.TryFindDuplicateBy(s => s.Item2, out var duplicate); // Act

        hasDuplicate.Should().BeTrue();
        duplicate.Key.Should().Be("a");
        duplicate.Should().Equal((1, "a"), (3, "a"));
    }

    [Fact]
    public void TryFindDuplicateBy_ShouldUseComparer()
    {
        var values = new[] { (1, "a"), (2, "A"), (3, "a"), (4, "b"), (5, "c"), (6, "b"), (7, "d") };

        var hasDuplicate = values.TryFindDuplicateBy(s => s.Item2, out var duplicate, StringComparer.OrdinalIgnoreCase); // Act

        hasDuplicate.Should().BeTrue();
        duplicate.Key.Should().Be("a");
        duplicate.Should().Equal((1, "a"), (2, "A"), (3, "a"));
    }

    [Fact]
    public void TryFindDuplicateBy_ShouldReturnNull_IfNoDuplicate()
    {
        var values = new[] { "a", "ab" };

        var hasDuplicate = values.TryFindDuplicateBy(s => s.Length, out var duplicate); // Act

        hasDuplicate.Should().BeFalse();
        duplicate.Should().BeNull();
    }

    [Fact]
    public void FindDuplicates_ShouldReturnAllDuplicates()
    {
        var values = new[] { "a", "b", "c", "d", "b", "d", "e", "A", "C" };
        values.FindDuplicates().Should().Equal("b", "d"); // Act
    }

    [Fact]
    public void FindDuplicates_ShouldUseComparer()
    {
        var values = new[] { "a", "b", "c", "d", "b", "d", "e", "A", "C" };
        values.FindDuplicates(StringComparer.OrdinalIgnoreCase).Should().Equal("a", "b", "c", "d"); // Act
    }

    [Fact]
    public void CheckNoDuplicatesBy_ShouldThrow_IfDuplicateFound()
    {
        var values = new[] { (1, "a"), (2, "A"), (3, "a"), (4, "b"), (5, "c"), (6, "b"), (7, "d") };

        Action act = () => values.CheckNoDuplicatesBy(s => s.Item2);

        act.Should().Throw<DuplicateException>()
            .WithMessage(
                "Items of type System.ValueTuple`2[System.Int32,System.String] must be unique according to expression s => s.Item2 but value 'a' is used by: (1, a) vs. (3, a).")
            .And.ConflictingValue.Should().Be("a");
    }

    [Fact]
    public void CheckNoDuplicatesBy_ShouldUseComparer()
    {
        var values = new[] { (1, "a"), (2, "A") };

        Action act = () => values.CheckNoDuplicatesBy(s => s.Item2, StringComparer.OrdinalIgnoreCase);

        act.Should().Throw<DuplicateException>().Which.ConflictingValue.Should().Be("a");
    }

    [Fact]
    public void CheckNoDuplicatesBy_ShouldPass_IfNoDuplicates()
        => new[] { (1, "a"), (2, "b"), (3, "c") }.CheckNoDuplicatesBy(s => s.Item2);
}
