#nullable enable

using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Content.Placeholders.Replacers;

/// <summary>
/// Replaces content placeholders in fields of type <see cref="Uri" />.
/// </summary>
internal sealed class UriPlaceholderReplacer : FieldPlaceholderReplacer<Uri>
{
    protected override IEnumerable<string?> GetReplaceableStrings(Uri uri)
        => new[] { uri.OriginalString };

    protected override Uri Recreate(Uri uri, ReplacedStringMapping replacedStrings)
        => new (replacedStrings.Get(uri.OriginalString), UriKind.RelativeOrAbsolute);
}
