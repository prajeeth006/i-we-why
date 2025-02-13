using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Moq.Language;
using Moq.Language.Flow;

namespace Frontend.Vanilla.Testing.Moq;

internal static class EmptyReadOnlyListExtensions
{
    public static IReturnsResult<TMock> ReturnsEmpty<TMock, TItem>(this IReturns<TMock, IReadOnlyList<TItem>> mock)
        where TMock : class
        => mock.Returns(Array.Empty<TItem>());

    public static IReturnsResult<TMock> ReturnsEmpty<TMock, TItem>(this IReturnsGetter<TMock, IReadOnlyList<TItem>> mock)
        where TMock : class
        => mock.Returns(Array.Empty<TItem>());
}

internal static class EmptyReadOnlyDictionaryExtensions
{
    public static IReturnsResult<TMock> ReturnsEmpty<TMock, TKey, TValue>(this IReturns<TMock, IReadOnlyDictionary<TKey, TValue>> mock)
        where TMock : class
        => mock.Returns(EmptyDictionary<TKey, TValue>.Singleton);

    public static IReturnsResult<TMock> ReturnsEmpty<TMock, TKey, TValue>(this IReturnsGetter<TMock, IReadOnlyDictionary<TKey, TValue>> mock)
        where TMock : class
        => mock.Returns(EmptyDictionary<TKey, TValue>.Singleton);
}
