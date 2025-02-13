using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.ExceptionServices;
using System.Text;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Extension methods for an <see cref="Exception" />.
/// </summary>
internal static class ExceptionExtensions
{
    /// <summary>
    /// Constructs full error message including messages from inner exceptions.
    /// </summary>
    public static string GetMessageIncludingInner(this Exception exception)
    {
        if (exception.InnerException == null)
            return exception.Message; // Quick end

        var builder = new StringBuilder(exception.Message);

        while (exception.InnerException != null)
        {
            exception = exception.InnerException;
            builder.AppendLine();
            builder.Append("--> ");
            builder.Append(exception.Message);
        }

        return builder.ToString();
    }

    public static TException? ExtractInner<TException>(this Exception exception)
        where TException : Exception
        => exception.ExtractAllInner<TException>().FirstOrDefault();

    public static IEnumerable<TException> ExtractAllInner<TException>(this Exception exception)
        => exception switch
        {
            TException tex => new[] { tex },
            AggregateException aex => aex.InnerExceptions.SelectMany(ExtractAllInner<TException>),
            _ => (exception.InnerException?.ExtractAllInner<TException>()).NullToEmpty(),
        };

    internal static Exception RecreateExposingLoaderExceptions(this ReflectionTypeLoadException exception)
        => new AggregateException($"Reflection failed to load types: {exception.Types.Join()}. Created from: {exception}", exception.LoaderExceptions!);

    /// <summary>Returns dummy exception b/c ExceptionDispatchInfo.Throw is void.</summary>
    internal static Exception ThrowException(this ExceptionDispatchInfo exceptionInfo)
    {
        exceptionInfo.Throw();

        return new VanillaBugException();
    }
}
