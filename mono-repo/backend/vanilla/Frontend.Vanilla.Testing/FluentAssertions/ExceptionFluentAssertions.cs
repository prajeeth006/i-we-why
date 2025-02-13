using System;
using FluentAssertions;
using FluentAssertions.Specialized;

namespace Frontend.Vanilla.Testing.FluentAssertions;

/// <summary>
///     Additional fluent assertions for exceptions.
/// </summary>
internal static class ExceptionFluentAssertions
{
    // Shortens syntax
    public static void SameAs<TException>(this ExceptionAssertions<TException> assertions, Exception expected)
        where TException : Exception
    {
        assertions.Which.Should().BeSameAs(expected);
    }

    public static ExceptionAssertions<TException> WithInnerMessage<TException>(this ExceptionAssertions<TException> assertions, string expectedInnerExceptionMessage)
        where TException : Exception
    {
        (assertions.Which.InnerException?.Message).Should().Be(expectedInnerExceptionMessage);

        return assertions;
    }
}
