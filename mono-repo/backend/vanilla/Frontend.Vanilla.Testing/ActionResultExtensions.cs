using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Vanilla.Testing;

#nullable enable

/// <summary>
///     Provides extension methods for easier testing of wrapped action results.
/// </summary>
public static class ActionResultExtensions
{
    /// <summary>
    ///     Gets the original <see cref="IActionResult" /> from a result extended with a subclass
    ///     of <see cref="ExtendResultBase" />. If the result has not been extended, just returns the
    ///     same result.
    /// </summary>
    /// <param name="result">The result to resolve nested results from.</param>
    /// <typeparam name="T">The expected type of the original result.</typeparam>
    /// <returns>The original result, or the same result if it hasn't been extended.</returns>
    public static T GetOriginalResult<T>(this IActionResult result)
        where T : IActionResult
    {
        return (T)result.GetOriginalResult();
    }

    /// <summary>
    ///     Gets the original <see cref="IActionResult" /> from a result extended with a subclass
    ///     of <see cref="ExtendResultBase" />. If the result has not been extended, just returns the
    ///     same result.
    /// </summary>
    /// <param name="result">The result to resolve nested results from.</param>
    /// <returns>The original result, or the same result if it hasn't been extended as dynamic.</returns>
    public static dynamic GetOriginalResult(this IActionResult result)
    {
        if (result is ExtendResultBase extendResult)
        {
            var firstResult = extendResult.InnerResult;

            while (firstResult is ExtendResultBase) firstResult = ((ExtendResultBase)firstResult).InnerResult;

            return firstResult;
        }

        return result;
    }

    /// <summary>
    ///     Returns all results in the chain created by nesting <see cref="ExtendResultBase" /> instances
    ///     that match the specified filter. Ordered from the original to outermost.
    /// </summary>
    /// <param name="result">The result to resolve nested results from.</param>
    /// <param name="filter">Predicate to filter the results.</param>
    /// <returns></returns>
    public static IReadOnlyList<dynamic> GetResults(this IActionResult result, Func<dynamic, bool>? filter = null)
    {
        var results = new List<dynamic>();
        filter ??= _ => true;

        var current = result;

        do
        {
            if (filter(current)) results.Add(current);

            var extend = current as ExtendResultBase;
            current = extend?.InnerResult;
        }
        while (current != null);

        results.Reverse();

        return results;
    }

    /// <summary>
    ///     Returns all results in the chain created by nesting <see cref="ExtendResultBase" /> instances
    ///     of the specified type. Ordered from the original to outermost.
    /// </summary>
    /// <param name="result">The result to resolve nested results from.</param>
    /// <typeparam name="T">The type of results to extract.</typeparam>
    /// <returns>All results of type <typeparamref name="T" />.</returns>
    public static IReadOnlyList<T> GetResultsOfType<T>(this IActionResult result)
        where T : IActionResult
    {
        return result.GetResults(i => i is T).Cast<T>().ToList();
    }

    // SPECIFIC

    /// <summary>
    ///     Gets all messages from all <see cref="MessageResult" />s from the <see cref="ExtendResultBase" /> chain.
    /// </summary>
    /// <param name="result">The result to resolve messages from.</param>
    /// <returns>All api messages from all results.</returns>
    public static IReadOnlyList<ApiMessage> GetMessages(this IActionResult result)
    {
        return result.GetResultsOfType<MessageResult>().SelectMany(r => r.Messages).ToList();
    }
}
