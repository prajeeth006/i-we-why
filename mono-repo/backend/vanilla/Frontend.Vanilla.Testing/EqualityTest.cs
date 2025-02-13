using System;
using System.Linq;
using FluentAssertions;
using FluentAssertions.Numeric;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Testing;

internal static class EqualityTest
{
    public static void Run<T>(bool expected, [CanBeNull] T arg1, [CanBeNull] T arg2)
        where T : IEquatable<T>
    {
        arg1?.Equals(arg2).Should().Be(expected);
        arg2?.Equals(arg1).Should().Be(expected);

        Run(expected, (object)arg1, arg2);
    }

    public static void Run(bool expected, [CanBeNull] object arg1, [CanBeNull] object arg2)
    {
        arg1?.Equals(arg2).Should().Be(expected);
        arg2?.Equals(arg1).Should().Be(expected);

        if (expected)
            (arg1?.GetHashCode()).Should().Be(arg2?.GetHashCode());
    }

    public static void RunWithOtherValues<T>([NotNull] T arg)
    {
        arg.Equals(null).Should().BeFalse();
        arg.Equals(new object()).Should().BeFalse();

        if (arg is IEquatable<T> equatable)
            equatable.Equals(null).Should().BeFalse();
    }

    public static void Run<T>(ComparisonResult expected, [CanBeNull] T arg1, [CanBeNull] T arg2)
        where T : IEquatable<T>, IComparable<T>
    {
        Run(expected == ComparisonResult.Equal, arg1, arg2);

        if (arg1 != null)
            arg1.CompareTo(arg2).Should().BeComparedAs(expected);

        if (arg1 is IComparable cmp1)
            cmp1.CompareTo(arg2).Should().BeComparedAs(expected);

        if (arg2 != null)
            arg2.CompareTo(arg1).Should().BeComparedAs(expected.Reverse());

        if (arg2 is IComparable cmp2)
            cmp2.CompareTo(arg1).Should().BeComparedAs(expected.Reverse());
    }

    public static void BeComparedAs(this NumericAssertions<int> assertions, ComparisonResult expected)
    {
        switch (expected)
        {
            case ComparisonResult.Greater:
                assertions.BeGreaterThan(0);

                break;
            case ComparisonResult.Less:
                assertions.BeLessThan(0);

                break;
            default:
                assertions.Be(0);

                break;
        }
    }

    public static ComparisonResult Reverse(this ComparisonResult result)
    {
        return (ComparisonResult)(-1 * (int)result);
    }

    public static void ExpectUniqueItems<T>(int expectedCount, params T[] allItems)
    {
        var uniqueItems = allItems.Distinct().ToList();

        if (uniqueItems.Count != expectedCount)
        {
            var msg = $"Expected {expectedCount} unique items but got these {uniqueItems.Count} items:\r\n\r\n";
            for (var i = 0; i < uniqueItems.Count; i++)
                msg += $"{i}. {uniqueItems[i]}\r\n";

            throw new Exception(msg);
        }
    }
}

internal enum ComparisonResult
{
    Equal = 0,
    Greater = 1,
    Less = -1,
}
