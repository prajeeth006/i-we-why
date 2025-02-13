using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class EnumerableExtensionsTests
{
    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { null },
        [StringComparison.OrdinalIgnoreCase],
    };

    public static IEnumerable<object[]> JsonTestCases()
    {
        yield return
        [
            "(empty)",
            Array.Empty<int>(),
        ];
        yield return
        [
            "123",
            new[] { 123 },
        ];
        yield return
        [
            $"1) 666{Environment.NewLine}2) 667{Environment.NewLine}3) 668",
            new[] { 666, 667, 668 },
        ];
    }

    [Fact]
    public void ToDictionary_ShouldThrow_IfKeyConflict()
    {
        var items = new[] { "ax", "bc", "ayz" };

        Action act = () => items.ToDictionary(i => i[0], i => i.Length);

        act.Should().Throw<ArgumentException>()
            .Where(e => e.Message.StartsWith("An item with the same key has already been added. Key: a"));
    }

    [Fact]
    public void Each_Test()
    {
        var enumerable = new[] { 1, 2, 3 };
        var called = new List<int>();

        // Act
        enumerable.Each(called.Add);

        called.Should().Equal(1, 2, 3);
    }

    [Fact]
    public void EachWithIndex_Test()
    {
        var enumerable = new[] { "a", "b", "c" };
        var called = new List<(string, int)>();

        // Act
        enumerable.Each((e, i) => called.Add((e, i)));

        called.Should().Equal(("a", 0), ("b", 1), ("c", 2));
    }

    [Fact]
    public void Distinct()
    {
        var enumerable = new[] { "a", "bb", "ccc", "dd", "e" };

        var distinct = enumerable.Distinct(s => s.Length); // Act

        distinct.Should().Equal("a", "bb", "ccc");
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public void NullToEmpty_ShouldReturnOriginalOneIfNotNull(bool enumerableOrList, bool emptyOrNot)
    {
        var collection = emptyOrNot ? Array.Empty<string>() : new[] { "BWIN" };

        // Act
        var result = enumerableOrList
            ? ((IEnumerable<string>)collection).NullToEmpty()
            : collection.NullToEmpty();

        result.Should().BeSameAs(collection);
    }

    public static readonly IEnumerable<object[]> TestComparers = new[]
    {
        new object[] { false, null },
        new object[] { true, null },
        new object[] { false, StringComparer.Ordinal },
        new object[] { true, StringComparer.Ordinal },
        new object[] { false, StringComparer.InvariantCulture },
        new object[] { true, StringComparer.InvariantCulture },
    };

    [Theory]
    [MemberData(nameof(TestComparers))]
    public void ToDictionary_ShouldCreateDictionaryFromPairs(bool userListOfPairs, IEqualityComparer<string> comparer)
    {
        var original = new Dictionary<string, string>
        {
            { "key 1", "val 1" },
            { "key 2", "val 2" },
        };
        var pairs = userListOfPairs ? (IEnumerable<KeyValuePair<string, string>>)original.ToList() : original;

        var result = EnumerableExtensions.ToDictionary(pairs, comparer); // Act

        result.Should().Equal(original);
        result.Comparer.Should().BeSameAs(comparer ?? EqualityComparer<string>.Default);
    }

    [Theory, MemberData(nameof(TestComparers))]
    public void ToDictionary_ShouldCreateDictionaryFromTuples(bool dummy, IEqualityComparer<string> comparer)
    {
        var dummy2 = dummy;
        var tuples = new[]
        {
            ("key 1", "val 1"),
            ("key 2", "val 2"),
        };

        var result = EnumerableExtensions.ToDictionary(tuples, comparer); // Act

        result.Should().Equal(new Dictionary<string, string>
        {
            { "key 1", "val 1" },
            { "key 2", "val 2" },
        });
        result.Comparer.Should().BeSameAs(comparer ?? EqualityComparer<string>.Default);
    }

    [Fact]
    public void Join_ShouldCreateJoinedString()
        => new[] { 1, 2, 3 }.Join("|").Should().Be("1|2|3");

    [Fact]
    public void Join_ShouldCreateJoinedStringWithDefaultSeparator()
        => new[] { 1, 2, 3 }.Join().Should().Be("1, 2, 3");

    [Fact]
    public void Concat_Test()
        => new[] { 1, 2 }.Append(3, 4).Should().Equal(1, 2, 3, 4);

    [Fact]
    public void Except_Test()
        => new[] { 1, 2, 3, 4, 5 }.Except(2, 4).Should().Equal(1, 3, 5);

    [Theory]
    [MemberData(nameof(TestComparers))]
    public void ToHashSet_Test(bool dummy, IEqualityComparer<string> comparer)
    {
        var d = dummy;
        var items = new[] { "a", "b" };

        var result = items.ToHashSet(comparer); // Act

        result.Should().Equal(items);
        result.Comparer.Should().BeSameAs(comparer ?? EqualityComparer<string>.Default);
    }

    [Theory]
    [InlineData(null, true)]
    [InlineData(new int[0], true)]
    [InlineData(new[] { 1 }, false)]
    public void IsNullOrEmpty_Test(IEnumerable<int> enumerable, bool expected)
        => enumerable.IsNullOrEmpty().Should().Be(expected);

    [Theory]
    [MemberData(nameof(JsonTestCases))]
    public void ToDebugString_ShouldNicelyFormatItems(string expected, int[] items)
        => items.ToDebugString().Should().Be(expected);
}
