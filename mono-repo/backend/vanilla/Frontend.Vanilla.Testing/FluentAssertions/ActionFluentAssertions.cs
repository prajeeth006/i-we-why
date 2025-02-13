using System;
using FluentAssertions.Specialized;

namespace Frontend.Vanilla.Testing.FluentAssertions;

/// <summary>
///     Brings fluent assertions of <see cref="Action" /> to <see cref="Func{TResult}" />.
/// </summary>
internal static class ActionFluentAssertions
{
    public static ExceptionAssertions<Exception> Throw(this ActionAssertions assertions, string because = "")
        => assertions.Throw<Exception>(because);

    public static ExceptionAssertions<Exception> Throw<T>(this FunctionAssertions<T> assertions, string because = "")
        => assertions.Throw<Exception>(because);
}
