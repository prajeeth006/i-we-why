using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Logic for finding and replacing placeholders on string level.
/// </summary>
public interface IPlaceholderCompiler
{
    /// <summary>
    /// Finds and compiles all placeholders in given string.
    /// When evaluating DSL expressions, keep in mind that particular one can be used in multiple placeholders
    /// e.g. because of white-spaces _|User.LoginName|_ vs. _| User.LoginName |_. So evaluate it only once.
    /// </summary>
    /// <exception cref="Exception">Invalid syntax within placeholders or placeholders not delimited correctly.</exception>
    WithWarnings<IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>>> FindPlaceholders(RequiredString str);
}

internal sealed class PlaceholderCompiler(IDslCompiler dslCompiler) : IPlaceholderCompiler
{
    public const string OpeningDelimiter = "_|";
    public const string ClosingDelimiter = "|_";
    private const StringComparison Comparison = StringComparison.Ordinal;

    public WithWarnings<IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>>> FindPlaceholders(RequiredString str)
    {
        Guard.NotNull(str, nameof(str));

        if (!str.Value.Contains(OpeningDelimiter, Comparison))
            return EmptyDictionary<TrimmedRequiredString, IDslExpression<object>>.Singleton;

        var placeholders = new Dictionary<TrimmedRequiredString, IDslExpression<object>>();
        var warnings = new List<TrimmedRequiredString>();
        var searchFrom = 0;

        while (searchFrom < str.Value.Length)
        {
            // Hello _|User.Name|_, how are you?
            //       |          └ closingIndex
            //       └ openingIndex
            var openingIndex = str.Value.IndexOf(OpeningDelimiter, searchFrom, Comparison);

            if (openingIndex < 0)
                break; // No more placeholders

            var closingIndex = str.Value.IndexOf(ClosingDelimiter, openingIndex + OpeningDelimiter.Length, Comparison);

            if (closingIndex < 0)
                throw GetException("Found unclosed placeholder");

            TrimmedRequiredString matchedStr = str.Value.Substring(openingIndex, closingIndex + ClosingDelimiter.Length - openingIndex);
            var expressionStr =
                RequiredString.TryCreate(matchedStr.Value.Substring(OpeningDelimiter.Length, matchedStr.Value.Length - OpeningDelimiter.Length - ClosingDelimiter.Length))
                ?? throw GetException("Found empty (hence invalid) placeholder");
            searchFrom = closingIndex + ClosingDelimiter.Length;

            if (!placeholders.ContainsKey(matchedStr))
            {
                var (dslExpression, expressionWarnings) = dslCompiler.Compile<object>(expressionStr);
                placeholders.Add(matchedStr, dslExpression);
                warnings.Add(expressionWarnings.ConvertAll(w => new TrimmedRequiredString(matchedStr + " - " + w)));
            }

            Exception GetException(string reason)
                => new Exception($"{reason} at position {openingIndex} with text '{str.Value.SubstringMax(openingIndex, 50)}'.");
        }

        return placeholders.WithWarnings<IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>>>(warnings);
    }
}
