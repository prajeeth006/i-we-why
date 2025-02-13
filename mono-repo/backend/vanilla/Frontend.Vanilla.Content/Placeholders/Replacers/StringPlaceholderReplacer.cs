#nullable enable

using System.Collections.Generic;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="string" />.
/// </summary>
internal sealed class StringPlaceholderReplacer : FieldPlaceholderReplacer<string>
{
    protected override IEnumerable<string?> GetReplaceableStrings(string value)
        => new[] { value };

    protected override string Recreate(string value, ReplacedStringMapping replacedStrings)
        => replacedStrings.Get(value) ?? string.Empty;
}
