#nullable enable

using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="IReadOnlyDictionary{K,T}" /> of string, string.
/// </summary>
internal sealed class ContentParametersPlaceholderReplacer : FieldPlaceholderReplacer<ContentParameters>
{
    protected override IEnumerable<string?> GetReplaceableStrings(ContentParameters collection)
        => collection.Values;

    protected override ContentParameters Recreate(ContentParameters collection, ReplacedStringMapping replacedStrings)
        => collection.ToDictionary(kv => kv.Key, kv => replacedStrings.Get(kv.Value)).AsContentParameters();
}
