#nullable enable

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Placeholders;

/// <summary>
/// Collection of replaced strings. Supports null keys (original strings) in addition to regular <see cref="IDictionary{TKey,TValue}" />.
/// </summary>
public sealed class ReplacedStringMapping
{
    /// <summary>Gets underlying dictionary.</summary>
    public IReadOnlyDictionary<string, string> Strings { get; }

    /// <summary>Creates a new instance.</summary>
    public ReplacedStringMapping(IReadOnlyDictionary<string, string> strings)
        => Strings = Guard.NotNull(strings, nameof(strings));

    /// <summary>Gets replaced string for original one.</summary>
    [return: NotNullIfNotNull("originalString")]
    public string? Get(string? originalString)
        => originalString != null ? Strings[originalString] : null;
}
