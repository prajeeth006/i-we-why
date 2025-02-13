using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Generic convenience extension methods for safe code execution.
/// </summary>
public static class TryObjectExtensions
{
    internal const string LogMessage = "Failed to retrieve the value.";

    /// <summary>
    /// Calls <paramref name="getValue" /> on <paramref name="service" />.
    /// If it fails then the exception is written to <paramref name="log" /> and default value of <typeparamref name="TResult" /> is returned.
    /// Parameter <paramref name="dummy" /> is necessary for compiler to distinguish this frim async overload.
    /// </summary>
    [return: MaybeNull]
    public static TResult Try<TService, TResult>(this TService service, Func<TService, TResult> getValue, ILogger log, Action? dummy = null)
    {
        Guard.Requires(typeof(TResult), t => !typeof(Task).IsAssignableFrom(t), nameof(TResult), "Use " + nameof(TryAsync) + "() for operations returning a Task.");
        Guard.NotNull(getValue, nameof(getValue));
        Guard.NotNull(log, nameof(log));

        try
        {
            return getValue(service);
        }
        catch (Exception ex)
        {
            log.LogError(ex, LogMessage);

            return default!;
        }
    }

    /// <summary>
    /// Asynchronously calls <paramref name="getValueAsync" /> on <paramref name="service" />.
    /// If it fails then the exception is written to <paramref name="log" /> and <paramref name="failedResult" /> is returned.
    /// </summary>
    public static async Task<TResult> TryAsync<TService, TResult>(
        this TService service,
        Func<TService, Task<TResult>> getValueAsync,
        ILogger log,
        TResult failedResult = default!)
    {
        Guard.NotNull(getValueAsync, nameof(getValueAsync));
        Guard.NotNull(log, nameof(log));

        try
        {
            return await getValueAsync(service);
        }
        catch (Exception ex)
        {
            log.LogError(ex, LogMessage);
#pragma warning disable CS8603 // Possible null reference return.
            return failedResult;
#pragma warning restore CS8603 // Possible null reference return.
        }
    }

    /// <summary>
    /// Asynchronously calls <paramref name="getValueAsync" /> on <paramref name="service" />.
    /// If it fails then the exception is written to <paramref name="log" /> and <see langword="null" /> is returned.
    /// </summary>
    public static Task<TResult?> TryAsync<TService, TResult>(this TService service, Func<TService, Task<TResult>> getValueAsync, ILogger log)
        where TResult : class
#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.
        => service.TryAsync((Func<TService, Task<TResult?>>)getValueAsync, log, failedResult: null);
#pragma warning restore CS8619 // Nullability of reference types in value doesn't match target type.
}
