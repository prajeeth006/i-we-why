using System;
using FluentAssertions;
using FluentAssertions.Primitives;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class CommonFluentAssertions
{
    public static AndConstraint<DateTimeAssertions> BeInRange(this DateTimeAssertions assertions, DateTime minimum, DateTime maximum)
    {
        return assertions.BeOnOrAfter(minimum).And.BeOnOrBefore(maximum);
    }
}
