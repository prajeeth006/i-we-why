using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using JetBrains.Annotations;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.Loading.Placeholders;

/// <summary>
/// Replaces all (client and server-side) placeholders in given string.
/// </summary>
internal interface IPlaceholderReplacer
{
    string Replace([NotNull] string str, IReadOnlyDictionary<TrimmedRequiredString, ClientEvaluationResult<object>> placeholders);
}

internal sealed class PlaceholderReplacer : IPlaceholderReplacer
{
    public const string ClientDslPrefix = "dsl:///";

    public string Replace(string str, IReadOnlyDictionary<TrimmedRequiredString, ClientEvaluationResult<object>> placeholders)
    {
        var actualPlaceholders = placeholders.Where(p => str.Contains(p.Key)).ToList();

        if (actualPlaceholders.Count == 0)
            return str;

        var replacedStr = new StringBuilder(str);
        var clientPlaceholders = new List<(string Original, string ClientExpression)>();

        // Directly do string replacement of final (server-side) placeholders
        foreach (var (original, replacement) in actualPlaceholders.Select(p => (p.Key, p.Value)))
            if (replacement.HasFinalValue)
                replacedStr.Replace(original, replacement.Value.ToString());
            else
                clientPlaceholders.Add((original, replacement.ClientExpression));

        if (clientPlaceholders.Count == 0)
            return replacedStr.ToString();

        // Replace client-side placeholders by creating expression concatenated from DSL with raw strings e.g. dsl:///'Hello ' + c.User.Name
        var chunks = new List<ClientEvaluationResult<string>> { ClientEvaluationResult<string>.FromValue(replacedStr.ToString()) };

        foreach (var placeholder in clientPlaceholders)
        {
            var chunkIndex = 0;

            while (chunkIndex < chunks.Count)
            {
                var processedChunk = chunks[chunkIndex].HasFinalValue ? chunks[chunkIndex].Value : "";
                var placeholderIndex = processedChunk.IndexOf(placeholder.Original, StringComparison.Ordinal);

                if (placeholderIndex < 0)
                {
                    chunkIndex++;

                    continue;
                }

                // Expand current chunk to: prefix + placeholder + suffix
                chunks.RemoveAt(chunkIndex);

                if (placeholderIndex > 0)
                {
                    var prefix = processedChunk.Substring(0, placeholderIndex);
                    chunks.Insert(chunkIndex, ClientEvaluationResult<string>.FromValue(prefix));
                    chunkIndex++;
                }

                chunks.Insert(chunkIndex, ClientEvaluationResult<string>.FromClientExpression(placeholder.ClientExpression));
                chunkIndex++;

                if (placeholderIndex + placeholder.Original.Length < processedChunk.Length)
                {
                    var suffix = processedChunk.Substring(placeholderIndex + placeholder.Original.Length);
                    chunks.Insert(chunkIndex, ClientEvaluationResult<string>.FromValue(suffix));
                    // Don't increase chunkIndex because suffix should be processed again
                }
            }
        }

        // Build full client expression including raw strings
        replacedStr.Clear();
        foreach (var chunk in chunks)
            replacedStr
                .Append(replacedStr.Length == 0 ? ClientDslPrefix : "+")
                .Append(chunk.HasFinalValue ? JsonConvert.ToString(chunk.Value, '\'') : chunk.ClientExpression);

        return replacedStr.ToString();
    }
}
