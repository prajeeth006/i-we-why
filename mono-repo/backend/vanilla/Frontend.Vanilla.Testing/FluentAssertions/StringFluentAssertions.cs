using System.Linq;
using FluentAssertions;
using FluentAssertions.Primitives;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class StringFluentAssertions
{
    public static AndConstraint<StringAssertions> ContainAll(this StringAssertions assertions, params object[] values)
        => assertions.ContainAll(values.Select(v => v.ToString()));
}
