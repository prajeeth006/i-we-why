using System;
using System.Collections.Concurrent;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>
/// Resolves request scoped Items.
/// Registered as Scoped service and retrieved from current HttpContext services in the caller.
/// Using Lazy to avoid early execution of the factory method, executing only when ConcurrentDictionary adds the value.
/// https://andrewlock.net/making-getoradd-on-concurrentdictionary-thread-safe-using-lazy/.
/// </summary>
internal interface IRequestScopedValuesProvider
{
    ConcurrentDictionary<object, Lazy<object?>> Items { get; }

    TValue GetOrAddValue<TKey, TValue>(TKey key, Func<TKey, TValue?> valueFactory)
        where TKey : notnull
        where TValue : notnull;
}

internal sealed class RequestScopedValuesProvider : IRequestScopedValuesProvider
{
    public ConcurrentDictionary<object, Lazy<object?>> Items { get; } = new ();

    public TValue GetOrAddValue<TKey, TValue>(TKey key, Func<TKey, TValue?> factory)
        where TKey : notnull
        where TValue : notnull
        => GetOrAddValueInternal(key, factory, arg: key);

    private TValue GetOrAddValueInternal<TValue, TArgument>(object key, Func<TArgument, TValue?> factory, TArgument arg)
        where TValue : notnull
    {
        var rawValue = GetOrAddLazyValue(key, factory, arg);

        return CastValue<TValue>(rawValue, key);
      }

    private object? GetOrAddLazyValue<TArgument, TCreated>(object key, Func<TArgument, TCreated> factory, TArgument arg)
    {
        // Create a Lazy object to ensure the factory is only executed once in a thread-safe way.
        return Items.GetOrAdd(key, new Lazy<object?>(() => factory(arg), true)).Value;
    }

    private static TValue CastValue<TValue>(object? rawValue, object key)
        where TValue : notnull
    {
        if (rawValue is TValue value)
        {
            return value;
        }

        throw new Exception($"Unexpected {(rawValue?.GetType()).Dump()} value found in the dictionary instead of {typeof(TValue)} for key {key.Dump()}. Most likely someone overwrote it or broke nullable.");
    }
}
