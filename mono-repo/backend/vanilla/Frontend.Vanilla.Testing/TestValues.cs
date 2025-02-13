#nullable enable

using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Testing;

internal static class TestValues
{
    public static bool[] Booleans => new[] { false, true };

    public static IEnumerable<object?[]> ToTestCases<T>(this IEnumerable<T> values)
        => values.Select(v => new object?[] { v });

    public static IEnumerable<object?[]> CombineWith<T>(this IEnumerable<object?[]> testCases, IEnumerable<T> values)
        => testCases.CombineWith(values.Cast<object?>().ToArray());

    public static IEnumerable<object?[]> CombineWith(this IEnumerable<object?[]> testCases, params object?[] values)
    {
        foreach (var testCase in testCases)
        foreach (var value in values)
            yield return testCase.Append(value).ToArray();
    }
}
